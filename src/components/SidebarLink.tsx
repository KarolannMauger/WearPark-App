import React from 'react';
import { Text, Pressable, PressableStateCallbackType } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';

type PressableWebState = PressableStateCallbackType & { hovered?: boolean };

export default function SidebarLink({ label, href }: { label: string; href: string }) {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Pressable
            onPress={() => router.push(href)}
            style={(state: PressableWebState) => ({
                marginBottom: 4,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: isActive
                    ? theme.colors.primary + '20'
                    : state.hovered
                        ? theme.colors.primary + '10'
                        : 'transparent',
            })}
        >
            {(state: PressableWebState) => (
                <Text style={[
                    theme.typography.body,
                    {
                        fontWeight: isActive ? '700' : '500',
                        color: isActive || state.hovered
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                    }
                ]}>
                    {label}
                </Text>
            )}
        </Pressable>
    );
}