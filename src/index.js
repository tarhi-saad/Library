import './style.css';

const view = document.getElementById('root');
const viewBody = view.querySelector('table tbody');
const newBookButton = document.getElementById('new-book-button');
// Store new book objects from user input in an array
const myLibrary = [];

function Book(title = '', author = '', pages = 0, read = 'not read yet') {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

const book1 = new Book('JavaScript', 'Saad Tarhi', 350, 'not read yet');
const book2 = new Book('CSS', 'Saad Tarhi', 350, 'not read yet');
myLibrary.push(book1, book2);

/**
 * I want to click on "New book" and get a new "tr" with "td's" as "inputs"
 * Then, have two buttons "Ok/Cancel"
 * The "Ok" button will save changes:
 * 1- Add "book" object to "myLibrary" array
 * 2- Edit the "innerHTML" of "TD" to remove "inputs" and keep only their "values"
 * TODO: Refractor the code
 * * A function must do a single task
 * * we have two functions to refractor (render & addBookToLibrary)
 * * addBookToLibrary => Add book to library + render the result
 * TODO: Add the feature => Edit book
 */
function addBookToLibrary(row) {
  const book = new Book();
  book.title = row.querySelector('#title').value;
  book.author = row.querySelector('#author').value;
  book.pages = row.querySelector('#pages').value;
  book.read = row.querySelector('#read').checked;
  myLibrary.push(book);
}

function addToTable(element) {
  const tr = document.createElement('tr');
  const cells = `
    <td><input type="text" id="title" name="title" size="1"></td>
    <td><input type="text" id="author" name="author" size="1"></td>
    <td><input type="number" id="pages" name="pages" min=0></td>
    <td align="center"><input type="checkbox" id="read" name="read"></td>
  `;
  const editControls = `
    <div class="edit-controls">
      <button class="edit-ok">OK</button>
      <button class="edit-cancel">CANCEL</button>
    </div>
  `;
  tr.insertAdjacentHTML('afterbegin', cells + editControls);
  element.append(tr);

  tr.querySelector('.edit-cancel').onclick = () => {
    tr.remove();
  };

  tr.querySelector('.edit-ok').onclick = () => {
    addBookToLibrary(tr);
    const tds = tr.querySelectorAll('td');
    Object.values(myLibrary[myLibrary.length - 1]).map((value, i) => {
      tds[i].innerHTML = value;
      return value;
    });
    tr.querySelector('.edit-controls').remove();
  };
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

newBookButton.onclick = () => {
  // render([new Book()]);
  addToTable(viewBody);
};

render(myLibrary);
