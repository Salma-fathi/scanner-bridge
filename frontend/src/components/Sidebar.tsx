import React from 'react'
import { useAppStore } from '../store/appStore'
import {
    LayoutDashboard,
    Printer,
    History,
    Settings,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    Wifi,
    WifiOff,
    Zap
} from 'lucide-react'

interface NavItem {
    id: string
    label: string
    icon: React.ReactNode
    active?: boolean
}

export default function Sidebar() {
    const {
        sidebarCollapsed,
        toggleSidebar,
        theme,
        toggleTheme,
        connectionStatus,
        scanners
    } = useAppStore()

    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
        { id: 'devices', label: 'Devices', icon: <Printer size={20} /> },
        { id: 'history', label: 'History', icon: <History size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ]

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 ${sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap size={18} className="text-white" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-sm font-semibold text-sidebar-text-active whitespace-nowrap">
                                Scanner Bridge
                            </h1>
                            <p className="text-xs text-sidebar-text">v0.1.0</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${item.active
                            ? 'bg-sidebar-active text-sidebar-text-active'
                            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
                            }`}
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!sidebarCollapsed && (
                            <span className="text-sm font-medium truncate animate-fade-in">
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Connection Status */}
            <div className="px-3 py-3 border-t border-sidebar-border">
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${connectionStatus === 'connected'
                    ? 'bg-success/10'
                    : 'bg-sidebar-hover'
                    }`}>
                    {connectionStatus === 'connected' ? (
                        <Wifi size={18} className="text-success flex-shrink-0" />
                    ) : (
                        <WifiOff size={18} className="text-sidebar-text flex-shrink-0" />
                    )}
                    {!sidebarCollapsed && (
                        <div className="animate-fade-in overflow-hidden">
                            <p className="text-xs font-medium text-sidebar-text-active truncate">
                                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                            </p>
                            <p className="text-xs text-sidebar-text truncate">
                                {scanners.length} device{scanners.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Theme Toggle & Collapse */}
            <div className="px-2 py-3 border-t border-sidebar-border space-y-1">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-all"
                >
                    {theme === 'dark' ? (
                        <Sun size={20} className="flex-shrink-0" />
                    ) : (
                        <Moon size={20} className="flex-shrink-0" />
                    )}
                    {!sidebarCollapsed && (
                        <span className="text-sm font-medium truncate animate-fade-in">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    )}
                </button>

                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-all"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight size={20} className="flex-shrink-0" />
                    ) : (
                        <ChevronLeft size={20} className="flex-shrink-0" />
                    )}
                    {!sidebarCollapsed && (
                        <span className="text-sm font-medium truncate animate-fade-in">
                            Collapse
                        </span>
                    )}
                </button>
            </div>
        </aside>
    )
}
