import { StyleSheet } from 'react-native';

export const createMotionStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
        backgroundColor: '#fff',
        borderBottomColor: 'lightGrey',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    dateInput: {
        flex: 2,
    },
    timeInput: {
        flex: 1,
    },
    example: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontFamily: 'monospace',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    results: {
        flex: 1,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultItem: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fafafa',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    resultHeaderContent: {
        flex: 1,
    },
    resultId: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
    resultDate: {
        fontSize: 14,
        marginTop: 4,
    },
    resultSamples: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    expandedContent: {
        padding: 12,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    dataSection: {
        gap: 8,
    },
    dataTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    dataRow: {
        marginBottom: 8,
    },
    dataLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    dataValues: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});