let temperatures = require('fs')
    .readFileSync(0, 'utf8')
    .trim()
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => +line);

let maxTemp = Math.max(... temperatures);
console.log(maxTemp);