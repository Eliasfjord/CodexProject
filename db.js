const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function load() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
  } catch (err) {

    return { clients: [], meetings: [], users: [] };


    return { clients: [], users: [], calls: [] };


    return { clients: [], meetings: [] };

    return { clients: [], users: [] };



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


  getMeetings() {
    return db.meetings;
  },
  addMeeting(meeting) {
    db.meetings.push(meeting);
    save(db);
  },


  getUsers() {
    return db.users;
  },
  addUser(user) {
    db.users.push(user);
    save(db);
  },

  getNotes() {
    return db.notes || [];
  },
  addNote(note) {
    if (!db.notes) {
      db.notes = [];
    }
    db.notes.push(note);
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
