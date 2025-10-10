const fs = require('fs');

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

// Генерируем данные
const ranges = [1e2, 1e4, 1e6, 1e8];
const results = Object.fromEntries(ranges.map(range => [range, generateData(range)]));

// Вывод таблицы
console.log("Процент отклонения от идеального распределения:");
console.log('i    ' + ranges.map(r => `10**${Math.log10(r)}`).join('\t'));
console.log('-'.repeat(50));

for (let i = 1; i <= 9; i++) {
  const row = [i, ...ranges.map(r => results[r][i] + '%')].join('\t');
  console.log(row);
}

// Сохранение в CSV
const csv = ['i,' + ranges.join(',')];
for (let i = 1; i <= 9; i++) {
  csv.push(i + ',' + ranges.map(r => results[r][i]).join(','));
}
fs.writeFileSync('labrab_01_result.csv', csv.join('\n'));
console.log('\nФайл labrab_01_result.csv сохранен');