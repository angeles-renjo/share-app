import { View } from "react-native";

import CreateTrip from "@/components/CreateTrip";

export default function CreateRoomScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<CreateTrip />
		</View>
	);
}
