import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function HomeScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<View className="flex-1 justify-center items-center p-4">
				<Text className="text-2xl font-bold mb-4">Welcome to Trip Tracker</Text>
				<Button
					onPress={() => router.push("/(app)/(protected)/room/CreateRoom")}
					className="mb-4"
				>
					<Text>Create a New Trip</Text>
				</Button>
				<Button onPress={() => router.push("/(app)/(protected)/room/JoinRoom")}>
					<Text>Join a Room</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}
