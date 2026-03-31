const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "sem_02_labrab_01.csv");

const lines = fs.readFileSync(filePath, "utf8").trim().split("\n");

function isAllOdd(arr) {
    return arr.every(n => n % 2 === 1);
}

function isUnique(arr) {
    return new Set(arr).size === arr.length;
}

function isSorted(arr) {
    const sorted = arr.toSorted((a, b) => a - b);
    return arr.every((n, i) => n === sorted[i]);
}

console.log("Строка".padEnd(8) + "Числа");
console.log("-".repeat(30));

lines.forEach((line, index) => {
    const nums = line.trim().split(/\s+/).map(Number);

    if (isAllOdd(nums) && isUnique(nums) && isSorted(nums)) {
        console.log(String(index + 1).padEnd(8) + nums.join(" "));
    }
});