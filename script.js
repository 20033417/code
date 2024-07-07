document.addEventListener("DOMContentLoaded", function() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const fileInput = document.getElementById('fileInput');
    const loadFileBtn = document.getElementById('loadFileBtn');
    let myQuestions = [];

    loadFileBtn.addEventListener('click', function() {
        fileInput.click(); // Simula il click sul file input per aprire la finestra di dialogo di selezione file
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                myQuestions = JSON.parse(e.target.result);
                buildQuiz(myQuestions);
            } catch (error) {
                console.error('Errore nel caricamento del file JSON:', error);
            }
        };

        reader.readAsText(file);
    });

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
                incorrectQuestions.push(currentQuestion); // Push the entire question object
            }
        });

        resultsContainer.innerHTML = `<p>Hai risposto correttamente a ${numCorrect} domande su ${myQuestions.length}.</p>`;

        if (incorrectQuestions.length > 0) {
            resultsContainer.innerHTML += `<h2>Domande sbagliate:</h2>`;
            incorrectQuestions.forEach(question => {
                const correctAnswer = question.answers[question.correctAnswer];
                resultsContainer.innerHTML += `<div class ="question"><p >${question.question}:</p><p> ${correctAnswer}</p></div>`;
            });
        }
    }

    submitButton.addEventListener('click', showResults);
});
