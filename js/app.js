const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

let calendarEarliestMonday = null;
let calendarLatestMonday = null;
let calendarScrolledInitially = false;
let unmappedQueue = [];
let pendingModalDone = null;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function mondayOf(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d, n) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function dateStrOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatSetDetail(s) {
  if (isTimedExercise(s.exercise)) {
    const weightPart = s.weight ? `${s.weight}${s.unit} × ` : "";
    return `${weightPart}${s.reps}s hold`;
  }
  return `${s.weight}${s.unit} × ${s.reps}${s.partialReps ? ` +${s.partialReps} partial` : ""}`;
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
  renderCalendarTab();
  renderMusclesTab();
  renderProgressTab();
  renderScansTab();
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
// IMPORT TAB (Hevy CSV)
// ---------------------------------------------------------------------------
$("#import-file").addEventListener("change", () => {
  $("#import-btn").disabled = !$("#import-file").files.length;
});

$("#import-btn").addEventListener("click", async () => {
  const file = $("#import-file").files[0];
  if (!file) return;
  $("#import-btn").disabled = true;
  $("#import-status").innerHTML = `<p class="muted small">Parsing…</p>`;

  try {
    if (typeof Papa === "undefined") {
      throw new Error("CSV parser library didn't load (check your internet connection and reload the page).");
    }

    const text = await file.text();
    const { sessionsByDate, exerciseNames, skipped } = parseHevyCsv(text);
    const dates = Object.keys(sessionsByDate);

    if (dates.length === 0) {
      $("#import-status").innerHTML = `<p class="empty-hint">No usable rows found in that file — make sure it's the "Export Workouts" CSV from Hevy.</p>`;
      $("#import-btn").disabled = false;
      return;
    }

    // Hevy is authoritative for any date present in the file: replace
    // whatever this app has stored for that date outright (not merge),
    // so edits/deletions made in Hevy are reflected on re-import too.
    for (const date of dates) {
      const est = estimatePhaseForDate(date, Store.getPeriodStarts());
      const cyclePhase = est ? est.phase : "";
      const existing = Store.getSessionByDate(date)[0];
      const payload = { date, cyclePhase, sets: sessionsByDate[date].sets, updatedAt: Date.now() };
      if (existing) {
        await Store.updateSession(existing.id, payload);
      } else {
        payload.createdAt = Date.now();
        await Store.addSession(payload);
      }
    }

    $("#import-status").innerHTML = `<p class="empty-hint">Imported ${dates.length} workout day(s) covering ${exerciseNames.size} exercises${skipped ? ` (${skipped} row(s) skipped)` : ""}.</p>`;
    $("#import-file").value = "";

    unmappedQueue = [...exerciseNames].filter((name) => !getAllExercises()[name]);
    processUnmappedQueue();
    refreshEverything();
  } catch (err) {
    console.error("Import failed:", err);
    $("#import-status").innerHTML = `<p class="empty-hint" style="color:var(--danger)">Import failed: ${err.message || err}. Check the browser console (F12) for details, or let me know the error.</p>`;
  } finally {
    $("#import-btn").disabled = false;
  }
});

function processUnmappedQueue() {
  const box = $("#unmapped-queue");
  if (unmappedQueue.length === 0) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  $("#unmapped-current").innerHTML = `<p>${unmappedQueue.length} left to tag.</p>`;
  openNewExerciseModal(unmappedQueue[0], () => {
    unmappedQueue.shift();
    processUnmappedQueue();
  });
}

// ---------------------------------------------------------------------------
// BODY SCANS (Evolt/BIA) — manual entry, see index.html note on why not OCR
// ---------------------------------------------------------------------------
const SCAN_FIELD_IDS = [
  "leanBodyMass", "skeletalMuscleMass", "protein", "mineral", "totalBodyWater",
  "bodyFatMass", "subcutaneousFatMass", "visceralFatMass", "visceralFatArea",
  "totalBodyFatPercent", "visceralFatLevel", "icf", "ecf", "bmr", "tee",
  "bioAge", "bwiScore", "abdominalCircumference", "waistToHipRatio",
  "leftArmLean", "leftArmFat", "rightArmLean", "rightArmFat",
  "torsoLean", "torsoFat", "leftLegLean", "leftLegFat", "rightLegLean", "rightLegFat",
];
const SCAN_TEXT_FIELD_IDS = ["calories", "proteinG", "carbsG", "fatG"];

const BODY_SCAN_METRICS = [
  { key: "leanBodyMass", label: "Lean Body Mass", unit: "kg" },
  { key: "skeletalMuscleMass", label: "Skeletal Muscle Mass", unit: "kg" },
  { key: "bodyFatMass", label: "Body Fat Mass", unit: "kg" },
  { key: "totalBodyFatPercent", label: "Total Body Fat %", unit: "%" },
  { key: "visceralFatLevel", label: "Visceral Fat Level", unit: "" },
  { key: "visceralFatArea", label: "Visceral Fat Area", unit: "cm²" },
  { key: "bmr", label: "BMR", unit: "kCal" },
  { key: "tee", label: "TEE", unit: "kCal" },
  { key: "bioAge", label: "Bio Age", unit: "yrs" },
  { key: "bwiScore", label: "BWI Score", unit: "/10" },
  { key: "abdominalCircumference", label: "Abdominal Circumference", unit: "cm" },
  { key: "waistToHipRatio", label: "Waist-to-Hip Ratio", unit: "" },
  { key: "totalBodyWater", label: "Total Body Water", unit: "kg" },
];

$("#save-scan-btn").addEventListener("click", async () => {
  const date = $("#scan-date").value;
  if (!date) return alert("Pick the scan date first.");

  const scan = { date, createdAt: Date.now() };
  SCAN_FIELD_IDS.forEach((key) => {
    const v = parseFloat($(`#scan-${key}`).value);
    if (!isNaN(v)) scan[key] = v;
  });
  SCAN_TEXT_FIELD_IDS.forEach((key) => {
    const v = $(`#scan-${key}`).value.trim();
    if (v) scan[key] = v;
  });

  await Store.addBodyScan(scan);
  $("#scan-date").value = "";
  [...SCAN_FIELD_IDS, ...SCAN_TEXT_FIELD_IDS].forEach((key) => ($(`#scan-${key}`).value = ""));
  renderScansTab();
});

(function populateScanMetricSelect() {
  $("#scan-metric-select").innerHTML = BODY_SCAN_METRICS.map((m) => `<option value="${m.key}">${m.label}</option>`).join("");
})();
$("#scan-metric-select").addEventListener("change", renderScanChart);

let scanChartInstance = null;
function renderScanChart() {
  const metric = BODY_SCAN_METRICS.find((m) => m.key === $("#scan-metric-select").value);
  const scans = Store.getBodyScans().slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const points = scans.filter((s) => typeof s[metric.key] === "number");

  $("#scan-chart-empty").classList.toggle("hidden", points.length >= 2);
  if (points.length < 2) {
    if (scanChartInstance) scanChartInstance.destroy();
    scanChartInstance = null;
    return;
  }

  const ctx = $("#scan-chart").getContext("2d");
  if (scanChartInstance) scanChartInstance.destroy();
  scanChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: points.map((p) => p.date),
      datasets: [{
        label: `${metric.label} (${metric.unit})`,
        data: points.map((p) => p[metric.key]),
        borderColor: "#2ec4b6",
        backgroundColor: "rgba(46,196,182,0.15)",
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
        y: { ticks: { color: "#a89f95" }, grid: { color: "#3a332c" }, title: { display: true, text: metric.unit, color: "#a89f95" } },
      },
    },
  });
}

