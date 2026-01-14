import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

interface Option {
    value: string | number
    label: string
    description?: string
    icon?: React.ReactNode
}

interface Props {
    label: string
    value: string | number
    options: Option[]
    onChange: (value: any) => void
    disabled?: boolean
}

export default function CustomSelect({ label, value, options, onChange, disabled }: Props) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                {label}
            </label>

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
          w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left
          ${isOpen
                        ? 'border-primary ring-2 ring-primary/10 bg-surface'
                        : 'border-border-default bg-surface hover:border-gray-300'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                <div className="flex items-center gap-3">
                    {selectedOption?.icon && (
                        <span className="text-primary">{selectedOption.icon}</span>
                    )}
                    <div>
                        <div className="font-medium text-text-primary text-sm">
                            {selectedOption?.label}
                        </div>
                    </div>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-surface rounded-xl border border-border-light shadow-xl overflow-hidden py-1"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`
                  w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors
                  ${option.value === value ? 'bg-primary/5 text-primary' : 'hover:bg-bg-tertiary text-text-primary'}
                `}
                            >
                                <div className="flex items-center gap-3">
                                    {option.icon && (
                                        <span className={option.value === value ? 'text-primary' : 'text-text-tertiary'}>
                                            {option.icon}
                                        </span>
                                    )}
                                    <div>
                                        <div className={`text-sm ${option.value === value ? 'font-semibold' : 'font-medium'}`}>
                                            {option.label}
                                        </div>
                                        {option.description && (
                                            <div className="text-xs text-text-tertiary mt-0.5">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {option.value === value && (
                                    <Check size={16} className="text-primary" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
