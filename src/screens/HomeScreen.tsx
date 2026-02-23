import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createHomeStyles } from '../styles/screens/homeStyles';
import { motionService, MotionDayData } from '@/src/services/motionService';
import { useEffect, useState } from 'react';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import MotionChart from '../components/MotionChart';
import { ApiError } from '@/src/errors/ApiError';

export default function HomeScreen() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const homeStyles = createHomeStyles(theme);

  const [todayData, setTodayData] = useState<MotionDayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    setLoading(true);
    setError(null);
    console.log("Loading today's motion data...");
    try {
      // Simulation de date : 2024-01-01
      const SIMULATED_DATE = '2024-01-01T00:00:00Z';
      const data = await motionService.getDayView(SIMULATED_DATE);
    //   const data = await motionService.getTodayView();

      // Toujours stocker les données, même si episodeCount = 0
      setTodayData(data);
    } catch (err: any) {
      console.error('Error loading today data:', err);
      if (err instanceof ApiError) {
        if (err.status === 404) setTodayData(null);
        else setError(err.message);
      } else {
        setError("Erreur inattendue lors du chargement des données.");
      }
    } finally {
      setLoading(false);
    }
  };

  const intensityLabel = todayData
    ? todayData.avgIntensity < 1 ? 'Faible'
      : todayData.avgIntensity < 2 ? 'Modérée'
        : 'Élevée'
    : '--';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m${secs.toString().padStart(2, '0')}s`;
  };

  if (loading) {
    return (
      <View style={screenStyles.container}>
        <Text style={screenStyles.pageTitle}>Tableau de bord</Text>
        <LoadingView message="Chargement des données..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={screenStyles.container}>
        <Text style={screenStyles.pageTitle}>Tableau de bord</Text>
        <ErrorView message={error} onRetry={loadTodayData} />
      </View>
    );
  }

  const graphData = todayData?.graphData?.filter(val => !isNaN(val)) || [];

  return (
    <ScrollView style={screenStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={screenStyles.pageTitle}>Tableau de bord</Text>

      <View style={{ marginBottom: 24 }}>
        <Text style={screenStyles.sectionTitle}>Tremblement récent</Text>

        {graphData.length > 0 ? (
          <>
            <MotionChart
              data={graphData.slice(0, 100)}
              height={200}
              label="Accéléromètre (norme)"
            />
          </>
        ) : (
          <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, padding: 20 }}>
            Aucun épisode détecté aujourd'hui
          </Text>
        )}

        <TouchableOpacity
          onPress={loadTodayData}
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: theme.colors.primary,
            borderRadius: 6,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Recharger</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={screenStyles.sectionTitle}>Résumé du jour</Text>

        <View style={homeStyles.rowContainer}>
          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Intensité moyenne</Text>
            <Text style={homeStyles.info}>{intensityLabel}</Text>
            <Text style={homeStyles.cardSubtitle}>
              {todayData ? todayData.avgIntensity.toFixed(2) : '--'} m/s²
            </Text>
          </View>

          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Durée moyenne</Text>
            <Text style={homeStyles.info}>
              {todayData ? formatDuration(todayData.avgDuration) : '--'}
            </Text>
            <Text style={homeStyles.cardSubtitle}>
              par épisode
            </Text>
          </View>
        </View>

        <View style={homeStyles.rowContainer}>
          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Total épisodes</Text>
            <Text style={homeStyles.info}>{todayData?.episodeCount ?? 0}</Text>
            <Text style={homeStyles.cardSubtitle}>
              aujourd'hui
            </Text>
          </View>

          <View style={homeStyles.cardContainer}>
            <Text style={homeStyles.cardTitle}>Dernier épisode</Text>
            <Text style={homeStyles.info}>
              {todayData?.lastEpisode
                ? new Date(todayData.lastEpisode).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--'}
            </Text>
            <Text style={homeStyles.cardSubtitle}>
              heure
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}