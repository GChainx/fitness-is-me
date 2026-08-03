// ---------------------------------------------------------------------------
// MUSCLE GROUPS (19, matching RP Strength / common gym taxonomy)
// ---------------------------------------------------------------------------
const MUSCLE_GROUPS = {
  chest:         { label: "Chest",         region: "chest" },
  traps:         { label: "Traps",         region: "back" },
  mid_back:      { label: "Mid Back",      region: "back" },
  lats:          { label: "Lats",          region: "back" },
  lower_back:    { label: "Lower Back",    region: "back" },
  front_delts:   { label: "Front Delts",   region: "shoulders" },
  side_delts:    { label: "Side Delts",    region: "shoulders" },
  rear_delts:    { label: "Rear Delts",    region: "shoulders" },
  biceps:        { label: "Biceps",        region: "arms" },
  triceps:       { label: "Triceps",       region: "arms" },
  forearms:      { label: "Forearms",      region: "arms" },
  quads:         { label: "Quads",         region: "legs" },
  hamstrings:    { label: "Hamstrings",    region: "legs" },
  glutes:        { label: "Glutes",        region: "legs" },
  calves:        { label: "Calves",        region: "legs" },
  hip_abductors: { label: "Hip Abductors", region: "legs" },
  hip_adductors: { label: "Hip Adductors", region: "legs" },
  abs:           { label: "Abs",           region: "core" },
  obliques:      { label: "Obliques",      region: "core" },
};

const MUSCLE_REGIONS = ["chest", "back", "shoulders", "arms", "legs", "core"];
const REGION_LABELS = {
  chest: "Chest", back: "Back", shoulders: "Shoulders",
  arms: "Arms", legs: "Legs", core: "Core",
};

