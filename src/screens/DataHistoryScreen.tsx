import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { Calendar } from 'react-native-calendars';
import { createDataHistoryStyles } from '../styles/screens/dataHistoryStyles';
import { motionService, MotionMonthData, MotionDayData } from '@/src/services/motionService';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import MotionChart from '../components/MotionChart';
import { ApiError } from '@/src/errors/ApiError';

// ========== SIMULATION DONNÉES API ==========
const generateMockMonthData = (year: number, month: number): MotionMonthData => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const numDaysWithEpisodes = Math.floor(Math.random() * 6) + 10;

    const episodes: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < numDaysWithEpisodes; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1;
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const count = Math.floor(Math.random() * 8) + 1;

        episodes.push({ date, count });
    }

    return { year, month, episodes };
};

const generateMockDayData = (date: string): MotionDayData => {
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
        date: new Date(date),
        avgIntensity: 1.2 + Math.random() * 0.8,
        avgDuration: 2 + Math.random() * 3,
        episodeCount: Math.floor(Math.random() * 5) + 3,
        lastEpisode: new Date(`${date}T${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:00:00Z`),
        graphData: graphData,
        graphStart: new Date(date),
        graphEnd: new Date(date),
        graphMax: Math.max(...graphData),
        graphMin: Math.min(...graphData),
    };
};
// ========================================

export default function DataHistoryScreen() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const dataHistoryStyles = createDataHistoryStyles(theme);

    const [monthData, setMonthData] = useState<MotionMonthData | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDayData, setSelectedDayData] = useState<MotionDayData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDay, setLoadingDay] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDay, setErrorDay] = useState<string | null>(null);


    useEffect(() => {
        const now = new Date();
        loadMonthEpisodes(now.getFullYear(), now.getMonth() + 1);
    }, []);

    const loadMonthEpisodes = async (year: number, month: number) => {
        setLoading(true);
        setError(null);

        try {
            const data = await motionService.getMonthView(year, month);
            setMonthData(data);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Erreur inattendue.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = async (day: any) => {
        setSelectedDate(day.dateString);
        setLoadingDay(true);
        setErrorDay(null);
        setSelectedDayData(null);

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // ========== MODE SIMULATION ==========
            const episode = monthData?.episodes.find(e => e.date === day.dateString);
            if (episode) {
                const mockDayData = generateMockDayData(day.dateString);
                setSelectedDayData(mockDayData);
            } else {
                setSelectedDayData(null);
            }

            // ========== MODE RÉEL (à décommenter plus tard) ==========
            // const dayData = await motionService.getDayView(day.dateString);
            // setSelectedDayData(dayData);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 404) {
                    setSelectedDayData(null);
                } else {
                    setErrorDay(err.message);
                }
            } else {
                setErrorDay("Erreur inattendue lors du chargement des données du jour.");
            }
        } finally {
            setLoadingDay(false);
        }
    };


    const markedDates = monthData?.episodes.reduce((acc, episode) => {
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
    }, {} as any) || {};

    if (loading && !monthData) {
        return (
            <View style={screenStyles.container}>
                <Text style={screenStyles.pageTitle}>Calendrier des épisodes</Text>
                <LoadingView message="Chargement de l'historique..." />
            </View>
        );
    }

    if (error && !monthData) {
        return (
            <View style={screenStyles.container}>
                <Text style={screenStyles.pageTitle}>Calendrier des épisodes</Text>
                <ErrorView
                    message={error}
                    onRetry={() => {
                        const now = new Date();
                        loadMonthEpisodes(now.getFullYear(), now.getMonth() + 1);
                    }}
                />
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

            {loadingDay && (
                <LoadingView message="Chargement des données..." />
            )}

            {errorDay && (
                <View style={{ padding: 20 }}>
                    <ErrorView
                        message={errorDay}
                        onRetry={() => selectedDate && handleDayPress({ dateString: selectedDate })}
                    />
                </View>
            )}

             {!loadingDay && !errorDay && selectedDate && !selectedDayData && (
                <Text style={dataHistoryStyles.emptyText}>
                    Aucun épisode ce jour-là
                </Text>
            )}

            {!loadingDay && !errorDay && selectedDayData && (
                <View style={dataHistoryStyles.chartsContainer}>
                    <Text style={dataHistoryStyles.chartTitle}>
                        Données du {selectedDate}
                    </Text>

                    <Text style={dataHistoryStyles.subtitle}>
                        {selectedDayData.episodeCount} épisode(s) - {selectedDayData.graphData.length} samples
                    </Text>

                    <View style={dataHistoryStyles.chartSection}>
                        <Text style={dataHistoryStyles.chartLabel}>Intensité des mouvements</Text>

                        <MotionChart
                            data={selectedDayData.graphData.slice(0, 100)}
                            label="Accéléromètre (norme)"
                        />
                    </View>

                    <View style={dataHistoryStyles.statsContainer}>
                        <Text style={dataHistoryStyles.statsTitle}>Statistiques</Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Intensité moyenne: {selectedDayData.avgIntensity.toFixed(2)} m/s²
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Durée moyenne: {Math.floor(selectedDayData.avgDuration / 60)}m{Math.floor(selectedDayData.avgDuration % 60)}s
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Max: {selectedDayData.graphMax.toFixed(2)} m/s²
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Min: {selectedDayData.graphMin.toFixed(2)} m/s²
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}