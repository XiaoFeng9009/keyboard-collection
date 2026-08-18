const fs = require('fs');
const path = require('path');

let sharp = null;
try {
  sharp = require('sharp');
} catch (err) {
  try {
    sharp = require('./node_modules/.pnpm/sharp@0.34.5/node_modules/sharp');
  } catch (fallbackErr) {
    sharp = null;
  }
}

const IMG_DIR = path.join(__dirname, 'public', 'images');
const THUMB_DIR = path.join(__dirname, 'public', 'thumbnails');
const THUMB_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function collectFiles() {
  const files = [];
  const entries = fs.readdirSync(IMG_DIR, { withFileTypes: true });

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      const dir = path.join(IMG_DIR, entry.name);
      fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() && THUMB_EXTS.has(path.extname(file).toLowerCase())) {
          files.push(filePath);
        }
      });
    } else if (entry.isFile() && THUMB_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.join(IMG_DIR, entry.name));
    }
  });

  return files;
}

function thumbTarget(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(IMG_DIR, filePath).replace(/\\/g, '/');
  const webpRel = rel.slice(0, -ext.length) + '.webp';
  return path.join(THUMB_DIR, webpRel);
}

async function processOne(filePath) {
  const output = thumbTarget(filePath);
  const sourceStat = fs.statSync(filePath);

  if (fs.existsSync(output)) {
    const outputStat = fs.statSync(output);
    if (outputStat.mtimeMs >= sourceStat.mtimeMs) return 'skipped';
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(filePath)
    .resize({ width: 480, height: 360, fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(output);
  return 'generated';
}

async function runWithConcurrency(items, limit, worker) {
  const queue = [...items];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(workers);
}

async function main() {
  if (!sharp) {
    console.warn('未找到 sharp，跳过缩略图生成。');
    return;
  }

  const files = collectFiles();
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  await runWithConcurrency(files, 4, async (filePath) => {
    try {
      const result = await processOne(filePath);
      if (result === 'generated') generated++;
      if (result === 'skipped') skipped++;
    } catch (err) {
      failed++;
    }
  });

  console.log('  缩略图生成完成: ' + generated + ' 张新增，' + skipped + ' 张跳过，' + failed + ' 张失败');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
