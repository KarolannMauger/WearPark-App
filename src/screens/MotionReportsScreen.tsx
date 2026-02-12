import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createMotionStyles } from '../styles/screens/motionStyle';
import { Ionicons } from '@expo/vector-icons';
import { motionService, MotionDataDecoded } from '@/src/services/motionService';

export default function MotionScreen() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const motionStyles = createMotionStyles(theme);

  const [allData, setAllData] = useState<MotionDataDecoded[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('2026-02-07');
  const [startTime, setStartTime] = useState('17:44:42');
  const [endDate, setEndDate] = useState('2026-02-08');
  const [endTime, setEndTime] = useState('17:44:42');

  const loadMotionData = async () => {
    setLoading(true);
    try {
      const start = `${startDate}T${startTime}Z`;
      const end = `${endDate}T${endTime}Z`;
      const data = await motionService.getAll({ startDate: start, endDate: end });
      setAllData(data);
    } catch (error) {
      console.error('Error loading motion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLatest = async () => {
    setLoading(true);
    try {
      const latest = await motionService.getLatest();
      setAllData([latest]);
    } catch (error) {
      console.error('Error loading latest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = (item: MotionDataDecoded) => {
    const isExpanded = expandedId === item.id;

    return (
      <View key={item.id} style={motionStyles.container}>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          style={motionStyles.resultHeader}
        >
          <View style={motionStyles.resultHeaderContent}>
            <Text style={motionStyles.resultId}>ID: {item.id.slice(-8)}</Text>
            <Text style={motionStyles.resultDate}>
              {item.start.toLocaleString()} → {item.end.toLocaleString()}
            </Text>
            <Text style={motionStyles.resultSamples}>
              Samples: {item.data.ax.length}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {isExpanded && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={motionStyles.expandedContent}>
              {['ax','ay','az','gx','gy','gz'].map((axis) => (
                <View style={motionStyles.dataRow} key={axis}>
                  <Text style={motionStyles.dataLabel}>{axis}:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator>
                    <Text style={motionStyles.dataValues}>
                      {`[${(item.data as any)[axis]
                        .slice(0, 10)
                        .map((v: number) => v.toFixed(4))
                        .join(', ')}${(item.data as any)[axis].length > 10 ? `, ... +${(item.data as any)[axis].length - 10} more` : ''}]`}
                    </Text>
                  </ScrollView>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={screenStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={motionStyles.title}>Motion Data Filter</Text>

      <View style={motionStyles.formGroup}>
        <Text style={motionStyles.label}>Start Date & Time</Text>
        <View style={motionStyles.dateTimeRow}>
          <TextInput
            style={[motionStyles.input, motionStyles.dateInput]}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            style={[motionStyles.input, motionStyles.timeInput]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="HH:MM:SS"
          />
        </View>
        <Text style={motionStyles.example}>Result: {startDate}T{startTime}Z</Text>
      </View>

      <View style={motionStyles.formGroup}>
        <Text style={motionStyles.label}>End Date & Time</Text>
        <View style={motionStyles.dateTimeRow}>
          <TextInput
            style={[motionStyles.input, motionStyles.dateInput]}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            style={[motionStyles.input, motionStyles.timeInput]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="HH:MM:SS"
          />
        </View>
        <Text style={motionStyles.example}>Result: {endDate}T{endTime}Z</Text>
      </View>

      <View style={motionStyles.buttonRow}>
        <TouchableOpacity
          style={[motionStyles.button, motionStyles.secondaryButton]}
          onPress={loadLatest}
          disabled={loading}
        >
          <Text style={motionStyles.secondaryButtonText}>Fetch Latest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[motionStyles.button, motionStyles.primaryButton]}
          onPress={loadMotionData}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={motionStyles.primaryButtonText}>Fetch Range</Text>}
        </TouchableOpacity>
      </View>

      <Text style={motionStyles.resultsTitle}>Results ({allData.length} items)</Text>

      {allData.length === 0 && !loading && (
        <Text style={motionStyles.emptyText}>
          No data found. Try fetching latest or adjusting the date range.
        </Text>
      )}

      {allData.map(item => renderItem(item))}
    </ScrollView>
  );
}