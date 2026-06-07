const STORAGE_KEY = "reyanshBirthdayQuiz.v1";
const ADMIN_SESSION_KEY = "reyanshBirthdayQuiz.admin";
const ADMIN_ID_SESSION_KEY = "reyanshBirthdayQuiz.adminId";
const LETTERS = ["A", "B", "C", "D"];

const DEFAULT_QUESTIONS = [
  {
    id: "q1",
    prompt: "What is Reyansh's favorite color?",
    options: ["[Parents fill favorite color]", "Blue", "Red", "Green"],
    correctIndex: 0,
    note: "Admin should replace the bracketed option with the real answer.",
    confirmed: false
  },
  {
    id: "q2",
    prompt: "What is Reyansh's favorite TV series or show?",
    options: ["[Parents fill favorite show]", "Doraemon", "Pokemon", "Ninja Hattori"],
    correctIndex: 0,
    note: "Use whatever he actually watches most right now.",
    confirmed: false
  },
  {
    id: "q3",
    prompt: "Which cricket team does Reyansh support most?",
    options: ["[Parents fill favorite team]", "Mumbai Indians", "India", "Chennai Super Kings"],
    correctIndex: 0,
    note: "Admin can choose an IPL team, national team, or another team.",
    confirmed: false
  },
  {
    id: "q4",
    prompt: "Who is Reyansh's favorite cricket player?",
    options: ["[Parents fill favorite player]", "Virat Kohli", "Rohit Sharma", "MS Dhoni"],
    correctIndex: 0,
    note: "This is a good question for cricket fans at the party.",
    confirmed: false
  },
  {
    id: "q5",
    prompt: "What is Reyansh's favorite food or snack?",
    options: ["[Parents fill favorite food]", "Pizza", "Pav bhaji", "Pasta"],
    correctIndex: 0,
    note: "Pick a food the kids will recognize as very Reyansh.",
    confirmed: false
  },
  {
    id: "q6",
    prompt: "What is Reyansh's favorite way to spend free time?",
    options: ["[Parents fill favorite pastime]", "Playing cricket", "Watching shows", "Reading comics"],
    correctIndex: 0,
    note: "Use the activity his parents think is most accurate.",
    confirmed: false
  },
  {
    id: "q7",
    prompt: "What is Reyansh's favorite school subject?",
    options: ["[Parents fill favorite subject]", "Maths", "Science", "English"],
    correctIndex: 0,
    note: "Keep the distractors close to subjects he might realistically like.",
    confirmed: false
  },
  {
    id: "q8",
    prompt: "What is Reyansh's favorite thing to eat in his school tiffin?",
    options: ["[Parents fill favorite tiffin item]", "Sandwich", "Paratha", "Idli"],
    correctIndex: 0,
    note: "This works well because classmates may have guesses.",
    confirmed: false
  },
  {
    id: "q9",
    prompt: "What is Reyansh's favorite dessert or sweet?",
    options: ["[Parents fill favorite dessert]", "Chocolate brownie", "Gulab jamun", "Ice cream"],
    correctIndex: 0,
    note: "Use a dessert he actually asks for.",
    confirmed: false
  },
  {
    id: "q10",
    prompt: "What is Reyansh's favorite ice cream flavor?",
    options: ["[Parents fill favorite flavor]", "Chocolate", "Vanilla", "Mango"],
    correctIndex: 0,
    note: "The distractors should be common flavors kids might guess.",
    confirmed: false
  },
  {
    id: "q11",
    prompt: "What birthday cake flavor would Reyansh most likely choose?",
    options: ["[Parents fill cake flavor]", "Chocolate", "Black forest", "Butterscotch"],
    correctIndex: 0,
    note: "A fun one for a 10th birthday quiz.",
    confirmed: false
  },
  {
    id: "q12",
    prompt: "Which holiday place does Reyansh enjoy visiting most?",
    options: ["[Parents fill favorite holiday place]", "Jaipur", "Singapore", "Dubai"],
    correctIndex: 0,
    note: "Use the place he would happily visit again.",
    confirmed: false
  },
  {
    id: "q13",
    prompt: "Which city or place does Reyansh talk about the most?",
    options: ["[Parents fill city or place]", "Mumbai", "Jaipur", "Dubai"],
    correctIndex: 0,
    note: "This can be a travel place, holiday place, or local Mumbai spot.",
    confirmed: false
  },
  {
    id: "q14",
    prompt: "What game does Reyansh like playing most with friends or cousins?",
    options: ["[Parents fill favorite game]", "Cricket", "Football", "Carrom"],
    correctIndex: 0,
    note: "Use a game people at the party might have seen him play.",
    confirmed: false
  },
  {
    id: "q15",
    prompt: "What is Reyansh's favorite video game or mobile game?",
    options: ["[Parents fill favorite game]", "Minecraft", "Roblox", "FIFA"],
    correctIndex: 0,
    note: "If he does not play one, admin can change this to board game or outdoor game.",
    confirmed: false
  },
  {
    id: "q16",
    prompt: "Who is Reyansh's favorite superhero or movie character?",
    options: ["[Parents fill favorite character]", "Spider-Man", "Iron Man", "Harry Potter"],
    correctIndex: 0,
    note: "Choose a character he genuinely likes.",
    confirmed: false
  },
  {
    id: "q17",
    prompt: "What kind of books or comics does Reyansh enjoy most?",
    options: ["[Parents fill favorite book or comic]", "Diary of a Wimpy Kid", "Tinkle", "Harry Potter"],
    correctIndex: 0,
    note: "Admin can make this a specific book, comic, or series.",
    confirmed: false
  },
  {
    id: "q18",
    prompt: "What is Reyansh's favorite song or type of music?",
    options: ["[Parents fill favorite song or music]", "Bollywood songs", "English pop", "Cricket anthems"],
    correctIndex: 0,
    note: "If song is too specific, use a music type.",
    confirmed: false
  },
  {
    id: "q19",
    prompt: "Which restaurant, cafe, or food place does Reyansh like most?",
    options: ["[Parents fill favorite food place]", "McDonald's", "Pizza place", "Ice cream shop"],
    correctIndex: 0,
    note: "Keep the options familiar to the children attending.",
    confirmed: false
  },
  {
    id: "q20",
    prompt: "What would Reyansh choose first on a free weekend?",
    options: ["[Parents fill weekend choice]", "Play cricket", "Watch a show", "Go out to eat"],
    correctIndex: 0,
    note: "This is a good final question because everyone can guess.",
    confirmed: false
  }
];

