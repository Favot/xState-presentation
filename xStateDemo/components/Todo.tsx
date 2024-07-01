import { todoMachine } from "@/machines/todos/todo/todo";
import { useSelector } from "@xstate/react";
import { StyleSheet, Text, View } from "react-native";
import { ActorRefFrom } from "xstate";

export const Todo: React.FC<{
  todoRef: ActorRefFrom<typeof todoMachine>;
}> = ({ todoRef }) => {
  const state = useSelector(todoRef, (s) => s);
  const { label } = state.context;

  const opacity = state.matches({ UPDATE: "SAVING" }) ? 0.5 : 1;

  const todoStyle = [styles.todo, { opacity }];

  return (
    <View style={todoStyle}>
      <Text>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  todo: {},
});
