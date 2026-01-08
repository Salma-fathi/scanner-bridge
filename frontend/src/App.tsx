import React, { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import { scannerAPI, wsAPI } from './services/api'
import Header from './components/Header'
import ScannerSelector from './components/ScannerSelector'
import ScanInterface from './components/ScanInterface'
import ImageGallery from './components/ImageGallery'
import Footer from './components/Footer'

function App() {
  const { 
    setScanners, 
    setCurrentScanner, 
    setLoadingScanners,
    scanners,
    currentScanner,
  } = useAppStore()

  useEffect(() => {
    // Initialize app
    initializeApp()
    
    // Connect WebSocket
    wsAPI.connect({
      onConnect: () => console.log('Connected to server'),
      onScannersUpdated: (data: any) => {
        setScanners(data.scanners)
      },
      onScannerSelected: (data: any) => {
        console.log('Scanner selected:', data.scanner_id)
      },
    })

    return () => {
      wsAPI.disconnect()
    }
  }, [])

  const initializeApp = async () => {
    try {
      setLoadingScanners(true)
      
      // Fetch scanners
      const scanners = await scannerAPI.listScanners()
      setScanners(scanners)
      
      // Set first scanner as default
      if (scanners.length > 0) {
        setCurrentScanner(scanners[0])
      }
    } catch (error) {
      console.error('Failed to initialize app:', error)
    } finally {
      setLoadingScanners(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-scandinavian-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Scanner Selection and Control */}
          <div className="lg:col-span-1">
            <ScannerSelector 
              scanners={scanners}
              currentScanner={currentScanner}
            />
            <ScanInterface />
          </div>
          
          {/* Right Column - Image Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
