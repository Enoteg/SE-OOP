const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHtml(url) {
  const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return res.data;
}

function normalizeText(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function tableToJson($, table) {
  const headers = [];
  $(table).find('thead tr th').each((i, th) => headers.push(normalizeText($(th).text())));
  if (headers.length === 0) {
    $(table).find('tr').first().find('th,td').each((i, cell) => headers.push(normalizeText($(cell).text())));
  }

  const rows = [];
  $(table).find('tbody tr').each((ri, tr) => {
    const cells = $(tr).find('td');
    if (cells.length === 0) return; 
    const obj = {};
    cells.each((ci, td) => {
      const h = headers[ci] || `col${ci}`;
      obj[h] = normalizeText($(td).text());
    });
    rows.push(obj);
  });

  return { headers, rows };
}

async function parseStandings(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // Prefer headers typical for Formula1 results pages
  const preferred = ['Grand Prix', 'Date', 'Winner', 'Team', 'Laps', 'Time', 'Points'];

  let best = null;
  let bestScore = -1;

  $('table').each((i, table) => {
    const { headers, rows } = tableToJson($, table);
    if (!headers || headers.length === 0 || rows.length === 0) return;
    const score = headers.reduce((s, h) => {
      if (preferred.find(p => new RegExp(p, 'i').test(h))) return s + 1;
      return s;
    }, 0);

    const metric = score * 1000 + headers.length;
    if (metric > bestScore) {
      bestScore = metric;
      best = { headers, rows };
    }
  });

  if (!best) {
    const t = $('table').filter((i, table) => tableToJson($, table).headers.length >= 4).first();
    if (t && t.length) {
      const out = tableToJson($, t);
      return out;
    }
    const first = $('table').first();
    return tableToJson($, first);
  }

  return best;
}

function toCsv(headers, rows) {
  const hdr = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const lines = [hdr];
  for (const r of rows) {
    const line = headers.map(h => {
      const v = r[h] ?? '';
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(',');
    lines.push(line);
  }
  return lines.join('\n');
}

async function main(argv) {
  const args = require('minimist')(argv.slice(2));
  const url = args.url || 'https://www.formula1.com/en/results/2025/races';
  const out = args.out || 'standings_formula1';
  const noWrite = args['no-write'] || args['no_write'] || false;

  try {
  console.log('Загружаю:', url);
  const { headers, rows } = await parseStandings(url);
  console.log(`Найдена таблица с ${headers.length} столбцами и ${rows.length} строками`);

    const csv = toCsv(headers, rows);
    const json = JSON.stringify(rows, null, 2);

    const lab7Dir = path.resolve(__dirname);
    const csvPath = path.join(lab7Dir, `${out}.csv`);
    const jsonPath = path.join(lab7Dir, `${out}.json`);

    if (!noWrite) {
      fs.mkdirSync(lab7Dir, { recursive: true });
      fs.writeFileSync(csvPath, csv, 'utf8');
      fs.writeFileSync(jsonPath, json, 'utf8');
      console.log(`Записаны файлы: ${csvPath} и ${jsonPath}`);
    } else {
      console.log('Режим без записи, превью первых 3 строк:');
      console.log(rows.slice(0,3));
      console.log(`(Если бы скрипт записывал, файлы были бы: ${csvPath} и ${jsonPath})`);
    }

    return { headers, rows };
  } catch (err) {
  console.error('Ошибка:', err.message);
    throw err;
  }
}

if (require.main === module) {
  main(process.argv).catch(() => process.exit(1));
}
