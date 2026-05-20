import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';
import { createHomeStyles } from '../styles/screens/homeStyles';
import { motionService } from '@/src/services/motionService';
import { useEffect, useState, useCallback } from 'react';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import MotionChart from '../components/MotionChart';
import { ApiError } from '@/src/errors/ApiError';
import Button from '../components/Button';
import { motionWebSocketService } from '../services/motionWebSocketService';
import { MotionDayData } from '@/src/types/motion';
import MobileOnlyGuard from '../components/MobileOnlyGuard';

export default function HomeScreen() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const homeStyles = createHomeStyles(theme);

  const [todayData, setTodayData] = useState<MotionDayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_GRAPH_POINTS = 500;

  const loadTodayData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await motionService.getTodayView();
      setTodayData(data);
      motionWebSocketService.disconnect();
      motionWebSocketService.connect();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 404) setTodayData(null);
        else setError(err.message);
      } else {
        setError('Erreur inattendue lors du chargement des données.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayData();
  }, [loadTodayData]);

  useEffect(() => {
    motionWebSocketService.connect();

    const unsubscribe = motionWebSocketService.subscribe((intensities: number[]) => {
      setTodayData(prev => {
        const currentGraph = prev?.graph.data ?? [];
        const updated = [...currentGraph, ...intensities];
        if (!prev) return prev;
        return {
          ...prev,
          graph: {
            ...prev.graph,
            data: updated.length > MAX_GRAPH_POINTS
              ? updated.slice(-MAX_GRAPH_POINTS)
              : updated,
          },
        };
      });
    });

    return () => unsubscribe();
  }, []);

  const intensityLabel = todayData?.meanAmplitude != null
    ? todayData.meanAmplitude < 1 ? 'Faible'
      : todayData.meanAmplitude < 2 ? 'Modérée'
        : 'Élevée'
    : '--';

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

  const graphData = todayData?.graph.data.filter(val => !isNaN(val)) ?? [];

  return (
    <MobileOnlyGuard>
      <ScrollView
        style={screenStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <Text style={screenStyles.pageTitle}>Tableau de bord</Text>

        {/* ── Graphique temps rel ── */}
        <View style={{ marginBottom: 24 }}>
          <Text style={screenStyles.sectionTitle}>Tremblement récent</Text>
          {graphData.length > 0 ? (
            <MotionChart
              data={graphData.slice()}
              height={200}
              label="Accéléromètre (norme)"
            />
          ) : (
            <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, padding: 20 }}>
              Aucun épisode détecté aujourd'hui
            </Text>
          )}
        </View>

        <View>
          <Text style={screenStyles.sectionTitle}>Résumé du jour</Text>

          <View style={homeStyles.rowContainer}>
            <View style={homeStyles.cardContainer}>
              <Text style={homeStyles.cardTitle}>Intensité moyenne</Text>
              <Text style={homeStyles.info}>{intensityLabel}</Text>
              <Text style={homeStyles.cardSubtitle}>
                {todayData?.meanAmplitude != null && todayData.peakAmplitude !== undefined
                  ? `${Number(todayData.peakAmplitude).toFixed(2)} m/s²`
                  : '--'}
              </Text>
            </View>

            <View style={homeStyles.cardContainer}>
              <Text style={homeStyles.cardTitle}>Pic d'intensité</Text>
              <Text style={homeStyles.info}>
                {todayData?.peakAmplitude != null && todayData.peakAmplitude !== undefined
                  ? `${Number(todayData.meanAmplitude).toFixed(2)}`
                  : '--'}
              </Text>
              <Text style={homeStyles.cardSubtitle}>m/s²</Text>
            </View>
          </View>

          <View style={homeStyles.rowContainer}>
            <View style={homeStyles.cardContainer}>
              <Text style={homeStyles.cardTitle}>Variance</Text>
              <Text style={homeStyles.info}>
                {todayData?.variance != null && todayData.peakAmplitude !== undefined
                  ? Number(todayData.variance).toFixed(3)
                  : '--'}
              </Text>
              <Text style={homeStyles.cardSubtitle}>stabilité</Text>
            </View>

            <View style={homeStyles.cardContainer}>
              <Text style={homeStyles.cardTitle}>Couverture</Text>
              <Text style={homeStyles.info}>
                {todayData?.coverage != null && todayData.peakAmplitude !== undefined
                  ? `${(Number(todayData.coverage) * 100).toFixed(0)}%`
                  : '--'}
              </Text>
              <Text style={homeStyles.cardSubtitle}>du jour</Text>
            </View>
          </View>
        </View>

        <Button
          onPress={loadTodayData}
          title="Recharger"
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </MobileOnlyGuard>
  );
}