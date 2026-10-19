import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Scale, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles,
  FileText,
  Briefcase,
  Layers,
  Award,
  Check,
  Phone
} from 'lucide-react';
import LeadModal from '../components/careers/LeadModal';
import { getCareerById, getCareers } from '../services/dataService';
import { useCompare } from '../context/CompareContext';

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [relatedCareers, setRelatedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('malla'); // 'malla', 'perfil', 'campo', 'sedes', 'admision'

  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getCareerById(id);
      if (data) {
        setCareer(data);
        const all = await getCareers();
        const related = all.filter(c => c.id !== data.id && (c.area === data.area || c.universityId === data.universityId)).slice(0, 3);
        setRelatedCareers(related);
      }
      setLoading(false);
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-campus-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Cargando ficha oficial de la carrera...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-black text-slate-800">Carrera no encontrada</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">La carrera solicitada no existe o fue modificada.</p>
        <Link to="/carreras" className="px-6 py-3 bg-campus-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider">
          Volver al buscador
        </Link>
      </div>
    );
  }

  const compared = isInCompare(career.id);

  const handleCompareToggle = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto">
          <Link to="/" className="hover:text-campus-600 flex items-center gap-1">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/carreras" className="hover:text-campus-600">Carreras</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{career.area}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold truncate">{career.name}</span>
        </div>
      </div>

      {/* Hero Header Ficha */}
      <section className="bg-gradient-to-r from-campus-950 via-campus-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-3xl">
            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-campus-500/30 text-campus-200 border border-campus-400/20">
                {career.area}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                {career.modality}
              </span>
              {career.isAccredited && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {career.accreditation || 'Acreditada por ANEAES'}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {career.name}
            </h1>

            {/* University info */}
            <div className="flex items-center gap-3 pt-1">
              <img
                src={career.universityLogo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100'}
                alt={career.universityName}
                className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-white"
              />
              <div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {career.universityName}
                </p>
                <p className="text-xs text-slate-300">
                  Título oficial: <strong className="text-campus-200">{career.degree || career.name}</strong>
                </p>
              </div>
            </div>

          </div>

          {/* Quick Actions Card Desktop */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 lg:w-80 shrink-0 space-y-4">
            <div>
              <p className="text-xs uppercase font-bold text-slate-300">Cuota Mensual Estimada</p>
              <p className="text-2xl font-black text-white">{formatCurrency(career.monthlyTuition)}</p>
              {career.enrollmentFee !== undefined && (
                <p className="text-xs text-campus-200 mt-0.5">
                  Matrícula: {career.enrollmentFee === 0 ? 'Gratuita' : `Gs. ${career.enrollmentFee.toLocaleString('es-PY')}`}
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setLeadModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-campus-500 hover:bg-campus-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Información</span>
              </button>

              <button
                type="button"
                onClick={handleCompareToggle}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  compared
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {compared ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>En el comparador</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Comparar carrera</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-campus-600 text-xs font-bold uppercase">
              <Clock className="w-4 h-4" />
              <span>Duración</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">{career.durationYears} Años</p>
            <p className="text-xs text-slate-500">{career.durationSemesters || career.durationYears * 2} Semestres académicos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Modalidad</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">{career.modality}</p>
            <p className="text-xs text-slate-500">{career.shifts?.join(', ') || 'Turnos Mañana / Tarde / Noche'}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>Carga Horaria</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">{career.totalHours || '3.800+ Horas'}</p>
            <p className="text-xs text-slate-500">Malla curricular aprobada</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase">
              <MapPin className="w-4 h-4" />
              <span>Sedes Disponibles</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">{career.cities?.length || 1} Ciudades</p>
            <p className="text-xs text-slate-500 truncate">{career.cities?.join(', ') || 'Asunción'}</p>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
            {[
              { id: 'malla', label: 'Malla Curricular', icon: BookOpen },
              { id: 'perfil', label: 'Perfil del Egresado', icon: Award },
              { id: 'campo', label: 'Campo Laboral', icon: Briefcase },
              { id: 'sedes', label: 'Sedes y Turnos', icon: MapPin },
              { id: 'admision', label: 'Requisitos de Admisión', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-campus-600 text-campus-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-10">
            
            {/* TAB: Malla Curricular */}
            {activeTab === 'malla' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Estructura Curricular y Plan de Estudios
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Conoce las asignaturas organizadas por período académico y áreas formativas.
                  </p>
                </div>

                {career.curriculum && career.curriculum.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {career.curriculum.map((periodObj, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-sm text-campus-900">
                            {periodObj.period}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-campus-100 text-campus-800">
                            {periodObj.subjects?.length || 0} materias
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {periodObj.subjects?.map((sub, sIdx) => (
                            <li key={sIdx} className="text-xs font-medium text-slate-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-campus-500 mt-1.5 shrink-0" />
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-2xl text-center text-sm text-slate-500">
                    Malla curricular en proceso de digitalización para este período. Solicita el programa oficial completo a admisiones.
                  </div>
                )}
              </div>
            )}

            {/* TAB: Perfil del Egresado */}
            {activeTab === 'perfil' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Perfil Profesional y Competencias
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Habilidades y competencias clave con las que egresarás al culminar la carrera.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-campus-50/60 border border-campus-100 leading-relaxed text-sm text-slate-700 font-medium space-y-4">
                  <p>{career.profile || 'El egresado cuenta con sólida formación técnica, ética y humanista, preparado para responder a las exigencias del mercado nacional e internacional.'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                    <h4 className="font-bold text-xs uppercase text-slate-900">Rigor Académico</h4>
                    <p className="text-xs text-slate-500 mt-1">Enfoque práctico adaptado a las tendencias vigentes del sector.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-campus-500 mb-2" />
                    <h4 className="font-bold text-xs uppercase text-slate-900">Ética Profesional</h4>
                    <p className="text-xs text-slate-500 mt-1">Compromiso con el desarrollo sostenible y la responsabilidad comunitaria.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mb-2" />
                    <h4 className="font-bold text-xs uppercase text-slate-900">Visión Global</h4>
                    <p className="text-xs text-slate-500 mt-1">Capacidad para trabajar en entornos multiculturales y multidisciplinarios.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Campo Laboral */}
            {activeTab === 'campo' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Salidas Profesionales e Inserción Laboral
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Ámbitos donde podrás desempeñarte como profesional titulado.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Mercado y Oportunidades</h4>
                      <p className="text-xs text-slate-500">Sectores públicos, privados e independientes</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {career.jobField || 'Empresas multinacionales, organismos del Estado, consultoría privada, docencia universitaria y desarrollo de emprendimientos independientes.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Sedes y Turnos */}
            {activeTab === 'sedes' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Sedes Físicas y Modalidades Horarias
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Ubicaciones donde se imparte la carrera y flexibilidad de turnos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {career.sedes && career.sedes.length > 0 ? (
                    career.sedes.map((sede, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-campus-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{sede}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Clases y prácticas laboratoriales</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    career.cities?.map((city, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-campus-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Sede {city}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Campus habilitado para esta carrera</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Turnos Disponibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {career.shifts?.map((shift, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-campus-50 text-campus-700 text-xs font-bold border border-campus-200">
                        {shift}
                      </span>
                    )) || <span className="text-xs text-slate-500">Mañana, Tarde y Noche</span>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Admisión */}
            {activeTab === 'admision' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Proceso y Requisitos de Admisión
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Documentos necesarios y cursos probatorios requeridos para la matrícula.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {career.admissionRequirements || 'Certificado de estudios secundarios legalizado por el MEC, fotocopia autenticada de cédula de identidad civil y aprobación del curso probatorio o examen de ingreso según corresponda.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>¿Tienes dudas sobre los aranceles o convalidaciones? Solicita asesoría personalizada con un orientador.</span>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Card CTA */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold">¿Te interesa estudiar {career.name}?</h4>
              <p className="text-xs text-slate-300">Recibe aranceles oficiales 2026, folletos y requisitos de admisión directamente.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setLeadModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-campus-500 hover:bg-campus-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Información</span>
              </button>
            </div>
          </div>

        </div>

        {/* Related Careers */}
        {relatedCareers.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">
              Otras Carreras Relacionadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCareers.map(rel => (
                <Link
                  key={rel.id}
                  to={`/carrera/${rel.id}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-card transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <img src={rel.universityLogo} alt="" className="w-6 h-6 rounded-md object-cover" />
                      <span className="text-[11px] font-bold text-slate-500 truncate">{rel.universityName}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-campus-600 transition-colors text-sm">
                      {rel.name}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{rel.durationYears} años • {rel.modality}</span>
                    <span className="text-campus-600 font-bold flex items-center gap-1">Ver <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Student Lead Modal */}
      <LeadModal
        career={career}
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
      />

    </div>
  );
}
