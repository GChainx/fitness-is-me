// ---------------------------------------------------------------------------
// Auto-generated from a community-maintained scrape of Hevy's built-in
// exercise library (413 exercises), mapped onto this app's 19-muscle
// taxonomy. Source: github.com/ShehrozAttique/Hevy-Exercises-Data-Scraper
// (data reflects Hevy's public exercise library, not proprietary to that repo).
//
// Shoulders subdivision (Hevy doesn't split front/side/rear delts): inferred
// from exercise name — lateral/side raise + upright row -> side_delts; rear
// delt/reverse fly/face pull -> rear_delts; everything else defaults to
// front_delts. Compound/isolation is a heuristic (has secondary muscles
// listed -> compound). Cardio/Full Body/Neck/Other-tagged exercises are
// intentionally excluded — they do not map cleanly onto a resistance-training
// muscle diagram, so they will still prompt the manual tagging modal.
//
// getAllExercises() in exercise-db.js merges this in as the base layer,
// overridden by EXERCISE_DB and then CUSTOM_EXERCISES on name collision.
// ---------------------------------------------------------------------------
const HEVY_EXERCISE_MAP = {
  "21s Bicep Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Ab Scissors": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Ab Wheel": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Arnold Press (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Around The World": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "mid_back",
      "front_delts"
    ],
    "type": "compound"
  },
  "Assisted Pistol Squats": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Back Extension (Hyperextension)": {
    "primary": [
      "lower_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Back Extension (Machine)": {
    "primary": [
      "lower_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Back Extension (Weighted Hyperextension)": {
    "primary": [
      "lower_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Band Pullaparts": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Behind the Back Bicep Wrist Curl (Barbell)": {
    "primary": [
      "forearms"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bench Dip": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bench Press (Barbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Bench Press (Cable)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Bench Press (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Bench Press (Smith Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Bench Press - Close Grip (Barbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bench Press - Wide Grip (Barbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Bent Over Row (Band)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bent Over Row (Barbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bent Over Row (Dumbbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicep Curl (Barbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicep Curl (Cable)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicep Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicep Curl (Machine)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicep Curl (Suspension)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicycle Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bicycle Crunch Raised Legs": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Bird Dog": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Box Jump": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes",
      "calves"
    ],
    "type": "compound"
  },
  "Box Squat (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Bulgarian Split Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "glutes",
      "hamstrings"
    ],
    "type": "compound"
  },
  "Butterfly (Pec Deck)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Core Palloff Press": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Fly Crossovers": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Pull Through": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Twist (Down to up)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cable Twist (Up to down)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Calf Extension (Machine)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Calf Press (Machine)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Dip": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Chest Dip (Assisted)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Dip (Weighted)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Chest Fly (Band)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Fly (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Fly (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Fly (Suspension)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Press (Band)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Press (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Supported Incline Row (Dumbbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chest Supported Reverse Fly (Dumbbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "rear_delts"
    ],
    "type": "compound"
  },
  "Chest Supported Y Raise (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Chin Up": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back",
      "biceps"
    ],
    "type": "compound"
  },
  "Chin Up (Assisted)": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back",
      "biceps"
    ],
    "type": "compound"
  },
  "Chin Up (Weighted)": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back",
      "biceps"
    ],
    "type": "compound"
  },
  "Clamshell": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Clap Push Ups": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Concentration Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Cross Body Hammer Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Crunch (Machine)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Crunch (Weighted)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Curtsy Lunge (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Dead Bug": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dead Hang": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Deadlift (Band)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Deadlift (Barbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Deadlift (Dumbbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Deadlift (Smith Machine)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Deadlift (Trap bar)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Decline Bench Press (Barbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Decline Bench Press (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Decline Bench Press (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Decline Bench Press (Smith Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Decline Chest Fly (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Decline Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Decline Crunch (Weighted)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Decline Push Up": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "front_delts",
      "triceps"
    ],
    "type": "compound"
  },
  "Diamond Push Up": {
    "primary": [
      "triceps"
    ],
    "secondary": [
      "chest"
    ],
    "type": "compound"
  },
  "Drag Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dragon Flag": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dragonfly": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dumbbell Row": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dumbbell Squeeze Press": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Dumbbell Step Up": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Elbow to Knee": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "EZ Bar Biceps Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Face Pull": {
    "primary": [
      "rear_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Fire Hydrants": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Floor Press (Barbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Floor Press (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Floor Triceps Dip": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Flutter Kicks": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Frog Pumps (Dumbbell)": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Lever Hold": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Lever Raise": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Raise (Band)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Raise (Barbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Raise (Cable)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Raise (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Raise (Suspension)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Front Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Full Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Glute Bridge": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Glute Ham Raise": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Glute Kickback (Machine)": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Glute Kickback on Floor": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Goblet Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Good Morning (Barbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Gorilla Row (Kettlebell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hack Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Hack Squat (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hammer Curl (Band)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hammer Curl (Cable)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hammer Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Handstand Push Up": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hanging Knee Raise": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hanging Leg Raise": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Heel Taps": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hex Press (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "High Knee Skips": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "High Knees": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hip Abduction (Machine)": {
    "primary": [
      "hip_abductors"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hip Adduction (Machine)": {
    "primary": [
      "hip_adductors"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hip Thrust": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hip Thrust (Barbell)": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hip Thrust (Machine)": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Hollow Rock": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Incline Bench Press (Barbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Incline Bench Press (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Incline Bench Press (Smith Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Incline Chest Fly (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Incline Chest Press (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Incline Push Ups": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Inverted Row": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Iso-Lateral Chest Press (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Iso-Lateral High Row (Machine)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Iso-Lateral Low Row": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Iso-Lateral Row (Machine)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Jack Knife (Suspension)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Jackknife Sit Up": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "JM Press (Barbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Jump Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Jumping Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Kettlebell Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Kettlebell Goblet Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Kipping Pull Up": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Knee Raise Parallel Bars": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Kneeling Pulldown (band)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Kneeling Push Up": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "L-Sit Hold": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Landmine 180": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Landmine Row": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "lats"
    ],
    "type": "compound"
  },
  "Lat Pulldown (Band)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lat Pulldown (Cable)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lat Pulldown (Machine)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lat Pulldown - Close Grip (Cable)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Band Walks": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Box Jump": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Leg Raises": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Lateral Raise (Band)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Raise (Cable)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Raise (Dumbbell)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Raise (Machine)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lateral Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Leg Extension (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Leg Press (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Leg Press Horizontal (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Leg Raise Parallel Bars": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Low Cable Fly Crossovers": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Low Row (Suspension)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Lunge (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Lunge (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Lying Knee Raise": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lying Leg Curl (Machine)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Lying Leg Raise": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Meadows Rows (Barbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Negative Pull Up": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Nordic Hamstrings Curls": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Oblique Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Overhead Curl (Cable)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Overhead Dumbbell Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Overhead Press (Barbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Overhead Press (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Overhead Press (Smith Machine)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Pause Squat (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Pendlay Row (Barbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Pendulum Squat (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "glutes",
      "calves"
    ],
    "type": "compound"
  },
  "Pike Pushup": {
    "primary": [
      "triceps"
    ],
    "secondary": [
      "front_delts"
    ],
    "type": "compound"
  },
  "Pinwheel Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Pistol Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes",
      "calves"
    ],
    "type": "compound"
  },
  "Plank": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Plank Pushup": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "abs"
    ],
    "type": "compound"
  },
  "Plate Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Plate Front Raise": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Plate Press": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Plate Squeeze (Svend Press)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Preacher Curl (Barbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Preacher Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Preacher Curl (Machine)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Pull Up": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Pull Up (Assisted)": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Pull Up (Band)": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Pull Up (Weighted)": {
    "primary": [
      "lats"
    ],
    "secondary": [
      "mid_back"
    ],
    "type": "compound"
  },
  "Pullover (Dumbbell)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Pullover (Machine)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "lats"
    ],
    "type": "compound"
  },
  "Push Press": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Push Up": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Push Up (Weighted)": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Push Up - Close Grip": {
    "primary": [
      "chest"
    ],
    "secondary": [
      "triceps",
      "front_delts"
    ],
    "type": "compound"
  },
  "Rack Pull": {
    "primary": [
      "lower_back"
    ],
    "secondary": [
      "glutes",
      "quads",
      "hamstrings"
    ],
    "type": "compound"
  },
  "Rear Delt Reverse Fly (Cable)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "rear_delts"
    ],
    "type": "compound"
  },
  "Rear Delt Reverse Fly (Dumbbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "rear_delts"
    ],
    "type": "compound"
  },
  "Rear Delt Reverse Fly (Machine)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "rear_delts"
    ],
    "type": "compound"
  },
  "Renegade Row (Dumbbell)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Reverse Crunch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Reverse Curl (Barbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [
      "forearms"
    ],
    "type": "compound"
  },
  "Reverse Curl (Cable)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Reverse Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [
      "forearms"
    ],
    "type": "compound"
  },
  "Reverse Fly Single Arm (Cable)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [
      "rear_delts"
    ],
    "type": "compound"
  },
  "Reverse Grip Concentration Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Reverse Grip Lat Pulldown (Cable)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Reverse Hyperextension": {
    "primary": [
      "glutes"
    ],
    "secondary": [
      "hamstrings"
    ],
    "type": "compound"
  },
  "Reverse Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Reverse Lunge (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Reverse Lunge (Dumbbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Reverse Plank": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Ring Dips": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Romanian Deadlift (Barbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Romanian Deadlift (Dumbbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Rope Cable Curl": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Rope Straight Arm Pulldown": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Russian Twist (Bodyweight)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Russian Twist (Weighted)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Scapular Pull Ups": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Cable Row - Bar Grip": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Cable Row - Bar Wide Grip": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Cable Row - V Grip (Cable)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Calf Raise": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Chest Flys (Cable)": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Dip Machine": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Incline Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Lateral Raise (Dumbbell)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Leg Curl (Machine)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Overhead Press (Barbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Seated Overhead Press (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Seated Palms Up Wrist Curl": {
    "primary": [
      "forearms"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Row (Machine)": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Shoulder Press (Machine)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "triceps"
    ],
    "type": "compound"
  },
  "Seated Triceps Press": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Seated Wrist Extension (Barbell)": {
    "primary": [
      "forearms"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shoulder Press (Dumbbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shoulder Press (Machine Plates)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shoulder Taps": {
    "primary": [
      "front_delts"
    ],
    "secondary": [
      "abs"
    ],
    "type": "compound"
  },
  "Shrug (Barbell)": {
    "primary": [
      "traps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shrug (Cable)": {
    "primary": [
      "traps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shrug (Dumbbell)": {
    "primary": [
      "traps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shrug (Machine)": {
    "primary": [
      "traps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Shrug (Smith Machine)": {
    "primary": [
      "traps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Side Bend": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Side Bend (Dumbbell)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Side Plank": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Cable Crossover": {
    "primary": [
      "chest"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Cable Row": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Curl (Cable)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Landmine Press (Barbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Lat Pulldown": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Lateral Raise (Cable)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Tricep Extension (Dumbbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Arm Triceps Pushdown (Cable)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Extensions": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Glute Bridge": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Hip Thrust": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Hip Thrust (Dumbbell)": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Press (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Romanian Deadlift (Barbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Single Leg Romanian Deadlift (Dumbbell)": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Single Leg Standing Calf Raise": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Standing Calf Raise (Barbell)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Standing Calf Raise (Dumbbell)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Single Leg Standing Calf Raise (Machine)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sissy Squat (Weighted)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sit Up": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sit Up (Weighted)": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Skullcrusher (Barbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Skullcrusher (Dumbbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Spider Curl (Barbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Spider Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Spiderman": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Split Squat (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Squat (Band)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Bodyweight)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Smith Machine)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Squat (Suspension)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Cable Glute Kickbacks": {
    "primary": [
      "glutes"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Calf Raise": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Calf Raise (Barbell)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Calf Raise (Dumbbell)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Calf Raise (Machine)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Calf Raise (Smith)": {
    "primary": [
      "calves"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Leg Curls": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Standing Military Press (Barbell)": {
    "primary": [
      "front_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Step Up": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sternum Pull up (Gironda)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Straight Arm Lat Pulldown (Cable)": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Straight Leg Deadlift": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "glutes"
    ],
    "type": "compound"
  },
  "Sumo Deadlift": {
    "primary": [
      "hamstrings"
    ],
    "secondary": [
      "quads",
      "lower_back",
      "glutes"
    ],
    "type": "compound"
  },
  "Sumo Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sumo Squat (Barbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Sumo Squat (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Sumo Squat (Kettlebell)": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Superman": {
    "primary": [
      "lower_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "T Bar Row": {
    "primary": [
      "mid_back"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Toe Touch": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Toes to Bar": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Torso Rotation": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Dip": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Dip (Assisted)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Dip (Weighted)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Extension (Barbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Extension (Cable)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Extension (Dumbbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Extension (Machine)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Extension (Suspension)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Kickback (Cable)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Kickback (Dumbbell)": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Pressdown": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Pushdown": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Triceps Rope Pushdown": {
    "primary": [
      "triceps"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Upright Row (Barbell)": {
    "primary": [
      "traps"
    ],
    "secondary": [
      "mid_back",
      "side_delts"
    ],
    "type": "compound"
  },
  "Upright Row (Cable)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Upright Row (Dumbbell)": {
    "primary": [
      "side_delts"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "V Up": {
    "primary": [
      "abs"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Walking Lunge": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "glutes",
      "hamstrings"
    ],
    "type": "compound"
  },
  "Walking Lunge (Dumbbell)": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "glutes",
      "hamstrings"
    ],
    "type": "compound"
  },
  "Wall Sit": {
    "primary": [
      "quads"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Wide Pull Up": {
    "primary": [
      "lats"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Wrist Roller": {
    "primary": [
      "forearms"
    ],
    "secondary": [],
    "type": "isolation"
  },
  "Zercher Squat": {
    "primary": [
      "quads"
    ],
    "secondary": [
      "hamstrings",
      "glutes"
    ],
    "type": "compound"
  },
  "Zottman Curl (Dumbbell)": {
    "primary": [
      "biceps"
    ],
    "secondary": [],
    "type": "isolation"
  }
};