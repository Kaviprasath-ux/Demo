// Secure Paper Generation System
// SOW Section 8.2: Secure storage/generation of assessment papers with randomization

export type PaperType = "diagnostic" | "formative" | "summative" | "requalification";
export type SecurityLevel = "standard" | "high" | "maximum";

export interface PaperTemplate {
  id: string;
  name: string;
  paperType: PaperType;
  course: string;
  totalMarks: number;
  duration: number; // minutes
  sections: PaperSection[];
  instructions: string[];
  securityLevel: SecurityLevel;
  negativeMarking: boolean;
  negativeMarkingRatio: number; // e.g., 0.25 = -0.25 for wrong answer
  passingPercentage: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  createdBy: string;
  createdAt: number;
  approvedBy?: string;
  approvedAt?: number;
}

export interface PaperSection {
  id: string;
  name: string;
  instructions: string;
  questionCount: number;
  marksPerQuestion: number;
  topics: string[];
  difficulty: ("easy" | "medium" | "hard")[];
  questionType: "mcq" | "true_false" | "numerical" | "subjective" | "mixed";
  isCompulsory: boolean;
}

export interface GeneratedPaper {
  paperId: string;
  templateId: string;
  templateName: string;
  variant: string; // A, B, C, D etc.
  generatedAt: number;
  generatedBy: string;
  securityCode: string;
  watermark: string;
  questions: GeneratedQuestion[];
  totalMarks: number;
  duration: number;
  instructions: string[];
  answerKey: AnswerKey;
  metadata: {
    course: string;
    paperType: PaperType;
    batch?: string;
    examDate?: number;
    venue?: string;
  };
}

export interface GeneratedQuestion {
  questionNumber: number;
  sectionId: string;
  originalQuestionId: string;
  questionText: string;
  questionType: string;
  options?: { id: string; text: string }[];
  marks: number;
  topic: string;
  difficulty: string;
  negativeMarks?: number;
}

export interface AnswerKey {
  paperId: string;
  variant: string;
  answers: {
    questionNumber: number;
    correctAnswer: string;
    explanation?: string;
  }[];
  securityCode: string;
}

// Mock question bank for generation
const mockQuestionBank = [
  // Gun Drill Questions
  {
    id: "q001",
    topic: "Gun Drill",
    difficulty: "easy",
    type: "mcq",
    text: "What is the first step in the loading sequence for a 155mm howitzer?",
    options: [
      { id: "a", text: "Insert projectile" },
      { id: "b", text: "Open breech mechanism" },
      { id: "c", text: "Insert propellant charge" },
      { id: "d", text: "Close breech" },
    ],
    correctAnswer: "b",
    explanation: "The breech must be opened before any ammunition can be loaded.",
  },
  {
    id: "q002",
    topic: "Gun Drill",
    difficulty: "medium",
    type: "mcq",
    text: "During a misfire, what is the minimum wait time before attempting re-fire?",
    options: [
      { id: "a", text: "10 seconds" },
      { id: "b", text: "30 seconds" },
      { id: "c", text: "60 seconds" },
      { id: "d", text: "120 seconds" },
    ],
    correctAnswer: "b",
    explanation: "Standard procedure requires a 30-second wait before re-fire attempt.",
  },
  {
    id: "q003",
    topic: "Gun Drill",
    difficulty: "hard",
    type: "mcq",
    text: "What is the maximum rate of fire for the Dhanush 155mm howitzer in burst mode?",
    options: [
      { id: "a", text: "3 rounds per minute" },
      { id: "b", text: "5 rounds per minute" },
      { id: "c", text: "6 rounds per minute" },
      { id: "d", text: "8 rounds per minute" },
    ],
    correctAnswer: "c",
    explanation: "Dhanush can achieve 6 rounds per minute in burst fire mode.",
  },
  // Ballistics Questions
  {
    id: "q004",
    topic: "Ballistics",
    difficulty: "easy",
    type: "mcq",
    text: "Which factor does NOT affect the trajectory of an artillery shell?",
    options: [
      { id: "a", text: "Wind speed" },
      { id: "b", text: "Barrel color" },
      { id: "c", text: "Air temperature" },
      { id: "d", text: "Muzzle velocity" },
    ],
    correctAnswer: "b",
    explanation: "Barrel color has no effect on ballistics.",
  },
  {
    id: "q005",
    topic: "Ballistics",
    difficulty: "medium",
    type: "mcq",
    text: "At what angle does a projectile achieve maximum range in a vacuum?",
    options: [
      { id: "a", text: "30 degrees" },
      { id: "b", text: "45 degrees" },
      { id: "c", text: "60 degrees" },
      { id: "d", text: "90 degrees" },
    ],
    correctAnswer: "b",
    explanation: "45 degrees provides maximum range in theoretical vacuum conditions.",
  },
  {
    id: "q006",
    topic: "Ballistics",
    difficulty: "hard",
    type: "numerical",
    text: "Calculate the time of flight for a projectile fired at 45° with initial velocity of 800 m/s (ignore air resistance, g=10 m/s²).",
    correctAnswer: "113.1",
    explanation: "T = 2v₀sin(θ)/g = 2×800×0.707/10 = 113.1 seconds",
  },
  // Safety Questions
  {
    id: "q007",
    topic: "Safety",
    difficulty: "easy",
    type: "true_false",
    text: "It is safe to stand in the muzzle arc during loading operations.",
    correctAnswer: "false",
    explanation: "Standing in the muzzle arc is extremely dangerous and prohibited.",
  },
  {
    id: "q008",
    topic: "Safety",
    difficulty: "medium",
    type: "mcq",
    text: "What is the danger area behind a recoiling gun?",
    options: [
      { id: "a", text: "1 meter" },
      { id: "b", text: "3 meters" },
      { id: "c", text: "5 meters" },
      { id: "d", text: "10 meters" },
    ],
    correctAnswer: "c",
    explanation: "5 meters is the standard danger zone for recoil clearance.",
  },
  // Fire Control Questions
  {
    id: "q009",
    topic: "Fire Control",
    difficulty: "medium",
    type: "mcq",
    text: "What does FDC stand for in artillery operations?",
    options: [
      { id: "a", text: "Fire Direction Center" },
      { id: "b", text: "Forward Defense Command" },
      { id: "c", text: "Field Data Computer" },
      { id: "d", text: "Fire Detection Controller" },
    ],
    correctAnswer: "a",
    explanation: "FDC is the Fire Direction Center that computes firing data.",
  },
  {
    id: "q010",
    topic: "Fire Control",
    difficulty: "hard",
    type: "mcq",
    text: "In a fire mission, what does 'FFE' indicate?",
    options: [
      { id: "a", text: "First Fire Engage" },
      { id: "b", text: "Fire For Effect" },
      { id: "c", text: "Forward Fire Element" },
      { id: "d", text: "Full Fire Execution" },
    ],
    correctAnswer: "b",
    explanation: "FFE means Fire For Effect - full engagement after adjustment rounds.",
  },
];