let quiz = loadQuiz();
let adminRefreshTimer = null;
let state = {
  route: routeFromHash(),
  adminAuthed: sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  adminId: sessionStorage.getItem(ADMIN_ID_SESSION_KEY) || "",
  adminPanel: "questions",
  selectedQuestionId: "q1",
  game: null,
  lastResult: null,
  serverOnline: false,
  storageMode: "local",
  durableStorage: false
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  importQuizFromUrl();
  bindStaticEvents();
  await hydrateFromServer();
  renderAll();
}

function bindStaticEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });

  window.addEventListener("hashchange", () => {
    state.route = routeFromHash();
    renderRoute();
  });

  $("#start-form").addEventListener("submit", onStartQuiz);
  $("#back-question").addEventListener("click", onBackQuestion);
  $("#next-question").addEventListener("click", onNextQuestion);
  $("#quit-quiz").addEventListener("click", onQuitQuiz);
  $("#play-again").addEventListener("click", resetPlayScreen);
  $("#copy-result-ticket").addEventListener("click", copyLatestResultTicket);
  $("#clear-public-results").addEventListener("click", clearResults);
  $("#owner-lock").addEventListener("click", lockOwner);

  document.querySelectorAll(".admin-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.adminPanel = button.dataset.adminPanel;
      renderAdminPanels();
    });
  });

  $("#question-form").addEventListener("submit", saveEditedQuestion);
  $("#restore-question").addEventListener("click", restoreSelectedQuestion);
  $("#editor-correct-index").addEventListener("change", syncSelectedOptionFromEditorAnswer);
  $("#editor-answer").addEventListener("input", syncSelectedOptionFromEditorAnswer);
  $("#copy-player-link").addEventListener("click", () => copyShareLink("play"));
  $("#copy-owner-link").addEventListener("click", () => copyShareLink("owner"));
  $("#copy-parent-note").addEventListener("click", copyParentNote);
  $("#download-setup").addEventListener("click", () => downloadQuizJson(false));
  $("#download-party-data").addEventListener("click", () => downloadQuizJson(true));
  $("#import-json").addEventListener("change", importQuizFile);
  $("#reset-starter").addEventListener("click", resetStarterSetup);
  $("#add-result-ticket").addEventListener("click", addResultTicket);
  $("#reset-results").addEventListener("click", clearResults);
}

function renderAll() {
  renderHeroStatus();
  renderLeaderboard();
  renderOwner();
  renderRoute();
}

function renderRoute() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === `view-${state.route}`);
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === state.route);
  });

  if (state.route === "leaderboard") {
    renderLeaderboard();
  }

  if (state.route === "owner") {
    renderOwner();
  } else {
    stopAdminRefresh();
  }
}

