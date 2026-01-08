import React from 'react'

export default function Header() {
  return (
    <header className="bg-white border-b border-scandinavian-bg shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-scandinavian-accent-blue to-scandinavian-accent-pink rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-scandinavian-dark">Scanner Bridge</h1>
              <p className="text-sm text-scandinavian-text-secondary">Local Document Scanner Integration</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-scandinavian-text-tertiary">v0.1.0</p>
            <p className="text-xs text-scandinavian-text-tertiary">Beta Release</p>
          </div>
        </div>
      </div>
    </header>
  )
}
