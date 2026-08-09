import { Text, View, StyleSheet } from "react-native";

export default function cart() {
    return (
        <View style={styles.container}>
            <Text>Cart.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});