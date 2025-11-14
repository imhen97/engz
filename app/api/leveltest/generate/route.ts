import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Question pools for different levels
const VOCAB_QUESTIONS = {
  beginner: [
    {
      id: "v1",
      question: "Which word is closest in meaning to 'essential'?",
      options: ["ordinary", "necessary", "temporary", "optional"],
      correctAnswer: 1,
    },
    {
      id: "v2",
      question: "What does 'enormous' mean?",
      options: ["very small", "very large", "very fast", "very slow"],
      correctAnswer: 1,
    },
    {
      id: "v3",
      question: "Choose the synonym for 'happy':",
      options: ["sad", "joyful", "angry", "tired"],
      correctAnswer: 1,
    },
    {
      id: "v4",
      question: "What is the opposite of 'expensive'?",
      options: ["cheap", "costly", "valuable", "precious"],
      correctAnswer: 0,
    },
    {
      id: "v5",
      question: "Which word means 'to make better'?",
      options: ["improve", "worsen", "break", "destroy"],
      correctAnswer: 0,
    },
    {
      id: "v1b",
      question: "What does 'beautiful' mean?",
      options: ["ugly", "pretty", "big", "small"],
      correctAnswer: 1,
    },
    {
      id: "v2b",
      question: "Choose the synonym for 'big':",
      options: ["small", "large", "tiny", "little"],
      correctAnswer: 1,
    },
    {
      id: "v3b",
      question: "What is the opposite of 'hot'?",
      options: ["warm", "cold", "cool", "freezing"],
      correctAnswer: 1,
    },
    {
      id: "v4b",
      question: "Which word means 'to look at'?",
      options: ["see", "hear", "smell", "taste"],
      correctAnswer: 0,
    },
    {
      id: "v5b",
      question: "What does 'quick' mean?",
      options: ["slow", "fast", "big", "small"],
      correctAnswer: 1,
    },
  ],
  intermediate: [
    {
      id: "v6",
      question: "Which word is closest in meaning to 'essential'?",
      options: ["ordinary", "necessary", "temporary", "optional"],
      correctAnswer: 1,
    },
    {
      id: "v7",
      question: "What does 'ambiguous' mean?",
      options: ["clear", "unclear", "bright", "dark"],
      correctAnswer: 1,
    },
    {
      id: "v8",
      question: "Choose the best collocation: 'make a _____'",
      options: ["decision", "choice", "selection", "pick"],
      correctAnswer: 0,
    },
    {
      id: "v9",
      question: "What is a synonym for 'significant'?",
      options: ["small", "important", "tiny", "minor"],
      correctAnswer: 1,
    },
    {
      id: "v10",
      question: "Which phrase means 'to postpone'?",
      options: ["put off", "put on", "put in", "put out"],
      correctAnswer: 0,
    },
    {
      id: "v11i",
      question: "What does 'comprehend' mean?",
      options: ["understand", "forget", "ignore", "remember"],
      correctAnswer: 0,
    },
    {
      id: "v12i",
      question: "Choose the best collocation: 'take _____'",
      options: ["a decision", "a break", "a choice", "a selection"],
      correctAnswer: 1,
    },
    {
      id: "v13i",
      question: "What is a synonym for 'difficult'?",
      options: ["easy", "hard", "simple", "clear"],
      correctAnswer: 1,
    },
    {
      id: "v14i",
      question: "Which phrase means 'to cancel'?",
      options: ["call off", "call on", "call in", "call out"],
      correctAnswer: 0,
    },
    {
      id: "v15i",
      question: "What does 'efficient' mean?",
      options: ["slow", "productive", "lazy", "busy"],
      correctAnswer: 1,
    },
  ],
  advanced: [
    {
      id: "v11",
      question: "Which word is closest in meaning to 'ubiquitous'?",
      options: ["rare", "everywhere", "nowhere", "somewhere"],
      correctAnswer: 1,
    },
    {
      id: "v12",
      question: "What does 'ephemeral' mean?",
      options: ["permanent", "temporary", "eternal", "lasting"],
      correctAnswer: 1,
    },
    {
      id: "v13",
      question: "Choose the best collocation: '_____ a precedent'",
      options: ["set", "make", "do", "give"],
      correctAnswer: 0,
    },
    {
      id: "v14",
      question: "What is a synonym for 'meticulous'?",
      options: ["careless", "careful", "hasty", "rushed"],
      correctAnswer: 1,
    },
    {
      id: "v15",
      question: "Which phrase means 'to exacerbate'?",
      options: ["make worse", "make better", "make equal", "make different"],
      correctAnswer: 0,
    },
    {
      id: "v16a",
      question: "What does 'profound' mean?",
      options: ["shallow", "deep", "wide", "narrow"],
      correctAnswer: 1,
    },
    {
      id: "v17a",
      question: "Choose the best collocation: '_____ an impact'",
      options: ["make", "do", "have", "give"],
      correctAnswer: 2,
    },
    {
      id: "v18a",
      question: "What is a synonym for 'elaborate'?",
      options: ["simple", "detailed", "brief", "short"],
      correctAnswer: 1,
    },
    {
      id: "v19a",
      question: "Which phrase means 'to mitigate'?",
      options: ["make worse", "make better", "make equal", "reduce"],
      correctAnswer: 3,
    },
    {
      id: "v20a",
      question: "What does 'comprehensive' mean?",
      options: ["partial", "complete", "incomplete", "limited"],
      correctAnswer: 1,
    },
  ],
};

