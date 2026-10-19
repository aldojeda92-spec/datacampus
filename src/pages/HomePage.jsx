import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Compass, 
  Scale, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Users, 
  ChevronRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import PredictiveSearch from '../components/common/PredictiveSearch';
import BannerItem from '../components/common/BannerItem';
import CareerCard from '../components/careers/CareerCard';
import LeadModal from '../components/careers/LeadModal';
import { getCareers, getUniversities } from '../services/dataService';

export default function HomePage() {
  const [careers, setCareers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [leadModalCareer, setLeadModalCareer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [careersData, unisData] = await Promise.all([getCareers(), getUniversities()]);
      setCareers(careersData);
      setUniversities(unisData);
    };
    load();
  }, []);

  const areas = [
    'Todas',
    'Tecnología e Informática',
    'Ciencias de la Salud',
    'Ciencias Sociales y Jurídicas',
    'Negocios y Finanzas',
    'Ingeniería y Construcción',
    'Ciencias Agropecuarias'
  ];

  const filteredCareers = selectedArea === 'Todas' 
    ? careers.slice(0, 6) 
    : careers.filter(c => c.area === selectedArea).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F8FAFC] space-y-16 pb-20">
      
      {/* =========================================================
          HERO SECTION (Brandbook V4.1: Lámina 05, 08, 10, 11)
          Título oficial: "Explorá opciones. Decidí con claridad."
          Fondo: DATA Navy #0A1F33 con geometría diagonal y acento esmeralda
         ========================================================= */}
      <section className="relative overflow-hidden bg-[#0A1F33] text-white pt-16 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Planos de color y diagonales geométricas sutiles (Lámina 08 y 10) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute -top-40 right-0 w-[550px] h-[550px] rounded-full bg-[#008F7A] blur-[120px]" />
          <div className="absolute bottom-0 left-[-100px] w-[450px] h-[450px] rounded-full bg-[#087360] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full border-x border-white/5" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Brand Category Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold font-display backdrop-blur-sm shadow-sm animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-[#008F7A]" />
            <span>DATACAMPUS • INTELIGENCIA EDUCATIVA</span>
          </div>

          {/* Main Title (Brandbook V4.1 Lámina 05 & 11) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-display">
            Explorá opciones. <br className="hidden sm:inline" />
            <span className="text-[#008F7A]">Decidí con claridad.</span>
          </h1>

          {/* Subheading (Brandbook V4.1 Tono DATACAMPUS) */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Tu futuro merece información. Compará carreras universitarias, costos, mallas curriculares y acreditaciones oficiales ANEAES en Paraguay con datos verificables.
          </p>

          {/* Guiding Question & Autopredictive Search (Brandbook V4.1 p. 14) */}
          <div className="pt-4 max-w-3xl mx-auto space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-emerald-300 font-display">
              ¿Qué te gustaría estudiar?
            </label>
            <PredictiveSearch />
          </div>

          {/* Quick tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Tendencias 2026:</span>
            {['Medicina', 'Ingeniería Informática', 'Derecho', 'Administración', 'Odontología'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/carreras?q=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-[#008F7A]/30 hover:border-emerald-500/50 text-white transition-colors border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* Stats Bar (Información Verificable) */}
        <div className="max-w-6xl mx-auto mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white font-display">+500</div>
            <div className="text-xs sm:text-sm text-emerald-300 font-medium">Carreras y Mallas</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white font-display">100%</div>
            <div className="text-xs sm:text-sm text-emerald-300 font-medium">Acceso Libre para Postulantes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white font-display">ANEAES</div>
            <div className="text-xs sm:text-sm text-emerald-300 font-medium">Acreditaciones Oficiales</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white font-display">Paraguay</div>
            <div className="text-xs sm:text-sm text-emerald-300 font-medium">Presencial, Híbrido y Virtual</div>
          </div>
        </div>

      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Banner Hero Sub */}
        <BannerItem position="home_hero_sub" />

        {/* =========================================================
            CALLOUT: ORIENTACIÓN VOCACIONAL (Brandbook V4.1 Lámina 05 & 06)
            "Tu próximo paso merece información"
           ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#008F7A] via-[#087360] to-[#0A1F33] text-white p-8 sm:p-12 shadow-card">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
            <Compass className="w-full h-full text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm font-display">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              Orientación Vocacional
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight font-display">
              Tu próximo paso merece información.
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Explorá tus intereses, afinidades y aptitudes. Nuestro test orientativo te guía hacia carreras y universidades compatibles con tu perfil académico y vocacional.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/test-vocacional"
                className="px-6 py-3.5 rounded-xl bg-white text-[#0A1F33] hover:bg-[#F2F6FB] font-extrabold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 font-display"
              >
                <Compass className="w-4 h-4 text-[#008F7A]" />
                <span>Iniciar Test de Orientación</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/comparador"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all flex items-center gap-2 font-display"
              >
                <Scale className="w-4 h-4 text-emerald-300" />
                <span>Ir al Comparador</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            CARRERAS DESTACADAS
           ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#087360] font-display">
                <BookOpen className="w-4 h-4 text-[#008F7A]" />
                Catálogo de Carreras
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F33] tracking-tight mt-1 font-display">
                Explorá las Carreras Más Consultadas
              </h2>
            </div>
            <Link
              to="/carreras"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#087360] hover:text-[#008F7A] transition-colors"
            >
              <span>Ver todas las carreras</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Area Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedArea === area
                    ? 'bg-[#008F7A] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-[#D6E2EF] hover:bg-[#F2F6FB]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Grid of Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map(career => (
              <CareerCard
                key={career.id}
                career={career}
                onOpenLeadModal={(c) => setLeadModalCareer(c)}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/carreras"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border-2 border-[#D6E2EF] hover:border-[#008F7A] text-[#0A1F33] font-extrabold text-sm shadow-sm hover:shadow-card transition-all font-display"
            >
              <span>Explorar todo el catálogo (+{careers.length} carreras)</span>
              <ArrowRight className="w-4 h-4 text-[#008F7A]" />
            </Link>
          </div>
        </section>

        {/* Banner Middle */}
        <BannerItem position="home_middle" />

        {/* =========================================================
            UNIVERSIDADES EN CONVENIO
           ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#087360] font-display">
                <Building2 className="w-4 h-4 text-[#008F7A]" />
                Instituciones de Educación Superior
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F33] tracking-tight mt-1 font-display">
                Universidades e Institutos
              </h2>
            </div>
            <Link
              to="/universidades"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#087360] hover:text-[#008F7A] transition-colors"
            >
              <span>Ver todas las universidades</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {universities.map(uni => (
              <Link
                key={uni.id}
                to={`/carreras?universidad=${uni.id}`}
                className="bg-white rounded-xl p-6 border border-[#D6E2EF] shadow-card hover:shadow-floating transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#D6E2EF] shadow-sm"
                    />
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      uni.type === 'Pública' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {uni.type}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0A1F33] text-base group-hover:text-[#008F7A] transition-colors font-display">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {uni.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>{uni.cities?.length || 1} Sedes</span>
                  <span className="text-[#087360] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    Ver carreras <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================
            PRINCIPIO RECTOR: DATOS Y DECISIONES (Brandbook V4.1)
           ========================================================= */}
        <section className="bg-white rounded-2xl p-8 sm:p-12 border border-[#D6E2EF] shadow-card">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087360] font-display">
              Transparencia y Criterio Informativo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F33] font-display">
              Los datos son el medio; las mejores decisiones son el resultado.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              DATACAMPUS forma parte del ecosistema DATABRAND, diseñando herramientas objetivas para que postulantes y familias elijan con información verificable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-xl bg-[#F2F6FB] border border-[#D6E2EF]">
              <div className="w-12 h-12 rounded-xl bg-white text-[#008F7A] shadow-sm flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F33] font-display">Comparador Homogéneo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compará hasta 4 carreras lado a lado con campos consistentes: aranceles, duración oficial, modalidad y mallas curriculares, sin datos arbitrarios.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-[#F2F6FB] border border-[#D6E2EF]">
              <div className="w-12 h-12 rounded-xl bg-white text-[#008F7A] shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F33] font-display">Mallas y Acreditaciones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acceso a los programas oficiales por semestre y verificación de acreditación ANEAES y habilitación CONES de cada institución.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-[#F2F6FB] border border-[#D6E2EF]">
              <div className="w-12 h-12 rounded-xl bg-white text-[#008F7A] shadow-sm flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F33] font-display">Orientación Vocacional</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descubrí áreas de estudio acordes a tus intereses mediante una evaluación orientadora con lenguaje humano y sin falsas promesas.
              </p>
            </div>
          </div>
        </section>

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
