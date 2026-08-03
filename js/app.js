const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

let draftSets = [];
let draftDate = todayStr();
let draftEditingId = null; // set only when editing an existing session via Calendar
let calendarMonth = new Date();
let calendarSelectedDate = null;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// AUTH / BOOT
// ---------------------------------------------------------------------------
Store.onAuthChange((user) => {
  $("#auth-screen").classList.toggle("hidden", !!user);
  $("#app-shell").classList.toggle("hidden", !user);
  if (user) {
    $("#user-email").textContent = user.email || user.displayName || "";
    refreshEverything();
  }
});

$("#sign-in-btn").addEventListener("click", () => Store.signIn());
$("#sign-out-btn").addEventListener("click", () => Store.signOut());

function refreshEverything() {
  renderLogTab();
  renderCalendarTab();
  renderMusclesTab();
  renderProgressTab();
}

// ---------------------------------------------------------------------------
// TAB NAV
// ---------------------------------------------------------------------------
$$(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => b.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---------------------------------------------------------------------------
// LOG TAB
// ---------------------------------------------------------------------------
function renderLogTab() {
  $("#log-date").value = draftDate;
  populateExerciseOptions();
  renderDraftSetsList();
}

function populateExerciseOptions() {
  const dl = $("#exercise-list");
  dl.innerHTML = Object.keys(getAllExercises())
    .sort()
    .map((name) => `<option value="${name}"></option>`)
    .join("");
}

$("#log-date").addEventListener("change", (e) => {
  draftDate = e.target.value;
  draftSets = [];
  draftEditingId = null;
  $("#cycle-phase").value = "";
  renderLogTab();
});

$("#add-set-btn").addEventListener("click", () => {
  const exercise = $("#exercise-input").value.trim();
  const weight = parseFloat($("#weight-input").value);
  const reps = parseInt($("#reps-input").value, 10);
  const partialReps = parseInt($("#partial-input").value, 10) || 0;
  const unit = $("#unit-select").value;

  if (!exercise) return alert("Enter an exercise name.");
  if (isNaN(weight) || isNaN(reps)) return alert("Enter weight and reps.");

  if (!getAllExercises()[exercise]) {
    if (confirm(`"${exercise}" isn't in the database yet. Add it and tag which muscles it works?`)) {
      openNewExerciseModal(exercise);
      return;
    }
  }

  draftSets.push({ exercise, weight, reps, partialReps, unit });
  $("#weight-input").value = "";
  $("#reps-input").value = "";
  $("#partial-input").value = "";
  renderDraftSetsList();
});

function renderDraftSetsList() {
  const list = $("#draft-sets-list");
  if (draftSets.length === 0) {
    list.innerHTML = `<p class="empty-hint">No sets logged yet for this date.</p>`;
    return;
  }
  list.innerHTML = draftSets
    .map(
      (s, i) => `
      <div class="set-row">
        <div class="set-row-main">
          <strong>${s.exercise}</strong>
          <span class="set-row-detail">${s.weight}${s.unit} × ${s.reps}${s.partialReps ? ` +${s.partialReps} partial` : ""}</span>
        </div>
        <button class="icon-btn danger" data-remove="${i}" aria-label="Remove set">✕</button>
      </div>`
    )
    .join("");
  $$("[data-remove]", list).forEach((btn) =>
    btn.addEventListener("click", () => {
      draftSets.splice(parseInt(btn.dataset.remove, 10), 1);
      renderDraftSetsList();
    })
  );
}

$("#save-session-btn").addEventListener("click", async () => {
  if (draftSets.length === 0) return alert("Add at least one set first.");
  const cyclePhase = $("#cycle-phase").value;

  if (draftEditingId) {
    // Explicit edit (came from Calendar -> Edit): replace the session's sets outright.
    await Store.updateSession(draftEditingId, { date: draftDate, cyclePhase, sets: draftSets, updatedAt: Date.now() });
  } else {
    const existing = Store.getSessionByDate(draftDate)[0];
    if (existing) {
      // Already logged something today - append rather than clobber earlier sets.
      await Store.updateSession(existing.id, {
        cyclePhase: cyclePhase || existing.cyclePhase,
        sets: [...existing.sets, ...draftSets],
        updatedAt: Date.now(),
      });
    } else {
      await Store.addSession({ date: draftDate, cyclePhase, sets: draftSets, createdAt: Date.now(), updatedAt: Date.now() });
    }
  }

  // Reset the form for the next entry.
  draftSets = [];
  draftEditingId = null;
  draftDate = todayStr();
  $("#cycle-phase").value = "";
  refreshEverything();
});

// --- new exercise modal ---
function openNewExerciseModal(name) {
  $("#new-ex-name").textContent = name;
  $("#new-ex-modal").classList.remove("hidden");
  $$('input[name="muscle"]', $("#new-ex-modal")).forEach((cb) => (cb.checked = false));
  $("#new-ex-modal").dataset.pendingName = name;
}
$("#new-ex-cancel").addEventListener("click", () => $("#new-ex-modal").classList.add("hidden"));
$("#new-ex-save").addEventListener("click", async () => {
  const name = $("#new-ex-modal").dataset.pendingName;
  const checked = $$('input[name="muscle"]:checked', $("#new-ex-modal")).map((cb) => cb.value);
  const type = $('input[name="ex-type"]:checked', $("#new-ex-modal")).value;
  if (checked.length === 0) return alert("Pick at least one muscle.");
  await Store.addCustomExercise(name, checked, [], type);
  $("#new-ex-modal").classList.add("hidden");
  $("#exercise-input").value = name;
  populateExerciseOptions();
});

// ---------------------------------------------------------------------------
// MUSCLE GROUP CHECKBOXES (built once for the "new exercise" modal)
// ---------------------------------------------------------------------------
(function buildMuscleCheckboxes() {
  const wrap = $("#muscle-checkboxes");
  wrap.innerHTML = Object.entries(MUSCLE_GROUPS)
    .map(([id, m]) => `<label class="checkbox-chip"><input type="checkbox" name="muscle" value="${id}"> ${m.label}</label>`)
    .join("");
})();

// ---------------------------------------------------------------------------
// CALENDAR TAB
// ---------------------------------------------------------------------------
function renderCalendarTab() {
  const y = calendarMonth.getFullYear();
  const m = calendarMonth.getMonth();
  $("#calendar-month-label").textContent = calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" });

  const firstDay = new Date(y, m, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const sessionDates = new Set(Store.getSessions().map((s) => s.date));

  let cells = "";
  for (let i = 0; i < startOffset; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const hasSession = sessionDates.has(dateStr);
    const isToday = dateStr === todayStr();
    cells += `<button class="cal-cell ${hasSession ? "has-session" : ""} ${isToday ? "is-today" : ""}" data-date="${dateStr}">${d}</button>`;
  }
  $("#calendar-grid").innerHTML = cells;

  $$(".cal-cell[data-date]", $("#calendar-grid")).forEach((cell) =>
    cell.addEventListener("click", () => showCalendarDetail(cell.dataset.date))
  );
}

$("#cal-prev").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderCalendarTab();
});
$("#cal-next").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderCalendarTab();
});

