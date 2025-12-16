import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import { expensesApi } from '../services/api'
import { format } from 'date-fns'

const expenseSchema = z.object({
  expense_date: z.string().min(1, 'La fecha es requerida'),
  amount: z.string().min(1, 'El monto es requerido'),
  currency: z.string().default('MXN'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  merchant_name: z.string().min(1, 'El comercio es requerido'),
  payment_method: z.string().min(1, 'El método de pago es requerido'),
  category_id: z.string().optional(),
  project_id: z.string().optional(),
  invoice_folio: z.string().optional(),
  rfc_vendor: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

const EditExpensePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: expense, isLoading } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesApi.getById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    values: expense ? {
      expense_date: format(new Date(expense.expense_date), 'yyyy-MM-dd'),
      amount: expense.amount.toString(),
      currency: expense.currency,
      description: expense.description,
      merchant_name: expense.merchant_name,
      payment_method: expense.payment_method,
      category_id: expense.category?.id || '',
      project_id: expense.project?.id || '',
      invoice_folio: expense.invoice_folio || '',
      rfc_vendor: expense.rfc_vendor || '',
    } : undefined,
  })

  const updateMutation = useMutation({
    mutationFn: (data: ExpenseFormData) => expensesApi.update(id!, {
      ...data,
      amount: parseFloat(data.amount),
    }),
    onSuccess: () => {
      toast.success('Gasto actualizado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense', id] })
      navigate(`/expenses/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el gasto')
    },
  })

  const onSubmit = (data: ExpenseFormData) => {
    updateMutation.mutate(data)
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

  if (expense.status !== 'pending') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium mb-2">
              No se puede editar este gasto
            </p>
            <p className="text-yellow-700 text-sm mb-4">
              Solo los gastos con estado "Pendiente" pueden ser editados.
            </p>
            <button
              onClick={() => navigate(`/expenses/${id}`)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Ver Detalle
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/expenses/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Gasto</h1>
            <p className="text-sm text-gray-500">Modifica los datos del gasto</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Gasto *
                  </label>
                  <input
                    type="date"
                    {...register('expense_date')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.expense_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.expense_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <select
                      {...register('currency')}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comercio / Proveedor *
                  </label>
                  <input
                    type="text"
                    {...register('merchant_name')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Walmart, Uber, Hotel..."
                  />
                  {errors.merchant_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.merchant_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    {...register('payment_method')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe detalladamente el gasto..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Clasificación */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Clasificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    {...register('category_id')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin categoría</option>
                    <option value="1">Transporte</option>
                    <option value="2">Alimentación</option>
                    <option value="3">Hospedaje</option>
                    <option value="4">Combustible</option>
                    <option value="5">Material de Oficina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proyecto
                  </label>
                  <select
                    {...register('project_id')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin proyecto</option>
                    <option value="1">Proyecto Alpha</option>
                    <option value="2">Proyecto Beta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información Fiscal */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Fiscal (Opcional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folio Fiscal (UUID)
                  </label>
                  <input
                    type="text"
                    {...register('invoice_folio')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC del Proveedor
                  </label>
                  <input
                    type="text"
                    {...register('rfc_vendor')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XAXX010101000"
                  />
                </div>
              </div>
            </div>

            {/* Archivos Adjuntos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Archivos Adjuntos</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra y suelta archivos aquí, o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG (máx. 10MB por archivo)
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Seleccionar Archivos
                  </button>
                </div>
              </div>
              {expense.attachments && expense.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Archivos actuales:</p>
                  <div className="space-y-2">
                    {expense.attachments.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.file_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between rounded-b-lg">
            <button
              type="button"
              onClick={() => navigate(`/expenses/${id}`)}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}

export default EditExpensePage
