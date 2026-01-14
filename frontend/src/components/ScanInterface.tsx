import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { scanAPI } from '../services/api'
import {
  Settings2,
  Zap,
  AlertCircle,
  Loader2,
  FileImage,
  Palette,
  Scaling
} from 'lucide-react'
import CustomSelect from './ui/CustomSelect'
import { motion } from 'framer-motion'

export default function ScanInterface() {
  const { currentScanner, isScanning, setScanning, addScan, setScanProgress, setScanError, scanProgress, scanError } = useAppStore()

  const [format, setFormat] = useState('jpeg')
  const [resolution, setResolution] = useState(300)
  const [colorMode, setColorMode] = useState('color')

  const handleScan = async () => {
    if (!currentScanner) return

    try {
      setScanning(true)
      setScanError(null)
      setScanProgress(0)

      // Start scan
      const result = await scanAPI.startScan(currentScanner.scanner_id, {
        format,
        resolution,
        mode: colorMode
      })

      // In a real app we would track progress here
      // For now we simulate it
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      addScan(result)
    } catch (error: any) {
      setScanError(error.message || 'Scan failed')
    } finally {
      setScanning(false)
    }
  }

  // Options for CustomSelects
  const formatOptions = [
    { value: 'jpeg', label: 'JPEG Image', icon: <FileImage size={16} />, description: 'Best for photos & web' },
    { value: 'png', label: 'PNG Image', icon: <FileImage size={16} />, description: 'Lossless quality' },
    { value: 'tiff', label: 'TIFF Image', icon: <FileImage size={16} />, description: 'High fidelity print' },
  ]

  const resolutionOptions = [
    { value: 75, label: '75 DPI', icon: <Scaling size={16} />, description: 'Screen draft' },
    { value: 150, label: '150 DPI', icon: <Scaling size={16} />, description: 'Web quality' },
    { value: 300, label: '300 DPI', icon: <Scaling size={16} />, description: 'Print quality (Standard)' },
    { value: 600, label: '600 DPI', icon: <Scaling size={16} />, description: 'High resolution' },
  ]

  const modeOptions = [
    { value: 'color', label: 'Color', icon: <Palette size={16} />, description: 'Full 24-bit color' },
    { value: 'gray', label: 'Grayscale', icon: <Palette size={16} />, description: '8-bit shades of gray' },
    { value: 'lineart', label: 'Black & White', icon: <Palette size={16} />, description: '1-bit text document' },
  ]

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-default p-5 flex flex-col gap-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border-light">
        <Settings2 size={18} className="text-text-tertiary" />
        <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wide">Scan Settings</h3>
      </div>

      <div className="space-y-4">
        <CustomSelect
          label="File Format"
          value={format}
          options={formatOptions}
          onChange={setFormat}
          disabled={isScanning}
        />

        <CustomSelect
          label="Resolution (DPI)"
          value={resolution}
          options={resolutionOptions}
          onChange={setResolution}
          disabled={isScanning}
        />

        <CustomSelect
          label="Color Mode"
          value={colorMode}
          options={modeOptions}
          onChange={setColorMode}
          disabled={isScanning}
        />
      </div>

      {scanError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-sm text-error"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{scanError}</p>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="mt-2">
        <button
          onClick={handleScan}
          disabled={!currentScanner || isScanning}
          className="btn-primary w-full py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {isScanning ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Scanning... {scanProgress}%</span>

              {/* Progress Bar background overlay */}
              <div
                className="absolute inset-0 bg-white/20 origin-left transition-transform duration-300"
                style={{ transform: `scaleX(${scanProgress / 100})` }}
              />
            </>
          ) : (
            <>
              <Zap size={20} className={!currentScanner ? 'opacity-50' : 'group-hover:text-yellow-200 transition-colors'} />
              <span>Start Scan</span>
            </>
          )}
        </button>

        {isScanning && (
          <p className="text-xs text-center mt-3 text-text-tertiary animate-pulse">
            Do not disconnect scanner...
          </p>
        )}
      </div>
    </div>
  )
}
