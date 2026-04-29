// src/types/auth.ts

export interface LoginData {
  email: string;
  motpasse: string;
  role?: "CLIENT" | "ARTISAN";
}

export interface RegisterClientData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;      // ← AJOUTÉ
  motpasse: string;
  localisation: string;
  commune: string;
}

export interface RegisterArtisanData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;      // ← AJOUTÉ
  motpasse: string;
  localisation: string;
  commune: string;
  metierId: number;
}

export interface AuthResponse {
  token: string;
  role: "CLIENT" | "ARTISAN" | "ADMIN";
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;    // ← AJOUTÉ
    role: string;
    localisation?: string;
    commune?: string;
    photoprofil?: string;
  };
}

export interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;      // ← AJOUTÉ
  role: string;
  localisation?: string;
  commune?: string;
  photoprofil?: string;
}