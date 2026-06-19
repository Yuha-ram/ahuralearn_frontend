import request from "../request";
import { notificationsMock } from "./notificationsMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 300;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getNotificationsData() {
  if (useMockApi) {
    return mockResponse(notificationsMock);
  }

  return request.get("/notifications");
}

export async function acknowledgeNotification(planId) {
  if (useMockApi) {
    return mockResponse({ id: planId });
  }

  return request.patch(`/notifications/${planId}/acknowledge`);
}

export async function deleteNotification(planId) {
  if (useMockApi) {
    return mockResponse({ id: planId });
  }

  return request.delete(`/notifications/${planId}`);
}
