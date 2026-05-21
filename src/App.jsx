import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Origem from './pages/Origem'
import Nic from './pages/Nic'
import Secretaria from './pages/Secretaria'
import Laboratorio from './pages/Laboratorio'
import Analise from './pages/Analise'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="origem" element={<Origem />} />
            <Route path="nic" element={<Nic />} />
            <Route path="secretaria" element={<Secretaria />} />
            <Route path="laboratorio" element={<Laboratorio />} />
            <Route path="analise" element={<Analise />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
