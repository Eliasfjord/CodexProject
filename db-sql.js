const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'crm.sqlite');
const JSON_FILE = path.join(__dirname, 'db.json');

const db = new sqlite3.Database(DB_FILE);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function init() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`);
  await run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT,
    notes TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    outcome TEXT,
    date TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    datetime TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    text TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    number TEXT,
    category TEXT
  )`);

  if (!fs.existsSync(JSON_FILE)) return;
  const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

  const userCount = (await get('SELECT COUNT(*) as count FROM users')).count;
  if (userCount === 0 && data.users) {
    for (const user of data.users) {
      await run('INSERT INTO users(email,password) VALUES (?,?)', [user.email, user.password]);
    }
  }

  const clientCount = (await get('SELECT COUNT(*) as count FROM clients')).count;
  if (clientCount === 0 && data.clients) {
    for (const c of data.clients) {
      await run('INSERT INTO clients(id,name,email,phone,status,notes) VALUES (?,?,?,?,?,?)', [c.id, c.name, c.email, c.phone, c.status || 'Cold', c.notes || '']);
    }
  }

  const meetingCount = (await get('SELECT COUNT(*) as count FROM meetings')).count;
  if (meetingCount === 0 && data.meetings) {
    for (const m of data.meetings) {
      await run('INSERT INTO meetings(id,title,datetime) VALUES (?,?,?)', [m.id, m.title, m.datetime]);
    }
  }

  const noteCount = (await get('SELECT COUNT(*) as count FROM notes')).count;
  if (noteCount === 0 && data.notes) {
    for (const n of data.notes) {
      await run('INSERT INTO notes(id,title,text) VALUES (?,?,?)', [n.id, n.title, n.text]);
    }
  }

  const callCount = (await get('SELECT COUNT(*) as count FROM calls')).count;
  if (callCount === 0 && data.calls) {
    for (const call of data.calls) {
      await run('INSERT INTO calls(id,outcome,date) VALUES (?,?,?)', [call.id, call.outcome || '', call.date || '']);
    }
  }

  const policyCount = (await get('SELECT COUNT(*) as count FROM policies')).count;
  if (policyCount === 0 && data.policies) {
    for (const p of data.policies) {
      await run('INSERT INTO policies(id,company,number,category) VALUES (?,?,?,?)', [p.id, p.company, p.number, p.category]);
    }
  }
}

async function getUsers() {
  return all('SELECT * FROM users');
}

async function addUser(user) {
  await run('INSERT INTO users(email,password) VALUES (?,?)', [user.email, user.password]);
}

async function getClients() {
  return all('SELECT * FROM clients');
}

async function addClient(client) {
  const result = await run('INSERT INTO clients(name,email,phone,status,notes) VALUES (?,?,?,?,?)', [client.name, client.email, client.phone, client.status, client.notes]);
  return { id: result.id, ...client };
}

async function updateClient(id, updates) {
  const existing = await get('SELECT * FROM clients WHERE id=?', [id]);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await run('UPDATE clients SET name=?, email=?, phone=?, status=?, notes=? WHERE id=?', [updated.name, updated.email, updated.phone, updated.status, updated.notes, id]);
  return updated;
}

async function addCall(call) {
  await run('INSERT INTO calls(outcome,date) VALUES (?,?)', [call.outcome || '', call.date]);
}

async function getCalls() {
  return all('SELECT outcome, date FROM calls');
}

async function getMeetings() {
  return all('SELECT * FROM meetings');
}

async function addMeeting(meeting) {
  const result = await run('INSERT INTO meetings(title,datetime) VALUES (?,?)', [meeting.title, meeting.datetime]);
  return { id: result.id, ...meeting };
}

async function getNotes() {
  return all('SELECT * FROM notes');
}

async function addNote(note) {
  const result = await run('INSERT INTO notes(title,text) VALUES (?,?)', [note.title, note.text]);
  return { id: result.id, ...note };
}

async function getPolicies() {
  return all('SELECT * FROM policies');
}

async function addPolicy(policy) {
  const result = await run('INSERT INTO policies(company,number,category) VALUES (?,?,?)', [policy.company, policy.number, policy.category]);
  return { id: result.id, ...policy };
}

async function updatePolicy(id, updates) {
  const existing = await get('SELECT * FROM policies WHERE id=?', [id]);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await run('UPDATE policies SET company=?, number=?, category=? WHERE id=?', [updated.company, updated.number, updated.category, id]);
  return updated;
}

module.exports = {
  init,
  getUsers,
  addUser,
  getClients,
  addClient,
  updateClient,
  addCall,
  getCalls,
  getMeetings,
  addMeeting,
  getNotes,
  addNote,
  getPolicies,
  addPolicy,
  updatePolicy
};
