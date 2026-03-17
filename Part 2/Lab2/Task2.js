const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sem_02_labrab_01.csv');

const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');

lines.forEach((line, index) => {
    const nums = line.trim().split(/\s+/).map(Number);

    const freq = {};
    for (const n of nums) {
        freq[n] = (freq[n] || 0) + 1;
    }

    const tripleNumbers = Object.keys(freq).filter(k => freq[k] === 3).map(Number);

    const restNumbers = nums.filter(n => !tripleNumbers.includes(n) || nums.filter(x => x === n).length !== 3);

    if (tripleNumbers.length === 1 && restNumbers.length === nums.length - 3) {
        const sumRest = restNumbers.reduce((a, b) => a + b, 0);
        const avgRest = sumRest / restNumbers.length;

        if (tripleNumbers[0] > avgRest) {
            console.log(`${index + 1} ${nums.join(' ')}`);
        }
    }
});