import { View, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { useState } from 'react';
import { useUser } from "@/src/context/UserContext";
import BackHeader from '../components/BackHeader';
import UserProfileForm, { UserProfileData } from '../components/UserProfileForm';

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
            // MODE SIMULATION - Commentez cette section quand l'API est prête
            console.log('📝 Données du formulaire (simulé):', data);

            // Simuler un délai d'API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simuler la réponse de l'API
            const mockProfile = {
                id: 'mock-id-123',
                ...data,
            };

            // Mettre à jour le contexte utilisateur
            await updateUser(mockProfile);

            Alert.alert('Succès', 'Profil sauvegardé (mode simulation)');

            // Rediriger vers home
            router.replace('/(tabs)/profile');

            // MODE PRODUCTION - Décommentez quand l'API est prête
            // const updatedProfile = await userService.updateProfile(data);
            // await updateUser(updatedProfile);
            // router.replace('/(tabs)/home');

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Erreur', 'Impossible de sauvegarder le profil (simulé)');
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