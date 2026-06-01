# Foundrly

A mobile app built for early-stage founders to track startup health, connect with a founder community, and get real-time AI co-founder guidance — all inside a dark, high-contrast interface designed for focus.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (SDK 56, bare workflow) |
| Language | TypeScript |
| UI | React Native core components + `react-native-safe-area-context` |
| Navigation | React Navigation v7 — Native Stack + Bottom Tabs |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Persistence | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| Icons | `@expo/vector-icons` (Ionicons) |

---

## Folder Structure

```
foundrly/
├── App.tsx                   # Root component — NavigationContainer + SafeAreaProvider
├── index.ts                  # Expo entry point
├── app.json                  # Expo config (name, slug, icons)
│
├── theme/
│   ├── colors.ts             # Design tokens: background, secondary, primary, accent, text
│   └── typography.ts         # Type scale: heading, subheading, body, caption
│
├── types/
│   └── index.ts              # Shared TypeScript interfaces (Post, FounderProfile, Task, StartupHealth, AIMessage)
│
├── data/
│   ├── dashboard.ts          # Seed data: StartupHealth, AI suggestions, tasks, upcoming event
│   ├── posts.ts              # Seed data: 5 community posts
│   └── profile.ts            # Seed data: founder profile
│
├── store/
│   ├── useDashboardStore.ts  # Zustand store — daily tasks with AsyncStorage persistence
│   └── useAIStore.ts         # Zustand store — chat messages with AsyncStorage persistence
│
├── navigation/
│   ├── RootNavigator.tsx     # Stack navigator wrapping auth screens + main tabs
│   ├── MainTabNavigator.tsx  # Bottom tab navigator (Dashboard, Community, AI, Profile)
│   └── types.ts              # RootStackParamList and TabParamList type declarations
│
├── screens/
│   ├── SplashScreen.tsx      # Auth flow: splash/loading
│   ├── LoginScreen.tsx       # Auth flow: login
│   ├── DashboardScreen.tsx   # Startup health, AI suggestions, tasks, upcoming event
│   ├── CommunityScreen.tsx   # Feed of founder posts
│   ├── AIScreen.tsx          # AI co-founder chat
│   └── ProfileScreen.tsx     # Founder profile view
│
└── assets/                   # App icon and splash image
```

---

## Running Locally

**Prerequisites:** Node.js 18+, npm, Expo Go installed on your device or an iOS/Android simulator.

```bash
# 1. Clone the repo
git clone https://github.com/your-username/foundrly.git
cd foundrly

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start

# 4. Scan the QR code with Expo Go (Android) or the Camera app (iOS)
#    or press 'a' for Android emulator / 'i' for iOS simulator
```

---

## Screenshots

| Dashboard | AI Chat | Community |
|---|---|---|
| _placeholder_ | _placeholder_ | _placeholder_ |

---

## Architecture Notes

Foundrly follows an **MVVM-inspired separation** across four distinct layers:

### Model — `data/` + `types/`
Pure data with no UI or business logic. `data/` files export typed seed objects used to seed stores on first launch. `types/index.ts` defines the shared TypeScript contracts that every other layer depends on. Nothing in this layer imports from React or React Native.

### ViewModel — `store/`
Zustand stores own all mutable runtime state and all side effects (AsyncStorage reads/writes). Stores hydrate themselves asynchronously at module load time and expose minimal, action-oriented APIs (`toggleTask`, `sendMessage`). Screens never manipulate data directly — they call store actions and read derived state.

### View — `screens/`
Screens are pure presentational components. They subscribe to store slices via hooks and forward user interactions to store actions. No business logic lives here — if a screen computes something, it either belongs in the store or in a pure utility function.

### Infrastructure — `navigation/` + `theme/`
`navigation/` wires screens into typed navigators; it owns no state and imports no stores. `theme/` exports frozen constant objects (`colors`, `typography`) consumed directly via `StyleSheet.create` — no runtime theming overhead, no context required.

---

### Data Flow

```
User interaction
      │
      ▼
  Screen (View)
      │  calls action
      ▼
  Zustand Store (ViewModel)
      │  persists to          reads seed from
      ▼                            ▼
AsyncStorage              data/ (Model)
      │
      ▼
  set() → re-render
```

This pattern keeps screens thin, makes stores independently testable, and ensures persistence is never the screen's responsibility.
