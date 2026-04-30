// src/api/client.api.ts

import api from "./axios";
import type { Client, ClientsResponse, UpdateClientProfileData } from "../types/client";

// ========== LISTE ET DÉTAIL ==========

export const getClients = (page = 0, size = 10): Promise<ClientsResponse> => {
  return api.get(`/clients?page=${page}&size=${size}`).then(res => res.data);
};

export const getClientById = (id: number): Promise<Client> => {
  return api.get(`/clients/${id}`).then(res => res.data);
};

// ========== PROFIL CLIENT ==========

// ✅ Mettre à jour le profil client (ID dans le body, pas dans l'URL)
export const updateClientProfile = (data: UpdateClientProfileData): Promise<Client> => {
  return api.put("/clients/profile", data).then(res => res.data);
};