import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Send, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight,
  BookOpen,
  DollarSign,
  HelpCircle,
  Award
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import LeadModal from '../components/careers/LeadModal';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [leadModalCareer, setLeadModalCareer] = useState(null);
  
  // Priority selector for "Sugerir la mejor carrera"
  const [priority, setPriority] = useState('balanced'); // 'balanced', 'economy', 'speed', 'accreditation', 'flexibility'

  // Intelligent Recommendation Algorithm
  const recommendation = useMemo(() => {
    if (compareList.length < 2) return null;

    let bestCareer = null;
    let highestScore = -1;
    let reasons = [];

    // Calculate score for each career based on selected priority
    const scored = compareList.map(career => {
      let score = 0;
      let notes = [];

      // 1. Economic factor (Lower cost or free tuition)
      const cost = career.monthlyTuition || 0;
      let costScore = 0;
      if (cost === 0) {
        costScore = 100;
        notes.push("Arancel cero / Gratuidad pública garantizada");
      } else if (cost < 1000000) {
        costScore = 80;
        notes.push("Cuota mensual muy accesible (< Gs. 1.000.000)");
      } else if (cost < 1800000) {
        costScore = 55;
      } else {
        costScore = 30;
      }

      // 2. Duration factor (Speed)
      const years = career.durationYears || 5;
      let speedScore = 0;
      if (years <= 4) {
        speedScore = 100;
        notes.push(`Inserción laboral rápida en solo ${years} años`);
      } else if (years <= 5) {
        speedScore = 70;
      } else {
        speedScore = 40;
      }

      // 3. Accreditation factor (ANEAES)
      let accScore = career.isAccredited ? 100 : 30;
      if (career.isAccredited) {
        notes.push("Calidad certificada por la ANEAES");
      }

      // 4. Flexibility factor
      let flexScore = 0;
      if (career.modality === 'Virtual / Online') {
        flexScore = 100;
        notes.push("100% Online: Estudia a tu propio ritmo sin traslados");
      } else if (career.modality === 'Híbrida') {
        flexScore = 80;
        notes.push("Modalidad Híbrida: combina clases virtuales y laboratorios");
      } else {
        flexScore = 50;
      }

      // Compute weighted score according to user selected priority
      switch (priority) {
        case 'economy':
          score = (costScore * 0.6) + (accScore * 0.2) + (speedScore * 0.2);
          break;
        case 'speed':
          score = (speedScore * 0.6) + (accScore * 0.2) + (costScore * 0.2);
          break;
        case 'accreditation':
          score = (accScore * 0.6) + (costScore * 0.2) + (speedScore * 0.2);
          break;
        case 'flexibility':
          score = (flexScore * 0.6) + (costScore * 0.2) + (accScore * 0.2);
          break;
        case 'balanced':
        default:
          score = (costScore * 0.3) + (accScore * 0.3) + (speedScore * 0.25) + (flexScore * 0.15);
          break;
      }

      return { career, score, notes };
    });

    // Pick maximum
    scored.sort((a, b) => b.score - a.score);
    const winner = scored[0];

    return {
      winner: winner.career,
      score: Math.round(winner.score),
      reasons: winner.notes,
      runnerUp: scored[1]?.career
    };
  }, [compareList, priority]);

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Gratuidad / Arancel Cero';
    return `Gs. ${val.toLocaleString('es-PY')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 mb-2">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              Comparador Oficial de Carreras
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comparador Lado a Lado
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analiza diferencias de costos, mallas, duración y modalidades entre instituciones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/carreras"
              className="px-5 py-2.5 rounded-xl bg-campus-50 hover:bg-campus-100 text-campus-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar otra carrera</span>
            </Link>

            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Limpiar lista
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {compareList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-200 text-center space-y-5 shadow-card max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Scale className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              No tienes carreras en el comparador
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Explora nuestro catálogo y presiona el botón <strong>"Comparar con otra"</strong> en 2 o más carreras para ver la tabla comparativa y la recomendación inteligente.
            </p>
            <div className="pt-2">
              <Link
                to="/carreras"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95"
              >
                <span>Ir al Catálogo de Carreras</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Intelligent Recommendation Section */}
            {recommendation && (
              <section className="bg-gradient-to-r from-campus-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-floating border border-white/10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      <Trophy className="w-3.5 h-3.5" />
                      Sugerencia Inteligente DATACAMPUS
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                      ¿Cuál es la mejor carrera para ti?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      Selecciona tu prioridad para que nuestro algoritmo pondere los factores decisivos:
                    </p>
                  </div>

                  {/* Priority selector pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'balanced', label: '⭐ Balance General' },
                      { id: 'economy', label: '💰 Menor Costo' },
                      { id: 'speed', label: '⚡ Menor Tiempo' },
                      { id: 'accreditation', label: '🏆 Prestigio ANEAES' },
                      { id: 'flexibility', label: '🌐 Flexibilidad Virtual' },
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          priority === p.id
                            ? 'bg-white text-slate-900 shadow-md scale-105'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Winner Card Callout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={recommendation.winner.universityLogo}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-white p-0.5"
                      />
                      <div>
                        <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
                          Opción #1 Recomendada
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {recommendation.winner.name}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {recommendation.winner.universityName} • {recommendation.winner.modality}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 text-xs text-slate-200">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        ¿Por qué destaca frente a las demás según tu criterio?
                      </p>
                      {recommendation.reasons.map((r, i) => (
                        <p key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center space-y-3">
                    <div className="text-3xl font-black text-amber-400">
                      {recommendation.score}%
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      Índice de Afinidad con tu prioridad seleccionada
                    </p>
                    <button
                      type="button"
                      onClick={() => setLeadModalCareer(recommendation.winner)}
                      className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Contactar esta carrera</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Comparison Side-by-Side Matrix Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-48">
                      Criterio
                    </th>
                    {compareList.map(career => {
                      const isWinner = recommendation?.winner?.id === career.id;
                      return (
                        <th key={career.id} className={`p-6 min-w-[240px] align-top relative ${isWinner ? 'bg-amber-50/50' : ''}`}>
                          {isWinner && (
                            <div className="mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                              <Trophy className="w-3 h-3" />
                              Mejor Opción
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeFromCompare(career.id)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Quitar carrera"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="space-y-3 pr-6">
                            <img
                              src={career.universityLogo}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <p className="text-[11px] font-bold text-campus-700 uppercase tracking-wider">
                                {career.universityName}
                              </p>
                              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                                {career.name}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => setLeadModalCareer(career)}
                              className="w-full py-2 px-3 bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Solicitar Info</span>
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {/* Cuota Mensual */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Cuota Mensual Estimada
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <span className="text-sm font-black text-slate-900 block">
                          {formatCurrency(career.monthlyTuition)}
                        </span>
                        <span className="text-[11px] text-slate-400">Cuota regular mensual</span>
                      </td>
                    ))}
                  </tr>

                  {/* Matrícula */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Matrícula
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <span className="font-bold text-slate-800">
                          {career.enrollmentFee === 0 ? 'Gratis' : `Gs. ${career.enrollmentFee?.toLocaleString('es-PY')}`}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Duración */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Duración Académica
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <span className="font-extrabold text-slate-900 block">
                          {career.durationYears} Años
                        </span>
                        <span className="text-slate-500">
                          {career.durationSemesters || career.durationYears * 2} Semestres
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Modalidad */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Modalidad
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 inline-block">
                          {career.modality}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Acreditación ANEAES */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Acreditación Oficial
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        {career.isAccredited ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{career.accreditation || 'Acreditada ANEAES'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Habilitada CONES</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Título Oficial */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Título Otorgado
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5 font-semibold text-slate-800">
                        {career.degree || career.name}
                      </td>
                    ))}
                  </tr>

                  {/* Sedes */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Sedes y Ciudades
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <div className="flex flex-wrap gap-1">
                          {career.cities?.map(city => (
                            <span key={city} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                              {city}
                            </span>
                          )) || 'Asunción'}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Campo Laboral */}
                  <tr>
                    <td className="p-5 font-bold text-slate-900 bg-slate-50/30">
                      Salida Laboral
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5 text-slate-600 leading-relaxed text-[11px]">
                        {career.jobField || 'Empresas públicas y privadas, consultoría y ejercicio libre.'}
                      </td>
                    ))}
                  </tr>

                  {/* Acciones */}
                  <tr>
                    <td className="p-5 bg-slate-50/30">
                      Ficha Completa
                    </td>
                    {compareList.map(career => (
                      <td key={career.id} className="p-5">
                        <Link
                          to={`/carrera/${career.id}`}
                          className="text-xs font-bold text-campus-600 hover:text-campus-800 flex items-center gap-1"
                        >
                          <span>Ver Ficha Informativa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>

      {/* Lead Modal */}
      <LeadModal
        career={leadModalCareer}
        isOpen={!!leadModalCareer}
        onClose={() => setLeadModalCareer(null)}
      />

    </div>
  );
}
