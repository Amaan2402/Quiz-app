let url = ("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&token=474e0736ee493724fc481c4cdd72f74efc73f3e05f657ee8bb61f97edea77e10")

let gameOver= false;

let startBtn = document.querySelector("button");
let question = document.querySelector("h2");

let optionBox = document.querySelector(".options-box")
let optionOne = document.querySelector("#option-one")
let optionTwo = document.querySelector("#option-two")
let optionThree = document.querySelector("#option-three")
let optionFour = document.querySelector("#option-four")
let nextQues = document.querySelector(".nextques")

let scoreBox = document.querySelector(".score-box");

let tick = document.querySelector(".tick-png");

let optionList = document.querySelector(".options-list");
let rulesBox = document.querySelector(".rulesBox");

optionList.classList.add("display-none");
scoreBox.classList.add("display-none")

let selectedAns;
let answerData;
let answerArray = [];

let apiData;
let optionData
let questionData;

let answerIndex = 0;
let optionIndex = 0;
let questionIndex = 0;


let score = document.querySelector(".score");
let incAns = document.querySelector(".Incorrect-ans");
let corrAns = document.querySelector(".correct-ans");
let corectArray = [];
let incorrectArray = [];

let optionSelected = false;

tick.classList.add("visibility-hidden")

let icons = document.querySelectorAll("i");
icons.forEach(icon => {
    // icon.classList.add("display-none")    
});

// optionOne.firstChild.classList.remove("display-none")

nextQues.classList.add("display-none")
question.classList.add("visibility-hidden");

function gameTimer(count) {
    question.classList.remove("visibility-hidden");
    question.innerText = `Game starts in ${count}`;
    let timer = setTimeout(() => {
        gameTimer(count - 1); 
    }, 1000);

    if(count == 1) {
        clearTimeout(timer)
    };
};

function nextQuesTimer (count) {
    nextQues.classList.remove("display-none");
    let countPlaceholder = document.getElementById("next-ques-count");
    countPlaceholder.textContent = count;
    countPlaceholder.style.fontWeight = "bolder";

    if (count === 1) {
        return;
    };

    setTimeout(() => {
        nextQuesTimer(count - 1); // Recursive call with decremented count
    }, 1000);
};


startBtn.addEventListener("click", ()=> {
    gameTimer(7);
    getQuestion();
    rulesBox.classList.add("display-none")
});

function decodeEntities(input) {
    return input.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&iacute;/g, "í");
};

async function getQuestion(){
    try {    
        apiData = await axios.get(url);
        questionData = apiData.data.results[questionIndex].question
        console.log(apiData.data.results);
        startBtn.classList.add("visibility-hidden");

        // optionList.classList.remove("display-none")
        optionBox.removeEventListener("click", tickShow);
        tickShow();

        let quesOptionInterval = setInterval(() => {
            optionSelected = false;
            startBtn.classList.add("display-none");
            
            nextQuesTimer(7);
            optionList.classList.remove("display-none")
            questionData = apiData.data.results[questionIndex].question
            questionIndex++
            let decodedQuestion = decodeEntities(questionData);

            question.classList.remove("visibility-hidden")
            question.innerText = decodedQuestion;
            console.log(questionData);

            getOption();
            optionIndex++

            if(questionIndex >9) {
                clearInterval(quesOptionInterval);
                setTimeout(() => {
                    startBtn.classList.remove("display-none");
                    nextQues.classList.add("display-none");
                    optionList.classList.add("display-none");
                    rulesBox.classList.add("display-none");
                    scoreBox.classList.remove("display-none");
                    question.classList.add("display-none");
                    calcScore();
                }, 8000);

                gameOver = true;
            }
        }, 7000);

    }
    catch(e){
        console.log(e);
    };
};

async function getOption (){
    try {
        optionData = await apiData.data.results[optionIndex].incorrect_answers;

        answerData = await apiData.data.results[answerIndex].correct_answer
        answerIndex++

        await optionData.push(answerData);
    
        // optionData.sort(() => Math.random() - 0.5);
        optionData = optionData.sort(() => Math.random() - 0.5);
        console.log(optionData);
        console.log(answerData);

        optionOne.innerText = decodeEntities(optionData[0]);
        optionTwo.innerText = decodeEntities(optionData[1]);
        optionThree.innerText = decodeEntities(optionData[2]);
        optionFour.innerText = decodeEntities(optionData[3]);
    } catch (error) {
        console.log(error);
    }
};

// function tickShow() {
//     optionBox.addEventListener("click", (event)=> {
//         if (!optionSelected) {
//             selectedAns = event.target;
//             console.dir(selectedAns);
//             selectedAns.appendChild(tick);
//             optionSelected = true; // Set the flag to true
//             if (selectedAns) {
//                 if (selectedAns.innerText === answerData) {
//                     console.log("True");
//                 } else {
//                     console.log("False");
//                 }
//             }}
//     });
// }

function tickShow() {
    optionBox.addEventListener("click", (event)=> {
        if (!optionSelected) {
            selectedAns = event.target.closest("li");
            console.dir(selectedAns);

            // Clone the tick icon and append it to the selected answer
            const tickClone = tick.cloneNode(true);
            tickClone.classList.remove("visibility-hidden");
            selectedAns.appendChild(tickClone);

            optionSelected = true; // Set the flag to true
            if (selectedAns) {
                if (selectedAns.innerText === answerData) {
                    console.log("True");
                    corectArray.push(selectedAns);
                } else {
                    console.log("False");
                }
            }
        }
    });
}

function calcScore () {
    let arrLength = corectArray.length;

    let finalScore = 5 * arrLength;
    score.innerText = `Score : ${finalScore}`;

    let incorrectAnsCount = 10 - arrLength;
    incAns.innerText = `Incorrect Answers : ${incorrectAnsCount}`;
    corrAns.innerText = `Correct Answers : ${corectArray.length}`;
}


