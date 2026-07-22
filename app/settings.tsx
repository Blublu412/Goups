
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 32,
        textAlign: "left",
    },
    subtitle: {
        fontSize: 16
    },
    spacer: {
        marginVertical: 8,
    },
    row:{
        flexDirection: "row",
        alignContent: "center",
        gap: 6
    },
    premissionContainer:{
        backgroundColor: "#e6f5fa",
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between"
    },
    permissionText: {
        marginLeft: 10,
        flexShrink: 1,
    }
});