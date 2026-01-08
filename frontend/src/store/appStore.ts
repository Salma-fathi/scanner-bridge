import { create } from 'zustand'

interface Scanner {
  id: string
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
  showScannerSelector: boolean
  showImagePreview: boolean
  previewImage: string | null
  
  // Actions
  setScanners: (scanners: Scanner[]) => void
  setCurrentScanner: (scanner: Scanner | null) => void
  setSelectedScannerId: (id: string | null) => void
  setLoadingScanners: (loading: boolean) => void
  
  setCurrentScan: (scan: Scan | null) => void
  setScanHistory: (history: Scan[]) => void
  setIsScanning: (scanning: boolean) => void
  setScanProgress: (progress: number) => void
  setScanError: (error: string | null) => void
  
  setShowScannerSelector: (show: boolean) => void
  setShowImagePreview: (show: boolean) => void
  setPreviewImage: (image: string | null) => void
  
  // Reset
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
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
  
  showScannerSelector: false,
  showImagePreview: false,
  previewImage: null,
  
  // Actions
  setScanners: (scanners) => set({ scanners }),
  setCurrentScanner: (scanner) => set({ currentScanner: scanner }),
  setSelectedScannerId: (id) => set({ selectedScannerId: id }),
  setLoadingScanners: (loading) => set({ loadingScanners: loading }),
  
  setCurrentScan: (scan) => set({ currentScan: scan }),
  setScanHistory: (history) => set({ scanHistory: history }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  setScanProgress: (progress) => set({ scanProgress: progress }),
  setScanError: (error) => set({ scanError: error }),
  
  setShowScannerSelector: (show) => set({ showScannerSelector: show }),
  setShowImagePreview: (show) => set({ showImagePreview: show }),
  setPreviewImage: (image) => set({ previewImage: image }),
  
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
  }),
}))
