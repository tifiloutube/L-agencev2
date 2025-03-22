'use client'

import { createContext, useContext, useState } from 'react'

type ToastType = 'success' | 'error'

type Toast = {
    message: string
    type?: ToastType
}

type ToastContextType = {
    showToast: (toast: Toast) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within <ToastProvider>')
    return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<Toast | null>(null)

    const showToast = ({ message, type = 'success' }: Toast) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        backgroundColor: toast.type === 'error' ? '#f44336' : '#4caf50',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: 6,
                        zIndex: 9999,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    )
}