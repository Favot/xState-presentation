import { quizMachine } from "@/machines/quiz/quiz";
import { QuizSend, QuizSnapshot, Tags } from "@/machines/quiz/types";
import { useMachine } from "@xstate/react";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import QuizScreen from "./(game)/game";

export default function Page() {
  const [state, send] = useMachine(quizMachine);

  if (state.hasTag(Tags.HomeScreen))
    return <HomeScreen state={state} send={send} />;

  if (state.hasTag(Tags.QuizScreen))
    return <QuizScreen state={state} send={send} />;
}

type Props = {
  state: QuizSnapshot;
  send: QuizSend;
};

function HomeScreen({ send }: Props) {
  const onPressStartGame = () => {
    send({ type: "Navigate to game screen" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to this introduction to xState!</Text>
      <Pressable style={styles.button} onPress={onPressStartGame}>
        <Text style={styles.text}>{"Start game"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
