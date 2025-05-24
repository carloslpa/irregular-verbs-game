const verbs = [
    { base: 'be', pastSimple: 'was/were', pastParticiple: 'been' },
    { base: 'have', pastSimple: 'had', pastParticiple: 'had' },
    { base: 'do', pastSimple: 'did', pastParticiple: 'done' },
    { base: 'go', pastSimple: 'went', pastParticiple: 'gone' },
    { base: 'get', pastSimple: 'got', pastParticiple: ['got', 'gotten'] }, // 'gotten' also accepted
    { base: 'make', pastSimple: 'made', pastParticiple: 'made' },
    { base: 'come', pastSimple: 'came', pastParticiple: 'come' },
    { base: 'see', pastSimple: 'saw', pastParticiple: 'seen' },
    { base: 'know', pastSimple: 'knew', pastParticiple: 'known' },
    { base: 'take', pastSimple: 'took', pastParticiple: 'taken' },
    { base: 'give', pastSimple: 'gave', pastParticiple: 'given' },
    { base: 'find', pastSimple: 'found', pastParticiple: 'found' },
    { base: 'think', pastSimple: 'thought', pastParticiple: 'thought' },
    { base: 'tell', pastSimple: 'told', pastParticiple: 'told' },
    { base: 'become', pastSimple: 'became', pastParticiple: 'become' },
    { base: 'show', pastSimple: 'showed', pastParticiple: 'shown' },
    { base: 'leave', pastSimple: 'left', pastParticiple: 'left' },
    { base: 'feel', pastSimple: 'felt', pastParticiple: 'felt' },
    { base: 'put', pastSimple: 'put', pastParticiple: 'put' },
    { base: 'bring', pastSimple: 'brought', pastParticiple: 'brought' },
    { base: 'buy', pastSimple: 'bought', pastParticiple: 'bought' },
    { base: 'choose', pastSimple: 'chose', pastParticiple: 'chosen' },
    { base: 'eat', pastSimple: 'ate', pastParticiple: 'eaten' },
    { base: 'drink', pastSimple: 'drank', pastParticiple: 'drunk' },
    { base: 'break', pastSimple: 'broke', pastParticiple: 'broken' },
    { base: 'speak', pastSimple: 'spoke', pastParticiple: 'spoken' },
    { base: 'write', pastSimple: 'wrote', pastParticiple: 'written' },
    { base: 'read', pastSimple: 'read', pastParticiple: 'read' }, // pronunciation difference
    { base: 'sleep', pastSimple: 'slept', pastParticiple: 'slept' },
    { base: 'meet', pastSimple: 'met', pastParticiple: 'met' }
];

let score = 0;
let currentQuestionIndex = 0;
const MAX_QUESTIONS = 10; // Puedes cambiar el número de preguntas por partida

let shuffledVerbs = [];
let currentVerb = null;
let currentQuestionType = null;
let correctAnswers = [];

// Elementos del DOM
const gameIntro = document.getElementById('game-intro');
const gameArea = document.getElementById('game-area');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const submitButton = document.getElementById('submit-button');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const feedbackText = document.getElementById('feedback-text');
const scoreDisplay = document.getElementById('score');
const currentQuestionNumDisplay = document.getElementById('current-question-num');
const maxQuestionsDisplay = document.getElementById('max-questions-display');
const maxQuestionsQDisplay = document.getElementById('max-questions-q-display');
const finalScoreDisplay = document.getElementById('final-score');
const finalMaxQuestionsDisplay = document.getElementById('final-max-questions');
const finalMessageDisplay = document.getElementById('final-message');

// Event Listeners
startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartGame);
answerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !submitButton.classList.contains('hidden')) {
        checkAnswer();
    } else if (e.key === 'Enter' && !nextButton.classList.contains('hidden')) {
        nextQuestion();
    }
});


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    shuffledVerbs = shuffleArray([...verbs]); // Copia y mezcla los verbos
    maxQuestionsDisplay.textContent = MAX_QUESTIONS;
    maxQuestionsQDisplay.textContent = MAX_QUESTIONS;
    scoreDisplay.textContent = score;
    currentQuestionNumDisplay.textContent = 1;

    gameIntro.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');

    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= MAX_QUESTIONS) {
        endGame();
        return;
    }

    currentVerb = shuffledVerbs[currentQuestionIndex % verbs.length]; // Usa el resto para reutilizar verbos si MAX_QUESTIONS > 30
    currentQuestionNumDisplay.textContent = currentQuestionIndex + 1;

    feedbackText.textContent = '';
    feedbackText.classList.remove('correct', 'incorrect');
    answerInput.value = '';
    answerInput.disabled = false;
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    answerInput.focus();

    const questionTypes = [
        'detective',
        'translator_en',
        'translator_es',
        'error_hidden',
        'who_am_i'
    ];
    currentQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    correctAnswers = []; // Reinicia las respuestas correctas para esta pregunta

    switch (currentQuestionType) {
        case 'detective':
            generateDetectiveQuestion();
            break;
        case 'translator_en':
            generateTranslatorEnQuestion();
            break;
        case 'translator_es':
            generateTranslatorEsQuestion();
            break;
        case 'error_hidden':
            generateErrorHiddenQuestion();
            break;
        case 'who_am_i':
            generateWhoAmIQuestion();
            break;
    }
}