function setRoute(route) {
  state.route = route;
  if (window.location.hash.replace("#", "") !== route) {
    window.location.hash = route;
  } else {
    renderRoute();
  }
}

function routeFromHash() {
  const route = window.location.hash.replace("#", "").split("&")[0];
  return ["play", "leaderboard", "owner"].includes(route) ? route : "play";
}

function defaultQuiz() {
  return {
    version: 1,
    title: "How Well Do You Know Reyansh?",
    subtitle: "10th Birthday Quiz",
    ownerHash: "",
    updatedAt: new Date().toISOString(),
    questions: DEFAULT_QUESTIONS.map(copyQuestion),
    results: [],
    participants: []
  };
}

function loadQuiz() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultQuiz();
    return normalizeQuiz(JSON.parse(saved));
  } catch (error) {
    console.warn("Could not load saved quiz", error);
    return defaultQuiz();
  }
}

function saveQuiz(options = {}) {
  quiz.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));
  renderHeroStatus();
  renderLeaderboard();
  if (state.adminAuthed) {
    renderAdminDashboard();
  }
  if (options.syncServer) {
    syncQuizToServer();
  }
}

function normalizeQuiz(input) {
  const fallback = defaultQuiz();
  const incomingQuestions = Array.isArray(input?.questions) ? input.questions : fallback.questions;
  const questions = incomingQuestions.slice(0, 20).map((question, index) => {
    const fallbackQuestion = fallback.questions[index] || fallback.questions[0];
    return normalizeQuestion(question, fallbackQuestion, index);
  });

  while (questions.length < 20) {
    questions.push(copyQuestion(fallback.questions[questions.length]));
  }

  return {
    version: 1,
    title: String(input?.title || fallback.title),
    subtitle: String(input?.subtitle || fallback.subtitle),
    ownerHash: String(input?.ownerHash || ""),
    updatedAt: String(input?.updatedAt || new Date().toISOString()),
    questions,
    results: Array.isArray(input?.results) ? input.results.map(normalizeResult).filter(Boolean) : [],
    participants: Array.isArray(input?.participants) ? input.participants.map(normalizeParticipant).filter(Boolean) : []
  };
}

function normalizeQuestion(question, fallbackQuestion, index) {
  const fallback = copyQuestion(fallbackQuestion);
  const options = Array.isArray(question?.options) ? question.options.slice(0, 4).map((value) => String(value || "")) : fallback.options;
  while (options.length < 4) options.push("");

  const correctIndex = Number.isInteger(question?.correctIndex)
    ? question.correctIndex
    : Number.parseInt(question?.correctIndex, 10);

  return {
    id: String(question?.id || fallback.id || `q${index + 1}`),
    prompt: String(question?.prompt || fallback.prompt || ""),
    options,
    correctIndex: correctIndex >= 0 && correctIndex <= 3 ? correctIndex : fallback.correctIndex,
    note: String(question?.note || ""),
    confirmed: Boolean(question?.confirmed)
  };
}

function copyQuestion(question) {
  return {
    id: question.id,
    prompt: question.prompt,
    options: [...question.options],
    correctIndex: question.correctIndex,
    note: question.note,
    confirmed: question.confirmed
  };
}

function normalizeResult(result) {
  if (!result || typeof result !== "object") return null;
  const score = Number(result.score);
  const total = Number(result.total);
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return null;

  return {
    id: String(result.id || createId("result")),
    participantId: result.participantId ? String(result.participantId) : "",
    name: String(result.name || "Player").slice(0, 32),
    score: Math.max(0, Math.min(score, total)),
    total,
    durationSec: Math.max(0, Number(result.durationSec) || 0),
    createdAt: String(result.createdAt || new Date().toISOString()),
    answers: Array.isArray(result.answers) ? result.answers : []
  };
}

function normalizeParticipant(participant) {
  if (!participant || typeof participant !== "object") return null;
  return {
    id: String(participant.id || createId("player")),
    name: String(participant.name || "Player").slice(0, 32),
    status: participant.status === "completed" ? "completed" : "in-progress",
    startedAt: String(participant.startedAt || new Date().toISOString()),
    submittedAt: participant.submittedAt ? String(participant.submittedAt) : "",
    score: participant.score !== null && participant.score !== undefined && participant.score !== "" && Number.isFinite(Number(participant.score)) ? Number(participant.score) : null,
    total: participant.total !== null && participant.total !== undefined && participant.total !== "" && Number.isFinite(Number(participant.total)) ? Number(participant.total) : null
  };
}

