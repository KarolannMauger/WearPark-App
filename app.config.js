import 'dotenv/config';

export default{
  "expo": {
    "name": "WearPark-App",
    "slug": "WearPark-App",
    "scheme": "wearparkapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      "@react-native-community/datetimepicker"
    ],
    extra: {
      apiUrl: process.env.API_URL,
      env: process.env.ENV,
      debug: process.env.DEBUG === 'true',
    },
  }
}
