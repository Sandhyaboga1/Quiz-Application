// difficulty.js

document.querySelectorAll(".level-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLevel = button.dataset.level;
  
      // Store selected level in localStorage (can be accessed in quiz screen)
      localStorage.setItem("selectedLevel", selectedLevel);
  
      // Redirect to quiz screen
      window.location.href = "quiz.html";
    });
  });
  
