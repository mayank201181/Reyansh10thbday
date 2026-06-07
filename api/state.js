const {
  buildResult,
  createParticipant,
  dateKeyForTimestamp,
  defaultState,
  getState,
  normalizeState,
  readJson,
  saveState,
  sendJson,
  storageInfo,
  verifyAdmin
} = require("./_store");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const state = await getState();
      return sendJson(res, 200, { quiz: state, storage: storageInfo() });
    }

    if (req.method !== "POST") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    const body = await readJson(req);
    let state = await getState();

    if (body.action === "verifyAdmin") {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      return sendJson(res, 200, { quiz: state, storage: storageInfo(), admin: true });
    } else if (body.action === "resetStarter") {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      state = defaultState();
    } else if (body.action === "resetResults") {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      state.results = [];
      state.participants = [];
    } else if (body.action === "resetDate") {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      const targetDate = String(body.dateKey || "");
      state.results = state.results.filter((result) => dateKeyForTimestamp(result.createdAt) !== targetDate);
      state.participants = state.participants.filter((participant) => dateKeyForTimestamp(participant.submittedAt || participant.startedAt) !== targetDate);
    } else if (body.action === "deleteEntry") {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      const entryId = String(body.entryId || "");
      const removedParticipantIds = new Set(
        state.results
          .filter((result) => result.id === entryId || result.participantId === entryId)
          .map((result) => result.participantId)
          .filter(Boolean)
      );
      state.results = state.results.filter((result) => result.id !== entryId && result.participantId !== entryId);
      state.participants = state.participants.filter((participant) => participant.id !== entryId && !removedParticipantIds.has(participant.id));
    } else if (body.action === "start") {
      const participant = createParticipant(body.name || "Player");
      state.participants.push(participant);
      state = await saveState(state);
      return sendJson(res, 200, { participant, quiz: state, storage: storageInfo() });
    } else if (body.action === "submit") {
      const result = buildResult(state, body);
      state.results.push(result);
      const participant = state.participants.find((item) => item.id === result.participantId);
      if (participant) {
        participant.status = "completed";
        participant.submittedAt = result.createdAt;
        participant.score = result.score;
        participant.total = result.total;
      } else {
        state.participants.push({
          id: result.participantId || result.id,
          name: result.name,
          status: "completed",
          startedAt: result.createdAt,
          submittedAt: result.createdAt,
          score: result.score,
          total: result.total
        });
      }
      state = await saveState(state);
      return sendJson(res, 200, { result, quiz: state, storage: storageInfo() });
    } else if (body.quiz) {
      if (!verifyAdmin(body.adminId)) return sendJson(res, 403, { error: "Admin access required" });
      const incoming = normalizeState({ ...state, ...body.quiz, results: state.results, participants: state.participants });
      state = {
        ...state,
        title: incoming.title,
        subtitle: incoming.subtitle,
        ownerHash: incoming.ownerHash,
        questions: incoming.questions
      };
    }

    state = await saveState(state);
    return sendJson(res, 200, { quiz: state, storage: storageInfo() });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Server error" });
  }
};
