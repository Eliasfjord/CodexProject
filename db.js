const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function load() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { clients: [], meetings: [] };
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
  getMeetings() {
    return db.meetings || [];
  },
  addMeeting(meeting) {
    if (!db.meetings) {
      db.meetings = [];
    }
    db.meetings.push(meeting);
    save(db);
  }
};
