# WearPark-App

## Setup
- Install dependencies
```bash
npm install
```

## Run with Expo Go (recommended)
- Start the Metro server
```bash
npx expo start
```
- Scan the QR code with the Expo Go app on your device (same Wi-Fi).

## Run on Android emulator
- Prereqs: Android Studio + an AVD created; ensure ANDROID_HOME is configured.
- Start an emulator
	- UI: Android Studio → Device Manager → Play an AVD
	- CLI: list and boot
```bash
emulator -list-avds
emulator -avd <your_avd_name>
```
For MacOS
```bash
~/Library/Android/sdk/emulator/emulator -list-avds
~/Library/Android/sdk/emulator/emulator -avd Medium_Phone_API_36.1
```
- Start the app on the emulator
```bash
npx expo start --android
```
