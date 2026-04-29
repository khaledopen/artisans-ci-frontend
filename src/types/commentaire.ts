// src/types/commentaire.ts

export interface CreateCommentaireData {
  commentaire: string;
  clientId: number;
  artisanId: number;
  note: number;
  photo?: string;
  demandeId?: number;
}

export interface UpdateCommentaireData {
  commentaire: string;
  photo?: string;
}

export interface Commentaire {
  id: number;
  commentaire: string;
  note: number;
  photo?: string;
  client: {
    id: number;
    nom: string;
    prenom: string;
    photoprofil?: string;
  };
  artisan: {
    id: number;
    nom: string;
    prenom: string;
    photoprofil?: string;
  };
  demande?: {
    id: number;
    description_travail: string;
  };
  signale: boolean;
  createdAt: string;
  reponse?: string;
  reponseAt?: string;
}

export interface CommentairesResponse {
  content: Commentaire[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  averageNote: number;
  totalComments: number;
}