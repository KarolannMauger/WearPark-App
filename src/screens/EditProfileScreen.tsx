import React from 'react';
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useState } from "react";
import { useUser } from "@/src/context/UserContext";
import BackHeader from "../components/BackHeader";
import UserProfileForm from "../components/UserProfileForm";
import { userService } from "../services/userService";
import { PatchUserRequest, User } from "@/src/types/user";

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUser();

    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: PatchUserRequest) => {
        setIsLoading(true);

        try {
            await userService.updateProfile(data);

            const refreshedUser = await userService.getProfile();
            await updateUser(refreshedUser);

            router.push("/(tabs)/profile");
        } catch (error) {
            Alert.alert("Erreur", "Impossible de sauvegarder le profil");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <View style={screenStyles.container}>
            <BackHeader title="Modifier le profil" />

            <UserProfileForm
                initialData={user}
                onSubmit={handleSubmit}
                submitButtonText="Sauvegarder"
                isLoading={isLoading}
                emailEditable={false}
            />
        </View>
    );
}