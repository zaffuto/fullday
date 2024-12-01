'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link as LinkIcon, Upload, Trash2, Save } from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { useToast } from '@/hooks/useToast';

export function QRGenerator() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [logo, setLogo] = useState<string | null>(null);
  const [qrStyle, setQrStyle] = useState<'dots' | 'squares'>('squares');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${new Date().getTime()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleSave = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Por favor, ingresa una URL válida",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          description,
          size,
          fgColor,
          bgColor,
          qrStyle,
          errorLevel,
          logo,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el QR');
      }

      toast({
        title: "¡Éxito!",
        description: "El código QR se ha guardado correctamente",
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el código QR",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Personalizar QR
          </h2>

          <div className="space-y-4">
            {/* URL Input */}
            <div className="relative">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL del descuento
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://ejemplo.com/descuento"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Describe el descuento..."
              />
            </div>

            {/* Tamaño */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Tamaño del QR
              </label>
              <input
                type="range"
                id="size"
                min="100"
                max="400"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="mt-1 block w-full"
              />
              <div className="text-sm text-gray-500 text-center">{size}px</div>
            </div>

            {/* Colores */}
            <ColorPicker
              label="Color del QR"
              value={fgColor}
              onChange={setFgColor}
            />
            <ColorPicker
              label="Color de fondo"
              value={bgColor}
              onChange={setBgColor}
            />

            {/* Estilo del QR */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estilo del QR
              </label>
              <div className="mt-1 flex space-x-4">
                <button
                  onClick={() => setQrStyle('squares')}
                  className={`px-4 py-2 rounded-md ${
                    qrStyle === 'squares'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cuadrados
                </button>
                <button
                  onClick={() => setQrStyle('dots')}
                  className={`px-4 py-2 rounded-md ${
                    qrStyle === 'dots'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Puntos
                </button>
              </div>
            </div>

            {/* Nivel de error */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nivel de corrección
              </label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="L">Bajo (7%)</option>
                <option value="M">Medio (15%)</option>
                <option value="Q">Cuartil (25%)</option>
                <option value="H">Alto (30%)</option>
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo (opcional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Logo
                </button>
                {logo && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel de vista previa */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Vista Previa
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div className="p-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
              <QRCodeSVG
                id="qr-code"
                value={url || 'https://ejemplo.com'}
                size={size}
                level={errorLevel}
                includeMargin={true}
                fgColor={fgColor}
                bgColor={bgColor}
                imageSettings={logo ? {
                  src: logo,
                  height: size * 0.2,
                  width: size * 0.2,
                  excavate: true,
                } : undefined}
                style={{ 
                  shapeRendering: qrStyle === 'dots' ? 'geometricPrecision' : 'crispEdges'
                }}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                disabled={!url || isLoading}
                onClick={handleSave}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar QR'}
              </button>
              <button
                type="button"
                disabled={!url}
                onClick={handleDownload}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Descargar QR
              </button>
            </div>
          </div>

          {/* Previsualización en diferentes fondos */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Previsualizar en diferentes fondos:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <QRCodeSVG
                  value={url || 'https://ejemplo.com'}
                  size={100}
                  level={errorLevel}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  style={{ 
                    shapeRendering: qrStyle === 'dots' ? 'geometricPrecision' : 'crispEdges'
                  }}
                />
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <QRCodeSVG
                  value={url || 'https://ejemplo.com'}
                  size={100}
                  level={errorLevel}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  style={{ 
                    shapeRendering: qrStyle === 'dots' ? 'geometricPrecision' : 'crispEdges'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
