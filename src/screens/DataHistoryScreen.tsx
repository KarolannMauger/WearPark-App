import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';
import { Calendar } from 'react-native-calendars';
import { createDataHistoryStyles } from '../styles/screens/dataHistoryStyles';
import { motionService } from '@/src/services/motionService';
import { MotionMonthData, MotionDayData } from '@/src/types/motion';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import MotionChart from '../components/MotionChart';
import { ApiError } from '@/src/errors/ApiError';

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
        loadMonth(new Date().toISOString());
    }, []);

    const loadMonth = async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await motionService.getMonthView(date);
            setMonthData(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = async (day: any) => {
        setSelectedDate(day.dateString);
        setLoadingDay(true);
        setErrorDay(null);
        setSelectedDayData(null);

        try {
            const dayData = await motionService.getDayView(new Date(day.dateString).toISOString());
            setSelectedDayData(dayData);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 404) setSelectedDayData(null);
                else setErrorDay(err.message);
            } else {
                setErrorDay('Erreur inattendue lors du chargement des données du jour.');
            }
        } finally {
            setLoadingDay(false);
        }
    };

    const daysByDate = monthData?.days.reduce((acc, day) => {
        const dateKey = new Date(day.start).toISOString().split('T')[0];
        acc[dateKey] = day;
        return acc;
    }, {} as Record<string, MotionMonthData['days'][number]>) ?? {};

    const markedDates = Object.keys(daysByDate).reduce((acc, dateKey) => {
        acc[dateKey] = {
            marked: true,
            dotColor: theme.colors.primary,
            selected: selectedDate === dateKey,
            selectedColor: theme.colors.primary,
        };
        return acc;
    }, {} as any);

    if (selectedDate && !markedDates[selectedDate]) {
        markedDates[selectedDate] = {
            selected: true,
            selectedColor: theme.colors.primary,
        };
    }

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
                    onRetry={() => loadMonth(new Date().toISOString())}
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
                    const date = new Date(month.year, month.month - 1, 1).toISOString();
                    loadMonth(date);
                }}
                dayComponent={({ date, state }: any) => {
                    const dayKey = date?.dateString ?? '';
                    const day = daysByDate[dayKey];
                    const amplitude = day?.meanAmplitude;
                    const isSelected = selectedDate === dayKey;
                    const isToday = state === 'today';

                    return (
                        <View
                            onTouchEnd={() => handleDayPress({ dateString: dayKey })}
                            style={{ alignItems: 'center', paddingVertical: 4 }}
                        >
                            <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: isToday ? '700' : '400',
                                    color: isSelected
                                        ? '#fff'
                                        : state === 'disabled'
                                            ? theme.colors.textSecondary
                                            : theme.colors.textPrimary,
                                }}>
                                    {date?.day}
                                </Text>
                            </View>

                            <Text style={{
                                fontSize: 9,
                                color: day
                                    ? theme.colors.primary
                                    : theme.colors.textSecondary,
                                marginTop: 1,
                            }}>
                                {day
                                    ? amplitude != null ? amplitude.toFixed(1) : '-'
                                    : ' '}
                            </Text>
                        </View>
                    );
                }}
                theme={{
                    backgroundColor: theme.colors.background,
                    calendarBackground: theme.colors.background,
                    textSectionTitleColor: theme.colors.textSecondary,
                    selectedDayBackgroundColor: theme.colors.primary,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: theme.colors.primary,
                    dayTextColor: theme.colors.textPrimary,
                    textDisabledColor: theme.colors.textSecondary,
                    monthTextColor: theme.colors.textPrimary,
                    arrowColor: theme.colors.primary,
                }}
            />

            {loadingDay && <LoadingView message="Chargement des données..." />}

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
                    Aucune donnée pour ce jour
                </Text>
            )}

            {!loadingDay && !errorDay && selectedDayData && (
                <View style={dataHistoryStyles.chartsContainer}>
                    <Text style={dataHistoryStyles.chartTitle}>
                        Données du {selectedDate}
                    </Text>

                    <View style={dataHistoryStyles.chartSection}>
                        <Text style={dataHistoryStyles.chartLabel}>Intensité des mouvements</Text>
                        <MotionChart
                            data={selectedDayData.graph.data.slice(0, 100)}
                            label="Accéléromètre (norme)"
                        />
                    </View>

                    <View style={dataHistoryStyles.statsContainer}>
                        <Text style={dataHistoryStyles.statsTitle}>Statistiques</Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Intensité moyenne : {selectedDayData.meanAmplitude != null
                                ? `${Number(selectedDayData.meanAmplitude).toFixed(2)} m/s²`
                                : '--'}
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Pic : {selectedDayData.peakAmplitude != null
                                ? `${Number(selectedDayData.peakAmplitude).toFixed(2)} m/s²`
                                : '--'}
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Variance : {selectedDayData.variance != null
                                ? `${Number(selectedDayData.variance).toFixed(3)}`
                                : '--'}
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Couverture : {selectedDayData.coverage != null
                                ? `${Number(selectedDayData.coverage * 100).toFixed(0)}%`
                                : '--'}
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Max : {Number(selectedDayData.graph.max).toFixed(2)} m/s²
                        </Text>
                        <Text style={dataHistoryStyles.statsText}>
                            Min : {Number(selectedDayData.graph.min).toFixed(2)} m/s²
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}