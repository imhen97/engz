import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Question pools for the short 10-question test
const VOCAB_QUESTIONS = [
  {
    id: "v1",
    type: "vocabulary",
    question:
      "Which word best fits the sentence: 'He was ____ by the movie's ending.'",
    options: ["touched", "touch", "touching", "touches"],
    correctAnswer: 0,
  },
  {
    id: "v2",
    type: "vocabulary",
    question: "'Essential'와 의미가 가장 가까운 단어는?",
    options: ["ordinary", "necessary", "temporary", "optional"],
    correctAnswer: 1,
  },
  {
    id: "v3",
    type: "vocabulary",
    question: "'Enormous'의 의미는?",
    options: ["very small", "very large", "very fast", "very slow"],
    correctAnswer: 1,
  },
  {
    id: "v4",
    type: "vocabulary",
    question: "'Expensive'의 반의어는?",
    options: ["cheap", "costly", "valuable", "precious"],
    correctAnswer: 0,
  },
  {
    id: "v5",
    type: "vocabulary",
    question:
      "Choose the correct word: 'She has a ____ understanding of the topic.'",
    options: ["comprehensive", "comprehend", "comprehension", "comprehending"],
    correctAnswer: 0,
  },
  {
    id: "v6",
    type: "vocabulary",
    question: "'To make better'의 의미를 가진 단어는?",
    options: ["improve", "worsen", "break", "destroy"],
    correctAnswer: 0,
  },
  {
    id: "v7",
    type: "vocabulary",
    question: "Which word means 'very tired'?",
    options: ["exhausted", "excited", "excellent", "excluded"],
    correctAnswer: 0,
  },
  {
    id: "v8",
    type: "vocabulary",
    question: "'Reliable'의 의미는?",
    options: ["untrustworthy", "trustworthy", "unreliable", "doubtful"],
    correctAnswer: 1,
  },
];

const GRAMMAR_QUESTIONS = [
  {
    id: "g1",
    type: "grammar",
    question: "Choose the correct sentence:",
    options: [
      "He don't like apples.",
      "He doesn't like apples.",
      "He not likes apples.",
      "He didn't likes apples.",
    ],
    correctAnswer: 1,
  },
  {
    id: "g2",
    type: "grammar",
    question: "Fill in the blank: I _____ to school every day.",
    options: ["go", "goes", "going", "went"],
    correctAnswer: 0,
  },
  {
    id: "g3",
    type: "grammar",
    question: "Choose the correct sentence:",
    options: [
      "She is go to the store.",
      "She goes to the store.",
      "She go to the store.",
      "She going to the store.",
    ],
    correctAnswer: 1,
  },
  {
    id: "g4",
    type: "grammar",
    question: "Fill in the blank: They _____ students.",
    options: ["is", "are", "am", "be"],
    correctAnswer: 1,
  },
  {
    id: "g5",
    type: "grammar",
    question: "Choose the correct sentence:",
    options: [
      "I am like pizza.",
      "I like pizza.",
      "I likes pizza.",
      "I am liking pizza.",
    ],
    correctAnswer: 1,
  },
  {
    id: "g6",
    type: "grammar",
    question: "Fill in the blank: She _____ a book yesterday.",
    options: ["read", "reads", "reading", "readed"],
    correctAnswer: 0,
  },
  {
    id: "g7",
    type: "grammar",
    question: "Choose the correct sentence:",
    options: [
      "We are go to the park.",
      "We go to the park.",
      "We goes to the park.",
      "We going to the park.",
    ],
    correctAnswer: 1,
  },
  {
    id: "g8",
    type: "grammar",
    question: "Fill in the blank: He _____ English every day.",
    options: ["study", "studies", "studying", "studied"],
    correctAnswer: 1,
  },
];

const WRITING_QUESTIONS = [
  {
    id: "w1",
    type: "writing",
    question: "Translate into English: '나는 매일 영어를 공부해요.'",
    correctAnswer: "I study English every day.",
    alternatives: [
      "I study English every day",
      "I study English daily",
      "I learn English every day",
    ],
  },
  {
    id: "w2",
    type: "writing",
    question: "Translate into English: '어제 친구와 영화를 봤어요.'",
    correctAnswer: "I watched a movie with my friend yesterday.",
    alternatives: [
      "I watched a movie with my friend yesterday",
      "Yesterday I watched a movie with my friend",
      "I saw a movie with my friend yesterday",
    ],
  },
  {
    id: "w3",
    type: "writing",
    question: "Translate into English: '그는 매우 친절한 사람이에요.'",
    correctAnswer: "He is a very kind person.",
    alternatives: [
      "He is a very kind person",
      "He is very kind",
      "He's a very nice person",
    ],
  },
  {
    id: "w4",
    type: "writing",
    question: "Translate into English: '내일 비가 올 것 같아요.'",
    correctAnswer: "It will probably rain tomorrow.",
    alternatives: [
      "It will probably rain tomorrow",
      "It might rain tomorrow",
      "It looks like it will rain tomorrow",
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    // Select 4 vocabulary, 4 grammar, and 2 writing questions randomly
    const shuffledVocab = shuffleArray([...VOCAB_QUESTIONS]);
    const shuffledGrammar = shuffleArray([...GRAMMAR_QUESTIONS]);
    const shuffledWriting = shuffleArray([...WRITING_QUESTIONS]);

    const selectedVocab = shuffledVocab.slice(0, 4);
    const selectedGrammar = shuffledGrammar.slice(0, 4);
    const selectedWriting = shuffledWriting.slice(0, 2);

    // Combine and shuffle the order
    const allQuestions = shuffleArray([
      ...selectedVocab,
      ...selectedGrammar,
      ...selectedWriting,
    ]);

    // Add question numbers
    const questionsWithNumbers = allQuestions.map((q, index) => ({
      ...q,
      questionNumber: index + 1,
    }));

    return NextResponse.json({
      questions: questionsWithNumbers,
      totalQuestions: 10,
    });
  } catch (error) {
    console.error("❌ 질문 생성 실패:", error);
    return NextResponse.json(
      { error: "질문을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
