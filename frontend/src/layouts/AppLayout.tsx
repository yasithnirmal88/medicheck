import React from 'react'
import TopNav from '../shared/ui/TopNav'

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white"
      >
        Skip to main content
      </a>
      <TopNav />
      <main id="main-content" className="flex-1 p-4">{children}</main>
      <footer className="p-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} Medicheck</footer>
    </div>
  )
}

export default AppLayout
