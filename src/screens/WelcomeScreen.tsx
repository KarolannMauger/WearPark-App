import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useUser } from "../context/UserContext";
import { View, Text, Image } from "react-native";
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

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
                end={{ x: 0, y: 1 }}
                style={screenStyles.container}
            >
                <View>
                    <Text style={{ color: theme.colors.white, ...theme.typography.h1 }}>Bienvenue sur</Text>
                    <Image
                        source={require('../../assets/images/wearkpark-logo-white.png')}
                        style={{ width: '80%', height: 60 }}
                        resizeMode="contain"
                    />
                    <Text>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui pariatur voluptatem quidem tenetur cum explicabo, cupiditate soluta. Excepturi, aliquid officiis, sunt, eos ipsam dolorum mollitia doloremque autem rem repudiandae quod.
                    </Text>
                </View>
                <Button title="Se connecter" onPress={() => router.push("/login")} style={undefined} textStyle={undefined} />
                <Button title="S'inscrire" onPress={() => router.push("/register")} style={undefined} textStyle={undefined} />
                <Button title="temp test" onPress={() => router.push("/completeProfile")} style={undefined} textStyle={undefined} />
            </LinearGradient>
        </View>
    );
}