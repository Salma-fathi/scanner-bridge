import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Cable, Server, ShieldAlert } from 'lucide-react';

interface TroubleshootingProps {
    onClose: () => void;
}

const Troubleshooting: React.FC<TroubleshootingProps> = ({ onClose }) => {
    const steps = [
        {
            icon: <Cable className="text-blue-500" size={24} />,
            title: "Check Physical Connection",
            desc: "Ensure the USB cable is securely connected to both the scanner and your computer. Try a different USB port if possible."
        },
        {
            icon: <Server className="text-purple-500" size={24} />,
            title: "Verify Local Agent",
            desc: "The Scanner Bridge Agent must be running in your system tray. If it's closed, please restart the application."
        },
        {
            icon: <ShieldAlert className="text-orange-500" size={24} />,
            title: "Driver Compatibility",
            desc: "Make sure you have the correct WIA/TWAIN drivers installed for your scanner model."
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            >
                <div className="p-6 border-b border-border-light flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-primary">Connection Troubleshooter</h3>
                    <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-full bg-bg-primary text-text-secondary">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 bg-bg-primary/50">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 p-4 bg-surface rounded-2xl border border-border-light shadow-sm">
                            <div className="shrink-0 p-3 bg-bg-tertiary rounded-xl h-fit">
                                {step.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-1">{step.title}</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-surface border-t border-border-light">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                        <p className="text-sm text-emerald-800">
                            <strong>Pro Tip:</strong> Most issues are resolved by simply unplugging the scanner and plugging it back in while the Agent is running.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full mt-4 btn-primary py-3 rounded-xl font-medium"
                    >
                        Got it, I'll try these steps
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Troubleshooting;