function renderScanHistory() {
  const scans = Store.getBodyScans();
  $("#scan-history-list").innerHTML =
    scans.length === 0
      ? `<p class="empty-hint">No scans logged yet.</p>`
      : scans
          .map(
            (s) => `
        <div class="scan-history-row">
          <span>${s.date} — ${s.leanBodyMass ?? "?"}kg lean, ${s.totalBodyFatPercent ?? "?"}% fat</span>
          <button class="icon-btn danger" data-delete-scan="${s.id}" aria-label="Delete scan">✕</button>
        </div>`
          )
          .join("");
  $$("[data-delete-scan]", $("#scan-history-list")).forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this scan?")) return;
      await Store.deleteBodyScan(btn.dataset.deleteScan);
      renderScansTab();
    })
  );
}

function renderScansTab() {
  renderScanChart();
  renderScanHistory();
}
function renderCycleBox() {
  const today = todayStr();
  const isPeriod = Store.isPeriodStart(today);
  $("#period-toggle-btn").textContent = isPeriod ? "🩸 Period start logged today (tap to undo)" : "🩸 Log period start today";
  $("#period-toggle-btn").classList.toggle("active-toggle", isPeriod);

  const est = estimatePhaseForDate(today, Store.getPeriodStarts());
  $("#cycle-phase-indicator").textContent = est
    ? `Estimated phase: ${PHASE_LABELS[est.phase]} (cycle day ${est.cycleDay} of ~${est.cycleLength})`
    : "No period logged yet — log one (any past date, via Calendar) to start estimating cycle phase.";
}

