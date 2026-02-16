import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createHomeStyles } from '../styles/screens/homeStyles';

export default function HomeScreen() {
  const router = useRouter();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const homeStyles = createHomeStyles(theme);

  return (
    <View style={screenStyles.container}>
      <Text style={screenStyles.pageTitle}> Tableau de bord </Text>
      <View>
        <Text style={screenStyles.sectionTitle}>Tremblement en temps réel</Text>

        <Text style={screenStyles.sectionTitleSmall}>Tremblements</Text>
        <Text>x{ }</Text>

      </View>

      <View>
        <Text style={screenStyles.sectionTitle}>Résumé du jour</Text>

        <View style={homeStyles.rowContainer}>
          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Intensité moyenne</Text>
            <Text style={homeStyles.info}>{ }Faible</Text>
          </View>
          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Durée moyenne des épisodes</Text>
            <Text style={homeStyles.info}>{ }2m15s</Text>
          </View>
        </View>
      </View>
    </View>
  );
}