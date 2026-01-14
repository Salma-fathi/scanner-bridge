import { motion } from 'framer-motion'

interface Props {
    online: boolean
}

export default function ScannerHeartbeat({ online }: Props) {
    if (!online) return <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />

    return (
        <div className="relative flex items-center justify-center w-3 h-3">
            <motion.div
                className="absolute w-full h-full rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>
    )
}