$("#period-toggle-btn").addEventListener("click", async () => {
  await Store.togglePeriodStart(todayStr());
  renderCycleBox();
  renderCalendarTab();
});

// --- new/unmapped exercise modal -------------------------------------------
function openNewExerciseModal(name, onDone) {
  $("#new-ex-name").textContent = name;
  $("#new-ex-modal").classList.remove("hidden");
  $$('input[name="muscle"]', $("#new-ex-modal")).forEach((cb) => (cb.checked = false));
  $("#new-ex-timed").checked = false;
  $("#new-ex-modal").dataset.pendingName = name;
  pendingModalDone = onDone || null;
}
$("#new-ex-cancel").addEventListener("click", () => {
  $("#new-ex-modal").classList.add("hidden");
  if (pendingModalDone) pendingModalDone();
});
$("#new-ex-save").addEventListener("click", async () => {
  const name = $("#new-ex-modal").dataset.pendingName;
  const checked = $$('input[name="muscle"]:checked', $("#new-ex-modal")).map((cb) => cb.value);
  const type = $('input[name="ex-type"]:checked', $("#new-ex-modal")).value;
  const isTimed = $("#new-ex-timed").checked;
  if (checked.length === 0) return alert("Pick at least one muscle.");
  await Store.addCustomExercise(name, checked, [], type, isTimed);
  $("#new-ex-modal").classList.add("hidden");
  if (pendingModalDone) pendingModalDone();
  refreshEverything();
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
  if (!calendarEarliestMonday) {
    const currentMonday = mondayOf(new Date());
    calendarEarliestMonday = addDays(currentMonday, -8 * 7);
    calendarLatestMonday = addDays(currentMonday, 3 * 7);
  }
  renderCalendarWeeks();
}

function renderCalendarWeeks() {
  const sessionDates = new Set(Store.getSessions().map((s) => s.date));
  const periodDates = new Set(Store.getPeriodStarts());
  const todayS = todayStr();

  let html = "";
  let lastMonthLabel = null;
  for (let monday = calendarEarliestMonday; monday <= calendarLatestMonday; monday = addDays(monday, 7)) {
    const monthLabel = monday.toLocaleString(undefined, { month: "long", year: "numeric" });
    if (monthLabel !== lastMonthLabel) {
      html += `<div class="cal-month-divider">${monthLabel}</div>`;
      lastMonthLabel = monthLabel;
    }
    html += `<div class="cal-week-row">`;
    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i);
      const ds = dateStrOf(d);
      const classes = [
        "cal-cell",
        sessionDates.has(ds) ? "has-session" : "",
        ds === todayS ? "is-today" : "",
        periodDates.has(ds) ? "is-period" : "",
      ]
        .filter(Boolean)
        .join(" ");
      html += `<button class="${classes}" data-date="${ds}">${d.getDate()}</button>`;
    }
    html += `</div>`;
  }
  $("#calendar-weeks").innerHTML = html;

  $$(".cal-cell[data-date]", $("#calendar-weeks")).forEach((cell) =>
    cell.addEventListener("click", () => showCalendarDetail(cell.dataset.date))
  );

  if (!calendarScrolledInitially) {
    calendarScrolledInitially = true;
    const todayCell = $(`.cal-cell[data-date="${todayS}"]`, $("#calendar-weeks"));
    if (todayCell) todayCell.scrollIntoView({ block: "center" });
  }
}

$("#cal-load-earlier").addEventListener("click", () => {
  const container = $("#calendar-scroll");
  const prevHeight = container.scrollHeight;
  calendarEarliestMonday = addDays(calendarEarliestMonday, -8 * 7);
  renderCalendarWeeks();
  container.scrollTop += container.scrollHeight - prevHeight;
});

