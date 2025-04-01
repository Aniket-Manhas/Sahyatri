import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      uid: userCredential.user.uid,
      email,
      displayName: name,
      createdAt: new Date(),
      role: 'user' // Default role for new users
    });
    
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // New user, set default role
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        createdAt: new Date(),
        role: 'user' // Default role for new users
      });
    } else {
      // Existing user, update last login but preserve role
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        lastLogin: new Date()
      }, { merge: true });
    }
    
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribe;
    
    const initializeAuth = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
              const userDoc = await getDoc(userRef);
              if (!userDoc.exists()) {
                const userData = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName || '',
                  photoURL: user.photoURL || '',
                  createdAt: new Date(),
                  role: 'user' // Default role for new users
                };
                await setDoc(userRef, userData, { merge: true });
                setUserRole('user');
                setIsAdmin(false);
              } else {
                // Get user data including role
                const userData = userDoc.data();
                const role = userData?.role || 'user';
                setUserRole(role);
                setIsAdmin(role === 'admin');
              }
            } catch (firestoreError) {
              console.error('Firestore operation failed:', firestoreError);
              setUserRole('user');
              setIsAdmin(false);
            }
          } else {
            // User is signed out
            setUserRole(null);
            setIsAdmin(false);
          }
          setLoading(false);
        });
      } catch (authError) {
        console.error('Auth state monitoring failed:', authError);
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    isAdmin,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}