async function hydrateFromServer() {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    applyServerPayload(data);
    state.serverOnline = true;
  } catch (error) {
    state.serverOnline = false;
  }
}

function applyServerPayload(data) {
  if (!data?.quiz) return;
  quiz = normalizeQuiz(data.quiz);
  state.storageMode = data.storage?.mode || "server";
  state.durableStorage = Boolean(data.storage?.durable);
  state.serverOnline = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));
}

async function syncQuizToServer() {
  if (!state.serverOnline || !state.adminId) return;

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminId: state.adminId,
        quiz: exportPayload(false)
      })
    });
    if (!response.ok) throw new Error("Server rejected quiz update");
    applyServerPayload(await response.json());
    renderAll();
    toast("Admin changes saved to the shared quiz.");
  } catch (error) {
    console.warn("Could not sync quiz", error);
    toast("Saved locally, but shared server sync failed.");
  }
}

function importQuizFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("quiz");
  if (!encoded) return;

  try {
    quiz = normalizeQuiz(decodePayload(encoded));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));
    toast("Loaded shared quiz setup on this device.");
  } catch (error) {
    console.warn("Could not import quiz from URL", error);
    toast("This shared quiz link could not be loaded.");
  }
}

function renderHeroStatus() {
  const ready = readyQuestions().length;
  const drafts = quiz.questions.length - ready;
  $("#ready-status").textContent = drafts === 0 ? "Ready for party" : `${drafts} need parent edit`;
  $("#question-count").textContent = `${quiz.questions.length} questions`;
  $("#result-count").textContent = `${quiz.results.length} results`;
  $("#setup-warning").textContent = drafts
    ? `${drafts} questions still need admin confirmation. You can preview, but finish Owner setup before the party.`
    : "Quiz is ready for party play.";
}

function readyQuestions() {
  return quiz.questions.filter(isQuestionReady);
}

function isQuestionReady(question) {
  return Boolean(
    question.confirmed &&
      question.prompt.trim() &&
      question.options.length === 4 &&
      question.options.every((option) => option.trim() && !isPlaceholder(option)) &&
      Number.isInteger(question.correctIndex) &&
      question.correctIndex >= 0 &&
      question.correctIndex <= 3
  );
}

function isPlaceholder(value) {
  const text = String(value || "").toLowerCase();
  return text.includes("[parents fill") || text.includes("[fill") || text.includes("to be confirmed");
}

async function onStartQuiz(event) {
  event.preventDefault();
  const name = $("#player-name").value.trim();
  if (!name) return;

  const drafts = quiz.questions.length - readyQuestions().length;
  if (drafts && !window.confirm(`${drafts} questions still need owner setup. Start a preview anyway?`)) {
    return;
  }

  state.game = {
    name,
    index: 0,
    answers: Array(quiz.questions.length).fill(null),
    startedAt: Date.now(),
    participantId: ""
  };
  await registerParticipant(name);
  state.lastResult = null;
  $(".hero").classList.add("hidden");
  $("#result-panel").classList.add("hidden");
  $("#quiz-shell").classList.remove("hidden");
  renderCurrentQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function registerParticipant(name) {
  if (!state.serverOnline) return;

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", name })
    });
    if (!response.ok) throw new Error("Could not register participant");
    const data = await response.json();
    if (data.participant?.id && state.game) {
      state.game.participantId = data.participant.id;
      quiz.participants = [...(quiz.participants || []), normalizeParticipant(data.participant)].filter(Boolean);
      saveQuiz();
    }
  } catch (error) {
    console.warn("Participant registration failed", error);
  }
}

function renderCurrentQuestion() {
  if (!state.game) return;
  const index = state.game.index;
  const question = quiz.questions[index];
  const selected = state.game.answers[index];
  const percent = ((index + 1) / quiz.questions.length) * 100;

  $("#quiz-player").textContent = state.game.name;
  $("#question-title").textContent = `Question ${index + 1}`;
  $("#progress-label").textContent = `${index + 1} / ${quiz.questions.length}`;
  $("#progress-fill").style.width = `${percent}%`;
  $("#question-prompt").textContent = question.prompt;
  $("#question-note").textContent = question.confirmed ? "" : "Admin note: this question still needs confirmation.";

  const optionsEl = $("#answer-options");
  optionsEl.innerHTML = question.options.map((option, optionIndex) => `
    <button class="option-button ${selected === optionIndex ? "selected" : ""}" type="button" role="radio" aria-checked="${selected === optionIndex}" data-option="${optionIndex}">
      <span class="option-letter">${LETTERS[optionIndex]}</span>
      <span class="option-text">${escapeHtml(option)}</span>
    </button>
  `).join("");

  optionsEl.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.game.answers[index] = Number(button.dataset.option);
      renderCurrentQuestion();
    });
  });

  $("#back-question").disabled = index === 0;
  $("#next-question").disabled = selected === null;
  $("#next-question").textContent = index === quiz.questions.length - 1 ? "Finish" : "Next";
}

