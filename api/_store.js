const ADMIN_ID = (process.env.ADMIN_ID || "adminmohit").trim().toLowerCase();
const STATE_KEY = process.env.QUIZ_STATE_KEY || "reyansh-10th-birthday-state-v1";
const BLOB_STATE_PATH = process.env.QUIZ_BLOB_PATH || "reyansh-birthday-quiz/state.json";

let memoryState;

const defaultQuestions = [
  ["q1", "Which birthday is Reyansh celebrating?", ["10th birthday", "8th birthday", "12th birthday", "6th birthday"], 0, "This quiz is for Reyansh's 10th birthday.", true],
  ["q2", "Which city has Reyansh grown up in?", ["Mumbai", "Delhi", "Jaipur", "Singapore"], 0, "He is a Mumbai kid, and Bombay is the older name for the city.", true],
  ["q3", "Which grade is Reyansh studying in?", ["Grade 5", "Grade 3", "Grade 7", "Grade 1"], 0, "He studies in Grade 5.", true],
  ["q4", "Which curriculum does Reyansh study?", ["CBSE", "IB", "IGCSE", "ICSE"], 0, "His school follows the CBSE curriculum.", true],
  ["q5", "Which school does Reyansh go to?", ["VIBGYOR", "DPS", "Bombay Scottish", "Podar"], 0, "The app keeps this as VIBGYOR; parents can adjust the exact school name if needed.", true],
  ["q6", "Which sport is Reyansh known to like?", ["Cricket", "Golf", "Table tennis", "Swimming"], 0, "Cricket is one of the details already known about him.", true],
  ["q7", "Which maths competition has Reyansh participated in?", ["Maths Olympiad", "Chess Olympiad", "Science Fair", "Art Marathon"], 0, "He has participated in Maths Olympiad.", true],
  ["q8", "Which language competition has Reyansh participated in?", ["Spelling Bee", "Debate League", "Drama Fest", "Poetry Slam"], 0, "He has participated in Spelling Bee.", true],
  ["q9", "Which city is connected to holidays on his mother's side?", ["Jaipur", "Pune", "Kochi", "Lucknow"], 0, "His mother is from Jaipur, so he sometimes goes there for holidays.", true],
  ["q10", "Which of these places has Reyansh visited outside India?", ["Singapore", "London", "Tokyo", "New York"], 0, "He has visited Singapore once.", true],
  ["q11", "Which other place outside India has Reyansh visited?", ["Dubai", "Paris", "Rome", "Sydney"], 0, "He has also visited Dubai.", true],
  ["q12", "Who stays with Reyansh and is also Mayank uncle's mother?", ["His grandmother", "His class teacher", "His cricket coach", "His neighbour"], 0, "His grandmother stays with him.", true],
  ["q13", "What are the names of Reyansh's cousin brothers from his bua's family?", ["Fruity and Adi", "Aarav and Kabir", "Rohan and Vir", "Neil and Dev"], 0, "Fruity and Adi are his cousin brothers from his bua's family.", true],
  ["q14", "What are the names of Reyansh's cousin sisters from Mayank uncle's family?", ["Vani and Vanshika", "Anaya and Myra", "Tara and Kiara", "Riya and Sara"], 0, "Vani and Vanshika are his cousin sisters.", true],
  ["q15", "What is Reyansh's favorite color?", ["[Parents fill favorite color]", "Blue", "Red", "Green"], 0, "Parents can fill the real answer and three believable choices.", false],
  ["q16", "What is Reyansh's favorite TV series or show?", ["[Parents fill favorite show]", "Doraemon", "Pokemon", "Ninja Hattori"], 0, "Use whatever he actually watches most right now.", false],
  ["q17", "Which cricket team does Reyansh support most?", ["[Parents fill favorite team]", "Mumbai Indians", "India", "Chennai Super Kings"], 0, "Parents can choose IPL team, national team, or another answer.", false],
  ["q18", "Who is Reyansh's favorite cricket player?", ["[Parents fill favorite player]", "Virat Kohli", "Rohit Sharma", "MS Dhoni"], 0, "This is a good question for cricket fans at the party.", false],
  ["q19", "What is Reyansh's favorite food or snack?", ["[Parents fill favorite food]", "Pizza", "Pav bhaji", "Pasta"], 0, "Pick a food the kids will recognize as very Reyansh.", false],
  ["q20", "What is Reyansh's favorite way to spend free time?", ["[Parents fill favorite pastime]", "Playing cricket", "Watching shows", "Reading comics"], 0, "Use the activity his parents think is most accurate.", false]
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
  return String(adminId || "").trim().toLowerCase() === ADMIN_ID;
}

function storageInfo() {
  const mode = hasBlob() ? "vercel-blob" : (hasRedis() ? "redis-rest" : "memory-fallback");
  return {
    adminId: ADMIN_ID,
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
