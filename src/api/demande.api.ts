// src/api/demande.api.ts

import api from "./axios";
import type { 
  CreateDemandeData, 
  DemandeResponse, 
  DemandeClientResponse, 
  DemandeArtisanResponse 
} from "../types/demande";

// ========== CRÉATION ==========

export const createDemandeWithPhoto = async (demandeData: CreateDemandeData, photoFile?: File): Promise<DemandeResponse> => {
  const formData = new FormData();
  const demandeBlob = new Blob([JSON.stringify(demandeData)], { type: "application/json" });
  formData.append("demande", demandeBlob);
  if (photoFile) formData.append("file", photoFile);
  const response = await api.post("/demandes", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
};

export const createDemande = (data: CreateDemandeData): Promise<DemandeResponse> => api.post("/demandes", data).then(res => res.data);

// ========== LECTURE ==========

export const getDemandeById = (id: number): Promise<DemandeResponse> => api.get(`/demandes/${id}`).then(res => res.data);
export const getDemandesByClientId = (clientId: number): Promise<DemandeClientResponse[]> => api.get(`/demandes/client/${clientId}`).then(res => res.data);
export const getDemandesDisponiblesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => api.get(`/demandes/disponibles/artisan/${artisanId}`).then(res => res.data);
export const getDemandesByArtisanId = (artisanId: number): Promise<DemandeArtisanResponse[]> => api.get(`/demandes/artisan/${artisanId}`).then(res => res.data);
export const getDemandeDescription = (id: number): Promise<{ description: string }> => api.get(`/demandes/${id}/description`).then(res => res.data);
export const getDemandeDateRendezVous = (id: number): Promise<{ date: string }> => api.get(`/demandes/${id}/date-rendezvous`).then(res => res.data);
export const getDemandeStatut = (id: number): Promise<{ statut: string }> => api.get(`/demandes/${id}/statut`).then(res => res.data);
export const getDemandeHeure = (id: number): Promise<{ heure: string }> => api.get(`/demandes/${id}/heure`).then(res => res.data);
export const getDemandePhotos = (id: number): Promise<string[]> => api.get(`/demandes/${id}/photo`).then(res => res.data);

// ========== ACTIONS ARTISAN ==========

export const accepterDemande = (demandeId: number, artisanId: number): Promise<DemandeArtisanResponse> => {
  return api.post(`/demandes/${demandeId}/accepter/${artisanId}`).then(res => res.data);
};

export const updateDemandeStatutArtisan = (demandeId: number, statut: "EN_COURS" | "TERMINEE"): Promise<DemandeResponse> => {
  return api.put(`/demandes/${demandeId}/statut`, `"${statut}"`, { headers: { "Content-Type": "application/json" } }).then(res => res.data);
};

// ========== ADMIN ==========

export const getAdminDemandes = async (page = 0, size = 10): Promise<DemandeResponse[]> => {
  const res = await api.get(`/admin/demandes?page=${page}&size=${size}`);
  return Array.isArray(res.data) ? res.data : (res.data?.content || []);
};

export const deleteAdminDemande = (id: number): Promise<{ message: string }> => api.delete(`/admin/demandes/${id}`).then(res => res.data);
export const addDemandePhoto = (id: number, file: File): Promise<{ message: string; photoUrl?: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/demandes/${id}/photo`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);
};