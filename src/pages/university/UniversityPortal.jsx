import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Phone, 
  Mail, 
  ExternalLink, 
  LogOut, 
  Save, 
  X, 
  Check, 
  Sparkles,
  MapPin,
  MessageCircle,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getUniversities, 
  saveUniversity, 
  getCareers, 
  saveCareer, 
  deleteCareer, 
  getLeads, 
  updateLeadStatus 
} from '../../services/dataService';

export default function UniversityPortal() {
  const { currentUser, login, logout, isUniversity, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('carreras'); // 'carreras', 'perfil', 'leads'
  
  // Login form state (if not logged in)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data states
  const [university, setUniversity] = useState(null);
  const [myCareers, setMyCareers] = useState([]);
  const [myLeads, setMyLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Career Modal Editor
  const [editingCareer, setEditingCareer] = useState(null);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  // University Profile Editor
  const [editingProfile, setEditingProfile] = useState(null);

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Determine which university ID this user belongs to
  const userUniId = currentUser?.universityId;

  useEffect(() => {
    if (currentUser && (isUniversity || isAdmin)) {
      loadUniversityData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isUniversity, isAdmin]);

  const loadUniversityData = async () => {
    setLoading(true);
    const [allUnis, allCareers, allLeads] = await Promise.all([
      getUniversities(),
      getCareers(),
      getLeads()
    ]);

    // Match university: either user's universityId or the first one if an admin is inspecting
    const targetUniId = userUniId || allUnis[0]?.id;
    const uni = allUnis.find(u => u.id === targetUniId);
    
    if (uni) {
      setUniversity(uni);
      setEditingProfile({
        ...uni,
        citiesStr: uni.cities?.join(', ') || ''
      });
      setMyCareers(allCareers.filter(c => c.universityId === uni.id));
      setMyLeads(allLeads.filter(l => l.universityId === uni.id || l.universityName?.toLowerCase().includes(uni.shortName?.toLowerCase())));
    }
    setLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const res = await login(loginEmail, loginPassword);
    setLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Credenciales inválidas');
    }
  };


  /* =========================================================
     CAREER CRUD (RESTRICTED TO THIS UNIVERSITY)
  ========================================================= */
  const handleOpenCareerModal = (career = null) => {
    if (career) {
      setEditingCareer({
        ...career,
        citiesStr: career.cities?.join(', ') || '',
        curriculumStr: career.curriculum ? JSON.stringify(career.curriculum, null, 2) : ''
      });
    } else {
      setEditingCareer({
        name: '',
        universityId: university.id,
        universityName: university.name,
        universityLogo: university.logo,
        area: 'Tecnología e Informática',
        modality: 'Presencial',
        durationYears: 5,
        durationSemesters: 10,
        monthlyTuition: 1200000,
        enrollmentFee: 600000,
        degree: '',
        totalHours: '4.000 horas',
        citiesStr: university.cities?.join(', ') || 'Asunción',
        isAccredited: true,
        accreditation: 'Acreditada por ANEAES',
        shortDescription: '',
        profile: '',
        jobField: '',
        admissionRequirements: '',
        curriculum: [
          { period: "1° Semestre", subjects: ["Introducción a la Especialidad", "Fundamentos Teóricos", "Metodología", "Matemática"] },
          { period: "2° Semestre", subjects: ["Taller Aplicado I", "Estadística Básica", "Ética Profesional", "Práctica de Laboratorio"] }
        ]
      });
    }
    setIsCareerModalOpen(true);
  };

  const handleSaveCareer = async (e) => {
    e.preventDefault();
    try {
      const parsedCities = (editingCareer.citiesStr || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      let parsedCurriculum = editingCareer.curriculum;
      if (editingCareer.curriculumStr) {
        try {
          parsedCurriculum = JSON.parse(editingCareer.curriculumStr);
        } catch {
          // keep existing
        }
      }

      const payload = {
        ...editingCareer,
        universityId: university.id, // Strictly locked to this university
        universityName: university.name,
        universityLogo: university.logo,
        cities: parsedCities,
        curriculum: parsedCurriculum,
        durationYears: Number(editingCareer.durationYears),
        durationSemesters: Number(editingCareer.durationSemesters),
        monthlyTuition: Number(editingCareer.monthlyTuition),
        enrollmentFee: Number(editingCareer.enrollmentFee)
      };

      delete payload.citiesStr;
      delete payload.curriculumStr;

      await saveCareer(payload);
      showNotify(`Carrera "${payload.name}" actualizada con éxito.`);
      setIsCareerModalOpen(false);
      loadUniversityData();
    } catch (err) {
      showNotify(`Error al guardar: ${err.message}`, 'error');
    }
  };

  const handleDeleteCareer = async (careerId, careerName) => {
    if (window.confirm(`¿Estás seguro de eliminar la carrera "${careerName}" de ${university.shortName}?`)) {
      await deleteCareer(careerId);
      showNotify(`Carrera eliminada.`);
      loadUniversityData();
    }
  };

  /* =========================================================
     SAVE UNIVERSITY PROFILE
  ========================================================= */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const parsedCities = (editingProfile.citiesStr || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        ...editingProfile,
        cities: parsedCities
      };
      delete payload.citiesStr;

      await saveUniversity(payload);
      setUniversity(payload);
      showNotify(`Perfil institucional actualizado con éxito.`);
    } catch (err) {
      showNotify(`Error: ${err.message}`, 'error');
    }
  };

  /* =========================================================
     RENDER: LOGIN SCREEN IF NOT AUTHENTICATED AS UNIVERSITY
  ========================================================= */
  if (!currentUser || (!isUniversity && !isAdmin)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-card">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Portal de Universidades
            </h1>
            <p className="text-xs text-slate-500">
              Acceso exclusivo para encargados de facultades y universidades en convenio
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admision@universidad.edu.py"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loggingIn ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar al Portal Institucional</span>
                </>
              )}
            </button>
          </form>

          {/* Informational Footer */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              ¿Tu facultad aún no tiene usuario asignado? Solicita tus credenciales al administrador de DATACAMPUS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER: UNIVERSITY DASHBOARD (RESTRICTED TO USER'S UNI)
  ========================================================= */
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
      
      {/* Toast */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-floating text-xs font-bold bg-emerald-600 text-white flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">PORTAL UNIVERSITARIO</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase">
                  {university?.shortName || 'Universidad'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.displayName} ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/carreras?universidad=${university?.id}`}
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <span>Ver en la Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-red-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* University Info Card */}
        {university && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={university.logo}
                alt={university.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-white p-1 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {university.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {university.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {university.headquarters} • Sedes en: {university.cities?.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-2xl font-black text-slate-900 block">{myCareers.length}</span>
                <span className="text-xs text-slate-500 font-semibold">Carreras Publicadas</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'carreras', label: `Mis Carreras (${myCareers.length})`, icon: GraduationCap },
            { id: 'leads', label: `Prospectos Recibidos (${myLeads.length})`, icon: Users },
            { id: 'perfil', label: 'Ficha de la Universidad', icon: Building2 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MIS CARRERAS */}
        {activeTab === 'carreras' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Carreras de {university?.shortName}
                </h2>
                <p className="text-xs text-slate-500">
                  Mantén actualizados los aranceles, mallas curriculares y sedes habilitadas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCareerModal()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Carrera para {university?.shortName}</span>
              </button>
            </div>

            {/* Careers Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Carrera</th>
                    <th className="p-4">Área</th>
                    <th className="p-4">Modalidad</th>
                    <th className="p-4">Duración</th>
                    <th className="p-4">Cuota Mensual</th>
                    <th className="p-4">Acreditada</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myCareers.map(career => (
                    <tr key={career.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{career.name}</td>
                      <td className="p-4 text-slate-600">{career.area}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                          {career.modality}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">{career.durationYears} años</td>
                      <td className="p-4 font-bold text-slate-800">
                        {career.monthlyTuition === 0 ? 'Gratuidad' : `Gs. ${career.monthlyTuition?.toLocaleString('es-PY')}`}
                      </td>
                      <td className="p-4">
                        {career.isAccredited ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> ANEAES
                          </span>
                        ) : (
                          <span className="text-slate-400">CONES</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenCareerModal(career)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Editar carrera y malla"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCareer(career.id, career.name)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar carrera"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROSPECTOS EXCLUSIVOS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Prospectos de Estudiantes para {university?.shortName}
              </h2>
              <p className="text-xs text-slate-500">
                Estudiantes interesados que solicitaron información oficial para tus carreras.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Colegio / Año</th>
                    <th className="p-4">Carrera Solicitada</th>
                    <th className="p-4">Turno</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Contactar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myLeads.map(lead => {
                    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{lead.fullName}</p>
                          <p className="text-[11px] text-slate-400">{lead.city || 'No indicada'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-slate-800">{lead.phone}</p>
                          <p className="text-[11px] text-slate-500">{lead.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{lead.highSchool}</p>
                          <p className="text-[11px] text-slate-400">Egreso: {lead.graduationYear}</p>
                        </td>
                        <td className="p-4 font-bold text-emerald-700">{lead.careerName}</td>
                        <td className="p-4">{lead.preferredShift}</td>
                        <td className="p-4">
                          <select
                            value={lead.status || 'Nuevo'}
                            onChange={async (e) => {
                              await updateLeadStatus(lead.id, e.target.value);
                              loadUniversityData();
                            }}
                            className="p-1 rounded-lg text-xs font-bold border border-slate-200"
                          >
                            <option value="Nuevo">Nuevo</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Inscrito">Inscrito</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(lead.fullName)}!%20Te%20saludamos%20desde%20el%20departamento%20de%20admisiones%20de%20${encodeURIComponent(university.name)}%20respecto%20a%20tu%20interes%20en%20la%20carrera%20${encodeURIComponent(lead.careerName)}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PERFIL DE LA UNIVERSIDAD */}
        {activeTab === 'perfil' && editingProfile && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Información de {university.name}
              </h2>
              <p className="text-xs text-slate-500">
                Esta información es pública y se muestra en la ficha de la universidad y en el catálogo.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo de la Institución</label>
                <input
                  type="text"
                  required
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp de Admisión</label>
                  <input
                    type="text"
                    value={editingProfile.phone}
                    onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    value={editingProfile.email}
                    onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sitio Web Oficial</label>
                <input
                  type="url"
                  value={editingProfile.website}
                  onChange={(e) => setEditingProfile({ ...editingProfile, website: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sedes y Ciudades (separadas por comas)</label>
                <input
                  type="text"
                  value={editingProfile.citiesStr}
                  onChange={(e) => setEditingProfile({ ...editingProfile, citiesStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción Institucional</label>
                <textarea
                  rows={4}
                  value={editingProfile.description}
                  onChange={(e) => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios Institucionales</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* MODAL: EDITAR / CREAR CARRERA */}
      {isCareerModalOpen && editingCareer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingCareer.id ? 'Editar Carrera' : 'Nueva Carrera'} ({university.shortName})
              </h3>
              <button onClick={() => setIsCareerModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCareer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre de la Carrera *</label>
                  <input
                    type="text"
                    required
                    value={editingCareer.name}
                    onChange={(e) => setEditingCareer({ ...editingCareer, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Área de Estudio</label>
                  <select
                    value={editingCareer.area}
                    onChange={(e) => setEditingCareer({ ...editingCareer, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Tecnología e Informática">Tecnología e Informática</option>
                    <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                    <option value="Ciencias Sociales y Jurídicas">Ciencias Sociales y Jurídicas</option>
                    <option value="Negocios y Finanzas">Negocios y Finanzas</option>
                    <option value="Ingeniería y Construcción">Ingeniería y Construcción</option>
                    <option value="Arte, Diseño y Creatividad">Arte, Diseño y Creatividad</option>
                    <option value="Ciencias Agropecuarias">Ciencias Agropecuarias</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidad</label>
                  <select
                    value={editingCareer.modality}
                    onChange={(e) => setEditingCareer({ ...editingCareer, modality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrida">Híbrida</option>
                    <option value="Virtual / Online">Virtual / Online</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración (Años)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingCareer.durationYears}
                    onChange={(e) => setEditingCareer({ ...editingCareer, durationYears: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cuota Mensual (Gs.)</label>
                  <input
                    type="number"
                    value={editingCareer.monthlyTuition}
                    onChange={(e) => setEditingCareer({ ...editingCareer, monthlyTuition: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Matrícula (Gs.)</label>
                  <input
                    type="number"
                    value={editingCareer.enrollmentFee}
                    onChange={(e) => setEditingCareer({ ...editingCareer, enrollmentFee: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Malla Curricular (JSON de Semestres y Asignaturas)</label>
                <textarea
                  rows={4}
                  value={editingCareer.curriculumStr || JSON.stringify(editingCareer.curriculum, null, 2)}
                  onChange={(e) => setEditingCareer({ ...editingCareer, curriculumStr: e.target.value })}
                  placeholder='[ { "period": "1° Semestre", "subjects": ["Matemática", "Física"] } ]'
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Perfil del Egresado</label>
                <textarea
                  rows={2}
                  value={editingCareer.profile}
                  onChange={(e) => setEditingCareer({ ...editingCareer, profile: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campo Laboral</label>
                <textarea
                  rows={2}
                  value={editingCareer.jobField}
                  onChange={(e) => setEditingCareer({ ...editingCareer, jobField: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="career-accred-uni"
                  checked={editingCareer.isAccredited}
                  onChange={(e) => setEditingCareer({ ...editingCareer, isAccredited: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="career-accred-uni" className="font-bold text-slate-700">
                  Carrera Acreditada por la ANEAES
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black"
                >
                  Guardar Carrera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
