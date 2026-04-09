import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/agenda', label: 'Agenda' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/finanzas/ingresos', label: 'Ingresos', parent: 'finanzas' },
    { path: '/finanzas/gastos', label: 'Gastos', parent: 'finanzas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold text-white">EnsayoHub</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/agenda"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/agenda') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agenda
            </Link>
            
            <Link
              to="/clientes"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/clientes') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Clientes
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/dashboard') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/tarifas"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/tarifas') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tarifas
            </Link>

            <div className="pt-4">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase">Finanzas</p>
            </div>
            
            <Link
              to="/finanzas/ingresos"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/finanzas/ingresos') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ingresos
            </Link>
            
            <Link
              to="/finanzas/gastos"
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/finanzas/gastos') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Gastos
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile spacer */}
            <div className="w-12 lg:hidden" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Admin</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="text-sm text-slate-600 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
