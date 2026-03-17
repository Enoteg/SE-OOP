const fs = require('fs');

let str = fs.readFileSync('task_03.txt', 'utf-8').trim();

let regex = /[1-9A-F][0-9A-F]*[02468ACE]|0/g;
let matches = str.match(regex) || [];

if (matches.length === 0) {
    console.log('Ничего не найдено');
    return;
}

let maxLen = Math.max(...matches.map(s => s.length));

let candidates = matches.filter(s => s.length === maxLen);

let maxValue = candidates.reduce((max, curr) => {
    return BigInt('0x' + curr) > BigInt('0x' + max) ? curr : max;
});

console.log(maxValue);