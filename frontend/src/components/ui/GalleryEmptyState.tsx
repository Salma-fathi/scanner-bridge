import { motion } from 'framer-motion'
import { Scan, Plus } from 'lucide-react'

interface Props {
    onStart: () => void
}

export default function GalleryEmptyState({ onStart }: Props) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-bg-primary rounded-3xl flex items-center justify-center mb-6 border border-border-default shadow-inner"
            >
                <Scan size={40} className="text-text-tertiary" />
            </motion.div>

            <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold text-text-primary mb-2"
            >
                No Scans Yet
            </motion.h3>

            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-text-secondary max-w-xs mb-8"
            >
                Place a document in the scanner and start your first digitization.
            </motion.p>

            <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="btn-primary rounded-full px-6 py-3 flex items-center gap-2 shadow-lg shadow-primary/25"
            >
                <Plus size={18} />
                <span>Start New Scan</span>
            </motion.button>
        </div>
    )
}
