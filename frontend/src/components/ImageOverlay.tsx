import React from 'react';
import { RotateCw, MoveHorizontal, Trash2, Download } from 'lucide-react';

interface ImageOverlayProps {
    onRotate: () => void;
    onFlip: () => void;
    onDelete: () => void;
    onDownload: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ onRotate, onFlip, onDelete, onDownload }) => {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-border-light shadow-xl rounded-2xl p-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <ActionButton onClick={onRotate} icon={<RotateCw size={18} />} label="Rotate" />
            <ActionButton onClick={onFlip} icon={<MoveHorizontal size={18} />} label="Flip" />
            <div className="w-px h-6 bg-border-default mx-1" />
            <ActionButton onClick={onDownload} icon={<Download size={18} />} label="Save" />
            <ActionButton onClick={onDelete} icon={<Trash2 size={18} />} label="Delete" variant="danger" />
        </div>
    );
};

interface ActionButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    variant?: 'default' | 'danger';
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, label, variant = 'default' }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center relative group/btn
      ${variant === 'danger'
                ? 'text-error hover:bg-error-light hover:text-error-active'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-primary'}
    `}
        title={label}
    >
        {icon}
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {label}
        </span>
    </button>
);

export default ImageOverlay;
