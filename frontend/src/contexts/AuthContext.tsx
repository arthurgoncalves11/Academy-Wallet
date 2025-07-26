'use client'
 
import { createContext, useContext, useEffect, useState } from 'react';
 
type AuthContextType = {
  token: string | null;
  setAuth: (auth: { token: string }) => void;
  logout: () => void;
};
 
const AuthContext = createContext<AuthContextType | null>(null);
 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
 
  useEffect(() => {
 
    if (typeof window !== 'undefined') {
      const tokenFromCookie = document.cookie.split('; ')
        .find(row => row.startsWith('token='));
      if (tokenFromCookie) {
        setToken(tokenFromCookie.split('=')[1]);
      }
    }
  }, []);
 
  const setAuth = (auth: { token: string }) => {
    console.log({token})
    if (!auth?.token) {
      console.error('Token inválido');
      return;
    }
   
    setToken(auth.token);
    document.cookie = `token=${auth.token}; path=/; max-age=3600; SameSite=Lax`;
  };
 
  const logout = () => {
    setToken(null);
    document.cookie = "token=; Max-Age=0; path=/;";
  };
 
  return (
    <AuthContext.Provider value={{ token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};