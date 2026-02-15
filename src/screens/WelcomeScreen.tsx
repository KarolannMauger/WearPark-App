import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useUser } from "../context/UserContext";
import { View, Text, Image } from "react-native";
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { margin } from '../styles';

export default function WelcomeScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { logout } = useUser();
    const screenStyles = createScreenStyles(theme);

    const [color1, color2] = theme.colors.gradients.background;

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
                    <Text style={[theme.typography.body, { marginBottom: 80, color: theme.colors.white}]}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui pariatur voluptatem quidem tenetur cum explicabo, cupiditate soluta. Excepturi, aliquid officiis, sunt, eos ipsam dolorum mollitia doloremque autem rem repudiandae quod.
                    </Text>
                </View>
                <Button title="Se connecter" onPress={() => router.push("/login")} style={{ marginBottom: 16 }} textStyle={{ color: "white", textTransform: "uppercase", }} />
                <Button title="S'inscrire" onPress={() => router.push("/register")} variant="outline" style={undefined} textStyle={{ color: theme.colors.primary, textTransform: "uppercase", }} />
            </LinearGradient>
        </View>
    );
}