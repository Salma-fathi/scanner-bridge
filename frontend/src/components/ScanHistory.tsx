import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Image as ImageIcon } from 'lucide-react';

interface ScanItem {
    id: string;
    url: string;
    timestamp: number;
}

interface ScanHistoryProps {
    currentImage?: string;
    onSelectImage: (url: string) => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ currentImage, onSelectImage }) => {
    const [history, setHistory] = useState<ScanItem[]>([]);

    useEffect(() => {
        // Load history from localStorage
        const saved = localStorage.getItem('scan_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse scan history', e);
            }
        }
    }, []);

    useEffect(() => {
        // Add current image to history if it's new
        if (currentImage && !history.find(h => h.url === currentImage)) {
            const newItem: ScanItem = {
                id: Date.now().toString(),
                url: currentImage,
                timestamp: Date.now()
            };
            const newHistory = [newItem, ...history].slice(0, 20); // Keep last 20
            setHistory(newHistory);
            localStorage.setItem('scan_history', JSON.stringify(newHistory));
        }
    }, [currentImage]);

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory([]);
        localStorage.removeItem('scan_history');
    }

    return (
        <div className="flex flex-col h-full bg-surface border-l border-border-light w-full">
            <div className="p-4 border-b border-border-light flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-primary font-semibold">
                    <Clock size={18} className="text-primary" />
                    <h3>Recent Scans</h3>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="text-text-tertiary hover:text-error transition-colors p-1 rounded-md hover:bg-error-light"
                        title="Clear History"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-text-tertiary text-center p-4">
                        <div className="p-3 bg-bg-tertiary rounded-full mb-3">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-sm">No scans yet</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {history.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => onSelectImage(item.url)}
                                className={`group cursor-pointer relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${currentImage === item.url
                                        ? 'border-primary ring-2 ring-primary-light shadow-primary'
                                        : 'border-transparent hover:border-border-strong hover:shadow-md'
                                    }`}
                            >
                                <img
                                    src={item.url}
                                    alt={`Scan ${new Date(item.timestamp).toLocaleTimeString()}`}
                                    className="w-full h-32 object-cover bg-bg-tertiary"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                    <p className="text-xs text-white font-medium truncate">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ScanHistory;
