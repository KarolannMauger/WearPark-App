import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { View, Text, Image, Platform, TouchableOpacity } from "react-native";
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

    // Layout mobile
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
                        source={require('../../assets/images/wearkpark-logo-white.png')}
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

// Layout web
function WelcomeWebLayout() {
    const router = useRouter();
    const theme = useTheme();
    const [color1, color2] = theme.colors.gradients.background;

    return (
        <LinearGradient
            colors={[color1, color2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ minHeight: '100vh' as any, display: 'flex', flexDirection: 'column' }}
        >
            {/* HEADER */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                paddingHorizontal: 60,
            }}>
                <Image
                    source={require('../../assets/images/wearkpark-logo-white.png')}
                    style={{ width: 160, height: 40 }}
                    resizeMode="contain"
                />
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/login")}
                        style={{
                            paddingHorizontal: 24,
                            paddingVertical: 10,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: theme.colors.white, fontSize: 16, fontWeight: '600' }}>
                            Connexion
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/register")}
                        style={{
                            paddingHorizontal: 24,
                            paddingVertical: 10,
                            borderRadius: 8,
                            backgroundColor: theme.colors.white,
                        }}
                    >
                        <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MAIN CONTENT */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 60,
                paddingVertical: 80,
            }}>
                <View style={{
                    maxWidth: 1200,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 80,
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[theme.typography.h1, {
                            color: theme.colors.white,
                            fontSize: 56,
                            marginBottom: 24,
                            lineHeight: 64,
                        }]}>
                            Suivez vos tremblements en temps réel
                        </Text>
                        <Text style={[theme.typography.body, {
                            color: theme.colors.white,
                            fontSize: 18,
                            marginBottom: 40,
                            opacity: 0.9,
                        }]}>
                            WearPark vous aide à monitorer vos tremblements
                            Parkinsoniens avec précision. Accédez à votre tableau de bord
                            personnalisé et générez des rapports pour votre médecin.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/register")}
                                style={{
                                    paddingHorizontal: 32,
                                    paddingVertical: 16,
                                    borderRadius: 8,
                                    backgroundColor: theme.colors.white,
                                }}
                            >
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                }}>
                                    Commencer gratuitement
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/login")}
                                style={{
                                    paddingHorizontal: 32,
                                    paddingVertical: 16,
                                    borderRadius: 8,
                                    borderWidth: 2,
                                    borderColor: theme.colors.white,
                                }}
                            >
                                <Text style={{
                                    color: theme.colors.white,
                                    fontSize: 16,
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

            {/* FOOTER */}
            <WebFooter />
        </LinearGradient>
    );
}

