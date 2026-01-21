import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (PNG, JPG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onImageSelected(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-2xl group">
        <img 
          src={selectedImage} 
          alt="Source" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
           <button 
            onClick={onClear}
            className="bg-red-500/90 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm hover:bg-red-600 transition-colors flex items-center shadow-xl"
          >
            <X size={18} className="mr-2" />
            Remove Image
          </button>
        </div>
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-300 border border-white/10">
          Reference Image
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out 
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
          }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-500/20' : 'bg-slate-700/50'}`}>
            <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Upload Reference Photo
            </h3>
            <p className="text-sm text-slate-400">
              Drag & drop or <label htmlFor="file-upload" className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium border-b border-indigo-400/30 pb-0.5 hover:border-indigo-300 transition-all">browse file</label>
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Supported formats: PNG, JPG. Max 10MB.
          </p>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};