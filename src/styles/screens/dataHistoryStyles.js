import { StyleSheet } from "react-native";

export const createDataHistoryStyles = (theme) => StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary
  },
  chartsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: theme.colors.chartBackground,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.textPrimary
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  chartSection: {
    marginBottom: 24,
    overflow: 'scroll'
  },
  chartLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.textPrimary
  },
  statsText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  emptyText: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  }
});