const GRAMMAR_QUESTIONS = {
  beginner: [
    {
      id: "g1",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "He don't likes coffee.",
        "He doesn't like coffee.",
        "He isn't like coffee.",
        "He didn't likes coffee.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g2",
      question: "Fill in the blank: I _____ to school every day.",
      type: "fill-in-blank",
      correctAnswer: "go",
    },
    {
      id: "g3",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "She is go to the store.",
        "She goes to the store.",
        "She go to the store.",
        "She going to the store.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g1b",
      question: "Fill in the blank: They _____ students.",
      type: "fill-in-blank",
      correctAnswer: "are",
    },
    {
      id: "g2b",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "I am like pizza.",
        "I like pizza.",
        "I likes pizza.",
        "I am liking pizza.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g3b",
      question: "Fill in the blank: She _____ a book yesterday.",
      type: "fill-in-blank",
      correctAnswer: "read",
    },
    {
      id: "g4b",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "We are go to the park.",
        "We go to the park.",
        "We goes to the park.",
        "We going to the park.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g5b",
      question: "Fill in the blank: He _____ English every day.",
      type: "fill-in-blank",
      correctAnswer: "studies",
    },
    {
      id: "g6b",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "I have a apple.",
        "I have an apple.",
        "I have the apple.",
        "I have apple.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g7b",
      question: "Fill in the blank: There _____ many books on the shelf.",
      type: "fill-in-blank",
      correctAnswer: "are",
    },
  ],
  intermediate: [
    {
      id: "g4",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "If I was you, I would study more.",
        "If I were you, I would study more.",
        "If I am you, I would study more.",
        "If I be you, I would study more.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g5",
      question:
        "Fill in the blank: If I _____ more time, I would travel abroad.",
      type: "fill-in-blank",
      correctAnswer: "had",
    },
    {
      id: "g6",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "The book which I read it yesterday was interesting.",
        "The book which I read yesterday was interesting.",
        "The book that I read it yesterday was interesting.",
        "The book what I read yesterday was interesting.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g4i",
      question: "Fill in the blank: By next year, I _____ finished my degree.",
      type: "fill-in-blank",
      correctAnswer: "will have",
    },
    {
      id: "g5i",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "I wish I was taller.",
        "I wish I were taller.",
        "I wish I am taller.",
        "I wish I be taller.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g6i",
      question: "Fill in the blank: The report _____ by the team last week.",
      type: "fill-in-blank",
      correctAnswer: "was completed",
    },
    {
      id: "g7i",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "Neither John nor Mary are coming.",
        "Neither John nor Mary is coming.",
        "Neither John or Mary is coming.",
        "Neither John or Mary are coming.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g8i",
      question: "Fill in the blank: I'm used to _____ early.",
      type: "fill-in-blank",
      correctAnswer: "getting up",
    },
    {
      id: "g9i",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "The more you practice, the better you get.",
        "The more you practice, the better you will get.",
        "The more you practice, the best you get.",
        "The more you practice, the good you get.",
      ],
      correctAnswer: 0,
    },
    {
      id: "g10i",
      question: "Fill in the blank: She suggested _____ to the museum.",
      type: "fill-in-blank",
      correctAnswer: "going",
    },
  ],
  advanced: [
    {
      id: "g7",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "Not only did she finish the project, but also she presented it.",
        "Not only she finished the project, but also she presented it.",
        "Not only did she finish the project, but she also presented it.",
        "Not only she did finish the project, but also she presented it.",
      ],
      correctAnswer: 2,
    },
    {
      id: "g8",
      question:
        "Fill in the blank: Had I known about the meeting, I _____ attended.",
      type: "fill-in-blank",
      correctAnswer: "would have",
    },
    {
      id: "g9",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "The company, whose employees are well-trained, is successful.",
        "The company, which employees are well-trained, is successful.",
        "The company, that employees are well-trained, is successful.",
        "The company, who employees are well-trained, is successful.",
      ],
      correctAnswer: 0,
    },
    {
      id: "g10a",
      question:
        "Fill in the blank: _____ had I arrived when it started raining.",
      type: "fill-in-blank",
      correctAnswer: "hardly",
    },
    {
      id: "g11a",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "It is high time we leave.",
        "It is high time we left.",
        "It is high time we are leaving.",
        "It is high time we will leave.",
      ],
      correctAnswer: 1,
    },
    {
      id: "g12a",
      question:
        "Fill in the blank: The proposal, _____ was submitted yesterday, needs review.",
      type: "fill-in-blank",
      correctAnswer: "which",
    },
    {
      id: "g13a",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "So difficult was the exam that many students failed.",
        "So difficult the exam was that many students failed.",
        "So difficult was the exam, many students failed.",
        "So difficult the exam, that many students failed.",
      ],
      correctAnswer: 0,
    },
    {
      id: "g14a",
      question:
        "Fill in the blank: Were I in your position, I _____ differently.",
      type: "fill-in-blank",
      correctAnswer: "would act",
    },
    {
      id: "g15a",
      question: "Choose the correct sentence:",
      type: "multiple-choice",
      options: [
        "The more I study, the more I realize how much I don't know.",
        "The more I study, the more I realize how much I don't know it.",
        "The more I study, the more I realize how much I know not.",
        "The more I study, the more I realize how much I know.",
      ],
      correctAnswer: 0,
    },
    {
      id: "g16a",
      question:
        "Fill in the blank: Not until she arrived _____ I realize the mistake.",
      type: "fill-in-blank",
      correctAnswer: "did",
    },
  ],
};

