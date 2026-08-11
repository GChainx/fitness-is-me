// ---------------------------------------------------------------------------
// Parses a Hevy "Export Workouts" CSV into the same {date, sets:[...]}
// shape this app already stores per session in Firestore. Pure functions —
// no DOM, no Store — so they're easy to test in isolation.
//
// Expected columns (Hevy's own export format): title, start_time, end_time,
// description, exercise_title, superset_id, exercise_notes, set_index,
// set_type, weight_kg or weight_lbs (depends on the exporting account's
// unit setting), reps, distance_miles, duration_seconds, rpe.
// ---------------------------------------------------------------------------

function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Hevy exports weight in whichever unit the account is set to display -
// detect which column is present rather than assuming lbs.
function detectWeightField(row) {
  if ("weight_kg" in row) return { field: "weight_kg", unit: "kg" };
  return { field: "weight_lbs", unit: "lb" };
}

function toKg(weight, unit) {
  return unit === "lb" ? weight * 0.453592 : weight;
}

// Warmup sets are excluded — they aren't "hard sets" in the dose-response
// sense this app's weekly targets are built around. Dropsets/failure sets
// are counted (they're extensions of a working set).
function parseHevyCsv(csvText) {
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const sessionsByDate = {};
  const exerciseNames = new Set();
  let skipped = 0;

  parsed.data.forEach((row) => {
    if (!row.exercise_title || !row.start_time) {
      skipped++;
      return;
    }
    if ((row.set_type || "").toLowerCase() === "warmup") return;

    const d = new Date(row.start_time);
    if (isNaN(d)) {
      skipped++;
      return;
    }
    const date = toLocalDateStr(d);
    const { field, unit } = detectWeightField(row);
    const weight = parseFloat(row[field]) || 0;
    let reps = parseInt(row.reps, 10) || 0;
    if (!reps && row.duration_seconds) reps = parseInt(row.duration_seconds, 10) || 0;
    const exercise = row.exercise_title.trim();

    if (!sessionsByDate[date]) sessionsByDate[date] = { sets: [] };
    sessionsByDate[date].sets.push({ exercise, weight, unit, reps, partialReps: 0 });
    exerciseNames.add(exercise);
  });

  return { sessionsByDate, exerciseNames, skipped };
}