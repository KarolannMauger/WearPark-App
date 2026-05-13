import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createMotionStyles } from '../styles/screens/motionStyles';
import { MONTHS_FR } from '../constants/report.constants';

interface Props {
  selectedYear: number;
  selectedMonth: number;
  currentYear: number;
  currentMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  theme: any;
  labelStyle?: any;
}

export default function ReportMonthPicker({
  selectedYear,
  selectedMonth,
  currentYear,
  currentMonth,
  onYearChange,
  onMonthChange,
  theme,
  labelStyle,
}: Props) {
  const motionStyles = createMotionStyles(theme);

  return (
    <>
      <View style={motionStyles.reportPickerRow}>
        <Text style={[labelStyle, { marginBottom: 8 }]}>Année</Text>
        <View style={motionStyles.reportArrowRow}>
          <TouchableOpacity
            onPress={() => onYearChange(Math.max(2020, selectedYear - 1))}
            style={motionStyles.reportArrowBtn}
          >
            <MaterialIcons name="chevron-left" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={motionStyles.reportYearText}>{selectedYear}</Text>
          <TouchableOpacity
            onPress={() => onYearChange(Math.min(currentYear, selectedYear + 1))}
            style={motionStyles.reportArrowBtn}
          >
            <MaterialIcons name="chevron-right" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[labelStyle, { marginBottom: 8 }]}>Mois</Text>
      <View style={motionStyles.reportMonthGrid}>
        {MONTHS_FR.map((name, index) => {
          const m = index + 1;
          const future = selectedYear === currentYear && m > currentMonth;
          const selected = m === selectedMonth;
          return (
            <TouchableOpacity
              key={m}
              disabled={future}
              onPress={() => onMonthChange(m)}
              style={[
                motionStyles.reportMonthBtn,
                selected && { backgroundColor: theme.colors.primary },
                future  && motionStyles.reportMonthBtnDisabled,
              ]}
            >
              <Text
                style={[
                  motionStyles.reportMonthBtnText,
                  selected && { color: theme.colors.white, fontWeight: '700' },
                  future  && { color: theme.colors.placeholder },
                  !selected && !future && { color: theme.colors.textPrimary },
                ]}
              >
                {name.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}
