import { useQuery } from '@tanstack/react-query';
import { expensesService } from '@/services/expenses.service';
import MainLayout from '@/components/layout/MainLayout';
import { Receipt, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['expense-stats'],
    queryFn: () => expensesService.getStats(),
  });

  const statsCards = [
    {
      name: 'Total de Gastos',
      value: stats?.totalExpenses || 0,
      icon: Receipt,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      name: 'Pendientes',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      name: 'Aprobados',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      name: 'Rechazados',
      value: stats?.rejected || 0,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Resumen de tus gastos empresariales
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Amount Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monto Total</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats?.totalAmount || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Suma de todos los gastos registrados
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Monto Aprobado</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">
              {formatCurrency(stats?.approvedAmount || 0)}
            </p>
            <p className="text-sm text-green-700 mt-2">
              Gastos aprobados para reembolso
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a VIATICX! 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              Sistema de Gestión de Gastos y Viáticos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold mb-2">Gestión de Gastos</h3>
                <p className="text-sm text-gray-600">
                  Registra y administra todos tus gastos empresariales
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-2">Aprobaciones</h3>
                <p className="text-sm text-gray-600">
                  Flujo de aprobación rápido y eficiente
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                <p className="text-sm text-gray-600">
                  Exporta y analiza tu información contable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
