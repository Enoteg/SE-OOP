class User {
    #books = [];

    constructor(firstName, lastName, cardNumber) {
        if (!firstName || !lastName || !cardNumber) throw new Error("Имя, фамилия и номер читательского билета обязательны");
        this.firstName = firstName;
        this.lastName = lastName;
        this.cardNumber = cardNumber;
    }

    takeBook(isbn) {
        if (this.#books.length >= 5) throw new Error("Пользователь не может взять больше 5 книг");
        this.#books.push(isbn);
    }

    returnBook(isbn) {
        const index = this.#books.indexOf(isbn);
        if (index === -1) throw new Error("Книга не найдена у пользователя");
        this.#books.splice(index, 1);
    }

    getBooks() {
        return [...this.#books];
    }

    toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            cardNumber: this.cardNumber,
            books: this.getBooks()
        };
    }
}

module.exports = User;