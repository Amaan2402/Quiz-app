let url = ("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple&token=474e0736ee493724fc481c4cdd72f74efc73f3e05f657ee8bb61f97edea77e10")

let startBtn = document.querySelector("button");
let question = document.querySelector("h2");

let optionBox = document.querySelector(".options-box")
let optionOne = document.querySelector("#option-one")
let optionTwo = document.querySelector("#option-two")
let optionThree = document.querySelector("#option-three")
let optionFour = document.querySelector("#option-four")
let nextQues = document.querySelector(".nextques")

let selectedAns;
let answerData;
let answerArray = [];

let apiData;
let optionData
let questionData;

let answerIndex = 0;
let optionIndex = 0;
let questionIndex = 0;

let optionSelected = false;

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
    // nextQues.innerText = `Next question in ${count} seconds`;
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
});

function decodeEntities(input) {
    return input.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&iacute;/g, "í");
};

async function getQuestion(){
    try {    
        apiData = await axios.get(url);
        questionData = apiData.data.results[questionIndex].question
        console.log(apiData.data.results);
        startBtn.classList.add("display-none");

        let quesOptionInterval = setInterval(() => {
            optionSelected = false;

            nextQuesTimer(7);
            questionData = apiData.data.results[questionIndex].question
            questionIndex++
            let decodedQuestion = decodeEntities(questionData);

            question.classList.remove("visibility-hidden")
            question.innerText = decodedQuestion;
            console.log(questionData);

            getOption();
            optionIndex++

            optionBox.addEventListener("click", (event)=> {
                if (!optionSelected) {
                    selectedAns = event.target;
                    selectedAns.classList.add("selected-ans-bg");
                    optionSelected = true; // Set the flag to true
                    if (selectedAns.innerText === answerData) {
                        console.log("True");
                    } else {
                        console.log("False");
                    }
                }
            });

            if(questionIndex > 9) {
                clearInterval(quesOptionInterval);
                startBtn.classList.remove("display-none");
                startBtn.innerText = "Play again";
                nextQues.remove();
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


