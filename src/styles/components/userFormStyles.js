import { StyleSheet } from 'react-native';

export const createUserFormStyles = (theme) => StyleSheet.create({
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    fontFamily: 'Roboto_600SemiBold',
  },
  
  // Input fields
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.input,
    marginBottom: 16,
    fontFamily: 'Roboto_400Regular',
  },
  inputDisabled: {
    backgroundColor: theme.colors.disabled || '#f5f5f5',
    borderColor: theme.colors.borderDisabled,
    color: theme.colors.textDisabled,
  },
  
  // Date picker button
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: theme.colors.input,
    justifyContent: 'center',
  },
  
  dateButtonText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontFamily: 'Roboto_400Regular',
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
    color: theme.colors.textButton,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto_600SemiBold',
  },
  
  // Checkbox row
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },

  // Picker container
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundColor,
  },
  
  picker: {
    height: 50,
    color: theme.colors.textPrimary,
  },
  
  // Error container
  errorContainer: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
});