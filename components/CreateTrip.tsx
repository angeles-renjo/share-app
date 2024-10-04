import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
	ActivityIndicator,
	View,
	TouchableOpacity,
	Platform,
} from "react-native";
import * as z from "zod";
import { useRouter } from "expo-router";
import ModalDatePicker from "./ModalDatePicker";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";
import { supabase } from "@/config/supabase";

const createTripSchema = z
	.object({
		tripName: z.string().min(1, "Trip name is required"),
		startDate: z
			.date()
			.min(
				new Date(new Date().setHours(0, 0, 0, 0)),
				"Start date must be today or later",
			),
		endDate: z.date(),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: "End date must be after start date",
		path: ["endDate"],
	});

type CreateTripFormData = z.infer<typeof createTripSchema>;

export default function CreateTrip() {
	const router = useRouter();
	const { user } = useSupabase();

	const [showStartDate, setShowStartDate] = useState(false);
	const [showEndDate, setShowEndDate] = useState(false);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const form = useForm<CreateTripFormData>({
		resolver: zodResolver(createTripSchema),
		defaultValues: {
			tripName: "",
			startDate: today,
			endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
		},
	});

	const onSubmit = async (data: CreateTripFormData) => {
		if (!user) {
			console.error("No authenticated user found");
			return;
		}

		try {
			const { data: trip, error } = await supabase
				.from("trips")
				.insert([
					{
						name: data.tripName,
						start_date: data.startDate.toISOString(),
						end_date: data.endDate.toISOString(),
						user_id: user.id,
						owner_id: user.id, // Add this line to include owner_id
					},
				])
				.single();

			if (error) throw error;

			console.log("Trip created:", trip);
			router.push("/(app)/(protected)/");
		} catch (error) {
			console.error("Error creating trip:", error);
			// Handle error (show error message to user)
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
			<View className="flex-1 gap-4 web:m-4">
				<H1 className="self-start">Create a New Trip</H1>

				<Form {...form}>
					<View className="gap-4">
						<FormField
							control={form.control}
							name="tripName"
							render={({ field }) => (
								<FormInput
									label="Trip Name"
									placeholder="Enter trip name"
									{...field}
								/>
							)}
						/>

						<Controller
							control={form.control}
							name="startDate"
							render={({ field: { onChange, value } }) => (
								<>
									<Text>Start Date</Text>
									<TouchableOpacity
										onPress={() => setShowStartDate(true)}
										className="mb-4 p-2 border border-gray-300 rounded"
									>
										<Text>{value.toDateString()}</Text>
									</TouchableOpacity>
									<ModalDatePicker
										isVisible={showStartDate}
										onClose={() => setShowStartDate(false)}
										onDateChange={(date) => {
											onChange(date);
											setShowStartDate(false);
										}}
										selectedDate={value}
										minimumDate={today}
										title="Select Start Date"
									/>
								</>
							)}
						/>
						<Controller
							control={form.control}
							name="endDate"
							render={({ field: { onChange, value } }) => (
								<>
									<Text>End Date</Text>
									<TouchableOpacity
										onPress={() => setShowEndDate(true)}
										className="mb-4 p-2 border border-gray-300 rounded"
									>
										<Text>{value.toDateString()}</Text>
									</TouchableOpacity>
									<ModalDatePicker
										isVisible={showEndDate}
										onClose={() => setShowEndDate(false)}
										onDateChange={(date) => {
											onChange(date);
											setShowEndDate(false);
										}}
										selectedDate={value}
										minimumDate={form.getValues("startDate")}
										title="Select End Date"
									/>
								</>
							)}
						/>
					</View>
				</Form>
			</View>
			<Button
				size="default"
				variant="default"
				onPress={form.handleSubmit(onSubmit)}
				disabled={form.formState.isSubmitting}
				className="web:m-4"
			>
				{form.formState.isSubmitting ? (
					<ActivityIndicator size="small" />
				) : (
					<Text>Create Trip</Text>
				)}
			</Button>
		</SafeAreaView>
	);
}
