class Book {
    #title;
    #author;
    #isbn;
    #totalBooks;
    #issuedBooks;

    constructor(title, author, isbn, totalBooks = 1) {
        if (!title || !author) throw new Error("Название и автор обязательны");
        if (!Book.validateISBN(isbn)) throw new Error("Некорректный ISBN");
        if (totalBooks < 0) throw new Error("Количество книг не может быть отрицательным");

        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#totalBooks = totalBooks;
        this.#issuedBooks = 0;
    }

    getTitle() { return this.#title; }
    getAuthor() { return this.#author; }
    getISBN() { return this.#isbn; }
    getTotalBooks() { return this.#totalBooks; }
    getIssuedBooks() { return this.#issuedBooks; }
    getAvailableCount() { return this.#totalBooks - this.#issuedBooks; }

    issueBook() {
        if (this.getAvailableCount() <= 0) throw new Error("Нет доступных книг для выдачи");
        this.#issuedBooks++;
    }

    returnBook() {
        if (this.#issuedBooks <= 0) throw new Error("Нет выданных книг для возврата");
        this.#issuedBooks--;
    }

    addCopies(count) {
        if (count <= 0) throw new Error("Количество копий должно быть положительным");
        this.#totalBooks += count;
    }

    toJSON() {
        return {
            title: this.#title,
            author: this.#author,
            isbn: this.#isbn,
            totalBooks: this.#totalBooks,
            issuedBooks: this.#issuedBooks
        };
    }

    static validateISBN(isbn) {
        const re = /^(97(8|9))?\d{9}(\d|X)$/;
        return typeof isbn === "string" && re.test(isbn);
    }
}

module.exports = Book;