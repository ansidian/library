/** Modal Functionality */

const modal = document.querySelector(".book-modal");
const overlay = document.querySelector(".book-overlay");
const openForm = document.querySelector(".book-add-btn");
const closeForm = document.querySelector(".book-close-btn");

// close modal function
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// close modal when the close button  is pressed
closeForm.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// open modal function
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
// open modal event
openForm.addEventListener("click", openModal);

/** Library Management */

const myLibrary = [];

function Book(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = false;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? "has been read." : "not read yet."}`
}

Book.prototype.toggleRead = function () {
    this.isRead = !this.isRead;
}

Book.prototype.removeBook = function () {
    const index = myLibrary.indexOf(this);
    if (index !== -1) {
        myLibrary.splice(index, 1);
        displayBooks();
    }
}

function addBookToLibrary(title, author, pages, isRead) {
    const book = new Book(title, author, pages);
    book.isRead = isRead;
    myLibrary.push(book);
    closeModal();
    displayBooks();
}

function displayBooks() {
    const bookList = document.getElementById('libraryDisplay')
    bookList.innerHTML = '';

    myLibrary.forEach((book, index) => {
        const bookCard = document.createElement('div');
        bookCard.dataset.index = String(index);
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <p>Status: ${book.isRead ? "Read" : "Not Read"}</p></p>
            <button class="toggle-read">${book.isRead ? "Mark as Unread" : "Mark as Read"}</button>
            <button class="remove-book">Delete</button>
        `;

        const toggleRead = bookCard.querySelector('.toggle-read');
        const removeBook = bookCard.querySelector('.remove-book');

        toggleRead.addEventListener('click', () => {
            const index = parseInt(bookCard.dataset.index)
            myLibrary[index].toggleRead();
            displayBooks();
        });

        removeBook.addEventListener('click', () => {
            const index = parseInt(bookCard.dataset.index);
            myLibrary[index].removeBook();
            displayBooks();
        });
        bookList.appendChild(bookCard);
    });
}

document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const isRead = document.getElementById('read').checked;

    addBookToLibrary(
        document.getElementById('title').value,
        document.getElementById('author').value,
        document.getElementById('pages').value,
        isRead
    );
    document.getElementById('bookForm').reset();
});

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295)
addBookToLibrary("The Lord of the Rings", "J.R.R. Tolkien", 1216)
addBookToLibrary("The Silmarillion", "J.R.R. Tolkien", 365)
addBookToLibrary("The Fellowship of the Ring", "J.R.R. Tolkien", 423)