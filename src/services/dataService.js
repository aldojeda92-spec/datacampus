import { 
  db, 
  COLLECTIONS, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  writeBatch 
} from './firebase';
import { 
  INITIAL_UNIVERSITIES, 
  INITIAL_CAREERS, 
  INITIAL_BANNERS,
  INITIAL_USERS,
  INITIAL_TEST_RESULTS,
  INITIAL_LEADS
} from '../data/initialData';

// Local storage backup keys
const STORAGE_KEYS = {
  UNIVERSITIES: 'datacampus_local_universities',
  CAREERS: 'datacampus_local_careers',
  BANNERS: 'datacampus_local_banners',
  LEADS: 'datacampus_local_leads',
  USERS: 'datacampus_local_users',
  TEST_RESULTS: 'datacampus_local_test_results'
};

// Helper: load from localStorage or fallback
const getLocalData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Storage read error:", e);
  }
  return fallback;
};

// Helper: save to localStorage
const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
};

/* =========================================================
   UNIVERSITIES API
========================================================= */
export const getUniversities = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.UNIVERSITIES);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocalData(STORAGE_KEYS.UNIVERSITIES, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore error reading universities, falling back to local/seed:", err);
  }
  
  // Return local storage or default initial seed
  const cached = getLocalData(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
  return cached;
};

export const saveUniversity = async (university) => {
  const uniId = university.id || `uni-${Date.now()}`;
  const dataToSave = { ...university, id: uniId, updatedAt: new Date().toISOString() };
  
  try {
    const docRef = doc(db, COLLECTIONS.UNIVERSITIES, uniId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUniversity error, using local fallback:", err);
  }
  
  // Update local cache
  const list = await getUniversities();
  const index = list.findIndex(u => u.id === uniId);
  if (index >= 0) {
    list[index] = dataToSave;
  } else {
    list.unshift(dataToSave);
  }
  setLocalData(STORAGE_KEYS.UNIVERSITIES, list);
  return dataToSave;
};

export const deleteUniversity = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.UNIVERSITIES, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore deleteUniversity error:", err);
  }
  
  const list = await getUniversities();
  const updated = list.filter(u => u.id !== id);
  setLocalData(STORAGE_KEYS.UNIVERSITIES, updated);
  return true;
};

/* =========================================================
   CAREERS API
========================================================= */
export const getCareers = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.CAREERS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocalData(STORAGE_KEYS.CAREERS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore error reading careers, falling back to local/seed:", err);
  }
  
  const cached = getLocalData(STORAGE_KEYS.CAREERS, INITIAL_CAREERS);
  return cached;
};

export const getCareerById = async (id) => {
  const all = await getCareers();
  return all.find(c => c.id === id) || null;
};

export const saveCareer = async (career) => {
  const careerId = career.id || `career-${Date.now()}`;
  const dataToSave = { ...career, id: careerId, updatedAt: new Date().toISOString() };
  
  try {
    const docRef = doc(db, COLLECTIONS.CAREERS, careerId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn("Firestore saveCareer error, using local fallback:", err);
  }
  
  const list = await getCareers();
  const index = list.findIndex(c => c.id === careerId);
  if (index >= 0) {
    list[index] = dataToSave;
  } else {
    list.unshift(dataToSave);
  }
  setLocalData(STORAGE_KEYS.CAREERS, list);
  return dataToSave;
};

export const deleteCareer = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.CAREERS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore deleteCareer error:", err);
  }
  
  const list = await getCareers();
  const updated = list.filter(c => c.id !== id);
  setLocalData(STORAGE_KEYS.CAREERS, updated);
  return true;
};

/* =========================================================
   BANNERS API
========================================================= */
export const getBanners = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.BANNERS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocalData(STORAGE_KEYS.BANNERS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore error reading banners, using fallback:", err);
  }
  
  return getLocalData(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
};

