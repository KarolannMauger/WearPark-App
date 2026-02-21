import { ActivityIndicator, View, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface LoadingViewProps {
  message?: string;
}

export default function LoadingView({ message = 'Chargement...' }: LoadingViewProps) {
    const theme = useTheme();

    return (
        <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>
                {message}
            </Text>
        </View>
    );
}