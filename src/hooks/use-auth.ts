
"use client"

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { getAuth, onIdTokenChanged, User, signOut as firebaseSignOut, IdTokenResult } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);

type CustomClaims = {
  companyId?: string;
  role?: 'owner' | 'admin' | 'dispatcher' | 'tech' | 'accountant';
};

type AuthContextType = {
  user: User | null;
  customClaims: CustomClaims | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<CustomClaims | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setUser(user);
        try {
            const tokenResult: IdTokenResult = await user.getIdTokenResult(true); // Force refresh
            const claims = tokenResult.claims as CustomClaims;
            setCustomClaims({
                companyId: claims.companyId,
                role: claims.role
            });
        } catch (error) {
            console.error("Error getting user token:", error);
            setCustomClaims(null);
        }
      } else {
        setUser(null);
        setCustomClaims(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = { user, customClaims, isLoading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
