// Mock AI Responses - Fallback when Ollama is unavailable

import {
  GeneratedQuestion,
  KnowledgeSearchResult,
  ContentAnalysisResult,
  QuestionGenerationRequest,
  KnowledgeSearchRequest,
  ContentAnalysisRequest,
} from "./types";

// Mock question generation
export function generateMockQuestions(request: QuestionGenerationRequest): GeneratedQuestion[] {
  const { category, difficulty, count, weaponSystem } = request;

  const questionBank: Record<string, GeneratedQuestion[]> = {
    "gunnery-theory": [
      {
        type: "mcq",
        question: "What is the standard muzzle velocity of the 155mm Dhanush howitzer?",
        options: ["700 m/s", "827 m/s", "900 m/s", "750 m/s"],
        correctAnswer: "827 m/s",
        explanation: "The Dhanush 155mm/45 caliber howitzer has a standard muzzle velocity of 827 m/s with standard charges.",
        difficulty: "intermediate",
        topic: "Gunnery Theory",
        weaponSystem: "155mm Dhanush",
      },
      {
        type: "mcq",
        question: "The maximum range of 155mm Bofors FH-77B with base bleed ammunition is:",
        options: ["24 km", "30 km", "39 km", "45 km"],
        correctAnswer: "39 km",
        explanation: "With base bleed extended range ammunition, the Bofors can achieve approximately 39 km range.",
        difficulty: "intermediate",
        topic: "Gunnery Theory",
        weaponSystem: "155mm Bofors",
      },
      {
        type: "true-false",
        question: "In artillery fire, dead ground refers to areas that cannot be reached by flat trajectory fire.",
        correctAnswer: "true",
        explanation: "Dead ground is terrain that is shielded from direct observation or flat trajectory fire due to intervening obstacles.",
        difficulty: "basic",
        topic: "Gunnery Theory",
      },
    ],
    "safety-procedures": [
      {
        type: "mcq",
        question: "What is the minimum safe distance for personnel from the muzzle during firing?",
        options: ["5 meters", "10 meters", "15 meters", "20 meters"],
        correctAnswer: "15 meters",
        explanation: "Personnel must maintain minimum 15 meters from muzzle to avoid blast effects and hearing damage.",
        difficulty: "basic",
        topic: "Safety Procedures",
      },
      {
        type: "mcq",
        question: "If a misfire occurs, the minimum wait time before opening the breech is:",
        options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
        correctAnswer: "2 minutes",
        explanation: "A mandatory 2-minute wait is required to ensure a hangfire does not occur before handling the round.",
        difficulty: "intermediate",
        topic: "Safety Procedures",
      },
      {
        type: "fill-blank",
        question: "The safety zone behind the gun during firing extends to ___ meters.",
        correctAnswer: "50",
        explanation: "The danger zone behind the gun extends 50 meters due to recoil and potential debris.",
        difficulty: "basic",
        topic: "Safety Procedures",
      },
    ],
    "gun-drill": [
      {
        type: "mcq",
        question: "In the crew drill, who is responsible for setting the quadrant elevation?",
        options: ["No. 1 (Gun Commander)", "No. 2 (Breech Operator)", "No. 3 (Layer)", "No. 4 (Loader)"],
        correctAnswer: "No. 3 (Layer)",
        explanation: "The Layer (No. 3) is responsible for setting and maintaining the correct elevation and bearing.",
        difficulty: "basic",
        topic: "Gun Drill",
      },
      {
        type: "numerical",
        question: "A well-trained crew can achieve a sustained rate of fire of ___ rounds per minute with the 155mm Dhanush.",
        correctAnswer: "3",
        explanation: "The sustained rate of fire for Dhanush is 3 rounds per minute with a trained crew.",
        difficulty: "intermediate",
        topic: "Gun Drill",
        weaponSystem: "155mm Dhanush",
      },
    ],
    "tactical-employment": [
      {
        type: "short-answer",
        question: "Explain the concept of 'Time on Target' (TOT) in artillery operations.",
        correctAnswer: "Time on Target is a method of coordinating fire from multiple batteries to ensure all rounds impact the target area simultaneously, maximizing surprise and effectiveness.",
        explanation: "TOT requires precise calculation of flight times and coordinated firing commands.",
        difficulty: "advanced",
        topic: "Tactical Employment",
        rubric: {
          criteria: [
            {
              name: "Definition Accuracy",
              description: "Correct definition of TOT concept",
              maxPoints: 3,
              levels: [
                { score: 3, description: "Complete and accurate definition" },
                { score: 2, description: "Mostly correct with minor omissions" },
                { score: 1, description: "Partial understanding shown" },
                { score: 0, description: "Incorrect or missing" },
              ],
            },
            {
              name: "Tactical Understanding",
              description: "Understanding of tactical purpose",
              maxPoints: 2,
              levels: [
                { score: 2, description: "Clear understanding of purpose (surprise, effectiveness)" },
                { score: 1, description: "Partial understanding" },
                { score: 0, description: "No understanding shown" },
              ],
            },
          ],
          maxScore: 5,
        },
      },
      {
        type: "essay",
        question: "Describe the considerations for positioning a field artillery battery in a defensive operation.",
        correctAnswer: "Key considerations include: fields of fire, cover and concealment, mutual support, ammunition supply routes, alternate positions, and counter-battery protection.",
        difficulty: "advanced",
        topic: "Tactical Employment",
        rubric: {
          criteria: [
            {
              name: "Fields of Fire",
              description: "Consideration of observation and firing arcs",
              maxPoints: 3,
              levels: [
                { score: 3, description: "Comprehensive coverage of fire considerations" },
                { score: 2, description: "Good coverage with minor gaps" },
                { score: 1, description: "Basic mention only" },
                { score: 0, description: "Not addressed" },
              ],
            },
            {
              name: "Survivability",
              description: "Protection and concealment factors",
              maxPoints: 3,
              levels: [
                { score: 3, description: "Thorough survivability analysis" },
                { score: 2, description: "Good coverage" },
                { score: 1, description: "Minimal coverage" },
                { score: 0, description: "Not addressed" },
              ],
            },
            {
              name: "Logistics",
              description: "Supply and support considerations",
              maxPoints: 2,
              levels: [
                { score: 2, description: "Clear logistics planning" },
                { score: 1, description: "Some mention" },
                { score: 0, description: "Not addressed" },
              ],
            },
            {
              name: "Doctrine Adherence",
              description: "Alignment with artillery doctrine",
              maxPoints: 2,
              levels: [
                { score: 2, description: "Strong doctrinal foundation" },
                { score: 1, description: "Some doctrinal awareness" },
                { score: 0, description: "No doctrinal basis" },
              ],
            },
          ],
          maxScore: 10,
        },
      },
    ],
  };

  // Get questions from bank or generate generic ones
  const categoryQuestions = questionBank[category] || questionBank["gunnery-theory"];

  // Filter by difficulty and weapon system
  let filtered = categoryQuestions.filter(q => {
    const difficultyMatch = q.difficulty === difficulty || difficulty === "intermediate";
    const weaponMatch = !weaponSystem || !q.weaponSystem || q.weaponSystem.includes(weaponSystem);
    return difficultyMatch && weaponMatch;
  });

  // If not enough questions, use all from category
  if (filtered.length < count) {
    filtered = categoryQuestions;
  }

  // Return requested count
  return filtered.slice(0, count);
}

