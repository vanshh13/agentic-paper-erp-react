import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import authReducer from './slices/user-slice'
import themeReducer from './slices/theme-slice'
import breadcrumbsReducer from './slices/breadcrumbs-slice'

// Persist config for auth slice
const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
  whitelist: ['user', 'isAuthenticated', 'token'],
}

// Persist config for theme slice
const themePersistConfig = {
  key: 'theme',
  storage: storageSession,
  whitelist: ['isDarkMode'],
}

// Root reducer with persisted slices
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
  breadcrumbs: breadcrumbsReducer, // not persisted
}

// Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Persistor
export const persistor = persistStore(store)

export default store