#!/usr/bin/env node
// Clone a Sanity dataset into a new project and update local env
// Usage examples:
//   node scripts/clone-sanity.mjs --create-project --from-project abc123 --from-dataset production --new-dataset production --invite client@example.com --domain https://client.com --update-env
//   node scripts/clone-sanity.mjs --from-project abc123 --from-dataset production --new-project-id xyz987 --new-dataset production --update-env

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function log(msg) {
  process.stdout.write(`\n[clone-sanity] ${msg}\n`);
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    log(`$ ${cmd} ${args.join(' ')}`);
    const child = spawn(cmd, args, {
      stdio: opts.stdio || 'inherit',
      env: { ...process.env, ...(opts.env || {}) },
      cwd: opts.cwd || process.cwd(),
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) return resolve();
      const err = new Error(`${cmd} exited with code ${code}`);
      if (opts.ignoreFail) return resolve();
      reject(err);
    });
  });
}

function parseArgs(argv) {
  const out = {
    fromProject: undefined,
    fromDataset: undefined,
    newProjectId: undefined,
    createProject: false,
    newDataset: 'production',
    inviteEmail: undefined,
    domains: [],
    updateEnv: true,
    fromTar: undefined,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--from-project') out.fromProject = next();
    else if (a === '--from-dataset') out.fromDataset = next();
    else if (a === '--new-project-id') out.newProjectId = next();
    else if (a === '--create-project') out.createProject = true;
    else if (a === '--new-dataset') out.newDataset = next();
    else if (a === '--invite') out.inviteEmail = next();
    else if (a === '--domain') out.domains.push(next());
    else if (a === '--no-update-env') out.updateEnv = false;
    else if (a === '--update-env') out.updateEnv = true;
    else if (a === '--from-tar') out.fromTar = next();
  }
  return out;
}

function readDotEnvLocal(root) {
  const p = join(root, '.env.local');
  if (!existsSync(p)) return {};
  const txt = readFileSync(p, 'utf8');
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    out[key] = val;
  }
  return out;
}

function updateDotEnvLocal(root, patch) {
  const p = join(root, '.env.local');
  const exists = existsSync(p);
  if (exists) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    copyFileSync(p, `${p}.bak-${ts}`);
  }
  const curr = exists ? readFileSync(p, 'utf8') : readFileSync(join(root, '.env.local.example'), 'utf8');
  const lines = curr.split(/\r?\n/);
  const keys = new Set(Object.keys(patch));
  const next = lines.map((ln) => {
    const m = ln.match(/^\s*([A-Z0-9_]+)\s*=.*$/);
    if (!m) return ln;
    const k = m[1];
    if (!keys.has(k)) return ln;
    return `${k}=${patch[k]}`;
  });
  // Append any missing keys
  for (const k of keys) {
    if (!next.some((ln) => ln.startsWith(`${k}=`))) {
      next.push(`${k}=${patch[k]}`);
    }
  }
  writeFileSync(p, next.join('\n'));
  return p;
}

async function ask(q) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await rl.question(q);
  } finally {
    rl.close();
  }
}

