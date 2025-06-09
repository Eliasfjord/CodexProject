const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: 'change-this-secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static(path.join(__dirname, 'Public')));

// Persisted clients are stored in db.json using our simple db module

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.getUsers().find(u => u.email === email && u.password === password);
  if (user) {
    req.session.user = { email: user.email };
    return res.json({ email: user.email });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  if (db.getUsers().some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  db.addUser({ email, password });
  res.status(201).end();
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

app.get('/api/me', (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  res.status(401).end();
});

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
