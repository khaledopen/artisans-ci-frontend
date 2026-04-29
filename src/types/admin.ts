// src/types/admin.ts

// ========== Types généraux ==========

export type StatutDemande = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";

// ========== Demandes ==========

export interface UpdateDemandeStatutData {
  statut: StatutDemande;
}

export interface AdminDemande {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: StatutDemande;
  heure: string;
  clientId: number;
  clientName: string;
  artisanId?: number;
  artisanName?: string;
  createdAt: string;
}

// ========== Clients ==========

export interface AdminClient {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  commune: string;
  photoprofil?: string;
  blocked: boolean;
  createdAt: string;
}

// ========== Artisans ==========

export interface AdminArtisan {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  commune: string;
  photoprofil?: string;
  metier: {
    id: number;
    nom: string;
  };
  verified: boolean;
  blocked: boolean;
  createdAt: string;
}

// ========== Réponses paginées ==========

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type AdminArtisansResponse = PaginatedResponse<AdminArtisan>;
export type AdminClientsResponse = PaginatedResponse<AdminClient>;
export type AdminDemandesResponse = PaginatedResponse<AdminDemande>;