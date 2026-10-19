import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Scale, 
  Compass, 
  Building2, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles,
  UserCheck,
  LogIn
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { compareCount } = useCompare();
  const { isAdmin, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D6E2EF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Oficial DATACAMPUS (Brandbook V4.1) */}
          <Link to="/" className="flex items-center py-2 group">
            <BrandLogo size="md" showDescriptor={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/carreras"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/carreras')
                  ? 'bg-campus-50 text-campus-700 shadow-sm border border-campus-200'
                  : 'text-slate-700 hover:text-campus-600 hover:bg-[#F2F6FB]'
              }`}
            >
              <Search className="w-4 h-4 text-campus-600" />
              Buscador de Carreras
            </Link>

            <Link
              to="/universidades"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/universidades')
                  ? 'bg-campus-50 text-campus-700 shadow-sm border border-campus-200'
                  : 'text-slate-700 hover:text-campus-600 hover:bg-[#F2F6FB]'
              }`}
            >
              <Building2 className="w-4 h-4 text-campus-600" />
              Universidades
            </Link>

            <Link
              to="/test-vocacional"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                isActive('/test-vocacional')
                  ? 'bg-campus-50 text-campus-700 shadow-sm border border-campus-200'
                  : 'text-slate-700 hover:text-campus-600 hover:bg-[#F2F6FB]'
              }`}
            >
              <Compass className="w-4 h-4 text-campus-600" />
              ¿Qué te gustaría estudiar?
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-campus-500"></span>
              </span>
            </Link>

            <Link
              to="/comparador"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/comparador')
                  ? 'bg-campus-50 text-campus-700 shadow-sm border border-campus-200'
                  : 'text-slate-700 hover:text-campus-600 hover:bg-[#F2F6FB]'
              }`}
            >
              <Scale className="w-4 h-4 text-slate-500" />
              Comparador
              {compareCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#008F7A] text-white shadow-sm">
                  {compareCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action / Admin button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                isAdmin
                  ? 'bg-campus-50 text-campus-700 border border-campus-200 hover:bg-campus-100'
                  : 'bg-[#F2F6FB] text-[#0A1F33] hover:bg-slate-200 border border-[#D6E2EF]'
              }`}
            >
              {isAdmin ? (
                <>
                  <UserCheck className="w-4 h-4 text-campus-600" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Panel Admin</span>
                </>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/comparador"
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Scale className="w-5 h-5 text-campus-600" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#008F7A] text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D6E2EF] bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <Link
            to="/carreras"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-800 font-semibold hover:bg-[#F2F6FB]"
          >
            <Search className="w-5 h-5 text-campus-600" />
            Buscador de Carreras
          </Link>
          <Link
            to="/universidades"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-800 font-semibold hover:bg-[#F2F6FB]"
          >
            <Building2 className="w-5 h-5 text-campus-600" />
            Universidades
          </Link>
          <Link
            to="/test-vocacional"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-campus-50 text-campus-800 font-bold"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-campus-600" />
              ¿Qué te gustaría estudiar? (Orientación)
            </div>
            <Sparkles className="w-4 h-4 text-campus-600" />
          </Link>
          <Link
            to="/comparador"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-800 font-semibold hover:bg-[#F2F6FB]"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-slate-600" />
              Comparador de Carreras
            </div>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#008F7A] text-white">
                {compareCount}
              </span>
            )}
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F2F6FB] text-[#0A1F33] font-bold text-sm"
            >
              <ShieldCheck className="w-5 h-5 text-campus-600" />
              Acceso Panel Administrador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
