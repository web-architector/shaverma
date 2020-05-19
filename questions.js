const questions = [
    {
        question: "Какого цвета бургер?",
        answers: [
            {
                title: 'Стандарт',
                url: './img/burger.png'
            },
            {
                title: 'Черный',
                url: './img/burgerBlack.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "Из какого мяса котлета?",
        answers: [
            {
                title: 'Курица',
                url: './img/chickenMeat.png'
            },
            {
                title: 'Говядина',
                url: './img/beefMeat.png'
            },
            {
                title: 'Свинина',
                url: './img/porkMeat.png'
            }
        ],
        type: 'radio'
    },
    {
        question: "Дополнительные ингредиенты?",
        answers: [
            {
                title: 'Помидор',
                url: './img/tomato.png'
            },
            {
                title: 'Огурец',
                url: './img/cucumber.png'
            },
            {
                title: 'Салат',
                url: './img/salad.png'
            },
            {
                title: 'Лук',
                url: './img/onion.png'
            }
        ],
        type: 'checkbox'
    },
    {
        question: "Добавить соус?",
        answers: [
            {
                title: 'Чесночный',
                url: './img/sauce1.png'
            },
            {
                title: 'Томатный',
                url: './img/sauce2.png'
            },
            {
                title: 'Горчичный',
                url: './img/sauce3.png'
            }
        ],
        type: 'radio'
    }
];

const obj = {}

const getData = () => {
    formAnswers.textContent = 'LOAD';

    setTimeout(() => {
        fetch('http://localhost:81/Quiz__intens/db.json')
            .then(res => res.json())
            .then(obj => playTest(obj.questions))
    }, 2000);
}

const obj = {};

const inputs = [...formAnswers.elements]
    .filter(elem => elem.checked)

inputs.forEach((elem, index) => {
    obj[`${index}_${questions[numberQuestion].question}`] = elem.value;
})
finalAnswers.push(obj)