function generateDetectiveQuestion() {
    const forms = ['pastSimple', 'pastParticiple'];
    const selectedForm = forms[Math.floor(Math.random() * forms.length)];
    let blankForm = currentVerb[selectedForm];
    if (Array.isArray(blankForm)) { // Handle 'get' case
        blankForm = blankForm[0]; // Just use 'got' for the placeholder
    }

    let sentence = "";
    if (selectedForm === 'pastSimple') {
        sentence = `Ayer, yo **___** (${currentVerb.base}) un libro muy interesante.`;
        correctAnswers = getCorrectAnswersArray(currentVerb.pastSimple);
    } else { // pastParticiple
        sentence = `¿Alguna vez has **___** (${currentVerb.base}) un helado de chocolate?`;
        correctAnswers = getCorrectAnswersArray(currentVerb.pastParticiple);
    }
    questionText.innerHTML = sentence;
}

function generateTranslatorEnQuestion() {
    const forms = ['base', 'pastSimple', 'pastParticiple'];
    const chosenFormIndex = Math.floor(Math.random() * forms.length);
    const chosenFormName = forms[chosenFormIndex];
    const chosenFormValue = currentVerb[chosenFormName];

    let question = "";
    if (chosenFormName === 'base') {
        question = `Si la forma base es '${currentVerb.base.toUpperCase()}', ¿cuáles son sus formas Past Simple y Past Participle? (Separadas por comas)`;
        correctAnswers = [
            `${getCorrectAnswersArray(currentVerb.pastSimple).join('/')},${getCorrectAnswersArray(currentVerb.pastParticiple).join('/')}`
        ];
    } else if (chosenFormName === 'pastSimple') {
        let displayValue = Array.isArray(chosenFormValue) ? chosenFormValue.join('/') : chosenFormValue;
        question = `Si el Past Simple es '${displayValue.toUpperCase()}', ¿cuáles son sus formas Base y Past Participle? (Separadas por comas)`;
        correctAnswers = [
            `${currentVerb.base},${getCorrectAnswersArray(currentVerb.pastParticiple).join('/')}`
        ];
    } else { // pastParticiple
        let displayValue = Array.isArray(chosenFormValue) ? chosenFormValue.join('/') : chosenFormValue;
        question = `Si el Past Participle es '${displayValue.toUpperCase()}', ¿cuáles son sus formas Base y Past Simple? (Separadas por comas)`;
        correctAnswers = [
            `${currentVerb.base},${getCorrectAnswersArray(currentVerb.pastSimple).join('/')}`
        ];
    }
    questionText.innerHTML = question;
}

function generateTranslatorEsQuestion() {
    // A simple mapping for common Spanish translations (can be expanded)
    const spanishTranslations = {
        'be': 'ser/estar',
        'have': 'tener/haber',
        'do': 'hacer',
        'go': 'ir',
        'get': 'conseguir/obtener',
        'make': 'hacer/fabricar',
        'come': 'venir',
        'see': 'ver',
        'know': 'saber/conocer',
        'take': 'tomar/llevar',
        'give': 'dar',
        'find': 'encontrar',
        'think': 'pensar',
        'tell': 'decir/contar',
        'become': 'llegar a ser',
        'show': 'mostrar',
        'leave': 'salir/dejar',
        'feel': 'sentir',
        'put': 'poner',
        'bring': 'traer',
        'buy': 'comprar',
        'choose': 'elegir',
        'eat': 'comer',
        'drink': 'beber',
        'break': 'romper',
        'speak': 'hablar',
        'write': 'escribir',
        'read': 'leer',
        'sleep': 'dormir',
        'meet': 'reunir/conocer'
    };
    const spanishMeaning = spanishTranslations[currentVerb.base] || currentVerb.base; // Fallback

    questionText.innerHTML = `¿Cómo se dice '${spanishMeaning.toUpperCase()}' en sus tres formas (Base, Past Simple, Past Participle)? (Separadas por comas)`;
    correctAnswers = [
        `${currentVerb.base},${getCorrectAnswersArray(currentVerb.pastSimple).join('/')},${getCorrectAnswersArray(currentVerb.pastParticiple).join('/')}`
    ];
}

