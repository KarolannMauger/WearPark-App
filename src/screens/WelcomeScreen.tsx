import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { View, Text, Image, Platform, TouchableOpacity, useWindowDimensions, ScrollView } from "react-native";
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import WebFooter from '../components/WebFooter';

export default function WelcomeScreen() {
    const router = useRouter();
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const [color1, color2] = theme.colors.gradients.background;

    const isWeb = Platform.OS === 'web';

    if (isWeb) {
        return <WelcomeWebLayout />;
    }

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={[color1, color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.85 }}
                style={[screenStyles.container, { flex: 1, justifyContent: 'flex-end', paddingBottom: 200 }]}
            >
                <View>
                    <Text style={{ color: theme.colors.white, ...theme.typography.h1 }}>Bienvenue sur</Text>
                    <Image
                        source={require('../../assets/images/wearpark-logo-white.png')}
                        style={{ width: '80%', height: 60, marginTop: -20, marginBottom: 40 }}
                        resizeMode="contain"
                    />
                    <Text style={[theme.typography.body, { marginBottom: 80, color: theme.colors.white }]}>
                        Suivez vos tremblements en temps réel avec WearPark
                    </Text>
                </View>
                <Button
                    title="Se connecter"
                    onPress={() => router.push("/(auth)/login")}
                    style={{ marginBottom: 16 }}
                    textStyle={{ color: "white", textTransform: "uppercase" }}
                />
                <Button
                    title="S'inscrire"
                    onPress={() => router.push("/(auth)/register")}
                    variant="outline"
                    textStyle={{ color: theme.colors.primary, textTransform: "uppercase" }}
                    style={undefined}
                />
            </LinearGradient>
        </View>
    );
}

function WelcomeWebLayout() {
    const router = useRouter();
    const theme = useTheme();
    const { width } = useWindowDimensions();
    const [color1, color2] = theme.colors.gradients.background;

    const isNarrow = width < 900;
    const px = isNarrow ? 24 : 60;

    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <LinearGradient
                colors={[color1, color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ minHeight: '100vh' as any, display: 'flex', flexDirection: 'column' }}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                    paddingHorizontal: px,
                }}>
                    <Image
                        source={require('../../assets/images/wearpark-logo-white.png')}
                        style={{ width: 160, height: 40 }}
                        resizeMode="contain"
                    />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/login")}
                            style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                        >
                            <Text style={{ color: theme.colors.white, fontSize: 15, fontWeight: '600' }}>
                                Connexion
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/register")}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                                backgroundColor: theme.colors.white,
                            }}
                        >
                            <Text style={{ color: theme.colors.primary, fontSize: 15, fontWeight: '600' }}>
                                S'inscrire
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flex: 1,
                    paddingHorizontal: px,
                    paddingVertical: isNarrow ? 40 : 140,
                    alignItems: 'center',
                }}>
                    <View style={{
                        maxWidth: 1200,
                        width: '100%',
                        flexDirection: isNarrow ? 'column' : 'row',
                        alignItems: isNarrow ? 'stretch' : 'center',
                        gap: isNarrow ? 40 : 80,
                    }}>

                        {/* Texte + CTA */}
                        <View style={{ flex: 1 }}>
                            <Text style={[theme.typography.h1, {
                                color: theme.colors.white,
                                fontSize: isNarrow ? 36 : 56,
                                marginBottom: 24,
                                lineHeight: isNarrow ? 44 : 64,
                            }]}>
                                Suivez vos tremblements en temps réel
                            </Text>
                            <Text style={[theme.typography.body, {
                                color: theme.colors.white,
                                fontSize: isNarrow ? 15 : 18,
                                marginBottom: 40,
                                opacity: 0.9,
                                lineHeight: 26,
                            }]}>
                                WearPark vous aide à monitorer vos tremblements Parkinsoniens avec précision.
                                Accédez à votre tableau de bord personnalisé et générez des rapports pour votre médecin.
                            </Text>
                            <View style={{
                                flexDirection: isNarrow ? 'column' : 'row',
                                gap: 12,
                            }}>
                                <TouchableOpacity
                                    onPress={() => router.push("/(auth)/register")}
                                    style={{
                                        paddingHorizontal: 28,
                                        paddingVertical: 14,
                                        borderRadius: 8,
                                        backgroundColor: theme.colors.white,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{
                                        color: theme.colors.primary,
                                        fontSize: 15,
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                    }}>
                                        Commencer gratuitement
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push("/(auth)/login")}
                                    style={{
                                        paddingHorizontal: 28,
                                        paddingVertical: 14,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor: theme.colors.white,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{
                                        color: theme.colors.white,
                                        fontSize: 15,
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                    }}>
                                        Se connecter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <FeatureCard
                                icon="analytics"
                                title="Données en temps réel"
                                description="Visualisez vos tremblements avec des graphiques détaillés"
                            />
                            <FeatureCard
                                icon="calendar-today"
                                title="Historique complet"
                                description="Consultez l'évolution de vos symptômes sur le long terme"
                            />
                            <FeatureCard
                                icon="description"
                                title="Rapports médicaux"
                                description="Générez des rapports PDF pour votre médecin"
                            />
                        </View>
                    </View>
                </View>

                <WebFooter />

            </LinearGradient>
        </ScrollView>
    );
}