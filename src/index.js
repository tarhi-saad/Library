import './style.css';

const view = document.getElementById('root');
const newBookButton = document.getElementById('new-book-button');
// Store new book objects from user input in an array
const myLibrary = [];

function Book(title = '', author = '', pages = 0, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read ? 'is read' : 'not read yet';
}

Book.prototype.readStatus = function readStatus() {
  if (this.read === 'is read') this.read = 'not read yet';
  else this.read = 'is read';
};

// this is just an example to fill our table. To delete later!
const book1 = new Book('JavaScript', 'Saad Tarhi', 350, false);
const book2 = new Book('CSS', 'Saad Tarhi', 350, false);
myLibrary.push(book1, book2);

function addBookToLibrary(row) {
  const book = new Book();
  book.title = row.querySelector('#title').value;
  book.author = row.querySelector('#author').value;
  book.pages = row.querySelector('#pages').value;
  book.read = row.querySelector('#read').checked ? 'is read' : 'not read yet';
  myLibrary.push(book);
}

function render(books, row = null) {
  // Render the last created book
  if (books.length === 1 && row !== null) {
    const datas = row.querySelectorAll('td');
    Object.values(books[0]).map((value, i) => {
      datas[i].innerHTML = value;
      return value;
    });
    row.querySelector('.edit-controls').remove();
    row.insertAdjacentHTML(
      'beforeend',
      `
      <td>
        <button class="remove-book">Remove</button>
        <button class="is-read">Is read ?</button>
      </td>
    `,
    );
    return;
  }

  // Render all books
  books.forEach((book, i) => {
    const tr = document.createElement('tr');
    tr.dataset.index = i;
    const bookInfo = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>${book.read}</td>
      <td>
        <button class="remove-book">Remove</button>
        <button class="is-read">Is read ?</button>
      </td>
    `;
    tr.insertAdjacentHTML('afterbegin', bookInfo);
    view.append(tr);
  });
}

// User input
newBookButton.onclick = () => {
  if (view.querySelector('input')) {
    view.querySelector('input').focus();
    return;
  }

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
  view.append(tr);
  tr.querySelector('input').focus();
  tr.querySelector('.edit-cancel').onclick = () => {
    tr.remove();
  };

  tr.querySelector('.edit-ok').onclick = () => {
    addBookToLibrary(tr);
    tr.dataset.index = myLibrary.length - 1;
    render([myLibrary[myLibrary.length - 1]], tr);
  };
};

// "Remove book" feature & "Toggle Read" feature
view.onclick = (event) => {
  const myTarget = event.target;
  const row = myTarget.closest('tr');

  if (myTarget.className === 'remove-book') {
    myLibrary.splice(row.dataset.index, 1);
    row.remove();
    view.querySelectorAll('tr').forEach((tr, i) => {
      tr.dataset.index = i;
    });
  } else if (myTarget.className === 'is-read') {
    const myBook = myLibrary[row.dataset.index];
    const readCell = Array.from(row.querySelectorAll('td')).find(
      td => td.innerHTML === myBook.read,
    );
    myBook.readStatus();
    readCell.innerHTML = myBook.read;
  }
};

render(myLibrary);
