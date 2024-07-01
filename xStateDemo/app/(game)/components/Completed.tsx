import { QuizSend } from "@/machines/quiz/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  send: QuizSend;
  score: number;
};

export const Completed = ({ score, send }: Props) => {
  const navigateToHome = () => {
    send({ type: "Navigate to Home Screen" });
  };

  return (
    <View style={styles.screenWrapper}>
      <Text>Game Completed!</Text>
      <Text>Your score is {score} </Text>
      <Pressable onPress={navigateToHome} style={styles.button}>
        <Text style={styles.text}>Back to main menu</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: "100%",
    backgroundColor: "navy",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