export const saveBanner = async (banner) => {
  const bannerId = banner.id || `banner-${Date.now()}`;
  const dataToSave = { ...banner, id: bannerId, updatedAt: new Date().toISOString() };
  
  try {
    const docRef = doc(db, COLLECTIONS.BANNERS, bannerId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn("Firestore saveBanner error:", err);
  }
  
  const list = await getBanners();
  const index = list.findIndex(b => b.id === bannerId);
  if (index >= 0) {
    list[index] = dataToSave;
  } else {
    list.unshift(dataToSave);
  }
  setLocalData(STORAGE_KEYS.BANNERS, list);
  return dataToSave;
};

export const deleteBanner = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.BANNERS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore deleteBanner error:", err);
  }
  
  const list = await getBanners();
  const updated = list.filter(b => b.id !== id);
  setLocalData(STORAGE_KEYS.BANNERS, updated);
  return true;
};

/* =========================================================
   LEADS API (Prospectos de estudiantes)
========================================================= */
export const saveLead = async (leadData) => {
  const fullLead = {
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'Nuevo' // Nuevo, Contactado, En Seguimiento, Inscrito
  };
  
  let docId = `lead-${Date.now()}`;
  try {
    const colRef = collection(db, COLLECTIONS.LEADS);
    const res = await addDoc(colRef, {
      ...fullLead,
      serverTime: serverTimestamp()
    });
    docId = res.id;
  } catch (err) {
    console.warn("Firestore saveLead error, cached locally:", err);
  }
  
  const savedLead = { ...fullLead, id: docId };
  const currentLeads = getLocalData(STORAGE_KEYS.LEADS, []);
  currentLeads.unshift(savedLead);
  setLocalData(STORAGE_KEYS.LEADS, currentLeads);
  return savedLead;
};

export const getLeads = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.LEADS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocalData(STORAGE_KEYS.LEADS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore getLeads error, using local fallback:", err);
  }
  
  return getLocalData(STORAGE_KEYS.LEADS, INITIAL_LEADS);
};

export const updateLeadStatus = async (id, status) => {
  try {
    const docRef = doc(db, COLLECTIONS.LEADS, id);
    await setDoc(docRef, { status }, { merge: true });
  } catch (e) {
    console.warn("Lead status update error:", e);
  }
  
  const leads = await getLeads();
  const item = leads.find(l => l.id === id);
  if (item) item.status = status;
  setLocalData(STORAGE_KEYS.LEADS, leads);
  return true;
};

/* =========================================================
   USERS API (Socios & Usuarios de Universidades)
========================================================= */
export const getUsers = async () => {
  const legacyIds = ['user-socio-1', 'user-uni-uca', 'user-uni-una', 'user-uni-americana'];
  try {
    const colRef = collection(db, COLLECTIONS.USERS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => !legacyIds.includes(u.id));
      setLocalData(STORAGE_KEYS.USERS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore getUsers error, using local fallback:", err);
  }
  
  const cached = getLocalData(STORAGE_KEYS.USERS, INITIAL_USERS) || [];
  const filtered = cached.filter(u => !legacyIds.includes(u.id));
  setLocalData(STORAGE_KEYS.USERS, filtered);
  return filtered;
};

export const saveUser = async (user) => {
  const userId = user.id || `user-${Date.now()}`;
  const dataToSave = { 
    ...user, 
    id: userId, 
    updatedAt: new Date().toISOString() 
  };
  
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUser error, using local fallback:", err);
  }
  
  const list = await getUsers();
  const index = list.findIndex(u => u.id === userId);
  if (index >= 0) {
    list[index] = dataToSave;
  } else {
    list.unshift(dataToSave);
  }
  setLocalData(STORAGE_KEYS.USERS, list);
  return dataToSave;
};

export const deleteUser = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore deleteUser error:", err);
  }
  
  const list = await getUsers();
  const updated = list.filter(u => u.id !== id);
  setLocalData(STORAGE_KEYS.USERS, updated);
  return true;
};

/* =========================================================
   TEST RESULTS API (Analítica de Test Vocacional)
========================================================= */
export const getTestResults = async () => {
  try {
    const colRef = collection(db, COLLECTIONS.TEST_RESULTS);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocalData(STORAGE_KEYS.TEST_RESULTS, items);
      return items;
    }
  } catch (err) {
    console.warn("Firestore getTestResults error, using local fallback:", err);
  }
  
  return getLocalData(STORAGE_KEYS.TEST_RESULTS, INITIAL_TEST_RESULTS);
};

