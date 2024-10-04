import { View } from "react-native";

import JoinRoom from "@/components/JoinRoom";

export default function JoinRoomScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<JoinRoom />
		</View>
	);
}
