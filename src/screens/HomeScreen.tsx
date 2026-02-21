import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createHomeStyles } from '../styles/screens/homeStyles';
import { MotionDataDecoded } from '@/src/services/motionService';
import { useEffect, useState } from 'react';
import LoadingView from '../components/LoadingView';
import MotionChart from '../components/MotionChart';

// ========== DONNÉES SIMULÉES ==========
const generateMockMotionData = (date: string): MotionDataDecoded => {
  const numSamples = 150;
  const ax: number[] = [];
  const ay: number[] = [];
  const az: number[] = [];
  const gx: number[] = [];
  const gy: number[] = [];
  const gz: number[] = [];

  const trembleFrequency = 4.5;
  const timeStep = 0.01;

  for (let i = 0; i < numSamples; i++) {
    const t = i * timeStep;
    const tremblePhase = Math.sin(t * 0.5);
    const isActive = tremblePhase > -0.3;

    if (isActive) {
      const trembleAmplitude = (0.5 + Math.random() * 0.5);
      const noise = (Math.random() - 0.5) * 0.3;

      ax.push(trembleAmplitude * Math.sin(2 * Math.PI * trembleFrequency * t) + noise);
      ay.push(trembleAmplitude * Math.cos(2 * Math.PI * trembleFrequency * t + 0.5) + noise);
      az.push(9.8 + trembleAmplitude * 0.5 * Math.sin(2 * Math.PI * trembleFrequency * t + 1) + noise);

      gx.push(trembleAmplitude * 0.4 * Math.sin(2 * Math.PI * trembleFrequency * t));
      gy.push(trembleAmplitude * 0.4 * Math.cos(2 * Math.PI * trembleFrequency * t));
      gz.push(trembleAmplitude * 0.3 * Math.sin(2 * Math.PI * trembleFrequency * t + 0.8));
    } else {
      const microNoise = (Math.random() - 0.5) * 0.1;

      ax.push(microNoise);
      ay.push(microNoise * 0.8);
      az.push(9.8 + microNoise * 0.5);

      gx.push(microNoise * 0.05);
      gy.push(microNoise * 0.05);
      gz.push(microNoise * 0.05);
    }

    if (Math.random() > 0.9) {
      const spike = (Math.random() - 0.5) * 2;
      ax[ax.length - 1] += spike;
      ay[ay.length - 1] += spike * 0.8;
      gx[gx.length - 1] += spike * 0.3;
    }
  }

  const startTime = new Date(`${date}T${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`);
  const endTime = new Date(startTime.getTime() + 2000);

  return {
    id: `mock-${date}-${Math.random().toString(36).substr(2, 9)}`,
    start: startTime,
    end: endTime,
    data: { ax, ay, az, gx, gy, gz },
  };
};

