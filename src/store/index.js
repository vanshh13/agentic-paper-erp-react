import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

// reducers
import authReducer from './slices/userSlice'
// import themeReducer from './theme-slice'
// import breadcrumbsReducer from './breadcrumbs-slice'

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
}

// Root reducer with persisted slices
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  // theme: persistReducer(themePersistConfig, themeReducer),
  // breadcrumbs: breadcrumbsReducer, // not persisted
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
