import { Stack } from "expo-router";
import React from "react";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function RoomLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
				},
				headerTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
			}}
		>
			<Stack.Screen name="[id]" options={{ title: "Room" }} />
			<Stack.Screen name="CreateRoom" options={{ title: "Create Room" }} />
			<Stack.Screen name="JoinRoom" options={{ title: "Join Room" }} />
		</Stack>
	);
}
