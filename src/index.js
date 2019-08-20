import './style.css';

const view = document.getElementById('root');
const newBookButton = document.getElementById('new-book-button');
// Store new book objects from user input in an array
const myLibrary = [];

function Book(title = '', author = '', pages = 0, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.readStatus = function readStatus() {
  this.read = !this.read;
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
  book.read = row.querySelector('#read').checked;
  myLibrary.push(book);
}

function render(books, row = null) {
  // Render the last created book
  if (books.length === 1 && row !== null) {
    const datas = row.cells;
    Object.values(books[0]).map((value, i) => {
      if (typeof value === 'boolean') {
        datas[i].querySelector('#read').checked = value;
        return value;
      }

      datas[i].innerHTML = value;
      return value;
    });
    row.querySelector('.edit-controls').remove();
    row.insertAdjacentHTML(
      'beforeend',
      `
      <td>
        <button class="edit-book">Edit</button>
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
      <td>
        <label class="switch">
          <input type="checkbox" id="read" class="is-read" ${book.read ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <button class="edit-book">Edit</button>
        <button class="remove-book">Delete</button>
      </td>
    `;
    tr.insertAdjacentHTML('afterbegin', bookInfo);
    view.append(tr);
  });
}

function isValidInput(row) {
  const inputGroup = Array.from(row.querySelectorAll('input:not([type="checkbox"])'));
  const inputError = inputGroup.find(input => input.value === '');

  if (inputError !== undefined) {
    inputGroup.map((input) => {
      if (input === inputError) return input;
      input.classList.remove('required');
      return input;
    });
    inputError.classList.add('required');
    inputError.focus();
    return true;
  }
  return false;
}

function editBook(row) {
  const currentBook = myLibrary[row.dataset.index];
  const tr = document.createElement('tr');
  const cells = `
    <td><input type="text" id="title" name="title" size="1" value="${currentBook.title}"></td>
    <td><input type="text" id="author" name="author" size="1" value="${currentBook.author}"></td>
    <td><input type="number" id="pages" name="pages" min=0 value="${currentBook.pages}"></td>
    <td>
      <label class="switch">
        <input type="checkbox" id="read" class="is-read" ${currentBook.read ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </td>
  `;
  const editControls = `
    <td class="edit-controls">
      <button class="save green-btn">Save</button>
      <button class="remove-book">Delete</button>
    </td>
  `;
  tr.insertAdjacentHTML('afterbegin', cells + editControls);
  tr.dataset.index = row.dataset.index;
  row.replaceWith(tr);
  tr.querySelector('input').focus();
  tr.querySelector('.save').onclick = () => {
    if (isValidInput(tr)) return;

    currentBook.title = tr.querySelector('#title').value;
    currentBook.author = tr.querySelector('#author').value;
    currentBook.pages = tr.querySelector('#pages').value;
    currentBook.read = tr.querySelector('#read').checked;
    render([currentBook], tr);
  };
}

// User input
newBookButton.onclick = () => {
  if (view.querySelector('input[type="text"]')) {
    view.querySelector('input[type="text"]').focus();
    return;
  }

  const tr = document.createElement('tr');
  const cells = `
    <td><input type="text" id="title" name="title" size="1"></td>
    <td><input type="text" id="author" name="author" size="1"></td>
    <td><input type="number" id="pages" name="pages" min=0></td>
    <td>
      <label class="switch">
        <input type="checkbox" id="read" class="is-read">
        <span class="slider"></span>
      </label>
    </td>
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
    if (isValidInput(tr)) return;

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
      if (!row.dataset.index) return;

      const myBook = myLibrary[row.dataset.index];
      const readCell = Array.from(row.cells).find(td => td.querySelector('input'));
      myBook.readStatus();
      readCell.querySelector('input').checked = myBook.read;
      break;
    }
    case 'edit-book':
      editBook(row);
      break;
    default:
  }
};

render(myLibrary);
