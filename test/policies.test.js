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

test('policies endpoints work', { concurrency: false }, async () => {
  const server = await startServer();
  try {
    const addRes = await fetch(`http://localhost:${server.port}/api/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company: 'Acme', number: 'XYZ', category: 'Life' })
    });
    assert.equal(addRes.status, 201);
    const added = await addRes.json();
    assert.equal(added.company, 'Acme');

    const updRes = await fetch(`http://localhost:${server.port}/api/policies/${added.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Health' })
    });
    assert.equal(updRes.status, 200);
    const updated = await updRes.json();
    assert.equal(updated.category, 'Health');

    const listRes = await fetch(`http://localhost:${server.port}/api/policies`);
    assert.equal(listRes.status, 200);
    const list = await listRes.json();
    assert.ok(Array.isArray(list));
    assert.ok(list.find(p => p.id === added.id && p.category === 'Health'));
  } finally {
    await stopServer(server);
  }
});
