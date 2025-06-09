const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function load() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { clients: [], users: [], calls: [] };
  }
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const db = load();

module.exports = {
  getClients() {
    return db.clients;
  },
  addClient(client) {
    db.clients.push(client);
    save(db);
  },
  updateClient(id, updates) {
    const idx = db.clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      db.clients[idx] = { ...db.clients[idx], ...updates };
      save(db);
      return db.clients[idx];
    }
    return null;
  },
  getUsers() {
    return db.users;
  },
  addUser(user) {
    db.users.push(user);
    save(db);
  },
  addCall(call) {
    db.calls.push(call);
    save(db);
  },
  getCalls() {
    return db.calls;
  }
};
