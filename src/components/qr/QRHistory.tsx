'use client';

import { useEffect, useState } from 'react';
import { QRCode } from '@/domain/qr/entities/QRCode';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
}

export function QRHistory() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQRCodes = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/qr?page=${page}&limit=9`);
      if (!response.ok) throw new Error('Error al cargar los códigos QR');
      
      const data = await response.json();
      setQrCodes(data.data);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los códigos QR",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const handleDownload = (qrCode: QRCode) => {
    const svg = document.getElementById(`qr-${qrCode.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = qrCode.size;
      canvas.height = qrCode.size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${new Date().getTime()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async (qrCode: QRCode) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Código QR',
          text: qrCode.description || 'Mi código QR',
          url: qrCode.url,
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(qrCode.url);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace se ha copiado al portapapeles",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Mis Códigos QR
      </h2>

      {qrCodes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes códigos QR guardados</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qrCode) => (
              <div
                key={qrCode.id}
                className="bg-white rounded-xl shadow-lg p-6 space-y-4"
              >
                <div className="flex justify-center">
                  <QRCodeSVG
                    id={`qr-${qrCode.id}`}
                    value={qrCode.url}
                    size={qrCode.size}
                    level={qrCode.errorLevel}
                    fgColor={qrCode.fgColor}
                    bgColor={qrCode.bgColor}
                    imageSettings={qrCode.logo ? {
                      src: qrCode.logo,
                      height: qrCode.size * 0.2,
                      width: qrCode.size * 0.2,
                      excavate: true,
                    } : undefined}
                    style={{ 
                      shapeRendering: qrCode.qrStyle === 'dots' ? 'geometricPrecision' : 'crispEdges'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {qrCode.description || qrCode.url}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Creado el {new Date(qrCode.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => handleDownload(qrCode)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </button>
                  <button
                    onClick={() => handleShare(qrCode)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Compartir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchQRCodes(page)}
                  className={`px-4 py-2 rounded-md ${
                    page === pagination.currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
