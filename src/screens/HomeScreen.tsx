import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createHomeStyles } from '../styles/screens/homeStyles';
import { motionService, MotionDayData } from '@/src/services/motionService';
import { useEffect, useState } from 'react';
import LoadingView from '../components/LoadingView';
import MotionChart from '../components/MotionChart';

// ========== SIMULATION DONNÉES API ==========
const generateMockDayData = (): MotionDayData => {
    const today = new Date();
    const episodeCount = Math.floor(Math.random() * 5) + 3;
    
    // Générer des données de graphique réalistes
    const graphData: number[] = [];
    for (let i = 0; i < 150; i++) {
        const t = i * 0.01;
        const tremblePhase = Math.sin(t * 0.5);
        const isActive = tremblePhase > -0.3;
        
        if (isActive) {
            const amplitude = (0.5 + Math.random() * 0.5);
            const noise = (Math.random() - 0.5) * 0.3;
            graphData.push(amplitude * Math.sin(2 * Math.PI * 4.5 * t) + noise + 9.8);
        } else {
            graphData.push(9.8 + (Math.random() - 0.5) * 0.1);
        }
    }
    
    return {
        date: today,
        avgIntensity: 1.2 + Math.random() * 0.8,
        avgDuration: 2 + Math.random() * 3, // 2-5 secondes
        episodeCount: episodeCount,
        lastEpisode: new Date(today.getTime() - Math.random() * 3600000),
        graphData: graphData,
        graphStart: new Date(today.getTime() - 7200000),
        graphEnd: new Date(today.getTime() - 7198000),
        graphMax: Math.max(...graphData),
        graphMin: Math.min(...graphData),
    };
};
// ========================================

export default function HomeScreen() {
    const router = useRouter();
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const homeStyles = createHomeStyles(theme);

    const [todayData, setTodayData] = useState<MotionDayData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTodayData();
    }, []);

    const loadTodayData = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // ========== MODE SIMULATION ==========
            const mockData = generateMockDayData();
            setTodayData(mockData);

            // ========== MODE RÉEL (à décommenter plus tard) ==========
            // const data = await motionService.getTodayView();
            // setTodayData(data);
        } catch (error) {
            console.error('Error loading today data:', error);
        } finally {
            setLoading(false);
        }
    };

    const intensityLabel = todayData
        ? (todayData.avgIntensity < 1 ? 'Faible'
            : todayData.avgIntensity < 2 ? 'Modérée'
                : 'Élevée')
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

    return (
        <ScrollView style={screenStyles.container} showsVerticalScrollIndicator={false}>
            <Text style={screenStyles.pageTitle}>Tableau de bord</Text>

            {/* Graphique temps réel */}
            <View style={{ marginBottom: 24 }}>
                <Text style={screenStyles.sectionTitle}>Tremblement récent</Text>

                {todayData ? (
                    <>
                        <Text style={screenStyles.sectionTitleSmall}>
                            Dernière mesure à {todayData.lastEpisode?.toLocaleTimeString()}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.textSecondary,
                            marginBottom: 16
                        }}>
                            {todayData.episodeCount} épisode(s) aujourd'hui
                        </Text>

                        <MotionChart
                            data={todayData.graphData.slice(0, 100)}
                            height={200}
                            label="Accéléromètre (norme)"
                        />
                    </>
                ) : (
                    <Text style={{
                        textAlign: 'center',
                        color: theme.colors.textSecondary,
                        padding: 20
                    }}>
                        Aucun épisode détecté aujourd'hui
                    </Text>
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
                                ? todayData.lastEpisode.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '--'
                            }
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