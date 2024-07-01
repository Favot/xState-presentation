import { assign, fromPromise, setup } from "xstate";
import { Context, Events, RandomQuestionList, Tags } from "./types";
import { fetchRandomQuestions } from "./utils";

export const quizMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    tags: {} as Tags,
  },
  actors: {
    "Retrieve Questions From API": fromPromise(
      async () => await fetchRandomQuestions()
    ),
  },
  actions: {
    "Increment the user score": ({ context }) => {
      context.score += 1;
    },
    "Reset the user score": assign({
      score: 0,
    }),
    "Remove the first question from the current question list": assign({
      questionsToAks: ({ context }) => context.questionsToAks.slice(1),
    }),
    "Add fetched question to the current question list": assign({
      questionsToAks: ({ context }, questions: RandomQuestionList) => questions,
    }),
  },
  guards: {
    "Is the provided answer correct": ({ context }, answer: string) => {
      return context.questionsToAks[0].correct_answer === answer;
    },
    "has more question to answer": ({ context }) => {
      return context.questionsToAks.length > 0;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOgJIBEAZAUQGIBlAFwEMAnSgAkoAswGpqBbMAbQAYAuolAAHAPax0ldGIB2wkAA9EfADQgAnioC+29WizYACoQCCATVwA5AOIB9G6YCyxbADFiAFQDCACTsAigCquABagUHE5J64APJW5KQQcmDY6LIAbmIA1qkGOCYW1vaOLu5efhFhEVEx8eQI6VkAxtTScvwCnQriku3ySEqIACwAnHzYwwAcAMwzozMAjDN8AOwATOvqWgjzAGzYU3yjwwCs64uL66PrpzO6+hgFZpa2Ds6uHj7+wdXBtXEEqQwLRaGJaNgRAAbNoAM3BnGw+WML2K7zKX0qv3C-2igIaTTErX6nW6g16UhkA1AygQ12G2D2wz2mz4ZzGzOGw22iFOJ2wbL2fGuo1WLNWaweIGRhVeJQ+xgASlFiFYYm9vEFFcq1TU8fFSEYYRoQQwjLQ4LA4AxTLJYAB3EFk0QSSlyBS0qZTRbYRbjOZXYV7GbBnkIVanKaTPhMvajUaRuYzYZSmWot6lVxGZXkVXq+ya7V5vV1KyG42m82W622h1OxZCcmu-oexCXK7Yc6rRbDPiLVZnVY3MOnYY+kNTa5rfss+56aVPFFFDMK-C4ciyuzeWJF7yeOymBIAdWIirs0VMnjI5qJYEgTDEDCsYEUjACqDgJMEPWbVNbCD9PtGWOIU+FOGNTj2Icw1Wb1O2GVZuwjL0xUWU5U0XWU0UzbA1w3F47CPRV4nsQ9yBPM8LyvQ0wWaO8IAfJ8XzfD9YC-RsXT6P9BlpQCfSFUZQPAvZIKmEde0OPZJ3GJDZwwwwsJXMogiMfBLzRPDZVPEtAVIZ0QApFseMQTYQ0OKZmVOCMZnWPYpLDMcJlE2Y7lgwSU3nNNl3lZTVPUt5NJebTcVLPSGx-Lj3WMukp2wUZFgskNhWGGzTjDEVGWmW4UJZBC2Xk55vPRVxsS3WInBMLxiHwUgrGoDJ0A4Sg2EoR9fDEbgGHIZoLTAWR9MM7iaRM9ZpkkyNBIjBCplWMMAFpZl9FZbIQ+YxVuVYCqXOViuwU9iMozxLzIXBZEpNo2EVMBYTAShmmYBgxFhBh30-KlYAG38ouGhA5qZTsZimET1jZRCRMnEcbng0V+ymBY+GFXR51kMQIDgBR8git1qSGX7FiFAGgfOUGxUjLZNEQOaLh9DY+BmSC1umfH1i2ggSCxoyfvmAU+XjOGRL9MUmXmq4ZkOMDbLho4JT7PYtsUnziA5obcbmy51kJ4GSfB8mdnbcXRxnNCNglKZ5fTRXym+KocUifUEmV77ccWlK42DRybKWbkKd2fkZwTK5YN7ZNzaKnDsxVNU0ULHV9xCwFHZx2lxh9C4hz5UmE2gn3eyjTYrPWVZAeOWYWc8zCLd2wKLDK3d9zIijzyOq9E--NCgO9OMgdFsCYKOOLxVOcCEb2P10PLhTK5w6vzEI4i3gb7SqKVptIqTtth-MlzbP2Ua9nEsX1lLk2ZhlzaJ8KnacJUtT8zsGfgrt0tW+itPU+nPkUus5MR0WCY1hskXOM5xIJD1DlfBUpVtwVRIFefAL8fr5wOMKY4tkFik1mj7P0oxsC01PlNGMUEPKPEnmHBU+0dxN2Ogg3Gfo85QWTGsIcCNhRiR9unX0PZuyWSHGcJG2ggA */
  id: "quiz",

  initial: "IDLE",
  context: {
    score: 0,
    questionsToAks: [],
  },

  states: {
    IDLE: {
      tags: Tags.HomeScreen,
      on: {
        "Start the game": "PLAYING_GAME",
      },
    },
    PLAYING_GAME: {
      tags: Tags.QuizScreen,
      states: {
        FETCH_QUIZ_QUESTIONS: {
          tags: Tags.Loading,
          invoke: {
            src: "Retrieve Questions From API",
            onError: {
              target: "ERROR_STATE",
              reenter: true,
            },
            onDone: {
              target: "PRESENTING_CURRENT_QUESTION",
              actions: [
                {
                  type: "Add fetched question to the current question list",
                  params: ({ event }) => event.output,
                },
              ],
            },
          },
        },

        PRESENTING_CURRENT_QUESTION: {
          tags: Tags.QuestionDisplayed,
          on: {
            "Player Presses Answer": [
              {
                target: "DISPLAY_CORRECT_ANSWER_STATE",
                guard: {
                  type: "Is the provided answer correct",
                  params({ event }) {
                    return event.answer;
                  },
                },
                actions: [
                  {
                    type: "Increment the user score",
                  },
                ],
              },
              "DISPLAY_WRONG_ANSWER_STATE",
            ],
          },
        },

        DISPLAY_CORRECT_ANSWER_STATE: {
          tags: [Tags.CorrectAnswer, Tags.QuestionAnswered],
          on: {
            "Proceed to Next Question": "UPDATING_DISPLAYER_QUESTION",
          },
        },

        DISPLAY_WRONG_ANSWER_STATE: {
          tags: [Tags.IncorrectAnswer, Tags.QuestionAnswered],
          on: {
            "Proceed to Next Question": "UPDATING_DISPLAYER_QUESTION",
          },
        },

        UPDATING_DISPLAYER_QUESTION: {
          entry: "Remove the first question from the current question list",
          always: [
            {
              target: "PRESENTING_CURRENT_QUESTION",
              guard: "has more question to answer",
            },
            {
              target: "QUIZ_COMPLETED",
              reenter: true,
            },
          ],
        },

        QUIZ_COMPLETED: {
          tags: [Tags.Completed],
          type: "final",

          on: {
            "Navigate to Home Screen": {
              target: "#quiz.IDLE",
              actions: "Reset the user score",
            },
          },
        },

        ERROR_STATE: {
          tags: [Tags.Error],
          on: {
            "Initiate Refetch of Questions": "FETCH_QUIZ_QUESTIONS",
          },
        },
      },

      initial: "FETCH_QUIZ_QUESTIONS",
    },
  },
});
