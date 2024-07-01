import { Todo } from "./types";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("http://localhost:3000/todos");
  const data = await response.json();
  return data;
}

export const makeId = () => Math.random().toString(36).substring(7);
