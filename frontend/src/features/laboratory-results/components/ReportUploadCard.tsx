import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Image, CheckCircle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportUploadCardProps {
  onUpload: (files: File[]) => void
}

type UploadState = 'idle' | 'processing' | 'success'

export const ReportUploadCard: React.FC<ReportUploadCardProps> = ({ onUpload }) => {
  const [state, setState] = useState<UploadState>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles(dropped)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = () => {
    if (files.length === 0) return
    setState('processing')
    // Simulate upload
    setTimeout(() => {
      setState('success')
      onUpload(files)
      setTimeout(() => {
        setState('idle')
        setFiles([])
      }, 2000)
    }, 1500)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Upload Laboratory Report</h3>

      {state === 'success' ? (
        <div className="flex flex-col items-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-emerald-500" />
          </motion.div>
          <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Upload Successful!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your report is being processed by AI</p>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'flex flex-col items-center rounded-xl border-2 border-dashed p-8 transition',
              isDragging
                ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                : 'border-slate-300 hover:border-blue-300 dark:border-slate-600 dark:hover:border-blue-500',
            )}
          >
            <Upload className="h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              Drag & drop your report here
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Supports PDF, PNG, JPEG
            </p>
            <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              Browse Files
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700"
                >
                  <div className="flex items-center gap-2">
                    {file.type === 'application/pdf' ? (
                      <FileText className="h-4 w-4 text-red-500" />
                    ) : (
                      <Image className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-200">{file.name}</span>
                    <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleUpload}
                disabled={state === 'processing'}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {state === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Future OCR:</strong> AI will automatically extract lab values from uploaded reports.
              Currently supports manual entry and structured data import.
            </p>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default ReportUploadCard
