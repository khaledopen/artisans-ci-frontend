// src/api/artisan.api.ts

import api from "./axios";
import type { Artisan, ArtisansResponse, UpdateArtisanProfileData, FilterArtisansData } from "../types/artisan";

// ========== LISTE ET DÉTAIL ==========

export const getArtisans = (page = 0, size = 10): Promise<ArtisansResponse> => {
  return api.get(`/artisans?page=${page}&size=${size}`).then(res => res.data);
};

// Version 1: avec /details/ (selon ta documentation)
export const getArtisanById = (id: number): Promise<Artisan> => {
  console.log(`📡 Appel API: /artisans/details/${id}`);
  return api.get(`/artisans/details/${id}`).then(res => {
    console.log("✅ Réponse:", res.data);
    return res.data;
  });
};

// Version 2: sans /details/ (fallback)
export const getArtisanByIdSimple = (id: number): Promise<Artisan> => {
  console.log(`📡 Appel API fallback: /artisans/${id}`);
  return api.get(`/artisans/${id}`).then(res => res.data);
};

// Version 3: essaie les deux (recommandé)
export const getArtisanByIdAuto = async (id: number): Promise<Artisan> => {
  try {
    // Essaie d'abord avec /details/
    const data = await api.get(`/artisans/details/${id}`).then(res => res.data);
    return data;
  } catch (err) {
    console.log("⚠️ /details/ a échoué, tentative avec /artisans/${id}");
    // Fallback sans /details/
    return await api.get(`/artisans/${id}`).then(res => res.data);
  }
};

// ========== PROFIL ARTISAN ==========

export const updateArtisanProfile = (data: UpdateArtisanProfileData): Promise<Artisan> => {
  return api.put("/artisans/profile", data).then(res => res.data);
};

// ========== FILTRAGE ==========

export const filterArtisans = (data: FilterArtisansData): Promise<Artisan[]> => {
  return api.post("/artisans/filter", data).then(res => res.data);
};