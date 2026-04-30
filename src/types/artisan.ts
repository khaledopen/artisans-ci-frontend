// src/types/artisan.ts

export interface Artisan {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  commune: string;
  numero?: string;
  photoprofil?: string;
  metier: {
    id: number;
    nom: string;
  };
  note?: number;
  avis?: number;
  verified?: boolean;
  description?: string;
  experience?: number;
  pricePerHour?: number;
}

export interface ArtisansResponse {
  content: Artisan[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }[];
  };
}

// ✅ L'ID est obligatoire car le backend le lit dans le body
export interface UpdateArtisanProfileData {
  id: number;
  nom?: string;
  prenom?: string;
  localisation?: string;
  commune?: string;
  numero?: string;
  photoprofil?: string;
  metierId?: number;
}

export interface FilterArtisansData {
  metierId?: number | string;
  commune?: string;
}