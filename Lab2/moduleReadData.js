const { readFileSync } = require('fs');

const readDataCsv = (filename) => {
    try {
        const content = readFileSync(filename, 'utf8');
        const lines = content.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length === 0) return [];
        
        const header = lines[0];
        const ranges = header.split(',').slice(1).map(val => parseInt(val.trim()));
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length > 1) {
                const row = {
                    digit: parseInt(values[0]),
                    deviations: values.slice(1).map(val => parseFloat(val))
                };
                data.push(row);
            }
        }
        
        return { ranges, data };
    } catch (error) {
        console.error('Ошибка чтения файла:', error.message);
        return { ranges: [], data: [] };
    }
}

module.exports = { readDataCsv };