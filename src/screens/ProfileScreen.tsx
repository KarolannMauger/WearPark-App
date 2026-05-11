import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const profileStyles = createProfileStyles(theme);


  return (
    <View style={[screenStyles.container, { position: "relative" }]}>
      <Text style={screenStyles.pageTitle}> Mon profil </Text>

      <TouchableOpacity
        style={{ position: "absolute", right: theme.spacing.lg, top: theme.spacing.xl, zIndex: 10 }}
        onPress={() => router.push("/settings")}
      >
        <MaterialIcons
          name="settings"
          size={22}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <View style={profileStyles.profileHeader}>
            <Image
              source={require('../../assets/images/wearpark-profile-placeholder.png')}
              style={{ height: 80, alignSelf: 'center', marginTop: 20 }}
              resizeMode="contain"
            />

            <Text style={profileStyles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={profileStyles.email}>{user?.email}</Text>


          </View>

          <View>
            <Text style={screenStyles.sectionTitleSmall}>Appareil connecté</Text>
            {user?.device ? (
              <View style={profileStyles.deviceInfo}>
                <View style={profileStyles.iconView}>
                  <MaterialIcons name="watch" size={20} color={theme.colors.textPrimary} />
                </View>
                <View>
                  <Text style={profileStyles.deviceText}>
                    {user.device.deviceKey}
                  </Text>
                  <Text style={profileStyles.deviceSubText}>
                    Dernière mesure à : {new Date(user.device.lastDeviceDataDate).toLocaleDateString()}
                  </Text>
                </View>

              </View>
            ) : (
              <View style={profileStyles.deviceInfo}>
                <View style={profileStyles.iconView}>
                  <MaterialIcons name="watch-off" size={20} color={theme.colors.textPrimary} />
                </View>
                <Text style={profileStyles.deviceText}>Aucun appareil connecté</Text>
              </View>
            )}

          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/editProfile")}
          style={profileStyles.editButton}
        >
          <Text style={profileStyles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}