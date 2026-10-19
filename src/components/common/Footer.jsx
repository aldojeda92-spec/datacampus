import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-2xl bg-campus-500 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                DATACAMPUS
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              La plataforma tecnológica de orientación y comparación universitaria de referencia en Paraguay. 
              Mallas curriculares verificadas, costos transparentes y acreditaciones oficiales ANEAES.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Datos Acreditados ANEAES / CONES
              </span>
            </div>
          </div>

          {/* Carreras populares */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Carreras Destacadas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/carreras?q=Medicina" className="hover:text-campus-400 transition-colors">
                  Medicina y Cirugía
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Informática" className="hover:text-campus-400 transition-colors">
                  Ingeniería en Informática
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Derecho" className="hover:text-campus-400 transition-colors">
                  Derecho y Ciencias Jurídicas
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Administración" className="hover:text-campus-400 transition-colors">
                  Administración de Empresas
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Arquitectura" className="hover:text-campus-400 transition-colors">
                  Arquitectura y Urbanismo
                </Link>
              </li>
              <li>
                <Link to="/carreras?q=Psicología" className="hover:text-campus-400 transition-colors">
                  Psicología Clínica
                </Link>
              </li>
            </ul>
          </div>

          {/* Exploración y Herramientas */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Herramientas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/test-vocacional" className="hover:text-accent-400 transition-colors flex items-center gap-1.5 font-medium text-accent-300">
                  <span>✨</span> Test Vocacional Online
                </Link>
              </li>
              <li>
                <Link to="/comparador" className="hover:text-campus-400 transition-colors">
                  Comparador de Carreras
                </Link>
              </li>
              <li>
                <Link to="/universidades" className="hover:text-campus-400 transition-colors">
                  Directorio de Universidades
                </Link>
              </li>
              <li>
                <Link to="/carreras?modalidad=Virtual" className="hover:text-campus-400 transition-colors">
                  Carreras 100% Online
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-slate-200 transition-colors text-xs text-slate-500 pt-2 block">
                  Portal Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto & Sedes */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contacto y Cobertura
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-campus-400 shrink-0 mt-0.5" />
                <span>Asunción, San Lorenzo, Ciudad del Este y Encarnación - Paraguay</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-campus-400 shrink-0" />
                <span>contacto@datacampus.com.py</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-campus-400 shrink-0" />
                <span>+595 21 000 0000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DATACAMPUS Paraguay. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Inspirado en los mejores estándares universitarios internacionales</span>
            <Link to="/admin" className="text-slate-500 hover:text-slate-300">Acceso Master</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
