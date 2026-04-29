// src/types/demande.ts

export interface CreateDemandeData {
  date_rendez_vous: string;
  description_travail: string;
  clientId: number;
  artisanId: number;
  commune?: string;
  localisation?: string;
  telephone?: string;
}

export interface DemandeClientResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  heure: string;
  clientId: number;
  clientName: string;
  artisanId?: number;
  artisanName?: string;
  clientCommune?: string;
  clientNumero?: string;
  artisanNumero?: string;
  peutCommenter?: boolean;
  commentaireId?: number;
}

export interface DemandeArtisanResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  heure: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  clientId: number;
  clientName: string;
  clientCommune: string;
  clientNumero?: string;
  artisanId: number;
  artisanName: string;
  artisanNumero?: string;
}

export interface DemandeResponse {
  id: number;
  dateRendezVous?: string;
  date_rendez_vous?: string;
  descriptionTravail?: string;
  description_travail?: string;
  statutDemande?: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  statut_demande?: string;
  heure?: string;
  clientId?: number;
  clientName?: string;
  clientCommune?: string;
  clientNumero?: string;
  artisanNumero?: string;
  artisanId?: number;
  artisanName?: string;
  client?: { 
    id: number; 
    nom: string; 
    prenom: string; 
    email: string; 
    localisation: string; 
    photoprofil?: string;
    telephone?: string;
  };
  artisan?: { 
    id: number; 
    nom: string; 
    prenom: string; 
    email: string; 
    localisation: string; 
    photoprofil?: string; 
    commune: string; 
    metier: { id: number; nom: string };
    telephone?: string;
  };
  photo_endommage?: string[];
  createdAt?: string;
}

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

export interface UpdateStatutDemandeData {
  statut: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
}