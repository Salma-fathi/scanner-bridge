import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, RefreshCw, HelpCircle } from 'lucide-react';
import Troubleshooting from './Troubleshooting';

interface EmptyStateProps {
    onRetry: () => void;
    isScanning?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRetry, isScanning }) => {
    const [showTroubleshoot, setShowTroubleshoot] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-bg-tertiary/20 rounded-3xl border border-dashed border-border-strong/50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center bg-surface rounded-full shadow-lg border-4 border-surface shadow-primary/20">
                    {isScanning ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw size={48} className="text-primary" />
                        </motion.div>
                    ) : (
                        <Scan size={48} className="text-text-tertiary" />
                    )}

                    {/* Decorative Orb */}
                    <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-10" />
                </div>

                <h2 className="text-2xl font-bold text-text-primary mb-3">
                    {isScanning ? 'Scanning in Progress...' : 'Ready to Scan'}
                </h2>

                <p className="text-text-secondary mb-8 leading-relaxed">
                    {isScanning
                        ? 'Communicating with local agent. Please wait while we digitize your document.'
                        : 'Looking for a scanner? Ensure the device is connected and the local agent is running.'
                    }
                </p>

                {!isScanning && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onRetry}
                            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-primary/30"
                        >
                            <RefreshCw size={18} />
                            <span>Refresh Scanners</span>
                        </button>

                        <button
                            onClick={() => setShowTroubleshoot(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-text-secondary bg-surface hover:bg-bg-tertiary border border-border-default transition-all"
                        >
                            <HelpCircle size={18} />
                            <span>Troubleshoot</span>
                        </button>
                    </div>
                )}
            </motion.div>

            {showTroubleshoot && (
                <Troubleshooting onClose={() => setShowTroubleshoot(false)} />
            )}
        </div>
    );
};

export default EmptyState;
