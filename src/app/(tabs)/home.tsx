import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Home</Text>
      <Button 
        title="Aller au profil" 
        onPress={() => router.push('/profile')}
      />
    </View>
  );
}