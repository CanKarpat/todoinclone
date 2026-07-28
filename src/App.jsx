import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Nav } from './components/Nav'
import { Toaster } from './components/ui/toaster'
import Login from './pages/Login'
import Todos from './pages/Todos'
import Meetings from './pages/Meetings'

function AppLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="app-main">{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Todos />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Meetings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
