// src/api/demande.api.ts

import api from "./axios";
import type { 
  CreateDemandeData, 
  DemandeResponse, 
  DemandeClientResponse, 
  DemandeArtisanResponse 
} from "../types/demande";

// ========== CRÉATION ==========

/**
 * Crée une demande via multipart/form-data.
 * Les champs sont envoyés individuellement (pas en blob JSON).
 * La photo est optionnelle et sera hébergée sur Cloudinary.
 */
/**
 * Crée une demande.
 * Selon le Swagger : le DTO est passé en query parameters et le fichier en multipart/form-data.
 */
export const createDemandeWithPhoto = async (
  demandeData: CreateDemandeData,
  photoFile?: File
): Promise<DemandeResponse> => {
  const formData = new FormData();
  if (photoFile) {
    formData.append("file", photoFile);
  } else {
    // Si pas de photo, on envoie un FormData vide ou on gère selon le backend
    // Certains backends multipart exigent au moins une partie ou acceptent un vide
  }

  // On passe les données du DTO en query params comme indiqué dans le Swagger
  const response = await api.post("/demandes", formData, {
    params: {
      date_rendez_vous: demandeData.date_rendez_vous,
      description_travail: demandeData.description_travail,
      clientId: demandeData.clientId,
      artisanId: demandeData.artisanId || undefined,
      // Si heure est nécessaire, il faudrait le formater si le backend attend un objet, 
      // mais ici on envoie la string si elle existe.
      heure: demandeData.heure || undefined,
    },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ========== LECTURE POUR CLIENT ==========

export const getDemandesByClientId = (clientId: number): Promise<DemandeClientResponse[]> => {
  console.log(`📡 Appel API: /demandes/client/${clientId}`);
  return api.get(`/demandes/client/${clientId}`).then(res => res.data);
};

// ========== LECTURE POUR ARTISAN ==========

// ✅ Récupérer les demandes assignées à un artisan
export const getDemandesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => {
  console.log(`📡 Appel API: /demandes/artisan/${artisanId}`);
  return api.get(`/demandes/artisan/${artisanId}`).then(res => {
    console.log("✅ Demandes reçues:", res.data);
    return res.data;
  }).catch(err => {
    console.error("❌ Erreur:", err.response?.status);
    return [];
  });
};

// ✅ Récupérer les demandes disponibles par commune
export const getDemandesByCommune = (commune: string): Promise<DemandeArtisanResponse[]> => {
  console.log(`📡 Appel API: /demandes/commune/${commune}`);
  return api.get(`/demandes/commune/${encodeURIComponent(commune)}`).then(res => res.data);
};

// ✅ Récupérer les demandes disponibles pour un artisan
export const getDemandesDisponiblesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => {
  console.log(`📡 Appel API: /demandes/disponibles/artisan/${artisanId}`);
  return api.get(`/demandes/disponibles/artisan/${artisanId}`).then(res => res.data);
};

export const getDemandeById = (id: number): Promise<DemandeResponse> => {
  return api.get(`/demandes/${id}`).then(res => res.data);
};

/** Récupère le numéro de téléphone brut du client. */
export const getClientNumero = (demandeId: number): Promise<string> => {
  return api.get(`/demandes/${demandeId}/client-numero`).then(res => res.data);
};

/**
 * Retourne l'URL directe de la photo de la demande.
 */
export const getDemandePhotoUrl = (id: number): string => {
  return `${api.defaults.baseURL}/demandes/${id}/photo`;
};

/**
 * Récupère le contenu binaire de la photo avec authentification.
 */
export const fetchDemandePhotoBlob = async (id: number): Promise<string> => {
  const response = await api.get(`/demandes/${id}/photo`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
};

/**
 * Récupère la photo (version legacy ou via endpoint direct).
 */
export const getDemandePhotos = (id: number): Promise<string[]> => {
  // On retourne l'URL de l'endpoint direct comme première photo
  return Promise.resolve([getDemandePhotoUrl(id)]);
};

// ========== ACTIONS ARTISAN ==========

export const accepterDemande = (demandeId: number, artisanId: number): Promise<DemandeArtisanResponse> => {
  console.log(`📡 Acceptation: /demandes/${demandeId}/accepter/${artisanId}`);
  return api.post(`/demandes/${demandeId}/accepter/${artisanId}`).then(res => res.data);
};

export const updateDemandeStatut = (demandeId: number, statut: string): Promise<DemandeResponse> => {
  return api.put(`/demandes/${demandeId}/statut`, `"${statut}"`, {
    headers: { "Content-Type": "application/json" }
  }).then(res => res.data);
};

// ========== ADMIN ==========

export const getAdminDemandes = async (page = 0, size = 10): Promise<DemandeResponse[]> => {
  const res = await api.get(`/admin/demandes?page=${page}&size=${size}`);
  return Array.isArray(res.data) ? res.data : (res.data?.content || []);
};

export const deleteAdminDemande = (id: number): Promise<{ message: string }> => {
  return api.delete(`/admin/demandes/${id}`).then(res => res.data);
};