// Mock knowledge search
export function searchMockKnowledge(request: KnowledgeSearchRequest): KnowledgeSearchResult {
  const { query } = request;
  const queryLower = query.toLowerCase();

  // Knowledge base entries
  const knowledgeBase: Array<{ keywords: string[]; result: KnowledgeSearchResult }> = [
    {
      keywords: ["muzzle velocity", "dhanush", "155mm"],
      result: {
        answer: "The 155mm Dhanush howitzer has a muzzle velocity of 827 m/s with standard propellant charges. This enables a maximum range of approximately 38 km with base bleed ammunition and 30 km with standard HE rounds.",
        confidence: 0.95,
        sources: [
          { title: "Dhanush Technical Manual", section: "3.2 Ballistic Data", relevance: 0.98 },
          { title: "Artillery Firing Tables", section: "155mm Systems", relevance: 0.85 },
        ],
        relatedTopics: ["Ballistic trajectory", "Range tables", "Propellant charges"],
      },
    },
    {
      keywords: ["crew", "positions", "duties", "roles"],
      result: {
        answer: "A standard artillery gun crew consists of: No.1 (Gun Commander) - overall command and safety; No.2 (Breech Operator) - breech operation and firing; No.3 (Layer) - elevation and traverse; No.4 (Loader) - ammunition handling and loading; No.5 (Ammunition Handler) - fuse setting and preparation; No.6 (Driver/Radio Operator) - vehicle operation and communications.",
        confidence: 0.92,
        sources: [
          { title: "Gun Drill Manual", section: "2.1 Crew Organization", relevance: 0.95 },
          { title: "Artillery SOP", section: "Crew Duties", relevance: 0.88 },
        ],
        relatedTopics: ["Gun drill", "Command structure", "Safety procedures"],
      },
    },
    {
      keywords: ["safety", "misfire", "hangfire"],
      result: {
        answer: "In case of a misfire: 1) Call 'MISFIRE' loudly; 2) Wait minimum 2 minutes before opening breech; 3) Check firing mechanism and primer; 4) If round still fails to fire, treat as dud and follow disposal procedures. Never look into the bore of a misfired gun. All personnel maintain safety positions during wait period.",
        confidence: 0.98,
        sources: [
          { title: "Safety Manual", section: "4.3 Misfire Procedures", relevance: 0.99 },
          { title: "Emergency Procedures SOP", relevance: 0.92 },
        ],
        relatedTopics: ["Emergency procedures", "Dud handling", "Crew safety"],
      },
    },
    {
      keywords: ["range", "bofors", "maximum"],
      result: {
        answer: "The 155mm Bofors FH-77B has the following ranges: Standard HE round - 24 km; Extended range (base bleed) - 30 km; Rocket assisted projectile - 39 km. Rate of fire is 3 rounds in 8 seconds (burst) or 6 rounds per minute (sustained).",
        confidence: 0.94,
        sources: [
          { title: "Bofors Technical Manual", section: "Performance Data", relevance: 0.96 },
          { title: "Firing Tables FT 155-AM-1", relevance: 0.89 },
        ],
        relatedTopics: ["Ammunition types", "Firing tables", "Ballistics"],
      },
    },
    {
      keywords: ["k9", "vajra", "self-propelled"],
      result: {
        answer: "The K9 Vajra is a 155mm/52 caliber self-propelled howitzer with: Maximum range of 40+ km with base bleed; Burst rate of 6 rounds/minute; Maximum speed of 67 km/h; Crew of 5; Automatic ammunition handling system; Digital fire control. It features NBC protection and can fire in all weather conditions.",
        confidence: 0.93,
        sources: [
          { title: "K9 Vajra Operations Manual", relevance: 0.97 },
          { title: "Self-Propelled Artillery Guide", relevance: 0.85 },
        ],
        relatedTopics: ["Self-propelled artillery", "Digital fire control", "Shoot and scoot"],
      },
    },
  ];

  // Find best matching entry
  for (const entry of knowledgeBase) {
    const matchCount = entry.keywords.filter(kw => queryLower.includes(kw)).length;
    if (matchCount >= 1) {
      return entry.result;
    }
  }

  // Default response
  return {
    answer: "I found relevant information about artillery systems. For detailed technical specifications, please refer to the appropriate technical manual. Key topics include gunnery procedures, safety protocols, and tactical employment principles as per Indian Army artillery doctrine.",
    confidence: 0.6,
    sources: [
      { title: "Artillery Doctrine Manual", relevance: 0.7 },
      { title: "General Gunnery Reference", relevance: 0.5 },
    ],
    relatedTopics: ["Gunnery basics", "Safety procedures", "Gun drill"],
  };
}

