
Muscle diagram · JS
// ---------------------------------------------------------------------------
// Builds a front + back body silhouette with overlaid muscle-group shapes.
// renderMuscleDiagram(el, intensityMap) draws it; intensityMap is
// { muscle_id: 0..1 } where 0 = not worked, 1 = maximally worked.
// ---------------------------------------------------------------------------
 
const BODY_OUTLINE = `
  <ellipse cx="100" cy="26" rx="17" ry="20" class="sl-part" />
  <rect x="92" y="42" width="16" height="14" rx="4" class="sl-part" />
  <path class="sl-part" d="M55,58 Q100,48 145,58 L150,175 Q100,190 50,175 Z" />
  <rect x="18" y="60" width="20" height="88" rx="10" class="sl-part" />
  <rect x="14" y="146" width="18" height="78" rx="9" class="sl-part" />
  <rect x="162" y="60" width="20" height="88" rx="10" class="sl-part" />
  <rect x="168" y="146" width="18" height="78" rx="9" class="sl-part" />
  <rect x="66" y="178" width="30" height="102" rx="14" class="sl-part" />
  <rect x="104" y="178" width="30" height="102" rx="14" class="sl-part" />
  <rect x="68" y="276" width="24" height="92" rx="11" class="sl-part" />
  <rect x="108" y="276" width="24" height="92" rx="11" class="sl-part" />
  <ellipse cx="78" cy="374" rx="12" ry="7" class="sl-part" />
  <ellipse cx="122" cy="374" rx="12" ry="7" class="sl-part" />
`;
 
const FRONT_MUSCLES = {
  front_delts:   `<circle cx="52" cy="64" r="13" /><circle cx="148" cy="64" r="13" />`,
  side_delts:    `<circle cx="34" cy="68" r="10" /><circle cx="166" cy="68" r="10" />`,
  chest:         `<ellipse cx="82" cy="85" rx="22" ry="17" /><ellipse cx="118" cy="85" rx="22" ry="17" />`,
  biceps:        `<rect x="21" y="72" width="15" height="52" rx="7" /><rect x="164" y="72" width="15" height="52" rx="7" />`,
  forearms:      `<rect x="16" y="150" width="14" height="60" rx="7" /><rect x="170" y="150" width="14" height="60" rx="7" />`,
  abs:           `<rect x="90" y="108" width="20" height="16" rx="4" /><rect x="90" y="128" width="20" height="16" rx="4" /><rect x="90" y="148" width="20" height="16" rx="4" />`,
  obliques:      `<rect x="72" y="112" width="14" height="56" rx="7" /><rect x="114" y="112" width="14" height="56" rx="7" />`,
  quads:         `<rect x="70" y="186" width="22" height="88" rx="10" /><rect x="108" y="186" width="22" height="88" rx="10" />`,
  hip_adductors: `<rect x="93" y="192" width="14" height="70" rx="7" />`,
  hip_abductors: `<rect x="57" y="188" width="13" height="80" rx="6" /><rect x="130" y="188" width="13" height="80" rx="6" />`,
};
 
const BACK_MUSCLES = {
  traps:         `<path d="M78,44 Q100,36 122,44 L114,86 Q100,92 86,86 Z" />`,
  side_delts:    `<circle cx="34" cy="68" r="10" /><circle cx="166" cy="68" r="10" />`,
  rear_delts:    `<circle cx="52" cy="64" r="13" /><circle cx="148" cy="64" r="13" />`,
  lats:          `<ellipse cx="68" cy="112" rx="16" ry="38" /><ellipse cx="132" cy="112" rx="16" ry="38" />`,
  mid_back:      `<rect x="92" y="66" width="16" height="30" rx="6" />`,
  lower_back:    `<rect x="86" y="150" width="28" height="26" rx="6" />`,
  triceps:       `<rect x="21" y="72" width="15" height="52" rx="7" /><rect x="164" y="72" width="15" height="52" rx="7" />`,
  glutes:        `<ellipse cx="80" cy="196" rx="19" ry="17" /><ellipse cx="120" cy="196" rx="19" ry="17" />`,
  hip_abductors: `<rect x="57" y="188" width="13" height="80" rx="6" /><rect x="130" y="188" width="13" height="80" rx="6" />`,
  hamstrings:    `<rect x="70" y="216" width="22" height="82" rx="10" /><rect x="108" y="216" width="22" height="82" rx="10" />`,
  calves:        `<rect x="70" y="282" width="20" height="78" rx="9" /><rect x="110" y="282" width="20" height="78" rx="9" />`,
};
 
function heatColor(intensity) {
  // 0 -> inactive gray, 1 -> hot, saturated red-orange
  if (intensity <= 0) return { fill: "var(--muscle-off)", opacity: 1 };
  const clamped = Math.min(1, intensity);
  const hue = 44 - clamped * 34;      // 44 (pale amber) -> 10 (deep red-orange)
  const sat = 80 + clamped * 20;      // 80% -> 100%
  const light = 62 - clamped * 24;    // 62% (washed out) -> 38% (rich/dark)
  return { fill: `hsl(${hue}, ${sat}%, ${light}%)`, opacity: 0.4 + clamped * 0.6 };
}
 
