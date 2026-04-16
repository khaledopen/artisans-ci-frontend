// src/types/demande.ts

export interface CreateDemandeData {
  date_rendez_vous: string;
  heure: string;
  description_travail: string;
  photo_endommage?: string[];
  photo_content_type?: string;
  statut_demande?: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";
  client: {
    id: number;
  };
}

// Réponse de GET /demandes/client/{clientId}
export interface DemandeClientResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";
  heure: string;
  clientId: number;
  clientName: string;
  artisanId?: number;
  artisanName?: string;
}

// ✅ Réponse de GET /demandes/artisan/{artisanId}
export interface DemandeArtisanResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";
  heure: string;
  clientId: number;
  clientName: string;
  artisanId: number;
  artisanName: string;
}

// Réponse de GET /demandes/{id}
export interface DemandeResponse {
  id: number;
  dateRendezVous?: string;
  date_rendez_vous?: string;
  descriptionTravail?: string;
  description_travail?: string;
  statutDemande?: string;
  statut_demande?: string;
  heure?: string;
  clientId?: number;
  clientName?: string;
  artisanId?: number;
  artisanName?: string;
  client?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    localisation: string;
    photoprofil?: string;
  };
  artisan?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    localisation: string;
    photoprofil?: string;
    commune: string;
    metier: {
      id: number;
      nom: string;
    };
  };
  photo_endommage?: string[];
  photos?: string[];
}

// Pour la liste des demandes (paginée)
export interface DemandesResponse {
  content: DemandeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}