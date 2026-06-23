import api from "./api";

export interface AlertPayload {
  pair: string;
  targetPrice: number;
  condition: string;
}

export interface AlertRecord {
  id: string;
  userId?: string;
  pair: string;
  targetPrice: number;
  condition: string;
  status?: string;
  triggered?: boolean;
  createdAt?: string;
}

export async function createAlert(payload: AlertPayload) {
  const response = await api.post<AlertRecord>("/api/alerts", payload);
  return response.data;
}

export async function getAlerts() {
  const response = await api.get<AlertRecord[]>('/api/alerts');
  return response.data;
}

export async function deleteAlert(id: string) {
  await api.delete(`/api/alerts/${id}`);
}

export async function pauseAlert(id: string) {
  await api.patch(`/api/alerts/${id}/pause`);
}

export async function resumeAlert(id: string) {
  await api.patch(`/api/alerts/${id}/resume`);
}
