export const createUserFormStyles = (theme) => ({
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    fontFamily: theme.typography?.fontFamily?.semiBold || 'Roboto_600SemiBold',
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontFamily: theme.typography?.fontFamily?.medium || 'Roboto_500Medium',
  },
  
  // Input fields
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.input || '#FFFFFF',
    marginBottom: 20,
    fontFamily: theme.typography?.fontFamily?.regular || 'Roboto_400Regular',
  },
  
  // Date picker button
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: theme.colors.input || '#FFFFFF',
    justifyContent: 'center',
  },
  
  dateButtonText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography?.fontFamily?.regular || 'Roboto_400Regular',
  },
  
  // Date picker done button (iOS)
  datePickerDone: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  datePickerDoneText: {
    color: theme.colors.textButton || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theme.typography?.fontFamily?.semiBold || 'Roboto_600SemiBold',
  },
  
  // Checkbox row
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  
  checkboxLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
    fontFamily: theme.typography?.fontFamily?.regular || 'Roboto_400Regular',
  },
  
  // Picker container
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.input || '#FFFFFF',
  },
  
  picker: {
    height: 50,
    color: theme.colors.textPrimary,
  },
  
  // Error container
  errorContainer: {
    backgroundColor: (theme.colors.error || '#FF3B30') + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  
  errorText: {
    color: theme.colors.error || '#FF3B30',
    fontSize: 14,
    fontFamily: theme.typography?.fontFamily?.regular || 'Roboto_400Regular',
  },
});