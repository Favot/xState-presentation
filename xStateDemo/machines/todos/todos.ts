import { assign, createActor, fromPromise, setup, stopChild } from "xstate";
import { TodoMachine } from "./todo/todo";
import { Context, Events, Todo } from "./types";
import { fetchTodos, makeId } from "./utils";

const spawnTodo = ({
  spawn,
  id,
  label,
}: {
  spawn: any;
  id: string;
  label: string;
}) => {
  return spawn("todoMachine", {
    id: `todo-${id}`,
    input: {
      label,
    },
  });
};

export const buildTodosMachine = (todoMachine: TodoMachine) =>
  setup({
    types: {
      context: {} as Context,
      events: {} as Events,
    },
    guards: {
      "new todo's label is valid": ({ context }) =>
        context.newTodoLabel.trim().length > 0,
    },
    actions: {
      "Stop the todo's actor": stopChild(({ context }, todoId: string) => {
        const res = context.todos.find((todo) => todo.id === todoId);
        if (!res) {
          throw new Error("Child does not exist lmfao");
        }
        return res;
      }),
      "Remove todo from context": assign({
        todos: ({ context }, todoId: string) =>
          context.todos.filter((todo) => todo.id !== todoId),
      }),
      "Update the new todo label in context": assign({
        newTodoLabel: (_, label: string) => label,
      }),
      "Reset new todo's label": assign({
        newTodoLabel: "",
      }),
      "Add a new todo in context": assign({
        todos: ({ context, spawn }) => {
          let todo = spawnTodo({
            spawn,
            id: makeId(),
            label: context.newTodoLabel,
          });
          return context.todos.concat(todo);
        },
      }),
      "Add fetched todos to context": assign({
        todos: ({ spawn }, todos: Todo[]) => {
          const fetchedTodo = todos.map((todo) => {
            return spawnTodo({
              spawn,
              id: todo.id.toString(),
              label: todo.label,
            });
          });
          return fetchedTodo;
        },
      }),
    },
    actors: {
      todoMachine,
      "Fetch todos": fromPromise(async () => await fetchTodos()),
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBUDyARVBlAdASXQBkBRAYgFUAHCAQwBcwACAOzAHdG6B7CLgcliMANjQBGYIQG0ADAF1EoSl1gBLOiq7MFIAB6IAtACZpADhwBOAOznDAZlsmAbJcsAWaZdsAaEAE9EAKzmAIw4rrbWLiYBwdLSMQC+CT5omLgEJKToEmAMjDScPFwy8kggSqrqmtp6CLbOOIaO5qZNltKGnQE+-giGwaFNQR1Nru3thkkpGNj4RGQAghAQ+YW8JdoVahpaZbVjAY2O0sG2Ho6uwa4B0o49iMfmFq6XbiPmroaWUyCps4RcGgQFTMKCkXisHAggBuXAA1mAcH9cACgSCoAgYVwAMb0HYlDZlLZVXagWr6AKuHDSWyuaKGMYXF4Xe59SyOamRewmJoRYKTH7MHhwbTIzbKbbVPYGQwBDlWGzc5xvTys-S2UJnczHepMmxBH7IuYkcWVHY1RDBAKGHBnW4MxwBSyy4KOO5+RCfKly-k8oK6hyGmYowHA0GmyWk3QGK22RpuExe9mWEw81lynDHAIOS6OK4mM7fJIJIA */
    id: "TODOS",
    context: {
      newTodoLabel: "",
      todos: [],
    },
    states: {
      IDLE: {
        on: {
          "Update new todo's label": {
            actions: [
              {
                type: "Update the new todo label in context",
                params: ({ event }) => event.label,
              },
            ],
            target: "IDLE",
          },

          "Delete a todo": {
            actions: [
              {
                type: "Stop the todo's actor",
                params: ({ event }) => event.id,
              },
              {
                type: "Remove todo from context",
                params: ({ event }) => event.id,
              },
            ],
            target: "IDLE",
          },

          "Add a todo": {
            guard: {
              type: "new todo's label is valid",
            },
            actions: ["Add a new todo in context", "Reset new todo's label"],
            target: "IDLE",
          },
        },
      },

      Loading: {
        invoke: {
          src: "Fetch todos",
          onDone: {
            target: "IDLE",
            actions: [
              {
                type: "Add fetched todos to context",
                params: ({ event }) => event.output,
              },
            ],
            reenter: true,
          },
        },
      },
    },

    initial: "Loading",
  });

export type TodosMachine = ReturnType<typeof buildTodosMachine>;
export type TodosActor = ReturnType<typeof createActor<TodosMachine>>;
export type TodosActions = Parameters<TodosMachine["provide"]>[0]["actions"];
