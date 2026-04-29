// src/api/commentaire.api.ts

import api from "./axios";
import type { CreateCommentaireData, Commentaire, UpdateCommentaireData, CommentairesResponse } from "../types/commentaire";

// Ajouter un commentaire
export const addCommentaire = (data: CreateCommentaireData): Promise<Commentaire> => {
  return api.post("/commentaires", data).then(res => res.data);
};

// Modifier un commentaire
export const updateCommentaire = (id: number, data: UpdateCommentaireData): Promise<Commentaire> => {
  return api.put(`/commentaires/${id}`, data).then(res => res.data);
};

// Récupérer les commentaires d'un artisan
export const getCommentairesByArtisanId = (artisanId: number, page = 0, size = 10): Promise<CommentairesResponse> => {
  return api.get(`/commentaires/artisan/${artisanId}?page=${page}&size=${size}`).then(res => res.data);
};

// Récupérer les commentaires d'une demande
export const getCommentairesByDemandeId = (demandeId: number): Promise<Commentaire[]> => {
  return api.get(`/commentaires/demande/${demandeId}`).then(res => res.data);
};

// ✅ Supprimer un commentaire
export const deleteCommentaire = (id: number): Promise<{ message: string }> => {
  return api.delete(`/commentaires/${id}`).then(res => res.data);
};

// ✅ Signaler un commentaire
export const signalerCommentaire = (id: number): Promise<{ message: string }> => {
  return api.post(`/commentaires/${id}/signaler`).then(res => res.data);
};

// Répondre à un commentaire (artisan)
export const repondreCommentaire = (id: number, reponse: string): Promise<Commentaire> => {
  return api.put(`/commentaires/${id}/reponse`, { reponse }).then(res => res.data);
};