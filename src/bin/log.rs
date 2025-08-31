#![feature(read_buf)]

use anyhow::Result;
use crossterm::{
    event::{self, Event as CEvent, EventStream, KeyCode, KeyEvent},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use futures::{future::FutureExt, select, StreamExt, TryStreamExt};
use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Read, Seek, SeekFrom, Write};
use std::os::unix::fs::{FileExt, MetadataExt};
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::SeqCst;
use std::{collections::VecDeque, process::exit};
use surrealdb::engine::remote;
use surrealdb::{self, Surreal};
use tokio::{io::stdin, signal};
use tracing_subscriber::util::SubscriberInitExt;
use xml::{self, Element};

use indicatif::{HumanDuration, MultiProgress, ProgressBar, ProgressStyle};

const PATH: &str = "/b/DrugBank.xml";
const STATE_PATH: &str = "./state";
const BUFSIZE: usize = 2600;
static EXIT: AtomicBool = AtomicBool::new(false);

#[derive(Deserialize)]
struct Drugs;

use tracing::{self, info, level_filters::LevelFilter, warn};
use tracing_subscriber;

#[tokio::main]
async fn main() -> Result<()> {
    let subscriber = tracing_subscriber::fmt()
        .compact()
        .with_max_level(LevelFilter::TRACE)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    info!("log enbaled");
    let mut kev = EventStream::new();

    tokio::spawn(async {
        signal::ctrl_c().await?;
        println!("Received exit signal");

        exit(0);

        EXIT.store(true, SeqCst);
        Result::<(), anyhow::Error>::Ok(())
    });
    let fd = File::open(PATH)?;
    let size = fd.metadata()?.size();
    let mut rd = BufReader::new(fd);

    let mut state = OpenOptions::new()
        .write(true)
        .read(true)
        .create(true)
        .open(STATE_PATH)?;
    let mut last_state = String::with_capacity(20);
    state.read_to_string(&mut last_state)?;
    let last_pos: u64 = last_state.parse().unwrap_or(0);
    info!("start from {}", last_pos);
    rd.seek(SeekFrom::Start(last_pos))?; // skip this many bytes
    let mut parser = xml::Parser::new();
    let mut eb = xml::ElementBuilder::new();
    let mut found = 0;
    let mut eof = false;

    let mut buf = String::with_capacity(BUFSIZE);
    'out: loop {
        buf.clear();
        while buf.len() < BUFSIZE {
            if rd.read_line(&mut buf)? == 0 {
                break 'out;
            }
        }
        parser.feed_str(&buf);
        for ev in &mut parser {
            let (ev, pos) = ev?;
            let x = eb.handle_event(ev);
            if let Some(el) = x {
                found += 1;
                let el = el?;
                let mut json = serde_json::to_string_pretty(&el)?;
                
                let cpos = last_pos + pos.done_utf8;
                state.write_at(cpos.to_string().as_bytes(), 0)?;

                loop {
                    info!("found {}", found);
                    if let Some(Ok(e)) = kev.next().await {
                        if EXIT.load(SeqCst) {
                            break 'out;
                        }
                        match e {
                            crossterm::event::Event::Key(kv) => match kv.code {
                                KeyCode::Enter => break,
                                _ => (),
                            },
                            _ => (),
                        }
                    }
                }
            }
            if EXIT.load(SeqCst) {
                break 'out;
            }
        }
    }

    Ok(())
}
