import { QuizSend, QuizSnapshot, Tags } from "@/machines/quiz/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  state: QuizSnapshot;
  send: QuizSend;
};

export const QuestionDisplay = ({ state, send }: Props) => {
  const {
    answer_a,
    answer_b,
    answer_c,
    answer_d,
    answer_explanation,
    question_prompt,
  } = state.context.questionsToAks[0];

  const answerShuffle = shuffleAnswers([
    answer_a,
    answer_b,
    answer_c,
    answer_d,
  ]);

  const handleAnswer = (answer: string) => {
    send({
      type: "Player Presses Answer",
      answer,
    });
  };
  const shouldDisplayAnswerExplanation =
    state.hasTag(Tags.CorrectAnswer) || state.hasTag(Tags.IncorrectAnswer);

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.promptWrapper}>
        <Text>Question left: {state.context.questionsToAks.length}</Text>
        <Text>{question_prompt}</Text>
      </View>
      {state.hasTag(Tags.QuestionDisplayed) && (
        <View style={styles.answerWrapper}>
          {answerShuffle.map((answer) => (
            <Pressable
              key={answer}
              onPress={() => handleAnswer(answer)}
              style={styles.button}
            >
              <Text style={styles.text}>{answer}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {state.hasTag(Tags.CorrectAnswer) && (
        <Text style={styles.correctText}>Correct!</Text>
      )}
      {state.hasTag(Tags.IncorrectAnswer) && (
        <Text style={styles.incorrectText}>Incorrect!</Text>
      )}
      {shouldDisplayAnswerExplanation && <Text>{answer_explanation}</Text>}
      {state.hasTag(Tags.QuestionAnswered) && (
        <Pressable
          onPress={() => send({ type: "Proceed to Next Question" })}
          style={styles.button}
        >
          <Text style={styles.text}>Next question</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  promptWrapper: {
    paddingBottom: 20,
    textAlign: "center",
    gap: 20,
    alignItems: "center",
  },
  answerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-around",
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
  correctText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  incorrectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});

function shuffleAnswers(answers: string[]) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}
