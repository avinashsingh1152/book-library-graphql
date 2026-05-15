import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            try {
              const tokenResult = await firebaseUser.getIdTokenResult();
              setIsAdmin(tokenResult.claims.role === 'admin');
            } catch {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firebase auth error (temp config):', error.message);
          setLoading(false);
        }
      );
    } catch (error) {
      console.warn('Firebase init error (temp config):', error.message);
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
