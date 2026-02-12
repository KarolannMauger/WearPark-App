import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useUser } from "../context/UserContext";
import { View, Text, Image } from "react-native";
import Button from '../components/Button';

export default function WelcomeScreen() {
    const theme = useTheme();
    const { logout } = useUser();
    const screenStyles = createScreenStyles(theme);

    const handleLogout = () => {
    };

    return (
        <View style={screenStyles.container}>
            <View>
                <Image source={require('../../assets/images/wearkpark-logo-white.png')}/>
                <Image source={require('../../assets/favicon.png')}/>
                <Text>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui pariatur voluptatem quidem tenetur cum explicabo, cupiditate soluta. Excepturi, aliquid officiis, sunt, eos ipsam dolorum mollitia doloremque autem rem repudiandae quod.
                </Text>
            </View>
            <Button title="Se connecter" onPress={undefined} style={undefined} textStyle={undefined} />
            <Button title="S'inscrire'" onPress={undefined} style={undefined} textStyle={undefined} />
        </View>
    );
}