import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from '../services/firebase';

const AuthContext = createContext();

export const MASTER_ADMIN = {
  email: "aldojeda92@gmail.com",
  role: "superadmin",
  displayName: "Aldo Ojeda (Master Admin)"
};

const MASTER_PASSWORD = "Aldo3492018*";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('datacampus_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        if (fbUser.email?.toLowerCase() === MASTER_ADMIN.email.toLowerCase()) {
          const userObj = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || MASTER_ADMIN.displayName,
            role: "superadmin",
            isMaster: true
          };
          setCurrentUser(userObj);
          localStorage.setItem('datacampus_auth_user', JSON.stringify(userObj));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // 1. Direct Master User Verification (Always guaranteed to work)
    if (cleanEmail === MASTER_ADMIN.email.toLowerCase() && password === MASTER_PASSWORD) {
      const masterUser = {
        uid: "master-admin-aldo",
        email: MASTER_ADMIN.email,
        displayName: MASTER_ADMIN.displayName,
        role: "superadmin",
        isMaster: true,
        isSocio: true
      };
      setCurrentUser(masterUser);
      localStorage.setItem('datacampus_auth_user', JSON.stringify(masterUser));
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.info("Using Master Admin local verification:", err.message);
      }
      
      setLoading(false);
      return { success: true, user: masterUser };
    }

    // 2. Check registered users in datacampus_users (Socios and Universities)
    try {
      const { getUsers } = await import('../services/dataService');
      const allUsers = await getUsers();
      const match = allUsers.find(u => 
        u.email?.trim().toLowerCase() === cleanEmail && 
        u.password === password &&
        u.status !== 'inactivo'
      );

      if (match) {
        const isSocio = match.role === 'socio' || match.role === 'superadmin';
        const isUniversity = match.role === 'universidad';

        const userObj = {
          uid: match.id,
          email: match.email,
          displayName: match.fullName || match.email,
          role: match.role,
          isMaster: isSocio,
          isSocio: isSocio,
          isUniversity: isUniversity,
          universityId: match.universityId || null,
          universityName: match.universityName || null
        };

        setCurrentUser(userObj);
        localStorage.setItem('datacampus_auth_user', JSON.stringify(userObj));
        setLoading(false);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn("Error reading users in login:", err);
    }

    // 2. Fallback to standard Firebase Auth if another account tries to log in
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userObj = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || cred.user.email,
        role: cleanEmail === MASTER_ADMIN.email ? "superadmin" : "admin",
        isMaster: cleanEmail === MASTER_ADMIN.email
      };
      setCurrentUser(userObj);
      localStorage.setItem('datacampus_auth_user', JSON.stringify(userObj));
      setLoading(false);
      return { success: true, user: userObj };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        error: "Credenciales inválidas. Verifica tu correo y contraseña." 
      };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("SignOut Firebase warning:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('datacampus_auth_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin: !!currentUser && (currentUser?.isMaster || currentUser?.isSocio),
      isMaster: currentUser?.isMaster || currentUser?.isSocio || false,
      isSocio: currentUser?.isSocio || currentUser?.isMaster || false,
      isUniversity: currentUser?.isUniversity || false,
      universityId: currentUser?.universityId || null,
      universityName: currentUser?.universityName || null,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
