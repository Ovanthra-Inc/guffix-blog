"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { syncUserProfile } from "@/lib/actions/user.actions";
import type { UserProfile, UserTier } from "@/types/user";


interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userTier: UserTier;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  userTier: "free",
  loading: true,
  signInWithGoogle: async () => null,
  signInWithEmail: async () => null,
  signOut: async () => {},
});


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const userTier: UserTier = userProfile?.tier || "free";


  useEffect(() => {
    if (!auth) { setLoading(false); return; } // Firebase not configured
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          const profile = await syncUserProfile(firebaseUser.uid, {
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          });
          setUserProfile(profile);

          const token = await firebaseUser.getIdToken();
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } catch (e) {
          console.error("Auth sync error:", e);
        }
      } else {
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase not configured");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };


  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };


  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, userTier, loading, signInWithGoogle, signInWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
