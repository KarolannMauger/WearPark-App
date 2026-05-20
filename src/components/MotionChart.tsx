import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../context/ThemeContext';

interface MotionChartProps {
    data: number[];
    height?: number;
    showLegend?: boolean;
    label?: string;
}

export default function MotionChart({
    data,
    height = 250,
    showLegend = true,
    label = "Intensité des tremblements"
}: MotionChartProps) {
    const theme = useTheme();
    const { width: windowWidth } = useWindowDimensions();

    const prepareChartData = (values: number[]) => {
        return values.map((value, index) => ({
            value: value,
            label: index % 10 === 0 ? index.toString() : '',
        }));
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={prepareChartData(data)}
                width={windowWidth - 64}
                spacing={3}
                color1={theme.colors.primary}
                thickness={2}
                startFillColor1={theme.colors.primary}
                startOpacity={0.3}
                endOpacity={0.1}
                hideDataPoints
                curved
                xAxisColor={theme.colors.textSecondary}
                yAxisColor={theme.colors.textSecondary}
                yAxisTextStyle={{ color: theme.colors.textSecondary }}
                xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
                yAxisOffset={5}
                stepValue={1}
                noOfSections={10}
            />

            {showLegend && (
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.line, { backgroundColor: theme.colors.primary }]} />
                        <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                            {label}
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
        justifyContent: 'center',
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