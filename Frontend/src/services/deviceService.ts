import api from "./api";

export interface DeviceRegistrationPayload {
  token: string;
  platform: "WEB";
}

export async function registerDevice(payload: DeviceRegistrationPayload) {
  const response = await api.post("/api/device/register", payload);
  return response.data;
}