$("#cal-load-later").addEventListener("click", () => {
  calendarLatestMonday = addDays(calendarLatestMonday, 8 * 7);
  renderCalendarWeeks();
});

function showCalendarDetail(dateStr) {
  const sessions = Store.getSessionByDate(dateStr);
  const detail = $("#calendar-detail");
  const isPeriod = Store.isPeriodStart(dateStr);
  const periodBtn = `<button class="btn small" id="toggle-period-here">${isPeriod ? "🩸 Undo period start" : "🩸 Mark period start here"}</button>`;

  if (sessions.length === 0) {
    detail.innerHTML = `<p class="empty-hint">No session on ${dateStr}.</p>
      <div class="detail-actions">
        ${periodBtn}
      </div>`;
    $("#toggle-period-here").addEventListener("click", async () => {
      await Store.togglePeriodStart(dateStr);
      renderCalendarWeeks();
      showCalendarDetail(dateStr);
    });
    return;
  }
  const session = sessions[0];
  const intensity = computeIntensityMap(session.sets);
  const phase = session.cyclePhase || (estimatePhaseForDate(dateStr, Store.getPeriodStarts()) || {}).phase;
  detail.innerHTML = `
    <div class="detail-header">
      <h3>${dateStr}</h3>
      ${phase ? `<span class="phase-badge">${PHASE_LABELS[phase] || phase}</span>` : ""}
    </div>
    <div id="calendar-diagram"></div>
    <div class="set-list-readonly">
      ${session.sets.map((s) => `<div class="set-row-detail">${s.exercise} — ${formatSetDetail(s)}</div>`).join("")}
    </div>
    <div class="detail-actions">
      <button class="btn danger" id="delete-this-day">Delete</button>
      ${periodBtn}
    </div>
  `;
  renderMuscleDiagram($("#calendar-diagram"), intensity);
  $("#delete-this-day").addEventListener("click", async () => {
    if (!confirm("Delete this session? (It'll come back on your next Hevy import unless removed there too.)")) return;
    await Store.deleteSession(session.id);
    refreshEverything();
  });
  $("#toggle-period-here").addEventListener("click", async () => {
    await Store.togglePeriodStart(dateStr);
    renderCalendarWeeks();
    showCalendarDetail(dateStr);
  });
}

