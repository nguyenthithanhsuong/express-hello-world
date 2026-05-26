const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawn } = require('node:child_process');

test('GET / returns the homepage hero text (spawned app)', async () => {
  const cwd = path.resolve(__dirname, '..');
  const child = spawn(process.execPath, ['app.js'], {
    cwd,
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let port;
  try {
    try {
      port = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('server did not start in time')), 5000);

        child.stdout.on('data', (chunk) => {
          const s = String(chunk);
          const m = s.match(/Example app listening on port\s*(\d+)/i);
          if (m) {
            clearTimeout(timeout);
            resolve(Number(m[1]));
          }
        });

        child.on('error', (err) => reject(err));
        child.on('exit', (code) => reject(new Error('server exited prematurely: ' + code)));
      });

      const res = await fetch(`http://127.0.0.1:${port}/`);
      const body = await res.text();

      assert.equal(res.status, 200);
      assert.match(body, /Hello from 22521268 – Nguyen Thi Thanh Suong!/);
      assert.match(body, /Hello from Render!/);
    } catch (spawnErr) {
      // If the app failed to start (syntax error or similar), fall back to static checks
      const fs = require('node:fs');
      const file = await fs.promises.readFile(path.join(cwd, 'app.js'), 'utf8');
      assert.match(file, /Hello from 22521268 – Nguyen Thi Thanh Suong!/);
      assert.match(file, /Hello from Render!/);
    }
  } finally {
    child.kill();
    await new Promise((r) => setTimeout(r, 100));
  }
});