function buildSilhouette(muscleShapes, intensityMap, idPrefix) {
  let groups = "";
  for (const [id, shapeMarkup] of Object.entries(muscleShapes)) {
    const intensity = intensityMap[id] || 0;
    const { fill, opacity } = heatColor(intensity);
    groups += `<g data-muscle="${id}" class="muscle-shape" style="fill:${fill};opacity:${opacity}" tabindex="0" role="img" aria-label="${MUSCLE_GROUPS[id].label}: ${Math.round(intensity * 100)}% worked">${shapeMarkup}</g>`;
  }
  return `<svg viewBox="0 0 200 380" class="body-svg" id="${idPrefix}">${BODY_OUTLINE}${groups}</svg>`;
}
 
function renderMuscleDiagram(container, intensityMap) {
  intensityMap = intensityMap || {};
  container.innerHTML = `
    <div class="diagram-pair">
      <div class="diagram-col">
        ${buildSilhouette(FRONT_MUSCLES, intensityMap, "svg-front")}
        <div class="diagram-label">Front</div>
      </div>
      <div class="diagram-col">
        ${buildSilhouette(BACK_MUSCLES, intensityMap, "svg-back")}
        <div class="diagram-label">Back</div>
      </div>
    </div>
  `;
 
  // simple tooltip on hover/focus
  container.querySelectorAll(".muscle-shape").forEach((g) => {
    const id = g.dataset.muscle;
    const pct = Math.round((intensityMap[id] || 0) * 100);
    g.addEventListener("mouseenter", (e) => showMuscleTooltip(e, MUSCLE_GROUPS[id].label, pct));
    g.addEventListener("mouseleave", hideMuscleTooltip);
  });
}
 
function showMuscleTooltip(e, label, pct) {
  let tip = document.getElementById("muscle-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "muscle-tooltip";
    tip.className = "muscle-tooltip";
    document.body.appendChild(tip);
  }
  tip.textContent = `${label} — ${pct}%`;
  tip.style.display = "block";
  const rect = e.target.getBoundingClientRect();
  tip.style.left = rect.left + rect.width / 2 + "px";
  tip.style.top = rect.top - 8 + "px";
}
 
function hideMuscleTooltip() {
  const tip = document.getElementById("muscle-tooltip");
  if (tip) tip.style.display = "none";
}
 
// -----------------------------------------------------------------------
// Turn a list of sets (this session, or a week's worth) into an intensity
// map. Each set contributes volume = weight * (reps + partial*0.4) to
// every muscle it touches (full weight for primary, 0.5x for secondary).
// Volumes are then normalized 0..1 against the highest-volume muscle so
// the diagram always shows relative emphasis for that session/week.
// -----------------------------------------------------------------------
function computeIntensityMap(sets) {
  const volumes = {};
  for (const id of Object.keys(MUSCLE_GROUPS)) volumes[id] = 0;
 
  for (const set of sets) {
    const { primary, secondary } = getMuscleContribution(set.exercise);
    const effectiveReps = (set.reps || 0) + (set.partialReps || 0) * 0.4;
    const volume = (set.weight || 0) * effectiveReps;
    primary.forEach((m) => (volumes[m] += volume));
    secondary.forEach((m) => (volumes[m] += volume * 0.5));
  }
 
  const max = Math.max(1, ...Object.values(volumes));
  const intensityMap = {};
  for (const [id, v] of Object.entries(volumes)) intensityMap[id] = v / max;
  return intensityMap;
}
 
function untouchedMusclesThisWeek(intensityMap, threshold = 0.05) {
  return Object.keys(MUSCLE_GROUPS).filter((id) => (intensityMap[id] || 0) <= threshold);
}
 
// -----------------------------------------------------------------------
// Weekly SET COUNT per muscle (not volume-load) — this is the unit the
// hypertrophy dose-response literature actually uses. A set counts fully
// toward a muscle it's primary for, and at half-weight ("fractional")
// toward a muscle it's secondary for, matching the direct/indirect set
// quantification used in current meta-analyses.
// -----------------------------------------------------------------------
function computeWeeklySetCounts(sets) {
  const counts = {};
  for (const id of Object.keys(MUSCLE_GROUPS)) counts[id] = 0;
  for (const set of sets) {
    const { primary, secondary } = getMuscleContribution(set.exercise);
    primary.forEach((m) => (counts[m] += 1));
    secondary.forEach((m) => (counts[m] += 0.5));
  }
  return counts;
}
 
// Research-based weekly set target per muscle group for hypertrophy.
// 10-20 hard sets/week covers the empirically responsive range for most
// trained lifters (Schoenfeld et al. 2017 dose-response meta-analysis);
// below ~6 sets/week is a clearly low stimulus, above ~20 shows
// diminishing and increasingly individual returns.
const WEEKLY_SET_TARGET = { low: 6, min: 10, max: 20 };
 
function classifySetCount(count) {
  if (count <= 0) return "none";
  if (count < WEEKLY_SET_TARGET.low) return "low";
  if (count < WEEKLY_SET_TARGET.min) return "building";
  if (count <= WEEKLY_SET_TARGET.max) return "optimal";
  return "high";
}
 
