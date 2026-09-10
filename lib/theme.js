'use strict';

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  cyan: '\x1b[38;5;51m',
  green: '\x1b[38;5;46m',
  red: '\x1b[38;5;196m',
  amber: '\x1b[38;5;214m',
  grey: '\x1b[38;5;240m',
  magenta: '\x1b[38;5;201m',
};

function color(text, code) {
  if (!process.stdout.isTTY) return text;
  return `${code}${text}${c.reset}`;
}

function corner(tl, tr, bl, br, width) {
  const mid = '─'.repeat(Math.max(width - 2, 0));
  return {
    top: color(`${tl}${mid}${tr}`, c.grey),
    bottom: color(`${bl}${mid}${br}`, c.grey),
  };
}

function frame(lines, opts = {}) {
  const width = Math.max(...lines.map((l) => stripLen(l)), 24) + 4;
  const top = corner('┌', '┐', '', '', width).top;
  const bottom = corner('', '', '└', '┘', width).bottom;
  const out = [top];
  for (const line of lines) {
    const pad = width - 2 - stripLen(line);
    out.push(
      `${color('│', c.grey)} ${line}${' '.repeat(Math.max(pad - 1, 0))}${color('│', c.grey)}`
    );
  }
  out.push(bottom);
  return out.join('\n');
}

function stripLen(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}

function header(title) {
  const bar = color('◢◤', c.cyan);
  return `${bar} ${color(title, `${c.bold}${c.cyan}`)} ${bar}`;
}

module.exports = { c, color, frame, header, stripLen };
