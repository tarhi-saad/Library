import './style.css';
import { firestore, auth } from './modules/firebase.config';

const table = document.querySelector('table');
const emptyState = document.querySelector('.empty-state');
const view = document.getElementById('root');
const newBookButton = document.getElementById('new-book-button');
let user = auth.currentUser;
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

function populateStorage() {
  localStorage.setItem('library', JSON.stringify(myLibrary));
}

function addBookToLibrary(row) {
  const book = new Book();
  book.title = row.querySelector('#title').value;
  book.author = row.querySelector('#author').value;
  book.pages = row.querySelector('#pages').value;
  book.read = row.querySelector('#read').checked;
  myLibrary.push(book);
  populateStorage();

  // Firestore sync
  const docRef = firestore.collection(`Users/${user.uid}/Books`).doc();
  book.id = docRef.id;
  docRef
    .set({
      id: book.id,
      title: book.title,
      author: book.author,
      pages: book.pages,
      read: book.read,
    })
    .then(() => {
      console.log('Status saved!');
    })
    .catch((error) => {
      console.error('Got an error', error);
    });
}

function render(books, row = null) {
  if (myLibrary.length !== 0) {
    table.style.display = 'table';
    emptyState.style.display = 'none';
  }

  // Render the last created book
  if (books.length === 1 && row !== null) {
    Object.entries(books[0]).map(([key, value]) => {
      switch (key) {
        case 'read':
          row.querySelector('#read').checked = value;
          break;
        case 'author':
          row.querySelector('#author').closest('td').innerHTML = value;
          break;
        case 'title':
          row.querySelector('#title').closest('td').innerHTML = value;
          break;
        case 'pages':
          row.querySelector('#pages').closest('td').innerHTML = value;
          break;
        default:
          break;
      }
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
    populateStorage();

    // firestore sync
    const docRef = firestore.doc(`Users/${user.uid}/Books/${currentBook.id}`);
    docRef
      .update({
        title: currentBook.title,
        author: currentBook.author,
        pages: currentBook.pages,
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };
}

// User input
newBookButton.onclick = () => {
  if (myLibrary.length === 0) {
    table.style.display = 'table';
    emptyState.style.display = 'none';
  }

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

    if (myLibrary.length === 0) {
      table.style.display = 'none';
      emptyState.style.display = 'flex';
    }
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
      {
        const removedBook = myLibrary.splice(row.dataset.index, 1);
        row.remove();
        Array.from(view.rows).forEach((tr, i) => {
          tr.dataset.index = i;
        });

        if (myLibrary.length === 0) {
          table.style.display = 'none';
          emptyState.style.display = 'flex';
        }

        populateStorage();

        // firestore sync
        const docRef = firestore.doc(`Users/${user.uid}/Books/${removedBook[0].id}`);
        docRef
          .delete()
          .then(() => {
            console.log('Document successfully deleted!');
          })
          .catch((error) => {
            console.error('Error removing document: ', error);
          });
      }
      break;
    case 'is-read': {
      if (!row.dataset.index) return;

      const myBook = myLibrary[row.dataset.index];
      const readCell = Array.from(row.cells).find(td => td.querySelector('input'));

      // The books that are retrieved from the Local Storage lose their prototype
      if (myBook.constructor !== Book) {
        Object.setPrototypeOf(myBook, Book.prototype);
      }

      myBook.readStatus();
      readCell.querySelector('input').checked = myBook.read;
      populateStorage();

      // firestore sync
      const docRef = firestore.doc(`Users/${user.uid}/Books/${myBook.id}`);
      docRef
        .update({
          read: myBook.read,
        })
        .then(() => {
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });
      break;
    }
    case 'edit-book':
      editBook(row);
      break;
    default:
  }
};

// function getLocalLibrary() {
//   const library = JSON.parse(localStorage.getItem('library'));
//   myLibrary.push(...library);
//   render(library);
// }

// if (localStorage.getItem('library')) getLocalLibrary();

auth.onAuthStateChanged((currentUser) => {
  user = currentUser;

  if (currentUser) {
    const collRef = firestore.collection(`Users/${user.uid}/Books`);
    collRef
      .get()
      .then((datas) => {
        datas.forEach((doc) => {
          myLibrary.push(doc.data());
        });
        render(myLibrary);
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }
});
