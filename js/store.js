// Uses the Firebase compat SDK (loaded via <script> tags in index.html)
// so this file can stay a plain script with no bundler required.
 
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
 
let currentUser = null;
let sessionsCache = []; // all of the signed-in user's sessions, newest first
 
const Store = {
  onAuthChange(cb) {
    auth.onAuthStateChanged(async (user) => {
      currentUser = user;
      if (user) {
        await Store.loadAll();
      } else {
        sessionsCache = [];
        CUSTOM_EXERCISES = {};
      }
      cb(user);
    });
  },
 
  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider).catch((err) => {
      console.error("Sign-in failed", err);
      alert("Sign-in failed: " + err.message);
    });
  },
 
  signOut() {
    return auth.signOut();
  },
 
  get user() {
    return currentUser;
  },
 
  async loadAll() {
    if (!currentUser) return;
    const [sessionsSnap, exercisesSnap] = await Promise.all([
      db.collection("users").doc(currentUser.uid).collection("sessions").orderBy("date", "desc").get(),
      db.collection("users").doc(currentUser.uid).collection("customExercises").get(),
    ]);
    sessionsCache = sessionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    CUSTOM_EXERCISES = {};
    exercisesSnap.docs.forEach((d) => {
      CUSTOM_EXERCISES[d.id] = d.data();
    });
  },
 
  getSessions() {
    return sessionsCache;
  },
 
  getSessionsInLastNDays(n) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - n);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return sessionsCache.filter((s) => s.date >= cutoffStr);
  },
 
  getSessionsThisWeek() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const mondayStr = monday.toISOString().slice(0, 10);
    return sessionsCache.filter((s) => s.date >= mondayStr);
  },
 
  getSessionByDate(dateStr) {
    return sessionsCache.filter((s) => s.date === dateStr);
  },
 
  getLastSessionForExercise(exerciseName, beforeDate) {
    const matches = sessionsCache
      .filter((s) => (!beforeDate || s.date < beforeDate) && s.sets.some((set) => set.exercise === exerciseName))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return matches[0] || null;
  },
 
  async addSession(session) {
    const ref = await db
      .collection("users")
      .doc(currentUser.uid)
      .collection("sessions")
      .add(session);
    sessionsCache.unshift({ id: ref.id, ...session });
    sessionsCache.sort((a, b) => (a.date < b.date ? 1 : -1));
    return ref.id;
  },
 
  async updateSession(id, data) {
    await db.collection("users").doc(currentUser.uid).collection("sessions").doc(id).set(data, { merge: true });
    const idx = sessionsCache.findIndex((s) => s.id === id);
    if (idx >= 0) sessionsCache[idx] = { ...sessionsCache[idx], ...data };
  },
 
  async deleteSession(id) {
    await db.collection("users").doc(currentUser.uid).collection("sessions").doc(id).delete();
    sessionsCache = sessionsCache.filter((s) => s.id !== id);
  },
 
  async addCustomExercise(name, primary, secondary, type = "compound") {
    await db
      .collection("users")
      .doc(currentUser.uid)
      .collection("customExercises")
      .doc(name)
      .set({ primary, secondary, type });
    CUSTOM_EXERCISES[name] = { primary, secondary, type };
  },
};
 
