import { createActor, fromPromise } from "xstate";
import { quizMachine } from "./quiz";
import { QuizActor, QuizSnapshot, RandomQuestionList, Tags } from "./types";

const correct_answer = "Paris";

const mockQuestions: RandomQuestionList = [
  {
    id: 1,
    question_prompt: "What is the capital of France?",
    correct_answer,
    answer_a: correct_answer,
    answer_b: "London",
    answer_c: "Berlin",
    answer_d: "Madrid",
    answer_explanation: "Paris is the capital of France",
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

const testPlanBuilder = (
  quizActor: QuizActor,
  answer: string,
  expectedScore: number
) => {
  return function* (): Generator<void, void, QuizSnapshot> {
    let snapshot = yield;

    expect(snapshot.hasTag(Tags.HomeScreen)).toBe(true);

    quizActor.send({ type: "Start the game" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuizScreen)).toBe(true);

    snapshot = yield;

    expect(snapshot.hasTag(Tags.QuestionDisplayed)).toBe(true);

    quizActor.send({ type: "Player Presses Answer", answer });

    snapshot = yield;

    expect(
      snapshot.hasTag(
        answer === correct_answer ? Tags.CorrectAnswer : Tags.IncorrectAnswer
      )
    ).toBe(true);

    quizActor.send({ type: "Proceed to Next Question" });

    snapshot = yield;

    expect(snapshot.hasTag(Tags.Completed)).toBe(true);
    expect(snapshot.context.score).toBe(expectedScore);
  };
};

describe("Quiz machine", () => {
  it("should complete the game with the right score when a user answer well to each questions", () => {
    const quizActor = setupQuizActor();
    const testPlanFunction = testPlanBuilder(quizActor, "Paris", 1);
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

  it("should complete the game with the right score when a user do not answer well to each questions", () => {
    const quizActor = setupQuizActor();
    const testPlanFunction = testPlanBuilder(quizActor, "Berlin", 0);
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
