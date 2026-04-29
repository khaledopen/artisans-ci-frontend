export type StatutDemande = "EN_ATTENTE" | "ACCEPTEE" | "EN_COURS" | "TERMINEE" | "REFUSEE";

export interface AdminDemande {
  id: number;
  dateRendezVous: string;
  descriptionTravail: string;
  statutDemande: StatutDemande;
  heure: string | null;
  clientId: number;
  clientName: string;
  clientCommune?: string;
  artisanId?: number | null;
  artisanName?: string | null;
  createdAt?: string;
}

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

export interface AdminArtisan {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  commune: string;
  photoprofil?: string;
  metier: { id: number; nom: string };
  verified: boolean;
  blocked: boolean;
  createdAt: string;
}

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