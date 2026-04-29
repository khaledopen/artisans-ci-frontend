// src/api/auth.api.ts

import api from "./axios";
import type { 
  LoginData,
  RegisterClientData, 
  RegisterArtisanData, 
  AuthResponse,
  UserProfile
} from "../types/auth";

// Connexion (avec rôle optionnel)
export const login = (data: LoginData): Promise<AuthResponse> => {
  // Si un rôle est fourni, on l'inclut dans la requête
  const payload: any = {
    email: data.email,
    motpasse: data.motpasse,
  };
  
  // Ajouter le rôle seulement s'il est défini (pour Client/Artisan)
  if (data.role) {
    payload.role = data.role;
  }
  
  console.log("📤 Requête de connexion:", { email: payload.email, role: payload.role || "non spécifié" });
  
  return api.post("/auth/login", payload).then(res => res.data);
};

// Inscription client (avec commune)
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