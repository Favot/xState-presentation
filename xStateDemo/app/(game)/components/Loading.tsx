import { StyleSheet, Text, View } from "react-native";

export const Loading = () => {
  return (
    <View style={styles.screenWrapper}>
      <Text>Loading...</Text>
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
});
