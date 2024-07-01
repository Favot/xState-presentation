import { QuizSend, QuizSnapshot, Tags } from "@/machines/quiz/types";
import React from "react";
import { Completed } from "./components/Completed";
import { Error } from "./components/Error";
import { Loading } from "./components/Loading";
import { QuestionDisplay } from "./components/QuestionDisplay";

type Props = {
  send: QuizSend;
  state: QuizSnapshot;
};

export default function QuizScreen({ send, state }: Props) {
  if (state.hasTag(Tags.Error)) return <Error send={send} />;

  if (state.hasTag(Tags.Loading)) return <Loading />;

  if (state.hasTag(Tags.Completed))
    return <Completed score={state.context.score} send={send} />;

  return <QuestionDisplay state={state} send={send} />;
}
