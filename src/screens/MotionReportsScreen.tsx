import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';
import { createMotionStyles } from '../styles/screens/motionStyles';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import ReportCard from '../components/ReportCard';
import ReportMonthPicker from '../components/ReportMonthPicker';
import { reportService } from '../services/reportService';
import { MONTHS_FR } from '../constants/report.constants';
import { Report } from '../types/report';

const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-based


export default function ReportsScreen() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const motionStyles = createMotionStyles(theme);

  // Picker state
  const [selectedYear,  setSelectedYear]  = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  // Data state
  const [reports,        setReports]        = useState<Report[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [generating,     setGenerating]     = useState(false);
  const [downloadingId,  setDownloadingId]  = useState<string | null>(null);
  const [error,          setError]          = useState<string | null>(null);

  // Data loading

  const loadHistory = useCallback(async (silent = false) => {
    if (!silent) setInitialLoading(true);
    setError(null);
    try {
      const data = await reportService.getHistory(0, 50);
      setReports(data);
    } catch {
      setError("Impossible de charger l'historique des rapports.");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory(true);
  }, [loadHistory]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await reportService.generateAndDownload(selectedYear, selectedMonth);
      await loadHistory(true);
    } catch {
      Alert.alert('Erreur', 'Impossible de générer le rapport. Veuillez réessayer.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report: Report) => {
    setDownloadingId(report.id);
    try {
      await reportService.downloadById(report);
    } catch {
      Alert.alert('Erreur', 'Impossible de télécharger le rapport.');
    } finally {
      setDownloadingId(null);
    }
  };

  const isFutureMonth = selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth);

  if (initialLoading) {
    return (
      <View style={screenStyles.container}>
        <Text style={screenStyles.pageTitle}>Rapports</Text>
        <LoadingView message="Chargement des rapports..." />
      </View>
    );
  }

  if (error && reports.length === 0) {
    return (
      <View style={screenStyles.container}>
        <Text style={screenStyles.pageTitle}>Rapports</Text>
        <ErrorView message={error} onRetry={() => loadHistory()} />
      </View>
    );
  }

  return (
    <ScrollView
      style={screenStyles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={screenStyles.pageTitle}>Rapports</Text>

      <Text style={screenStyles.sectionTitle}>Générer un rapport</Text>

      <ReportMonthPicker
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        theme={theme}
        labelStyle={motionStyles.label}
      />

      <TouchableOpacity
        style={[
          motionStyles.button,
          motionStyles.primaryButton,
          isFutureMonth && motionStyles.reportButtonDisabled,
          { marginBottom: 32 },
        ]}
        onPress={handleGenerate}
        disabled={generating || isFutureMonth}
      >
        {generating ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={motionStyles.primaryButtonText}>
            Générer — {MONTHS_FR[selectedMonth - 1]} {selectedYear}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={screenStyles.sectionTitle}>
        Historique ({reports.length})
      </Text>

      {reports.length === 0 ? (
        <Text style={motionStyles.emptyText}>
          Aucun rapport généré pour le moment.{'\n'}
          Sélectionnez un mois et appuyez sur « Générer ».
        </Text>
      ) : (
        reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            isDownloading={downloadingId === report.id}
            onDownload={() => handleDownload(report)}
            theme={theme}
          />
        ))
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}