// ---------------------------------------------------------------------------
// EXERCISE -> MUSCLE MAP
// primary: muscles taking the brunt of the load (full weight)
// secondary: assisting muscles (half weight)
// type: "compound" (multi-joint) or "isolation" (single-joint) — used to
// balance suggestions so a session isn't all heavy compounds or all
// isolation "pump" work.
// ---------------------------------------------------------------------------
const EXERCISE_DB = {
  // --- Chest / shoulders (push) ---
  "Flat Barbell Bench Press":     { type: "compound",   primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Flat Dumbbell Bench Press":    { type: "compound",   primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Flat Machine Bench Press":     { type: "compound",   primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Incline Barbell Bench Press":  { type: "compound",   primary: ["chest", "front_delts"], secondary: ["triceps"] },
  "Incline Dumbbell Bench Press": { type: "compound",   primary: ["chest", "front_delts"], secondary: ["triceps"] },
  "Incline Machine Bench Press":  { type: "compound",   primary: ["chest", "front_delts"], secondary: ["triceps"] },
  "Dips":                         { type: "compound",   primary: ["chest", "triceps"], secondary: ["front_delts"] },
  "Push-Up":                      { type: "compound",   primary: ["chest"], secondary: ["front_delts", "triceps", "abs"] },
  "Diamond Push-Up":              { type: "compound",   primary: ["triceps", "chest"], secondary: ["front_delts"] },
  "Cable Fly":                    { type: "isolation",  primary: ["chest"], secondary: [] },
  "Pec Deck":                     { type: "isolation",  primary: ["chest"], secondary: [] },

  "Overhead Press":               { type: "compound",   primary: ["front_delts"], secondary: ["side_delts", "triceps", "traps"] },
  "Dumbbell Shoulder Press":      { type: "compound",   primary: ["front_delts"], secondary: ["side_delts", "triceps"] },
  "Lateral Raise":                { type: "isolation",  primary: ["side_delts"], secondary: [] },
  "Front Raise":                  { type: "isolation",  primary: ["front_delts"], secondary: [] },
  "Face Pull":                    { type: "isolation",  primary: ["rear_delts"], secondary: ["traps", "mid_back"] },
  "Rear Delt Fly":                { type: "isolation",  primary: ["rear_delts"], secondary: ["mid_back"] },

  // --- Back (pull) ---
  "Pull-Up":                      { type: "compound",   primary: ["lats"], secondary: ["biceps", "rear_delts"] },
  "Chin-Up":                      { type: "compound",   primary: ["lats", "biceps"], secondary: ["rear_delts"] },
  "Lat Pulldown - Wide Overhand":   { type: "compound",  primary: ["lats"], secondary: ["rear_delts", "biceps"] },
  "Lat Pulldown - Close Underhand": { type: "compound",  primary: ["lats", "biceps"], secondary: [] },
  "Lat Pulldown - Neutral Grip":    { type: "compound",  primary: ["lats"], secondary: ["biceps", "forearms"] },
  "Barbell Row - Overhand Grip":    { type: "compound",  primary: ["lats", "mid_back"], secondary: ["rear_delts", "forearms"] },
  "Barbell Row - Underhand Grip":   { type: "compound",  primary: ["lats", "biceps"], secondary: ["mid_back", "rear_delts"] },
  "Dumbbell Row":                 { type: "compound",   primary: ["lats", "mid_back"], secondary: ["biceps", "rear_delts"] },
  "Seated Cable Row":             { type: "compound",   primary: ["mid_back", "lats"], secondary: ["biceps"] },
  "Straight-Arm Pulldown":        { type: "isolation",  primary: ["lats"], secondary: [] },
  "Shrug":                        { type: "isolation",  primary: ["traps"], secondary: [] },
  "Conventional Deadlift":        { type: "compound",   primary: ["hamstrings", "glutes", "lower_back"], secondary: ["traps", "forearms"] },
  "Sumo Deadlift":                { type: "compound",   primary: ["glutes", "quads", "hip_adductors"], secondary: ["hamstrings", "lower_back"] },
  "Romanian Deadlift":            { type: "compound",   primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
  "Back Extension":               { type: "isolation",  primary: ["lower_back"], secondary: ["glutes", "hamstrings"] },

  // --- Arms ---
  "Barbell Curl":                 { type: "isolation",  primary: ["biceps"], secondary: ["forearms"] },
  "Dumbbell Curl":                { type: "isolation",  primary: ["biceps"], secondary: ["forearms"] },
  "Hammer Curl":                  { type: "isolation",  primary: ["biceps", "forearms"], secondary: [] },
  "Tricep Pushdown":              { type: "isolation",  primary: ["triceps"], secondary: [] },
  "Skull Crusher":                { type: "isolation",  primary: ["triceps"], secondary: [] },
  "Close-Grip Bench Press":       { type: "compound",   primary: ["triceps"], secondary: ["chest"] },
  "Wrist Curl":                   { type: "isolation",  primary: ["forearms"], secondary: [] },

  // --- Legs ---
  "Back Squat":                   { type: "compound",   primary: ["quads", "glutes"], secondary: ["hip_adductors", "lower_back"] },
  "Front Squat":                  { type: "compound",   primary: ["quads"], secondary: ["glutes", "abs"] },
  "Leg Press":                    { type: "compound",   primary: ["quads", "glutes"], secondary: ["hip_adductors"] },
  "Leg Extension":                { type: "isolation",  primary: ["quads"], secondary: [] },
  "Leg Curl":                     { type: "isolation",  primary: ["hamstrings"], secondary: [] },
  "Walking Lunge":                { type: "compound",   primary: ["quads", "glutes"], secondary: ["hip_adductors"] },
  "Bulgarian Split Squat":        { type: "compound",   primary: ["quads", "glutes"], secondary: ["hip_adductors"] },
  "Hip Thrust":                   { type: "compound",   primary: ["glutes"], secondary: ["hamstrings"] },
  "Calf Raise":                   { type: "isolation",  primary: ["calves"], secondary: [] },
  "Hip Adduction Machine":        { type: "isolation",  primary: ["hip_adductors"], secondary: [] },
  "Hip Abduction Machine":        { type: "isolation",  primary: ["hip_abductors"], secondary: [] },
  "Banded Lateral Walk":          { type: "isolation",  primary: ["hip_abductors"], secondary: ["glutes"] },
  "Cable Kickback":               { type: "isolation",  primary: ["glutes"], secondary: ["hip_abductors"] },

  // --- Core ---
  "Plank":                        { type: "isolation",  primary: ["abs"], secondary: ["obliques"] },
  "Crunch":                       { type: "isolation",  primary: ["abs"], secondary: [] },
  "Hanging Leg Raise":            { type: "compound",   primary: ["abs"], secondary: ["obliques"] },
  "Russian Twist":                { type: "isolation",  primary: ["obliques"], secondary: ["abs"] },
  "Cable Woodchopper":            { type: "isolation",  primary: ["obliques"], secondary: ["abs"] },
};

// Custom exercises the user adds at runtime, merged in alongside EXERCISE_DB.
let CUSTOM_EXERCISES = {};

function getAllExercises() {
  return { ...EXERCISE_DB, ...CUSTOM_EXERCISES };
}

function getMuscleContribution(exerciseName) {
  const ex = getAllExercises()[exerciseName];
  if (!ex) return { primary: [], secondary: [], type: null };
  return ex;
}

// All exercises (primary) targeting a given muscle, split by type — used to
// suggest a balanced compound + isolation pick for under-trained muscles.
function getExercisesForMuscle(muscleId) {
  const all = getAllExercises();
  const compound = [];
  const isolation = [];
  for (const [name, ex] of Object.entries(all)) {
    if (!ex.primary.includes(muscleId)) continue;
    (ex.type === "isolation" ? isolation : compound).push(name);
  }
  return { compound, isolation };
}