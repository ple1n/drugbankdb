#![feature(read_buf)]

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Read, Seek, SeekFrom, Write};
use std::os::unix::fs::{FileExt, MetadataExt};
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering::SeqCst;
use surrealdb::engine::remote;
use surrealdb::{self, Surreal};
use tokio::signal;
use xml::{self, Element};

use indicatif::{HumanDuration, MultiProgress, ProgressBar, ProgressStyle};

const PATH: &str = "/b/DrugBank.xml";
const STATE_PATH: &str = "./state";
const BUFSIZE: usize = 2000;
static EXIT: AtomicBool = AtomicBool::new(false);

#[derive(Deserialize)]
struct Drugs;

#[tokio::main]
async fn main() -> Result<()> {
    tokio::spawn(async {
        signal::ctrl_c().await?;
        println!("Received exit signal");
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
    println!("start from {}", last_pos);
    rd.seek(SeekFrom::Start(last_pos))?; // skip this many bytes
    let pb = ProgressBar::new(size);
    let mut p = xml::Parser::new();
    let mut e = xml::ElementBuilder::new();
    let mut found = 0;
    let mut eof = false;
    let db = Surreal::new::<remote::ws::Ws>("localhost:8000").await?;
    db.wait_for(surrealdb::opt::WaitFor::Connection).await;
    db.use_ns("drugs").use_db("drugs").await?;
    pb.set_position(0);

    'out: while !eof {
        let mut buf = String::with_capacity(BUFSIZE);
        while buf.len() < BUFSIZE {
            if rd.read_line(&mut buf)? == 0 {
                println!("eof");
                eof = true;
                break;
            }
        }

        p.feed_str(&buf);
        for ev in &mut p {
            let (ev, pos) = ev?;
            let x = e.handle_event(ev);
            if let Some(el) = x {
                found += 1;
                let el = el?;
                let _: Option<Element> = db.create("drugs").content(el).await?;
                let cpos = last_pos + pos.done_utf8;
                pb.set_position(cpos);
                state.write_at(cpos.to_string().as_bytes(), 0)?;
            }
            if EXIT.load(SeqCst) {
                break 'out;
            }
        }
    }

    Ok(())
}