function onBackQuestion() {
  if (!state.game || state.game.index === 0) return;
  state.game.index -= 1;
  renderCurrentQuestion();
}

function onNextQuestion() {
  if (!state.game) return;
  const selected = state.game.answers[state.game.index];
  if (selected === null) return;

  if (state.game.index === quiz.questions.length - 1) {
    finishQuiz();
    return;
  }

  state.game.index += 1;
  renderCurrentQuestion();
}

function onQuitQuiz() {
  if (!state.game) return;
  if (!window.confirm("Quit this quiz attempt?")) return;
  state.game = null;
  resetPlayScreen();
}

async function finishQuiz() {
  const game = state.game;
  const durationSec = Math.round((Date.now() - game.startedAt) / 1000);
  let result = buildLocalResult(game.name, game.answers, durationSec, game.participantId);

  if (state.serverOnline) {
    try {
      const response = await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          name: game.name,
          participantId: game.participantId,
          answers: game.answers,
          durationSec
        })
      });
      if (!response.ok) throw new Error("Server rejected submission");
      const data = await response.json();
      result = normalizeResult(data.result) || result;
      applyServerPayload(data);
    } catch (error) {
      console.warn("Shared submission failed", error);
      quiz.results.push(result);
      toast("Shared submission failed, so this score was saved locally.");
    }
  } else {
    quiz.results.push(result);
  }

  state.lastResult = result;
  state.game = null;
  saveQuiz();
  renderResult(result);
  burstConfetti();
}

function buildLocalResult(name, selectedAnswers, durationSec, participantId = "") {
  const answers = quiz.questions.map((question, index) => {
    const selectedIndex = selectedAnswers[index];
    return {
      questionId: question.id,
      selectedIndex,
      correctIndex: question.correctIndex,
      selectedText: question.options[selectedIndex] || "",
      correctText: question.options[question.correctIndex] || ""
    };
  });

  const score = answers.filter((answer) => answer.selectedIndex === answer.correctIndex).length;
  return {
    id: createId("result"),
    participantId,
    name,
    score,
    total: quiz.questions.length,
    durationSec,
    createdAt: new Date().toISOString(),
    answers
  };
}

