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
      context.score += context.scoreMultiplier;
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
    "add question to question to repeate list": assign({
      questionToRepeat: ({ context }) => [
        ...context.questionToRepeat,
        context.questionsToAks[0],
      ],
    }),
    "devide score multiplier": assign({
      scoreMultiplier: ({ context }) => context.scoreMultiplier / 2,
    }),
    "transfere question to repeat to question to ask list": assign({
      questionsToAks: ({ context }) => context.questionToRepeat,
    }),
    "clean question to ask": assign({
      questionToRepeat: ({ context }) => [],
    }),
  },
  guards: {
    "Is the provided answer correct": ({ context }, answer: string) => {
      return context.questionsToAks[0].correct_answer === answer;
    },
    "has more question to answer": ({ context }) => {
      return context.questionsToAks.length > 0;
    },
    "has question to repeat": ({ context }) => {
      return context.questionToRepeat.length > 0;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgOgBIHkBZAUQH0BlAYQCVjiA5AYnoEMA3dKFgFzAAJuAez5cAtv1gBjAE5gwAOwDaABgC6iUAAdBsdN3SD5GkAA9EygDQgAnuYC+dq2izYAigFUAkgC0KNOvTYAGLEACqUuKQePlHuxOShnvj05IwQhmDY6PJsggDWmc440b5UtAzBYRGxMR7xicnkCNm5kjwGSmoq6kgg2rr6hsZmCACsowCM2ADMExMATACc0wAsq4sAHNMA7Fa2CPPzG9iL89tLo9Oro8oAbKPbDk4YxV6l-hUh4ZElsfVJKUYYGk0kE0mwmgANjwAGZg0TYIpuN5+cqBL7VX51BIApotQRtQadVTdYz9PQdYaIJYrbC3Fa3Q7KFajFaLBkrFZ7RCjdnYZm3ZRLRbbRnbZSPRwgJG-MoBbAABVo5AYiXoAHFSJR3NRaPRQn8cclGArodZgXwFbJYLA4HwAILyWAAd2BpN65KJVIQGw2Uwmi2UVwWQtu0zD3IQ21GxxWdwZi0WMauqye0peyJicoqSviqs8Gq1Or1BuxDSYppY5uklutttgDqdrukigmPS0OgpQ16Izmt2Oh1O0w220DymUIsjN1GJ3mygmKwmouWo9GaZlKOzgQAIp5yAqADL2gCaWvwuuIlAN9pSAHViNQKKF7aFiCbQZI5BABMJ6GATNwfCuKgcBEu6HYDJSPaIAG850hOgrKDc9y3KOkbbH62Csts2xLjGI63BMa5ShuWYfDue6HiepC3tQySaje5D3o+CQvm+VoEl+P58H+AFASBsBgWoZKdl60EHEGM4TNMSZIeKy4bPMU5xtgGz9ksEpLoy0zzOuGayuR2DuAq24vgWmq7vuR7Hg+hrlow4F9KJUGgCM8wMjOhFxry4qJmykaLscoxnKhAa8vMly3HpLgGWiRkmWZhaWVRNmPmWAIOW2ImQd2rnUou2xYbMOzSdsKwRQ8kYRfMJxzCsOErBs44+bpJH6ZuhnGaZaoWZR1m2elxqKPM7ZOTlRjiRFAZ0oKhzjJc0mNZGS6FeyzLIZsCybJKzwxR1cW-JQRCHmExDbsw7CcDw-BCHwuCCOIfDkDIcjEtlXYTXlBz1YVvIbGy4pxts0yXJGAC0GHYBMfpEWy0zjvV0nRa8ZFxQ+dEsc+r6MJ48gUtdfDUGAMJgNwkgABZ8IIML8aBHSwI5nouaYiBg-SRVqcFzI4fcilTqcWEA0uGzLOOrVSvIggQHAxhFO9YlfWDEyChz9xzj9vNKTYrMBosMz-aMYaHOKOxhsjeBEGQW7y8zIwg9g8zrEmwurPSXLawgSsLFDGE6bhMmchFO3pntqMBDbuUs57cw1ZcnPqzzMZa-sxyBucE7zHMorBf95uxfKGI-Cig0pBHn1R8crvjrMQqTIsRtVfMtwnEGad+pMGE4Xn+3yrmKr6uZRYXvqdkAmX3qBlMmeriK9xJmhHtxgOQdnMOE5bK1u0o+8cXJdZZ4XlepCMcxT5seP4lEXBfq3JshGO0h6FNScYrjOOdxhd3YcVHv1G0fRx87y2VYq+C+X1laO1UsDIUjVLhlSTFOOcDsHiZyQkcNY0Mv473lF1RKvUrIngGnEI09AwFR3chKVShEhQrhjNDKcytsAMgQuVSYSERRYNRPKQ6x0DynW3GQtyNwarbWUCOcqZwyqjEjPXKGi0WTCnDJJThW5sDo3PGfUBHpnKR17JsB2qFVgSlHO-I46EkxyMRh5UcLIHAOCAA */
  id: "quiz",

  initial: "HOME_SCREEN",
  context: {
    score: 0,
    questionsToAks: [],
    questionToRepeat: [],
    scoreMultiplier: 10,
  },

  states: {
    HOME_SCREEN: {
      tags: Tags.HomeScreen,
      on: {
        "Start the game": "QUIZ_SCREEN",
      },
    },
    QUIZ_SCREEN: {
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
              {
                target: "DISPLAY_WRONG_ANSWER_STATE",
                actions: "add question to question to repeate list",
              },
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
              target: "PRESENTING_CURRENT_QUESTION",
              reenter: true,
              guard: "has question to repeat",
              actions: [
                "devide score multiplier",
                "transfere question to repeat to question to ask list",
                "clean question to ask",
              ],
            },
            {
              target: "QUIZ_COMPLETED",
              reenter: true,
            },
          ],
        },

        QUIZ_COMPLETED: {
          tags: [Tags.Completed],

          on: {
            "Navigate to Home Screen": {
              target: "#quiz.HOME_SCREEN",
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
