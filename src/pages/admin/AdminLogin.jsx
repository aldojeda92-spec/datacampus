import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogIn, 
  Sparkles, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth, MASTER_ADMIN } from '../../context/AuthContext';

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

  const handleAutofillMaster = () => {
    setEmail('aldojeda92@gmail.com');
    setPassword('Aldo3492018*');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
      
      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-campus-600/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-campus-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-card">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel Administrador
          </h1>
          <p className="text-xs text-slate-500">
            DATACAMPUS • Acceso exclusivo para administradores
          </p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aldojeda92@gmail.com"
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

        {/* Master quick credentials */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="p-3.5 rounded-2xl bg-campus-50 border border-campus-100 space-y-2 text-center">
            <span className="text-[11px] font-bold text-campus-800 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-campus-600" />
              Socio Fundador con Poder Total:
            </span>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAutofillMaster}
                className="px-4 py-2 rounded-xl bg-white border border-campus-200 text-xs font-bold text-campus-900 hover:bg-campus-100 transition-colors shadow-sm"
              >
                👑 Autocompletar Master (Aldo Ojeda)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
