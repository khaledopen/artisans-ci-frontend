// src/api/auth.api.ts

import api from "./axios";
import type { 
  LoginData,
  RegisterClientData, 
  RegisterArtisanData, 
  AuthResponse,
  UserProfile
} from "../types/auth";

// Connexion
export const login = (data: LoginData): Promise<AuthResponse> => {
  return api.post("/auth/login", data).then(res => res.data);
};

// Inscription client
export const registerClient = (data: RegisterClientData): Promise<AuthResponse> => {
  return api.post("/auth/register/client", data).then(res => res.data);
};

// Inscription artisan
export const registerArtisan = (data: RegisterArtisanData): Promise<AuthResponse> => {
  return api.post("/auth/register/artisan", data).then(res => res.data);
};

// Récupérer le profil utilisateur connecté
export const getMe = (): Promise<UserProfile> => {
  return api.get("/auth/me").then(res => res.data);
};