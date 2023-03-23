import { ApiWithoutToken, ApiWithToken } from "../axios-instance";

export const clientService = {
  token: {
    uri: "/api/token/",
    post: async (data: any) =>
      ApiWithoutToken.post(clientService.token.uri, data),
  },
  heartbeat: {
    uri: "/api/heartbeat/",
    get: async () => ApiWithToken.get(clientService.heartbeat.uri),
  },
  meets: {
    uri: "/api/meets/",
    post: async (data: any) => ApiWithToken.post(clientService.meets.uri, data),
    get: async () => ApiWithToken.get(clientService.meets.uri),
    getParticipantsByMeetId: async (meetId: number) =>
      ApiWithToken.get(`${clientService.meets.uri}${meetId}/participants/`),
    delete: async (id: number) =>
      ApiWithToken.delete(`${clientService.meets.uri}${id}/`),
  },
  lifters: {
    uri: "/api/participants/",
    post: async (data: any) =>
      ApiWithToken.post(clientService.lifters.uri, data),
    put: async (data: any, id: number) =>
      ApiWithToken.put(`${clientService.lifters.uri}${id}/`, data),
    delete: async (id: number) =>
      ApiWithToken.delete(`${clientService.lifters.uri}${id}/`),
  },
};
