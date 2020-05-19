document.addEventListener('DOMContentLoaded', runScript);

function runScript() {
    'use strict';
    console.log("Loaded document");
    const btnOpenModal = document.querySelector("#btnOpenModal");
    const modalBlock = document.querySelector("#modalBlock"); // открыть окно квиза
    const modalDialog = document.querySelector('.modal-dialog'); // само модальное окно квиза
    const closeModal = document.querySelector('#closeModal'); //закрыть окно квиза
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const btnBurger = document.getElementById('burger');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const sendBtn = document.getElementById('send');  // отправка данных на сервер


    btnBurger.style.display = 'none';
    btnBurger.addEventListener('click', () => {
        btnBurger.classList.add('active');  // для анимации гамбургер меню
        modalBlock.classList.add('d-block');
        playTest();
    });

    // загрузка данных с нашего сервера
    const getDataFromServer = () => {
        fetch('questions.json')
            .then((response) => response.json())
            .then((obj) => playTest(obj.questions))
            .catch((err) => {
                formAnswers.textContent = 'Ошибка загрузки данных';
                console.error('###: error= ', err)
            });
    };

    const getDataFromFirebase = () => {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCldw4yg-XNhEPtLDeJuHlHOLCvIJABMUQ",
            authDomain: "burgerhome-2b9cc.firebaseapp.com",
            databaseURL: "https://burgerhome-2b9cc.firebaseio.com",
            projectId: "burgerhome-2b9cc",
            storageBucket: "burgerhome-2b9cc.appspot.com",
            messagingSenderId: "878553337627",
            appId: "1:878553337627:web:31db18ad2acb44a9e78dbe"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.database().ref().child('questions').once('value')
            .then(snap => {
                console.log('###: Got data form Firebase= ', snap.val());
                playTest(snap.val())
            });
    };

    // получение данных данных и запуск программы
    const getData = () => {
        formAnswers.textContent = 'Loading....';
        setTimeout(() => {
            // const data = getDataFromServer();  // получаем базу вопросов с нашего сервера
            const data = getDataFromFirebase();  // получаем базу вопросов с сервера Firebase
        }, 2000)

    }


    let count = -100;  // Изначально окно модалки прячем за пределами экрана
    modalDialog.style.top = '-100%'
    let interval; // ссылка на setInterval
    const animateModal = () => {
        count += 3;
        modalDialog.style.top = count + '%';
        interval = requestAnimationFrame(animateModal); // второй вариант вместо setInterval;
        if (count > 0) {
            // clearInterval(interval);  // для setInterval
            cancelAnimationFrame(interval);  // для requestAnimationFrame
            count = -100;
        }

    };


// реализуем адаптивность экрана средстваи js
    let clientWidth = document.documentElement.clientWidth; // ширина экрана юзера
    const handleBtnBurgerVisible = () => {
        clientWidth = document.documentElement.clientWidth;
        console.log('###:resize = ', clientWidth)
        if (clientWidth < 768) {
            btnBurger.style.display = 'flex'
        } else {
            btnBurger.style.display = 'none'
        }
    };
    handleBtnBurgerVisible();
    window.addEventListener('resize', handleBtnBurgerVisible);

    //  Закрытие модального окна и снятие анимации с гамбургер кнопки
    closeModal.addEventListener('click', () => {
        btnBurger.classList.remove('active');  // для анимации гамбургер меню
        modalBlock.classList.remove('d-block')
        modalDialog.style.top = '-100%'; // уводим окно на верх для анимации появления сверху

    });

    // рендер ответов в форме. Учитываем тип кнопок - radio, checkbox
    const renderAnswers = (questions, questionNo) => {
        formAnswers.innerHTML = questions[questionNo].answers.map((answer) => `
        <div class="answers-item d-flex justify-content-center">
                <input type="${ questions[questionNo].type }" id="${ answer.title }" name="answer" class="d-none" value="${ answer.title }">
                <label for="${ answer.title }" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src=${ answer.url } alt="burger">
                  <span>${ answer.title }</span>
                </label>
              </div>
        `).join("");
    };
    const renderQuestions = (questions, questionNo) => {
        console.log('###: Render. questions ', questions);
        console.log('###: Render. questionNo= ', questionNo);
        formAnswers.innerHTML = ''; // clear previous data
        questionTitle.textContent = `${ questions[questionNo].question }`;
        renderAnswers(questions, questionNo);
    };

    // скрываем и показываем кнопки next prev в зависимости от номера вопроса
    const btnShowHide = (questions, questionNo) => {
        switch (true) {
            case (questionNo < 1):  // первый вопрос, скрываем prev (0)
                console.log('###: questionNo < 1= ', questionNo);
                prevBtn.style.visibility = 'hidden';
                break;
            case (questionNo <= questions.length - 1): // все вопросы до последнего (1, 2, 3)
                console.log('###: questionNo < questions.length - 1= ', questionNo);
                prevBtn.style.visibility = 'visible';
                nextBtn.style.visibility = 'visible';
                sendBtn.classList.remove('d-block')
                sendBtn.classList.add('d-none')
                break;
            case (questionNo > questions.length - 1): // вопросы 4 (его уже нет), вывод запроса тлф и кнопки Send
                nextBtn.style.visibility = 'hidden';
                sendBtn.classList.remove('d-none')
                sendBtn.classList.add('d-block')
                questionTitle.textContent = 'Спасибо'
                formAnswers.innerHTML = '<div class="form-group">' +
                    '<label for="user_phone">Ваш телефон</label>' +
                    '<input type="phone" id="user_phone" class="form-control"></div>';
                break;
            default:
                console.log('###: default= ', questionNo);
        }


    };
    // Начало тестирования
    const playTest = (questions) => {
        console.log("playing test");
        const finalAnswers = {}; // храним ответы пользователя
        let questionNo = 0; // текущий номер вопроса из перечня
        btnShowHide(questions, questionNo);
        renderQuestions(questions, questionNo); // рендерим вопросы + ответы
        // Обрабатываем input элементы формы и заносим их в базу ответов finalAnswers
        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter(item => item.checked);
            inputs.forEach((item, index) => {
                obj[`${ index }_${ questions[questionNo].question }`] = item.value;
            })
            if (!inputs.length) return;
            finalAnswers[questionNo] = obj;
            console.log('###: finalAnswers= ', finalAnswers);
            return true;
        }
        // обработка нажатия Далее
        nextBtn.onclick = () => {
            const isChooseAnswer = checkAnswer();  // проверка ответа
            if (!isChooseAnswer) return; // если не выбран вариант - не двигаемся дальше
            // questionNo = questionNo >= questions.length - 1 ? questions.length - 1 : ++questionNo;
            questionNo++;
            if (questionNo <= questions.length - 1) renderQuestions(questions, questionNo);
            btnShowHide(questions, questionNo);
        };
        // Обработка нажатия назад
        prevBtn.onclick = () => {
            questionNo = questionNo < 1 ? 0 : --questionNo;
            renderQuestions(questions, questionNo);
            btnShowHide(questions, questionNo);
        };
        //Ввод телефона и отправка данных на сервер
        sendBtn.onclick = () => {
            finalAnswers['User phoneS'] = formAnswers.elements[0].value;
            console.log('###: finalAnswers= ', finalAnswers);
            questionTitle.textContent = 'Спасибо за заказ!'
            formAnswers.innerHTML = 'Наши операторы скоро свяжутся с вами!';
            setTimeout(() => closeModal.click(), 3000);
            const data = {};
            data[Date.now()] = [finalAnswers];
            const resp = firebase.database().ref().child('contacts').push(data);
            console.log('###: Данные отправлены на Firebase = ', data);
            console.dir(data);

        };
    };
    // Слушатель кнопки нажатия модального окна - добавляем видимость и инимируем
    btnOpenModal.addEventListener('click', () => {
        // interval = setInterval(animateModal, 5); // первый способ анмации
        modalBlock.classList.add('d-block');
        interval = requestAnimationFrame(animateModal); // второй способ анмации
        getData();  // запуск теста
    });


}
