import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

test('GET /api/health returns ok', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