function showCalendarDetail(dateStr) {
  calendarSelectedDate = dateStr;
  const sessions = Store.getSessionByDate(dateStr);
  const detail = $("#calendar-detail");
  if (sessions.length === 0) {
    detail.innerHTML = `<p class="empty-hint">No session on ${dateStr}.</p><button class="btn" id="log-this-day">Log a session here</button>`;
    $("#log-this-day").addEventListener("click", () => {
      draftDate = dateStr;
      draftSets = [];
      draftEditingId = null;
      renderLogTab();
      $('.tab-btn[data-tab="log"]').click();
    });
    return;
  }
  const session = sessions[0];
  const intensity = computeIntensityMap(session.sets);
  detail.innerHTML = `
    <div class="detail-header">
      <h3>${dateStr}</h3>
      ${session.cyclePhase ? `<span class="phase-badge">${session.cyclePhase}</span>` : ""}
    </div>
    <div id="calendar-diagram"></div>
    <div class="set-list-readonly">
      ${session.sets.map((s) => `<div class="set-row-detail">${s.exercise} — ${s.weight}${s.unit} × ${s.reps}${s.partialReps ? ` +${s.partialReps}p` : ""}</div>`).join("")}
    </div>
    <div class="detail-actions">
      <button class="btn" id="edit-this-day">Edit</button>
      <button class="btn danger" id="delete-this-day">Delete</button>
    </div>
  `;
  renderMuscleDiagram($("#calendar-diagram"), intensity);
  $("#edit-this-day").addEventListener("click", () => {
    draftDate = dateStr;
    draftSets = session.sets.map((s) => ({ ...s }));
    draftEditingId = session.id;
    renderLogTab();
    $("#cycle-phase").value = session.cyclePhase || "";
    $('.tab-btn[data-tab="log"]').click();
  });
  $("#delete-this-day").addEventListener("click", async () => {
    if (!confirm("Delete this session?")) return;
    await Store.deleteSession(session.id);
    refreshEverything();
  });
}

