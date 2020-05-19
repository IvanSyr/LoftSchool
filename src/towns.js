/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise(function(resolve) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
        xhr.responseType = 'json'
        xhr.send();
        xhr.addEventListener('load', function() {
            const towns = xhr.response.sort(function (a, b) {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                }
                
                return 0;
            })
            
            resolve(towns);
            
        })
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1 ) {
        return true;
    }

    return false;
}

const loadingBlock = homeworkContainer.querySelector('#loading-block');

const filterBlock = homeworkContainer.querySelector('#filter-block');

const filterInput = homeworkContainer.querySelector('#filter-input');

const filterResult = homeworkContainer.querySelector('#filter-result');

const successLoadTowns = loadTowns();

successLoadTowns.then(function () {
    loadingBlock.style.display = 'none';
    filterBlock.style.display = 'block';
})

filterInput.addEventListener('keyup', function() {
   
    successLoadTowns.then(function (towns) {
        if (filterInput.value !== '') {
            filterResult.textContent = '';

            towns.forEach(function(town) {
                if (isMatching(town.name, filterInput.value)) {
                    createDivs(town.name)
                }
            }) 
        } else {
            filterResult.textContent = '';
        }
            
    })
  
});

const createDivs = function (elem) {
    const div = document.createElement('div')
    
    div.textContent = elem;
    filterResult.appendChild(div);
}

export {
    loadTowns,
    isMatching
};
