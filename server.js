 anszxq-codex/build-crm-app-for-insurance-agents
const path = require('path');
const express = require('./express');
const cors = require('./cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Persisted clients are stored in db.json using our simple db module

app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));

let clients = [];

app.get('/api/clients', (req, res) => {
  res.json(clients);
main
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone } = req.body;
anszxq-codex/build-crm-app-for-insurance-agents
  const id = db.getClients().length + 1;
  const client = { id, name, email, phone };
  db.addClient(client);

  const id = clients.length + 1;
  const client = { id, name, email, phone };
  clients.push(client);
main
  res.status(201).json(client);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