const generateTodayEpisodes = (): MotionDataDecoded[] => {
  const today = new Date().toISOString().split('T')[0];
  const numEpisodes = Math.floor(Math.random() * 5) + 3; // 3-7 épisodes

  const episodes: MotionDataDecoded[] = [];
  for (let i = 0; i < numEpisodes; i++) {
    episodes.push(generateMockMotionData(today));
  }

  return episodes;
};
// ========================================

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const homeStyles = createHomeStyles(theme);
  const { width: windowWidth } = useWindowDimensions();

  const [todayEpisodes, setTodayEpisodes] = useState<MotionDataDecoded[]>([]);
  const [latestEpisode, setLatestEpisode] = useState<MotionDataDecoded | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger les données du jour au démarrage
  useEffect(() => {
    loadTodayData();
  }, []);

  const calculateMagnitude = (x: number[], y: number[], z: number[]): number[] => {
    return x.map((_, i) => Math.sqrt(x[i] ** 2 + y[i] ** 2 + z[i] ** 2));
  };

  const loadTodayData = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // ========== MODE SIMULATION ==========
      const episodes = generateTodayEpisodes();
      setTodayEpisodes(episodes);
      setLatestEpisode(episodes[episodes.length - 1]); // Le plus récent

      // ========== MODE RÉEL (à décommenter plus tard) ==========
      // const today = new Date().toISOString().split('T')[0];
      // const startDate = `${today}T00:00:00Z`;
      // const endDate = `${today}T23:59:59Z`;
      // const data = await motionService.getAll({ startDate, endDate });
      // setTodayEpisodes(data);
      // setLatestEpisode(data[data.length - 1]);
      // ========================================
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (data: number[]) => {
    return data.map((value, index) => ({
      value: value,
      label: index % 10 === 0 ? index.toString() : '',
    }));
  };

  // Calculer les statistiques du jour
  const avgIntensity = todayEpisodes.length > 0
    ? todayEpisodes.reduce((sum, ep) => {
      const accMag = calculateMagnitude(ep.data.ax, ep.data.ay, ep.data.az);
      return sum + Math.max(...accMag);
    }, 0) / todayEpisodes.length
    : 0;

  const avgDuration = todayEpisodes.length > 0
    ? todayEpisodes.reduce((sum, ep) =>
      sum + (ep.end.getTime() - ep.start.getTime()), 0
    ) / todayEpisodes.length / 1000 // en secondes
    : 0;

  const intensityLabel = avgIntensity < 1 ? 'Faible'
    : avgIntensity < 2 ? 'Modérée'
      : 'Élevée';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <ScrollView style={screenStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={screenStyles.pageTitle}>Tableau de bord</Text>

      {loading ? (
        <LoadingView />
      ) : (
        <>
          {/* Graphique temps réel */}
          <View style={{ marginBottom: 24 }}>
            <Text style={screenStyles.sectionTitle}>Tremblement récent</Text>

            {latestEpisode && (
              <>
                <Text style={screenStyles.sectionTitleSmall}>
                  Dernière mesure à {latestEpisode.start.toLocaleTimeString()}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 16 }}>
                  {todayEpisodes.length} épisode(s) aujourd'hui
                </Text>

                <MotionChart
                  accelerometerData={calculateMagnitude(
                    latestEpisode.data.ax.slice(0, 100),
                    latestEpisode.data.ay.slice(0, 100),
                    latestEpisode.data.az.slice(0, 100)
                  )}
                  gyroscopeData={calculateMagnitude(
                    latestEpisode.data.gx.slice(0, 100),
                    latestEpisode.data.gy.slice(0, 100),
                    latestEpisode.data.gz.slice(0, 100)
                  )}
                  height={200}
                />
              </>
            )}
          </View>

          {/* Résumé du jour */}
          <View>
            <Text style={screenStyles.sectionTitle}>Résumé du jour</Text>

            <View style={homeStyles.rowContainer}>
              <View style={homeStyles.cardContainer}>
                <Text style={homeStyles.cardTitle}>Intensité moyenne</Text>
                <Text style={homeStyles.info}>{intensityLabel}</Text>
                <Text style={homeStyles.cardSubtitle}>
                  {avgIntensity.toFixed(2)} m/s²
                </Text>
              </View>

              <View style={homeStyles.cardContainer}>
                <Text style={homeStyles.cardTitle}>Durée moyenne</Text>
                <Text style={homeStyles.info}>
                  {todayEpisodes.length > 0 ? formatDuration(avgDuration) : '--'}
                </Text>
                <Text style={homeStyles.cardSubtitle}>
                  par épisode
                </Text>
              </View>
            </View>

            <View style={homeStyles.rowContainer}>
              <View style={homeStyles.cardContainer}>
                <Text style={homeStyles.cardTitle}>Total épisodes</Text>
                <Text style={homeStyles.info}>{todayEpisodes.length}</Text>
                <Text style={homeStyles.cardSubtitle}>
                  aujourd'hui
                </Text>
              </View>

              <View style={homeStyles.cardContainer}>
                <Text style={homeStyles.cardTitle}>Dernier épisode</Text>
                <Text style={homeStyles.info}>
                  {latestEpisode
                    ? latestEpisode.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--'
                  }
                </Text>
                <Text style={homeStyles.cardSubtitle}>
                  heure
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}