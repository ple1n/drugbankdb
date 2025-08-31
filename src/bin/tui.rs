use anyhow::Result;
use crossterm::{
    event::{self, Event as CEvent, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout, Margin},
    style::{Color, Style},
    text::{Line, Span},
    widgets::{self, Block, Borders, Paragraph, Scrollbar, ScrollbarOrientation, ScrollbarState},
    Terminal,
};
use serde_json::to_string_pretty;
use std::{
    fs::{File, OpenOptions},
    io::{BufRead, BufReader, Read, Seek, SeekFrom, Write},
    sync::atomic::{AtomicUsize, Ordering::SeqCst},
};
use syntect::{easy::HighlightLines, util::LinesWithEndings};
use syntect::{
    highlighting::{HighlightIterator, Highlighter, ThemeSet},
    parsing::SyntaxSet,
};
use syntect_tui::into_span;
use xml::{ElementBuilder, Parser};

const PATH: &str = "/b/DrugBank.xml";
const STATE_PATH: &str = "./state";
const BUFSIZE: usize = 2000;

#[tokio::main]
async fn main() -> Result<()> {
    // ...existing code for opening, seeking to last state...
    let mut fd = File::open(PATH)?;
    let mut rd = BufReader::new(fd);
    let mut state = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(STATE_PATH)?;
    let mut last_state = String::new();
    state.read_to_string(&mut last_state)?;
    let mut last_pos: u64 = last_state.trim().parse().unwrap_or(0);
    rd.seek(SeekFrom::Start(last_pos))?;

    let mut parser = Parser::new();
    let mut builder = ElementBuilder::new();

    // setup terminal
    enable_raw_mode()?;
    let mut stdout = std::io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // load syntax and theme
    let ps = SyntaxSet::load_defaults_newlines();
    let ts = ThemeSet::load_defaults();
    let syntax = ps.find_syntax_by_extension("json").unwrap();
    let theme = &ts.themes["InspiredGitHub"];

    let mut buf = String::with_capacity(BUFSIZE);
    'o: loop {
        buf.clear();
        while buf.len() < BUFSIZE {
            if rd.read_line(&mut buf)? == 0 {
                break 'o;
            }
        }
        parser.feed_str(&buf);
        for event in &mut parser {
            let (ev, pos) = event?;
            if let Some(el) = builder.handle_event(ev) {
                let el = el?;
                // serialize to JSON
                let json = to_string_pretty(&el)?;
                // update state
                // last_pos += pos.done_utf8 as u64;
                // state.set_len(0)?;
                // state.seek(SeekFrom::Start(0))?;
                // state.write_all(last_pos.to_string().as_bytes())?;
                let vertical_scroll: AtomicUsize = AtomicUsize::new(0);
                let block = Block::default().title("Record").borders(Borders::ALL);

                let mut h = HighlightLines::new(syntax, &ts.themes["base16-ocean.dark"]);
                let mut vec = Vec::new();
                for line in LinesWithEndings::from(&json) {
                    let spans: Vec<Span> = h
                        .highlight_line(line, &ps)
                        .unwrap()
                        .into_iter()
                        .filter_map(|segment| into_span(segment).ok())
                        .collect();

                    let line = Line::from(spans);
                    vec.push(line);
                }

                let vlen = vec.len();
                let paragraph = Paragraph::new(vec.clone()).block(block.clone());
                // render
                let r = |f: &mut ratatui::Frame<'_>| {
                    let vscroll = vertical_scroll.load(SeqCst);
                    let size = f.area();
                    let area = Layout::default()
                        .direction(Direction::Vertical)
                        .constraints([Constraint::Min(0)])
                        .split(size)[0];
                    let paragraph = paragraph.clone().scroll((vscroll as u16, 0));
                    f.render_widget(paragraph, area);
                    let mut scrollbar_state = ScrollbarState::new(vlen).position(vscroll);
                    let scrollbar = Scrollbar::new(ScrollbarOrientation::VerticalRight)
                        .begin_symbol(None)
                        .end_symbol(None);
                    f.render_stateful_widget(
                        scrollbar,
                        area.inner(Margin {
                            // using an inner vertical margin of 1 unit makes the scrollbar inside the block
                            vertical: 1,
                            horizontal: 0,
                        }),
                        &mut scrollbar_state,
                    );
                };
                terminal.draw(r)?;

                // wait for any keypress
                loop {
                    if let CEvent::Key(kv) = event::read()? {
                        match kv.code {
                            KeyCode::Esc => break 'o,
                            KeyCode::Enter => break,
                            KeyCode::Down => {
                                vertical_scroll.fetch_add(10, SeqCst);
                                terminal.draw(r)?;
                            }
                            _ => (),
                        }
                    }
                }
            }
        }
    }
    // cleanup on exit
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    println!("eof");
    Ok(())
}
