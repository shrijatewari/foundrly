# Foundrly

A mobile app built for early-stage founders to track startup health, connect with a founder community, and get real-time AI co-founder guidance — all inside a dark, high-contrast interface designed for focus.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (SDK 56) — runs on iOS, Android, and web (`react-native-web`) |
| Language | TypeScript |
| UI | React Native core components + `react-native-safe-area-context` |
| Animation | React Native `Animated` API (mount transitions, shake, hover lift, looping gradient cycle) |
| Navigation | React Navigation v7 — Native Stack + Bottom Tabs (with a custom floating tab bar) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Persistence | [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) |
| Icons | `@expo/vector-icons` (Ionicons) |
| Fonts | Space Grotesk (UI) + Space Mono (metrics) via `@expo-google-fonts/*` |
| Gradients | `expo-linear-gradient` |

---

## Folder Structure

```
foundrly/
├── App.tsx                   # Root component — NavigationContainer + SafeAreaProvider
├── index.ts                  # Expo entry point
├── app.json                  # Expo config (name, slug, icons)
│
├── theme/
│   ├── colors.ts             # Design tokens: background, surface, primary, accent, text, borders
│   ├── fonts.ts              # Font-family tokens (Space Grotesk weights + Space Mono)
│   └── typography.ts         # Type scale: heading, subheading, body, caption
│
├── components/
│   ├── FoundrlyDock.tsx      # Floating bottom-nav dock (animated, used as a custom tab bar)
│   └── AnimatedTagline.tsx   # "Build. Learn. Launch." animated gradient tagline (splash)
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
│   ├── MainTabNavigator.tsx  # Bottom tabs (Dashboard, Community, AI, Profile) — renders FoundrlyDock as the tab bar
│   └── types.ts              # RootStackParamList and TabParamList type declarations
│
├── screens/
│   ├── SplashScreen.tsx      # Animated splash: wordmark + gradient tagline, fades into Login after 2.5s
│   ├── LoginScreen.tsx       # Themed login: mount/shake animations, gradient button, inline validation
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
git clone https://github.com/shrijatewari/foundrly.git
cd foundrly

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start            # device / simulator
npx expo start --web      # run in the browser at http://localhost:8081

# 4. Scan the QR code with Expo Go (Android) or the Camera app (iOS),
#    press 'a' for Android emulator / 'i' for iOS simulator,
#    or press 'w' to open the web build
```

---

## Design System

Foundrly ships a single, dark-only theme. All visual values come from `theme/` tokens
(`colors`, `fonts`, `typography`) and are consumed directly in `StyleSheet.create` — no
runtime theming or context.

| Token | Value | Usage |
|---|---|---|
| `background` | `#0B0B0F` | App / screen background |
| `surface` | `#121217` | Cards, inputs, bubbles |
| `primary` | `#6E0F1A` | Deep crimson (gradient start) |
| `accent` | `#FF3B5C` | Highlights, active states, CTAs |
| `text` / `textMuted` | `#FFFFFF` / `#888899` | Foreground / secondary text |

**Typography:** Space Grotesk for all UI text (regular → bold) and Space Mono for numeric
metrics, loaded via `useFonts` in `App.tsx`.

### Animated UI

- **Splash** — `Foundrly` wordmark over an animated `Build. / Learn. / Launch.` tagline. Each
  word loops through its own crimson→accent gradient via `Animated` color interpolation
  (staggered per word), framed by a bordered box with accent corner marks. Fades out into Login.
- **Login** — staggered mount-in, error shake, press-scale, and a `primary → accent`
  `expo-linear-gradient` submit button.
- **FoundrlyDock** — a floating, fit-content bottom-nav dock wired into React Navigation as a
  custom `tabBar`. Active tab shows an accent icon + dot indicator; inactive tabs lift and reveal
  a tooltip on hover/press. Screens add bottom padding so content clears the dock.

---

## Architecture Notes

Foundrly follows an **MVVM-inspired separation** across four distinct layers:

### Model — `data/` + `types/`
Pure data with no UI or business logic. `data/` files export typed seed objects used to seed stores on first launch. `types/index.ts` defines the shared TypeScript contracts that every other layer depends on. Nothing in this layer imports from React or React Native.

### ViewModel — `store/`
Zustand stores own all mutable runtime state and all side effects (AsyncStorage reads/writes). Stores hydrate themselves asynchronously at module load time and expose minimal, action-oriented APIs (`toggleTask`, `sendMessage`). Screens never manipulate data directly — they call store actions and read derived state.

### View — `screens/`
Screens are pure presentational components. They subscribe to store slices via hooks and forward user interactions to store actions. No business logic lives here — if a screen computes something, it either belongs in the store or in a pure utility function.

### Infrastructure — `navigation/` + `theme/` + `components/`
`navigation/` wires screens into typed navigators; it owns no state and imports no stores. `theme/` exports frozen constant objects (`colors`, `fonts`, `typography`) consumed directly via `StyleSheet.create` — no runtime theming overhead, no context required. `components/` holds reusable, presentational UI primitives (e.g. `FoundrlyDock`, `AnimatedTagline`) that take plain props and own only their local animation state.

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
