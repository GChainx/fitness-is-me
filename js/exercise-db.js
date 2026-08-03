// ---------------------------------------------------------------------------
// MUSCLE GROUPS
// Each has a body side (front/back) so the diagram knows which silhouette
// to draw it on.
// ---------------------------------------------------------------------------
const MUSCLE_GROUPS = {
  front_delts:  { label: "Front Delts",  side: "front" },
  chest:        { label: "Chest",        side: "front" },
  biceps:       { label: "Biceps",       side: "front" },
  forearms:     { label: "Forearms",     side: "front" },
  abs:          { label: "Abs",          side: "front" },
  obliques:     { label: "Obliques",     side: "front" },
  quads:        { label: "Quads",        side: "front" },
  adductors:    { label: "Adductors",    side: "front" },

  traps:        { label: "Traps",        side: "back" },
  rear_delts:   { label: "Rear Delts",   side: "back" },
  lats:         { label: "Lats",         side: "back" },
  upper_back:   { label: "Upper Back",   side: "back" },
  lower_back:   { label: "Lower Back",   side: "back" },
  triceps:      { label: "Triceps",      side: "back" },
  glutes:       { label: "Glutes",       side: "back" },
  hamstrings:   { label: "Hamstrings",   side: "back" },
  calves:       { label: "Calves",       side: "back" },
};

// ---------------------------------------------------------------------------
// EXERCISE -> MUSCLE MAP
// primary: muscles that take the brunt of the load (full intensity weight)
// secondary: assisting muscles (partial intensity weight)
// This is a starting seed list. Users can add their own via the UI, which
// get saved to Firestore under exercises/{uid}/custom and merged in at
// load time. Later this can be swapped for a web-lookup.
// ---------------------------------------------------------------------------
const EXERCISE_DB = {
  "Barbell Bench Press":      { primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Incline Bench Press":      { primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Dumbbell Bench Press":     { primary: ["chest"], secondary: ["front_delts", "triceps"] },
  "Dips":                     { primary: ["chest", "triceps"], secondary: ["front_delts"] },
  "Push-Up":                  { primary: ["chest"], secondary: ["front_delts", "triceps", "abs"] },
  "Overhead Press":           { primary: ["front_delts"], secondary: ["triceps", "traps"] },
  "Dumbbell Shoulder Press":  { primary: ["front_delts"], secondary: ["triceps"] },
  "Lateral Raise":            { primary: ["front_delts"], secondary: [] },
  "Front Raise":              { primary: ["front_delts"], secondary: [] },
  "Face Pull":                { primary: ["rear_delts"], secondary: ["traps", "upper_back"] },
  "Rear Delt Fly":            { primary: ["rear_delts"], secondary: ["upper_back"] },

  "Pull-Up":                  { primary: ["lats"], secondary: ["biceps", "rear_delts"] },
  "Chin-Up":                  { primary: ["lats", "biceps"], secondary: ["rear_delts"] },
  "Lat Pulldown":             { primary: ["lats"], secondary: ["biceps"] },
  "Barbell Row":              { primary: ["lats", "upper_back"], secondary: ["biceps", "rear_delts"] },
  "Dumbbell Row":             { primary: ["lats", "upper_back"], secondary: ["biceps", "rear_delts"] },
  "Seated Cable Row":         { primary: ["upper_back", "lats"], secondary: ["biceps"] },
  "Shrug":                    { primary: ["traps"], secondary: [] },
  "Deadlift":                 { primary: ["hamstrings", "glutes", "lower_back"], secondary: ["traps", "forearms"] },
  "Romanian Deadlift":        { primary: ["hamstrings", "glutes"], secondary: ["lower_back"] },
  "Back Extension":           { primary: ["lower_back"], secondary: ["glutes", "hamstrings"] },

  "Barbell Curl":             { primary: ["biceps"], secondary: ["forearms"] },
  "Dumbbell Curl":            { primary: ["biceps"], secondary: ["forearms"] },
  "Hammer Curl":              { primary: ["biceps", "forearms"], secondary: [] },
  "Tricep Pushdown":          { primary: ["triceps"], secondary: [] },
  "Skull Crusher":            { primary: ["triceps"], secondary: [] },
  "Close-Grip Bench Press":   { primary: ["triceps"], secondary: ["chest"] },
  "Wrist Curl":               { primary: ["forearms"], secondary: [] },

  "Back Squat":                { primary: ["quads", "glutes"], secondary: ["adductors", "lower_back"] },
  "Front Squat":               { primary: ["quads"], secondary: ["glutes", "abs"] },
  "Leg Press":                 { primary: ["quads", "glutes"], secondary: ["adductors"] },
  "Leg Extension":             { primary: ["quads"], secondary: [] },
  "Leg Curl":                  { primary: ["hamstrings"], secondary: [] },
  "Walking Lunge":             { primary: ["quads", "glutes"], secondary: ["adductors"] },
  "Bulgarian Split Squat":     { primary: ["quads", "glutes"], secondary: ["adductors"] },
  "Hip Thrust":                { primary: ["glutes"], secondary: ["hamstrings"] },
  "Calf Raise":                { primary: ["calves"], secondary: [] },
  "Hip Adductor Machine":      { primary: ["adductors"], secondary: [] },

  "Plank":                     { primary: ["abs"], secondary: ["obliques"] },
  "Crunch":                    { primary: ["abs"], secondary: [] },
  "Hanging Leg Raise":         { primary: ["abs"], secondary: ["obliques"] },
  "Russian Twist":             { primary: ["obliques"], secondary: ["abs"] },
  "Cable Woodchopper":         { primary: ["obliques"], secondary: ["abs"] },
};

// Full list of custom exercises the user has added, loaded at runtime and
// merged with EXERCISE_DB. Kept separate so we never overwrite the seed list.
let CUSTOM_EXERCISES = {};

function getAllExercises() {
  return { ...EXERCISE_DB, ...CUSTOM_EXERCISES };
}

function getMuscleContribution(exerciseName) {
  const ex = getAllExercises()[exerciseName];
  if (!ex) return { primary: [], secondary: [] };
  return ex;
}
