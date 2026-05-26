const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');

test('GET / returns the homepage hero text', async () => {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Hello from 22521268 – Nguyen Thi Thanh Suong!/);
    assert.match(body, /Hello from Render!/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
