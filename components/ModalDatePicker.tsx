import React from "react";
import { View, Modal, Platform, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { H1, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface ModalDatePickerProps {
	isVisible: boolean;
	onClose: () => void;
	onDateChange: (date: Date) => void;
	selectedDate: Date;
	minimumDate?: Date;
	title: string;
}

export default function ModalDatePicker({
	isVisible,
	onClose,
	onDateChange,
	selectedDate,
	minimumDate,
	title,
}: ModalDatePickerProps) {
	const handleDateChange = (event: any, date?: Date) => {
		if (date) {
			onDateChange(date);
			if (Platform.OS === "android") {
				onClose();
			}
		}
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View className="flex-1 justify-center items-center bg-black/50">
					<TouchableWithoutFeedback>
						<View className="bg-background p-4 rounded-lg w-5/6 max-w-sm">
							<H1 className="text-center mb-4">{title}</H1>
							<DateTimePicker
								testID="dateTimePicker"
								value={selectedDate}
								mode="date"
								display={Platform.OS === "ios" ? "default" : "default"}
								onChange={handleDateChange}
								minimumDate={minimumDate}
								style={{ width: "100%" }}
							/>
							<View className="flex-row justify-center mt-4">
								<Button onPress={onClose} variant="outline" className="mr-2">
									<Text>Cancel</Text>
								</Button>
								<Button
									onPress={() => {
										onDateChange(selectedDate);
										onClose();
									}}
								>
									<Text>Confirm</Text>
								</Button>
							</View>
							<Muted className="text-center mt-4">
								Select a date and tap confirm.
							</Muted>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}
