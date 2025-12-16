import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">VIATICX</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a VIATICX! 🎉
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sistema de Gestión de Gastos y Viáticos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold mb-2">Gestión de Gastos</h3>
                <p className="text-sm text-gray-600">
                  Registra y administra todos tus gastos empresariales
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-2">Aprobaciones</h3>
                <p className="text-sm text-gray-600">
                  Flujo de aprobación rápido y eficiente
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                <p className="text-sm text-gray-600">
                  Exporta y analiza tu información contable
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-primary-50 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                🚀 MVP Funcional
              </h3>
              <p className="text-sm text-primary-700 mb-4">
                Backend y Frontend conectados exitosamente
              </p>
              <div className="text-xs text-primary-600 space-y-1">
                <p>✅ Autenticación JWT funcionando</p>
                <p>✅ API REST completa</p>
                <p>✅ Base de datos PostgreSQL</p>
                <p>✅ Frontend React + TypeScript</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
