import { View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import UserProfileForm from '../components/UserProfileForm';
import { userService } from '../services/userService';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      await userService.updateProfile(data);

      await updateUser(data);

      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[screenStyles.container, { paddingTop: 60 }]}>
      <Text style={theme.typography.h2}>Veuillez compléter votre profil</Text>
      <Text style={[theme.typography.bodySmall, { marginBottom: 6 }]}>
        Afin de nous aider à personnaliser votre expérience, veuillez remplir les champs suivants.
      </Text>
      <Text style={[theme.typography.bodySmall, { marginBottom: 20 }]}>
        Vous pourrez modifier ces informations dans la section profil par la suite.
      </Text>

      <UserProfileForm
        initialData={user ?? undefined} // prérempli avec email après register
        onSubmit={handleSubmit}
        submitButtonText="Continuer"
        isLoading={isLoading}
        emailEditable={false} // l'email reste non modifiable
      />
    </View>
  );
}