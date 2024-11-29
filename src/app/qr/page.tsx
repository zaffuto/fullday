'use client';

import { QRGenerator } from '@/components/qr/QRGenerator';

export default function QRPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <QRGenerator />
      </div>
    </main>
  );
}
