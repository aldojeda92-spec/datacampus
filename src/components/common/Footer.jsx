import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0A1F33] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info & Ecosystem */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block py-1">
              <BrandLogo variant="negative" size="md" showDescriptor={true} />
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Plataforma de inteligencia educativa para orientar la comparación de carreras e instituciones en Paraguay con información verificable, aranceles transparentes y acreditaciones oficiales.
            </p>

            {/* DATABRAND Ecosystem badge */}
            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 max-w-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-display">
                  Ecosistema de Marcas DATABRAND
                </span>
                <p className="text-xs text-slate-300">
                  <span className="font-extrabold text-white">DATABRAND</span> desarrolla plataformas especializadas para transformar información en decisiones más claras y confiables.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                  <span className="text-slate-400">
                    • <strong className="text-white">DATACAR</strong> (Automotriz)
                  </span>
                  <span className="text-emerald-400">
                    • <strong className="text-emerald-300">DATACAMPUS</strong> (Educación)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Datos y Acreditaciones ANEAES / CONES
              </span>
            </div>
          </div>

          {/* Carreras populares */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-display">
              Carreras Destacadas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/carreras?q=Medicina" className="hover:text-emerald-300 transition-colors">
                  Medicina y Cirugía
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Informática" className="hover:text-emerald-300 transition-colors">
                  Ingeniería en Informática
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Derecho" className="hover:text-emerald-300 transition-colors">
                  Derecho y Ciencias Jurídicas
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Administración" className="hover:text-emerald-300 transition-colors">
                  Administración de Empresas
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Arquitectura" className="hover:text-emerald-300 transition-colors">
                  Arquitectura y Urbanismo
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Odontología" className="hover:text-emerald-300 transition-colors">
                  Odontología
                </Link>
              </li>
            </ul>
          </div>

          {/* Exploración y Herramientas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-display">
              Herramientas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/test-vocacional" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Orientación Vocacional
                </Link>
              </li>
              <li>
                <Link to="/comparador" className="hover:text-emerald-300 transition-colors">
                  Comparador de Carreras
                </Link>
              </li>
              <li>
                <Link to="/universidades" className="hover:text-emerald-300 transition-colors">
                  Directorio de Universidades
                </Link>
              </li>
              <li>
                <Link to="/carreras?modalidad=Virtual" className="hover:text-emerald-300 transition-colors">
                  Carreras 100% Online
                </Link>
              </li>
              <li>
                <Link to="/portal-universidades" className="hover:text-slate-200 transition-colors text-xs text-slate-400 pt-2 block">
                  🏛️ Portal para Universidades
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-slate-200 transition-colors text-xs text-slate-400 block">
                  🔒 Panel de Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto & Cobertura */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-display">
              Contacto y Cobertura
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Asunción, San Lorenzo, Ciudad del Este y Encarnación - Paraguay</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contacto@datacampus.com.py</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+595 21 000 0000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with Brandbook Claim */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} DATACAMPUS • Todos los derechos reservados.</p>
            <p className="text-[11px] text-slate-500">
              Principio rector: <em className="text-slate-400">"Los datos son el medio; las mejores decisiones son el resultado."</em>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-500">DATABRAND Ecosystem</span>
            <Link to="/admin" className="text-slate-500 hover:text-slate-300">Acceso Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
