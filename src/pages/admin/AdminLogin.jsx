import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogIn, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import BrandLogo from '../../components/common/BrandLogo';

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1F33] flex items-center justify-center p-4 sm:p-6">
      
      {/* Background glow with brand emerald */}
      <div className="absolute w-96 h-96 rounded-full bg-[#008F7A]/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-xl p-8 sm:p-10 shadow-card border border-[#D6E2EF] space-y-6">
        
        {/* Header with official BrandLogo */}
        <div className="text-center space-y-3 pb-2 border-b border-slate-100">
          <BrandLogo size="md" showDescriptor={true} showEcosystem={true} className="items-center" />
          <div className="pt-2">
            <h1 className="text-lg font-black text-[#0A1F33] tracking-tight font-display">
              Panel Administrador
            </h1>
            <p className="text-xs text-slate-500">
              Acceso exclusivo para administradores autorizados
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@datacampus.com.py"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión en el Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Secure access note */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            🔒 Área restringida con autenticación segura y cifrada.
          </p>
        </div>

      </div>
    </div>
  );
}
