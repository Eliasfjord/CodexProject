const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db-sql');

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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await db.getUsers();
  const user = users.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { email: user.email };
    return res.json({ email: user.email });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const users = await db.getUsers();
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  await db.addUser({ email, password: hash });
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

app.get('/api/clients', async (req, res) => {
  const { status } = req.query;
  let clients = await db.getClients();
  if (status) {
    clients = clients.filter(c => c.status === status);
  }
  res.json(clients);
});

app.post('/api/clients', async (req, res) => {
  const { name, email, phone, status = 'Cold', notes = '' } = req.body;
  const client = await db.addClient({ name, email, phone, status, notes });
  res.status(201).json(client);
});


app.put('/api/clients/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updateClient(id, req.body);
  if (!updated) {
    return res.status(404).end();
  }
  res.json(updated);
});

app.post('/api/calls', async (req, res) => {
  const call = { ...req.body, date: new Date().toISOString() };
  await db.addCall(call);
  res.status(201).json(call);
});

app.get('/api/stats', async (req, res) => {
  const calls = await db.getCalls();
  const total = calls.length;
  const sales = calls.filter(c => c.outcome === 'sale').length;
  const closeRate = total ? sales / total : 0;
  res.json({ totalCalls: total, sales, closeRate });
});

// Aggregate client counts by status for charts
app.get('/api/clientStats', async (req, res) => {
  const counts = {};
  for (const client of await db.getClients()) {
    const status = client.status || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
  }
  res.json(counts);
});

app.get('/api/meetings', async (req, res) => {
  res.json(await db.getMeetings());
});

app.post('/api/meetings', async (req, res) => {
  const { title, datetime } = req.body;
  const meeting = await db.addMeeting({ title, datetime });
  res.status(201).json(meeting);

});

// Simple note endpoints
app.get('/api/notes', async (req, res) => {
  res.json(await db.getNotes());
});

app.post('/api/notes', async (req, res) => {
  const { title, text } = req.body;
  const note = await db.addNote({ title, text });
  res.status(201).json(note);
});

// Task management
app.get('/api/tasks', (req, res) => {
  res.json(db.getTasks());
});

app.post('/api/tasks', (req, res) => {
  const { title, due } = req.body;
  const id = db.getTasks().length + 1;
  const task = { id, title, due, completed: false };
  db.addTask(task);
  res.status(201).json(task);
});

// Policy management
app.get('/api/policies', async (req, res) => {
  res.json(await db.getPolicies());
});

app.post('/api/policies', async (req, res) => {
  const policy = await db.addPolicy(req.body);
  res.status(201).json(policy);
});

app.put('/api/policies/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = await db.updatePolicy(id, req.body);
  if (!updated) {
    return res.status(404).end();
  }
  res.json(updated);
});
async function start() {
  await db.init();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
