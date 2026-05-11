// src/types/demande.ts

// ========== CRÉATION D'UNE DEMANDE ==========

// Le client crée une demande (sans artisanId, car l'artisan choisit après)
export interface CreateDemandeData {
  date_rendez_vous: string;   // YYYY-MM-DD
  heure?: string;             // HH:mm:ss (optionnel)
  description_travail: string;
  clientId: number;
  artisanId?: number | null;  // Ajouté pour l'assignation directe
}

// ========== RÉPONSES API ==========

// Réponse pour le client (dashboard client)
export interface DemandeClientResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  heure: string;
  clientId: number;
  clientName: string;
  clientNumero: string;
  artisanId?: number;
  artisanName?: string;
  clientCommune?: string;
  clientTelephone?: string;
  artisanTelephone?: string;
  photoUrl?: string | null;       // URL Cloudinary
  photo_url?: string | null;      // Fallback snake_case
  peutCommenter?: boolean;
  commentaireId?: number;
}

// Réponse pour l'artisan (dashboard artisan)
export interface DemandeArtisanResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  clientId: number;
  clientName: string;
  clientNumero: string;
  clientCommune: string;
  clientTelephone?: string;
  artisanId: number | null;
  artisanName: string | null;
  artisanTelephone?: string;
  photoUrl?: string | null;
  photo_url?: string | null;      // Fallback snake_case
}

// Réponse détaillée (page de détail)
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
  clientNumero?: string;
  clientCommune?: string;
  clientTelephone?: string;
  artisanTelephone?: string;
  artisanId?: number | null;
  artisanName?: string | null;
  photoUrl?: string | null;
  photo_url?: string | null;      // Fallback snake_case
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
    telephone?: string;
    metier: {
      id: number;
      nom: string;
    };
  };
  photo_endommage?: string[];
  createdAt?: string;
}

// ========== RÉPONSES PAGINÉES ==========

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

// ========== MISES À JOUR ==========

export interface UpdateStatutDemandeData {
  statut: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
}

// ========== TYPE POUR L'ACCEPTATION ==========

export interface AccepterDemandeResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "ACCEPTEE";
  heure: string | null;
  clientId: number;
  clientName: string;
  clientCommune: string;
  clientTelephone: string;
  artisanId: number;
  artisanName: string;
  artisanTelephone: string;
}