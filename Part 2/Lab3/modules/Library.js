const fs = require('fs');
const path = require('path');

class Library {
  constructor(filePath = 'library.json') {
    this.filePath = path.resolve(filePath);
    this.data = { books: [], users: [] };
    this._load();
  }

  _load() {
    try {
      if (!fs.existsSync(this.filePath)) return;
      const raw = fs.readFileSync(this.filePath, 'utf8');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') this.data = parsed;
    } catch (e) {
      // ignore bad file
    }
  }

  _save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  // Books: { title, author, isbn, total, issued }
  addBook(title, author, isbn, amount = 1) {
    const b = this.data.books.find(x => x.isbn === String(isbn));
    if (b) {
      b.total += Number(amount || 0);
    } else {
      this.data.books.push({ title, author, isbn: String(isbn), total: Number(amount || 0), issued: 0 });
    }
    this._save();
  }

  getBooks() {
    return this.data.books;
  }

  // Users: { firstName, lastName, cardNumber, books: [isbn] }
  addUser(firstName, lastName, cardNumber) {
    const cn = cardNumber ? String(cardNumber) : this._nextCardNumber();
    if (this.data.users.find(u => u.cardNumber === cn)) throw new Error('card exists');
    const user = { firstName, lastName, cardNumber: cn, books: [] };
    this.data.users.push(user);
    this._save();
    return cn;
  }

  _nextCardNumber() {
    let max = 1000;
    for (const u of this.data.users) {
      const n = parseInt(u.cardNumber, 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return String(max + 1);
  }

  getUsers() {
    return this.data.users;
  }

  findUser(cardNumber) {
    return this.data.users.find(u => u.cardNumber === String(cardNumber));
  }

  findBook(isbn) {
    return this.data.books.find(b => b.isbn === String(isbn));
  }

  issueBook(cardNumber, isbn) {
    const user = this.findUser(cardNumber);
    const book = this.findBook(isbn);
    if (!user) throw new Error('user not found');
    if (!book) throw new Error('book not found');
    if (book.issued >= book.total) throw new Error('no copies');
    book.issued += 1;
    user.books.push(String(isbn));
    this._save();
  }

  returnBook(cardNumber, isbn) {
    const user = this.findUser(cardNumber);
    const book = this.findBook(isbn);
    if (!user) throw new Error('user not found');
    if (!book) throw new Error('book not found');
    const idx = user.books.indexOf(String(isbn));
    if (idx === -1) throw new Error('user does not have this book');
    user.books.splice(idx, 1);
    book.issued = Math.max(0, book.issued - 1);
    this._save();
  }
}

module.exports = Library;