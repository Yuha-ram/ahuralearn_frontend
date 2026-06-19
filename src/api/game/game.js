import request from "../request";

const useMockApi =
  import.meta.env.VITE_USE_MOCK_API !== "false";

// ===============================
// Game List
// ===============================

export const games = [
  {
    id: "code-firewall",
    title: "Code Firewall",
    icon: "🔥",
    description:
      "Move the firewall to catch clean code and avoid buggy code.",
  },
  {
    id: "concept-sorter",
    title: "Knowledge Defense",
    icon: "🛡️",
    description:
      "Defend the knowledge base by classifying moving concepts.",
  },
  {
    id: "mini-pacman",
    title: "Mini Pacman",
    icon: "👾",
    description:
      "Collect data orbs while escaping enemies.",
  },
  {
    id: "memory-matrix",
    title: "Mini Tetris",
    icon: "🧩",
    description:
      "Clear rows by arranging falling blocks.",
  },
];

export const getGames = async (courseId) => {
  if (useMockApi) {
    return Promise.resolve(games);
  }

  const response = await request.get(
    `/api/v1/courses/${courseId}/games`
  );

  return response.data;
};

// ===============================
// Game Instructions
// ===============================

const instructions = {
  "code-firewall": {
    controls: "Arrow Left / Arrow Right / A / D",
    goal: "Catch valid syntax tokens and avoid invalid syntax tokens.",
    tips: "Short syntax symbols are easier to scan. Keep your combo for higher scores.",
  },
  "concept-sorter": {
    controls: "Keyboard 1–6 / Mouse Click",
    goal: "Select the correct category before the concept reaches the knowledge base.",
    tips: "Hard mode makes concepts move faster and allows fewer mistakes.",
  },
  "mini-pacman": {
    controls: "WASD / Arrow Keys",
    goal: "Collect data orbs while escaping enemies.",
    tips: "Higher difficulty adds more enemies and shorter time.",
  },
  "memory-matrix": {
    controls: "Arrow Keys",
    goal: "Clear lines and survive as long as possible.",
    tips: "Higher difficulty makes blocks fall faster.",
  },
};

export const getGameInstruction = async (
  courseId,
  gameId
) => {
  if (useMockApi) {
    return Promise.resolve(
      instructions[gameId] || {
        controls: "Mouse / Keyboard",
        goal: "Complete the training task.",
        tips: "Stay focused.",
      }
    );
  }

  const response = await request.get(
    `/api/v1/courses/${courseId}/games/${gameId}/instruction`
  );

  return response.data;
};

// ===============================
// Challenge Questions
// ===============================

const challengeQuestions = {
  "code-firewall": [
    {
      id: 1,
      question:
        "What should the player avoid in Syntax Shield?",
      options: [
        "Invalid syntax tokens",
        "Valid syntax tokens",
        "The shield",
      ],
      answer: "Invalid syntax tokens",
      explanation:
        "Invalid syntax tokens create a breach and reduce the score.",
    },
  ],

  "concept-sorter": [
    {
      id: 1,
      question:
        "What is the objective of Knowledge Defense?",
      options: [
        "Classify concepts before they reach the base",
        "Avoid all questions",
        "Click random categories",
      ],
      answer:
        "Classify concepts before they reach the base",
      explanation:
        "The player protects the knowledge base by selecting the correct category.",
    },
  ],

  "mini-pacman": [
    {
      id: 1,
      question:
        "What is the objective of Mini Pacman?",
      options: [
        "Collect data orbs",
        "Touch enemies",
        "Stay still",
      ],
      answer: "Collect data orbs",
      explanation:
        "The player gains points by collecting data orbs.",
    },
  ],

  "memory-matrix": [
    {
      id: 1,
      question:
        "How do you clear a row in Mini Tetris?",
      options: [
        "Fill the row",
        "Rotate all blocks",
        "Move blocks upward",
      ],
      answer: "Fill the row",
      explanation:
        "A row clears when all cells in the row are filled.",
    },
  ],
};

export const getChallengeQuestions = async (
  courseId,
  gameId
) => {
  if (useMockApi) {
    return Promise.resolve(
      challengeQuestions[gameId] || []
    );
  }

  const response = await request.get(
    `/api/v1/courses/${courseId}/games/${gameId}/challenge-questions`
  );

  return response.data;
};

// ===============================
// Syntax Shield Items
// ===============================

const syntaxShieldItems = [
  {
    text: "===",
    type: "safe",
  },
  {
    text: "const",
    type: "safe",
  },
  {
    text: "return",
    type: "safe",
  },
  {
    text: ".map()",
    type: "safe",
  },
  {
    text: "?.",
    type: "safe",
  },
  {
    text: "=>",
    type: "safe",
  },

  {
    text: "=",
    type: "bug",
  },
  {
    text: "conset",
    type: "bug",
  },
  {
    text: "retun",
    type: "bug",
  },
  {
    text: ".map",
    type: "bug",
  },
  {
    text: "??",
    type: "bug",
  },
  {
    text: "= >",
    type: "bug",
  },
];

export const getSyntaxShieldItems = async (
  courseId
) => {
  if (useMockApi) {
    return Promise.resolve(syntaxShieldItems);
  }

  const response = await request.get(
    `/api/v1/courses/${courseId}/games/code-firewall/syntax-items`
  );

  return response.data;
};

// ===============================
// Knowledge Defense
// ===============================

const knowledgeDefenseQuestions = [
  {
    concept: "Binary Tree",
    correctCategory: "Data Structures",
  },
  {
    concept: "Derivative",
    correctCategory: "Calculus",
  },
  {
    concept: "Wave Function",
    correctCategory: "Quantum Mechanics",
  },
  {
    concept: "Recursion",
    correctCategory: "Programming",
  },
];

const knowledgeDefenseConfig = {
  categories: [
    "Programming",
    "Calculus",
    "Statistics",
    "Data Structures",
    "Quantum Mechanics",
    "Linear Algebra",
  ],
  difficultyConfig: {
    Easy: {
      time: 45,
      speed: 4,
      baseScore: 100,
      penalty: 40,
      maxMistakes: 5,
    },
    Medium: {
      time: 35,
      speed: 6,
      baseScore: 130,
      penalty: 70,
      maxMistakes: 4,
    },
    Hard: {
      time: 25,
      speed: 8,
      baseScore: 180,
      penalty: 100,
      maxMistakes: 3,
    },
  },
};

export const getKnowledgeDefenseQuestions =
  async (courseId) => {
    if (useMockApi) {
      return Promise.resolve(
        knowledgeDefenseQuestions
      );
    }

    const response = await request.get(
      `/api/v1/courses/${courseId}/games/concept-sorter/questions`
    );

    return response.data;
  };

export const getKnowledgeDefenseConfig =
  async (courseId) => {
    if (useMockApi) {
      return Promise.resolve(
        knowledgeDefenseConfig
      );
    }

    const response = await request.get(
      `/api/v1/courses/${courseId}/games/concept-sorter/config`
    );

    return response.data;
  };

// ===============================
// Submit Game Result
// ===============================

export const submitGameResult = async (
  gameResult
) => {
  if (useMockApi) {
    return Promise.resolve({
      success: true,
      data: gameResult,
    });
  }

  const response = await request.post(
    `/api/v1/courses/${gameResult.courseId}/games/result`,
    gameResult
  );

  return response.data;
};