function generateErrorHiddenQuestion() {
    let wrongForm = '';
    const forms = ['pastSimple', 'pastParticiple'];
    const chosenFormName = forms[Math.floor(Math.random() * forms.length)];

    // Generate a common incorrect past tense form
    if (chosenFormName === 'pastSimple') {
        wrongForm = currentVerb.base + 'ed'; // Common mistake
        if (currentVerb.base === 'read') wrongForm = 'readed'; // Specific for read
        if (currentVerb.base === 'sleep') wrongForm = 'sleeped';
        // Avoid making correct irregulars like 'put' incorrect
        if (currentVerb.base === currentVerb.pastSimple) wrongForm = currentVerb.base; // No change if it's already irregular but same form (e.g., put)
        if (currentVerb.base === 'buy') wrongForm = 'buyed';
        if (currentVerb.base === 'think') wrongForm = 'thinked';
    } else { // pastParticiple
        wrongForm = currentVerb.base + 'en'; // Common participle mistake for some
        if (currentVerb.base === 'see') wrongForm = 'seen'; // Example of a correct but used as 'mistake'
        if (currentVerb.base === 'go') wrongForm = 'went'; // Using past simple as participle mistake
        if (currentVerb.base === 'eat') wrongForm = 'eaten';
    }

    // Ensure the wrongForm is actually different from the correct one(s)
    let actualCorrectForms;
    if (chosenFormName === 'pastSimple') {
        actualCorrectForms = getCorrectAnswersArray(currentVerb.pastSimple);
    } else {
        actualCorrectForms = getCorrectAnswersArray(currentVerb.pastParticiple);
    }

    // If the 'wrong' form happens to be correct, regenerate
    let maxAttempts = 5;
    while (actualCorrectForms.includes(wrongForm.toLowerCase()) && maxAttempts > 0) {
        if (chosenFormName === 'pastSimple') {
            wrongForm = currentVerb.base + 'ed';
            if (currentVerb.base === 'read') wrongForm = 'readed';
        } else {
             wrongForm = currentVerb.base + 'en';
        }
        maxAttempts--;
    }
    // As a last resort if it's still correct, pick a clearly wrong form
    if (actualCorrectForms.includes(wrongForm.toLowerCase())) {
         wrongForm = currentVerb.base + 'ed'; // Default to common 'ed'
         if (currentVerb.base === 'go') wrongForm = 'goed'; // ensure it's different
         if (currentVerb.base === 'be') wrongForm = 'bed';
    }


    let sentence = '';
    if (chosenFormName === 'pastSimple') {
        sentence = `Corrige el error: "Ella **${wrongForm}** al cine anoche." (Verbo: ${currentVerb.base})`;
        correctAnswers = getCorrectAnswersArray(currentVerb.pastSimple);
    } else {
        sentence = `Corrige el error: "Nunca he **${wrongForm}** un coche así." (Verbo: ${currentVerb.base})`;
        correctAnswers = getCorrectAnswersArray(currentVerb.pastParticiple);
    }
    questionText.innerHTML = sentence;
}


