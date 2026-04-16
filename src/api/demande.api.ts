// src/api/demande.api.ts

import api from "./axios";
import type { 
  CreateDemandeData, 
  DemandeResponse, 
  DemandesResponse, 
  DemandeClientResponse, 
  DemandeArtisanResponse 
} from "../types/demande";

// ✅ Créer une nouvelle demande AVEC photo (multipart/form-data)
export const createDemandeWithPhoto = async (
  demandeData: CreateDemandeData,
  photoFile?: File
): Promise<DemandeResponse> => {
  const formData = new FormData();
  
  // Créer un Blob JSON pour la partie "demande"
  const demandeBlob = new Blob([JSON.stringify(demandeData)], {
    type: "application/json"
  });
  formData.append("demande", demandeBlob);
  
  // Ajouter la photo si elle existe (le backend attend "photo_endommage" ou "photo"?)
  if (photoFile) {
    formData.append("photo_endommage", photoFile);
  }
  
  const response = await api.post("/demandes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

// src/api/demande.api.ts

// ✅ Récupérer les demandes disponibles pour un artisan (même commune)
export const getDemandesDisponiblesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => {
  return api.get(`/demandes/disponibles/artisan/${artisanId}`).then(res => res.data);
};

// ⚠️ Créer une demande SANS photo (JSON simple)
export const createDemande = (data: CreateDemandeData): Promise<DemandeResponse> => {
  return api.post("/demandes", data).then(res => res.data);
};

// Récupérer les détails d'une demande par ID
export const getDemandeById = (id: number): Promise<DemandeResponse> => {
  return api.get(`/demandes/${id}`).then(res => res.data);
};

// Récupérer toutes les demandes d'un client
export const getDemandesByClientId = (clientId: number): Promise<DemandeClientResponse[]> => {
  return api.get(`/demandes/client/${clientId}`).then(res => res.data);
};

// Récupérer toutes les demandes d'un artisan
export const getDemandesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => {
  return api.get(`/demandes/artisan/${artisanId}`).then(res => res.data);
};

// Récupérer la description d'une demande
export const getDemandeDescription = (id: number): Promise<{ description: string }> => {
  return api.get(`/demands/${id}/description`).then(res => res.data);
};

// Récupérer la date de rendez-vous d'une demande
export const getDemandeDateRendezVous = (id: number): Promise<{ date: string }> => {
  return api.get(`/demandes/${id}/date-rendezvous`).then(res => res.data);
};

// Récupérer le statut d'une demande
export const getDemandeStatut = (id: number): Promise<{ statut: string }> => {
  return api.get(`/demandes/${id}/statut`).then(res => res.data);
};

// Récupérer l'heure d'une demande (si le backend le supporte)
export const getDemandeHeure = (id: number): Promise<{ heure: string }> => {
  return api.get(`/demandes/${id}/heure`).then(res => res.data);
};

// Récupérer les photos d'une demande
export const getDemandePhotos = (id: number): Promise<string[]> => {
  return api.get(`/demandes/${id}/photo`).then(res => res.data);
};

// Ajouter une photo à une demande existante
export const addDemandePhoto = (id: number, file: File): Promise<{ message: string; photoUrl?: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  
  return api.post(`/demandes/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(res => res.data);
};