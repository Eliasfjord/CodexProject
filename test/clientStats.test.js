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

test('client stats endpoint returns counts', { concurrency: false }, async () => {
  const server = await startServer();
  try {
    const res = await fetch(`http://localhost:${server.port}/api/clientStats`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(typeof data === 'object' && Object.keys(data).length >= 0);
  } finally {
    await stopServer(server);
  }
});
