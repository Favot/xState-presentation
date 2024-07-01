import { Actor, ActorRefFrom } from "xstate";
import { quizMachine } from "./quiz";

export type RandomQuestionList = {
  id: number;
  question_prompt: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  answer_explanation: string;
}[];

export type Context = {
  score: number;
  questionsToAks: RandomQuestionList;
};

export type Events =
  | {
      type: "Player Presses Answer";
      answer: string;
    }
  | {
      type: "Proceed to Next Question";
    }
  | {
      type: "Initiate Refetch of Questions";
    }
  | {
      type: "Start the game";
    }
  | {
      type: "Navigate to Home Screen";
    };

export enum Tags {
  HomeScreen = "homeScreen",
  QuizScreen = "quizScreen",
  Loading = "loading",
  QuestionDisplayed = "questionDisplayed",
  CorrectAnswer = "correctAnswer",
  IncorrectAnswer = "incorrectAnswer",
  QuestionAnswered = "questionAnswered",
  Completed = "completed",
  Error = "error",
}

export type QuizSnapshot = ReturnType<Actor<typeof quizMachine>["getSnapshot"]>;
export type QuizSend = (event: Events) => void;
export type QuizActor = ActorRefFrom<typeof quizMachine>;
export type QuizMachine = typeof quizMachine;
export type QuizActions = Parameters<QuizMachine["provide"]>[0]["actions"];
