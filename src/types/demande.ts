export interface CreateDemandeData {
  date_rendez_vous: string;
  description_travail: string;
  clientId: number;
  artisanId: number;
  commune?: string;
  localisation?: string;
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
  peutCommenter?: boolean;
  commentaireId?: number;
}

export interface DemandeArtisanResponse {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";
  heure: string;
  clientId: number;
  clientName: string;
  clientCommune: string;
  artisanId: number;
  artisanName: string;
}

export interface DemandeResponse {
  id: number;
  dateRendezVous?: string;
  descriptionTravail?: string;
  statutDemande?: string;
  heure?: string;
  clientId?: number;
  clientName?: string;
  clientCommune?: string;
  artisanId?: number;
  artisanName?: string;
  client?: { id: number; nom: string; prenom: string; email: string; localisation: string; photoprofil?: string };
  artisan?: { id: number; nom: string; prenom: string; email: string; localisation: string; photoprofil?: string; commune: string; metier: { id: number; nom: string } };
  photo_endommage?: string[];
  createdAt?: string;
}