function renderResult(result) {
  $(".hero").classList.add("hidden");
  $("#quiz-shell").classList.add("hidden");
  $("#result-panel").classList.remove("hidden");
  $("#score-line").textContent = `${result.score} / ${result.total}`;
  $("#score-message").textContent = scoreMessage(result.score, result.total);

  const review = $("#answer-review");
  review.innerHTML = quiz.questions.map((question, index) => {
    const answer = result.answers[index];
    const correct = answer.selectedIndex === answer.correctIndex;
    return `
      <article class="review-item ${correct ? "correct" : ""}">
        <strong>${index + 1}. ${escapeHtml(question.prompt)}</strong>
        <span>Your answer: ${escapeHtml(answer.selectedText || "No answer")}</span>
        <span>Correct answer: ${escapeHtml(answer.correctText || "")}</span>
        ${question.note ? `<span>${escapeHtml(question.note)}</span>` : ""}
      </article>
    `;
  }).join("");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scoreMessage(score, total) {
  const percent = score / total;
  if (percent === 1) return "Perfect score. That is hard to beat.";
  if (percent >= 0.8) return "Excellent score. You know Reyansh very well.";
  if (percent >= 0.6) return "Solid score. You are definitely in the running.";
  if (percent >= 0.4) return "Good try. The birthday facts are not easy.";
  return "Nice attempt. Time to ask Reyansh a few more questions.";
}

function resetPlayScreen() {
  state.game = null;
  state.lastResult = null;
  $("#quiz-shell").classList.add("hidden");
  $("#result-panel").classList.add("hidden");
  $(".hero").classList.remove("hidden");
  $("#player-name").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function copyLatestResultTicket() {
  if (!state.lastResult) {
    toast("No result ticket is available yet.");
    return;
  }

  copyText(createResultTicket(state.lastResult)).then(() => {
    toast("Result ticket copied.");
  });
}

function createResultTicket(result) {
  return encodePayload({
    type: "reyansh-result-v1",
    result: normalizeResult({
      id: result.id,
      participantId: result.participantId,
      name: result.name,
      score: result.score,
      total: result.total,
      durationSec: result.durationSec,
      createdAt: result.createdAt
    })
  });
}

function addResultTicket() {
  const input = $("#result-ticket-input");
  const ticket = input.value.trim();
  if (!ticket) return;

  try {
    const decoded = decodePayload(ticket);
    if (decoded?.type !== "reyansh-result-v1") {
      throw new Error("Wrong ticket type");
    }
    const result = normalizeResult(decoded.result);
    if (!result) throw new Error("Invalid result");
    if (quiz.results.some((item) => item.id === result.id)) {
      toast("This result ticket is already on the leaderboard.");
      return;
    }
    quiz.results.push(result);
    input.value = "";
    saveQuiz();
    renderOwnerResults();
    toast("Result ticket added.");
  } catch (error) {
    console.warn("Could not add result ticket", error);
    toast("That result ticket could not be read.");
  }
}

function renderLeaderboard() {
  const list = $("#leaderboard-list");
  const results = sortedResults();

  if (!results.length) {
    list.innerHTML = `<div class="empty-state">No results yet. Players will appear here after they finish the quiz on this device, or after result tickets are added by an owner.</div>`;
    return;
  }

  list.innerHTML = results.map((result, index) => `
    <article class="leader-row">
      <span class="rank">${index + 1}</span>
      <span class="leader-name">${escapeHtml(result.name)}</span>
      <span class="leader-meta">${result.score} / ${result.total}</span>
      <span class="leader-time">${formatDuration(result.durationSec)}</span>
    </article>
  `).join("");
}

function sortedResults() {
  return [...quiz.results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.durationSec !== b.durationSec) return a.durationSec - b.durationSec;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

function clearResults() {
  if (!quiz.results.length && !(quiz.participants || []).length) {
    toast("There are no participants or results to clear.");
    return;
  }
  if (!window.confirm("Clear all saved quiz results on this device?")) return;
  if (state.serverOnline && state.adminId) {
    resetSharedState("resetResults");
    return;
  }
  quiz.results = [];
  quiz.participants = [];
  saveQuiz();
  renderOwnerResults();
  toast("Results cleared.");
}

function renderOwner() {
  $("#owner-lock").classList.toggle("hidden", !state.adminAuthed);

  if (!state.adminAuthed) {
    stopAdminRefresh();
    $("#owner-dashboard").classList.add("hidden");
    $("#owner-locked").classList.remove("hidden");
    renderOwnerLocked();
    return;
  }

  $("#owner-locked").classList.add("hidden");
  $("#owner-dashboard").classList.remove("hidden");
  startAdminRefresh();
  renderAdminDashboard();
}

function startAdminRefresh() {
  if (adminRefreshTimer || !state.adminId || !state.serverOnline) return;
  adminRefreshTimer = window.setInterval(refreshAdminState, 5000);
}

function stopAdminRefresh() {
  if (!adminRefreshTimer) return;
  window.clearInterval(adminRefreshTimer);
  adminRefreshTimer = null;
}

async function refreshAdminState() {
  if (!state.adminId || !state.serverOnline || state.route !== "owner") return;
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) throw new Error("Admin refresh failed");
    applyServerPayload(await response.json());
    renderHeroStatus();
    renderLeaderboard();
    renderAdminDashboard();
  } catch (error) {
    console.warn("Admin refresh failed", error);
  }
}

function renderOwnerLocked() {
  const locked = $("#owner-locked");
  locked.innerHTML = `
    <div class="owner-card">
      <h2>Admin Login</h2>
      <p>Enter the admin ID to edit answers and see participants.</p>
      <form id="owner-login-form">
        <label>
          Admin ID
          <input id="owner-code-input" type="password" autocomplete="current-password" required>
        </label>
        <button class="primary-button" type="submit">Unlock Admin Tools</button>
        <p id="owner-error" class="setup-warning" role="status"></p>
      </form>
    </div>
  `;

  $("#owner-login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = $("#owner-code-input").value.trim();
    const error = $("#owner-error");
    error.textContent = "";

    try {
      const response = await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyAdmin", adminId: code })
      });
      if (!response.ok) throw new Error("Admin ID not accepted");
      state.adminId = code;
      sessionStorage.setItem(ADMIN_ID_SESSION_KEY, code);
      applyServerPayload(await response.json());
      unlockOwner();
      toast("Admin tools unlocked.");
      return;
    } catch (loginError) {
      console.warn("Admin login failed", loginError);
    }

    error.textContent = "Admin ID not accepted.";
  });
}

function unlockOwner() {
  state.adminAuthed = true;
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  renderOwner();
}

