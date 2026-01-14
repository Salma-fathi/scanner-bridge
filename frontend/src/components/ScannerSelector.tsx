import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { scannerAPI } from '../services/api'
import { Printer, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScannerHeartbeat from './ui/ScannerHeartbeat'

interface Props {
  scanners: any[]
  currentScanner: any
}

export default function ScannerSelector({ scanners, currentScanner }: Props) {
  const { setCurrentScanner } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSelect = async (scanner: any) => {
    try {
      await scannerAPI.selectScanner(scanner.scanner_id)
      setCurrentScanner(scanner)
      setIsExpanded(false)
    } catch (error) {
      console.error('Failed to select scanner:', error)
    }
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border-default overflow-hidden">
      {/* Header / Active Scanner */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-bg-tertiary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Printer size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {currentScanner ? currentScanner.model : 'No Scanner Selected'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {currentScanner ? (
                <>
                  <ScannerHeartbeat online={true} />
                  <span className="text-xs font-medium text-emerald-600">Online & Ready</span>
                </>
              ) : (
                <span className="text-xs text-text-tertiary">Select a device</span>
              )}
            </div>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-primary transition-colors">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t border-border-light bg-bg-primary/30"
          >
            <div className="p-2 space-y-1">
              {scanners.length === 0 ? (
                <div className="p-6 text-center text-text-secondary">
                  <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={20} className="text-text-tertiary" />
                  </div>
                  <p className="text-sm">No scanners detected</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary text-xs font-medium mt-2 hover:underline"
                  >
                    Refresh Devices
                  </button>
                </div>
              ) : (
                scanners.map((scanner) => (
                  <button
                    key={scanner.scanner_id}
                    onClick={() => handleSelect(scanner)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all
                      ${currentScanner?.scanner_id === scanner.scanner_id
                        ? 'bg-white shadow-sm ring-1 ring-border-default'
                        : 'hover:bg-white/50 hover:shadow-xs'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-2 h-2 rounded-full
                        ${currentScanner?.scanner_id === scanner.scanner_id ? 'bg-primary' : 'bg-slate-300'}
                      `} />
                      <div className="text-left">
                        <div className="text-sm font-medium text-text-primary">
                          {scanner.manufacturer} {scanner.model}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {scanner.type} • via {scanner.dev_type}
                        </div>
                      </div>
                    </div>

                    {currentScanner?.scanner_id === scanner.scanner_id && (
                      <div className="px-2 py-1 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                        Active
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
