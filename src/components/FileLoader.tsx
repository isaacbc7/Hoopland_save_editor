import { useRef, useState } from 'react';
import { Upload, Link, Loader2 } from 'lucide-react';

interface FileLoaderProps {
  onFileLoad: (file: File) => void;
  onUrlLoad?: (data: any) => void;
}

export default function FileLoader({ onFileLoad, onUrlLoad }: FileLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols (security: prevent file://, javascript:, etc.)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleLoadFromUrl = async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      setUrlError('Please enter a URL');
      return;
    }

    // Security: Validate URL format and protocol
    if (!validateUrl(trimmedUrl)) {
      setUrlError('Invalid URL. Only http:// and https:// URLs are allowed.');
      return;
    }

    setIsLoadingUrl(true);
    setUrlError(null);

    try {
      // Security: Fetch with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(trimmedUrl, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      
      // Security: Validate that response is JSON before parsing
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        throw new Error('Response is not valid JSON');
      }

      const json = JSON.parse(text);

      // Create a File-like object or pass data directly
      if (onUrlLoad) {
        onUrlLoad(json);
      } else {
        // Fallback: create a blob and trigger file load
        const blob = new Blob([text], { type: 'application/json' });
        const file = new File([blob], 'season_save.json', { type: 'application/json' });
        onFileLoad(file);
      }
      
      setShowUrlInput(false);
      setUrlInput('');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setUrlError('Request timed out. Please try again.');
        } else {
          setUrlError(error.message || 'Failed to load from URL');
        }
      } else {
        setUrlError('Failed to load from URL');
      }
      console.error('Error loading from URL:', error);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  return (
    <div
      className={`card text-center transition-all ${
        isDragging
          ? 'border-hoopland-text bg-hoopland-border scale-105'
          : 'border-hoopland-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className={`w-16 h-16 mx-auto mb-4 text-hoopland-text transition-transform ${isDragging ? 'scale-110' : ''}`} />
      <h2 className="text-sm font-pixel mb-2 text-hoopland-text">
        {isDragging ? 'DROP FILE HERE' : 'LOAD HOOPLAND SAVE FILE'}
      </h2>
      <p className="text-xs font-pixel-alt text-hoopland-dark mb-6">
        {isDragging
          ? 'Release to load your save file'
          : 'Drag and drop your save file here, or click to browse'}
      </p>
      <button
        onClick={handleClick}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        CHOOSE FILE
      </button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="*/*"
        className="hidden"
      />
      <p className="text-xs font-pixel-alt text-hoopland-dark mt-4">
        Note: Hoopland saves don't have .json extension but are JSON formatted
      </p>
      
      {/* URL Input Section */}
      <div className="mt-6 pt-6 border-t border-hoopland-border">
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="btn-secondary inline-flex items-center gap-2 text-xs"
        >
          <Link className="w-4 h-4" />
          {showUrlInput ? 'HIDE URL INPUT' : 'LOAD FROM URL (MOBILE)'}
        </button>
        
        {showUrlInput && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError(null);
              }}
              placeholder="Paste season save URL here..."
              className="input-field w-full text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLoadFromUrl();
                }
              }}
            />
            {urlError && (
              <p className="text-xs font-pixel-alt text-red-400">
                ⚠️ {urlError}
              </p>
            )}
            <button
              onClick={handleLoadFromUrl}
              disabled={isLoadingUrl || !urlInput.trim()}
              className="btn-primary inline-flex items-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingUrl ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  LOADING...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  LOAD FROM URL
                </>
              )}
            </button>
            <p className="text-xs font-pixel-alt text-hoopland-dark mt-2">
              For mobile: Paste your season save URL to import
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
