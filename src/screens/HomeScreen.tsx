import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Home</Text>
      {/* Votre logique existante */}
    </View>
  );
}