import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
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
    if (val === undefined || val === null) return 'Consultar a la institución';
    if (val === 0) return 'Gratuidad / Arancel Cero';
    return `Gs. ${val.toLocaleString('es-PY')}`;
  };

  const getModalityColor = (mod) => {
    switch (mod) {
      case 'Presencial':
        return 'bg-slate-100 text-[#0A1F33] border-slate-200';
      case 'Virtual / Online':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'Híbrida':
        return 'bg-teal-50 text-teal-900 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#D6E2EF] shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top accent badge if accredited (ANEAES) */}
      {career.isAccredited && (
        <div className="absolute top-0 right-0 bg-[#008F7A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm font-display">
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
            className="w-12 h-12 rounded-xl object-cover border border-[#D6E2EF] shadow-sm shrink-0"
          />
          <div className="min-w-0 pr-16">
            <p className="text-xs font-bold text-[#087360] uppercase tracking-wider truncate font-display">
              {career.universityName}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {career.area || 'Grado Universitario'}
            </span>
          </div>
        </div>

        {/* Career Title */}
        <Link to={`/carrera/${career.id}`} className="block group-hover:text-[#008F7A] transition-colors">
          <h3 className="text-lg font-bold text-[#0A1F33] leading-snug line-clamp-2 font-display">
            {career.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {career.shortDescription || career.profile || 'Accedé al plan de estudios oficial, sedes habilitadas y perfil de egreso.'}
        </p>

        {/* Badges / Metrics */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getModalityColor(career.modality)}`}>
            {career.modality}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F2F6FB] text-slate-700 border border-[#D6E2EF]">
            <Clock className="w-3 h-3 text-slate-500" />
            {career.durationYears} años ({career.durationSemesters || career.durationYears * 2} semestres)
          </span>
          {career.cities && career.cities.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F2F6FB] text-slate-600 border border-[#D6E2EF]">
              <MapPin className="w-3 h-3 text-slate-400" />
              {career.cities.slice(0, 2).join(', ')}
              {career.cities.length > 2 ? ` +${career.cities.length - 2}` : ''}
            </span>
          )}
        </div>

        {/* Price Box */}
        <div className="mt-5 p-3 rounded-lg bg-[#F2F6FB] border border-[#D6E2EF] flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-display">
              Arancel / Cuota Estimada
            </p>
            <p className="text-sm font-black text-[#0A1F33] font-display">
              {formatCurrency(career.monthlyTuition)}
            </p>
          </div>
          {career.enrollmentFee !== undefined && (
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-display">
                Matrícula
              </p>
              <p className="text-xs font-bold text-slate-700">
                {career.enrollmentFee === 0 ? 'Gratuita' : `Gs. ${career.enrollmentFee.toLocaleString('es-PY')}`}
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
            className="w-full py-2.5 px-3 rounded-lg bg-[#F2F6FB] hover:bg-slate-200 text-[#0A1F33] border border-[#D6E2EF] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center font-display"
          >
            <span>Ver Ficha</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onOpenLeadModal(career)}
            className="w-full py-2.5 px-3 rounded-lg bg-[#008F7A] hover:bg-[#087360] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all font-display"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </div>

        {/* Compare Toggle */}
        <button
          type="button"
          onClick={handleCompareToggle}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            compared
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
              : 'bg-white text-slate-600 border border-[#D6E2EF] hover:bg-[#F2F6FB]'
          }`}
        >
          {compared ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#008F7A]" />
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
