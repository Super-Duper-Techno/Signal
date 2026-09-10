# SIGNAL

> **SUPER DUPER TECHNO — SIGNAL**

[![Buy Me a Coffee](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/superdupertechno)
[![Support SDT](https://img.shields.io/badge/Support-superdupertechno.com-00bcd4?style=flat)](https://superdupertechno.com/support)

A terminal-themed focus session tracker. Start a signal, hold the line, log the streak.

No accounts, no cloud, no dependencies — just a local `.signal/history.json` and a HUD in your terminal.

```
◢◤ SIGNAL // OPEN ◢◤
  target  : ship the login page
  duration: 25 min

  18:42  ████████░░░░░░░░░░░░░░░░░░░░  29%
```

## Install

```bash
git clone https://github.com/SuperDuperTechno/signal.git
cd signal
npm link
```

This makes the `signal` command available globally. (Skip `npm link` and run
`node bin/signal.js` directly if you'd rather not install it.)

## Usage

```bash
signal start              # 25 minute session, unlabeled
signal start 50           # 50 minute session
signal start 50 "ship the login page"   # 50 minutes, labeled

signal log                # recent sessions + current streak
signal help               # command list
```

Press `Ctrl+C` during a session to abort it — it's logged as a miss, not a
completion, so your streak stays honest.

## Why

Most focus timers live in an app or a browser tab you're trying to avoid in
the first place. This one lives where the work already is.

## How it works

- Sessions are stored locally at `~/.signal/history.json` — plain JSON, nothing leaves your machine
- Streak counts consecutive calendar days with at least one completed session
- Zero runtime dependencies — pure Node.js

## License

MIT — see [LICENSE](LICENSE).

---

Built by [Super Duper Techno](https://superdupertechno.com).
