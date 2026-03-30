// authContext.ts
import { createContext } from "react";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<AuthUser>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<string>;
  updateUser: (fields: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export { useAuth } from "./useAuth";