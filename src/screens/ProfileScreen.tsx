import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}