// src/types/demande.ts

// ========== CRÉATION D'UNE DEMANDE ==========

// 📌 Données pour la création d'une demande (multipart/form-data)
export interface CreateDemandeData {
  date_rendez_vous: string;      // YYYY-MM-DD
  description_travail: string;
  clientId: number;
  artisanId?: number;            // Optionnel, backend assigne automatiquement
}

// ========== RÉPONSES API ==========

// 📌 Réponse de GET /demandes/client/{clientId}
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
  peutCommenter?: boolean;   // ✅ Si la demande est terminée et pas encore commentée
  commentaireId?: number;    // ✅ ID du commentaire si déjà posté
}

// 📌 Réponse de GET /demandes/artisan/{artisanId}
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
  localisation?: string;     // Localisation du client
}

// 📌 Réponse de GET /demandes/{id} (détail complet)
export interface DemandeResponse {
  id: number;
  dateRendezVous?: string;
  date_rendez_vous?: string;
  descriptionTravail?: string;
  description_travail?: string;
  statutDemande?: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";
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
  commentaire?: {            // ✅ Commentaire associé à la demande
    id: number;
    commentaire: string;
    note: number;
    photo?: string;
    createdAt: string;
  };
}

// ========== RÉPONSES PAGINÉES ==========

// 📌 Pour la liste des demandes (paginée)
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

// 📌 Pour la mise à jour du statut
export interface UpdateStatutDemandeData {
  statut: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "TERMINEE";
}