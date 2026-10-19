import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Phone, 
  Mail, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight, 
  Users, 
  Calendar 
} from 'lucide-react';
import { getUniversities, getCareers } from '../services/dataService';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [careers, setCareers] = useState([]);
  const [filterType, setFilterType] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [uData, cData] = await Promise.all([getUniversities(), getCareers()]);
      setUniversities(uData);
      setCareers(cData);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = universities.filter(u => {
    if (filterType !== 'Todas' && u.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesName = u.name.toLowerCase().includes(q) || u.shortName.toLowerCase().includes(q);
      const matchesCity = u.cities?.some(c => c.toLowerCase().includes(q));
      if (!matchesName && !matchesCity) return false;
    }
    return true;
  });

  const getCareerCount = (uniId) => {
    return careers.filter(c => c.universityId === uniId).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Directorio Oficial de Educación Superior
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Universidades de Paraguay
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Conoce las sedes, acreditaciones oficiales, historia y oferta académica de cada casa de estudios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/portal-universidades"
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Portal Universidades (Login)</span>
              </Link>

              {['Todas', 'Pública', 'Privada'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    filterType === type
                      ? 'bg-campus-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'Todas' ? 'Todas' : `${type}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick search inside universities */}
          <div>
            <input
              type="text"
              placeholder="Buscar por nombre de universidad o ciudad (ej. UCA, UNA, Asunción, CDE)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Universities List Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-campus-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-600">Cargando instituciones...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map(uni => {
              const careerCount = getCareerCount(uni.id);
              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-card hover:shadow-floating transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover photo banner */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                      <img
                        src={uni.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'}
                        alt={uni.name}
                        className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 right-4">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md ${
                          uni.type === 'Pública' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-purple-600 text-white'
                        }`}>
                          {uni.type}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-white p-0.5 border-2 border-white shadow-md shrink-0"
                        />
                        <div className="text-white min-w-0">
                          <h3 className="font-extrabold text-lg leading-tight truncate">
                            {uni.name}
                          </h3>
                          <p className="text-xs text-slate-200 font-medium">
                            {uni.shortName} • Fundada en {uni.foundationYear || '1990'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {uni.description}
                      </p>

                      {/* Accreditation */}
                      {uni.accreditationStatus && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{uni.accreditationStatus}</span>
                        </div>
                      )}

                      {/* Sedes chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Sedes Disponibles
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {uni.cities?.map(city => (
                            <span key={city} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 font-medium">
                      <strong className="text-slate-900">{careerCount}</strong> carreras catalogadas
                    </div>

                    <div className="flex items-center gap-2">
                      {uni.website && (
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-slate-500 hover:text-campus-600 hover:bg-slate-100 transition-colors"
                          title="Sitio web oficial"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <Link
                        to={`/carreras?universidad=${uni.id}`}
                        className="px-4 py-2 bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Ver Carreras</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500">No se encontraron universidades con ese filtro.</p>
          </div>
        )}

      </div>
    </div>
  );
}
