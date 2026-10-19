import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Compass, 
  Scale, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Users, 
  Flame,
  Award,
  ChevronRight
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
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-campus-900 via-campus-800 to-slate-900 text-white pt-16 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* Abstract background graphics */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-32 left-10 w-96 h-96 rounded-full bg-campus-400 blur-3xl" />
          <div className="absolute top-40 right-10 w-80 h-80 rounded-full bg-accent-500 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-campus-200 border border-white/10 text-xs sm:text-sm font-semibold backdrop-blur-sm shadow-sm animate-pulse-subtle">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>El comparador y buscador universitario líder en Paraguay</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Elige tu carrera y universidad con <span className="bg-gradient-to-r from-campus-300 via-campus-200 to-accent-300 bg-clip-text text-transparent">datos reales</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Compara costos, mallas curriculares, sedes y acreditaciones oficiales ANEAES de las principales universidades del país en un solo lugar.
          </p>

          {/* Autopredictive Search Bar */}
          <div className="pt-4 max-w-3xl mx-auto">
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
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">+500</div>
            <div className="text-xs sm:text-sm text-campus-200 font-medium">Carreras y Mallas</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">100%</div>
            <div className="text-xs sm:text-sm text-campus-200 font-medium">Gratuito para Estudiantes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">ANEAES</div>
            <div className="text-xs sm:text-sm text-campus-200 font-medium">Acreditaciones Oficiales</div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">4 Sedes</div>
            <div className="text-xs sm:text-sm text-campus-200 font-medium">Nacional y Virtual</div>
          </div>
        </div>

      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Banner Hero Sub */}
        <BannerItem position="home_hero_sub" />

        {/* Callout: No sabes qué estudiar? (Test Vocacional) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-700 via-purple-700 to-indigo-800 text-white p-8 sm:p-12 shadow-floating">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden lg:block">
            <Compass className="w-full h-full text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Orientación Vocacional Inteligente
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              ¿No sabes qué estudiar? Descubre tu vocación en 3 minutos
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Responde nuestro test interactivo de intereses y habilidades. Nuestro algoritmo analizará tu perfil y te recomendará las carreras que mejor se adaptan a tu futuro profesional.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/test-vocacional"
                className="px-6 py-3.5 rounded-2xl bg-white text-purple-900 hover:bg-slate-100 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Compass className="w-4 h-4 text-accent-600" />
                <span>Hacer el Test Vocacional Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/comparador"
                className="px-6 py-3.5 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 text-white border border-white/20 font-bold text-sm transition-all flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-amber-300" />
                <span>Ir al Comparador</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Carreras Destacadas */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-campus-600">
                <Flame className="w-4 h-4 text-amber-500" />
                Catálogo de Carreras
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Explora las Carreras más Demandadas
              </h2>
            </div>
            <Link
              to="/carreras"
              className="inline-flex items-center gap-2 text-sm font-bold text-campus-600 hover:text-campus-800 transition-colors"
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
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedArea === area
                    ? 'bg-campus-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-campus-500 text-slate-800 font-extrabold text-sm shadow-card hover:shadow-floating transition-all"
            >
              <span>Explorar todo el catálogo (+{careers.length} carreras)</span>
              <ArrowRight className="w-4 h-4 text-campus-600" />
            </Link>
          </div>
        </section>

        {/* Banner Middle */}
        <BannerItem position="home_middle" />

        {/* Directorio de Universidades */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Building2 className="w-4 h-4 text-emerald-500" />
                Instituciones de Educación Superior
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Universidades en Convenio
              </h2>
            </div>
            <Link
              to="/universidades"
              className="inline-flex items-center gap-2 text-sm font-bold text-campus-600 hover:text-campus-800 transition-colors"
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
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-floating transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      uni.type === 'Pública' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {uni.type}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-campus-600 transition-colors">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {uni.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>{uni.cities?.length || 1} Sedes</span>
                  <span className="text-campus-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ver carreras <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Feature comparison highlights */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ¿Por qué los postulantes eligen DATACAMPUS?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              La decisión de tu carrera define tu futuro laboral y económico. Te damos las herramientas necesarias para elegir con certeza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-campus-100 text-campus-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Comparador Inteligente</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compara hasta 4 carreras lado a lado. Nuestro algoritmo te sugiere la mejor opción según si priorizas costos, rapidez, horarios o acreditación.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Mallas y Acreditaciones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifica las materias exactas que cursarás semestre a semestre y comprueba si el título está avalado por la ANEAES y habilitado por el CONES.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Test Vocacional Integrado</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descubre tus fortalezas y afinidades vocacionales con preguntas diseñadas por psicopedagogos que mapean directamente a carreras reales.
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
