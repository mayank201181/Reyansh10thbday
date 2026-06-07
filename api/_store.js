const ADMIN_ID = String(process.env.ADMIN_ID || "").trim().toLowerCase();
const STATE_KEY = process.env.QUIZ_STATE_KEY || "reyansh-10th-birthday-state-v1";
const BLOB_STATE_PATH = process.env.QUIZ_BLOB_PATH || "reyansh-birthday-quiz/state.json";

let memoryState;

const defaultQuestions = [
  ["q1", "What is Reyansh's favorite color?", ["[Parents fill favorite color]", "Blue", "Red", "Green"], 0, "Admin should replace the bracketed option with the real answer.", false],
  ["q2", "What is Reyansh's favorite TV series or show?", ["[Parents fill favorite show]", "Doraemon", "Pokemon", "Ninja Hattori"], 0, "Use whatever he actually watches most right now.", false],
  ["q3", "Which cricket team does Reyansh support most?", ["[Parents fill favorite team]", "Mumbai Indians", "India", "Chennai Super Kings"], 0, "Admin can choose an IPL team, national team, or another team.", false],
  ["q4", "Who is Reyansh's favorite cricket player?", ["[Parents fill favorite player]", "Virat Kohli", "Rohit Sharma", "MS Dhoni"], 0, "This is a good question for cricket fans at the party.", false],
  ["q5", "What is Reyansh's favorite food or snack?", ["[Parents fill favorite food]", "Pizza", "Pav bhaji", "Pasta"], 0, "Pick a food the kids will recognize as very Reyansh.", false],
  ["q6", "What is Reyansh's favorite way to spend free time?", ["[Parents fill favorite pastime]", "Playing cricket", "Watching shows", "Reading comics"], 0, "Use the activity his parents think is most accurate.", false],
  ["q7", "What is Reyansh's favorite school subject?", ["[Parents fill favorite subject]", "Maths", "Science", "English"], 0, "Keep the distractors close to subjects he might realistically like.", false],
  ["q8", "What is Reyansh's favorite thing to eat in his school tiffin?", ["[Parents fill favorite tiffin item]", "Sandwich", "Paratha", "Idli"], 0, "This works well because classmates may have guesses.", false],
  ["q9", "What is Reyansh's favorite dessert or sweet?", ["[Parents fill favorite dessert]", "Chocolate brownie", "Gulab jamun", "Ice cream"], 0, "Use a dessert he actually asks for.", false],
  ["q10", "What is Reyansh's favorite ice cream flavor?", ["[Parents fill favorite flavor]", "Chocolate", "Vanilla", "Mango"], 0, "The distractors should be common flavors kids might guess.", false],
  ["q11", "What birthday cake flavor would Reyansh most likely choose?", ["[Parents fill cake flavor]", "Chocolate", "Black forest", "Butterscotch"], 0, "A fun one for a 10th birthday quiz.", false],
  ["q12", "Which holiday place does Reyansh enjoy visiting most?", ["[Parents fill favorite holiday place]", "Jaipur", "Singapore", "Dubai"], 0, "Use the place he would happily visit again.", false],
  ["q13", "Which city or place does Reyansh talk about the most?", ["[Parents fill city or place]", "Mumbai", "Jaipur", "Dubai"], 0, "This can be a travel place, holiday place, or local Mumbai spot.", false],
  ["q14", "What game does Reyansh like playing most with friends or cousins?", ["[Parents fill favorite game]", "Cricket", "Football", "Carrom"], 0, "Use a game people at the party might have seen him play.", false],
  ["q15", "What is Reyansh's favorite video game or mobile game?", ["[Parents fill favorite game]", "Minecraft", "Roblox", "FIFA"], 0, "If he does not play one, admin can change this to board game or outdoor game.", false],
  ["q16", "Who is Reyansh's favorite superhero or movie character?", ["[Parents fill favorite character]", "Spider-Man", "Iron Man", "Harry Potter"], 0, "Choose a character he genuinely likes.", false],
  ["q17", "What kind of books or comics does Reyansh enjoy most?", ["[Parents fill favorite book or comic]", "Diary of a Wimpy Kid", "Tinkle", "Harry Potter"], 0, "Admin can make this a specific book, comic, or series.", false],
  ["q18", "What is Reyansh's favorite song or type of music?", ["[Parents fill favorite song or music]", "Bollywood songs", "English pop", "Cricket anthems"], 0, "If song is too specific, use a music type.", false],
  ["q19", "Which restaurant, cafe, or food place does Reyansh like most?", ["[Parents fill favorite food place]", "McDonald's", "Pizza place", "Ice cream shop"], 0, "Keep the options familiar to the children attending.", false],
  ["q20", "What would Reyansh choose first on a free weekend?", ["[Parents fill weekend choice]", "Play cricket", "Watch a show", "Go out to eat"], 0, "This is a good final question because everyone can guess.", false]
].map(([id, prompt, options, correctIndex, note, confirmed]) => ({
  id,
  prompt,
  options,
  correctIndex,
  note,
  confirmed
}));

function defaultState() {
  return normalizeState({
    version: 1,
    title: "How Well Do You Know Reyansh?",
    subtitle: "10th Birthday Quiz",
    ownerHash: "",
    updatedAt: new Date().toISOString(),
    questions: defaultQuestions,
    results: [],
    participants: []
  });
}

