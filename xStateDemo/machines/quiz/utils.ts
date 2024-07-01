import { RandomQuestionList } from "./types";

export async function fetchRandomQuestions(): Promise<RandomQuestionList> {
  try {
    const response = await fetch("http://localhost:3000/questions");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
}
