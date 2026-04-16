// src/types/artisan.ts

export interface Artisan {
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
  note?: number;
  avis?: number;
  verified?: boolean;
  description?: string;
  experience?: number;
  pricePerHour?: number;
}

// Pour le filtre
export interface FilterArtisansData {
  metierId?: number | string;
  commune?: string;
}

export interface ArtisansResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Artisan[];
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

export interface UpdateArtisanProfileData {
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
}