function lockOwner() {
  state.adminAuthed = false;
  state.adminId = "";
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ID_SESSION_KEY);
  renderOwner();
  toast("Admin tools locked.");
}

function renderAdminDashboard() {
  const ready = readyQuestions().length;
  $("#metric-ready").textContent = ready;
  $("#metric-draft").textContent = quiz.questions.length - ready;
  $("#metric-results").textContent = `${quiz.results.length}/${(quiz.participants || []).length || quiz.results.length}`;
  $("#metric-code").textContent = state.adminAuthed ? "Unlocked" : "Locked";
  renderAdminPanels();
}

function renderAdminPanels() {
  document.querySelectorAll(".admin-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminPanel === state.adminPanel);
  });

  document.querySelectorAll(".admin-panel").forEach((panel) => {
    panel.classList.toggle("active-admin-panel", panel.id === `admin-panel-${state.adminPanel}`);
  });

  if (state.adminPanel === "questions") {
    renderAdminQuestionList();
    fillQuestionEditor();
  }

  if (state.adminPanel === "results") {
    renderOwnerResults();
  }
}

function renderAdminQuestionList() {
  const list = $("#admin-question-list");
  list.innerHTML = quiz.questions.map((question, index) => {
    const ready = isQuestionReady(question);
    return `
      <button class="question-list-button ${question.id === state.selectedQuestionId ? "active" : ""}" type="button" data-id="${escapeHtml(question.id)}">
        <span class="number">${index + 1}</span>
        <span class="title">${escapeHtml(question.prompt)}</span>
        <span class="status-dot ${ready ? "ready" : ""}" title="${ready ? "Ready" : "Needs edit"}"></span>
      </button>
    `;
  }).join("");

  list.querySelectorAll(".question-list-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedQuestionId = button.dataset.id;
      renderAdminQuestionList();
      fillQuestionEditor();
    });
  });
}

function selectedQuestion() {
  return quiz.questions.find((question) => question.id === state.selectedQuestionId) || quiz.questions[0];
}

function fillQuestionEditor() {
  const question = selectedQuestion();
  const number = quiz.questions.findIndex((item) => item.id === question.id) + 1;
  $("#editor-number").value = String(number);
  $("#editor-prompt").value = question.prompt;
  $("#editor-correct-index").value = String(question.correctIndex);
  $("#editor-answer").value = question.options[question.correctIndex] || "";
  question.options.forEach((option, index) => {
    $(`#editor-option-${index}`).value = option;
  });
  $("#editor-note").value = question.note || "";
  $("#editor-confirmed").checked = question.confirmed;
}

function syncSelectedOptionFromEditorAnswer() {
  const index = Number($("#editor-correct-index").value);
  $(`#editor-option-${index}`).value = $("#editor-answer").value;
}

function saveEditedQuestion(event) {
  event.preventDefault();
  const question = selectedQuestion();
  const correctIndex = Number($("#editor-correct-index").value);
  const options = [0, 1, 2, 3].map((index) => $(`#editor-option-${index}`).value.trim());
  const answer = $("#editor-answer").value.trim();
  options[correctIndex] = answer;

  question.prompt = $("#editor-prompt").value.trim();
  question.options = options;
  question.correctIndex = correctIndex;
  question.note = $("#editor-note").value.trim();
  question.confirmed = $("#editor-confirmed").checked;

  saveQuiz({ syncServer: true });
  renderAdminQuestionList();
  fillQuestionEditor();
  toast(isQuestionReady(question) ? "Question saved and ready." : "Question saved, but it still needs cleanup.");
}

function restoreSelectedQuestion() {
  const current = selectedQuestion();
  const index = quiz.questions.findIndex((question) => question.id === current.id);
  const fallback = DEFAULT_QUESTIONS[index];
  if (!fallback || !window.confirm("Restore this question to its original starter text?")) return;
  quiz.questions[index] = copyQuestion(fallback);
  state.selectedQuestionId = quiz.questions[index].id;
  saveQuiz({ syncServer: true });
  renderAdminQuestionList();
  fillQuestionEditor();
  toast("Question restored.");
}

function copyShareLink(route) {
  const url = new URL(window.location.href);
  if (state.serverOnline) {
    url.searchParams.delete("quiz");
  } else {
    url.searchParams.set("quiz", encodePayload(exportPayload(false)));
  }
  url.hash = route;
  copyText(url.toString()).then(() => {
    toast(route === "owner" ? "Owner link copied." : "Player link copied.");
  });
}

