// Subject screen lo buttons click ayyaka next screen ki velladam
const subjectButtons = document.querySelectorAll("[data-subject]");

subjectButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedSubject = btn.dataset.subject;
    localStorage.setItem("selectedSubject", selectedSubject);
    // Redirect to difficulty level screen
    window.location.href = "difficulty.html";
  });
});
