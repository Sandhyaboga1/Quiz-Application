const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// Get score from URL params
const queryParams = new URLSearchParams(window.location.search);
const score = queryParams.get("score") || 0;
const total = queryParams.get("total") || 0;

finalScore.textContent = `Your Score: ${score} / ${total}`;

restartBtn.addEventListener("click", () => {
  window.location.href = "quiz.html";
});
