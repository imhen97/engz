import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Question, TestAnswer, TestResult, TestSection } from "@/types/leveltest";

interface LevelTestState {
  // State
  currentSection: TestSection;
  currentQuestionIndex: number;
  questions: Record<TestSection, Question[]>;
  answers: TestAnswer[];
  timeRemaining: number;
  isLoading: boolean;
  isCompleted: boolean;
  result: TestResult | null;
  
  // Actions
  setQuestions: (section: TestSection, questions: Question[]) => void;
  submitAnswer: (answer: TestAnswer) => void;
  nextQuestion: () => void;
  nextSection: () => void;
  setTimeRemaining: (time: number) => void;
  completeTest: (result: TestResult) => void;
  resetTest: () => void;
}

const initialState = {
  currentSection: "vocab" as TestSection,
  currentQuestionIndex: 0,
  questions: { vocab: [], grammar: [], writing: [] },
  answers: [],
  timeRemaining: 10,
  isLoading: false,
  isCompleted: false,
  result: null,
};

export const useLevelTestStore = create<LevelTestState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setQuestions: (section, questions) =>
        set(
          (state) => ({
            questions: { ...state.questions, [section]: questions },
          }),
          false,
          "setQuestions"
        ),

      submitAnswer: (answer) =>
        set(
          (state) => ({
            answers: [...state.answers, answer],
          }),
          false,
          "submitAnswer"
        ),

      nextQuestion: () =>
        set(
          (state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
            timeRemaining: 10,
          }),
          false,
          "nextQuestion"
        ),

      nextSection: () => {
        const { currentSection } = get();
        const sectionOrder: TestSection[] = ["vocab", "grammar", "writing"];
        const currentIndex = sectionOrder.indexOf(currentSection);
        
        if (currentIndex < sectionOrder.length - 1) {
          set(
            {
              currentSection: sectionOrder[currentIndex + 1],
              currentQuestionIndex: 0,
              timeRemaining: currentSection === "writing" ? 60 : 10,
            },
            false,
            "nextSection"
          );
        }
      },

      setTimeRemaining: (time) =>
        set({ timeRemaining: time }, false, "setTimeRemaining"),

      completeTest: (result) =>
        set({ isCompleted: true, result }, false, "completeTest"),

      resetTest: () => set(initialState, false, "resetTest"),
    }),
    { name: "LevelTestStore" }
  )
);
