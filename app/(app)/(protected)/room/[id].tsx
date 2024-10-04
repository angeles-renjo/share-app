import React from "react";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/safe-area-view";

export default function RoomScreen() {
	const { id } = useLocalSearchParams();

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<Stack.Screen options={{ title: "Room" }} />
			<View className="flex-1 p-4">
				<Text>Room ID: {id}</Text>
				<Text>hi this where the map</Text>
			</View>
		</SafeAreaView>
	);
}
