#!/usr/bin/env node
'use strict';

const { c, color, frame, header } = require('../lib/theme');
const store = require('../lib/store');

const args = process.argv.slice(2);
const cmd = args[0];

function fmtClock(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function bar(pct, width = 28) {
  const filled = Math.round((pct / 100) * width);
  return (
    color('█'.repeat(filled), c.cyan) + color('░'.repeat(width - filled), c.grey)
  );
}

async function start(minutesArg, labelArg) {
  const minutes = Number(minutesArg) > 0 ? Number(minutesArg) : 25;
  const label = labelArg || 'focus';
  const totalSeconds = Math.round(minutes * 60);
  let remaining = totalSeconds;
  let aborted = false;

  process.stdout.write('\x1b[?25l'); // hide cursor

  const onSigint = () => {
    aborted = true;
  };
  process.on('SIGINT', onSigint);

  console.log(header('SIGNAL // OPEN'));
  console.log(color(`  target  : ${label}`, c.dim));
  console.log(color(`  duration: ${minutes} min`, c.dim));
  console.log('');

  await new Promise((resolve) => {
    const tick = () => {
      if (aborted || remaining < 0) return resolve();
      const pct = Math.round(((totalSeconds - remaining) / totalSeconds) * 100);
      process.stdout.write(
        `\r  ${color(fmtClock(remaining), `${c.bold}${c.amber}`)}  ${bar(pct)}  ${pct}%   `
      );
      if (remaining === 0) {
        setTimeout(resolve, 300);
        return;
      }
      remaining -= 1;
      setTimeout(tick, 1000);
    };
    tick();
  });

  process.off('SIGINT', onSigint);
  process.stdout.write('\x1b[?25h\n\n'); // show cursor

  const completed = !aborted;
  store.logSession({ label, minutes, completed });
  const data = store.load();
  const currentStreak = store.streak(data.sessions);

  if (completed) {
    console.log(
      frame(
        [
          header('SIGNAL // CLOSED'),
          '',
          `${color('status', c.dim)}   ${color('COMPLETE', `${c.bold}${c.green}`)}`,
          `${color('target', c.dim)}   ${label}`,
          `${color('streak', c.dim)}   ${currentStreak} day${currentStreak === 1 ? '' : 's'}`,
        ],
        {}
      )
    );
  } else {
    console.log(
      frame(
        [
          header('SIGNAL // LOST'),
          '',
          `${color('status', c.dim)}   ${color('ABORTED', `${c.bold}${c.red}`)}`,
          `${color('target', c.dim)}   ${label}`,
        ],
        {}
      )
    );
  }
  process.exit(completed ? 0 : 1);
}

function log() {
  const data = store.load();
  const sessions = data.sessions.slice(-10).reverse();
  const currentStreak = store.streak(data.sessions);
  const total = data.sessions.filter((s) => s.completed).length;

  const lines = [
    header('SIGNAL LOG'),
    '',
    `${color('total completed', c.dim)}  ${total}`,
    `${color('current streak', c.dim)}   ${currentStreak} day${currentStreak === 1 ? '' : 's'}`,
    '',
  ];

  if (sessions.length === 0) {
    lines.push(color('no sessions logged yet — run `signal start`', c.grey));
  } else {
    for (const s of sessions) {
      const mark = s.completed ? color('✓', c.green) : color('✕', c.red);
      const date = s.endedAt.slice(0, 16).replace('T', ' ');
      lines.push(`${mark} ${date}  ${color(String(s.minutes) + 'm', c.dim)}  ${s.label}`);
    }
  }

  console.log(frame(lines, {}));
}

function help() {
  console.log(header('SIGNAL'));
  console.log(color('  a terminal-themed focus session tracker\n', c.dim));
  console.log('  signal start [minutes] [label]   start a focus session (default 25m)');
  console.log('  signal log                       show recent sessions + streak');
  console.log('  signal help                      show this message');
  console.log('');
  console.log(color('  example: signal start 50 "ship the login page"', c.grey));
}

(async () => {
  switch (cmd) {
    case 'start':
      await start(args[1], args.slice(2).join(' '));
      break;
    case 'log':
      log();
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      help();
      break;
    default:
      console.log(color(`unknown command: ${cmd}`, c.red));
      help();
      process.exit(1);
  }
})();
