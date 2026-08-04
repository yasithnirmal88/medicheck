import React, { useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './AuthProvider'
import ThemeProvider from './ThemeProvider'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const content = useMemo(() => <ThemeProvider>{children}</ThemeProvider>, [children])
  return (
    <AuthProvider>
      {content}
      <Toaster toastOptions={{ style: { borderRadius: '12px', fontWeight: '500' } }} />
    </AuthProvider>
  )
}

export default Providers
