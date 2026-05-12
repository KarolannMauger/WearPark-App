import { useTheme } from "../context/ThemeContext";
import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUserFormStyles } from "../styles/components/userFormStyles";
import Button from "./Button";
import { PatchUserRequest, User } from "@/src/types/user";
import { GENDERS, DISEASES } from "../constants/user.constants";

interface UserProfileFormProps {
    initialData?: User;
    onSubmit: (data: PatchUserRequest) => Promise<void>;
    submitButtonText?: string;
    isLoading?: boolean;
    emailEditable?: boolean;
}

export default function UserProfileForm({
    initialData,
    onSubmit,
    submitButtonText = "Enregistrer",
    isLoading = false,
    emailEditable = true,
}: UserProfileFormProps) {
    const theme = useTheme();
    const styles = createUserFormStyles(theme);

    const [firstName, setFirstName] = useState(initialData?.firstName ?? "");
    const [lastName, setLastName] = useState(initialData?.lastName ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [gender, setGender] = useState(initialData?.gender ?? GENDERS[0]);
    const [dateOfBirth, setDateOfBirth] = useState<Date>(
        initialData?.dateOfBirth
            ? new Date(initialData.dateOfBirth)
            : new Date()
    );

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [hasDiagnosis, setHasDiagnosis] = useState(
        initialData?.hasDiagnosis ?? false
    );

    const [diagnosis, setDiagnosis] = useState(
        initialData?.diagnosis ?? DISEASES[0]
    );

    const [monthlyReport, setMonthlyReport] = useState(
        initialData?.userPreferences?.monthlyReportEmail ?? false
    );

    const [reportEmails, setReportEmails] = useState(
        initialData?.userPreferences?.reportRecipients?.join(", ") ?? ""
    );

    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const onDateChange = (_: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    const handleSubmit = async () => {
        setError(null);

        if (!firstName || !lastName || !dateOfBirth || !email) {
            setError("Le prénom, nom, date de naissance et courriel sont requis.");
            return;
        }

        const emailList = reportEmails
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0);

        const data: PatchUserRequest = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            gender: gender,
            dateOfBirth: formatDate(dateOfBirth),
            hasDiagnosis,
            diagnosis: hasDiagnosis ? diagnosis : undefined,
            userPreferences: {
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
            <Text style={theme.typography.h3}>Informations personnelles</Text>

            <Text style={theme.typography.inputLabel}>Prénom *</Text>
            <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Prénom"
                placeholderTextColor={theme.colors.placeholder}
                style={styles.input}
                editable={!isLoading}
            />

            <Text style={theme.typography.inputLabel}>Nom *</Text>
            <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nom"
                placeholderTextColor={theme.colors.placeholder}
                style={styles.input}
                editable={!isLoading}
            />

            <Text style={theme.typography.inputLabel}>Genre</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={gender}
                    onValueChange={setGender}
                    enabled={!isLoading}
                    style={styles.picker}
                >
                    {GENDERS.map((g) => (
                        <Picker.Item key={g} label={g} value={g} />
                    ))}
                </Picker>
            </View>

            <Text style={theme.typography.inputLabel}>Date de naissance *</Text>
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                disabled={isLoading}
                style={styles.dateButton}
            >
                <Text style={styles.dateButtonText}>
                    {formatDate(dateOfBirth)}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                />
            )}

            <Text style={theme.typography.inputLabel}>Courriel *</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="exemple@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.placeholder}
                style={[
                    styles.input,
                    !emailEditable && styles.inputDisabled,
                ]}
                editable={!isLoading && emailEditable}
            />

            <Text style={theme.typography.h3}>Information médicale</Text>

            <View style={styles.checkboxRow}>
                <Checkbox
                    value={hasDiagnosis}
                    onValueChange={setHasDiagnosis}
                    disabled={isLoading}
                    color={hasDiagnosis ? theme.colors.primary : undefined}
                />
                <Text style={theme.typography.checkboxLabel}>
                    J'ai un diagnostic
                </Text>
            </View>

            {hasDiagnosis && (
                <>
                    <Text style={theme.typography.inputLabel}>Maladie</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={diagnosis}
                            onValueChange={setDiagnosis}
                            enabled={!isLoading}
                            style={styles.picker}
                        >
                            {DISEASES.map((d) => (
                                <Picker.Item key={d} label={d} value={d} />
                            ))}
                        </Picker>
                    </View>
                </>
            )}

            <Text style={theme.typography.h3}>Préférences</Text>

            <View style={styles.checkboxRow}>
                <Checkbox
                    value={monthlyReport}
                    onValueChange={setMonthlyReport}
                    disabled={isLoading}
                    color={monthlyReport ? theme.colors.primary : undefined}
                />
                <Text style={theme.typography.checkboxLabel}>
                    Recevoir un rapport mensuel par courriel
                </Text>
            </View>

            {monthlyReport && (
                <>
                    <Text style={theme.typography.inputLabel}>
                        Courriel(s) destinataire(s)
                    </Text>
                    <TextInput
                        value={reportEmails}
                        onChangeText={setReportEmails}
                        placeholder="email1@example.com, email2@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={theme.colors.placeholder}
                        style={styles.input}
                        editable={!isLoading}
                    />
                </>
            )}

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={{ marginTop: 20 }}>
                <Button
                    onPress={handleSubmit}
                    title={isLoading ? "Chargement..." : submitButtonText}
                    disabled={isLoading} style={undefined} textStyle={undefined}
                />
            </View>
        </ScrollView>
    );
}