// ----------------- Authentication -----------------
let currentUser = null;
function registerUser() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user && pass) {
    localStorage.setItem(user, pass);
    document.getElementById("auth-msg").innerText = "✅ Registered! Please login.";
  } else {
    document.getElementById("auth-msg").innerText = "⚠️ Enter username & password";
  }
}

function loginUser() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (localStorage.getItem(user) === pass) {
    currentUser = user;
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("role-container").classList.remove("hidden");
  } else {
    document.getElementById("auth-msg").innerText = "❌ Invalid credentials!";
  }
}

// ----------------- Quiz Data -----------------
const quizData = {
  student: [
    { q: "What is 2 + 2?", options: ["3", "4", "5"], ans: "4" },
    { q: "Who is the father of Computers?", options: ["Charles Babbage", "Newton", "Einstein"], ans: "Charles Babbage" },
    { q: "HTML stands for?", options: ["Hyper Trainer Markup", "HyperText Markup Language", "Home Tool Markup"], ans: "HyperText Markup Language" }
  ],
  college: [
    { q: "What does HR stand for?", options: ["Human Resource", "High Rank", "Hyper Reference"], ans: "Human Resource" },
    { q: "Which is most common placement round?", options: ["Aptitude Test", "Cooking", "Music"], ans: "Aptitude Test" },
    { q: "LinkedIn is for?", options: ["Jobs & Networking", "Gaming", "Shopping"], ans: "Jobs & Networking" }
  ],
  professional: [
    { q: "What is Agile?", options: ["Framework", "Dance", "Language"], ans: "Framework" },
    { q: "Who manages a team?", options: ["Manager", "Intern", "Driver"], ans: "Manager" },
    { q: "KPI means?", options: ["Key Performance Indicator", "Keep People Inside", "Known Project Issue"], ans: "Key Performance Indicator" }
  ]
};

// ----------------- Quiz Logic -----------------
let role = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let timer;

function startRoleQuiz() {
  role = document.getElementById("role-select").value;
  if (!role) return alert("Select a role!");
  questions = [...quizData[role]];
  currentIndex = 0;
  score = 0;

  document.getElementById("role-container").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  if (currentIndex >= questions.length) return endQuiz();

  const qObj = questions[currentIndex];
  document.getElementById("question").innerText = qObj.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  qObj.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      if (opt === qObj.ans) score++;
      nextQuestion();
    };
    optionsDiv.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  let timeLeft = 10;
  document.getElementById("time").innerText = timeLeft;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function nextQuestion() {
  currentIndex++;
  clearInterval(timer);
  loadQuestion();
}

function endQuiz() {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");
  document.getElementById("score").innerText = `You scored ${score}/${questions.length}`;
  document.getElementById("badge").innerText =
    score === questions.length ? "Badge: Perfect!" :
    score >= Math.floor(questions.length / 2) ? "🥈 Badge: Good Job!" :
    "Badge: Keep Practicing!";
}

// ----------------- Leaderboard -----------------
function saveLeaderboard() {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push({ user: currentUser, role: role, score: score });
  localStorage.setItem("leaderboard", JSON.stringify(board));
  alert("✅ Saved to leaderboard!");
}

function showLeaderboard() {
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("leaderboard-container").classList.remove("hidden");

  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.sort((a, b) => b.score - a.score);

  let list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  board.forEach(b => {
    let li = document.createElement("li");
    li.innerText = `${b.user} (${b.role}) - ${b.score}`;
    list.appendChild(li);
  });
}

function restart() {
  document.getElementById("leaderboard-container").classList.add("hidden");
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("role-container").classList.remove("hidden");
}