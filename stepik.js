const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введите первое число: ', (a) => {
    rl.question('Введите второе число: ', (b) => {
        let aNums = a.split('').map(Number);
        let bNums = b.split('').map(Number);
        let result = (aNums.concat(bNums)).reduce((sum, current) => sum + current, 0);
        rl.close();
        console.log(result);
    });
});