// ---------------------------------------------------------------------------
// MUSCLES TAB
// ---------------------------------------------------------------------------
function renderMusclesTab() {
  const mode = $('input[name="muscle-range"]:checked').value;
  let sets = [];
  if (mode === "today") {
    const s = Store.getSessionByDate(todayStr())[0];
    sets = s ? s.sets : [];
  } else {
    Store.getSessionsThisWeek().forEach((s) => sets.push(...s.sets));
  }
  const intensity = computeIntensityMap(sets);
  renderMuscleDiagram($("#muscles-diagram"), intensity);

  if (mode === "today" && sets.length === 0) {
    $("#muscles-diagram").insertAdjacentHTML("beforeend", `<p class="empty-hint">No session logged today yet.</p>`);
  }

  renderWeeklyVolumeTargets();
}

function computeIntensityMapForWeek() {
  const sets = [];
  Store.getSessionsThisWeek().forEach((s) => sets.push(...s.sets));
  return computeIntensityMap(sets);
}

const SET_STATUS_LABEL = {
  none: "Not trained this week",
  low: "Below effective range",
  building: "Building toward target",
  optimal: "In the research-backed sweet spot",
  high: "Very high — watch recovery",
};

function renderWeeklyVolumeTargets() {
  const sets = [];
  Store.getSessionsThisWeek().forEach((s) => sets.push(...s.sets));
  const counts = computeWeeklySetCounts(sets);

  const sections = MUSCLE_REGIONS.map((region) => {
    const muscleIds = Object.keys(MUSCLE_GROUPS).filter((id) => MUSCLE_GROUPS[id].region === region);
    const rows = muscleIds
      .sort((a, b) => counts[a] - counts[b])
      .map((id) => {
        const count = counts[id];
        const status = classifySetCount(count);
        const rounded = Math.round(count * 2) / 2;
        let suggestion = "";
        if (status === "none" || status === "low" || status === "building") {
          const { compound, isolation } = getExercisesForMuscle(id);
          const picks = [compound[0], isolation[0]].filter(Boolean);
          if (picks.length) suggestion = `<div class="volume-suggestion">Try: ${picks.join(" + ")}</div>`;
        }
        return `
          <div class="volume-row status-${status}">
            <span class="volume-label">${MUSCLE_GROUPS[id].label}</span>
            <span class="volume-count">${rounded} sets</span>
            <span class="volume-status">${SET_STATUS_LABEL[status]}</span>
            ${suggestion}
          </div>`;
      })
      .join("");
    return `<div class="region-block"><h4 class="region-header">${REGION_LABELS[region]}</h4>${rows}</div>`;
  }).join("");

  $("#untouched-list").innerHTML = `
    <p class="muted small">Research-backed target: ~10–20 hard sets per muscle per week
      (Schoenfeld et al., 2017). Secondary/assisting muscles count as half a set.
      Suggestions mix one compound + one isolation move to help manage energy across a session.</p>
    ${sections}
  `;
}

$$('input[name="muscle-range"]').forEach((r) => r.addEventListener("change", renderMusclesTab));

// ---------------------------------------------------------------------------
// PROGRESS TAB — recommendations
// ---------------------------------------------------------------------------
function topSet(sets) {
  return sets.reduce((best, s) => (!best || s.weight > best.weight ? s : best), null);
}

function renderProgressTab() {
  renderStrengthChart();
  renderExerciseRecommendations();
}

// --- Strength trend chart -------------------------------------------------
let strengthChartInstance = null;

function estOneRM(set) {
  const effectiveReps = (set.reps || 0) + (set.partialReps || 0) * 0.4;
  return (set.weight || 0) * (1 + effectiveReps / 30); // Epley formula
}

