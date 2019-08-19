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
    const datas = row.cells;
    Object.values(books[0]).map((value, i) => {
      datas[i].innerHTML = value;
      return value;
    });
    row.querySelector('.edit-controls').remove();
    row.insertAdjacentHTML(
      'beforeend',
      `
      <td>
        <button class="edit-book green-btn">Edit</button>
        <button class="is-read">Is read ?</button>
        <button class="remove-book">Delete</button>
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
        <button class="edit-book green-btn">Edit</button>
        <button class="is-read">Is read ?</button>
        <button class="remove-book">Delete</button>
      </td>
    `;
    tr.insertAdjacentHTML('afterbegin', bookInfo);
    view.append(tr);
  });
}

function editBook(row) {
  const currentBook = myLibrary[row.dataset.index];
  const tr = document.createElement('tr');
  const cells = `
    <td><input type="text" id="title" name="title" size="1" value="${currentBook.title}"></td>
    <td><input type="text" id="author" name="author" size="1" value="${currentBook.author}"></td>
    <td><input type="number" id="pages" name="pages" min=0 value="${currentBook.pages}"></td>
    <td>${currentBook.read}</td>
  `;
  const editControls = `
    <td class="edit-controls">
      <button class="save green-btn">Save</button>
      <button class="is-read">Is read ?</button>
      <button class="remove-book">Delete</button>
    </td>
  `;
  tr.insertAdjacentHTML('afterbegin', cells + editControls);
  tr.dataset.index = row.dataset.index;
  row.replaceWith(tr);
  tr.querySelector('input').focus();
  tr.querySelector('.save').onclick = () => {
    currentBook.title = tr.querySelector('#title').value;
    currentBook.author = tr.querySelector('#author').value;
    currentBook.pages = tr.querySelector('#pages').value;
    render([currentBook], tr);
  };
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
    <td><input type="checkbox" id="read" name="read"></td>
  `;
  const editControls = `
    <td class="edit-controls">
      <button class="edit-add  green-btn">Add</button>
      <button class="edit-cancel">Delete</button>
    </td>
  `;
  tr.insertAdjacentHTML('afterbegin', cells + editControls);
  view.append(tr);
  tr.querySelector('input').focus();
  tr.querySelector('.edit-cancel').onclick = () => {
    tr.remove();
  };

  tr.querySelector('.edit-add').onclick = () => {
    addBookToLibrary(tr);
    tr.dataset.index = myLibrary.length - 1;
    render([myLibrary[myLibrary.length - 1]], tr);
  };
};

// "Remove book" feature & "Toggle Read" feature & "Edit book"
view.onclick = (event) => {
  const myTarget = event.target;
  const row = myTarget.closest('tr');

  switch (myTarget.className) {
    case 'remove-book':
      myLibrary.splice(row.dataset.index, 1);
      row.remove();
      Array.from(view.rows).forEach((tr, i) => {
        tr.dataset.index = i;
      });
      break;
    case 'is-read': {
      const myBook = myLibrary[row.dataset.index];
      const readCell = Array.from(row.cells).find(td => td.innerHTML === myBook.read);
      myBook.readStatus();
      readCell.innerHTML = myBook.read;
      break;
    }
    case 'edit-book green-btn':
      editBook(row);
      break;
    default:
  }
};

render(myLibrary);
