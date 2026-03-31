const args = process.argv.slice(2);
const Library = require('./modules/Library');
const library = new Library();

const command = args[0];
const readline = require('readline');

const COMMANDS = [
    { cmd: 'help', desc: 'Показать список команд' },
    { cmd: 'addBook "title" "author" "isbn" amount', desc: 'Добавить книгу' },
    { cmd: 'addUser "firstName" "lastName" cardNumber', desc: 'Добавить пользователя' },
    { cmd: 'issueBook cardNumber isbn', desc: 'Выдать книгу пользователю' },
    { cmd: 'returnBook cardNumber isbn', desc: 'Вернуть книгу от пользователя' },
    { cmd: 'listBooks', desc: 'Показать список всех книг' },
    { cmd: 'listUsers', desc: 'Показать список всех пользователей' }
];

function printHelp() {
    console.log('Library CLI — доступные команды:');
    for (const c of COMMANDS) {
        console.log('  ', c.cmd.padEnd(40), ' — ', c.desc);
    }
    console.log('\nПримеры:');
    console.log('  node libraryCLI.js addBook "Война и мир" "Толстой" 9780140447934 2');
    console.log('  node libraryCLI.js addUser "Иван" "Иванов" 1001');
    console.log('  node libraryCLI.js issueBook 1001 9780140447934');
}

function exitErr(msg) {
    if (msg) console.error(msg);
    console.error('Для списка команд: help');
    process.exit(1);
}

function parseInput(line) {
    const re = /"([^"]+)"|'([^']+)'|(\S+)/g;
    const tokens = [];
    let m;
    while ((m = re.exec(line)) !== null) {
        if (m[1] !== undefined) tokens.push(m[1]);
        else if (m[2] !== undefined) tokens.push(m[2]);
        else if (m[3] !== undefined) tokens.push(m[3]);
    }
    return tokens;
}

async function runCommand(cmdArgs) {
    const cmd = cmdArgs[0];
    try {
        switch (cmd) {
            case 'addBook': {
                if (!cmdArgs[1] || !cmdArgs[2] || !cmdArgs[3] || !cmdArgs[4]) return console.error('Использование: addBook "title" "author" "isbn" amount');
                library.addBook(cmdArgs[1], cmdArgs[2], cmdArgs[3], Number(cmdArgs[4]));
                console.log('Книга добавлена');
                break;
            }
            case 'addUser': {
                if (!cmdArgs[1] || !cmdArgs[2]) return console.error('Использование: addUser "firstName" "lastName" [cardNumber]');
                const assigned = library.addUser(cmdArgs[1], cmdArgs[2], cmdArgs[3]);
                console.log(`Пользователь добавлен. Номер карты: ${assigned}`);
                break;
            }
            case 'issueBook': {
                if (!cmdArgs[1] || !cmdArgs[2]) return console.error('Использование: issueBook cardNumber isbn');
                library.issueBook(cmdArgs[1], cmdArgs[2]);
                console.log('Книга выдана');
                break;
            }
            case 'returnBook': {
                if (!cmdArgs[1] || !cmdArgs[2]) return console.error('Использование: returnBook cardNumber isbn');
                library.returnBook(cmdArgs[1], cmdArgs[2]);
                console.log('Книга возвращена');
                break;
            }
            case 'listBooks': {
                const books = library.getBooks();
                if (books.length === 0) { console.log('Список книг пуст'); break; }
                books.forEach(b => {
                    console.log(`${b.title} | ${b.author} | ${b.isbn} | Всего: ${b.total} | Выдано: ${b.issued}`);
                });
                break;
            }
            case 'listUsers': {
                const users = library.getUsers();
                if (users.length === 0) { console.log('Список пользователей пуст'); break; }
                users.forEach(u => {
                    console.log(`${u.firstName} ${u.lastName} | ${u.cardNumber} | Книг взято: ${u.books.length}`);
                });
                break;
            }
            case 'help':
                printHelp();
                break;
            case 'exit':
            case 'quit':
                console.log('Выход...');
                process.exit(0);
            default:
                console.error(`Неизвестная команда: ${cmd}`);
        }
    } catch (err) {
        console.error('Ошибка:', err && err.message ? err.message : err);
    }
}

if (!command) {
    printHelp();
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'library> ' });
    rl.prompt();

    rl.on('line', async (line) => {
        const trimmed = line.trim();
        if (!trimmed) { rl.prompt(); return; }
        const parts = parseInput(trimmed);
        await runCommand(parts);
        rl.prompt();
    }).on('SIGINT', () => {
        console.log('^C');
        rl.close();
    });

    return;
}

if (command) {
    (async () => {
        await runCommand(args);
        process.exit(0);
    })();
}