function computeStrengthTrend(region) {
  const sessions = Store.getSessions().slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const regionMuscles = region === "overall" ? null : Object.keys(MUSCLE_GROUPS).filter((id) => MUSCLE_GROUPS[id].region === region);

  const labels = [];
  const data = [];
  sessions.forEach((session) => {
    const relevantSets = session.sets.filter((set) => {
      if (!regionMuscles) return true;
      const { primary } = getMuscleContribution(set.exercise);
      return primary.some((m) => regionMuscles.includes(m));
    });
    if (relevantSets.length === 0) return;

    const topByExercise = {};
    relevantSets.forEach((set) => {
      const e1rm = estOneRM(set);
      if (!topByExercise[set.exercise] || e1rm > topByExercise[set.exercise]) topByExercise[set.exercise] = e1rm;
    });
    const values = Object.values(topByExercise);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    labels.push(session.date);
    data.push(Math.round(avg * 10) / 10);
  });
  return { labels, data };
}

function renderStrengthChart() {
  const region = $('input[name="strength-region"]:checked').value;
  const { labels, data } = computeStrengthTrend(region);

  $("#strength-chart-empty").classList.toggle("hidden", labels.length > 0);
  if (labels.length === 0) {
    if (strengthChartInstance) strengthChartInstance.destroy();
    strengthChartInstance = null;
    return;
  }

  const ctx = $("#strength-chart").getContext("2d");
  if (strengthChartInstance) strengthChartInstance.destroy();
  strengthChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Est. 1RM (avg of top sets)",
        data,
        borderColor: "#ff5a1f",
        backgroundColor: "rgba(255,90,31,0.15)",
        tension: 0.25,
        fill: true,
        pointRadius: 3,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#a89f95" }, grid: { color: "#3a332c" } },
        y: { ticks: { color: "#a89f95" }, grid: { color: "#3a332c" }, title: { display: true, text: "kg (est.)", color: "#a89f95" } },
      },
    },
  });
}

$$('input[name="strength-region"]').forEach((r) => r.addEventListener("change", renderStrengthChart));

// --- Per-exercise progression recommendations -----------------------------
function renderExerciseRecommendations() {
  const sessions = Store.getSessions();
  const exercisesSeen = new Set();
  sessions.forEach((s) => s.sets.forEach((set) => exercisesSeen.add(set.exercise)));

  const recos = [];
  exercisesSeen.forEach((exercise) => {
    const history = sessions
      .filter((s) => s.sets.some((set) => set.exercise === exercise))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    if (history.length === 0) return;
    const latest = history[0];
    const latestTop = topSet(latest.sets.filter((s) => s.exercise === exercise));
    const prior = history[1];
    const priorTop = prior ? topSet(prior.sets.filter((s) => s.exercise === exercise)) : null;

    let reco;
    if (!priorTop) {
      reco = { text: "First time logged — building a baseline.", tone: "neutral" };
    } else if (latestTop.weight > priorTop.weight) {
      reco = { text: `Already progressed vs last time (${priorTop.weight}${priorTop.unit} → ${latestTop.weight}${latestTop.unit}). Keep the current jump size if it felt solid.`, tone: "good" };
    } else if (latestTop.weight === priorTop.weight && latestTop.reps >= priorTop.reps && latestTop.partialReps === 0) {
      reco = { text: `Hit ${latestTop.weight}${latestTop.unit} × ${latestTop.reps} clean. Try +2.5kg/+5lb (or +1 rep) next session.`, tone: "good" };
    } else if (latestTop.weight === priorTop.weight && latestTop.reps < priorTop.reps) {
      const phaseNote =
        latest.cyclePhase === "luteal" || latest.cyclePhase === "menstrual"
          ? ` Logged during ${latest.cyclePhase} phase — strength dips here are common and not necessarily a regression. Consider holding weight steady rather than dropping it.`
          : "";
      reco = { text: `Reps dropped at the same weight (${priorTop.reps} → ${latestTop.reps}).${phaseNote} Repeat this weight next session before pushing further.`, tone: phaseNote ? "phase" : "watch" };
    } else {
      reco = { text: `Steady at ${latestTop.weight}${latestTop.unit}. Aim to add a rep next session.`, tone: "neutral" };
    }
    recos.push({ exercise, latestDate: latest.date, ...reco });
  });

  recos.sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));

  $("#progress-list").innerHTML =
    recos.length === 0
      ? `<p class="empty-hint">Log a few sessions to start seeing progression recommendations.</p>`
      : recos
          .map(
            (r) => `
        <div class="reco-card tone-${r.tone}">
          <div class="reco-header">
            <strong>${r.exercise}</strong>
            <span class="muted">${r.latestDate}</span>
          </div>
          <p>${r.text}</p>
        </div>`
          )
          .join("");
}