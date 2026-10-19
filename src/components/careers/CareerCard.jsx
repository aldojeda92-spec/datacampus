import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
  Sparkles,
  Send,
  Check
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export default function CareerCard({ career, onOpenLeadModal }) {
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const compared = isInCompare(career.id);

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(career.id);
    } else {
      addToCompare(career);
    }
  };

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Gratuidad / Arancel Cero';
    return `Gs. ${val.toLocaleString('es-PY')}`;
  };

  const getModalityColor = (mod) => {
    switch (mod) {
      case 'Presencial':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Virtual / Online':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Híbrida':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top accent badge if accredited */}
      {career.isAccredited && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-2xl flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          Acreditada ANEAES
        </div>
      )}

      <div>
        {/* University & logo header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={career.universityLogo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100'}
            alt={career.universityName}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-sm shrink-0"
          />
          <div className="min-w-0 pr-16">
            <p className="text-xs font-bold text-campus-700 uppercase tracking-wider truncate">
              {career.universityName}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">
              {career.area || 'Grado Universitario'}
            </span>
          </div>
        </div>

        {/* Career Title */}
        <Link to={`/carrera/${career.id}`} className="block group-hover:text-campus-600 transition-colors">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug line-clamp-2">
            {career.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {career.shortDescription || career.profile || 'Conoce el plan de estudios completo, sedes y salidas laborales.'}
        </p>

        {/* Badges / Metrics */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getModalityColor(career.modality)}`}>
            {career.modality}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            {career.durationYears} años ({career.durationSemesters || career.durationYears * 2} semestres)
          </span>
          {career.cities && career.cities.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-50 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400" />
              {career.cities.slice(0, 2).join(', ')}
              {career.cities.length > 2 ? ` +${career.cities.length - 2}` : ''}
            </span>
          )}
        </div>

        {/* Price Box */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Cuota Estimada
            </p>
            <p className="text-sm font-black text-slate-900">
              {formatCurrency(career.monthlyTuition)}
            </p>
          </div>
          {career.enrollmentFee !== undefined && (
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Matrícula
              </p>
              <p className="text-xs font-bold text-slate-600">
                {career.enrollmentFee === 0 ? 'Gratis' : `Gs. ${career.enrollmentFee.toLocaleString('es-PY')}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/carrera/${career.id}`}
            className="w-full py-2.5 px-3 rounded-xl bg-campus-50 hover:bg-campus-100 text-campus-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <span>Ver Ficha</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onOpenLeadModal(career)}
            className="w-full py-2.5 px-3 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Solicitar Info</span>
          </button>
        </div>

        {/* Compare Toggle */}
        <button
          type="button"
          onClick={handleCompareToggle}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            compared
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {compared ? (
            <>
              <Check className="w-3.5 h-3.5 text-amber-600" />
              <span>En el comparador</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Comparar con otra</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
