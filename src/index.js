// import saad from './modules/modal';

const view = document.getElementById('root');
const viewBody = view.querySelector('table tbody');
const newBook = document.getElementById('newBook');
// Store new book objects from user input in an array
const myLibrary = [];

function Book(title = '', author = '', pages = 0, read = 'not read yet') {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Book.prototype.info = function () {
//   return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
// };

const book1 = new Book('JavaScript', 'Saad Tarhi', 350, 'not read yet');
const book2 = new Book('CSS', 'Saad Tarhi', 350, 'not read yet');
myLibrary.push(book1, book2);

/**
 * I want to click on "New book" and get a new "tr" with "td's" as "inputs"
 * Then, have two buttons "Ok/Cancel"
 * The "Ok" button will save changes:
 * 1- Add "book" object to "myLibrary" array
 * 2- Edit the "innerHTML" of "TD" to remove "inputs" and keep only their "values"
 */
function addBookToLibrary(element) {
  const tr = document.createElement('tr');
  element.append(tr);
}

function render(books) {
  books.forEach((book) => {
    const tr = document.createElement('tr');
    const bookInfo = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>${book.read}</td>
    `;
    tr.insertAdjacentHTML('afterbegin', bookInfo);
    viewBody.append(tr);
  });
}

newBook.onclick = () => {
  // render([new Book()]);
  addBookToLibrary(viewBody);
};

render(myLibrary);
