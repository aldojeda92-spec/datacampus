import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
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
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { compareCount } = useCompare();
  const { isAdmin, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-600 via-campus-500 to-campus-400 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-all">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-campus-900 via-campus-700 to-campus-600 bg-clip-text text-transparent">
                  DATACAMPUS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-campus-100 text-campus-700 border border-campus-200">
                  PY
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Tu futuro universitario empieza aquí
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/carreras"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/carreras')
                  ? 'bg-campus-50 text-campus-700 shadow-sm'
                  : 'text-slate-600 hover:text-campus-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-campus-500" />
              Buscador de Carreras
            </Link>

            <Link
              to="/universidades"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/universidades')
                  ? 'bg-campus-50 text-campus-700 shadow-sm'
                  : 'text-slate-600 hover:text-campus-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              Universidades
            </Link>

            <Link
              to="/test-vocacional"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 relative ${
                isActive('/test-vocacional')
                  ? 'bg-accent-50 text-accent-700 shadow-sm'
                  : 'text-slate-600 hover:text-accent-600 hover:bg-accent-50/50'
              }`}
            >
              <Compass className="w-4 h-4 text-accent-500 animate-pulse" />
              ¿No sabes qué estudiar?
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
            </Link>

            <Link
              to="/comparador"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/comparador')
                  ? 'bg-campus-50 text-campus-700 shadow-sm'
                  : 'text-slate-600 hover:text-campus-600 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-500" />
              Comparador
              {compareCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-campus-600 text-white shadow-sm">
                  {compareCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action / Admin button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2 ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isAdmin ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Admin ({currentUser?.email?.split('@')[0]})
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  Panel Admin
                </>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/comparador"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Scale className="w-5 h-5 text-amber-500" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-campus-600 text-white">
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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <Link
            to="/carreras"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
          >
            <Search className="w-5 h-5 text-campus-500" />
            Buscador de Carreras
          </Link>
          <Link
            to="/universidades"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
          >
            <Building2 className="w-5 h-5 text-emerald-500" />
            Universidades
          </Link>
          <Link
            to="/test-vocacional"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent-50 text-accent-800 font-bold"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-accent-600" />
              ¿No sabes qué estudiar? (Test)
            </div>
            <Sparkles className="w-4 h-4 text-accent-500" />
          </Link>
          <Link
            to="/comparador"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-amber-500" />
              Comparador de Carreras
            </div>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-campus-600 text-white">
                {compareCount}
              </span>
            )}
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm"
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