const WRITING_PROMPTS = {
  beginner: [
    {
      id: "w1",
      prompt:
        "Rewrite this sentence in your own words: 'I couldn't go out because it was raining.'",
      example: "The weather prevented me from going outside.",
    },
    {
      id: "w2",
      prompt: "Write a sentence using the word 'important'.",
    },
    {
      id: "w3",
      prompt: "Complete this sentence: 'If I had more time, _____'",
    },
  ],
  intermediate: [
    {
      id: "w4",
      prompt:
        "Rewrite this sentence in your own words: 'I couldn't go out because it was raining.'",
      example: "The inclement weather prevented me from leaving the house.",
    },
    {
      id: "w5",
      prompt: "Write 2-3 sentences describing your ideal vacation.",
    },
    {
      id: "w6",
      prompt:
        "Paraphrase: 'The meeting was postponed due to unforeseen circumstances.'",
    },
  ],
  advanced: [
    {
      id: "w7",
      prompt:
        "Rewrite this sentence using more sophisticated vocabulary: 'I couldn't go out because it was raining.'",
      example:
        "The inclement weather conditions precluded my departure from the premises.",
    },
    {
      id: "w8",
      prompt:
        "Write a complex sentence (2-3 clauses) about a recent achievement.",
    },
    {
      id: "w9",
      prompt:
        "Paraphrase using advanced grammar structures: 'The meeting was postponed due to unforeseen circumstances.'",
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level } = body;

    if (!level || !["beginner", "intermediate", "advanced"].includes(level)) {
      return NextResponse.json(
        {
          error: "Invalid level. Must be beginner, intermediate, or advanced.",
        },
        { status: 400 }
      );
    }

    // Get questions for the selected level and randomize
    const vocabPool = VOCAB_QUESTIONS[level as keyof typeof VOCAB_QUESTIONS];
    const grammarPool =
      GRAMMAR_QUESTIONS[level as keyof typeof GRAMMAR_QUESTIONS];
    const writingPool = WRITING_PROMPTS[level as keyof typeof WRITING_PROMPTS];

    // 총 20문제: vocab 10문제, grammar 10문제 (모두 객관식), writing 5문제
    const vocabQuestions = shuffleArray([...vocabPool]).slice(0, 10);
    // 주관식 제거: multiple-choice만 필터링
    const grammarPoolFiltered = grammarPool.filter(
      (q) => q.type === "multiple-choice"
    );
    const grammarQuestions = shuffleArray([...grammarPoolFiltered]).slice(0, 10);
    const writingPrompts = shuffleArray([...writingPool]).slice(0, 5);

    return NextResponse.json({
      vocabQuestions,
      grammarQuestions,
      writingPrompts,
    });
  } catch (error) {
    console.error("❌ 테스트 생성 실패:", error);
    return NextResponse.json(
      { error: "테스트를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
