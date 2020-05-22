/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    
    listTable.textContent = '';
    
    if (filterNameInput.value) {
        if (isMatching(addNameInput.value, filterNameInput.value) || isMatching(addValueInput.value, filterNameInput.value)) {
            createList(filter(filterNameInput.value, parseCookies()));
        }
        if (parseCookies().hasOwnProperty(addNameInput.value) && !isMatching(addValueInput.value, filterNameInput.value)) {
            // listTable.removeChild(listTable.querySelector("'." + addNameInput.value + "'"));
        }

    } else {
        createList(parseCookies());
    }

    addNameInput.value = '';
    addValueInput.value = '';
});

const parseCookies = function () {
    const cookie = document.cookie;

    return cookie.split('; ').reduce((prev, current)=>{
        let [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {})
}

filterNameInput.addEventListener('keyup', function() {
    listTable.textContent = '';

    const filterResult = filter(filterNameInput.value, parseCookies());

    createList(filterResult);
});

const filter = function (val, obj) {
  const filtObj = {};

  for(let key in obj) {
      if (isMatching(key, val) || isMatching(obj[key], val)) {
          filtObj[key] = obj[key];
      }
  }

  return filtObj;
}

const isMatching = function (fill, chunk) {
    if (fill.toLowerCase().indexOf(chunk.toLowerCase()) !== -1) {
        return true;
    }

    return false;
}

const createList = function (obj) {
    for (let key in obj) {
        const name = key;
        const value = obj[key];

        const tdName = document.createElement('td');
        const tdValue = document.createElement('td');
        const tdButton = document.createElement('button');
        tdButton.classList.add(name);
        tdButton.setAttribute('Delete', 'удали меня');

        tdName.textContent = name;
        tdValue.textContent = value;
        tdButton.textContent = 'удалить';

        const tr = document.createElement('tr');
        tr.classList.add(name);

        tr.appendChild(tdName);
        tr.appendChild(tdValue);
        tr.appendChild(tdButton);

        listTable.appendChild(tr);
    }
}

window.addEventListener('load', function () {
    createList(parseCookies());
})

window.addEventListener('DOMContentLoaded', function () {
    listTable.addEventListener('click', function (event) {
        if (event.target.hasAttribute('Delete')) {
            listTable.removeChild(event.target.closest('tr'))
            document.cookie = `${event.target.className}=''; expires='Thu, 01 Jan 1970 00:00:01 GMT'`;
        }
    })
})
