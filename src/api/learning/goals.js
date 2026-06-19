import request from "../request";
import { weeklyGoalsMock } from "./goalsMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 300;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getWeeklyGoals() {
  if (useMockApi) {
    return mockResponse(weeklyGoalsMock);
  }

  return request.get("/weeklyGoals");
}

export async function addWeeklyGoal(goal) {
  if (useMockApi) {
    return mockResponse(goal);
  }

  return request.post("/weeklyGoals", goal);
}

export async function deleteWeeklyGoal(id) {
  if (useMockApi) {
    return mockResponse({ id });
  }

  return request.delete(`/weeklyGoals/${id}`);
}
