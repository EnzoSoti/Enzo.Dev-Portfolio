import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = Number(process.env.TEST_PORT || 5051);
const baseUrl = `http://127.0.0.1:${port}`;

let serverProcess: ChildProcess;
let startupLogs = '';

type RouteCheck = {
  name: string;
  run: () => Promise<void>;
};

const supportsColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

function color(text: string, code: string) {
  return supportsColor ? `\u001b[${code}m${text}\u001b[0m` : text;
}

async function waitForServer(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/api/ping`);
      if (res.ok) {
        return;
      }
    } catch {
      // The server may still be booting.
    }

    await delay(250);
  }

  throw new Error(`API server did not start in time. Logs:\n${startupLogs}`);
}

async function startServer() {
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (!serverProcess.stdout || !serverProcess.stderr) {
    throw new Error('Expected the test server process to expose piped stdout and stderr.');
  }

  serverProcess.stdout.on('data', (chunk: Buffer) => {
    startupLogs += chunk.toString();
  });

  serverProcess.stderr.on('data', (chunk: Buffer) => {
    startupLogs += chunk.toString();
  });

  await waitForServer();
}

function stopServer() {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

const routeChecks: RouteCheck[] = [
  {
    name: 'GET /api/ping responds from the live server',
    run: async () => {
      const res = await fetch(`${baseUrl}/api/ping`);
      assert.equal(res.status, 200);

      const body = await res.json();
      assert.equal(body.status, 'online');
      assert.equal(typeof body.timestamp, 'number');
      assert.match(body.dbConnection, /^(connected|disconnected)$/);
    },
  },
  {
    name: 'GET /api/ping includes basic security headers',
    run: async () => {
      const res = await fetch(`${baseUrl}/api/ping`);

      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.equal(res.headers.get('referrer-policy'), 'same-origin');
    },
  },
  {
    name: 'POST /api/admin/login accepts the real admin credentials',
    run: async () => {
      const res = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: '1', password: '1' }),
      });

      assert.equal(res.status, 200);

      const body = await res.json();
      assert.equal(body.success, true);
      assert.equal(typeof body.token, 'string');
      assert.equal(body.user.email, 'admin@enzo.dev');
    },
  },
  {
    name: 'GET /api/admin/verify validates the issued bearer token',
    run: async () => {
      const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: '1', password: '1' }),
      });

      const loginBody = await loginRes.json();

      const verifyRes = await fetch(`${baseUrl}/api/admin/verify`, {
        headers: {
          Authorization: `Bearer ${loginBody.token}`,
        },
      });

      assert.equal(verifyRes.status, 200);
      assert.deepEqual(await verifyRes.json(), { valid: true });
    },
  },
  {
    name: 'POST /api/contact enforces required fields on the live route',
    run: async () => {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'enzo@example.com' }),
      });

      assert.equal(res.status, 400);

      const body = await res.json();
      assert.equal(body.error, 'Please provide name, email, and message.');
    },
  },
  {
    name: 'POST /api/uploads/profile-image stores and exposes an uploaded image',
    run: async () => {
      const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: '1', password: '1' }),
      });

      const loginBody = await loginRes.json();

      const formData = new FormData();
      formData.append(
        'image',
        new Blob(['profile-image-test'], { type: 'image/png' }),
        'profile-test.png'
      );

      const uploadRes = await fetch(`${baseUrl}/api/uploads/profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loginBody.token}`,
        },
        body: formData,
      });

      assert.equal(uploadRes.status, 200);

      const uploadBody = await uploadRes.json();
      assert.equal(typeof uploadBody.url, 'string');
      assert.match(uploadBody.url, /\/image\/uploads\/\d+-profile-test\.png$/);

      const imageRes = await fetch(uploadBody.url);
      assert.equal(imageRes.status, 200);
      assert.equal(imageRes.headers.get('content-type')?.startsWith('image/'), true);
    },
  },
];

async function main() {
  const startedAt = Date.now();
  let passed = 0;
  let failed = 0;

  console.log(color('Live route checks', '36'));
  console.log(color('------------------', '36'));

  try {
    await startServer();

    for (const routeCheck of routeChecks) {
      try {
        await routeCheck.run();
        passed += 1;
        console.log(`${color('✓', '32')} ${routeCheck.name}`);
      } catch (error) {
        failed += 1;
        console.log(`${color('✗', '31')} ${routeCheck.name}`);
        if (error instanceof Error) {
          console.error(color(error.stack || error.message, '31'));
        } else {
          console.error(color(String(error), '31'));
        }
        break;
      }
    }
  } finally {
    stopServer();
  }

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('');
  console.log(
    `Summary: ${color(String(passed), '32')} passed, ${color(String(failed), '31')} failed, ${color(`${elapsedSeconds}s`, '90')}`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});