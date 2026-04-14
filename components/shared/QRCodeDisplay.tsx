'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Copy, CheckCircle, Download } from 'lucide-react';
import { useState, useRef } from 'react';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
  downloadName?: string;
}

export default function QRCodeDisplay({ 
  data, 
  size = 200, 
  label = 'Scan to vote',
  downloadName = 'pollchain-qr'
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadName}.png`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-[#001224] border border-rose-500/20 rounded-xl max-w-xs mx-auto">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-slate-200">{label}</p>
      </div>
      
      <div className="p-4 bg-white rounded-lg mb-6" ref={qrRef}>
        <QRCodeCanvas 
          value={data} 
          size={size} 
          bgColor="#ffffff"
          fgColor="#000d1a"
          level="H"
        />
      </div>

      <div className="flex w-full gap-2">
        <button 
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#000d1a] border border-rose-500/30 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          {copied ? <CheckCircle className="w-3.5 h-3.5 text-rose-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Link'}
        </button>
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#000d1a] border border-violet-500/30 rounded-md text-xs font-medium text-violet-400 hover:bg-violet-500/10 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Save PNG
        </button>
      </div>
    </div>
  );
}
