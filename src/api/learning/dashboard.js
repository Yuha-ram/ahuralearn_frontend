import request from "../request";
import { dashboardMock } from "./dashboardMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 300;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getDashboardData() {
  if (useMockApi) {
    return mockResponse(dashboardMock);
  }

  return request.get("/dashboard");
}
