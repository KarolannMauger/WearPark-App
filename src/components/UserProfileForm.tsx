import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createUserFormStyles } from "../styles/screens/userFormStyles";
import Button from "./Button";

export interface UserProfileData {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Format YYYY-MM-DD
    email: string;
    hasDiagnostic: boolean;
    disease?: string;
    preferences: {
        monthlyReportEmail: boolean;
        reportRecipients: string[];
    };
}

interface UserProfileFormProps {
    initialData?: Partial<UserProfileData>;
    onSubmit: (data: UserProfileData) => Promise<void>;
    submitButtonText?: string;
    isLoading?: boolean;
}

const DISEASES = [
    "Parkinson",
    "Alzheimer",
    "Sclérose en plaques",
    "Épilepsie",
    "Autre",
];

export default function UserProfileForm({
    initialData,
    onSubmit,
    submitButtonText = "Enregistrer",
    isLoading = false,
}: UserProfileFormProps) {
    const theme = useTheme();
    const userFormStyles = createUserFormStyles(theme);

    const [firstName, setFirstName] = useState(initialData?.firstName || "");
    const [lastName, setLastName] = useState(initialData?.lastName || "");
    const [email, setEmail] = useState(initialData?.email || "");

    const [dateOfBirth, setDateOfBirth] = useState<Date>(
        initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : new Date()
    );
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [hasDiagnostic, setHasDiagnostic] = useState(initialData?.hasDiagnostic || false);
    const [disease, setDisease] = useState(initialData?.disease || DISEASES[0]);

    const [monthlyReport, setMonthlyReport] = useState(
        initialData?.preferences?.monthlyReportEmail || false
    );
    const [reportEmails, setReportEmails] = useState(
        initialData?.preferences?.reportRecipients?.join(", ") || ""
    );

    const [error, setError] = useState<string | null>(null);

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        setError(null);

        if (!firstName || !lastName || !email) {
            setError("Le prénom, nom et courriel sont requis.");
            return;
        }

        const emailList = reportEmails
            .split(",")
            .map(e => e.trim())
            .filter(e => e.length > 0);

        const data: UserProfileData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth: formatDate(dateOfBirth),
            email: email.toLowerCase().trim(),
            hasDiagnostic,
            disease: hasDiagnostic ? disease : undefined,
            preferences: {
                monthlyReportEmail: monthlyReport,
                reportRecipients: emailList,
            },
        };

        try {
            await onSubmit(data);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        }
    };

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Informations de base */}
            <Text style={userFormStyles.sectionTitle}>Informations personnelles</Text>

            <Text style={userFormStyles.label}>Prénom *</Text>
            <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Prénom"
                placeholderTextColor={theme.colors.textSecondary}
                style={userFormStyles.input}
                editable={!isLoading}
            />

            <Text style={userFormStyles.label}>Nom *</Text>
            <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nom"
                placeholderTextColor={theme.colors.textSecondary}
                style={userFormStyles.input}
                editable={!isLoading}
            />

            <Text style={userFormStyles.label}>Date de naissance *</Text>
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                disabled={isLoading}
                style={userFormStyles.dateButton}
            >
                <Text style={userFormStyles.dateButtonText}>
                    {formatDate(dateOfBirth)}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()} // Pas de date future
                    minimumDate={new Date(1900, 0, 1)}
                />
            )}

            {Platform.OS === 'ios' && showDatePicker && (
                <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={userFormStyles.datePickerDone}
                >
                    <Text style={userFormStyles.datePickerDoneText}>Terminé</Text>
                </TouchableOpacity>
            )}

            <Text style={userFormStyles.label}>Courriel *</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="exemple@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textSecondary}
                style={userFormStyles.input}
                editable={!isLoading}
            />

            {/* Diagnostic */}
            <Text style={[userFormStyles.sectionTitle, { marginTop: 30 }]}>
                Information médicale
            </Text>

            <View style={userFormStyles.checkboxRow}>
                <Checkbox
                    value={hasDiagnostic}
                    onValueChange={setHasDiagnostic}
                    disabled={isLoading}
                    color={hasDiagnostic ? theme.colors.primary : undefined}
                />
                <Text style={userFormStyles.checkboxLabel}>
                    J'ai un diagnostic
                </Text>
            </View>

            {hasDiagnostic && (
                <>
                    <Text style={userFormStyles.label}>Maladie</Text>
                    <View style={userFormStyles.pickerContainer}>
                        <Picker
                            selectedValue={disease}
                            onValueChange={setDisease}
                            enabled={!isLoading}
                            style={userFormStyles.picker}
                        >
                            {DISEASES.map((d) => (
                                <Picker.Item key={d} label={d} value={d} />
                            ))}
                        </Picker>
                    </View>
                </>
            )}

            {/* Préférences */}
            <Text style={[userFormStyles.sectionTitle, { marginTop: 30 }]}>
                Préférences
            </Text>

            <View style={userFormStyles.checkboxRow}>
                <Checkbox
                    value={monthlyReport}
                    onValueChange={setMonthlyReport}
                    disabled={isLoading}
                    color={monthlyReport ? theme.colors.primary : undefined}
                />
                <Text style={userFormStyles.checkboxLabel}>
                    Recevoir un rapport mensuel par courriel
                </Text>
            </View>

            {monthlyReport && (
                <>
                    <Text style={userFormStyles.label}>
                        Courriel(s) destinataire(s) (séparés par des virgules)
                    </Text>
                    <TextInput
                        value={reportEmails}
                        onChangeText={setReportEmails}
                        placeholder="email1@example.com, email2@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={userFormStyles.input}
                        editable={!isLoading}
                    />
                </>
            )}

            {/* Erreur */}
            {error && (
                <View style={userFormStyles.errorContainer}>
                    <Text style={userFormStyles.errorText}>{error}</Text>
                </View>
            )}

            {/* Bouton submit */}
            <View style={{ marginTop: 30 }}>
                <Button
                    onPress={handleSubmit}
                    title={isLoading ? "Chargement..." : submitButtonText}
                    disabled={isLoading} style={undefined} textStyle={undefined} />
            </View>
        </ScrollView>
    );
}