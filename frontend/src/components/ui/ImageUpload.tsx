import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ImageUploadProps {
    onFileSelect: (file: File) => void
    onRemove?: () => void
    value?: string | File | null // Can be URL or File object
    className?: string
    disabled?: boolean
    label?: string
    accept?: Record<string, string[]>
    maxSize?: number // in bytes
}

const ImageUpload = ({
    onFileSelect,
    onRemove,
    value,
    className,
    disabled = false,
    label = "Arrastra y suelta un archivo aquí, o haz clic para seleccionar",
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        'application/pdf': ['.pdf']
    },
    maxSize = 5 * 1024 * 1024 // 5MB default
}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<string>('')

    useEffect(() => {
        if (!value) {
            setPreview(null)
            setFileType('')
            return
        }

        if (typeof value === 'string') {
            setPreview(value)
            // Attempt to guess type from extension if possible, or just default to image if not PDF
            if (value.toLowerCase().endsWith('.pdf')) {
                setFileType('application/pdf')
            } else {
                setFileType('image/jpeg') // Assume image for preview purpose
            }
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value)
            setPreview(objectUrl)
            setFileType(value.type)

            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [value])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0])
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxSize,
        disabled,
        multiple: false
    })

    // Helper to render preview based on type
    const renderPreview = () => {
        if (!preview) return null

        if (fileType.includes('pdf') || (typeof value === 'string' && value.endsWith('.pdf'))) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 rounded-lg">
                    <FileIcon size={48} className="text-red-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700 truncate max-w-full px-2">
                        {value instanceof File ? value.name : 'Documento PDF'}
                    </p>
                </div>
            )
        }

        return (
            <div className="relative h-full w-full">
                <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-lg bg-gray-50"
                />
            </div>
        )
    }

    return (
        <div className={cn('w-full', className)}>
            {!value ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]',
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
                        disabled && 'opacity-50 cursor-not-allowed hover:border-gray-300'
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="p-4 bg-gray-100 rounded-full mb-3">
                        <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {isDragActive ? 'Suelta el archivo aquí' : 'Sube un archivo'}
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs">{label}</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Máx. {(maxSize / 1024 / 1024).toFixed(0)}MB
                    </p>
                    {fileRejections.length > 0 && (
                        <p className="text-xs text-red-500 mt-2">
                            Archivo no válido (tamaño o tipo incorrecto)
                        </p>
                    )}
                </div>
            ) : (
                <div className="relative rounded-lg border border-gray-200 h-[200px] overflow-hidden group">
                    {renderPreview()}

                    {!disabled && onRemove && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove()
                                }}
                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ImageUpload
