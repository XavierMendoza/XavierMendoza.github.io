document.querySelector("button").addEventListener("click", gradeQuiz);

// Global Variables
var score = 0;
var attempts = localStorage.getItem("attempts");
if (attempts === null) {
  attempts = 0;
}

displayQ4Choices();

// Functions
function displayQ4Choices() {
  let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
  q4ChoicesArray = _.shuffle(q4ChoicesArray);
  for (let i = 0; i < q4ChoicesArray.length; i++) {
    document.querySelector("#q4Choices").innerHTML += `<input type="radio" name="q4" id="${q4ChoicesArray[i]}" 
        value="${q4ChoicesArray[i]}"> <label for="${q4ChoicesArray[i]}">${q4ChoicesArray[i]}</label>`;
  }
}//displayQ4Choices

function isFormValid() {
  let isValid = true;
  if (document.querySelector("#q1").value == "") {
    isValid = false;
    document.querySelector("#validationFdbck").innerHTML = "Question 1 was not answered.";
  }
  return isValid;
}//isFormValid

function rightAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
  document.querySelector(`#q${index}Feedback`).className = "bg-success text-white";
  document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/checkmark.png' alt='Checkmark'>";
  score += 10; // now 10 questions = 10 points each
}

function wrongAnswer(index) {
  document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect.";
  document.querySelector(`#q${index}Feedback`).className = "bg-warning text-white";
  document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' alt='xmark'>";
}

function gradeQuiz() {
  console.log("Grading quiz…");
  document.querySelector("#validationFdbck").innerHTML = ""; // resets validation feedback
  if (!isFormValid()) {
    return;
  }

  // Variables
  score = 0;

  let q1Response = document.querySelector("#q1").value.toLowerCase();
  let q2Response = document.querySelector("#q2").value;
  let q4Response = document.querySelector("input[name='q4']:checked").value;
  let q5Response = document.querySelector("input[name='q5']:checked")?.value;
  let q6Response = document.querySelector("#q6").value.toLowerCase();
  let q8Response = document.querySelector("#q8").value;
  let q9Response = document.querySelector("input[name='q9']:checked")?.value;
  let q10Response = document.querySelector("#q10").value;

  // Grading Question 1
  if (q1Response === "sacramento") rightAnswer(1); else wrongAnswer(1);

  // Grading Question 2
  if (q2Response === "mo") rightAnswer(2); else wrongAnswer(2);

  // Grading Question 3
  if (document.querySelector("#Jefferson").checked && document.querySelector("#Roosevelt").checked &&
    !document.querySelector("#Jackson").checked && !document.querySelector("#Franklin").checked) {
    rightAnswer(3);
  } else wrongAnswer(3);

  // Grading Question 4
  if (q4Response === "Rhode Island") rightAnswer(4); else wrongAnswer(4);

  // Grading Question 5
  if (q5Response === "Florida") rightAnswer(5); else wrongAnswer(5);

  // Grading Question 6
  if (q6Response === "new york") rightAnswer(6); else wrongAnswer(6);

  // Grading Question 7
  if (document.querySelector("#LakeErie").checked &&
    document.querySelector("#LakeHuron").checked &&
    document.querySelector("#LakeSuperior").checked &&
    !document.querySelector("#LakeTahoe").checked) {
    rightAnswer(7);
  } else wrongAnswer(7);

  // Grading Question 8
  if (q8Response === "appalachian") rightAnswer(8); else wrongAnswer(8);

  // Grading Question 9
  if (q9Response === "California") rightAnswer(9); else wrongAnswer(9);

  // Grading Question 10
  if (q10Response == 50) rightAnswer(10); else wrongAnswer(10);

  // Score + Attempts Display
  document.querySelector("#totalScore").innerHTML = `Total Score: ${score}`;
  document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${++attempts}`;
  localStorage.setItem("attempts", attempts);

  // Color and message
  const scoreDisplay = document.querySelector("#totalScore");
  if (score < 80) {
    scoreDisplay.style.color = "red";
    scoreDisplay.innerHTML += "<br>Keep practicing to improve your score!";
  } else {
    scoreDisplay.style.color = "green";
    scoreDisplay.innerHTML += "<br>Congratulations! Great job!";
  }
}//gradeQuiz
