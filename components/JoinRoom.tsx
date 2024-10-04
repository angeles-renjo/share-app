import React, { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";

export default function JoinRoom() {
	const [roomId, setRoomId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleJoinRoom = async () => {
		if (!roomId.trim()) {
			Alert.alert("Error", "Please enter a room ID");
			return;
		}

		setIsLoading(true);

		try {
			// Check if the trip exists
			const { data: trip, error: tripError } = await supabase
				.from("trips")
				.select("id")
				.eq("room_id", roomId)
				.single();

			if (tripError || !trip) {
				Alert.alert("Error", "Invalid room ID");
				setIsLoading(false);
				return;
			}

			// Get the current user
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				Alert.alert("Error", "User not authenticated");
				setIsLoading(false);
				return;
			}

			// Check if the user is already a member of this trip
			const { data: existingMember, error: memberCheckError } = await supabase
				.from("trip_members")
				.select("id")
				.eq("trip_id", trip.id)
				.eq("user_id", user.id)
				.single();

			if (existingMember) {
				// User is already a member, just navigate to the room
				router.push({
					pathname: "/(app)/(protected)/room/[id]",
					params: { id: trip.id },
				});
				return;
			}

			// Add the user to trip_members
			const { error: memberError } = await supabase
				.from("trip_members")
				.insert({ trip_id: trip.id, user_id: user.id, role: "member" });

			if (memberError) {
				Alert.alert("Error", "Failed to join the room");
				setIsLoading(false);
				return;
			}

			Alert.alert("Success", "You have joined the room");
			router.push({
				pathname: "/(app)/(protected)/room/[id]",
				params: { id: trip.id },
			});
		} catch (error) {
			console.error("Error joining room:", error);
			Alert.alert("Error", "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<Stack.Screen options={{ title: "Join Room" }} />
			<View className="flex-1 justify-center items-center p-4">
				<Text className="text-2xl font-bold mb-4">Join a Room</Text>
				<TextInput
					className="w-full p-2 border border-gray-300 rounded mb-4"
					placeholder="Enter Room ID"
					value={roomId}
					onChangeText={setRoomId}
				/>
				<Button onPress={handleJoinRoom} disabled={isLoading}>
					<Text>{isLoading ? "Joining..." : "Join Room"}</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}
