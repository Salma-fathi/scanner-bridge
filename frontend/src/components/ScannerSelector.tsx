import React, { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { scannerAPI } from '../services/api'

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

interface Props {
  scanners: Scanner[]
  currentScanner: Scanner | null
}

export default function ScannerSelector({ scanners, currentScanner }: Props) {
  const { setCurrentScanner, setSelectedScannerId, selectedScannerId } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectScanner = async (scannerId: string) => {
    try {
      setIsLoading(true)
      setSelectedScannerId(scannerId)
      await scannerAPI.selectScanner(scannerId)
      
      const scanner = scanners.find(s => s.id === scannerId)
      if (scanner) {
        setCurrentScanner(scanner)
      }
    } catch (error) {
      console.error('Failed to select scanner:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-scandinavian-bg">
      <h2 className="text-xl font-bold text-scandinavian-dark mb-4">Available Scanners</h2>
      
      {scanners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-scandinavian-text-secondary mb-4">No scanners detected</p>
          <p className="text-sm text-scandinavian-text-tertiary">
            Please ensure your scanner is connected and drivers are installed
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scanners.map((scanner) => (
            <button
              key={scanner.id}
              onClick={() => handleSelectScanner(scanner.id)}
              disabled={isLoading}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedScannerId === scanner.id
                  ? 'border-scandinavian-accent-blue bg-blue-50'
                  : 'border-scandinavian-bg hover:border-scandinavian-accent-blue'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-scandinavian-dark">{scanner.name}</h3>
                  <p className="text-sm text-scandinavian-text-secondary mt-1">
                    {scanner.manufacturer} • {scanner.model}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-scandinavian-accent-blue text-white px-2 py-1 rounded">
                      {scanner.driver_type}
                    </span>
                    <span className="text-xs bg-scandinavian-accent-pink text-white px-2 py-1 rounded">
                      {scanner.platform.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  scanner.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>
      )}
      
      {currentScanner && (
        <div className="mt-6 pt-6 border-t border-scandinavian-bg">
          <p className="text-sm text-scandinavian-text-secondary mb-2">Selected Scanner</p>
          <div className="bg-scandinavian-accent-blue bg-opacity-10 rounded-lg p-3">
            <p className="font-semibold text-scandinavian-dark">{currentScanner.name}</p>
            <p className="text-sm text-scandinavian-text-secondary mt-1">
              {currentScanner.capabilities?.formats?.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
