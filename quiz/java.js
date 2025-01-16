// Define questions
const questions = [
  { question: "What is generative AI?", optionA: "Search engine", optionB: "Video player", optionC: "Generator of new ideas", optionD: "A ball!", correctOption: "optionC" },
  { question: "What can generative AI make?", optionA: "Images", optionB: "Predictions", optionC: "Systems", optionD: "Blueprints", correctOption: "optionA" },
  { question: "What are some examples of generative AI tools?", optionA: "Instagram", optionB: "Safari", optionC: "Gemini", optionD: "A treat!!", correctOption: "optionC" },
  { question: "How can generative AI be dangerous?", optionA: "Spreading misinformation", optionB: "Creating truthful content", optionC: "Copyright-free work", optionD: "Making cool videos!", correctOption: "optionA" },
  { question: "How could you better prompt generative AI?", optionA: "Give broad details", optionB: "Be aggressive with my words", optionC: "Use follow-up prompts", optionD: "Give incomplete statements", correctOption: "optionC" }
];

let currentQuestionIndex = 0;
let playerScore = 0;
let wrongAnswers = 0;

let currentLineIndex = 0;
let animationInProgress = false;
let quizReady = false;
let imageToShow = null;  // Store the image path for later

// Text animation variables
const container = document.querySelector(".dogtext");
const nextButton = document.getElementById("nextButton");

const textLines = [
  { speed: 70, string: "Wow," },
  { speed: 35, string: "this steak is amazing!", pause: true },
  { speed: 40, string: "How's your food?" },
  { speed: 60, string: "Hey," },
  { speed: 50, string: "I almost forgot,", pause: true },
  { speed: 30, string: "I wanna know more about your knowledge in" },
  { speed: 50, string: "Generative AI!", classes: ["green"] },
  { speed: 90, string: "So..." }
];

// Helper function to prepare text for animation
function prepareText(line) {
  container.innerHTML = "";
  const characters = [];

  line.string.split("").forEach(character => {
    const span = document.createElement("span");
    span.textContent = character === " " ? "\u00A0" : character;
    container.appendChild(span);

    characters.push({
      span,
      delayAfter: line.speed || 100,
      classes: line.classes || []
    });
  });

  return characters;
}

// Reveal one character at a time
function revealOneCharacter(list, callback) {
  if (list.length === 0) {
    callback && callback();
    const currentLine = textLines[currentLineIndex - 1];
    if (currentLine && currentLine.onComplete) {
      currentLine.onComplete();
    }
    return;
  }

  const next = list.shift();
  setTimeout(() => {
    next.span.classList.add("revealed");
    next.classes.forEach(c => next.span.classList.add(c));
    revealOneCharacter(list, callback);
  }, next.delayAfter);
}

// Function to show the rose container with animation
function showRosewin() {
  const roseContainer = document.querySelector('.rose-container');
  if (roseContainer) {
  roseContainer.style.display = 'block'; // Show the rose container
  roseContainer.classList.add('float-animation'); // Add the animation class

  // Hide the rose container after 6 seconds
  setTimeout(() => {
    roseContainer.style.display = 'none';
    roseContainer.classList.remove('float-animation');
  }, 2000);
} else {
  console.error("Rose container not found.");
}
}

// Show the next text line
function showNextText() {
  if (animationInProgress) return;

  if (currentLineIndex === textLines.length && !quizReady) {
    quizReady = true;
    nextButton.textContent = "Start Quiz";
    nextButton.disabled = false;
    return;
  }

  if (quizReady && currentLineIndex === textLines.length) {
    if (currentQuestionIndex === questions.length) {
      return;
    }
    startQuizGame();
    return;
  }

  const line = textLines[currentLineIndex];
  const characters = prepareText(line);

  animationInProgress = true;
  nextButton.disabled = true;

  revealOneCharacter(characters, () => {
    animationInProgress = false;
    nextButton.disabled = false;
    currentLineIndex++;
  });
}

// Function to hide all elements and display a specific image when the button is clicked
function showImageOnly(imagePath) {
  document.querySelectorAll('.container, .quiz-info, .butterscotch, #score-modal').forEach(element => {
    element.classList.add("hide-all");
  });

  const fullScreenImage = document.createElement("img");
  fullScreenImage.src = imagePath;
  fullScreenImage.classList.add("show-image");

  document.body.appendChild(fullScreenImage);

  // Redirect to another page after 3 seconds
  setTimeout(() => {
    window.location.href = "../intro/introindex.html";  // Replace with the URL you want to redirect to
  }, 3000); // 4000ms = 3 seconds
}


// Start the quiz game
function startQuizGame() {
  document.getElementById("quiz-container").style.display = "block";
  document.querySelector(".dogtext").style.display = "none";
  nextButton.style.display = "none";
  document.querySelector(".quiz-info").style.display = "block";
  loadQuestion(0);
}

