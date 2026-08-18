// 刷新 images_index.json 和 data.json 中的图片路径
// 用法: node regenerate-assets.js
// 当你新增/删除/重命名 public/images/ 下的图片后运行

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const IMG_DIR = path.join(__dirname, 'public', 'images');
const DATA_FILE = path.join(__dirname, 'public', 'data.json');
const INDEX_FILE = path.join(__dirname, 'public', 'images_index.json');
const META_FILE = path.join(__dirname, 'public', 'data-meta.json');
const THUMB_DIR = path.join(__dirname, 'public', 'thumbnails');
const THUMB_SCRIPT = path.join(__dirname, 'generate-thumbnails.js');

const VALID_EXTS = new Set(['.jpg','.jpeg','.png','.webp','.gif','.svg','.bmp']);
const THUMB_EXTS = new Set(['.jpg','.jpeg','.png','.webp']);

function getThumbUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!THUMB_EXTS.has(ext)) return null;

  const rel = path.relative(IMG_DIR, filePath).replace(/\\/g, '/');
  const webpRel = rel.slice(0, -ext.length) + '.webp';
  return fs.existsSync(path.join(THUMB_DIR, webpRel)) ? '/thumbnails/' + webpRel : null;
}

// === 1. 生成 images_index.json（管理页面选择图片用）===
console.log('=== 1. 扫描图片文件夹 ===');

try {
  execFileSync(process.execPath, [THUMB_SCRIPT], { stdio: 'inherit' });
} catch (err) {
  console.warn('缩略图生成失败，将跳过缩略图字段');
}

const images = [];
const dirs = fs.readdirSync(IMG_DIR, {withFileTypes:true}).filter(d => d.isDirectory());

dirs.forEach(dir => {
  const files = fs.readdirSync(path.join(IMG_DIR, dir.name));
  files.forEach(file => {
    if (VALID_EXTS.has(path.extname(file).toLowerCase())) {
      const filePath = path.join(IMG_DIR, dir.name, file);
      const thumb = getThumbUrl(filePath);
      const item = { path: '/images/' + dir.name + '/' + file, name: file, group: dir.name };
      if (thumb) item.thumb = thumb;
      images.push(item);
    }
  });
});

// 根目录下的散落图片
fs.readdirSync(IMG_DIR).forEach(f => {
  const fp = path.join(IMG_DIR, f);
  if (fs.statSync(fp).isFile() && VALID_EXTS.has(path.extname(f).toLowerCase())) {
    const thumb = getThumbUrl(fp);
    const item = { path: '/images/' + f, name: f, group: '(root)' };
    if (thumb) item.thumb = thumb;
    images.push(item);
  }
});

const index = { images, total: images.length };
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
console.log('  images_index.json 已更新: ' + images.length + ' 张图片');
  console.log('  缩略图字段已写入');

// === 2. 更新 data.json 中键盘的图片路径 ===
console.log('');
console.log('=== 2. 更新键盘作品图片 ===');

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const kbs = data.keyboards;

// 按工作室分组磁盘上的图片文件
const studioFiles = {};
dirs.forEach(dir => {
  studioFiles[dir.name] = fs.readdirSync(path.join(IMG_DIR, dir.name))
    .filter(f => VALID_EXTS.has(path.extname(f).toLowerCase()));
});

let matched = 0;
let skipped = 0;
let unmatched = 0;

kbs.forEach(kb => {
  // 已有图片的跳过，不覆盖手动编辑
  if (kb.image || (Array.isArray(kb.images) && kb.images.length > 0)) {
    skipped++;
    return;
  }
  // 找到对应的工作室文件夹
  const dirName = Object.keys(studioFiles).find(d => d.toLowerCase() === kb.studio.toLowerCase());
  if (!dirName) { unmatched++; return; }

  const files = studioFiles[dirName];
  if (!files || files.length === 0) { unmatched++; return; }

  // 按键盘名称匹配图片
  const kbName = kb.name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff\s]/g, '').trim();
  
  const matchedFiles = files.filter(f => {
    const fName = path.parse(f).name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff\s]/g, '').trim();
    return fName === kbName || fName.includes(kbName) || kbName.includes(fName)
      || kbName.split(/\s+/).some(word => word.length > 2 && fName.includes(word));
  });

  if (matchedFiles.length > 0) {
    kb.images = matchedFiles.map(f => '/images/' + dirName + '/' + f);
    matched++;
  } else {
    kb.images = [];
    unmatched++;
  }
});

data.keyboards = kbs;
const dataText = JSON.stringify(data, null, 2);
fs.writeFileSync(DATA_FILE, dataText, 'utf-8');
console.log('  data.json 已更新');
  console.log('  已有图片已跳过: ' + skipped);
  console.log('  新匹配图片的键盘: ' + matched);
  console.log('  无匹配图片的键盘: ' + unmatched);

// === 3. 生成 data-meta.json（前端缓存校验用）===
const hash = crypto.createHash('sha256').update(dataText).digest('hex');
const meta = {
  hash: 'sha256-' + hash,
  generatedAt: new Date().toISOString()
};
fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf-8');
console.log('');
console.log('=== 3. 生成数据版本信息 ===');
console.log('  data-meta.json 已更新');
console.log('  hash: ' + meta.hash);

console.log('');
console.log('=== 完成 ===');
console.log('提示: 如果匹配不准确, 可以在管理页面手动编辑键盘作品的图片');
