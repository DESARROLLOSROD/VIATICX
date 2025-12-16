import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Building,
  User,
  Tag,
  FolderOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '@/components/layout/MainLayout'
import { expensesService } from '@/services/expenses.service'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ExpenseDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: expense, isLoading } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesService.getExpense(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => expensesService.deleteExpense(id!),
    onSuccess: () => {
      toast.success('Gasto eliminado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      navigate('/expenses')
    },
    onError: () => {
      toast.error('Error al eliminar el gasto')
    },
  })

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      deleteMutation.mutate()
    }
  }

  const handleEdit = () => {
    navigate(`/expenses/${id}/edit`)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon size={16} />
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!expense) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Gasto no encontrado</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/expenses')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle del Gasto</h1>
              <p className="text-sm text-gray-500">ID: {expense.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {expense.status === 'pending' && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={18} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Download size={18} />
              Descargar
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">Estado del Gasto</p>
              {getStatusBadge(expense.status)}
            </div>
            {expense.approver && expense.approvedAt && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Aprobado por</p>
                <p className="font-medium">{expense.approver.firstName} {expense.approver.lastName}</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(expense.approvedAt), 'dd MMM yyyy HH:mm', { locale: es })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-blue-600" size={24} />
                <h2 className="text-lg font-semibold">Información del Gasto</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Monto</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {expense.currency}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha del Gasto</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="font-medium">
                        {format(new Date(expense.expenseDate), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Método de Pago</p>
                    <p className="font-medium mt-1">{expense.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Comercio / Proveedor</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building size={16} className="text-gray-400" />
                    <p className="font-medium">{expense.merchantName || 'No especificado'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Descripción</p>
                  <div className="flex items-start gap-2 mt-1">
                    <FileText size={16} className="text-gray-400 mt-1" />
                    <p className="font-medium">{expense.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Información Adicional</h2>

              <div className="space-y-4">
                {expense.category && (
                  <div>
                    <p className="text-sm text-gray-500">Categoría</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag size={16} className="text-gray-400" />
                      <p className="font-medium">{expense.category.name}</p>
                    </div>
                  </div>
                )}

                {expense.project && (
                  <div>
                    <p className="text-sm text-gray-500">Proyecto</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FolderOpen size={16} className="text-gray-400" />
                      <p className="font-medium">{expense.project.name}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Registrado por</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{expense.user.firstName} {expense.user.lastName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Registro</p>
                    <p className="text-sm font-medium mt-1">
                      {format(new Date(expense.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval/Rejection Notes */}
            {expense.rejectedReason && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Razón de Rechazo
                </h2>
                <div className="p-4 rounded-lg bg-red-50">
                  <p className="text-gray-700">
                    {expense.rejectedReason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attachments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Archivos Adjuntos</h2>

              {expense.attachments && expense.attachments.length > 0 ? (
                <div className="space-y-3">
                  {expense.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{file.fileName}</p>
                          <p className="text-xs text-gray-500">{file.fileType}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">No hay archivos adjuntos</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-100">Estado:</span>
                  <span className="font-semibold">{expense.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Monto:</span>
                  <span className="font-semibold">
                    ${expense.amount.toLocaleString('es-MX')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Categoría:</span>
                  <span className="font-semibold">{expense.category?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ExpenseDetailPage
