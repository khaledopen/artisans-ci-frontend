// src/types/client.ts

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  commune: string;
  numero?: string;
  photoprofil?: string;
  demandes?: any[];
  commentaires?: any[];
}

export interface ClientsResponse {
  content: Client[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ✅ L'ID est obligatoire car le backend le lit dans le body
export interface UpdateClientProfileData {
  id: number;
  nom?: string;
  prenom?: string;
  localisation?: string;
  commune?: string;
  numero?: string;
  photoprofil?: string;
}