// src/api/admin.api.ts

import api from "./axios";
import type { 
  UpdateDemandeStatutData, 
  AdminDemande, 
  AdminClient, 
  AdminArtisan,
  AdminDemandesResponse,
  AdminClientsResponse,
  AdminArtisansResponse,
  StatutDemande 
} from "../types/admin";

// ========== Gestion des Demandes ==========

// Modifier le statut d'une demande (admin)
export const updateDemandeStatut = (id: number, statut: StatutDemande): Promise<{ message: string }> => {
  return api.put(`/admin/demandes/${id}/statut`, statut).then(res => res.data);
};

// Récupérer toutes les demandes (admin)
export const getAdminDemandes = (page = 0, size = 10): Promise<AdminDemandesResponse> => {
  return api.get(`/admin/demandes?page=${page}&size=${size}`).then(res => res.data);
};

// Récupérer les détails d'une demande par ID (admin)
export const getAdminDemandeById = (id: number): Promise<AdminDemande> => {
  return api.get(`/admin/demandes/${id}`).then(res => res.data);
};

// Supprimer une demande (admin)
export const deleteAdminDemande = (id: number): Promise<{ message: string }> => {
  return api.delete(`/admin/demandes/${id}`).then(res => res.data);
};

// ========== Gestion des Clients ==========

// Récupérer tous les clients (admin)
export const getAdminClients = (page = 0, size = 10): Promise<AdminClientsResponse> => {
  return api.get(`/admin/clients?page=${page}&size=${size}`).then(res => res.data);
};

// Récupérer les détails d'un client par ID (admin)
export const getAdminClientById = (id: number): Promise<AdminClient> => {
  return api.get(`/admin/clients/${id}`).then(res => res.data);
};

// Bloquer un client
export const blockClient = (id: number): Promise<{ message: string }> => {
  return api.put(`/admin/clients/${id}/block`).then(res => res.data);
};

// Débloquer un client
export const unblockClient = (id: number): Promise<{ message: string }> => {
  return api.put(`/admin/clients/${id}/unblock`).then(res => res.data);
};

// Supprimer un client
export const deleteClient = (id: number): Promise<{ message: string }> => {
  return api.delete(`/admin/clients/${id}`).then(res => res.data);
};

// ========== Gestion des Artisans ==========

// Récupérer tous les artisans (admin)
export const getAdminArtisans = (page = 0, size = 10): Promise<AdminArtisansResponse> => {
  return api.get(`/admin/artisans?page=${page}&size=${size}`).then(res => res.data);
};

// Récupérer les détails d'un artisan par ID (admin)
export const getAdminArtisanById = (id: number): Promise<AdminArtisan> => {
  return api.get(`/admin/artisans/${id}`).then(res => res.data);
};

// Bloquer un artisan
export const blockArtisan = (id: number): Promise<{ message: string }> => {
  return api.put(`/admin/artisans/${id}/block`).then(res => res.data);
};

// Débloquer un artisan
export const unblockArtisan = (id: number): Promise<{ message: string }> => {
  return api.put(`/admin/artisans/${id}/unblock`).then(res => res.data);
};

// Vérifier/Valider un artisan
export const verifyArtisan = (id: number): Promise<{ message: string }> => {
  return api.put(`/admin/artisans/${id}/verify`).then(res => res.data);
};

// Supprimer un artisan
export const deleteArtisan = (id: number): Promise<{ message: string }> => {
  return api.delete(`/admin/artisans/${id}`).then(res => res.data);
};