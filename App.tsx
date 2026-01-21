import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { Button } from './components/Button';
import { generatePortraitImage } from './services/geminiService';
import { STYLES, APP_NAME } from './constants';
import { GeneratedImage, GenerationStatus, AspectRatio } from './types';
import { Sparkles, Download, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  // Initialize empty states for all styles
  const initializePlaceholders = () => {
    return STYLES.map(style => ({
      styleId: style.id,
      imageUrl: null,
      status: GenerationStatus.IDLE,
    }));
  };

  const handleImageSelected = (base64: string) => {
    setSourceImage(base64);
    setGeneratedImages([]); // Reset previous generations
  };

  const handleClearImage = () => {
    setSourceImage(null);
    setGeneratedImages([]);
    setIsGenerating(false);
  };

  const handleGenerateAll = async () => {
    if (!sourceImage) return;

    setIsGenerating(true);
    
    // Set all to loading initially
    const initialStates = STYLES.map(style => ({
      styleId: style.id,
      imageUrl: null,
      status: GenerationStatus.LOADING,
    }));
    setGeneratedImages(initialStates);

    // Process sequentially to avoid Rate Limiting (429)
    // We use a for...of loop to await each generation one by one.
    for (const style of STYLES) {
      // Check if we should still proceed (e.g. if user cleared image while generating)
      if (!sourceImage) break;

      try {
        const imageUrl = await generatePortraitImage(sourceImage, style.prompt, aspectRatio);
        
        setGeneratedImages(prev => prev.map(img => 
          img.styleId === style.id 
            ? { ...img, status: GenerationStatus.SUCCESS, imageUrl } 
            : img
        ));
      } catch (error: any) {
        console.error(`Error generating ${style.name}:`, error);
        setGeneratedImages(prev => prev.map(img => 
          img.styleId === style.id 
            ? { ...img, status: GenerationStatus.ERROR, error: error.message || 'Generation failed' } 
            : img
        ));
      }
      
      // Add a small delay between requests to be polite to the API rate limiter
      if (style !== STYLES[STYLES.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    setIsGenerating(false);
  };

  const handleRetrySingle = async (styleId: string) => {
    if (!sourceImage) return;

    const style = STYLES.find(s => s.id === styleId);
    if (!style) return;

    // Set specific card to loading
    setGeneratedImages(prev => prev.map(img => 
      img.styleId === styleId ? { ...img, status: GenerationStatus.LOADING, error: undefined } : img
    ));

    try {
      const imageUrl = await generatePortraitImage(sourceImage, style.prompt, aspectRatio);
      setGeneratedImages(prev => prev.map(img => 
        img.styleId === styleId ? { ...img, status: GenerationStatus.SUCCESS, imageUrl } : img
      ));
    } catch (error: any) {
      setGeneratedImages(prev => prev.map(img => 
        img.styleId === styleId ? { ...img, status: GenerationStatus.ERROR, error: error.message } : img
      ));
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const successfulImages = generatedImages.filter(img => img.status === GenerationStatus.SUCCESS && img.imageUrl);
    successfulImages.forEach((img, index) => {
      setTimeout(() => {
        if (img.imageUrl) {
          const style = STYLES.find(s => s.id === img.styleId);
          downloadImage(img.imageUrl, `nano-portrait-${style?.name || index}.png`);
        }
      }, index * 500); // Stagger downloads slightly to prevent browser blocking
    });
  };

  const hasResults = generatedImages.some(img => img.status === GenerationStatus.SUCCESS);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </h1>
          </div>
          <div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Powered by NanoBanana
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create Professional Portraits with AI
          </h2>
          <p className="text-slate-400 text-lg">
            Upload one photo, get six professional styles instantly. 
            From corporate headshots to cinematic masterpieces.
          </p>
        </div>

        {/* Configuration Bar */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 inline-flex">
            {(['1:1', '3:4', '16:9'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => !isGenerating && setAspectRatio(ratio)}
                disabled={isGenerating || !!generatedImages.length}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {ratio === '1:1' ? 'Square' : ratio === '3:4' ? 'Portrait' : 'Landscape'}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <section className="mb-16">
          <div className="flex flex-col items-center space-y-8">
            <UploadZone 
              onImageSelected={handleImageSelected} 
              selectedImage={sourceImage}
              onClear={handleClearImage}
            />

            {sourceImage && !generatedImages.length && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button 
                  onClick={handleGenerateAll} 
                  isLoading={isGenerating} 
                  size="lg"
                  className="px-8 py-4 text-lg"
                  icon={<Sparkles size={20} />}
                >
                  Generate 6 Styles
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Results Grid */}
        {(generatedImages.length > 0) && (
          <section className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Layers className="mr-2 text-indigo-400" />
                Generated Portraits
              </h3>
              {hasResults && (
                <Button 
                  variant="secondary" 
                  onClick={handleDownloadAll}
                  icon={<Download size={16} />}
                  className="text-sm"
                >
                  Download All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STYLES.map((style) => {
                const imgData = generatedImages.find(img => img.styleId === style.id);
                // Fallback if not found (should not happen given initialization)
                const displayData = imgData || { styleId: style.id, imageUrl: null, status: GenerationStatus.IDLE };
                
                return (
                  <ResultCard 
                    key={style.id}
                    style={style}
                    image={displayData}
                    onDownload={downloadImage}
                    onRetry={handleRetrySingle}
                  />
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NanoPortrait Studio. AI generation by Gemini NanoBanana.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;