const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, 'public', 'data.json');
const META_FILE = path.join(__dirname, 'public', 'data-meta.json');

const dataText = fs.readFileSync(DATA_FILE, 'utf8');
const hash = crypto.createHash('sha256').update(dataText).digest('hex');
const meta = {
  hash: 'sha256-' + hash,
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf8');
console.log('data-meta.json 已更新');
console.log('hash: ' + meta.hash);
