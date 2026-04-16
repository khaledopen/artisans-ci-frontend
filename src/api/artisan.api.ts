// src/api/artisan.api.ts

import api from "./axios";
import type { Artisan, ArtisansResponse, UpdateArtisanProfileData } from "../types/artisan";

// Liste des artisans (paginée)
export const getArtisans = (page = 0, size = 10): Promise<ArtisansResponse> => {
  return api.get(`/artisans?page=${page}&size=${size}`).then(res => res.data);
};

// Détail d'un artisan par ID
export const getArtisanById = (id: number): Promise<Artisan> => {
  return api.get(`/artisans/details/${id}`).then(res => res.data);
};

// Mettre à jour le profil de l'artisan connecté
export const updateArtisanProfile = (data: UpdateArtisanProfileData): Promise<Artisan> => {
  return api.put("/artisans/profile", data).then(res => res.data);
};

// ✅ Filtrer les artisans par métier et/ou commune
export interface FilterArtisansData {
  metierId?: number | string;
  commune?: string;
}

export const filterArtisans = (data: FilterArtisansData): Promise<Artisan[]> => {
  // Note: on enlève le /api/ en trop
  return api.post("/artisans/filter", data).then(res => res.data);
};