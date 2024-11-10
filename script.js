/** Modal Functionality */

const modal = document.querySelector(".book-modal");
const overlay = document.querySelector(".book-overlay");
const openForm = document.querySelector(".book-add-btn");
const closeForm = document.querySelector(".book-close-btn");
const filter = document.querySelectorAll(".filter-item input[type='radio']");

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
    updateBookArrays(this);
    updateView();
}

function updateBookArrays(book) {
    if (book.isRead) {
        readBooks.push(book);
        unreadBooks.splice(unreadBooks.indexOf(book), 1);
    } else if (!book.isRead) {
        unreadBooks.push(book);
        readBooks.splice(readBooks.indexOf(book), 1);
    }
}

function updateView() {
    switch (getCurrentFilter()) {
        case "unread":
            displayBooks(unreadBooks);
            break;
        case "read":
            displayBooks(readBooks);
            break;
        default:
            displayBooks(myLibrary);
    }
}

Book.prototype.removeBook = function () {
    const myLibraryIndex = myLibrary.indexOf(this);
    const readIndex = readBooks.indexOf(this);
    const unreadIndex = unreadBooks.indexOf(this);

    if (getCurrentFilter() === "unread" && unreadIndex !== -1) {
        unreadBooks.splice(unreadIndex, 1);
        myLibrary.splice(myLibraryIndex, 1);
    } else if (getCurrentFilter() === "read" && readIndex !== -1) {
        readBooks.splice(readIndex, 1);
        myLibrary.splice(myLibraryIndex, 1);
    } else if (getCurrentFilter() === "all" && myLibraryIndex !== -1) {
        myLibrary.splice(myLibraryIndex, 1);
        if (this.isRead && readIndex !== -1) {
            readBooks.splice(readIndex, 1);
        } else if (!this.isRead && unreadIndex !== -1) {
            unreadBooks.splice(unreadIndex, 1);
        }
    }
    updateView();
}

function addBookToLibrary(title, author, pages, isRead) {
    const book = new Book(title, author, pages);
    book.isRead = isRead;

    myLibrary.push(book)

    if (book.isRead) {
        readBooks.push(book);
    } else if (!book.isRead) {
        unreadBooks.push(book);
    }
    closeModal();
    updateView();
}

const myLibrary = [];
const unreadBooks = myLibrary.filter((book) => !book.isRead);
const readBooks = myLibrary.filter((book) => book.isRead);

function displayBooks(filter) {
    const bookList = document.getElementById('libraryDisplay')
    bookList.innerHTML = '';

    filter.forEach((book) => {
        const bookCard = document.createElement('div');
        bookCard.dataset.index = String(myLibrary.indexOf(book));
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
                <div class="card-content">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Pages: ${book.pages}</p>
                    <p>Status: ${book.isRead ? "Read ✅" : "Unread ❌"}</p></p>
                    <button class="toggle-read ${book.isRead ? "read" : "not-read"}"> ${book.isRead ? "Mark as Unread" : "Mark as Read"}</button>
                    <button class="remove-book">Delete</button>
                </div>
            `;

        const toggleRead = bookCard.querySelector('.toggle-read');
        const removeBook = bookCard.querySelector('.remove-book');

        toggleRead.addEventListener('click', () => {
            const index = parseInt(bookCard.dataset.index)
            myLibrary[index].toggleRead();
        });

        removeBook.addEventListener('click', () => {
            const index = parseInt(bookCard.dataset.index);
            myLibrary[index].removeBook(index);
        });
        bookList.appendChild(bookCard);
    });
}

document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    addBookToLibrary(
        document.getElementById('title').value,
        document.getElementById('author').value,
        document.getElementById('pages').value,
        document.getElementById('isRead').checked
    );
    document.getElementById('bookForm').reset();
});

/*0*/
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
/*1*/
addBookToLibrary("Dune", "Frank Herbert", 412, false);
/*2*/
addBookToLibrary("1984", "George Orwell", 328, true);
/*3*/
addBookToLibrary("Pride and Prejudice", "Jane Austen", 432, true);
/*4*/
addBookToLibrary("The Name of the Wind", "Patrick Rothfuss", 662, false);
/*5*/
addBookToLibrary("The Road", "Cormac McCarthy", 287, false);
/*6*/
addBookToLibrary("Neuromancer", "William Gibson", 271, true);
/*7*/
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
/*8*/
addBookToLibrary("Foundation", "Isaac Asimov", 244, true);

function getCurrentFilter() {
    const filter = document.querySelectorAll(".filter-item input[type='radio']:checked");
    return filter[0].value;
}

filter.forEach((item) => {
    item.addEventListener("change", () => {
        switch (item.value) {
            case "all":
                displayBooks(myLibrary);
                break;
            case "unread":
                displayBooks(unreadBooks);
                break;
            case "read":
                displayBooks(readBooks);
                break;
        }
    });
});

displayBooks(myLibrary)

