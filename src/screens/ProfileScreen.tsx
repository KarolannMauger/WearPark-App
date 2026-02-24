import React from 'react';
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
            <TouchableOpacity
              onPress={() => router.push('/devices')}
              style={profileStyles.deviceInfo}
            >
              <View style={profileStyles.iconView}>
                <MaterialIcons
                  name={user?.device ? 'watch' : 'watch-off'}
                  size={20}
                  color={theme.colors.textPrimary}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={profileStyles.deviceText}>
                  {user?.device ? user.device.deviceKey : 'Aucun appareil connecté'}
                </Text>
                {user?.device && (
                  <Text style={profileStyles.deviceSubText}>
                    Appuyer pour gérer
                  </Text>
                )}
              </View>

              <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
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