function generateWhoAmIQuestion() {
    let clueType = Math.floor(Math.random() * 3); // 0: Past Simple, 1: Past Participle, 2: Meaning/Context
    let question = "";

    if (clueType === 0) {
        let displayValue = Array.isArray(currentVerb.pastSimple) ? currentVerb.pastSimple.join('/') : currentVerb.pastSimple;
        question = `Soy un verbo. Mi Past Simple es '${displayValue.toUpperCase()}'. ¿Qué verbo soy (forma base)?`;
    } else if (clueType === 1) {
        let displayValue = Array.isArray(currentVerb.pastParticiple) ? currentVerb.pastParticiple.join('/') : currentVerb.pastParticiple;
        question = `Soy un verbo. Mi Past Participle es '${displayValue.toUpperCase()}'. ¿Qué verbo soy (forma base)?`;
    } else {
        // Meaning/Context clue - slightly more complex
        let clue = "";
        switch (currentVerb.base) {
            case 'be': clue = "Me usas para describir estados o existencia."; break;
            case 'have': clue = "Me usas para decir que posees algo o como auxiliar."; break;
            case 'do': clue = "Soy un verbo para acciones generales o como auxiliar en preguntas."; break;
            case 'go': clue = "Significo 'moverse de un lugar a otro'."; break;
            case 'get': clue = "Tengo muchos significados, como 'obtener', 'llegar', 'recibir'."; break;
            case 'make': clue = "Significo 'crear' o 'fabricar' algo."; break;
            case 'come': clue = "Significo 'moverse hacia el hablante'."; break;
            case 'see': clue = "Me usas para percibir con los ojos."; break;
            case 'know': clue = "Me usas para tener información o estar familiarizado con algo."; break;
            case 'take': clue = "Me usas para 'coger' o 'llevar' algo."; break;
            case 'give': clue = "Me usas para 'entregar' algo a alguien."; break;
            case 'find': clue = "Me usas para 'descubrir' o 'localizar' algo."; break;
            case 'think': clue = "Me usas para 'tener pensamientos' u 'opinar'."; break;
            case 'tell': clue = "Significo 'comunicar' o 'narrar' algo."; break;
            case 'become': clue = "Significo 'transformarse en' algo."; break;
            case 'show': clue = "Me usas para 'enseñar' o 'mostrar' algo."; break;
            case 'leave': clue = "Significo 'partir' o 'abandonar'."; break;
            case 'feel': clue = "Me usas para 'experimentar emociones' o 'tocar'."; break;
            case 'put': clue = "Me usas para 'colocar' algo."; break;
            case 'bring': clue = "Significo 'llevar' algo a un lugar."; break;
            case 'buy': clue = "Me usas para 'adquirir' algo con dinero."; break;
            case 'choose': clue = "Me usas para 'seleccionar' entre opciones."; break;
            case 'eat': clue = "Me usas para 'ingerir' comida."; break;
            case 'drink': clue = "Me usas para 'ingerir' líquidos."; break;
            case 'break': clue = "Significo 'romper' o 'fracturar'."; break;
            case 'speak': clue = "Me usas para 'hablar' o 'comunicarse verbalmente'."; break;
            case 'write': clue = "Me usas para 'poner letras' en papel o pantalla."; break;
            case 'read': clue = "Me usas para 'interpretar' texto."; break;
            case 'sleep': clue = "Me usas para 'descansar' con los ojos cerrados."; break;
            case 'meet': clue = "Me usas para 'conocer a alguien' o 'reunirse'."; break;
            default: clue = "Soy un verbo muy común. ¿Quién soy?";
        }
        question = `${clue} ¿Qué verbo soy (forma base)?`;
    }
    questionText.innerHTML = question;
    correctAnswers = [currentVerb.base];
}


function getCorrectAnswersArray(formValue) {
    if (Array.isArray(formValue)) {
        return formValue.map(a => a.toLowerCase());
    }
    // Handle 'was/were' split
    if (typeof formValue === 'string' && formValue.includes('/')) {
        return formValue.split('/').map(a => a.trim().toLowerCase());
    }
    return [formValue.toLowerCase()];
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    let isCorrect = false;

    if (currentQuestionType === 'translator_en' || currentQuestionType === 'translator_es') {
        const expectedParts = correctAnswers[0].split(',').map(p => p.trim().toLowerCase());
        const userParts = userAnswer.split(',').map(p => p.trim().toLowerCase());

        // Check if all parts are present and in the correct order for simplicity
        // Could be made more robust to check permutations or accept 'got/gotten' for example
        if (expectedParts.length === userParts.length) {
            isCorrect = expectedParts.every((expectedPart, index) => {
                const userPart = userParts[index];
                if (expectedPart.includes('/')) { // Handle forms like 'was/were' or 'got/gotten'
                    const options = expectedPart.split('/');
                    return options.includes(userPart);
                }
                return expectedPart === userPart;
            });
        }
    } else {
        isCorrect = correctAnswers.includes(userAnswer);
    }

    if (isCorrect) {
        feedbackText.textContent = '¡Correcto! ✅';
        feedbackText.classList.add('correct');
        score++;
    } else {
        feedbackText.textContent = `¡Incorrecto! ❌ La respuesta correcta era: ${correctAnswers.map(ans => ans.charAt(0).toUpperCase() + ans.slice(1)).join(' / ')}.`;
        feedbackText.classList.add('incorrect');
    }

    scoreDisplay.textContent = score;
    answerInput.disabled = true;
    submitButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function endGame() {
    gameArea.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
    finalMaxQuestionsDisplay.textContent = MAX_QUESTIONS;

    let message = '';
    if (score === MAX_QUESTIONS) {
        message = '¡Felicidades! ¡Eres un maestro de los verbos irregulares! 🥳';
    } else if (score >= MAX_QUESTIONS * 0.7) {
        message = '¡Buen trabajo! Estás muy cerca de dominar los verbos irregulares. ¡Sigue así! 💪';
    } else {
        message = '¡No te desanimes! La práctica hace al maestro. ¡Repasa y vuelve a intentarlo! ✨';
    }
    finalMessageDisplay.textContent = message;
}

function restartGame() {
    startGame();
}