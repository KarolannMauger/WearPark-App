import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { Calendar } from 'react-native-calendars';
import { createDataHistoryStyles } from '../styles/screens/dataHistoryStyles';
import { MotionDataDecoded } from '@/src/services/motionService';
import LoadingView from '../components/LoadingView';
import MotionChart from '../components/MotionChart';

interface EpisodeData {
    date: string;
    count: number;
    data?: MotionDataDecoded;
}

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

const generateMockEpisodes = (year: number, month: number): EpisodeData[] => {
    const episodes: EpisodeData[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const numDaysWithEpisodes = Math.floor(Math.random() * 6) + 10;

    for (let i = 0; i < numDaysWithEpisodes; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const count = Math.floor(Math.random() * 8) + 1;

        episodes.push({
            date,
            count,
            data: generateMockMotionData(date),
        });
    }

    return episodes;
};
// ========================================

export default function DataHistoryScreen() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const dataHistoryStyles = createDataHistoryStyles(theme);

    const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedData, setSelectedData] = useState<MotionDataDecoded | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const now = new Date();
        loadMonthEpisodes(now.getFullYear(), now.getMonth() + 1);
    }, []);

    const calculateMagnitude = (x: number[], y: number[], z: number[]): number[] => {
        return x.map((_, i) => Math.sqrt(x[i] ** 2 + y[i] ** 2 + z[i] ** 2));
    };

    const loadMonthEpisodes = async (year: number, month: number) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // ========== MODE SIMULATION ==========
            const mockData = generateMockEpisodes(year, month);
            setEpisodes(mockData);

            // ========== MODE RÉEL (à décommenter plus tard) ==========
            // const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00Z`;
            // const endDate = `${year}-${String(month).padStart(2, '0')}-31T23:59:59Z`;
            // const data = await motionService.getAll({ startDate, endDate });
            // 
            // const episodesByDate = data.reduce((acc, item) => {
            //     const date = item.start.toISOString().split('T')[0];
            //     if (!acc[date]) {
            //         acc[date] = { date, count: 0, items: [] };
            //     }
            //     acc[date].count++;
            //     acc[date].items.push(item);
            //     return acc;
            // }, {} as any);
            //
            // const episodesArray = Object.values(episodesByDate).map((e: any) => ({
            //     date: e.date,
            //     count: e.count,
            //     data: e.items[0],
            // }));
            // setEpisodes(episodesArray);
        } catch (error) {
            console.error('Error loading episodes:', error);
        } finally {
            setLoading(false);
        }
    };

    const markedDates = episodes.reduce((acc, episode) => {
        let color = theme.colors.success;
        if (episode.count > 5) color = theme.colors.error;
        else if (episode.count > 2) color = theme.colors.warning;

        acc[episode.date] = {
            marked: true,
            dotColor: color,
            selected: selectedDate === episode.date,
            selectedColor: theme.colors.primary,
        };
        return acc;
    }, {} as any);

    const handleDayPress = (day: any) => {
        const episode = episodes.find(e => e.date === day.dateString);
        setSelectedDate(day.dateString);
        setSelectedData(episode?.data || null);
    };

    // Afficher LoadingView pendant le chargement initial
    if (loading && episodes.length === 0) {
        return (
            <View style={screenStyles.container}>
                <Text style={screenStyles.pageTitle}>Calendrier des épisodes</Text>
                <LoadingView message={"Chargement de l'historique..."} />
            </View>
        );
    }

    return (
        <ScrollView
            style={screenStyles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
        >
            <Text style={screenStyles.pageTitle}>Calendrier des épisodes</Text>

            <Calendar
                key={theme.mode}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                onMonthChange={(month) => {
                    loadMonthEpisodes(month.year, month.month);
                }}
                theme={{
                    backgroundColor: theme.colors.background,
                    calendarBackground: theme.colors.background,
                    textSectionTitleColor: theme.colors.textSecondary,
                    selectedDayBackgroundColor: theme.colors.primary,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: theme.colors.primary,
                    dayTextColor: theme.colors.textPrimary,
                    textDisabledColor: theme.colors.textDisabled,
                    monthTextColor: theme.colors.textPrimary,
                    arrowColor: theme.colors.primary,
                }}
            />

            <View style={dataHistoryStyles.legend}>
                <View style={dataHistoryStyles.legendItem}>
                    <View style={[dataHistoryStyles.dot, { backgroundColor: theme.colors.success }]} />
                    <Text style={dataHistoryStyles.legendText}>1-2 épisodes</Text>
                </View>
                <View style={dataHistoryStyles.legendItem}>
                    <View style={[dataHistoryStyles.dot, { backgroundColor: theme.colors.warning }]} />
                    <Text style={dataHistoryStyles.legendText}>3-5 épisodes</Text>
                </View>
                <View style={dataHistoryStyles.legendItem}>
                    <View style={[dataHistoryStyles.dot, { backgroundColor: theme.colors.error }]} />
                    <Text style={dataHistoryStyles.legendText}>6+ épisodes</Text>
                </View>
            </View>

            {/* TODO: LoadingView pour les données du jour sélectionné */}
            {/* TODO: Afficher un message "Aucun épisode ce jour-là" si selectedData est null après chargement */}
            {selectedData && (
                <View style={dataHistoryStyles.chartsContainer}>
                    <Text style={dataHistoryStyles.chartTitle}>
                        Données du {selectedDate}
                    </Text>

                    <Text style={dataHistoryStyles.subtitle}>Samples: {selectedData.data.ax.length}</Text>

                    <View style={dataHistoryStyles.chartSection}>
                        <Text style={dataHistoryStyles.chartLabel}>Intensité des mouvements (normes)</Text>

                        <MotionChart
                            accelerometerData={calculateMagnitude(
                                selectedData.data.ax.slice(0, 100),
                                selectedData.data.ay.slice(0, 100),
                                selectedData.data.az.slice(0, 100)
                            )}
                            gyroscopeData={calculateMagnitude(
                                selectedData.data.gx.slice(0, 100),
                                selectedData.data.gy.slice(0, 100),
                                selectedData.data.gz.slice(0, 100)
                            )}
                        />
                    </View>

                    <View style={dataHistoryStyles.statsContainer}>
                        <Text style={dataHistoryStyles.statsTitle}>Statistiques</Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Durée: {selectedData.end.getTime() - selectedData.start.getTime()}ms
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Total samples: {selectedData.data.ax.length}
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Fréquence: ~{(selectedData.data.ax.length / ((selectedData.end.getTime() - selectedData.start.getTime()) / 1000)).toFixed(2)} Hz
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Max accélération: {Math.max(...calculateMagnitude(
                                selectedData.data.ax,
                                selectedData.data.ay,
                                selectedData.data.az
                            )).toFixed(2)} m/s²
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Max rotation: {Math.max(...calculateMagnitude(
                                selectedData.data.gx,
                                selectedData.data.gy,
                                selectedData.data.gz
                            )).toFixed(2)} rad/s
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}