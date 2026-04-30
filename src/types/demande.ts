// src/types/demande.ts

// ========== CRÉATION D'UNE DEMANDE ==========

export interface CreateDemandeData {
  date_rendez_vous: string;      // YYYY-MM-DD
  description_travail: string;
  clientId: number;
  artisanId: number;              // ID de l'artisan sélectionné
  commune?: string;               // Commune du client
  localisation?: string;          // Ville du client
  telephone?: string;             // Téléphone du client
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
  artisanId?: number;
  artisanName?: string;
  clientCommune?: string;
  clientTelephone?: string;       // Masqué tant que non acceptée (alias clientNumero)
  artisanTelephone?: string;      // Masqué tant que non acceptée (alias artisanNumero)
  peutCommenter?: boolean;        // Si la demande est terminée et non commentée
  commentaireId?: number;         // ID du commentaire si déjà laissé
}

// Réponse pour l'artisan (dashboard artisan)
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
  clientTelephone?: string;       // Masqué tant que non acceptée
  artisanId: number;
  artisanName: string;
  artisanTelephone?: string;      // Masqué tant que non acceptée
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
  clientCommune?: string;
  clientTelephone?: string;
  artisanTelephone?: string;
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