const log = console.log;

const addRand = () => Math.floor(Math.random() * 9) + 1; 
const listRange = [10**2, 10**4, 10**6, 10**8];

for (const range of listRange) {
  const counts = {};
  for (let i = 0; i < range; i++) {
    const n = addRand();
    counts[n] = (counts[n] || 0) + 1;
  }

  const expectedPercent = 100 / 9; 
  const deviations = {};

  for (let i = 1; i <= 9; i++) {
    const freq = counts[i];
    const diffPercent = (freq / range * 100) - expectedPercent; 
    const absDiff = Math.abs(diffPercent); 
    deviations[i] = absDiff.toFixed(4) + "%"; 
  }

  log(`Размер массива: ${range}`);
  log("Ожидаемое значение (процент):", expectedPercent.toFixed(4) + "%");
  log("Абсолютные отклонения по каждому числу (в %):", deviations);
  log("___________________________________________");
}
