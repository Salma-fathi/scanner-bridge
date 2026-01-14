import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Scanner {
  id: string
  scanner_id: string
  name: string
  manufacturer: string
  model: string
  status: string
  platform: string
  driver_type: string
  capabilities: any
}

interface Scan {
  scan_id: string
  scanner_id: string
  timestamp: string
  format: string
  resolution: number
  color_mode: string
  file_path: string
  file_size: number
  status: string
}

type Theme = 'light' | 'dark' | 'system'
type ViewMode = 'grid' | 'list'

interface AppState {
  // Scanner state
  scanners: Scanner[]
  currentScanner: Scanner | null
  selectedScannerId: string | null
  loadingScanners: boolean

  // Scan state
  currentScan: Scan | null
  scanHistory: Scan[]
  isScanning: boolean
  scanProgress: number
  scanError: string | null

  // UI state
  theme: Theme
  sidebarCollapsed: boolean
  viewMode: ViewMode
  showScannerSelector: boolean
  showImagePreview: boolean
  previewImage: string | null
  connectionStatus: 'connected' | 'disconnected' | 'error'

  // Scanner Actions
  setScanners: (scanners: Scanner[]) => void
  setCurrentScanner: (scanner: Scanner | null) => void
  setSelectedScannerId: (id: string | null) => void
  setLoadingScanners: (loading: boolean) => void

  // Scan Actions
  setCurrentScan: (scan: Scan | null) => void
  setScanHistory: (history: Scan[]) => void
  addScan: (scan: Scan) => void
  setScanning: (scanning: boolean) => void
  setScanProgress: (progress: number) => void
  setScanError: (error: string | null) => void

  // UI Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setViewMode: (mode: ViewMode) => void
  setShowScannerSelector: (show: boolean) => void
  setShowImagePreview: (show: boolean) => void
  setPreviewImage: (image: string | null) => void
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'error') => void

  // Reset
  reset: () => void
}

// Helper to get computed theme
const getComputedTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

// Apply theme to document
const applyTheme = (theme: Theme) => {
  const computed = getComputedTheme(theme)
  document.documentElement.setAttribute('data-theme', computed)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      scanners: [],
      currentScanner: null,
      selectedScannerId: null,
      loadingScanners: false,

      currentScan: null,
      scanHistory: [],
      isScanning: false,
      scanProgress: 0,
      scanError: null,

      theme: 'light',
      sidebarCollapsed: false,
      viewMode: 'grid',
      showScannerSelector: false,
      showImagePreview: false,
      previewImage: null,
      connectionStatus: 'disconnected',

      // Scanner Actions
      setScanners: (scanners) => set({ scanners }),
      setCurrentScanner: (scanner) => set({ currentScanner: scanner }),
      setSelectedScannerId: (id) => set({ selectedScannerId: id }),
      setLoadingScanners: (loading) => set({ loadingScanners: loading }),

      // Scan Actions
      setCurrentScan: (scan) => set({ currentScan: scan }),
      setScanHistory: (history) => set({ scanHistory: history }),
      addScan: (scan) => set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
      setScanning: (scanning) => set({ isScanning: scanning }),
      setScanProgress: (progress) => set({ scanProgress: progress }),
      setScanError: (error) => set({ scanError: error }),

      // UI Actions
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const current = get().theme
        const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'light' : 'light'
        applyTheme(next)
        set({ theme: next })
      },
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setViewMode: (mode) => set({ viewMode: mode }),
      setShowScannerSelector: (show) => set({ showScannerSelector: show }),
      setShowImagePreview: (show) => set({ showImagePreview: show }),
      setPreviewImage: (image) => set({ previewImage: image }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),

      // Reset
      reset: () => set({
        scanners: [],
        currentScanner: null,
        selectedScannerId: null,
        loadingScanners: false,
        currentScan: null,
        scanHistory: [],
        isScanning: false,
        scanProgress: 0,
        scanError: null,
        showScannerSelector: false,
        showImagePreview: false,
        previewImage: null,
        connectionStatus: 'disconnected',
      }),
    }),
    {
      name: 'scanner-bridge-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        viewMode: state.viewMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useAppStore.getState()
    if (theme === 'system') {
      applyTheme(theme)
    }
  })
}
