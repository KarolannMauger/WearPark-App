import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.icon,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
        },
        tabBarLabelStyle: {
          fontFamily: 'Roboto_500Medium',
          color: theme.colors.textSecondary
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcons
              name="home-filled"
              size={size}
              color={
                focused
                  ? theme.colors.icon
                  : theme.colors.iconTab
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="data-history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcons
              name="area-chart"
              size={size}
              color={
                focused
                  ? theme.colors.icon
                  : theme.colors.iconTab
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="motion-reports"
        options={{
          title: 'Rapports',
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcons
              name="file-copy"
              size={size}
              color={
                focused
                  ? theme.colors.icon
                  : theme.colors.iconTab
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcons
              name="person"
              size={size}
              color={
                focused
                  ? theme.colors.icon
                  : theme.colors.iconTab
              }
            />
          ),
        }}
      />

    </Tabs>
  );
}