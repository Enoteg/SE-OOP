const http = require('http');
const { readDataCsv } = require('./moduleReadData');
const { generateCSV } = require('./dataGenerator'); 
const url = require('url');
const HOST = 'localhost';
const PORT = 3000;

const onEvent = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const filename = parsedUrl.pathname.slice(1);
    
    if (req.method === 'POST' && filename === 'labrab_01_result.csv') {
        generateCSV('./files/labrab_01_result.csv');
        res.writeHead(302, { 'Location': '/labrab_01_result.csv' });
        res.end();
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    if (!filename || filename === '') {
        res.write('<h1>Лабораторная работа</h1>');
        res.write('<p>Доступные отчеты:</p>');
        res.write('<ul><li><a href="/labrab_01_result.csv">Отчет по распределению</a></li></ul>');
        return res.end();
    }

    if (!filename.endsWith('.csv')) {
        res.write('<p>Укажите CSV файл в запросе</p>');
        return res.end();
    }

    try {
        const { ranges, data } = readDataCsv(`./files/${filename}`);
        
        if (ranges.length === 0 || data.length === 0) {
            res.write('<p>Файл пуст или содержит некорректные данные</p>');
            return res.end();
        }

        res.write('<h1>Отчет по распределению случайных чисел</h1>');
        
        res.write(`
            <form method="POST" action="/labrab_01_result.csv" style="margin-bottom: 20px;">
                <button type="submit" style="padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Перегенерировать данные
                </button>
            </form>
        `);
        
        res.write('<table border="1" style="border-collapse: collapse; margin: 20px 0;">');
        
        res.write('<tr><th style="padding: 8px;">Цифра</th>');
        ranges.forEach(range => {
            res.write(`<th style="padding: 8px;">${range}</th>`);
        });
        res.write('</tr>');
        
        data.forEach(row => {
            res.write('<tr>');
            res.write(`<td style="padding: 8px; text-align: center;">${row.digit}</td>`);
            row.deviations.forEach(deviation => {
                res.write(`<td style="padding: 8px; text-align: center;">${deviation}%</td>`);
            });
            res.write('</tr>');
        });
        
        res.write('</table>');
        res.write('<p><a href="/">Назад</a></p>');

    } catch (err) {
        res.write(`<p>Ошибка: ${err.message}</p>`);
    }
    res.end();
}

const server = http.createServer(onEvent);
server.listen(PORT, () => console.log(`http://${HOST}:${PORT}/`));