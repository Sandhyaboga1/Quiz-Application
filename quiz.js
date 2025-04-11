const quizScreen = document.getElementById("quiz-screen");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-button");
const timerDisplay = document.getElementById("time-left");
const liveScoreMsg = document.getElementById("live-score-msg");
const questionNumber = document.getElementById("question-number");

// ❗ Replace these with the actual subject and level from navigation
let subject = window.selectedSubject || "DSA";
let level = window.selectedLevel || "easy";

let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

let questions = {
  DSA: {
    easy: [
      { question: "What is a Stack?", options: ["LIFO", "FIFO", "Tree", "Graph"], correct: "LIFO" },
      { question: "Queue follows?", options: ["LIFO", "FIFO", "Random", "None"], correct: "FIFO" },
      { question: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: "O(log n)" },
      { question: "Linked list type?", options: ["Single", "Double", "Circular", "All"], correct: "All" },
      { question: "Which is not linear DS?", options: ["Array", "Queue", "Tree", "Stack"], correct: "Tree" }
    ],
    medium: [
      { question: "Heap is used in?", options: ["Sorting", "Searching", "Recursion", "Graphs"], correct: "Sorting" },
      { question: "DFS uses?", options: ["Queue", "Stack", "List", "None"], correct: "Stack" },
      { question: "BFS time complexity?", options: ["O(n)", "O(log n)", "O(V+E)", "O(1)"], correct: "O(V+E)" },
      { question: "Best case for quicksort?", options: ["Sorted array", "Reverse sorted", "Random", "None"], correct: "Random" },
      { question: "Which is dynamic?", options: ["Array", "Linked List", "Stack", "Queue"], correct: "Linked List" }
    ],
    hard: [
      { question: "Segment tree used for?", options: ["Range query", "Sorting", "Search", "None"], correct: "Range query" },
      { question: "A red-black tree is?", options: ["Self-balancing", "Not balanced", "Heap", "Graph"], correct: "Self-balancing" },
      { question: "Time complexity of AVL insertion?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: "O(log n)" },
      { question: "Suffix tree used in?", options: ["Pattern matching", "Sorting", "Graphs", "Queues"], correct: "Pattern matching" },
      { question: "Kruskal’s algo works for?", options: ["MST", "DFS", "BFS", "Shortest path"], correct: "MST" }
    ]
  },
  Java: {
    easy: [
      { question: "Java is?", options: ["Compiled", "Interpreted", "Both", "None"], correct: "Both" },
      { question: "JVM stands for?", options: ["Java Virtual Machine", "Java Verified Method", "None", "All"], correct: "Java Virtual Machine" },
      { question: "Which is a loop?", options: ["if", "for", "case", "return"], correct: "for" },
      { question: "Default value of int?", options: ["0", "null", "undefined", "none"], correct: "0" },
      { question: "OOP concept?", options: ["Inheritance", "Function", "Variable", "None"], correct: "Inheritance" }
    ],
    medium: [
      { question: "Java supports?", options: ["Multithreading", "Pointers", "Macros", "None"], correct: "Multithreading" },
      { question: "Which collection has no duplicate?", options: ["List", "Map", "Set", "Queue"], correct: "Set" },
      { question: "Default size of int in Java?", options: ["4 bytes", "2 bytes", "8 bytes", "1 byte"], correct: "4 bytes" },
      { question: "Which handles exceptions?", options: ["try-catch", "finally", "loop", "if"], correct: "try-catch" },
      { question: "final keyword?", options: ["Constant", "Loop", "Class", "None"], correct: "Constant" }
    ],
    hard: [
      { question: "JIT compiler is used for?", options: ["Performance", "Debugging", "Security", "IO"], correct: "Performance" },
      { question: "Which keyword prevents inheritance?", options: ["final", "private", "static", "abstract"], correct: "final" },
      { question: "JDBC is for?", options: ["Database", "Web", "Files", "None"], correct: "Database" },
      { question: "Garbage collection done by?", options: ["JVM", "User", "Compiler", "None"], correct: "JVM" },
      { question: "Thread lifecycle method?", options: ["start()", "init()", "main()", "void"], correct: "start()" }
    ]
  },
  Python: {
    easy: [
      { question: "Python is?", options: ["Compiled", "Interpreted", "Machine", "None"], correct: "Interpreted" },
      { question: "Function keyword?", options: ["fun", "define", "def", "function"], correct: "def" },
      { question: "List in Python?", options: ["[]", "()", "{}", "<>"], correct: "[]" },
      { question: "Loop in Python?", options: ["loop", "for", "repeat", "return"], correct: "for" },
      { question: "String method?", options: ["split()", "divide()", "part()", "none"], correct: "split()" }
    ],
    medium: [
      { question: "Which is mutable?", options: ["List", "Tuple", "String", "Int"], correct: "List" },
      { question: "Which is used for dictionary?", options: ["{}", "[]", "()", "<>"], correct: "{}" },
      { question: "Python uses?", options: ["Indentation", "Brackets", "Semicolons", "Colons"], correct: "Indentation" },
      { question: "Function returning value uses?", options: ["return", "break", "pass", "none"], correct: "return" },
      { question: "Which is not loop?", options: ["for", "while", "if", "None"], correct: "if" }
    ],
    hard: [
      { question: "Decorators are used for?", options: ["Modify function", "Loop", "Class", "None"], correct: "Modify function" },
      { question: "Python memory managed by?", options: ["Garbage collector", "User", "CPU", "None"], correct: "Garbage collector" },
      { question: "Which is used for data science?", options: ["NumPy", "Tkinter", "Django", "All"], correct: "NumPy" },
      { question: "Lambda in Python?", options: ["Anonymous function", "Loop", "Class", "None"], correct: "Anonymous function" },
      { question: "Global keyword used to?", options: ["Modify global var", "Declare var", "None", "All"], correct: "Modify global var" }
    ]
  }
};

function startQuiz() {
  let availableQuestions = questions[subject][level];

  if (!availableQuestions || availableQuestions.length < 5) {
    alert("Not enough questions available!");
    return;
  }

  currentQuestions = availableQuestions.slice(0, 5); // Using fixed 5 questions
  currentIndex = 0;
  score = 0;

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = timeLeft;
  startTimer();

  const q = currentQuestions[currentIndex];
  questionText.textContent = q.question;
  questionNumber.textContent = `Question ${currentIndex + 1}`;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("option-btn");
    btn.onclick = () => checkAnswer(btn, q.correct);
    optionsContainer.appendChild(btn);
  });

  nextBtn.classList.add("hide");
  liveScoreMsg.classList.add("hide");
  liveScoreMsg.textContent = "";
}

function checkAnswer(button, correct) {
  clearInterval(timer);
  let selected = button.textContent;

  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;
    btn.classList.toggle("correct", btn.textContent === correct);
    btn.classList.toggle("wrong", btn.textContent !== correct);
  });

  if (selected === correct) {
    score++;
    liveScoreMsg.textContent = "+1 Point 🎉";
    liveScoreMsg.style.color = "green";
  } else {
    liveScoreMsg.textContent = "Wrong! No point.";
    liveScoreMsg.style.color = "red";
  }

  liveScoreMsg.classList.remove("hide");
  nextBtn.classList.remove("hide");
}

nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
      loadQuestion();
    } else {
      window.location.href = `final.html?score=${score}&total=${currentQuestions.length}`;
    }
  });
  




function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoFail();
    }
  }, 1000);
}

function autoFail() {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === currentQuestions[currentIndex].correct) {
      btn.classList.add("correct");
    }
  });
  liveScoreMsg.textContent = "Time's up! No point.";
  liveScoreMsg.style.color = "red";
  liveScoreMsg.classList.remove("hide");
  nextBtn.classList.remove("hide");
}



startQuiz();
