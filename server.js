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
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone } = req.body;
  const id = clients.length + 1;
  const client = { id, name, email, phone };
  clients.push(client);
  res.status(201).json(client);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
