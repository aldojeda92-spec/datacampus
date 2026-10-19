import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, Building2, BookOpen, ArrowRight, X, Sparkles } from 'lucide-react';
import { getCareers, getUniversities } from '../../services/dataService';

export default function PredictiveSearch({ placeholder = "Busca carreras (ej: Medicina, Informática, Derecho), universidades o ciudades...", className = "" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allCareers, setAllCareers] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [results, setResults] = useState({ careers: [], universities: [], areas: [] });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [careers, unis] = await Promise.all([getCareers(), getUniversities()]);
      setAllCareers(careers);
      setAllUniversities(unis);
    };
    load();
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter dynamically
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 1) {
      setResults({ careers: [], universities: [], areas: [] });
      return;
    }

    const filteredCareers = allCareers.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.universityName.toLowerCase().includes(term) ||
      c.area.toLowerCase().includes(term) ||
      (c.cities && c.cities.some(ci => ci.toLowerCase().includes(term)))
    ).slice(0, 5);

    const filteredUnis = allUniversities.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.shortName.toLowerCase().includes(term) ||
      (u.cities && u.cities.some(ci => ci.toLowerCase().includes(term)))
    ).slice(0, 3);

    // Unique matching areas
    const areasFound = Array.from(new Set(
      allCareers
        .filter(c => c.area.toLowerCase().includes(term))
        .map(c => c.area)
    )).slice(0, 3);

    setResults({
      careers: filteredCareers,
      universities: filteredUnis,
      areas: areasFound
    });
    setIsOpen(true);
  }, [searchTerm, allCareers, allUniversities]);

  const handleSelectCareer = (careerId) => {
    setIsOpen(false);
    navigate(`/carrera/${careerId}`);
  };

  const handleSelectUniversity = (uniId) => {
    setIsOpen(false);
    navigate(`/carreras?universidad=${uniId}`);
  };

  const handleSelectArea = (areaName) => {
    setIsOpen(false);
    navigate(`/carreras?area=${encodeURIComponent(areaName)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsOpen(false);
    navigate(`/carreras?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const hasResults = results.careers.length > 0 || results.universities.length > 0 || results.areas.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-campus-500" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 sm:pl-14 pr-24 sm:pr-32 py-4 sm:py-4.5 bg-white text-slate-800 placeholder-slate-400 font-medium rounded-2xl border-2 border-slate-200 focus:border-campus-500 focus:outline-none shadow-card hover:border-slate-300 transition-all text-sm sm:text-base"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-20 sm:right-28 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-campus-600 hover:bg-campus-700 active:scale-95 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center gap-1.5"
        >
          <span>Buscar</span>
          <ArrowRight className="w-4 h-4 hidden sm:inline" />
        </button>
      </form>

      {/* Autopredictive Dropdown results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {searchTerm.trim().length > 0 ? (
            hasResults ? (
              <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
                {/* Carreras results */}
                {results.careers.length > 0 && (
                  <div className="p-3">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-campus-500" />
                      Carreras Universitarias
                    </div>
                    {results.careers.map((career) => (
                      <button
                        key={career.id}
                        type="button"
                        onClick={() => handleSelectCareer(career.id)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-campus-50 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-campus-100 text-campus-700 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-campus-700 truncate">
                              {career.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {career.universityName} • {career.modality}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="text-xs font-semibold text-emerald-600">
                            {career.durationYears} años
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Universidades results */}
                {results.universities.length > 0 && (
                  <div className="p-3 bg-slate-50/50">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      Universidades
                    </div>
                    {results.universities.map((uni) => (
                      <button
                        key={uni.id}
                        type="button"
                        onClick={() => handleSelectUniversity(uni.id)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white flex items-center justify-between group transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={uni.logo}
                            alt={uni.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-campus-700">
                              {uni.name} ({uni.shortName})
                            </p>
                            <p className="text-xs text-slate-500">
                              {uni.type} • Sedes en {uni.cities?.slice(0, 3).join(', ')}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-campus-600 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Áreas de estudio */}
                {results.areas.length > 0 && (
                  <div className="p-3">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Áreas de Estudio
                    </div>
                    <div className="flex flex-wrap gap-2 px-3 py-1">
                      {results.areas.map(area => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => handleSelectArea(area)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-campus-100 text-slate-700 hover:text-campus-800 text-xs font-medium transition-colors"
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer view all */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-campus-600 hover:text-campus-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    Ver todos los resultados para "{searchTerm}"
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  No encontramos resultados directos para "{searchTerm}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Intenta buscar por "Medicina", "Informática", "Derecho" o el nombre de una universidad.
                </p>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="mt-3 px-4 py-2 bg-campus-50 text-campus-700 text-xs font-bold rounded-lg hover:bg-campus-100 transition-colors"
                >
                  Buscar "{searchTerm}" en todo el catálogo
                </button>
              </div>
            )
          ) : (
            // Suggestions when input is focused but empty
            <div className="p-5">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Búsquedas Frecuentes
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Medicina', 'Ingeniería Informática', 'Derecho', 'Administración', 'Arquitectura', 'Psicología', 'Odontología'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchTerm(tag);
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-campus-100 text-slate-700 hover:text-campus-800 text-xs font-semibold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>¿No tienes claro tu camino?</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/test-vocacional');
                  }}
                  className="font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1"
                >
                  Haz el Test Vocacional ✨
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
