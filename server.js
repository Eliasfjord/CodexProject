const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Persisted clients are stored in db.json using our simple db module

app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
});
app.post('/api/clients', ensureLoggedIn, (req, res) => {
  const { name, email, phone } = req.body;
app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
});

// If you have an authentication middleware, define ensureLoggedIn above or remove it from the route
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
