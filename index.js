"use strict";

let btnShow = document.getElementById("btn__show");
let btnSearch = document.getElementById("btn__search");
let modalForm = document.getElementById("form__contact--modal");
let formContact = document.getElementById("form__contact");
let contactList = document.getElementById("contacts__list");
let inputCelular = document.getElementById("inputCelular");

let getTemplate = () => {
  return `<div>
        <span>:contacto:</span>
        <span>:celular:</span>
    </div>
   `;
};

//Primer Parametro la base de datos, segundo la version de la db
let getRequest = indexdb => {
  return indexdb.open("agenda", 1);
};

//Creo mi tabla o store
let createStore = db =>
  db.createObjectStore("contactos", { keyPath: "celular" });

//Serie de pasos para poder hacer una query
let getTransaction = (db, typeAction) => {
  const transaction = db.transaction(["contactos"], typeAction);
  const objectStore = transaction.objectStore("contactos");
  return objectStore;
};

/*Creacion de mi base de datos*/
let init = () => {
  let indexedDB = window.indexedDB;
  if (indexedDB) {
    let db;
    let request = getRequest(indexedDB);

    let success = () => {
      db = request.result;
      console.log("OPEN", db);
    };

    let create = () => {
      let { onerror } = request.result;
      let db = request.result;
      let store;
      if (onerror === null) {
        store = createStore(db);
      }
    };

    let error = err => {
      console.log(err);
    };

    let addData = data => {
      let pushData = getTransaction(db, "readwrite");
      pushData.add(data);
    };

    let formData = e => {
      e.preventDefault();
      const data = {
        contacto: e.target.contacto.value,
        celular: e.target.celular.value
      };
      addData(data);
      formContact.reset();
      modalForm.classList.add("hide");
    };

    request.onsuccess = success;
    request.onupgradeneeded = create;
    request.onerror = error.bind(this, error);
    formContact.onsubmit = formData;
  }
};

let showForm = () => {
  modalForm.classList.remove("hide");
};

init();
btnShow.onclick = showForm;