export const saveTestResult = async (resultData) => {
  const fullResult = {
    ...resultData,
    createdAt: new Date().toISOString()
  };
  
  let docId = `test-${Date.now()}`;
  try {
    const colRef = collection(db, COLLECTIONS.TEST_RESULTS);
    const res = await addDoc(colRef, {
      ...fullResult,
      serverTime: serverTimestamp()
    });
    docId = res.id;
  } catch (err) {
    console.warn("Firestore saveTestResult error, cached locally:", err);
  }
  
  const savedItem = { ...fullResult, id: docId };
  const currentList = getLocalData(STORAGE_KEYS.TEST_RESULTS, INITIAL_TEST_RESULTS);
  currentList.unshift(savedItem);
  setLocalData(STORAGE_KEYS.TEST_RESULTS, currentList);
  return savedItem;
};

/* =========================================================
   SEED INITIAL DATA (Admin action)
========================================================= */
export const seedDatabase = async () => {
  let seededCount = 0;
  
  try {
    // Batch write universities
    for (const uni of INITIAL_UNIVERSITIES) {
      const docRef = doc(db, COLLECTIONS.UNIVERSITIES, uni.id);
      await setDoc(docRef, uni, { merge: true });
      seededCount++;
    }
    
    // Batch write careers
    for (const career of INITIAL_CAREERS) {
      const docRef = doc(db, COLLECTIONS.CAREERS, career.id);
      await setDoc(docRef, career, { merge: true });
      seededCount++;
    }
    
    // Batch write banners
    for (const banner of INITIAL_BANNERS) {
      const docRef = doc(db, COLLECTIONS.BANNERS, banner.id);
      await setDoc(docRef, banner, { merge: true });
      seededCount++;
    }

    // Batch write users
    for (const user of INITIAL_USERS) {
      const docRef = doc(db, COLLECTIONS.USERS, user.id);
      await setDoc(docRef, user, { merge: true });
      seededCount++;
    }

    // Batch write leads
    for (const lead of INITIAL_LEADS) {
      const docRef = doc(db, COLLECTIONS.LEADS, lead.id);
      await setDoc(docRef, lead, { merge: true });
      seededCount++;
    }

    // Batch write test results
    for (const test of INITIAL_TEST_RESULTS) {
      const docRef = doc(db, COLLECTIONS.TEST_RESULTS, test.id);
      await setDoc(docRef, test, { merge: true });
      seededCount++;
    }
    
    // Cache locally as well
    setLocalData(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
    setLocalData(STORAGE_KEYS.CAREERS, INITIAL_CAREERS);
    setLocalData(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    setLocalData(STORAGE_KEYS.USERS, INITIAL_USERS);
    setLocalData(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    setLocalData(STORAGE_KEYS.TEST_RESULTS, INITIAL_TEST_RESULTS);
    
    return { success: true, count: seededCount, message: `Se sembraron ${seededCount} registros en Firebase correctamente.` };
  } catch (err) {
    console.error("Error seeding Firebase database:", err);
    // Still populate local storage so the app works 100% offline or if write rules restrict it
    setLocalData(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
    setLocalData(STORAGE_KEYS.CAREERS, INITIAL_CAREERS);
    setLocalData(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
    setLocalData(STORAGE_KEYS.USERS, INITIAL_USERS);
    setLocalData(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    setLocalData(STORAGE_KEYS.TEST_RESULTS, INITIAL_TEST_RESULTS);
    return { 
      success: true, 
      count: INITIAL_UNIVERSITIES.length + INITIAL_CAREERS.length + INITIAL_BANNERS.length + INITIAL_USERS.length + INITIAL_LEADS.length + INITIAL_TEST_RESULTS.length,
      fallback: true,
      message: `Datos sembrados en memoria local/cache (${err.message})` 
    };
  }
};
