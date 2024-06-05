document.addEventListener('DOMContentLoaded', function () {
  const submit = document.getElementById('form');

  submit.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const todos = [];
  const RENDER_EVENT = 'render-todo';
  const STORAGE_KEY = 'TODO_APPS';

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function addBook() {
    const inputJudul = document.getElementById('judul').value;
    const inputPenulis = document.getElementById('penulis').value;
    const inputTahun = document.getElementById('tahun').value;
    const isComplete = false;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputJudul, inputPenulis, inputTahun, isComplete);
    todos.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.innerText = 'Belum Selesai';

      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = 'Hapus';

      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(bookObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.innerText = 'Selesai';

      checkButton.addEventListener('click', function () {
        addTaskToCompleted(bookObject.id);
      });

      container.append(checkButton);
    }

    return container;
  }

  function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of todos) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    todos.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in todos) {
      if (todos[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  }

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        todos.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookshelfList = document.getElementById('belumSelesaiDibaca');
    uncompletedBookshelfList.innerHTML = '';

    const completedBookshelfList = document.getElementById('selesaiDibaca');
    completedBookshelfList.innerHTML = '';

    for (const bookItem of todos) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        uncompletedBookshelfList.append(bookElement);
      } else {
        completedBookshelfList.append(bookElement);
      }
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
