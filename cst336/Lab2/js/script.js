// Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
const maxAttempts = 7;

// Event listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  attempts = 0;

  document.querySelector("#attemptsLeft").textContent = maxAttempts;
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#previousGuesses").textContent = "";
  document.querySelector("#playerGuess").value = "";
  document.querySelector("#playerGuess").focus();

  document.querySelector("#guessBtn").style.display = "inline-block";
  document.querySelector("#resetBtn").style.display = "none";

  console.log("randomNumber: " + randomNumber);
}

function checkGuess() {
  const feedback = document.querySelector("#feedback");
  const guessInput = document.querySelector("#playerGuess");
  const guess = Number(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 99) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return;
  }

  feedback.textContent = "";
  attempts++;
  const remaining = maxAttempts - attempts;
  document.querySelector("#attemptsLeft").textContent = remaining;
  document.querySelector("#previousGuesses").textContent += guess + " ";

  if (guess === randomNumber) {
    feedback.textContent = `Congratulations! You guessed it in ${attempts} attempts.`;
    feedback.style.color = "green";
    wins++;
    document.querySelector("#wins").textContent = wins;
    gameOver();
  } else if (attempts >= maxAttempts) {
    feedback.textContent = `You lost! The number was ${randomNumber}.`;
    feedback.style.color = "red";
    losses++;
    document.querySelector("#losses").textContent = losses;
    gameOver();
  } else if (guess < randomNumber) {
    feedback.textContent = "Too low! Try a higher number.";
    feedback.style.color = "blue";
  } else {
    feedback.textContent = "Too high! Try a lower number.";
    feedback.style.color = "blue";
  }

  guessInput.value = "";
  guessInput.focus();
}

function gameOver() {
  document.querySelector("#guessBtn").style.display = "none";
  document.querySelector("#resetBtn").style.display = "inline-block";
}
