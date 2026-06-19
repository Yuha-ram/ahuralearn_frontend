import request from "../request";
import { learningPlanMockData } from "./learningPlanMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 300;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getLearningPlanData() {
  if (useMockApi) {
    return mockResponse(learningPlanMockData);
  }

  return request.get("/learningPlan");
}

export async function createStudyPlan(newPlan) {
  if (useMockApi) {
    return mockResponse(newPlan);
  }

  return request.post("/learningPlan", newPlan);
}

export async function updateStudyPlan(id, updatedPlan) {
  if (useMockApi) {
    return mockResponse({
      id,
      ...updatedPlan,
    });
  }

  return request.put(`/learningPlan/${id}`, updatedPlan);
}

export async function deleteStudyPlan(id) {
  if (useMockApi) {
    return mockResponse({
      success: true,
      id,
    });
  }

  return request.delete(`/learningPlan/${id}`);
}

export async function completeStudyPlan(id) {
  if (useMockApi) {
    return mockResponse({
      success: true,
      id,
    });
  }

  return request.patch(`/learningPlan/${id}/complete`);
}

export async function generateAIStudyPlan(data) {
  if (useMockApi) {
    return mockResponse(data);
  }

  return request.post("/learningPlan/aiSuggest", data);
}
