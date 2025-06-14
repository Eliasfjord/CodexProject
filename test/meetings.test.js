const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

async function startServer() {
  const port = 3000 + Math.floor(Math.random() * 1000);
  const child = spawn('node', ['server.js'], { env: { ...process.env, PORT: port } });
  await delay(500);
  return { child, port };
}

async function stopServer(server) {
  server.child.kill();
  await delay(100);
}

test('adding a meeting works', { concurrency: false }, async () => {
  const server = await startServer();
  try {
    const res = await fetch(`http://localhost:${server.port}/api/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Meeting', datetime: '2024-01-01T10:00' })
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.title, 'Test Meeting');
  } finally {
    await stopServer(server);
  }
});