// Generate unique security code
function generateSecurityCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate watermark text
function generateWatermark(course: string, variant: string, date: Date): string {
  return `${course.toUpperCase()} | VARIANT ${variant} | ${date.toISOString().split("T")[0]} | CONFIDENTIAL`;
}

// Shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select questions based on criteria
function selectQuestions(
  section: PaperSection,
  randomize: boolean
): typeof mockQuestionBank {
  let questions = mockQuestionBank.filter(
    (q) =>
      section.topics.includes(q.topic) &&
      section.difficulty.includes(q.difficulty as "easy" | "medium" | "hard") &&
      (section.questionType === "mixed" || section.questionType === q.type)
  );

  if (randomize) {
    questions = shuffleArray(questions);
  }

  return questions.slice(0, section.questionCount);
}

// Generate a paper variant
export function generatePaper(
  template: PaperTemplate,
  variant: string,
  generatedBy: string,
  metadata?: Partial<GeneratedPaper["metadata"]>
): GeneratedPaper {
  const paperId = `paper-${Date.now()}-${variant}`;
  const securityCode = generateSecurityCode();
  const questions: GeneratedQuestion[] = [];
  const answerKeyAnswers: AnswerKey["answers"] = [];
  let questionNumber = 0;

  template.sections.forEach((section) => {
    const selectedQuestions = selectQuestions(section, template.randomizeQuestions);

    selectedQuestions.forEach((q) => {
      questionNumber++;

      let options = q.options;
      if (template.randomizeOptions && options) {
        options = shuffleArray(options);
      }

      questions.push({
        questionNumber,
        sectionId: section.id,
        originalQuestionId: q.id,
        questionText: q.text,
        questionType: q.type,
        options,
        marks: section.marksPerQuestion,
        topic: q.topic,
        difficulty: q.difficulty,
        negativeMarks: template.negativeMarking
          ? section.marksPerQuestion * template.negativeMarkingRatio
          : undefined,
      });

      // Find correct answer (handle shuffled options)
      let correctAnswer = q.correctAnswer;
      if (template.randomizeOptions && options && q.options) {
        const originalCorrectOption = q.options.find((o) => o.id === q.correctAnswer);
        if (originalCorrectOption) {
          const newIndex = options.findIndex((o) => o.text === originalCorrectOption.text);
          if (newIndex !== -1) {
            correctAnswer = options[newIndex].id;
          }
        }
      }

      answerKeyAnswers.push({
        questionNumber,
        correctAnswer,
        explanation: q.explanation,
      });
    });
  });

  return {
    paperId,
    templateId: template.id,
    templateName: template.name,
    variant,
    generatedAt: Date.now(),
    generatedBy,
    securityCode,
    watermark: generateWatermark(template.course, variant, new Date()),
    questions,
    totalMarks: template.totalMarks,
    duration: template.duration,
    instructions: template.instructions,
    answerKey: {
      paperId,
      variant,
      answers: answerKeyAnswers,
      securityCode,
    },
    metadata: {
      course: template.course,
      paperType: template.paperType,
      ...metadata,
    },
  };
}

