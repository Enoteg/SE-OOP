const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введите первое число: ', (a) => {
    rl.question('Введите второе число:', (b) => {
        rl.question('Введите третье число:', (c) => {
            let nums = [a, b, c].map(Number);
            let minIndex = nums.indexOf(Math.min(... nums));
            nums.splice(minIndex, 1);
            let result = nums.reduce((sum, current) => sum + current, 0);
            rl.close();
            console.log(result);
        });
    });
});