import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Trophy, 
  GraduationCap, 
  Scale, 
  Send,
  Building2,
  ChevronRight,
  Brain,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCATIONAL_QUESTIONS, VOCATIONAL_ARCHETYPES } from '../data/initialData';
import { getCareers, saveTestResult } from '../services/dataService';
import CareerCard from '../components/careers/CareerCard';
import LeadModal from '../components/careers/LeadModal';

export default function VocationalTestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({
    "Tecnología e Informática": 0,
    "Ciencias de la Salud": 0,
    "Ciencias Sociales y Jurídicas": 0,
    "Negocios y Finanzas": 0,
    "Arte, Diseño y Creatividad": 0,
    "Ciencias Agropecuarias": 0
  });

  const [testCompleted, setTestCompleted] = useState(false);
  const [allCareers, setAllCareers] = useState([]);
  const [leadModalCareer, setLeadModalCareer] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getCareers();
      setAllCareers(data);
    };
    load();
  }, []);

  const handleSelectOption = (option) => {
    const newScores = {
      ...scores,
      [option.area]: (scores[option.area] || 0) + option.points
    };
    setScores(newScores);

    if (currentStep < VOCATIONAL_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate top area for logging
      const totalPts = Object.values(newScores).reduce((a, b) => a + b, 0) || 1;
      const sorted = Object.entries(newScores)
        .map(([area, pts]) => ({
          area,
          points: pts,
          percentage: Math.min(Math.round((pts / totalPts) * 100) * 2.2, 98)
        }))
        .sort((a, b) => b.points - a.points);
      
      const winningArea = sorted[0]?.area || "Tecnología e Informática";
      const arch = VOCATIONAL_ARCHETYPES[winningArea];

      // Persist to analytics
      saveTestResult({
        topArea: winningArea,
        archetypeTitle: arch?.title || winningArea,
        percentage: sorted[0]?.percentage || 90,
        scores: newScores,
        createdAt: new Date().toISOString()
      }).catch(err => console.warn("Error saving test result:", err));

      // Finished test
      setTestCompleted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setScores({
      "Tecnología e Informática": 0,
      "Ciencias de la Salud": 0,
      "Ciencias Sociales y Jurídicas": 0,
      "Negocios y Finanzas": 0,
      "Arte, Diseño y Creatividad": 0,
      "Ciencias Agropecuarias": 0
    });
    setCurrentStep(0);
    setTestCompleted(false);
  };

  // Calculate results
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const sortedAreas = Object.entries(scores)
    .map(([area, pts]) => ({
      area,
      points: pts,
      percentage: Math.min(Math.round((pts / totalPoints) * 100) * 2.2, 98) // Scaled affinity %
    }))
    .sort((a, b) => b.points - a.points);

  const topArea = sortedAreas[0]?.area || "Tecnología e Informática";
  const archetype = VOCATIONAL_ARCHETYPES[topArea] || VOCATIONAL_ARCHETYPES["Tecnología e Informática"];

  // Matching careers from database
  const matchingCareers = allCareers.filter(c => c.area === topArea);

  const progressPercent = Math.round(((currentStep + 1) / VOCATIONAL_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 text-accent-800 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4 text-accent-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Módulo Vocacional Inteligente</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ¿No sabes qué estudiar?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Responde con total sinceridad. Este test evalúa tus intereses reales para perfilar las carreras universitarias de mayor afinidad para tu futuro.
          </p>
        </div>

        {!testCompleted ? (
          /* Step-by-Step Question Card */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-8 animate-in fade-in duration-200">
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span className="uppercase tracking-wider">Pregunta {currentStep + 1} de {VOCATIONAL_QUESTIONS.length}</span>
                <span className="text-accent-600 font-black">{progressPercent}% Completado</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-500 to-campus-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {VOCATIONAL_QUESTIONS[currentStep].question}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Selecciona la opción con la que más te identifiques:</p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {VOCATIONAL_QUESTIONS[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-slate-100 hover:border-campus-500 bg-white hover:bg-campus-50/50 transition-all duration-150 flex items-center justify-between group active:scale-98 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-campus-500 group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-campus-900 leading-relaxed">
                      {option.text}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-campus-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Hint */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-accent-500" />
                Algoritmo de afinidad vocacional psicopedagógico
              </span>
              <span>Test 100% gratuito</span>
            </div>

          </div>
        ) : (
          /* Result Screen */
          <div className="space-y-10 animate-in zoom-in-95 duration-300">
            
            {/* Winner Archetype Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-700 via-purple-800 to-campus-900 text-white p-8 sm:p-12 shadow-floating space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                  <Trophy className="w-4 h-4" />
                  Tu Área Vocacional Ganadora
                </span>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-bold underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Repetir test
                </button>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent-200">
                  {topArea}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {archetype.title}
                </h2>
                <p className="text-white/90 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
                  {archetype.description}
                </p>
              </div>

              {/* Strengths / Traits */}
              <div className="pt-2 border-t border-white/20">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                  Tus Fortalezas Clave:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {archetype.traits.map((trait, tIdx) => (
                    <div key={tIdx} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown of all Vocational Areas */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Tu Nivel de Afinidad por Áreas
                  </h3>
                  <p className="text-xs text-slate-500">
                    Porcentaje de compatibilidad resultante de tus respuestas.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {sortedAreas.map((item, idx) => (
                  <div key={item.area} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">{item.area}</span>
                      <span className={`${idx === 0 ? 'text-accent-600 font-black' : 'text-slate-500'}`}>
                        {item.percentage}% compatibilidad
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-accent-500 to-purple-600'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Directly Recommended Careers in Catalog */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-campus-600">
                    Matches Directos con DATACAMPUS
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    Carreras Recomendadas para tu Perfil
                  </h3>
                </div>
                <Link
                  to={`/carreras?area=${encodeURIComponent(topArea)}`}
                  className="text-xs font-bold text-campus-600 hover:text-campus-800 flex items-center gap-1"
                >
                  <span>Ver todas de {topArea}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingCareers.length > 0 ? (
                  matchingCareers.map(career => (
                    <CareerCard
                      key={career.id}
                      career={career}
                      onOpenLeadModal={(c) => setLeadModalCareer(c)}
                    />
                  ))
                ) : (
                  <div className="col-span-2 p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500">
                    No se encontraron carreras específicas registradas aún para esta área en la base de datos.
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">¿Quieres comparar opciones entre sí?</h4>
                <p className="text-xs text-slate-400">Agrega carreras a tu comparador para decidir con claridad.</p>
              </div>
              <Link
                to="/comparador"
                className="px-6 py-3 rounded-xl bg-campus-500 hover:bg-campus-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <Scale className="w-4 h-4 text-amber-300" />
                <span>Ir al Comparador</span>
              </Link>
            </div>

          </div>
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
