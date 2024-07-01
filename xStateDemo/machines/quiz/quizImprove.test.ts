import { createActor, fromPromise } from "xstate";
import { quizMachine } from "./quiz";
import { QuizActor, QuizSnapshot, RandomQuestionList, Tags } from "./types";

const mockQuestions: RandomQuestionList = [
  {
    id: 1,
    question_prompt: "What is the capital of France?",
    correct_answer: "Paris",
    answer_a: "Paris",
    answer_b: "London",
    answer_c: "Berlin",
    answer_d: "Madrid",
    answer_explanation: "Paris is the capital of France",
  },
  {
    id: 2,
    question_prompt: "What is the capital of Germany?",
    correct_answer: "Berlin",
    answer_a: "Paris",
    answer_b: "London",
    answer_c: "Berlin",
    answer_d: "Madrid",
    answer_explanation: "Berlin is the capital of Germany",
  },
];

const setupQuizActor = () => {
  return createActor(
    quizMachine.provide({
      actors: {
        "Retrieve Questions From API": fromPromise(async () => {
          return mockQuestions;
        }),
      },
    })
  );
};

const testPlanBuilder = (quizActor: QuizActor) => {
  return function* (): Generator<void, void, QuizSnapshot> {
    let snapshot = yield;

    expect(snapshot.hasTag(Tags.HomeScreen)).toBe(true);

    quizActor.send({ type: "Start the game" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuizScreen)).toBe(true);

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuestionDisplayed)).toBe(true);

    quizActor.send({ type: "Player Presses Answer", answer: "Paris" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.CorrectAnswer)).toBe(true);

    expect(snapshot.context.score).toBe(10);

    quizActor.send({ type: "Proceed to Next Question" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuestionDisplayed)).toBe(true);

    quizActor.send({ type: "Player Presses Answer", answer: "Madrid" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.IncorrectAnswer)).toBe(true);

    expect(snapshot.context.score).toBe(10);

    quizActor.send({ type: "Proceed to Next Question" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuestionDisplayed)).toBe(true);

    quizActor.send({ type: "Player Presses Answer", answer: "Berlin" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.CorrectAnswer)).toBe(true);

    quizActor.send({ type: "Proceed to Next Question" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.Completed)).toBe(true);
    expect(snapshot.context.score).toBe(15);
  };
};

describe("Quiz machine", () => {
  it("should complete the game with the right score when a user answer well to each questions", () => {
    const quizActor = setupQuizActor();
    const testPlanFunction = testPlanBuilder(quizActor);
    const testPlan = testPlanFunction();

    return new Promise<void>((resolve, reject) => {
      testPlan.next();
      quizActor.subscribe({
        next(snapshot) {
          try {
            const { done } = testPlan.next(snapshot);
            if (done) {
              return resolve();
            }
          } catch (error) {
            reject(error);
          }
        },
      });

      quizActor.start();
    });
  });
});
