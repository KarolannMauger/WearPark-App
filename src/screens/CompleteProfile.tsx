import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import UserProfileForm, { UserProfileData } from '../components/UserProfileForm';
import { userService } from '../services/userService';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { updateUser } = useUser();
  const theme = useTheme();
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
      router.replace('/(tabs)/home');
      
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <UserProfileForm
        onSubmit={handleSubmit}
        submitButtonText="Continuer"
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});