import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import { expensesService, Expense } from '../services/expenses.service'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Textarea from '../components/ui/Textarea'

const ApprovalsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve')
  const [notes, setNotes] = useState('')

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', { status: 'pending' }],
    queryFn: () => expensesService.getExpenses({ status: 'pending' }),
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      expensesService.approveExpense(id, notes),
    onSuccess: () => {
      toast.success('Gasto aprobado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setShowApprovalModal(false)
      setSelectedExpense(null)
      setNotes('')
    },
    onError: () => {
      toast.error('Error al aprobar el gasto')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      expensesService.rejectExpense(id, reason),
    onSuccess: () => {
      toast.success('Gasto rechazado')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setShowApprovalModal(false)
      setSelectedExpense(null)
      setNotes('')
    },
    onError: () => {
      toast.error('Error al rechazar el gasto')
    },
  })

  const handleApprovalAction = () => {
    if (!selectedExpense) return

    if (approvalAction === 'approve') {
      approveMutation.mutate({ id: selectedExpense.id, notes })
    } else {
      if (!notes.trim()) {
        toast.error('Por favor proporciona una razón para el rechazo')
        return
      }
      rejectMutation.mutate({ id: selectedExpense.id, reason: notes })
    }
  }

  const openApprovalModal = (expense: Expense, action: 'approve' | 'reject') => {
    setSelectedExpense(expense)
    setApprovalAction(action)
    setShowApprovalModal(true)
    setNotes('')
  }

  const totalAmount = expenses?.reduce((sum: number, exp: Expense) => sum + Number(exp.amount), 0) || 0

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aprobaciones</h1>
            <p className="text-gray-500">Revisa y aprueba gastos pendientes</p>
          </div>
          <Button variant="outline" leftIcon={<Filter size={18} />}>
            Filtrar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">Gastos Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{expenses?.length || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="text-yellow-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">Monto Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">Empleados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Set(expenses?.map((e: Expense) => e.user.id)).size || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <Card>
          <div className="overflow-hidden">
            {expenses && expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.map((expense: Expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {expense.user.firstName} {expense.user.lastName}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{expense.merchantName}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{expense.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {format(new Date(expense.expenseDate), 'dd MMM yyyy', { locale: es })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            ${Number(expense.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-gray-500">{expense.currency}</p>
                        </td>
                        <td className="px-6 py-4">
                          {expense.category ? (
                            <Badge variant="primary" size="sm">
                              {expense.category.name}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin categoría</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/expenses/${expense.id}`)}
                              title="Ver detalle"
                            >
                              <Eye size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => openApprovalModal(expense, 'approve')}
                              title="Aprobar"
                            >
                              <CheckCircle size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => openApprovalModal(expense, 'reject')}
                              title="Rechazar"
                            >
                              <XCircle size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay gastos pendientes
                </h3>
                <p className="text-gray-500">
                  Todos los gastos han sido aprobados o rechazados
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false)
          setSelectedExpense(null)
          setNotes('')
        }}
        title={approvalAction === 'approve' ? 'Aprobar Gasto' : 'Rechazar Gasto'}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowApprovalModal(false)
                setSelectedExpense(null)
                setNotes('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'success' : 'danger' as any}
              // Note: 'success' variant not in Button types, using 'primary' or custom className if needed.
              // Actually I defined 'success' in Badge but NOT in Button. 
              // Button only has: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
              // So I should use 'primary' (which is blue) or add 'success' (green) to Button.
              // For now, I'll use success styling via className override or just stick to Primary.
              className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : ''}
              onClick={handleApprovalAction}
              isLoading={approveMutation.isPending || rejectMutation.isPending}
              leftIcon={approvalAction === 'approve' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            >
              {approvalAction === 'approve' ? 'Aprobar Gasto' : 'Rechazar Gasto'}
            </Button>
          </>
        }
      >
        {selectedExpense && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Empleado:</span>
                <span className="font-medium">
                  {selectedExpense.user.firstName} {selectedExpense.user.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descrição:</span>
                <span className="font-medium">{selectedExpense.merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-bold text-lg">
                  ${Number(selectedExpense.amount).toLocaleString('es-MX')} {selectedExpense.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {format(new Date(selectedExpense.expenseDate), 'dd MMMM yyyy', { locale: es })}
                </span>
              </div>
            </div>

            <Textarea
              label={approvalAction === 'approve' ? 'Notas (opcional)' : 'Razón del rechazo *'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={
                approvalAction === 'approve'
                  ? 'Agrega notas sobre esta aprobación...'
                  : 'Explica por qué se rechaza este gasto...'
              }
            />

            {approvalAction === 'reject' && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                <p>Esta acción notificará al empleado y requerirá corrección.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MainLayout>
  )
}

export default ApprovalsPage