// Mock content analysis
export function analyzeMockContent(request: ContentAnalysisRequest): ContentAnalysisResult {
  const { content, analysisType } = request;
  const contentLower = content.toLowerCase();

  switch (analysisType) {
    case "extract-topics":
      return {
        topics: extractTopicsFromContent(contentLower),
      };

    case "generate-summary":
      return {
        summary: `This content discusses artillery-related topics including ${extractTopicsFromContent(contentLower).slice(0, 3).join(", ")}. Key points cover operational procedures and technical specifications relevant to field artillery training.`,
      };

    case "identify-concepts":
      return {
        concepts: [
          "Artillery fire control",
          "Ballistic calculations",
          "Crew coordination",
          "Safety procedures",
          "Tactical deployment",
        ].filter(() => Math.random() > 0.4),
      };

    case "tag-content":
      return {
        tags: generateContentTags(contentLower),
      };

    default:
      return {};
  }
}

function extractTopicsFromContent(content: string): string[] {
  const topicKeywords: Record<string, string> = {
    "fire": "Fire Control",
    "gunnery": "Gunnery Theory",
    "safety": "Safety Procedures",
    "drill": "Gun Drill",
    "tactical": "Tactical Employment",
    "ammunition": "Ammunition Handling",
    "survey": "Survey & Positioning",
    "maintenance": "Equipment Maintenance",
  };

  const found: string[] = [];
  for (const [keyword, topic] of Object.entries(topicKeywords)) {
    if (content.includes(keyword)) {
      found.push(topic);
    }
  }

  return found.length > 0 ? found : ["General Artillery Training"];
}

function generateContentTags(content: string): ContentAnalysisResult["tags"] {
  const tags: ContentAnalysisResult["tags"] = [];

  // Weapon system detection
  const weaponSystems: Record<string, string> = {
    "dhanush": "155mm Dhanush",
    "bofors": "155mm Bofors",
    "k9": "K9 Vajra",
    "vajra": "K9 Vajra",
    "atags": "ATAGS",
    "pinaka": "Pinaka MBRL",
  };

  for (const [keyword, system] of Object.entries(weaponSystems)) {
    if (content.includes(keyword)) {
      tags?.push({ name: system, category: "weapon-system", confidence: 0.9 });
    }
  }

  // Course type detection
  if (content.includes("basic") || content.includes("fundamental")) {
    tags?.push({ name: "YO Course", category: "course", confidence: 0.7 });
  }
  if (content.includes("advanced") || content.includes("tactical")) {
    tags?.push({ name: "LGSC", category: "course", confidence: 0.7 });
  }

  return tags;
}
