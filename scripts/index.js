const form = document.getElementById('form');
const author = document.getElementById('author');
const card = document.getElementById('card');
const main = document.getElementById('main');
const cardCollection = document.getElementById('card-collection');
const closeFormBtn = document.querySelector('.close-btn');
const body = document.getElementById('body');
const modalForm = document.querySelector('#modal');
const cardDelete = document.querySelector('.delete-btn');

// INITIAL MOUNT UI
let myLibrary = onLoadCollection();
renderUi(myLibrary);

document.addEventListener('DOMContentLoaded', handlerOnClickDisplayAddButton);
form.addEventListener('submit', handlerOnSubmitForm);
closeFormBtn.addEventListener('click', handleCloseFormBtn);
form.addEventListener('click', (e) => e.stopPropagation());
modalForm.addEventListener('click', handleDisplayModal);

// ENTITIES (OOP)
function Book({ author, title, pages, boolean }) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.boolean = boolean;
  this.id = new Date();

  this.addBookToLibrary = function (lib) {
    lib.push({
      author: this.author,
      title: this.title,
      pages: this.pages,
      boolean: this.boolean,
      id: this.id.getTime(),
    });
  };
}

// SERVICES CRUD (CREATE,READ,UPDATE,DELETE)
function addCard() {
  const plantilla = `<div class="card add-book" onclick="handleDisplayModalForm()">
          <h2>Add Book</h2>
          <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
        </div>`;
  cardCollection.innerHTML += plantilla;
}
function deleteCard(e) {
  const dataID = e.dataset.indexNumber;
  const finalLibrary = myLibrary.filter((book) => {
    return book.id !== Number(dataID) ? book : null;
  });
  myLibrary = finalLibrary;
  renderUi(myLibrary);
}

// UTILS
//https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
function textTransform(text, caseSelector = 'default') {
  const caseOpt = {
    lowerCase: (prop) => prop.toLowerCase(),
    upperCase: (prop) => prop.toUpperCase(),
    default: defaultCase,
  };

  return (caseOpt[caseSelector] || caseOpt['default'])(text);
}
function defaultCase(prop) {
  console.error(
    'NO SE APLICO NINGUNA TRANSFORMACIÓN, ESTE ES EL CASO POR DEFECTO'
  );
  return prop;
}
function displayElement(element) {
  element.classList.add('display');
  setTimeout(() => {
    element.classList.add('show');
  }, 100);
}
function hideElement(element) {
  element.classList.remove('display');
  element.classList.remove('show');
}
function onSaveCollection(data) {
  console.log(data);
  //ACA TENGO QUE HACER STORAGE EL DATA
}
function onLoadCollection() {
  const seeds = [];
  // ACA SE DEBE RETORNAR LA COLLECTION EMPTY
  // if (datosCargados) {
  // return datosCargados
  // }
  return seeds;
}
// HANDLE USER ACTIONS
function handleDisplayForm() {
  displayElement(form);
}
function handlerOnClickDisplayAddButton() {
  const btn = document.querySelector('.add-btn');
  btn.addEventListener('click', handleDisplayForm);
}
function handlerOnSubmitForm(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const payLoad = Object.fromEntries(formData);

  const book = new Book({
    ...payLoad,
    boolean: payLoad.boolean === 'false' ? false : true,
  });
  // MANIPULATION
  book.addBookToLibrary(myLibrary);
  // RENDER
  renderUi(myLibrary);
  console.log({ myLibrary, book, payLoad, formData });
  form.reset();
}
function handleDisplayModalForm() {
  displayElement(modalForm);
}
function handleDisplayModal(e) {
  if (e.target.id === 'modal') {
    hideElement(modalForm);
  }
}
function handleCloseFormBtn() {
  hideElement(modalForm);
}

// UTILS UI
function toggleRead(e) {
  //Modify Data
  myLibrary[Number(e.dataset.readIndex)].boolean =
    !myLibrary[Number(e.dataset.readIndex)].boolean;
  //SYNC with the UI

  renderUi(myLibrary);
}
// RENDER ENGINE
function renderUi(lib = []) {
  cardCollection.innerHTML = '';
  addCard();
  mountCollection(lib);
}
function mountCollection(lib = []) {
  lib.forEach((e, i) => {
    const { title, author, pages, id, boolean } = e;
    const formatBoolean = Boolean(boolean);
    const html = `
  <div id="card-${i}"  class="card">
        <span class="delete-btn" data-index-number="${id}" onclick="return deleteCard(this)"}><i class="fa-solid fa-xmark"></i></span>
        <div class="book-img"></div>
        <h2>Book</h2>
         <p>${textTransform(title, 'lowerCase')}</p>
        <p>${textTransform(author, 'lowerCase')}</p>
        <p>${pages}</p>
        <span onclick="return toggleRead(this)" data-read-index="${i}" class="read-btn ${
      formatBoolean === true ? 'hasBeenRead' : 'hasNotBeenRead'
    }"><i class="fa-regular fa-eye-slash"></i></span>
        </div>`;

    cardCollection.innerHTML += html;
  });
}