function copyParentNote() {
  const ownerUrl = new URL(window.location.href);
  if (state.serverOnline) {
    ownerUrl.searchParams.delete("quiz");
  } else {
    ownerUrl.searchParams.set("quiz", encodePayload(exportPayload(false)));
  }
  ownerUrl.hash = "owner";

  const playerUrl = new URL(window.location.href);
  if (state.serverOnline) {
    playerUrl.searchParams.delete("quiz");
  } else {
    playerUrl.searchParams.set("quiz", encodePayload(exportPayload(false)));
  }
  playerUrl.hash = "play";

  const note = [
    "Hi, here is Reyansh's 10th birthday quiz setup.",
    "",
    `Owner link: ${ownerUrl.toString()}`,
    "",
    `Player link: ${playerUrl.toString()}`,
    "",
    "Please open the Owner link, enter the admin ID shared separately, check all 20 questions, and fill the placeholders before the party."
  ].filter(Boolean).join("\n");

  copyText(note).then(() => toast("Parent setup note copied."));
}

function exportPayload(includeResults) {
  return {
    version: 1,
    title: quiz.title,
    subtitle: quiz.subtitle,
    ownerHash: quiz.ownerHash,
    updatedAt: new Date().toISOString(),
    questions: quiz.questions.map(copyQuestion),
    results: includeResults ? quiz.results.map(normalizeResult).filter(Boolean) : [],
    participants: includeResults ? (quiz.participants || []).map(normalizeParticipant).filter(Boolean) : []
  };
}

function downloadQuizJson(includeResults) {
  const payload = exportPayload(includeResults);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = includeResults ? "reyansh-quiz-party-data.json" : "reyansh-quiz-setup.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast(includeResults ? "Party data JSON downloaded." : "Setup JSON downloaded.");
}

function importQuizFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      quiz = normalizeQuiz(JSON.parse(String(reader.result)));
      saveQuiz({ syncServer: true });
      renderAll();
      toast("Quiz JSON imported.");
    } catch (error) {
      console.warn("Could not import JSON", error);
      toast("That JSON file could not be imported.");
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
}

function resetStarterSetup() {
  if (!window.confirm("Reset the quiz setup and local results back to the starter version?")) return;
  if (state.serverOnline && state.adminId) {
    resetSharedState("resetStarter");
    return;
  }
  quiz = defaultQuiz();
  state.adminAuthed = false;
  state.adminId = "";
  state.adminPanel = "questions";
  state.selectedQuestionId = "q1";
  state.game = null;
  state.lastResult = null;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_ID_SESSION_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));
  $(".hero").classList.remove("hidden");
  $("#quiz-shell").classList.add("hidden");
  $("#result-panel").classList.add("hidden");
  setRoute("play");
  renderAll();
  toast("Starter setup restored.");
}

async function resetSharedState(action) {
  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: state.adminId, action })
    });
    if (!response.ok) throw new Error("Server reset failed");
    applyServerPayload(await response.json());
    if (action === "resetStarter") {
      lockOwner();
      setRoute("play");
    }
    renderAll();
    toast(action === "resetResults" ? "Shared results cleared." : "Starter setup restored.");
  } catch (error) {
    console.warn("Could not reset shared state", error);
    toast("Shared reset failed.");
  }
}

function renderOwnerResults() {
  const container = $("#owner-results-list");
  const results = sortedResults();
  const completedIds = new Set(results.map((result) => result.participantId).filter(Boolean));
  const inProgress = (quiz.participants || [])
    .filter((participant) => participant.status !== "completed" && !completedIds.has(participant.id))
    .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

  if (!results.length && !inProgress.length) {
    container.innerHTML = `<div class="empty-state">No participants have started yet.</div>`;
    return;
  }

  const activeRows = inProgress.map((participant) => `
    <div class="mini-result-row">
      <span>${escapeHtml(participant.name)}</span>
      <strong>In progress</strong>
    </div>
  `).join("");

  const resultRows = results.map((result) => `
    <div class="mini-result-row">
      <span>${escapeHtml(result.name)}</span>
      <strong>${result.score} / ${result.total}</strong>
    </div>
  `).join("");

  container.innerHTML = `${activeRows}${resultRows}`;
}

function encodePayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePayload(encoded) {
  const padded = String(encoded).replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  if (!minutes) return `${remainder}s`;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

function createId(prefix) {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

function burstConfetti() {
  const colors = ["#e84f62", "#f59b22", "#008f8c", "#2d7dd2", "#7556c7"];
  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 260}ms`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1300);
  }
}

function toast(message) {
  const toastEl = $("#toast");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(toastEl.dataset.timer);
  toastEl.dataset.timer = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2800);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function $(selector) {
  return document.querySelector(selector);
}
