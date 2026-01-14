import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { scanAPI } from '../services/api'
import {
  Grid3X3,
  List,
  Download,
  Trash2,
  Eye,
  X,
  Clock,
  FileType,
  HardDrive
} from 'lucide-react'
import GalleryEmptyState from './ui/GalleryEmptyState'
import SkeletonLoader from './ui/SkeletonLoader'
import { motion, AnimatePresence } from 'framer-motion'

export default function ImageGallery() {
  const {
    previewImage,
    setPreviewImage,
    showImagePreview,
    setShowImagePreview,
    scanHistory,
    setScanHistory,
    isScanning,
    viewMode,
    setViewMode,
  } = useAppStore()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const history = await scanAPI.getHistory()
      setScanHistory(history)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleDelete = async (scanId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this scan?')) {
        await scanAPI.deleteScan(scanId)
        setScanHistory(scanHistory.filter((s) => s.scan_id !== scanId))
      }
    } catch (error) {
      console.error('Failed to delete scan:', error)
    }
  }

  // Show Skeleton during scanning if showing "Latest" or if list empty
  if (isScanning && scanHistory.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>Scanning in progress...</span>
        </h2>
        <div className="flex-1 rounded-2xl bg-white border border-border-default overflow-hidden">
          <SkeletonLoader />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/20">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Recent Scans</h2>
          <p className="text-sm text-text-secondary">
            {scanHistory.length} documents stored
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface/80 p-1 rounded-lg border border-border-default/50 backdrop-blur-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
              ? 'bg-white shadow-sm text-primary'
              : 'text-text-tertiary hover:text-text-primary'
              }`}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
              ? 'bg-white shadow-sm text-primary'
              : 'text-text-tertiary hover:text-text-primary'
              }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Active Scanning State (Prepended) */}
        {isScanning && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
            className="rounded-2xl bg-white border border-border-default overflow-hidden relative"
          >
            <SkeletonLoader />
          </motion.div>
        )}

        {/* Scan List */}
        {scanHistory.length === 0 && !isScanning ? (
          <GalleryEmptyState onStart={() => {
            // Focus or highlight the start scan button
            const btn = document.querySelector('.btn-primary') as HTMLButtonElement
            if (btn) {
              btn.focus()
              btn.classList.add('ring-4', 'ring-primary/30')
              setTimeout(() => btn.classList.remove('ring-4', 'ring-primary/30'), 1000)
            }
          }} />
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }>
            <AnimatePresence>
              {scanHistory.map((scan) => (
                <motion.div
                  key={scan.scan_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    group relative bg-surface border border-border-default hover:border-primary/50 transition-all hover:shadow-lg
                    ${viewMode === 'grid' ? 'rounded-2xl overflow-hidden' : 'rounded-xl p-3 flex items-center gap-4'}
                  `}
                >
                  {/* Thumbnail */}
                  <div className={
                    viewMode === 'grid'
                      ? "aspect-[4/5] bg-bg-tertiary relative overflow-hidden"
                      : "w-20 h-20 bg-bg-tertiary rounded-lg shrink-0 overflow-hidden relative"
                  }>
                    <img
                      src={scanAPI.getImage(scan.scan_id)}
                      alt={scan.scan_id}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay (Grid) */}
                    {viewMode === 'grid' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <button
                            onClick={() => {
                              setPreviewImage(scanAPI.getImage(scan.scan_id))
                              setShowImagePreview(true)
                            }}
                            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <a
                            href={scanAPI.getImage(scan.scan_id)}
                            download={`scan_${scan.scan_id}.${scan.format}`}
                            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                            title="Download"
                          >
                            <Download size={18} />
                          </a>
                          <button
                            onClick={() => handleDelete(scan.scan_id)}
                            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/80 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className={viewMode === 'grid' ? "p-4" : "flex-1 min-w-0"}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-bg-tertiary text-[10px] font-bold uppercase text-text-secondary border border-border-default">
                        {scan.format}
                      </span>
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-text-primary truncate" title={scan.scan_id}>
                      Scan_{scan.scan_id.slice(0, 8)}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <FileType size={12} />
                        {scan.resolution} DPI
                      </span>
                      <span className="flex items-center gap-1">
                        <HardDrive size={12} />
                        {(scan.file_size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>

                  {/* Actions (List View) */}
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setPreviewImage(scanAPI.getImage(scan.scan_id))
                          setShowImagePreview(true)
                        }}
                        className="p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-primary transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={scanAPI.getImage(scan.scan_id)}
                        download={`scan_${scan.scan_id}.${scan.format}`}
                        className="p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-primary transition-colors"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={() => handleDelete(scan.scan_id)}
                        className="p-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showImagePreview && previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowImagePreview(false)}
            />

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full bg-transparent shadow-2xl rounded-lg overflow-hidden"
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10"
              />

              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <a
                  href={previewImage}
                  download="scan_preview"
                  className="text-white hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Download size={18} />
                  Download
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
