'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const DIR = path.join(os.homedir(), '.signal');
const FILE = path.join(DIR, 'history.json');

function ensure() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ sessions: [] }, null, 2));
}

function load() {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return { sessions: [] };
  }
}

function save(data) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function logSession({ label, minutes, completed }) {
  const data = load();
  data.sessions.push({
    label: label || 'unlabeled',
    minutes,
    completed,
    endedAt: new Date().toISOString(),
  });
  save(data);
  return data;
}

function dayKey(iso) {
  return iso.slice(0, 10);
}

function streak(sessions) {
  const days = new Set(sessions.filter((s) => s.completed).map((s) => dayKey(s.endedAt)));
  let count = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

module.exports = { load, save, logSession, streak, FILE };
