import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  initialUrl?: string;
  onGenerate?: (qrData: {url: string, image?: File}) => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  initialUrl = '',
  onGenerate
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = () => {
    if (onGenerate && url) {
      onGenerate({ url, image: image || undefined });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter URL for QR code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {url && (
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <QRCodeSVG
              value={url}
              size={200}
              level="H"
              imageSettings={preview ? {
                src: preview,
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              } : undefined}
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!url}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          Generate QR Sticker
        </button>
      </div>
    </div>
  );
};
