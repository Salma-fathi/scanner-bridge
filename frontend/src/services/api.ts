import axios from 'axios'
import io, { Socket } from 'socket.io-client'

const API_BASE_URL = 'http://localhost:5000'
const WS_URL = 'ws://localhost:5000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// WebSocket instance
let socket: Socket | null = null

// Scanner API
export const scannerAPI = {
  listScanners: async () => {
    const response = await api.get('/api/scanners')
    return response.data.scanners
  },

  getScannerInfo: async (scannerId: string) => {
    const response = await api.get(`/api/scanners/${scannerId}`)
    return response.data.scanner
  },

  selectScanner: async (scannerId: string) => {
    const response = await api.post('/api/scanners/select', { scanner_id: scannerId })
    return response.data
  },

  getCurrentScanner: async () => {
    const response = await api.get('/api/scanners/current')
    return response.data.scanner
  },

  refreshScanners: async () => {
    const response = await api.post('/api/scanners/refresh')
    return response.data.scanners
  },
}

// Scan API
export const scanAPI = {
  startScan: async (scannerId: string, params?: any) => {
    const response = await api.post('/api/scan', {
      scanner_id: scannerId,
      ...params,
    })
    return response.data
  },

  getStatus: async () => {
    const response = await api.get('/api/scan/status')
    return response.data.status
  },

  getHistory: async (limit = 50) => {
    const response = await api.get('/api/scan/history', { params: { limit } })
    return response.data.history
  },

  getImage: async (scanId: string) => {
    return `${API_BASE_URL}/api/scan/${scanId}`
  },

  getScanInfo: async (scanId: string) => {
    const response = await api.get(`/api/scan/${scanId}/info`)
    return response.data.scan
  },

  deleteScan: async (scanId: string) => {
    const response = await api.delete(`/api/scan/${scanId}`)
    return response.data
  },
}

// Image API
export const imageAPI = {
  convertImage: async (scanId: string, format: string) => {
    return `${API_BASE_URL}/api/image/convert?scan_id=${scanId}&format=${format}`
  },

  optimizeImage: async (scanId: string, quality = 85) => {
    return `${API_BASE_URL}/api/image/optimize?scan_id=${scanId}&quality=${quality}`
  },
}

// WebSocket
export const wsAPI = {
  connect: (callbacks?: any) => {
    socket = io(WS_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('WebSocket connected')
      callbacks?.onConnect?.()
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      callbacks?.onDisconnect?.()
    })

    socket.on('scanners_updated', (data) => {
      callbacks?.onScannersUpdated?.(data)
    })

    socket.on('scanner_selected', (data) => {
      callbacks?.onScannerSelected?.(data)
    })

    socket.on('scan_started', (data) => {
      callbacks?.onScanStarted?.(data)
    })

    socket.on('scan_progress', (data) => {
      callbacks?.onScanProgress?.(data)
    })

    socket.on('scan_completed', (data) => {
      callbacks?.onScanCompleted?.(data)
    })

    socket.on('scan_error', (data) => {
      callbacks?.onScanError?.(data)
    })

    socket.on('error', (data) => {
      callbacks?.onError?.(data)
    })

    return socket
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  },

  emit: (event: string, data?: any) => {
    if (socket) {
      socket.emit(event, data)
    }
  },

  on: (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback)
    }
  },

  off: (event: string) => {
    if (socket) {
      socket.off(event)
    }
  },

  getSocket: () => socket,
}

export default api
