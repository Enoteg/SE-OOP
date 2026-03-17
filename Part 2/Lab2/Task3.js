const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sem_02_labrab_01.csv');

const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');

lines.forEach((line, index) => {
    const nums = line.trim().split(/\s+/).map(Number);

    const freq = new Map();
    for (const n of nums) {
        freq.set(n, (freq.get(n) || 0) + 1);
    }

    const doubles = [];
    const singles = [];
    for (const [num, count] of freq.entries()) {
        if (count === 2) doubles.push(Number(num));
        else if (count === 1) singles.push(Number(num));
    }

    if (doubles.length === 2 && doubles.length * 2 + singles.length === nums.length) {
        const sumDoubles = doubles.reduce((a, b) => a + b, 0);
        const sumSingles = singles.reduce((a, b) => a + b, 0);

        if (sumDoubles < sumSingles) {
            console.log(`${index + 1} ${nums.join(' ')}`);
        }
    }
});