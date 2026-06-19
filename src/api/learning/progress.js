import request from "../request";
import { learningProgressMock } from "./progressMock";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";
const mockDelay = 300;

function mockResponse(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelay);
  });
}

export async function getLearningProgress() {
  if (useMockApi) {
    return mockResponse(learningProgressMock);
  }

  return request.get("/learningProgress");
}
