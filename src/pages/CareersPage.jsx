import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  DollarSign, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import CareerCard from '../components/careers/CareerCard';
import LeadModal from '../components/careers/LeadModal';
import BannerItem from '../components/common/BannerItem';
import { getCareers, getUniversities } from '../services/dataService';

export default function CareersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [careers, setCareers] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadModalCareer, setLeadModalCareer] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters state initialized from URL search params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedUniversity, setSelectedUniversity] = useState(searchParams.get('universidad') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [selectedModality, setSelectedModality] = useState(searchParams.get('modalidad') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('ciudad') || '');
  const [onlyAccredited, setOnlyAccredited] = useState(false);
  const [maxTuition, setMaxTuition] = useState(3000000);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [cData, uData] = await Promise.all([getCareers(), getUniversities()]);
      setCareers(cData);
      setUniversities(uData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Sync state if URL query params change
  useEffect(() => {
    const q = searchParams.get('q');
    const u = searchParams.get('universidad');
    const a = searchParams.get('area');
    const m = searchParams.get('modalidad');
    const c = searchParams.get('ciudad');

    if (q !== null) setSearchTerm(q);
    if (u !== null) setSelectedUniversity(u);
    if (a !== null) setSelectedArea(a);
    if (m !== null) setSelectedModality(m);
    if (c !== null) setSelectedCity(c);
  }, [searchParams]);

  // Unique lists for filter dropdowns
  const areasList = useMemo(() => {
    return Array.from(new Set(careers.map(c => c.area).filter(Boolean)));
  }, [careers]);

  const citiesList = useMemo(() => {
    const set = new Set();
    careers.forEach(c => {
      if (c.cities) c.cities.forEach(city => set.add(city));
    });
    return Array.from(set);
  }, [careers]);

  // Filtered and Sorted careers
  const filteredCareers = useMemo(() => {
    return careers.filter(c => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesUni = c.universityName?.toLowerCase().includes(q);
        const matchesArea = c.area?.toLowerCase().includes(q);
        const matchesCity = c.cities && c.cities.some(city => city.toLowerCase().includes(q));
        if (!matchesName && !matchesUni && !matchesArea && !matchesCity) return false;
      }

      // University
      if (selectedUniversity && c.universityId !== selectedUniversity) {
        return false;
      }

      // Area
      if (selectedArea && c.area !== selectedArea) {
        return false;
      }

      // Modality
      if (selectedModality && c.modality !== selectedModality) {
        return false;
      }

      // City
      if (selectedCity && (!c.cities || !c.cities.includes(selectedCity))) {
        return false;
      }

      // Accredited
      if (onlyAccredited && !c.isAccredited) {
        return false;
      }

      // Max Tuition
      if (c.monthlyTuition > maxTuition) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.monthlyTuition || 0) - (b.monthlyTuition || 0);
      if (sortBy === 'price_desc') return (b.monthlyTuition || 0) - (a.monthlyTuition || 0);
      if (sortBy === 'duration_asc') return a.durationYears - b.durationYears;
      if (sortBy === 'duration_desc') return b.durationYears - a.durationYears;
      if (sortBy === 'rating') return (b.scoreRating || 0) - (a.scoreRating || 0);
      return 0; // relevance
    });
  }, [careers, searchTerm, selectedUniversity, selectedArea, selectedModality, selectedCity, onlyAccredited, maxTuition, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedUniversity('');
    setSelectedArea('');
    setSelectedModality('');
    setSelectedCity('');
    setOnlyAccredited(false);
    setMaxTuition(3000000);
    setSortBy('relevance');
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchTerm,
    selectedUniversity,
    selectedArea,
    selectedModality,
    selectedCity,
    onlyAccredited
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Predictive Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-campus-50 text-campus-700 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-campus-600" />
                Catálogo Nacional de Educación Superior
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Buscador de Carreras Universitarias
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Filtra por universidad, modalidad, costos y sedes en Paraguay.
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-campus-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros ({activeFiltersCount})</span>
              </button>
            </div>
          </div>

          {/* Autopredictive input in catalog */}
          <div className="relative">
            <Search className="w-5 h-5 text-campus-500 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca por nombre de carrera, palabras clave, universidad o ciudad..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-campus-500 focus:outline-none text-slate-800 text-sm font-medium shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-campus-600" />
                Filtros Avanzados
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-campus-600 hover:text-campus-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Universidad */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Universidad
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-campus-500 focus:outline-none bg-slate-50"
              >
                <option value="">Todas las universidades</option>
                {universities.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.shortName})</option>
                ))}
              </select>
            </div>

            {/* Área de Estudio */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Área de Conocimiento
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-campus-500 focus:outline-none bg-slate-50"
              >
                <option value="">Todas las áreas</option>
                {areasList.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Modalidad de Cursado
              </label>
              <div className="space-y-1.5">
                {['', 'Presencial', 'Híbrida', 'Virtual / Online'].map(mod => (
                  <label
                    key={mod || 'all'}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      selectedModality === mod
                        ? 'bg-campus-50 text-campus-700 font-bold border border-campus-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="modality"
                      checked={selectedModality === mod}
                      onChange={() => setSelectedModality(mod)}
                      className="sr-only"
                    />
                    <span>{mod || 'Todas las modalidades'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ciudad / Departamento */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Ciudad / Sede
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-campus-500 focus:outline-none bg-slate-50"
              >
                <option value="">Todas las ciudades</option>
                {citiesList.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Acreditación ANEAES Switch */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAccredited}
                  onChange={(e) => setOnlyAccredited(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Solo Acreditadas ANEAES
                  </span>
                  <span className="text-[10px] text-emerald-700">Garantía oficial de calidad</span>
                </div>
              </label>
            </div>

            {/* Rango de Cuota Mensual */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500">Cuota Máx. Estimada</span>
                <span className="font-extrabold text-campus-700">Gs. {maxTuition.toLocaleString('es-PY')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000000"
                step="100000"
                value={maxTuition}
                onChange={(e) => setMaxTuition(Number(e.target.value))}
                className="w-full accent-campus-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Gratis (Arancel Cero)</span>
                <span>Gs. 3.000.000+</span>
              </div>
            </div>

            {/* Sidebar Promo */}
            <div className="pt-2">
              <BannerItem position="catalog_sidebar" />
            </div>

          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Results bar & Sorting */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Mostrando <strong className="text-slate-900 font-extrabold">{filteredCareers.length}</strong> carreras encontradas
                {selectedArea && ` en "${selectedArea}"`}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-campus-500 bg-white"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price_asc">Menor Cuota Mensual</option>
                  <option value="price_desc">Mayor Cuota Mensual</option>
                  <option value="duration_asc">Menor Duración (Años)</option>
                  <option value="duration_desc">Mayor Duración (Años)</option>
                  <option value="rating">Mejor Calificación</option>
                </select>
              </div>
            </div>

            {/* Careers Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-campus-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-600">Cargando catálogo universitario...</p>
              </div>
            ) : filteredCareers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCareers.map(career => (
                  <CareerCard
                    key={career.id}
                    career={career}
                    onOpenLeadModal={(c) => setLeadModalCareer(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No se encontraron carreras con esos criterios
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Intenta relajar los filtros de precio, modalidad o cambiar el término de búsqueda.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-campus-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-campus-700 transition-colors"
                >
                  Restablecer Todos los Filtros
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Filtros de Búsqueda</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* University */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Universidad</label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              >
                <option value="">Todas</option>
                {universities.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Área</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
              >
                <option value="">Todas</option>
                {areasList.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Modalidad</label>
              <div className="grid grid-cols-2 gap-2">
                {['', 'Presencial', 'Híbrida', 'Virtual / Online'].map(mod => (
                  <button
                    key={mod || 'all'}
                    type="button"
                    onClick={() => setSelectedModality(mod)}
                    className={`p-2 rounded-xl text-xs font-bold border ${
                      selectedModality === mod
                        ? 'border-campus-500 bg-campus-50 text-campus-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {mod || 'Todas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs uppercase text-slate-700"
              >
                Limpiar
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-xl bg-campus-600 text-white font-bold text-xs uppercase"
              >
                Ver Resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Modal */}
      <LeadModal
        career={leadModalCareer}
        isOpen={!!leadModalCareer}
        onClose={() => setLeadModalCareer(null)}
      />

    </div>
  );
}
