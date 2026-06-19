import request from "../request";

const useMockApi =
  import.meta.env.VITE_USE_MOCK_API !== "false";

const createReport = ({
  score,
  level,
  description,
  message,
  errors,
  knowledgeGap,
  keyword,
  topic,
  text,
}) => ({
  proficiency: {
    score,
    level,
    description,
    message,
  },

  errors,

  knowledgeGap,

  aiSuggestion: {
    title: "AI Personalized Suggestions",
    keyword,
    topic,
    text,
    buttonText: "Check Learning Plan",
  },
});

const mockReportByCourseId = {
  1: createReport({
    score: 84,
    level: "Advanced",
    description:
      "You are in the top 15% of your cohort.",
    message: "Great progress!",
    errors: [
      {
        type: "Conceptual Misunderstanding",
        value: 50,
      },
      {
        type: "Calculation Errors",
        value: 15,
      },
      {
        type: "Application Errors",
        value: 35,
      },
    ],
    knowledgeGap: [
      {
        label: "Quantum",
        value: 60,
      },
      {
        label: "Calculus",
        value: 75,
      },
      {
        label: "Linear",
        value: 70,
      },
      {
        label: "Wave",
        value: 55,
      },
      {
        label: "Statistics",
        value: 65,
      },
      {
        label: "Logic",
        value: 80,
      },
    ],
    keyword: "Conceptual Misunderstandings",
    topic: "Wave Functions",
    text: "Review the core concepts and complete targeted practice exercises.",
  }),

  2: createReport({
    score: 76,
    level: "Intermediate",
    description:
      "You have a solid foundation but need more practice.",
    message: "Keep improving!",
    errors: [
      {
        type: "Formula Misuse",
        value: 35,
      },
      {
        type: "Concept Confusion",
        value: 40,
      },
      {
        type: "Careless Mistakes",
        value: 25,
      },
    ],
    knowledgeGap: [
      {
        label: "Quantum",
        value: 68,
      },
      {
        label: "Calculus",
        value: 58,
      },
      {
        label: "Linear",
        value: 62,
      },
      {
        label: "Wave",
        value: 70,
      },
      {
        label: "Statistics",
        value: 50,
      },
      {
        label: "Logic",
        value: 66,
      },
    ],
    keyword: "Concept Confusion",
    topic: "Quantum States",
    text: "Focus on the relationship between wave functions, quantum states, and probability interpretation.",
  }),

  3: createReport({
    score: 72,
    level: "Intermediate",
    description:
      "You understand the basics but struggle with advanced operations.",
    message: "Practice matrix transformation problems.",
    errors: [
      {
        type: "Matrix Operation Errors",
        value: 45,
      },
      {
        type: "Vector Space Confusion",
        value: 30,
      },
      {
        type: "Calculation Errors",
        value: 25,
      },
    ],
    knowledgeGap: [
      {
        label: "Matrix",
        value: 60,
      },
      {
        label: "Vector",
        value: 55,
      },
      {
        label: "Eigen",
        value: 50,
      },
      {
        label: "Linear",
        value: 72,
      },
      {
        label: "Proof",
        value: 48,
      },
      {
        label: "Application",
        value: 58,
      },
    ],
    keyword: "Matrix Operation Errors",
    topic: "Matrix Multiplication",
    text: "Review matrix multiplication rules and practise transformation-based questions.",
  }),

  4: createReport({
    score: 88,
    level: "Advanced",
    description:
      "You performed strongly in algorithmic thinking.",
    message: "Excellent work!",
    errors: [
      {
        type: "Complexity Analysis",
        value: 30,
      },
      {
        type: "Implementation Mistakes",
        value: 25,
      },
      {
        type: "Data Structure Selection",
        value: 45,
      },
    ],
    knowledgeGap: [
      {
        label: "Array",
        value: 86,
      },
      {
        label: "Tree",
        value: 78,
      },
      {
        label: "Graph",
        value: 70,
      },
      {
        label: "Hash",
        value: 82,
      },
      {
        label: "Sorting",
        value: 76,
      },
      {
        label: "Complexity",
        value: 64,
      },
    ],
    keyword: "Data Structure Selection",
    topic: "Trees and Graphs",
    text: "Compare when to use arrays, trees, graphs, and hash maps in practical scenarios.",
  }),

  5: createReport({
    score: 69,
    level: "Developing",
    description:
      "You need more revision on core calculus concepts.",
    message:
      "Review fundamentals before moving forward.",
    errors: [
      {
        type: "Derivative Rules",
        value: 40,
      },
      {
        type: "Integration Errors",
        value: 35,
      },
      {
        type: "Application Problems",
        value: 25,
      },
    ],
    knowledgeGap: [
      {
        label: "Limits",
        value: 58,
      },
      {
        label: "Derivative",
        value: 52,
      },
      {
        label: "Integral",
        value: 48,
      },
      {
        label: "Series",
        value: 45,
      },
      {
        label: "Application",
        value: 50,
      },
      {
        label: "Graph",
        value: 56,
      },
    ],
    keyword: "Derivative Rules",
    topic: "Differentiation",
    text: "Review derivative rules, chain rule, and related rate applications.",
  }),
};

// ===============================
// Report Detail
// 真实 API 路径：GET /api/v1/report?courseId=xxx
// ===============================

export const getReportData = async (courseId) => {
  if (useMockApi) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedCourseId =
          Number(courseId) || 1;

        resolve(
          mockReportByCourseId[normalizedCourseId] ||
            mockReportByCourseId[1]
        );
      }, 500);
    });
  }

  const response = await request.get(
    `/api/v1/report?courseId=${courseId}`
  );

  return response.data;
};