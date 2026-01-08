import React, { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { scanAPI, wsAPI } from '../services/api'

export default function ScanInterface() {
  const {
    currentScanner,
    isScanning,
    scanProgress,
    scanError,
    setIsScanning,
    setScanProgress,
    setScanError,
    setCurrentScan,
    setPreviewImage,
    setShowImagePreview,
  } = useAppStore()

  const [format, setFormat] = useState('jpeg')
  const [resolution, setResolution] = useState(300)
  const [colorMode, setColorMode] = useState('color')

  const handleStartScan = async () => {
    if (!currentScanner) {
      setScanError('Please select a scanner first')
      return
    }

    try {
      setIsScanning(true)
      setScanError(null)
      setScanProgress(0)

      // Start scan
      const result = await scanAPI.startScan(currentScanner.id, {
        format,
        resolution,
        color_mode: colorMode,
      })

      setCurrentScan(result)
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Set preview image
      const imageUrl = await scanAPI.getImage(result.scan_id)
      setPreviewImage(imageUrl)
      setShowImagePreview(true)

      setScanProgress(100)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan'
      setScanError(errorMessage)
      console.error('Scan error:', error)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-scandinavian-bg mt-6">
      <h2 className="text-xl font-bold text-scandinavian-dark mb-6">Scan Settings</h2>

      {/* Format Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-scandinavian-dark mb-2">
          Image Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          disabled={isScanning}
          className="w-full px-3 py-2 border border-scandinavian-bg rounded-lg focus:outline-none focus:border-scandinavian-accent-blue"
        >
          <option value="jpeg">JPEG (Compressed)</option>
          <option value="png">PNG (Lossless)</option>
          <option value="tiff">TIFF (Archive)</option>
        </select>
      </div>

      {/* Resolution Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-scandinavian-dark mb-2">
          Resolution (DPI)
        </label>
        <select
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
          disabled={isScanning}
          className="w-full px-3 py-2 border border-scandinavian-bg rounded-lg focus:outline-none focus:border-scandinavian-accent-blue"
        >
          <option value={75}>75 DPI (Fast)</option>
          <option value={150}>150 DPI</option>
          <option value={300}>300 DPI (Standard)</option>
          <option value={600}>600 DPI (High)</option>
          <option value={1200}>1200 DPI (Very High)</option>
        </select>
      </div>

      {/* Color Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-scandinavian-dark mb-2">
          Color Mode
        </label>
        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value)}
          disabled={isScanning}
          className="w-full px-3 py-2 border border-scandinavian-bg rounded-lg focus:outline-none focus:border-scandinavian-accent-blue"
        >
          <option value="bw">Black & White</option>
          <option value="gray">Grayscale</option>
          <option value="color">Color</option>
        </select>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-scandinavian-dark">Scanning...</span>
            <span className="text-sm text-scandinavian-text-secondary">{scanProgress}%</span>
          </div>
          <div className="w-full bg-scandinavian-bg rounded-full h-2">
            <div
              className="bg-gradient-to-r from-scandinavian-accent-blue to-scandinavian-accent-pink h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {scanError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{scanError}</p>
        </div>
      )}

      {/* Scan Button */}
      <button
        onClick={handleStartScan}
        disabled={isScanning || !currentScanner}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isScanning || !currentScanner
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-scandinavian-accent-blue to-scandinavian-accent-pink text-white hover:shadow-lg'
        }`}
      >
        {isScanning ? 'Scanning...' : 'Start Scan'}
      </button>

      <p className="text-xs text-scandinavian-text-tertiary mt-4 text-center">
        Place your document in the scanner and click "Start Scan"
      </p>
    </div>
  )
}
