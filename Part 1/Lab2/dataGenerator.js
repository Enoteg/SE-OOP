const fs = require('fs');
const path = require('path');

const generateData = (range) => {
  const counts = {};
  for (let i = 0; i < range; i++) {
    const n = Math.floor(Math.random() * 9) + 1;
    counts[n] = (counts[n] || 0) + 1;
  }
  
  const expected = 100 / 9;
  const deviations = {};
  
  for (let i = 1; i <= 9; i++) {
    const diff = Math.abs((counts[i] / range * 100) - expected);
    deviations[i] = diff.toFixed(2);
  }
  
  return deviations;
};

const generateCSV = (filePath) => {
  const ranges = [1e2, 1e4, 1e6, 1e8];
  const results = Object.fromEntries(ranges.map(range => [range, generateData(range)]));

  const csv = ['i,' + ranges.join(',')];
  for (let i = 1; i <= 9; i++) {
    csv.push(i + ',' + ranges.map(r => results[r][i]).join(','));
  }
  
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, csv.join('\n'));
  console.log(`Файл ${filePath} перегенерирован`);
};

module.exports = { generateCSV };