import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { store } from './store'
import routes  from './routes/config/routes'
import ProtectedRoute from './routes/protected-route'
import RootLayout from './layout/root-layout'
import { SidebarProvider } from './contexts/side-bar-context'

const LoadingSpinner = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
          <SidebarProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {routes.map((route) => {
                    // Redirect routes
                    if (route.redirectTo) {
                      return (
                        <Route
                          key={route.key}
                          path={route.path}
                          element={<Navigate to={route.redirectTo} replace />}
                        />
                      )
                    }

                    const Page = route.element

                    let element = <Page />

                    // Wrap with layout if needed
                    if (route.isLayout) {
                      element = <RootLayout>{element}</RootLayout>
                    }

                    // Wrap with protection if needed
                    if (route.isProtected) {
                      element = (
                        <ProtectedRoute>
                          {element}
                        </ProtectedRoute>
                      )
                    }

                    return (
                      <Route
                        key={route.key}
                        path={route.path}
                        element={element}
                      />
                    )
                  })}
                </Routes>
              </Suspense>
              <NotificationWrapper />
            </Router>
          </SidebarProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
