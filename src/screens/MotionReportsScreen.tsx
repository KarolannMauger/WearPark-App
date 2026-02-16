import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Platform, } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createMotionStyles } from '../styles/screens/motionStyles';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Report {
  id: string;
  startDate: string;
  endDate: string;
  generatedAt: Date;
}

export default function ReportsScreen() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const motionStyles = createMotionStyles(theme);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    // ========== MODE SIMULATION ==========
    const mockReports: Report[] = [
      {
        id: '1',
        startDate: '2026-02-01',
        endDate: '2026-02-07',
        generatedAt: new Date('2026-02-08T10:30:00'),
      },
      {
        id: '2',
        startDate: '2026-01-15',
        endDate: '2026-01-31',
        generatedAt: new Date('2026-02-01T14:20:00'),
      },
      {
        id: '3',
        startDate: '2026-01-01',
        endDate: '2026-01-14',
        generatedAt: new Date('2026-01-15T09:15:00'),
      },
    ];
    setReports(mockReports);

    // ========== MODE RÉEL (à décommenter plus tard) ==========
    // const savedReports = await reportsService.getAll();
    // setReports(savedReports);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateReport = async () => {
    if (startDate > endDate) {
      Alert.alert('Erreur', 'La date de début doit être avant la date de fin');
      return;
    }

    setLoading(true);

    try {
      // Simuler un délai de génération
      await new Promise(resolve => setTimeout(resolve, 1500));

      const start = formatDate(startDate);
      const end = formatDate(endDate);

      // ========== MODE SIMULATION ==========
      Alert.alert(
        'Rapport généré',
        `Rapport du ${start} au ${end}\n\nCette fonctionnalité téléchargera le rapport une fois l'API connectée.`,
        [{ text: 'OK' }]
      );

      // Ajouter le nouveau rapport à la liste
      const newReport: Report = {
        id: Date.now().toString(),
        startDate: start,
        endDate: end,
        generatedAt: new Date(),
      };
      setReports([newReport, ...reports]);

      // ========== MODE RÉEL (à décommenter plus tard) ==========
      // const report = await reportsService.generate({ startDate: start, endDate: end });
      // // Télécharger le fichier
      // await FileSystem.downloadAsync(
      //   report.downloadUrl,
      //   FileSystem.documentDirectory + `rapport_${start}_${end}.pdf`
      // );
      // Alert.alert('Succès', 'Le rapport a été téléchargé');
      // loadReports(); // Recharger la liste
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Erreur', 'Impossible de générer le rapport');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report: Report) => {
    // ========== MODE SIMULATION ==========
    Alert.alert(
      'Téléchargement',
      `Téléchargement du rapport ${report.startDate} - ${report.endDate}\n\nCette fonctionnalité téléchargera le rapport une fois l'API connectée.`,
      [{ text: 'OK' }]
    );

    // ========== MODE RÉEL (à décommenter plus tard) ==========
    // await reportsService.download(report.id);
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <ScrollView style={screenStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={screenStyles.pageTitle}>Rapports</Text>
      <Text style={screenStyles.sectionTitle}>Générer un rapport</Text>
      {/* Formulaire de génération */}
      <View style={motionStyles.rowForm}>
        <View style={motionStyles.formGroup}>
          <Text style={motionStyles.label}>Date de début</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={motionStyles.dateButton}
          >
            <Text style={motionStyles.dateButtonText}>
              {formatDate(startDate)}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onStartDateChange}
              maximumDate={new Date()}
            />
          )}

          {Platform.OS === 'ios' && showStartPicker && (
            <TouchableOpacity
              onPress={() => setShowStartPicker(false)}
              style={motionStyles.datePickerDone}
            >
              <Text style={motionStyles.datePickerDoneText}>Terminé</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={motionStyles.formGroup}>
          <Text style={motionStyles.label}>Date de fin</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={motionStyles.dateButton}
          >
            <Text style={motionStyles.dateButtonText}>
              {formatDate(endDate)}
            </Text>
            <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEndDateChange}
              maximumDate={new Date()}
            />
          )}

          {Platform.OS === 'ios' && showEndPicker && (
            <TouchableOpacity
              onPress={() => setShowEndPicker(false)}
              style={motionStyles.datePickerDone}
            >
              <Text style={motionStyles.datePickerDoneText}>Terminé</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[motionStyles.button, motionStyles.primaryButton]}
        onPress={generateReport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={motionStyles.primaryButtonText}>Générer le rapport</Text>
            <MaterialIcons name="file-download" size={20} color="#fff" style={{ marginLeft: theme.spacing.sm }} />
          </>
        )}
      </TouchableOpacity>

      {/* Liste des rapports précédents */}
      <View style={{ marginTop: 40 }}>
        <Text style={screenStyles.sectionTitle}>
          Rapports précédents ({reports.length})
        </Text>

        {reports.length === 0 ? (
          <Text style={motionStyles.emptyText}>
            Aucun rapport généré pour le moment
          </Text>
        ) : (
          reports.map((report) => (
            <View key={report.id} style={motionStyles.reportCard}>
              <View style={motionStyles.reportHeader}>
                <View>
                  <Text style={motionStyles.reportTitle}>
                    {report.startDate} → {report.endDate}
                  </Text>
                  <Text style={motionStyles.reportSubtitle}>
                    Généré le {report.generatedAt.toLocaleDateString()} à{' '}
                    {report.generatedAt.toLocaleTimeString()}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => downloadReport(report)}
                  style={motionStyles.downloadButton}
                >
                  <MaterialIcons
                    name="file-download"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}