import { useEffect, useState } from 'react'
import { useAppStore } from './store/appStore'
import { scannerAPI, wsAPI } from './services/api'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ScannerSelector from './components/ScannerSelector'
import ScanInterface from './components/ScanInterface'
import ImageGallery from './components/ImageGallery'
import StatusBar from './components/StatusBar'
import ScanHistory from './components/ScanHistory'
import EmptyState from './components/EmptyState'
import ImageOverlay from './components/ImageOverlay'

function App() {
  const {
    setScanners,
    setCurrentScanner,
    setLoadingScanners,
    setConnectionStatus,
    scanners,
    currentScanner,
    connectionStatus,
    sidebarCollapsed,
  } = useAppStore()

  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
  // Mock image selection for demo - in real app this would come from store or gallery
  const handleSelectImage = (url: string) => {
    setCurrentImage(url);
  };

  // Temporary mock function for overlay actions
  const handleImageAction = (_action: string) => {
    // Logic would go here
  };

  useEffect(() => {
    initializeApp()

    wsAPI.connect({
      onConnect: () => {
        setConnectionStatus('connected')
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected')
      },
      onError: () => {
        setConnectionStatus('error')
      },
      onScannersUpdated: (data: any) => {
        setScanners(data.scanners)
      },
      onScannerSelected: (_data: any) => {
        // Selection handled
      },
    })

    return () => {
      wsAPI.disconnect()
    }
  }, [])

  const initializeApp = async () => {
    try {
      setLoadingScanners(true)
      const scanners = await scannerAPI.listScanners()
      setScanners(scanners)
      if (scanners.length > 0) {
        setCurrentScanner(scanners[0])
      }
      setConnectionStatus('connected')
    } catch (error) {
      console.error('Failed to initialize app:', error)
      setConnectionStatus('error')
    } finally {
      setLoadingScanners(false)
    }
  }

  const isConnected = connectionStatus === 'connected';

  return (
    <div className="min-h-screen bg-bg-primary flex font-sans text-text-primary selection:bg-primary/20 selection:text-primary">
      {/* Navigation Sidebar (Leftmost) */}
      <Sidebar />

      {/* Main Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'
          }`}
      >
        <Header />

        {/* Bento Box Content Layout */}
        <main className="flex-1 p-6 h-[calc(100vh-64px)] overflow-hidden">
          <div className="max-w-[1920px] mx-auto h-full grid grid-cols-12 gap-6">

            {/* Left Panel - Control Center (Scanner + Settings) */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">

              {/* Status Bar */}
              <StatusBar
                connected={isConnected}
                scannerName={currentScanner?.name || 'No Scanner Selected'}
              />

              <section className="flex flex-col gap-6">
                {scanners.length > 0 ? (
                  <>
                    <ScannerSelector
                      scanners={scanners}
                      currentScanner={currentScanner}
                    />
                    <ScanInterface />
                  </>
                ) : (
                  <div className="p-6 bg-surface rounded-2xl border border-border-default text-center">
                    <p className="text-text-secondary">No scanners detected.</p>
                  </div>
                )}
              </section>

              {/* Scan History - Mini Version for Sidebar */}
              <div className="bg-surface rounded-2xl border border-border-light flex-1 overflow-hidden flex flex-col min-h-[300px]">
                <ScanHistory currentImage={currentImage} onSelectImage={handleSelectImage} />
              </div>

              {/* Copyright/Footer */}
              <div className="mt-auto pt-6 pb-2 text-xs text-text-tertiary text-center">
                <p>&copy; 2026 Scanner Bridge v1.0</p>
              </div>
            </div>

            {/* Right Panel - Main Canvas (Gallery + Preview) */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col h-full bg-bg-tertiary/50 rounded-3xl border border-white/50 shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 to-transparent z-0" />

              <div className="relative z-10 h-full p-6 flex items-center justify-center">
                {scanners.length === 0 && !isConnected ? (
                  <EmptyState onRetry={initializeApp} />
                ) : (
                  <div className="w-full h-full relative">
                    {/* If we have an image showing, show it, otherwise gallery */}
                    {/* For this refactor, wrapping existing ImageGallery but overlaying actions */}
                    <ImageGallery />

                    {/* Overlay Actions - visible when looking at an image (mocked presence for now) */}
                    <ImageOverlay
                      onRotate={() => handleImageAction('rotate')}
                      onFlip={() => handleImageAction('flip')}
                      onDelete={() => handleImageAction('delete')}
                      onDownload={() => handleImageAction('download')}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default App
