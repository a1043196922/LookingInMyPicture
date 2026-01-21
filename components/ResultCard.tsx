import React from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { GeneratedImage, StyleDefinition, GenerationStatus } from '../types';

interface ResultCardProps {
  image: GeneratedImage;
  style: StyleDefinition;
  onDownload: (url: string, filename: string) => void;
  onRetry: (styleId: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ image, style, onDownload, onRetry }) => {
  const handleDownload = () => {
    if (image.imageUrl) {
      onDownload(image.imageUrl, `nano-portrait-${style.id}.png`);
    }
  };

  return (
    <div className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <h4 className="font-semibold text-slate-200 text-sm">{style.name}</h4>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-slate-900 w-full overflow-hidden">
        {image.status === GenerationStatus.LOADING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-3" />
            <span className="text-xs font-medium animate-pulse">Generating...</span>
          </div>
        )}

        {image.status === GenerationStatus.ERROR && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
            <AlertCircle className="w-8 h-8 mb-2" />
            <span className="text-xs">{image.error || 'Failed to generate'}</span>
            <button 
              onClick={() => onRetry(style.id)}
              className="mt-3 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {image.status === GenerationStatus.SUCCESS && image.imageUrl && (
          <img 
            src={image.imageUrl} 
            alt={style.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-3 bg-slate-800 border-t border-slate-700 mt-auto">
        <button
          onClick={handleDownload}
          disabled={image.status !== GenerationStatus.SUCCESS}
          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${image.status === GenerationStatus.SUCCESS 
              ? 'bg-slate-700 text-slate-200 hover:bg-indigo-600 hover:text-white' 
              : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'}
          `}
        >
          <Download size={16} className="mr-2" />
          Download
        </button>
      </div>
    </div>
  );
};