async function getState() {
  if (hasBlob()) {
    const saved = await readBlobState();
    if (saved) return normalizeState(saved);
    const fresh = defaultState();
    await saveState(fresh);
    return fresh;
  }

  if (hasRedis()) {
    const saved = await redisCommand(["GET", STATE_KEY]);
    if (saved) return normalizeState(JSON.parse(saved));
    const fresh = defaultState();
    await saveState(fresh);
    return fresh;
  }

  if (!memoryState) memoryState = defaultState();
  return normalizeState(memoryState);
}

async function saveState(state) {
  const normalized = normalizeState(state);
  normalized.updatedAt = new Date().toISOString();

  if (hasBlob()) {
    await writeBlobState(normalized);
  } else if (hasRedis()) {
    await redisCommand(["SET", STATE_KEY, JSON.stringify(normalized)]);
  } else {
    memoryState = normalized;
  }

  return normalized;
}

function verifyAdmin(adminId) {
  return Boolean(ADMIN_ID && String(adminId || "").trim().toLowerCase() === ADMIN_ID);
}

function storageInfo() {
  const mode = hasBlob() ? "vercel-blob" : (hasRedis() ? "redis-rest" : "memory-fallback");
  return {
    durable: hasBlob() || hasRedis(),
    mode
  };
}

function normalizeState(input) {
  const fallbackQuestions = defaultQuestions;
  const incomingQuestions = Array.isArray(input?.questions) ? input.questions : fallbackQuestions;
  const questions = incomingQuestions.slice(0, 20).map((question, index) => normalizeQuestion(question, fallbackQuestions[index], index));
  while (questions.length < 20) {
    questions.push(normalizeQuestion(fallbackQuestions[questions.length], fallbackQuestions[questions.length], questions.length));
  }

  return {
    version: 1,
    title: String(input?.title || "How Well Do You Know Reyansh?"),
    subtitle: String(input?.subtitle || "10th Birthday Quiz"),
    ownerHash: String(input?.ownerHash || ""),
    updatedAt: String(input?.updatedAt || new Date().toISOString()),
    questions,
    results: Array.isArray(input?.results) ? input.results.map(normalizeResult).filter(Boolean).slice(-500) : [],
    participants: Array.isArray(input?.participants) ? input.participants.map(normalizeParticipant).filter(Boolean).slice(-500) : []
  };
}

function normalizeQuestion(question, fallback, index) {
  const base = fallback || defaultQuestions[index] || defaultQuestions[0];
  const options = Array.isArray(question?.options) ? question.options.slice(0, 4).map((option) => String(option || "")) : [...base.options];
  while (options.length < 4) options.push("");

  const correctIndex = Number.isInteger(question?.correctIndex)
    ? question.correctIndex
    : Number.parseInt(question?.correctIndex, 10);

  return {
    id: String(question?.id || base.id || `q${index + 1}`),
    prompt: String(question?.prompt || base.prompt || ""),
    options,
    correctIndex: correctIndex >= 0 && correctIndex <= 3 ? correctIndex : base.correctIndex,
    note: String(question?.note || ""),
    confirmed: Boolean(question?.confirmed)
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

function buildResult(state, payload) {
  const selectedAnswers = Array.isArray(payload?.answers) ? payload.answers : [];
  const answers = state.questions.map((question, index) => {
    const selectedIndex = Number(selectedAnswers[index]);
    const safeSelected = selectedIndex >= 0 && selectedIndex <= 3 ? selectedIndex : null;
    return {
      questionId: question.id,
      selectedIndex: safeSelected,
      correctIndex: question.correctIndex,
      selectedText: safeSelected === null ? "" : question.options[safeSelected] || "",
      correctText: question.options[question.correctIndex] || ""
    };
  });

  const score = answers.filter((answer) => answer.selectedIndex === answer.correctIndex).length;
  return normalizeResult({
    id: createId("result"),
    participantId: payload?.participantId || "",
    name: payload?.name || "Player",
    score,
    total: state.questions.length,
    durationSec: payload?.durationSec || 0,
    createdAt: new Date().toISOString(),
    answers
  });
}

function createParticipant(name) {
  return normalizeParticipant({
    id: createId("player"),
    name,
    status: "in-progress",
    startedAt: new Date().toISOString()
  });
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function hasRedis() {
  return Boolean(getRedisUrl() && getRedisToken());
}

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readBlobState() {
  const { BlobNotFoundError, get } = require("@vercel/blob");

  try {
    const result = await get(BLOB_STATE_PATH, { access: "private", useCache: false });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof BlobNotFoundError || error?.name === "BlobNotFoundError") return null;
    throw error;
  }
}

async function writeBlobState(state) {
  const { put } = require("@vercel/blob");
  await put(BLOB_STATE_PATH, JSON.stringify(state), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0
  });
}

function getRedisUrl() {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
}

function getRedisToken() {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
}

async function redisCommand(command) {
  const response = await fetch(getRedisUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRedisToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || `Redis request failed with ${response.status}`);
  }
  return data.result;
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

module.exports = {
  buildResult,
  createParticipant,
  defaultState,
  getState,
  normalizeState,
  readJson,
  saveState,
  sendJson,
  storageInfo,
  verifyAdmin
};
