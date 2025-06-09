const path = require('path');
const express = require('express');
codex/start-styling-work
const bodyParser = require('body-parser');

 main
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
codex/start-styling-work
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Persisted clients are stored in db.json using our simple db module

main
app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone } = req.body;
  const id = db.getClients().length + 1;
  const client = { id, name, email, phone };
  db.addClient(client);
  res.status(201).json(client);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
