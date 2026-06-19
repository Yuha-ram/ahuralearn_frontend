import request from "../request";
import { achievementsMock } from "./achievementsMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 500;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getAchievementsData() {
  if (useMockApi) {
    return mockResponse(achievementsMock);
  }

  return request.get("/achievements");
}
