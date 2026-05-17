# WearPark App

![React Native](https://img.shields.io/badge/React_Native-0.76-3178C6?style=flat&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-52-000000?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)

> Cross-platform mobile and web application for real-time Parkinsonian tremor monitoring.
> Part of the **WearPark** research project.

---

## Overview

WearPark App displays tremor data collected from a wrist-worn IMU sensor, streamed in real time via WebSocket. It provides patients with a live dashboard, a monthly history calendar, and tools to share their data with medical professionals.

The app targets three platforms from a single codebase:

| Platform | Layout |
|---|---|
| **iOS / Android** | Native mobile layout with tab navigation |
| **Web** | Responsive layout with sidebar — used for the admin console |

---

## System Architecture

```
ICM-20948 (100 Hz)
      │
      ▼
  Embedded (CircuitPython)
      │  IMU stream
      ▼
  Backend (Java Spring Boot)
      │  WebSocket /ws/motion
      │  REST    /motion/view
      ▼
  WearPark App
      │
      ├─ Live chart (WebSocket)
      ├─ Daily summary (REST)
      ├─ Monthly calendar (REST)
      ├─ PDF report generation (REST)
      └─ User profile (REST)
```

---

## Features

### For users

- **Live tremor chart** — Real-time accelerometer data streamed via WebSocket, buffered and flushed every 500 ms
- **Daily summary** — Mean amplitude, peak amplitude, variance, and coverage for the current day
- **Monthly calendar** — Per-day mean amplitude displayed inline; tap a day to load detailed data
- **Device management** — Add, update key, or disable a wrist device from the profile page
- **PDF report generation** — Export a structured summary for medical follow-up
- **Dark / light mode** — Adaptive UI based on system preferences

### For administrators (web only)

- **User table** — Paginated list with inline role toggle and soft delete
- **Device management** — Add or disable devices on behalf of any user
- **Web-only guard** — Admin console blocked on mobile with a logout prompt

---

## Repository Structure

```
WearPark-App/
src/
├── app/
│   ├── (auth)/               # Login, register, complete profile
│   ├── (tabs)/               # Home, history, motion reports, profile
│   ├── admin/                # Admin console (web only)
│   │   └── users/[id].tsx
│   ├── devices.tsx
│   ├── edit-profile.tsx
│   ├── index.tsx
│   └── settings.tsx
├── components/               # Shared UI components
├── config/
├── constants/
├── context/                  # React Context (User, Theme)
├── errors/                   # ApiError class
├── screens/                  # Screen-level components
├── services/                 # API clients (REST + WebSocket)
├── styles/                   # Theme tokens and screen styles
├── types/                    # TypeScript interfaces
└── utils/                    # Helpers (storage, date, base64, validators)
```

---

## Getting Started

### 1. Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI — `npm install -g expo-cli`
- Expo Go on device (for physical testing)

### 2. Clone and install

```bash
git clone https://github.com/your-org/WearPark-App.git
cd WearPark-App
npm install
```

### 3. Configure environment

Create a `.env` file at the project root:

```env
API_URL=http://localhost:8080
```

### 4. Start

```bash
npm run dev            # Start Expo DevTools
```

---

## Scripts

```bash
# Development
npm start                # Start Expo (default env)
npm run dev              # Start with development env
npm run dev-tunnel       # Start with tunnel (physical device)
npm run dev:android      # Android with development env
npm run dev:ios          # iOS with development env

# Environment-specific
npm run android          # Android (default env)
npm run ios              # iOS (default env)
npm run web              # Browser (default env)
npm run env:test         # Start with test env
npm run env:test:android # Android with test env
npm run env:test:ios     # iOS with test env
npm run prod:preview     # Start with production env

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## Tests

Tests are written with **Jest** and cover services and utilities.

| Module | Coverage |
|---|---|
| `motionWebSocketService` | connect, subscribe, disconnect, buffer flush, timer cleanup |
| `motionService` | response parsing, `"NaN"` sanitization, NaN float filtering, error propagation |
| `adminService` | user listing, role update, soft delete, error handling |
| `adminDeviceService` | device creation, key update, disable, error handling |
| `deviceService` | device creation, key update, disable, error handling |
| `authService` | login, register, logout, token handling |
| `userService` | get profile, update profile, error handling |
| `api` | request interceptors, token injection, error normalization |
| `ThemeContext` | theme toggle, persistence, default values |
| `UserContext` | login flow, register flow, logout, profile loading, route guards |
| `base64` | float array encoding and decoding |
| `date` | formatting, ISO conversion, edge cases |
| `storage` | get, set, delete, SecureStore integration |
| `validators` | email, password, required field rules |
| `alert` | cross-platform alert abstraction |

Run coverage report:

```bash
npm run test:coverage
```

> Overall coverage target: **> 70%**

---

## Tech Stack

### Core
- **[React Native](https://reactnative.dev/)** `0.81.x`
- **[Expo](https://expo.dev/)** `~54.0.x`
- **[TypeScript](https://www.typescriptlang.org/)** `5.9.x`
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `~6.0.x`

### UI
- **[React Native Calendars](https://github.com/wix/react-native-calendars)** — interactive calendar
- **[React Native Gifted Charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)** — charts and visualizations
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** — native gradients
- **[Expo Checkbox](https://docs.expo.dev/versions/latest/sdk/checkbox/)** — checkbox input
- **[React Native Keyboard Aware ScrollView](https://github.com/APSL/react-native-keyboard-aware-scroll-view)** — keyboard handling
- **[Expo Google Fonts](https://github.com/expo/google-fonts)** — Roboto, Work Sans

### Data & State
- **[Axios](https://axios-http.com/)** `1.13.x` — HTTP client
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** — local storage
- **[Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)** — JWT storage
- **[base64-js](https://github.com/beatgammit/base64-js)** — base64 encoding for IMU binary data
- **Context API** — global state (User, Theme)

### File & Sharing
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** — PDF file read/write
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** — native share sheet for PDF export

### Tooling
- **[Jest](https://jestjs.io/)** `29.x` — test framework
- **[jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo)** — Expo Jest preset
- **[jest-websocket-mock](https://github.com/romgain/jest-websocket-mock)** — WebSocket mocking
- **[@testing-library/react-native](https://callstack.github.io/react-native-testing-library/)** — component testing
- **[cross-env](https://github.com/kentcdodds/cross-env)** — cross-platform environment variables
---

## Related Repositories

| Repository | Description |
|---|---|
| [WearPark-Embedded](https://github.com/KarolannMauger/WearPark-Embedded) | CircuitPython firmware — ICM-20948 data acquisition |
| [WearPark-Backend](https://github.com/KarolannMauger/WearPark-Backend) | Java Spring Boot — data storage and ML orchestration |
| [WearPark-ML](https://github.com/KarolannMauger/WearPark-ML) | Residual CNN — binary Parkinson tremor classification |

---

## License

Copyright © 2026 WearPark. All rights reserved.
This project is released under the [MIT License](./LICENSE).

> **Medical disclaimer:** This software is a research prototype and is NOT a certified medical device. It must not be used as a substitute for professional medical diagnosis or treatment.