// Generate multiple variants
export function generatePaperVariants(
  template: PaperTemplate,
  variantCount: number,
  generatedBy: string,
  metadata?: Partial<GeneratedPaper["metadata"]>
): GeneratedPaper[] {
  const variants = "ABCDEFGH".slice(0, variantCount).split("");
  return variants.map((variant) => generatePaper(template, variant, generatedBy, metadata));
}

// Mock templates
export const mockPaperTemplates: PaperTemplate[] = [
  {
    id: "template-001",
    name: "YO Gunnery Mid-Course Assessment",
    paperType: "formative",
    course: "YO Gunnery",
    totalMarks: 100,
    duration: 120,
    passingPercentage: 50,
    negativeMarking: true,
    negativeMarkingRatio: 0.25,
    randomizeQuestions: true,
    randomizeOptions: true,
    securityLevel: "high",
    createdBy: "Lt. Col. Verma",
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    approvedBy: "Col. Sharma",
    approvedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    instructions: [
      "Answer all questions in Section A (Compulsory)",
      "Attempt any 5 questions from Section B",
      "Each correct answer carries marks as indicated",
      "Negative marking of 0.25 marks for wrong answers in MCQ",
      "Use of calculator is permitted for numerical problems",
      "Rough work should be done in the space provided",
    ],
    sections: [
      {
        id: "section-a",
        name: "Section A - Gun Drill & Safety",
        instructions: "Answer all questions. Each question carries 4 marks.",
        questionCount: 10,
        marksPerQuestion: 4,
        topics: ["Gun Drill", "Safety"],
        difficulty: ["easy", "medium"],
        questionType: "mcq",
        isCompulsory: true,
      },
      {
        id: "section-b",
        name: "Section B - Ballistics & Fire Control",
        instructions: "Attempt any 5 questions. Each question carries 6 marks.",
        questionCount: 8,
        marksPerQuestion: 6,
        topics: ["Ballistics", "Fire Control"],
        difficulty: ["medium", "hard"],
        questionType: "mixed",
        isCompulsory: false,
      },
    ],
  },
  {
    id: "template-002",
    name: "JCO Cadre Final Examination",
    paperType: "summative",
    course: "JCO Cadre",
    totalMarks: 150,
    duration: 180,
    passingPercentage: 60,
    negativeMarking: true,
    negativeMarkingRatio: 0.33,
    randomizeQuestions: true,
    randomizeOptions: true,
    securityLevel: "maximum",
    createdBy: "Maj. Kumar",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    approvedBy: "Col. Sharma",
    approvedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    instructions: [
      "This is a closed-book examination",
      "Answer all questions in Part I",
      "Choose any 10 questions from Part II",
      "Negative marking applies: -1/3 mark for wrong MCQ answers",
      "Time management is crucial - allocate time wisely",
      "Electronic devices except approved calculators are prohibited",
    ],
    sections: [
      {
        id: "part-1",
        name: "Part I - Fundamentals",
        instructions: "All questions are compulsory. Each question carries 5 marks.",
        questionCount: 15,
        marksPerQuestion: 5,
        topics: ["Gun Drill", "Safety", "Fire Control"],
        difficulty: ["easy", "medium"],
        questionType: "mcq",
        isCompulsory: true,
      },
      {
        id: "part-2",
        name: "Part II - Advanced Topics",
        instructions: "Attempt any 10 questions. Each question carries 7.5 marks.",
        questionCount: 12,
        marksPerQuestion: 7.5,
        topics: ["Ballistics", "Fire Control"],
        difficulty: ["hard"],
        questionType: "mixed",
        isCompulsory: false,
      },
    ],
  },
  {
    id: "template-003",
    name: "Diagnostic Assessment - Basic Gunnery",
    paperType: "diagnostic",
    course: "YO Gunnery",
    totalMarks: 50,
    duration: 45,
    passingPercentage: 0, // No pass/fail for diagnostic
    negativeMarking: false,
    negativeMarkingRatio: 0,
    randomizeQuestions: false,
    randomizeOptions: false,
    securityLevel: "standard",
    createdBy: "Capt. Singh",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    instructions: [
      "This is a diagnostic test to assess baseline knowledge",
      "Answer all questions honestly - this will not affect your grades",
      "Results will help customize your learning path",
      "No negative marking",
    ],
    sections: [
      {
        id: "all",
        name: "Knowledge Assessment",
        instructions: "Answer all questions to the best of your ability.",
        questionCount: 10,
        marksPerQuestion: 5,
        topics: ["Gun Drill", "Safety", "Ballistics", "Fire Control"],
        difficulty: ["easy", "medium"],
        questionType: "mcq",
        isCompulsory: true,
      },
    ],
  },
];

// Get security level badge color
export function getSecurityLevelColor(level: SecurityLevel): string {
  const colors: Record<SecurityLevel, string> = {
    standard: "bg-gray-500",
    high: "bg-orange-500",
    maximum: "bg-red-500",
  };
  return colors[level];
}

// Get paper type badge color
export function getPaperTypeColor(type: PaperType): string {
  const colors: Record<PaperType, string> = {
    diagnostic: "bg-blue-500",
    formative: "bg-green-500",
    summative: "bg-purple-500",
    requalification: "bg-yellow-500",
  };
  return colors[type];
}
