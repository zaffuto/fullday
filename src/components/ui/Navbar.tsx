'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut, BarChart2, QrCode, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  };

  const menuItems = session ? [
    { href: '/dashboard', icon: BarChart2, label: 'Panel' },
    { href: '/qr/new', icon: QrCode, label: 'Crear QR' },
    { href: '/settings', icon: Settings, label: 'Ajustes' },
  ] : [
    { href: '/login', icon: User, label: 'Iniciar Sesión' },
    { href: '/register', label: 'Registrarse', highlight: true },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center text-xl font-bold text-indigo-600">
            FulldayGO
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${item.highlight 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${item.highlight
                    ? 'text-indigo-600 hover:text-indigo-700 hover:bg-gray-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
