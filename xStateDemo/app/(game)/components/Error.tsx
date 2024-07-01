import { QuizSend } from "@/machines/quiz/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function Error({ send }: { send: QuizSend }) {
  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.errorText}>Loading Error</Text>
      <Pressable
        onPress={() => send({ type: "Proceed to Next Question" })}
        style={styles.button}
      >
        <Text style={styles.text}>Press to Reload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
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
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