async function main() {
  const args = parseArgs(process.argv);
  // Always anchor to repo root (one level up from scripts/)
  const root = join(__dirname, '..');

  const env = readDotEnvLocal(root);
  // Positional convenience: allow first bare arg to be --from-project
  if (!args.fromProject) {
    const bare = process.argv.slice(2).filter((t) => !t.startsWith('--'));
    if (bare[0]) args.fromProject = bare[0];
    if (!args.newProjectId && bare[1]) args.newProjectId = bare[1];
  }
  const fromProject = args.fromProject || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const fromDataset = args.fromDataset || env.NEXT_PUBLIC_SANITY_DATASET || 'production';

  if (!fromProject) {
    log('ERROR: Could not determine source project id. Pass --from-project or set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
    process.exit(1);
  }

  log(`Source: project=${fromProject} dataset=${fromDataset}`);

  let newProjectId = args.newProjectId;
  if (!newProjectId && args.createProject) {
    log('Creating a new Sanity project (interactive)…');
    await run('npx', ['sanity', 'projects', 'create']);
    newProjectId = await ask('Paste the new Sanity project ID here: ');
  }
  if (!newProjectId && !args.createProject) {
    const ans = await ask('No destination project ID provided. Create a new project now? (y/N): ');
    if (/^y(es)?$/i.test(ans.trim())) {
      log('Creating a new Sanity project (interactive)…');
      await run('npx', ['sanity', 'projects', 'create']);
      newProjectId = await ask('Paste the new Sanity project ID here: ');
    }
  }
  if (!newProjectId) {
    newProjectId = await ask('Enter the destination Sanity project ID: ');
  }
  const newDataset = args.newDataset || 'production';

  // Preflight summary and confirmation
  log('Preflight check');
  log(`  Source:      project=${fromProject} dataset=${fromDataset}`);
  log(`  Destination: project=${newProjectId} dataset=${newDataset}`);
  if (fromProject === newProjectId && fromDataset === newDataset) {
    log('ERROR: Source and destination are identical. Aborting to prevent accidental overwrite.');
    process.exit(1);
  }
  const confirm = await ask(`Type EXACTLY "COPY ${fromProject}:${fromDataset} -> ${newProjectId}:${newDataset}" to continue: `);
  if (confirm.trim() !== `COPY ${fromProject}:${fromDataset} -> ${newProjectId}:${newDataset}`) {
    log('Confirmation phrase did not match. Aborting.');
    process.exit(1);
  }

  // Ensure dataset exists in destination
  log(`Ensuring dataset '${newDataset}' exists in project ${newProjectId}…`);
  // Use a temp folder OUTSIDE the repo so the CLI can't infer
  // local project context (which can override --project flags)
  const cliCwd = (() => {
    const p = join(tmpdir(), `sanity-cli-${Date.now().toString(36)}`);
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
    return p;
  })();
  await run('npx', ['sanity', 'dataset', 'create', newDataset, '--project', newProjectId], { ignoreFail: true, cwd: cliCwd });

  // Determine export tarball
  let exportPath = args.fromTar;
  if (exportPath) {
    log(`Using provided export tarball: ${exportPath}`);
    if (!existsSync(exportPath)) {
      log('ERROR: --from-tar file not found. Aborting.');
      process.exit(1);
    }
  } else {
    const tmpDir = join(root, 'tmp');
    if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });
    exportPath = join(tmpDir, `sanity-export-${fromDataset}-${Date.now()}.tgz`);
    log('Exporting source dataset…');
    await run('npx', ['sanity', 'dataset', 'export', fromDataset, exportPath, '--project', fromProject], { cwd: cliCwd });
  }

  // Import to destination
  log('Importing into destination project…');
  await run('npx', ['sanity', 'dataset', 'import', exportPath, newDataset, '--project', newProjectId, '--replace'], { cwd: cliCwd });

  // Add common CORS origins
  log('Adding CORS origins to the new project…');
  await run('npx', ['sanity', 'cors', 'add', 'http://localhost:3000', '--project', newProjectId], { ignoreFail: true, cwd: cliCwd });
  for (const d of args.domains) {
    await run('npx', ['sanity', 'cors', 'add', d, '--project', newProjectId], { ignoreFail: true, cwd: cliCwd });
  }

  // Optionally invite a client email
  if (args.inviteEmail) {
    log(`Inviting ${args.inviteEmail} as administrator to ${newProjectId}…`);
    await run('npx', ['sanity', 'users', 'invite', args.inviteEmail, '--role', 'administrator', '--project', newProjectId], { ignoreFail: false, cwd: cliCwd });
    log('Note: Transferring project ownership must be done in Sanity Manage UI.');
  }

  // Optionally update env
  if (args.updateEnv) {
    log('Updating .env.local with new project settings…');
    const tokenInput = await ask('Enter SANITY_API_READ_TOKEN for the new project (leave blank to skip): ');
    const patch = {
      NEXT_PUBLIC_SANITY_PROJECT_ID: newProjectId,
      NEXT_PUBLIC_SANITY_DATASET: newDataset,
    };
    if (tokenInput && tokenInput.trim().length) {
      patch.SANITY_API_READ_TOKEN = tokenInput.trim();
    }
    const envPath = updateDotEnvLocal(root, patch);
    log(`Updated ${envPath}`);
    log('Run `npm run typegen` to refresh schema/types and `npm run dev` to start.');
  } else {
    log('Skipping .env.local update as requested.');
  }
  log('All done!');
}

main().catch((err) => {
  console.error('\n[clone-sanity] ERROR:', err.message || err);
  process.exit(1);
});