// ---------------------------------------------------------------------------
// MUSCLES TAB
// ---------------------------------------------------------------------------
function renderMusclesTab() {
  renderCycleBox();
  const mode = $('input[name="muscle-range"]:checked').value;
  let sets = [];
  if (mode === "today") {
    const s = Store.getSessionByDate(todayStr())[0];
    sets = s ? s.sets : [];
  } else {
    Store.getSessionsThisWeek().forEach((s) => sets.push(...s.sets));
  }
  const intensity = computeIntensityMap(sets, mode === "week" ? "absolute" : "relative");
  renderMuscleDiagram($("#muscles-diagram"), intensity);

  if (mode === "today" && sets.length === 0) {
    $("#muscles-diagram").insertAdjacentHTML("beforeend", `<p class="empty-hint">No session logged today yet.</p>`);
  }

  renderWeeklyVolumeTargets();
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
function toKgWeight(s) {
  return s.unit === "lb" ? (s.weight || 0) * 0.453592 : s.weight || 0;
}

function topSet(sets, exerciseName) {
  const byDuration = exerciseName && isTimedExercise(exerciseName);
  return sets.reduce((best, s) => (!best || (byDuration ? s.reps > best.reps : toKgWeight(s) > toKgWeight(best)) ? s : best), null);
}

function renderProgressTab() {
  renderStrengthChart();
  renderPhaseStrength();
  renderExerciseRecommendations();
}

// --- Strength trend chart -------------------------------------------------
let strengthChartInstance = null;

function estOneRM(set) {
  const effectiveReps = (set.reps || 0) + (set.partialReps || 0) * 0.4;
  const weightKg = set.unit === "lb" ? (set.weight || 0) * 0.453592 : set.weight || 0;
  return weightKg * (1 + effectiveReps / 30); // Epley formula, normalized to kg
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

// --- Strength by cycle phase -----------------------------------------------
const PHASE_ORDER = ["menstrual", "follicular", "ovulation", "luteal"];

function renderPhaseStrength() {
  const periodStarts = Store.getPeriodStarts();
  const sessions = Store.getSessions();
  const byPhase = { menstrual: [], follicular: [], ovulation: [], luteal: [] };

  sessions.forEach((session) => {
    const phase = session.cyclePhase || (estimatePhaseForDate(session.date, periodStarts) || {}).phase;
    if (!phase || !byPhase[phase]) return;

    const topByExercise = {};
    session.sets.forEach((set) => {
      if (isTimedExercise(set.exercise)) return; // holds aren't comparable to load-based e1RM
      const e1rm = estOneRM(set);
      if (!topByExercise[set.exercise] || e1rm > topByExercise[set.exercise]) topByExercise[set.exercise] = e1rm;
    });
    const values = Object.values(topByExercise);
    if (values.length === 0) return;
    byPhase[phase].push(values.reduce((a, b) => a + b, 0) / values.length);
  });

  const phasesWithData = PHASE_ORDER.filter((p) => byPhase[p].length > 0);
  if (phasesWithData.length < 2) {
    $("#phase-strength-list").innerHTML = `<p class="empty-hint">Log period start dates plus a few more sessions across different phases to see this comparison.</p>`;
    return;
  }

  const avgByPhase = {};
  PHASE_ORDER.forEach((p) => {
    avgByPhase[p] = byPhase[p].length ? byPhase[p].reduce((a, b) => a + b, 0) / byPhase[p].length : 0;
  });
  const maxAvg = Math.max(1, ...Object.values(avgByPhase));

  $("#phase-strength-list").innerHTML = `
    <p class="muted small">Average estimated 1RM (across all exercises) by logged/estimated cycle phase at time of session. Excludes timed holds.</p>
    ${PHASE_ORDER.map((p) => {
      const n = byPhase[p].length;
      const pct = n ? Math.round((avgByPhase[p] / maxAvg) * 100) : 0;
      return `
        <div class="phase-bar-row">
          <span class="phase-bar-label">${PHASE_LABELS[p]}</span>
          <div class="phase-bar-track"><div class="phase-bar-fill" style="width:${pct}%"></div></div>
          <span class="phase-bar-value">${n ? Math.round(avgByPhase[p] * 10) / 10 : "—"}${n ? ` (n=${n})` : ""}</span>
        </div>`;
    }).join("")}
  `;
}

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
    const latestTop = topSet(latest.sets.filter((s) => s.exercise === exercise), exercise);
    const prior = history[1];
    const priorTop = prior ? topSet(prior.sets.filter((s) => s.exercise === exercise), exercise) : null;
    const timed = isTimedExercise(exercise);

    let reco;
    if (!priorTop) {
      reco = { text: "First time logged — building a baseline.", tone: "neutral" };
    } else if (timed) {
      if (latestTop.reps > priorTop.reps) {
        reco = { text: `Hold improved (${priorTop.reps}s → ${latestTop.reps}s). Keep pushing duration, or add light weight once you clear ~60-90s.`, tone: "good" };
      } else if (latestTop.reps < priorTop.reps) {
        const phaseNote =
          latest.cyclePhase === "luteal" || latest.cyclePhase === "menstrual"
            ? ` Logged during ${latest.cyclePhase} phase — this may be phase-related rather than a regression.`
            : "";
        reco = { text: `Hold dropped (${priorTop.reps}s → ${latestTop.reps}s).${phaseNote} Repeat this duration next session before pushing further.`, tone: phaseNote ? "phase" : "watch" };
      } else {
        reco = { text: `Steady at ${latestTop.reps}s. Aim to add a few seconds next session.`, tone: "neutral" };
      }
    } else if (toKgWeight(latestTop) > toKgWeight(priorTop)) {
      reco = { text: `Already progressed vs last time (${priorTop.weight}${priorTop.unit} → ${latestTop.weight}${latestTop.unit}). Keep the current jump size if it felt solid.`, tone: "good" };
    } else if (toKgWeight(latestTop) === toKgWeight(priorTop) && latestTop.reps >= priorTop.reps && latestTop.partialReps === 0) {
      reco = { text: `Hit ${latestTop.weight}${latestTop.unit} × ${latestTop.reps} clean. Try +2.5kg/+5lb (or +1 rep) next session.`, tone: "good" };
    } else if (toKgWeight(latestTop) === toKgWeight(priorTop) && latestTop.reps < priorTop.reps) {
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