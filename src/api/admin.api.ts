import api from "./axios";
import type { AdminDemande, AdminClient, AdminArtisan, AdminClientsResponse, AdminArtisansResponse, StatutDemande } from "../types/admin";

// Demandes
export const updateDemandeStatut = (id: number, statut: StatutDemande): Promise<{ message: string }> => api.put(`/admin/demandes/${id}/statut`, `"${statut}"`, {
  headers: { "Content-Type": "application/json" }
}).then(res => res.data);
export const getAdminDemandes = (page = 0, size = 10): Promise<AdminDemande[]> => api.get(`/admin/demandes?page=${page}&size=${size}`).then(res => res.data);
export const getAdminDemandeById = (id: number): Promise<AdminDemande> => api.get(`/admin/demandes/${id}`).then(res => res.data);
export const deleteAdminDemande = (id: number): Promise<{ message: string }> => api.delete(`/admin/demandes/${id}`).then(res => res.data);

// Clients
export const getAdminClients = (page = 0, size = 10): Promise<AdminClientsResponse> => api.get(`/admin/clients?page=${page}&size=${size}`).then(res => res.data);
export const getAdminClientById = (id: number): Promise<AdminClient> => api.get(`/admin/clients/${id}`).then(res => res.data);
export const blockClient = (id: number): Promise<{ message: string }> => api.put(`/admin/clients/${id}/block`).then(res => res.data);
export const unblockClient = (id: number): Promise<{ message: string }> => api.put(`/admin/clients/${id}/unblock`).then(res => res.data);
export const deleteClient = (id: number): Promise<{ message: string }> => api.delete(`/admin/clients/${id}`).then(res => res.data);

// Artisans
export const getAdminArtisans = (page = 0, size = 10): Promise<AdminArtisansResponse> => api.get(`/admin/artisans?page=${page}&size=${size}`).then(res => res.data);
export const getAdminArtisanById = (id: number): Promise<AdminArtisan> => api.get(`/admin/artisans/${id}`).then(res => res.data);
export const blockArtisan = (id: number): Promise<{ message: string }> => api.put(`/admin/artisans/${id}/block`).then(res => res.data);
export const unblockArtisan = (id: number): Promise<{ message: string }> => api.put(`/admin/artisans/${id}/unblock`).then(res => res.data);
export const verifyArtisan = (id: number): Promise<{ message: string }> => api.put(`/admin/artisans/${id}/verify`).then(res => res.data);
export const deleteArtisan = (id: number): Promise<{ message: string }> => api.delete(`/admin/artisans/${id}`).then(res => res.data);