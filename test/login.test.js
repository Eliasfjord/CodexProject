const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

async function startServer() {
  const child = spawn('node', ['server.js']);
  await delay(500); // wait for server to start
  return child;
}

async function stopServer(child) {
  child.kill();
  await delay(100);
}

test('admin login works', async () => {
  const server = await startServer();
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.email, 'admin@gmail.com');
  } finally {
    await stopServer(server);
  }
});
