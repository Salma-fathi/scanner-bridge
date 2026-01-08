import React, { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { scanAPI } from '../services/api'

export default function ImageGallery() {
  const {
    previewImage,
    showImagePreview,
    scanHistory,
    setScanHistory,
    setShowImagePreview,
    setPreviewImage,
  } = useAppStore()

  useEffect(() => {
    loadScanHistory()
  }, [])

  const loadScanHistory = async () => {
    try {
      const history = await scanAPI.getHistory(10)
      setScanHistory(history)
    } catch (error) {
      console.error('Failed to load scan history:', error)
    }
  }

  const handleDeleteScan = async (scanId: string) => {
    try {
      await scanAPI.deleteScan(scanId)
      await loadScanHistory()
      if (previewImage?.includes(scanId)) {
        setPreviewImage(null)
        setShowImagePreview(false)
      }
    } catch (error) {
      console.error('Failed to delete scan:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-scandinavian-bg">
      <h2 className="text-xl font-bold text-scandinavian-dark mb-6">Scanned Images</h2>

      {/* Image Preview */}
      {showImagePreview && previewImage && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-scandinavian-bg rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Scanned document"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
          <button
            onClick={() => setShowImagePreview(false)}
            className="mt-3 text-sm text-scandinavian-text-secondary hover:text-scandinavian-text"
          >
            Hide preview
          </button>
        </div>
      )}

      {/* Gallery */}
      {scanHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-scandinavian-accent-blue bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-scandinavian-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-scandinavian-text-secondary">No scans yet</p>
          <p className="text-sm text-scandinavian-text-tertiary mt-2">
            Scanned documents will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scanHistory.map((scan) => (
            <div
              key={scan.scan_id}
              className="border border-scandinavian-bg rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-scandinavian-bg h-40 flex items-center justify-center relative group">
                <img
                  src={scanAPI.getImage(scan.scan_id)}
                  alt={scan.scan_id}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setPreviewImage(scanAPI.getImage(scan.scan_id))}
                    className="bg-white text-scandinavian-dark px-3 py-1 rounded text-sm font-semibold hover:bg-scandinavian-bg"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDeleteScan(scan.scan_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-scandinavian-text-tertiary mb-2">
                  {new Date(scan.timestamp).toLocaleString()}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-scandinavian-accent-blue text-white px-2 py-1 rounded">
                    {scan.format.toUpperCase()}
                  </span>
                  <span className="text-xs bg-scandinavian-accent-pink text-white px-2 py-1 rounded">
                    {scan.resolution} DPI
                  </span>
                </div>
                <p className="text-xs text-scandinavian-text-tertiary mt-2">
                  {(scan.file_size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
