import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Report } from '../types/report';
import { createMotionStyles } from '../styles/screens/motionStyles';
import { formatReportDate } from '../utils/date';

interface Props {
  report: Report;
  isDownloading: boolean;
  onDownload: () => void;
  theme: any;
}

export default function ReportCard({ report, isDownloading, onDownload, theme }: Props) {
  const motionStyles = createMotionStyles(theme);

  return (
    <View style={motionStyles.reportCard}>
      <View style={motionStyles.reportHeader}>

        <View style={{ flex: 1 }}>
          <Text style={motionStyles.reportTitle}>{report.title}</Text>
          <Text style={motionStyles.reportSubtitle}>
            Généré le {formatReportDate(report.generatedAt)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onDownload}
          disabled={isDownloading}
          style={motionStyles.downloadButton}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <MaterialIcons name="file-download" size={26} color={theme.colors.primary} />
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}
