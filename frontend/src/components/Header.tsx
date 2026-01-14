import { useAppStore } from '../store/appStore'
import { Search, Bell, Zap } from 'lucide-react'

export default function Header() {
  const { currentScanner, isScanning, connectionStatus } = useAppStore()

  return (
    <header className="h-16 bg-surface border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
          <input
            type="text"
            placeholder="Search scans, devices..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-bg-tertiary border-0 rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Scan Button */}
        <button
          disabled={!currentScanner || isScanning}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={16} />
          <span>Quick Scan</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors relative">
          <Bell size={20} />
          {connectionStatus === 'connected' && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full" />
          )}
        </button>

        {/* User Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white text-sm font-medium">
          S
        </button>
      </div>
    </header>
  )
}
