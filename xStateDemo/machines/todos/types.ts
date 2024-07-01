import { ActorRefFrom } from "xstate";
import { TodoMachine } from "./todo/todo";

export type Todo = {
  id: number;
  label: string;
  isDone: boolean;
};

export type Context = {
  newTodoLabel: string;
  todos: ActorRefFrom<TodoMachine>[];
};

export type Events =
  | {
      type: "Add a todo";
    }
  | {
      type: "Update new todo's label";
      label: string;
    }
  | {
      type: "Delete a todo";
      id: string;
    }
  | {
      type: "Disable";
    }
  | {
      type: "Enable";
    }
  | {
      type: "Add fetched todos to context";
      todos: Todo[];
    };
