import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Agenda } from './pages/Agenda'
import { Clients } from './pages/Clients'
import { Dashboard } from './pages/Dashboard'
import { Incomes } from './pages/finance/Incomes'
import { Expenses } from './pages/finance/Expenses'
import { Tariffs } from './pages/Tariffs'
import { Login } from './pages/Login'

function App() {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/agenda" replace />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tarifas" element={<Tariffs />} />
        <Route path="/finanzas/ingresos" element={<Incomes />} />
        <Route path="/finanzas/gastos" element={<Expenses />} />
      </Routes>
    </Layout>
  )
}

export default App
