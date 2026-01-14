import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface StatusBarProps {
    connected: boolean;
    scannerName?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ connected, scannerName }) => {
    return (
        <div className="w-full h-12 bg-surface/80 backdrop-blur-md border border-border-light rounded-2xl flex items-center justify-between px-4 shadow-sm mb-6">
            <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                    {connected && (
                        <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        />
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                </div>
                <span className="text-sm font-medium text-text-secondary">
                    {connected ? 'Agent Active' : 'Agent Disconnected'}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {scannerName && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-bg-tertiary rounded-full border border-border-default">
                        <Activity size={14} className="text-primary" />
                        <span className="text-xs font-semibold text-text-primary truncate max-w-[200px]">{scannerName}</span>
                    </div>
                )}
                <div className="h-4 w-px bg-border-default" />
                <div className={`p-1.5 rounded-full ${connected ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
