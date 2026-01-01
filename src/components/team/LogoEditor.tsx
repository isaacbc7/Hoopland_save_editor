import { useState, useRef, useEffect } from 'react';
import { Image, Upload, X, Link } from 'lucide-react';

interface LogoEditorProps {
  logoURL?: string;
  logoSize?: number;
  onLogoChange: (logoURL: string, logoSize?: number) => void;
}

export default function LogoEditor({ logoURL, logoSize, onLogoChange }: LogoEditorProps) {
  const [preview, setPreview] = useState<string | null>(logoURL || null);
  const [urlInput, setUrlInput] = useState<string>(logoURL || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when logoURL changes (when switching teams)
  useEffect(() => {
    setPreview(logoURL || null);
    setUrlInput(logoURL || '');
  }, [logoURL]);

  // Update preview when logoURL changes (when switching teams)
  useEffect(() => {
    setPreview(logoURL || null);
    setUrlInput(logoURL || '');
  }, [logoURL]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        setUrlInput(base64String);
        onLogoChange(base64String, logoSize);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    if (url.trim()) {
      setPreview(url);
      onLogoChange(url, logoSize);
    }
  };

  const handleRemoveLogo = () => {
    setPreview(null);
    setUrlInput('');
    onLogoChange('', logoSize);
  };

  const handlePasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        handleUrlChange(text);
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Logo Preview */}
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Team logo"
              className="w-32 h-32 object-contain border-4 border-hoopland-border bg-hoopland-frame p-2"
              style={{ boxShadow: '0 4px 0 0 #000' }}
              onError={(e) => {
                console.error('Failed to load logo:', preview);
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'text-xs font-pixel-alt text-red-600';
                errorDiv.textContent = 'Failed to load';
                (e.target as HTMLImageElement).parentElement?.appendChild(errorDiv);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => {
                console.log('Logo loaded successfully:', preview);
              }}
            />
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white border-4 border-hoopland-text rounded-full transition-all"
              style={{ boxShadow: '0 2px 0 0 #000' }}
              title="Remove logo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 border-4 border-hoopland-border bg-hoopland-frame flex items-center justify-center">
            <Image className="w-8 h-8 text-hoopland-dark" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-pixel-alt text-hoopland-dark mb-2">
            {preview ? 'Logo preview' : 'No logo set'}
          </p>
          {preview && (
            <p className="text-xs font-pixel-alt text-hoopland-dark break-all">
              URL: {preview.length > 50 ? `${preview.substring(0, 50)}...` : preview}
            </p>
          )}
          {logoSize !== undefined && (
            <p className="text-xs font-pixel-alt text-hoopland-dark">
              Size: {logoSize}
            </p>
          )}
        </div>
      </div>

      {/* Upload Options */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <label className="label mb-2">Upload Image File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full btn-secondary inline-flex items-center justify-center gap-2 text-xs"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
          </button>
          <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">
            Max size: 5MB (PNG, JPG, GIF, etc.)
          </p>
        </div>

        {/* URL Input */}
        <div>
          <label className="label mb-2">Or Enter Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/logo.png or data:image/..."
              className="input-field flex-1"
            />
            <button
              onClick={handlePasteUrl}
              className="btn-secondary inline-flex items-center gap-2 text-xs px-3"
              title="Paste from clipboard"
            >
              <Link className="w-4 h-4" />
              PASTE
            </button>
          </div>
          <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">
            Supports URLs or base64 data URIs
          </p>
        </div>
      </div>
    </div>
  );
}

