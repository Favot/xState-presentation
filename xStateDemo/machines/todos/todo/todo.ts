import { Actor, assign, fromPromise, sendParent, setup } from "xstate";
import { makeId } from "../utils";

type Context = {
  previousLabel: string;
  label: string;
  isDone: boolean;
  id: number;
};

export const todoMachine = setup({
  types: {
    context: {} as Context,
    events: {} as
      | {
          type: "Update label";
          label: string;
        }
      | {
          type: "Save todo";
        }
      | {
          type: "Edit todo";
        }
      | {
          type: "Cancel";
        }
      | {
          type: "Delete todo";
        },
    input: {} as {
      label: string;
    },
    tags: {} as "read" | "form" | "saving",
  },
  actors: {
    "Save todo on server": fromPromise(async () => {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    }),
    "Log save operation": fromPromise(async () => {
      // Simulate network request
      console.log("Logging save operation...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Save operation has been logged");

      return true;
    }),
  },
  actions: {
    "Update previous label in context": assign({
      previousLabel: ({ context }) => context.label,
    }),
    "Update label in context": assign({
      label: (_, label: string) => label,
    }),
    "Send delete event to parent": sendParent(({ self }) => ({
      type: "Delete a todo",
      id: self.id,
    })),
    "Set back previous label": assign({
      label: ({ context }) => context.previousLabel,
    }),
    "update done state": assign({
      isDone: ({ context }) => !context.isDone,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUGIAiYA2YyYABGhgNoAMAuoqAA6qwCWyzqAdnSAB6IBMANgAcAOn6V+AVgDMggCyUplFTJkAaEAE9EAWn4BGQaKmDKATkFn+86TIDsggL5PNZLAGUAhgDcS7qlokEEYWNk5uPgR7c3MTQXthc2F7WylU800dBH4bUXNKYUN5VKEUlzd0VFEAVQAFbABBABUAUVEAJVbG7ABJADkAcUxWiFZSKsDuUNZ2LmCo3QN7KXF5EvtcyhkDB3WsxClTE0LBA34ZSkcC+wqQd1qGlvaunoHh5tQoKAJiDA4wFNgjNwvNQIsZAVRPZLtt5MIDOlhEl5AcEPI1NDBDJhCoYRICuY7g96k02qJWn1mu9MDV6BAvERiHgvAAjfBAhhMWYRBaIGRSAzQzaJRRHCTrKRo2QyaFFbZFZJqI7EqqPMntSm9alDTAAYS8HAAxhyaNNuaDIogSiZzDt+OZzusLoi0QK4pDIUl+MIZPIFM5XPc1aTnhSqTTvH4JhQzcCLXMrej7ELFPYrjCjEk7VLtPydtD5MkMRYisIzvJVRh1WGPI0AGo0-5gUTMDg+VAAaxbJKe5LrjaGCDbHaNjLmgU5IQTvPBegMSlEJRx-pTFhhtjRBiLohkPos5wkKl2LiDHHQcG47nNYUTfIQunhxhhqnhiMSKLR+jiuwxMSkwjyFI0ipFW1QAEKNHqADSgwdAA8jU-TYMQAAy8GDIM7w3jyYK8IgpT5IklCCKYAG4hoeYIH6so4gKDhKIouLSGBNZtDhlr3o+OLQrCfoIkin5UQBcokYUiIOoKvqsaG5KvH0QwcXec4Pssso2Bs26lriyxukYJiIoIljGRIDiBpU1ayZqEaKfGt6zvhOQpvk5E2MIRzrNsaIlEKZgOMB0iUAYRJBr2GqiAO2F2bhSYXMY5jrGYsQpAokKCFu-qiEZpgLikNwOqeThAA */
  id: "todo",
  context: ({ input }) => ({
    previousLabel: input.label,
    label: input.label,
    isDone: false,
    id: parseInt(makeId()),
  }),
  states: {
    "BACKGROUND LOGGING": {
      invoke: {
        src: "Log save operation",
      },
    },
    UPDATE: {
      states: {
        READING: {
          tags: ["read"],
          on: {
            "Edit todo": {
              target: "EDITING",
              reenter: true,
            },

            "Toggle done": {
              target: "READING",
              actions: "update done state",
            },
          },
        },

        EDITING: {
          tags: ["form"],
          on: {
            "Update label": {
              actions: [
                {
                  type: "Update label in context",
                  params: ({ event }) => event.label,
                },
              ],
              target: "EDITING",
            },
            Cancel: {
              target: "READING",
              actions: ["Set back previous label"],
              reenter: true,
            },
            "Save todo": {
              target: "SAVING",
              reenter: true,
            },
          },
        },

        SAVING: {
          tags: ["saving"],
          invoke: {
            src: "Save todo on server",

            onDone: {
              target: "READING",
              actions: "Update previous label in context",
            },
          },
        },
      },
      initial: "READING",
    },
  },
  on: {
    "Delete todo": {
      target: "#todo",
      actions: [
        {
          type: "Send delete event to parent",
        },
      ],
    },
    "Save todo": ".BACKGROUND LOGGING",
  },
  type: "parallel",
});

export type TodoMachine = typeof todoMachine;
export type TodoActions = Parameters<TodoMachine["provide"]>[0]["actions"];
export type TodoSnapshot = ReturnType<Actor<TodoMachine>["getSnapshot"]>;
