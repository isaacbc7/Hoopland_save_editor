import { useState } from 'react';
import { Link, Copy, Check, ExternalLink, Download } from 'lucide-react';

interface ExportToUrlProps {
  filename: string;
  onDownload: () => void;
  isMobile: boolean;
}

export default function ExportToUrl({ onDownload, isMobile }: ExportToUrlProps) {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleCopyInstructions = () => {
    const instructions = `1. Click "DOWNLOAD SAVE" to download your edited save file
2. Upload the file to Dropbox, Google Drive, or another cloud service
3. Get a shareable link (make sure it's set to "Anyone with the link")
4. Copy the link and paste it into Hoopland's "Import Season" feature`;
    
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatUrlForHoopland = (url: string): string => {
    // Convert Dropbox sharing links to direct download links
    if (url.includes('dropbox.com/s/')) {
      // Dropbox sharing link format
      return url.replace('?dl=0', '?dl=1'); // Force download
    }
    // Convert Google Drive sharing links
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    return url;
  };

  const handleFormatUrl = () => {
    if (urlInput.trim()) {
      const formatted = formatUrlForHoopland(urlInput.trim());
      setUrlInput(formatted);
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMobile) {
    return null; // Only show for mobile saves
  }

  return (
    <div className="card border-hoopland-border">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-4">
        <h2 className="text-base sm:text-sm font-pixel text-hoopland-text">
          EXPORT FOR MOBILE IMPORT
        </h2>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="btn-secondary text-sm sm:text-xs py-3 sm:py-2 w-full sm:w-auto"
        >
          {showInstructions ? 'HIDE' : 'SHOW'} INSTRUCTIONS
        </button>
      </div>

      {showInstructions && (
        <div className="space-y-5 sm:space-y-4 mb-5 sm:mb-4">
          <div className="bg-hoopland-dark p-5 sm:p-4 border-4 border-hoopland-border">
            <h3 className="text-sm sm:text-xs font-pixel text-hoopland-text mb-4 sm:mb-3">
              STEP 1: DOWNLOAD YOUR EDITED SAVE
            </h3>
            <button
              onClick={onDownload}
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm sm:text-xs mb-4 sm:mb-3 w-full sm:w-auto py-4 sm:py-3"
            >
              <Download className="w-5 h-5 sm:w-4 sm:h-4" />
              DOWNLOAD SAVE FILE
            </button>
            <p className="text-sm sm:text-xs font-pixel-alt text-hoopland-dark">
              This will download your edited save file to your device.
            </p>
          </div>

          <div className="bg-hoopland-dark p-4 border-4 border-hoopland-border">
            <h3 className="text-xs font-pixel text-hoopland-text mb-3">
              STEP 2: UPLOAD TO CLOUD STORAGE
            </h3>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-3">
              Upload the downloaded file to one of these services:
            </p>
            <div className="space-y-3 sm:space-y-2">
              <a
                href="https://www.dropbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-xs w-full py-4 sm:py-3"
              >
                <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
                UPLOAD TO DROPBOX
              </a>
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-xs w-full py-4 sm:py-3"
              >
                <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
                UPLOAD TO GOOGLE DRIVE
              </a>
            </div>
            <p className="text-xs font-pixel-alt text-hoopland-dark mt-3">
              Make sure to set the sharing permission to "Anyone with the link"
            </p>
          </div>

          <div className="bg-hoopland-dark p-4 border-4 border-hoopland-border">
            <h3 className="text-xs font-pixel text-hoopland-text mb-3">
              STEP 3: GET SHAREABLE URL
            </h3>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-3">
              Copy the shareable link from your cloud storage service.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste your shareable URL here..."
                className="input-field w-full text-xs"
              />
              <button
                onClick={handleFormatUrl}
                disabled={!urlInput.trim()}
                className="btn-primary inline-flex items-center gap-2 text-xs disabled:opacity-50"
              >
                <Link className="w-4 h-4" />
                FORMAT & COPY URL
              </button>
            </div>
            {copied && (
              <p className="text-xs font-pixel-alt text-green-400 mt-2">
                ✅ URL formatted and copied to clipboard!
              </p>
            )}
          </div>

          <div className="bg-hoopland-dark p-4 border-4 border-hoopland-border">
            <h3 className="text-xs font-pixel text-hoopland-text mb-3">
              STEP 4: IMPORT INTO HOOPLAND
            </h3>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-2">
              1. Open Hoopland on your mobile device
            </p>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-2">
              2. Go to "Import Season" or "Load Season"
            </p>
            <p className="text-xs font-pixel-alt text-hoopland-dark mb-2">
              3. Paste the URL you copied above
            </p>
            <p className="text-xs font-pixel-alt text-hoopland-dark">
              4. Hoopland will download and import your edited season
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyInstructions}
          className="btn-secondary inline-flex items-center gap-2 text-xs flex-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              COPIED!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              COPY INSTRUCTIONS
            </>
          )}
        </button>
        <button
          onClick={onDownload}
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD
        </button>
      </div>
    </div>
  );
}

