// ---------------------------------------------------------------------------
// Estimates cycle phase for any date from logged period-start dates alone.
// You only ever log "period started on X" — everything else is inferred.
//
// Why this model (with sources):
//
// 1. The LUTEAL phase is the more physiologically fixed one — it's the
//    lifespan of the corpus luteum, not variable follicle development —
//    so ovulation is best estimated by counting backward from the NEXT
//    period, not forward a fixed 14 days from the last one.
//    - NCBI Endotext, "The Normal Menstrual Cycle and the Control of
//      Ovulation": luteal phase ~14 days and comparatively constant;
//      nearly all cycle-length variability comes from the follicular
//      phase (range ~10-16 days there vs. much tighter luteal range).
//      https://www.ncbi.nlm.nih.gov/books/NBK279054/
//    - A 2024 Human Reproduction cohort study screened participants for
//      a luteal phase of >=10 days as the definition of "normal",
//      consistent with using ~14 days (with real person-to-person and
//      cycle-to-cycle variation) as a working average rather than a
//      hard rule. https://academic.oup.com/humrep/article/39/11/2565/7775370
//
// 2. Real-world data (Natural Cycles / npj Digital Medicine, 612,613
//    cycles): mean cycle length 29.3 days, mean follicular phase 16.9
//    days, mean luteal phase 12.4 days — and explicitly debunks "ovulation
//    is always day 14". https://www.nature.com/articles/s41746-019-0152-7
//    This app defaults to a 28-day cycle / 14-day luteal phase only until
//    you've logged enough periods to compute your own average cycle
//    length, at which point ovulation shifts to (your average cycle
//    length - 14).
//
// 3. Menstruation itself typically runs ~3-7 days; this app assumes 5
//    unless you tell it otherwise (no separate "period end" logging yet,
//    since you asked to keep logging to just the start date).
//
// Caveat this app shows in the UI: this is a population-average estimate,
// not a measurement (no BBT/LH data) — individual cycles vary, and this
// is meant as a rough reference point, not a diagnosis.
// ---------------------------------------------------------------------------

const CYCLE_DEFAULTS = {
  length: 28,       // days, used until >=2 logged periods give a real average
  lutealLength: 14, // days, back-counted from the next period
  menstrualLength: 5, // days, assumed length of bleeding from period start
};

function daysBetween(dateStrA, dateStrB) {
  return Math.round((new Date(dateStrB) - new Date(dateStrA)) / 86400000);
}

// Average of the user's own logged cycle lengths (gaps between consecutive
// period starts), ignoring implausible gaps (<15 or >45 days, likely a
// logging mistake or missed cycle) so one bad entry doesn't skew things.
// Falls back to the population default until there's real data.
function computeAvgCycleLength(periodStarts) {
  if (periodStarts.length < 2) return CYCLE_DEFAULTS.length;
  const diffs = [];
  for (let i = 1; i < periodStarts.length; i++) {
    diffs.push(daysBetween(periodStarts[i - 1], periodStarts[i]));
  }
  const valid = diffs.filter((d) => d >= 15 && d <= 45);
  if (valid.length === 0) return CYCLE_DEFAULTS.length;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// Returns { phase, cycleDay, cycleLength, ovulationDay } for a given date,
// or null if there's no logged period on/before that date to count from.
function estimatePhaseForDate(dateStr, periodStarts) {
  if (!periodStarts || periodStarts.length === 0) return null;
  const priorStarts = periodStarts.filter((p) => p <= dateStr);
  if (priorStarts.length === 0) return null;

  const lastStart = priorStarts[priorStarts.length - 1];
  const cycleDay = daysBetween(lastStart, dateStr) + 1; // day 1 = period start
  const avgCycleLength = computeAvgCycleLength(periodStarts);
  const ovulationDay = Math.round(avgCycleLength - CYCLE_DEFAULTS.lutealLength) + 1;

  let phase;
  if (cycleDay <= CYCLE_DEFAULTS.menstrualLength) phase = "menstrual";
  else if (cycleDay < ovulationDay) phase = "follicular";
  else if (cycleDay <= ovulationDay + 1) phase = "ovulation";
  else phase = "luteal";

  return { phase, cycleDay, cycleLength: Math.round(avgCycleLength), ovulationDay };
}

const PHASE_LABELS = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
};