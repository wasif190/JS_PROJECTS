document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");
  const scoreMessage = document.getElementById("score-message");
  const questionProgress = document.getElementById("question-progress");

  const questions = [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who wrote 'Hamlet'?",
      choices: [
        "Charles Dickens",
        "Jane Austen",
        "William Shakespeare",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let hasAnswered = false;

  // Start quiz
  startBtn.addEventListener("click", startQuiz);

  // Next question
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  // Restart
  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    startQuiz();
  });

  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
  }

  function showQuestion() {
    hasAnswered = false; // reset lock
    nextBtn.classList.add("hidden");

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    if (questionProgress) {
      questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${
        questions.length
      }`;
    }

    // Clear old choices
    choicesList.innerHTML = "";

    currentQuestion.choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;

      // Tailwind styling for choices
      li.className =
        "w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-700/70 px-4 py-2 text-sm text-slate-100 hover:bg-slate-600 transition";

      li.addEventListener("click", () => selectAnswer(li, choice));
      choicesList.appendChild(li);
    });
  }

  function selectAnswer(selectedLi, selectedChoice) {
    if (hasAnswered) return; // prevent double answering
    hasAnswered = true;

    const correctAnswer = questions[currentQuestionIndex].answer;

    // Mark all choices as disabled + highlight correct
    Array.from(choicesList.children).forEach((li) => {
      li.classList.add("pointer-events-none", "opacity-70");

      const choiceText = li.textContent.trim();

      if (choiceText === correctAnswer) {
        li.classList.remove("opacity-70");
        li.classList.add("bg-emerald-600", "border-emerald-400", "text-white");
      }
    });

    // Check if selected correct or wrong
    if (selectedChoice === correctAnswer) {
      score++;
      // already turned green above, just ensure no opacity
      selectedLi.classList.remove("opacity-70");
    } else {
      // mark wrong selected answer
      selectedLi.classList.remove("opacity-70");
      selectedLi.classList.add("bg-red-600", "border-red-400", "text-white");
    }

    nextBtn.classList.remove("hidden");
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    startBtn.classList.remove("hidden");

    scoreDisplay.textContent = `${score} / ${questions.length}`;

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
      scoreMessage.textContent = "Perfect score! 🔥 You're a quiz master.";
    } else if (percentage >= 60) {
      scoreMessage.textContent = "Nice job! Keep it up 💪";
    } else {
      scoreMessage.textContent = "Good try! Practice a bit more 😊";
    }
  }
});
