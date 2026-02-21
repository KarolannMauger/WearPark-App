import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../context/ThemeContext';

interface MotionChartProps {
    accelerometerData: number[];
    gyroscopeData: number[];
    height?: number;
    showLegend?: boolean;
}

export default function MotionChart({
    accelerometerData,
    gyroscopeData,
    height = 250,
    showLegend = true,
}: MotionChartProps) {
    const theme = useTheme();
    const { width: windowWidth } = useWindowDimensions();

    const prepareChartData = (data: number[]) => {
        return data.map((value, index) => ({
            value: value,
            label: index % 10 === 0 ? index.toString() : '',
        }));
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={prepareChartData(accelerometerData)}
                data2={prepareChartData(gyroscopeData)}
                height={height}
                width={windowWidth - 64}
                spacing={3}
                color1={theme.colors.primary}
                color2={theme.colors.accent}
                thickness={2}
                startFillColor1={theme.colors.primary}
                startFillColor2={theme.colors.accent}
                startOpacity={0.3}
                endOpacity={0.1}
                hideDataPoints
                curved
                xAxisColor={theme.colors.textSecondary}
                yAxisColor={theme.colors.textSecondary}
                yAxisTextStyle={{ color: theme.colors.textSecondary }}
                xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
            />

            {showLegend && (
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.line, { backgroundColor: theme.colors.primary }]} />
                        <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                            Accéléromètre ||a||
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.line, { backgroundColor: theme.colors.accent }]} />
                        <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                            Gyroscope ||g||
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    line: {
        width: 20,
        height: 3,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 12,
    },
});