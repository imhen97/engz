/**
 * Test section types
 */
export type TestSection = "vocab" | "grammar" | "writing";

/**
 * Difficulty levels
 */
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

/**
 * Question types for level test
 */
export type QuestionType = "multiple-choice" | "short-answer" | "vocabulary" | "grammar" | "writing";

/**
 * Base question interface
 */
export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  correctAnswerText?: string;
  alternatives?: string[];
}

/**
 * Grammar question (multiple choice)
 */
export interface GrammarQuestion extends Question {
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
}

/**
 * Vocabulary question
 */
export interface VocabularyQuestion extends Question {
  type: "vocabulary" | "multiple-choice";
  options: string[];
  correctAnswer: number;
}

/**
 * Writing prompt
 */
export interface WritingPrompt {
  id: string;
  prompt: string;
  example?: string;
}

/**
 * Test answer structure
 */
export interface TestAnswer {
  questionId: string;
  answer: string | number;
  timeSpent: number;
  isCorrect?: boolean;
}

/**
 * Test result scores
 */
export interface TestResult {
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  totalScore: number;
  avgSpeed: number | null;
  rankPercent: number | null;
  overallLevel: string;
}

/**
 * Level test submission data
 */
export interface LevelTestSubmission {
  level: DifficultyLevel;
  vocabScore: number;
  grammarScore: number;
  writingScore: number;
  avgSpeed: number | null;
  vocabAnswers: (number | string)[];
  grammarAnswers: (number | string)[];
  writingAnswers: string[];
}

/**
 * Level test data stored in sessionStorage
 */
export interface LevelTestData {
  level: DifficultyLevel;
  vocabQuestions: VocabularyQuestion[];
  grammarQuestions: GrammarQuestion[];
  writingPrompts: WritingPrompt[];
  vocabAnswers?: (number | string)[];
  grammarAnswers?: (number | string)[];
  writingAnswers?: string[];
  vocabTimings?: number[];
  grammarTimings?: number[];
}

/**
 * Writing grading request
 */
export interface WritingGradingRequest {
  prompts: Array<{
    prompt: string;
    answer: string;
  }>;
}

/**
 * Writing grading response
 */
export interface WritingGradingResponse {
  scores: number[];
}
