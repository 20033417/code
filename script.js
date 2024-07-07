document.addEventListener("DOMContentLoaded", function() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const loadQuiz1Button = document.getElementById('loadQuiz1');
    const loadQuiz2Button = document.getElementById('loadQuiz2');
    const loadQuiz3Button = document.getElementById('loadQuiz3');
    let myQuestions = [];

    function fetchJSON(filename) {
        return fetch(filename)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Errore nel caricamento del file ${filename}: ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(error);
            });
    }

    function loadQuestions(file) {
        fetchJSON(file)
            .then(result => {
                myQuestions = result;
                buildQuiz(myQuestions);
            })
            .catch(error => {
                console.error('Errore nel caricamento del file JSON:', error);
            });
    }

    function buildQuiz(questions) {
        const output = [];
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

        shuffledQuestions.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            const answerKeys = Object.keys(currentQuestion.answers).sort(() => Math.random() - 0.5);

            for (let i = 0; i < answerKeys.length; i++) {
                const letter = answerKeys[i];
                answers.push(
                    `
                    <div>
                    <label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${currentQuestion.answers[letter]}
                    </label>
                    </div>`
                );
            }

            output.push(
                `<div class="question">${currentQuestion.question}</div>
                <div class="answers">${answers.join('')}</div>`
            );
        });

        quizContainer.innerHTML = output.join('');
        submitButton.style.display = 'block'; // Mostra il pulsante di invio quando il quiz è costruito
    }

    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let numCorrect = 0;
        const incorrectQuestions = [];

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            if (userAnswer === currentQuestion.correctAnswer) {
                numCorrect++;
            } else {
                incorrectQuestions.push(currentQuestion);
            }
        });

        resultsContainer.innerHTML = `<p>Hai risposto correttamente a ${numCorrect} domande su ${myQuestions.length}.</p>`;

        if (incorrectQuestions.length > 0) {
            resultsContainer.innerHTML += `<h2>Domande sbagliate:</h2>`;
            incorrectQuestions.forEach(question => {
                const correctAnswer = question.answers[question.correctAnswer];
                resultsContainer.innerHTML += `<div class="question"><p>${question.question}:</p><p>${correctAnswer}</p></div>`;
            });
        }
    }

    loadQuiz1Button.addEventListener('click', () => loadQuestions('domande.json'));
    loadQuiz2Button.addEventListener('click', () => loadQuestions('domande2.json'));
    loadQuiz3Button.addEventListener('click', () => loadQuestions('domande3.json'));
    submitButton.addEventListener('click', showResults);
});