// Load a question into the UI
function loadQuestion(index) {
  const question = questions[index];
  document.getElementById("display-question").textContent = question.question;
  document.getElementById("option-one-label").textContent = question.optionA;
  document.getElementById("option-two-label").textContent = question.optionB;
  document.getElementById("option-three-label").textContent = question.optionC;
  document.getElementById("option-four-label").textContent = question.optionD;
  document.getElementById("question-number").textContent = index + 1;

  document.getElementsByName("option").forEach(option => (option.checked = false));
}

// Handle answer selection
function handleAnswerSelection(selectedOption) {
  const question = questions[currentQuestionIndex];

  if (selectedOption.value === question.correctOption) {
    playerScore++;
    showRosewin(); // Show the rose when the answer is correct
  } else {
    wrongAnswers++;
    showRainlose();
  }

  function showRainlose() {
    const rainContainer = document.querySelector('.raincloud-container');
    if (rainContainer) {
      rainContainer.style.display = 'block'; // Show the raincloud container
  
      // Hide the raincloud container after 3 seconds
      setTimeout(() => {
        rainContainer.style.display = 'none';
      }, 3000); // Adjust the duration as needed
    } else {
      console.error("Raincloud container not found.");
    }
  }

  document.getElementById("player-score").textContent = playerScore;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion(currentQuestionIndex);
  } else {
    endGame();
  }
}

// End the game and show final messages or images
function endGame() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("score-modal").style.display = "flex";
  document.getElementById("right-answers").textContent = playerScore;
  document.getElementById("wrong-answers").textContent = wrongAnswers;
  document.getElementById("grade-percentage").textContent = ((playerScore / questions.length) * 100).toFixed(2);

  const finalTextLines = [];

  if (playerScore <= 3) {
    finalTextLines.push({ speed: 70, string: "Oh... thank you for the roses?", pause: true });
    finalTextLines.push({
      speed: 60,
      string: "But I don't think we should see each other again...",
      pause: true,
    });
    finalTextLines.push({
      speed: 50,
      string: "do you even know generative AI like you said you did?",
      classes: ["highlight"],
      onComplete: () => { imageToShow = "gameover.png"; }
    });
  } else if (playerScore === 4) {
    finalTextLines.push({ speed: 70, string: "Wow, thank you for these roses!", pause: true });
    finalTextLines.push({
      speed: 60,
      string: "I think I enjoyed talking to you tonight.",
    });
    finalTextLines.push({
      speed: 50,
      string: "You do know some stuff about generative AI!",
      classes: ["green"],
    });
    finalTextLines.push({
      speed: 50,
      string: "Let's continue being friends.",
      classes: ["green"],
      onComplete: () => { imageToShow = "youwin.png"; }
    });
  } else if (playerScore === 5) {
    finalTextLines.push({ speed: 70, string: "Aww, these are for me? Thank you so much! ♡", pause: true });
    finalTextLines.push({
      speed: 60,
      string: "I really like talking to you.",
    });
    finalTextLines.push({
      speed: 50,
      string: "You impressed me with your knowledge in Generative AI.",
      classes: ["green"],
    });
    finalTextLines.push({
      speed: 50,
      string: "Let's meet again soon, maybe? ♡",
      classes: ["green"],
      onComplete: () => { imageToShow = "youwin.png"; }
    });
  }

  textLines.splice(0, textLines.length, ...finalTextLines);
  currentLineIndex = 0;
  animationInProgress = false;
  quizReady = false;

  document.querySelector(".dogtext").style.display = "block";
  nextButton.style.display = "block";
  nextButton.textContent = "Next";

  showNextText();
}

// Show the image when Next button is clicked
function handleNextButtonClick() {
  if (imageToShow) {
    showImageOnly(imageToShow);
    imageToShow = null;  // Reset after showing the image
  } else {
    showNextText();
  }
}

// Close score modal
function closeScoreModal() {
  currentQuestionIndex = 0;
  playerScore = 0;
  wrongAnswers = 0;
  document.getElementById("score-modal").style.display = "none";
  startQuizGame();
}
window.addEventListener('load', showTransmission);
function showTransmission() {
  const transmission = document.getElementById('transmission');
  
  // Keep the transmission visible for 5 seconds
  setTimeout(() => {
    transmission.style.display = 'none'; // Hide the transmission
    startGame(); // Call your function to initiate the game
  }, 5000); // 5000ms = 5 seconds
}

function startGame() {
  // Add your logic to show the main game container
  const mainContainer = document.querySelector('.container');
  mainContainer.style.display = 'block';
}


// Attach event listeners to option labels
document.getElementsByName("option").forEach(option =>
  option.addEventListener("change", () => handleAnswerSelection(option))
);

// Attach event listener for the next button
nextButton.addEventListener("click", handleNextButtonClick);

// Initialize the game
showNextText();

