import { createSlice } from '@reduxjs/toolkit';

const defaultLightTheme = {
  // Background and Surface Colors
  background: 'oklch(0.97 0 0)',           // Light off-white
  foreground: 'oklch(0.15 0 0)',           // Dark text
  card: 'oklch(0.98 0 0)',                 // Lighter card background
  cardForeground: 'oklch(0.15 0 0)',       // Dark text on light card
  popover: 'oklch(0.98 0 0)',              // Light popover
  popoverForeground: 'oklch(0.15 0 0)',    // Dark text in popover

  // Primary Colors (Brand)
  primary: 'oklch(0.50 0.18 280)',         // Primary brand color (indigo)
  primaryForeground: 'oklch(0.98 0 0)',    // Light text on primary

  // Secondary Colors
  secondary: 'oklch(0.92 0 0)',            // Light secondary
  secondaryForeground: 'oklch(0.22 0 0)',  // Dark text on secondary

  // Muted Colors
  muted: 'oklch(0.92 0 0)',                // Muted background
  mutedForeground: 'oklch(0.45 0 0)',      // Muted text

  // Accent Colors
  accent: 'oklch(0.90 0 0)',               // Light accent
  accentForeground: 'oklch(0.20 0 0)',     // Dark text on accent

  // Destructive/Error Colors
  destructive: 'oklch(0.65 0.22 25)',      // Red for errors
  destructiveForeground: 'oklch(0.98 0 0)',// Light text on error

  // Borders and Rings
  border: 'oklch(0.88 0 0)',               // Light border
  input: 'oklch(0.92 0 0)',                // Light input background
  ring: 'oklch(0.50 0.18 280)',            // Primary ring color

  // Sidebar Colors
  sidebar: 'oklch(0.94 0 0)',              // Light sidebar
  sidebarForeground: 'oklch(0.20 0 0)',    // Dark text in sidebar
  sidebarPrimary: 'oklch(0.50 0.18 280)',  // Primary in sidebar
  sidebarPrimaryForeground: 'oklch(0.98 0 0)',
  sidebarAccent: 'oklch(0.88 0 0)',        // Light accent in sidebar
  sidebarAccentForeground: 'oklch(0.15 0 0)',
  sidebarBorder: 'oklch(0.88 0 0 / 0.3)',

  // Chart Colors
  chart1: 'oklch(0.50 0.18 280)',          // Indigo
  chart2: 'oklch(0.55 0.16 290)',          // Violet
  chart3: 'oklch(0.45 0.20 280)',          // Purple
  chart4: 'oklch(0.60 0.14 270)',          // Blue
  chart5: 'oklch(0.40 0.18 285)',          // Deep purple

  radius: '0.625rem',
  tableHeader: 'oklch(0.94 0 0)',                // light
  tableHeaderForeground: 'oklch(0.22 0 0)',
  sidebarRing: 'oklch(0.60 0.16 270)',           // light
  // border: 'oklch(0.45 0 0 / 0.85)',
  input: 'oklch(0.75 0 0 / 0.25)',
};

// Default Dark Theme Colors
const defaultDarkTheme = {
  // Background and Surface Colors
  background: 'oklch(0.25 0 0)',           // Dark background
  foreground: 'oklch(0.95 0 0)',           // Light text
  card: 'oklch(0.30 0 0)',                 // Dark card background
  cardForeground: 'oklch(0.95 0 0)',       // Light text on dark card
  popover: 'oklch(0.30 0 0)',              // Dark popover
  popoverForeground: 'oklch(0.95 0 0)',    // Light text in popover

  // Primary Colors (Brand)
  primary: 'oklch(0.50 0.18 280)',         // Primary brand color (indigo)
  primaryForeground: 'oklch(0.98 0 0)',    // Light text on primary

  // Secondary Colors
  secondary: 'oklch(0.35 0 0)',            // Dark secondary
  secondaryForeground: 'oklch(0.95 0 0)',  // Light text on secondary

  // Muted Colors
  muted: 'oklch(0.32 0 0)',                // Muted background (dark)
  mutedForeground: 'oklch(0.65 0 0)',      // Muted text

  // Accent Colors
  accent: 'oklch(0.45 0.20 280)',          // Vibrant accent
  accentForeground: 'oklch(0.98 0 0)',     // Light text on accent

  // Destructive/Error Colors
  destructive: 'oklch(0.55 0.22 25)',      // Red for errors
  destructiveForeground: 'oklch(0.98 0 0)',// Light text on error

  // Borders and Rings
  border: 'oklch(0.40 0 0 / 0.3)',         // Dark border with transparency
  input: 'oklch(0.35 0 0)',                // Dark input background
  ring: 'oklch(0.50 0.18 280)',            // Primary ring color

  // Sidebar Colors
  sidebar: 'oklch(0.20 0 0)',              // Very dark sidebar
  sidebarForeground: 'oklch(0.95 0 0)',    // Light text in sidebar
  sidebarPrimary: 'oklch(0.50 0.18 280)',  // Primary in sidebar
  sidebarPrimaryForeground: 'oklch(0.98 0 0)',
  sidebarAccent: 'oklch(0.30 0 0)',        // Dark accent in sidebar
  sidebarAccentForeground: 'oklch(0.95 0 0)',
  sidebarBorder: 'oklch(0.35 0 0 / 0.3)',

  // Chart Colors
  chart1: 'oklch(0.50 0.18 280)',          // Indigo
  chart2: 'oklch(0.55 0.16 290)',          // Violet
  chart3: 'oklch(0.45 0.20 280)',          // Purple
  chart4: 'oklch(0.60 0.14 270)',          // Blue
  chart5: 'oklch(0.40 0.18 285)',          // Deep purple

  tableHeader: 'oklch(0.38 0 0)',                // dark
  tableHeaderForeground: 'oklch(0.92 0 0)',
  sidebarRing: 'oklch(0.50 0.18 280)',           // dark
  border: 'oklch(0.40 0 0 / 0.3)',
  input: 'oklch(0.35 0 0)',

};

const initialState = {
  isDarkMode: true, // Default theme mode
  lightTheme: defaultLightTheme,
  darkTheme: defaultDarkTheme,
};


const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setLightTheme: (state) => {
      state.isDarkMode = false;
    },
    setDarkTheme: (state) => {
      state.isDarkMode = true;
    },
    updateLightTheme: (state, action) => {
      state.lightTheme = {
        ...state.lightTheme,
        ...action.payload,
      };
    },

    updateDarkTheme: (state, action) => {
      state.darkTheme = {
        ...state.darkTheme,
        ...action.payload,
      };
    },
  },
});

export const {
  toggleTheme,
  setLightTheme,
  setDarkTheme,
  updateLightTheme,
  updateDarkTheme,
} = themeSlice.actions;

// Selectors
export const selectThemeMode = (state) => state.theme.isDarkMode;

export const selectCurrentTheme = (state) => {
  return state.theme.isDarkMode === false
    ? state.theme.lightTheme 
    : state.theme.darkTheme;
};

export const selectLightTheme = (state) => state.theme.lightTheme;

export const selectDarkTheme = (state) => state.theme.darkTheme;

export const selectThemeColor = (colorName) => (state) => {
  const currentTheme = state.theme.isDarkMode === false
    ? state.theme.lightTheme 
    : state.theme.darkTheme;
  return currentTheme[colorName];
};

// Export reducer for store configuration
export default themeSlice.reducer;
  