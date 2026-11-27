import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status || 1);
}
// Android serves files at its local origin root, independently of the public web base.
run('npm', ['run', 'build'], { ...process.env, PUBLIC_BASE_PATH: '/' });
run('npx', ['astro', 'build', '--outDir', './dist-web'], {
  ...process.env, PUBLIC_BASE_PATH: '/dotquy',
});
fs.cpSync('dist/ota', 'dist-web/ota', { recursive: true });
