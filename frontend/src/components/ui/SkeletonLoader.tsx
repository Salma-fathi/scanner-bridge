import { motion } from 'framer-motion'

export default function SkeletonLoader() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            {/* Document Shape */}
            <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-[210mm] max-w-full aspect-[1/1.414] bg-white rounded shadow-sm border border-border-light overflow-hidden"
                style={{ height: '500px' }}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full h-full animate-shimmer"
                    style={{ transform: 'skewX(-20deg)' }} />

                {/* Skeleton Content Lines */}
                <div className="p-8 space-y-4 opacity-30">
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-8" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-2/3" />

                    <div className="h-32 bg-slate-100 rounded w-full my-8" />

                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-5/6" />
                </div>

                {/* Scanning Beam Animation */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-primary/50 shadow-[0_0_15px_rgba(79,70,229,0.5)] z-10"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            <motion.p
                className="mt-6 text-primary font-medium flex items-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <span className="w-2 h-2 rounded-full bg-primary" />
                Acquiring document from scanner...
            </motion.p>
        </div>
    )
}
