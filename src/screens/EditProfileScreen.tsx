import { View, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { useState } from 'react';
import { useUser } from "@/src/context/UserContext";
import BackHeader from '../components/BackHeader';
import UserProfileForm, { UserProfileData } from '../components/UserProfileForm';
import { userService } from '../services/userService';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUser();

    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const profileStyles = createProfileStyles(theme);
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (data: UserProfileData) => {
        setIsLoading(true);

        try {
            const updatedProfile = await userService.updateProfile(data);
            await updateUser(updatedProfile);
            router.replace('/(tabs)/profile');

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Erreur', 'Impossible de sauvegarder le profil');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={screenStyles.container}>
            <BackHeader title="Edit Profil" />

            <UserProfileForm
                initialData={{
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                }}
                onSubmit={handleSubmit}
                submitButtonText="Sauvegarder"
                isLoading={isLoading}
                emailEditable={false} />
        </View>
    );
}