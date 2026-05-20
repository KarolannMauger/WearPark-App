import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { useTheme } from '../context/ThemeContext';
import { createButtonStyles } from "../styles/components/buttonStyles";

interface Props {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'accent' | 'outline';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
}: Props) {
    const theme = useTheme();
    const styles = createButtonStyles(theme);

    const buttonStyles = [
        styles.base,
        styles[size],
        styles[variant],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        disabled && styles.textDisabled,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={textStyles}>{title}</Text>
            }
        </TouchableOpacity>
    );
}