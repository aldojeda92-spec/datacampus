import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  Image, 
  FileSpreadsheet, 
  Users, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  Search, 
  ExternalLink,
  MessageCircle,
  Database,
  RefreshCw,
  BarChart3,
  Calendar,
  MapPin,
  TrendingUp,
  Brain,
  School,
  UserPlus,
  KeyRound,
  Lock,
  Tag,
  Clock,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';
import Papa from 'papaparse';
import { useAuth, MASTER_ADMIN } from '../../context/AuthContext';
import BrandLogo from '../../components/common/BrandLogo';
import { 
  getUniversities, 
  saveUniversity, 
  deleteUniversity,
  getCareers, 
  saveCareer, 
  deleteCareer,
  getBanners, 
  saveBanner, 
  deleteBanner,
  getLeads, 
  updateLeadStatus,
  getUsers,
  saveUser,
  deleteUser,
  getTestResults,
  seedDatabase 
} from '../../services/dataService';
import { isBannerActive } from '../../components/common/BannerItem';

export default function AdminDashboard() {
  const { currentUser, logout, isMaster } = useAuth();
  
  // Navigation tabs:
  // 'analitica', 'socios', 'usuarios-uni', 'carreras', 'universidades', 'banners', 'csv', 'leads', 'seed'
  const [activeTab, setActiveTab] = useState('analitica');

  // Core Data
  const [universities, setUniversities] = useState([]);
  const [careers, setCareers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search & Filters
  const [careerSearch, setCareerSearch] = useState('');
  const [uniSearch, setUniSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('Todos');

  // Analytics Filters State
  const [analyticsDateRange, setAnalyticsDateRange] = useState('todos'); // 'todos', 'hoy', '7d', '30d', 'custom'
  const [analyticsStartDate, setAnalyticsStartDate] = useState('');
  const [analyticsEndDate, setAnalyticsEndDate] = useState('');
  const [analyticsCareer, setAnalyticsCareer] = useState('');
  const [analyticsUniversity, setAnalyticsUniversity] = useState('');
  const [analyticsCity, setAnalyticsCity] = useState('');

  // Modals
  const [editingCareer, setEditingCareer] = useState(null);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  const [editingUni, setEditingUni] = useState(null);
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);

  const [editingBanner, setEditingBanner] = useState(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // CSV States
  const [csvType, setCsvType] = useState('carreras');
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [u, c, b, l, usr, tr] = await Promise.all([
      getUniversities(),
      getCareers(),
      getBanners(),
      getLeads(),
      getUsers(),
      getTestResults()
    ]);
    setUniversities(u);
    setCareers(c);
    setBanners(b);
    setLeads(l);
    setUsers(usr);
    setTestResults(tr);
    setLoading(false);
  };

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* =========================================================
     1. SOCIOS & UNIVERSIDADES USERS CRUD
  ========================================================= */
  const sociosList = users.filter(u => u.role === 'socio' || u.role === 'superadmin');
  const universityUsersList = users.filter(u => u.role === 'universidad');

  const handleOpenUserModal = (user = null, defaultRole = 'socio') => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: defaultRole, // 'socio' or 'universidad'
        universityId: defaultRole === 'universidad' ? (universities[0]?.id || '') : '',
        universityName: defaultRole === 'universidad' ? (universities[0]?.name || '') : '',
        status: 'activo'
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...editingUser };
      if (payload.role === 'universidad') {
        const selectedUni = universities.find(u => u.id === payload.universityId);
        if (selectedUni) {
          payload.universityName = selectedUni.name;
        }
      } else {
        payload.universityId = null;
        payload.universityName = null;
      }

      await saveUser(payload);
      showNotify(`Usuario ${payload.fullName} (${payload.role}) guardado con éxito.`);
      setIsUserModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotify(`Error guardando usuario: ${err.message}`, 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${name}"?`)) {
      await deleteUser(id);
      showNotify(`Usuario eliminado.`);
      loadAllData();
    }
  };

  /* =========================================================
     2. ANALYTICS LOGIC & COMPUTATIONS
  ========================================================= */
  const uniqueCities = useMemo(() => {
    const set = new Set();
    leads.forEach(l => { if (l.city) set.add(l.city); });
    testResults.forEach(t => { if (t.city) set.add(t.city); });
    return Array.from(set);
  }, [leads, testResults]);

  // Filtered Leads according to Analytics filters
  const filteredAnalyticsLeads = useMemo(() => {
    const now = new Date();
    return leads.filter(l => {
      // Date filtering
      if (l.createdAt) {
        const leadDate = new Date(l.createdAt);
        if (analyticsDateRange === 'hoy') {
          if (leadDate.toDateString() !== now.toDateString()) return false;
        } else if (analyticsDateRange === '7d') {
          const past7 = new Date();
          past7.setDate(past7.getDate() - 7);
          if (leadDate < past7) return false;
        } else if (analyticsDateRange === '30d') {
          const past30 = new Date();
          past30.setDate(past30.getDate() - 30);
          if (leadDate < past30) return false;
        } else if (analyticsDateRange === 'custom') {
          if (analyticsStartDate && leadDate < new Date(analyticsStartDate)) return false;
          if (analyticsEndDate) {
            const end = new Date(analyticsEndDate);
            end.setHours(23, 59, 59, 999);
            if (leadDate > end) return false;
          }
        }
      }

      // Career filter
      if (analyticsCareer && l.careerName !== analyticsCareer && l.careerId !== analyticsCareer) {
        return false;
      }

      // University filter
      if (analyticsUniversity && l.universityId !== analyticsUniversity && !l.universityName?.includes(analyticsUniversity)) {
        return false;
      }

      // City filter
      if (analyticsCity && l.city?.toLowerCase() !== analyticsCity.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [leads, analyticsDateRange, analyticsStartDate, analyticsEndDate, analyticsCareer, analyticsUniversity, analyticsCity]);

  // Filtered Test Results
  const filteredAnalyticsTests = useMemo(() => {
    const now = new Date();
    return testResults.filter(t => {
      if (t.createdAt) {
        const testDate = new Date(t.createdAt);
        if (analyticsDateRange === 'hoy') {
          if (testDate.toDateString() !== now.toDateString()) return false;
        } else if (analyticsDateRange === '7d') {
          const past7 = new Date();
          past7.setDate(past7.getDate() - 7);
          if (testDate < past7) return false;
        } else if (analyticsDateRange === '30d') {
          const past30 = new Date();
          past30.setDate(past30.getDate() - 30);
          if (testDate < past30) return false;
        } else if (analyticsDateRange === 'custom') {
          if (analyticsStartDate && testDate < new Date(analyticsStartDate)) return false;
          if (analyticsEndDate) {
            const end = new Date(analyticsEndDate);
            end.setHours(23, 59, 59, 999);
            if (testDate > end) return false;
          }
        }
      }

      if (analyticsCity && t.city && t.city.toLowerCase() !== analyticsCity.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [testResults, analyticsDateRange, analyticsStartDate, analyticsEndDate, analyticsCity]);

  // Computed metrics for Analytics
  const topDemandedCareers = useMemo(() => {
    const counts = {};
    filteredAnalyticsLeads.forEach(l => {
      const cName = l.careerName || 'No especificada';
      counts[cName] = (counts[cName] || 0) + 1;
    });
    const total = filteredAnalyticsLeads.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredAnalyticsLeads]);

  const topUniversitiesPref = useMemo(() => {
    const counts = {};
    filteredAnalyticsLeads.forEach(l => {
      const uName = l.universityName || 'Otra';
      counts[uName] = (counts[uName] || 0) + 1;
    });
    const total = filteredAnalyticsLeads.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAnalyticsLeads]);

  const topCitiesOrigin = useMemo(() => {
    const counts = {};
    filteredAnalyticsLeads.forEach(l => {
      const c = l.city || 'Asunción';
      counts[c] = (counts[c] || 0) + 1;
    });
    const total = filteredAnalyticsLeads.length || 1;
    return Object.entries(counts)
      .map(([city, count]) => ({
        city,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAnalyticsLeads]);

  const topVocationalAreas = useMemo(() => {
    const counts = {};
    filteredAnalyticsTests.forEach(t => {
      const area = t.topArea || 'Tecnología e Informática';
      counts[area] = (counts[area] || 0) + 1;
    });
    const total = filteredAnalyticsTests.length || 1;
    return Object.entries(counts)
      .map(([area, count]) => ({
        area,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAnalyticsTests]);

  const topSchools = useMemo(() => {
    const counts = {};
    filteredAnalyticsLeads.forEach(l => {
      if (l.highSchool) {
        counts[l.highSchool] = (counts[l.highSchool] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([school, count]) => ({ school, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredAnalyticsLeads]);

  // Export Analytics CSV
  const handleExportAnalyticsCsv = () => {
    const rows = filteredAnalyticsLeads.map(l => ({
      ID: l.id,
      Fecha: l.createdAt ? new Date(l.createdAt).toLocaleDateString('es-PY') : '',
      Estudiante: l.fullName,
      Telefono: l.phone,
      Email: l.email,
      Ciudad_Zona: l.city,
      Colegio: l.highSchool,
      Anho_Egreso: l.graduationYear,
      Carrera_Buscada: l.careerName,
      Universidad_Preferida: l.universityName,
      Turno_Modalidad: l.preferredShift,
      Estado: l.status
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analitica_datacampus_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================================================
     3. BANNERS (ANUNCIOS CON FECHA INICIO, FIN Y 1200x400)
  ========================================================= */
  const handleOpenBannerModal = (banner = null) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultEnd = nextYear.toISOString().slice(0, 10);

    if (banner) {
      setEditingBanner(banner);
    } else {
      setEditingBanner({
        title: '¡Admisión 2026 - Becas y Carreras Destacadas!',
        subtitle: 'Postúlate a las mejores universidades con matrícula bonificada.',
        tag: 'ANUNCIO OFICIAL',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop&q=80',
        linkUrl: '/carreras',
        buttonText: 'Ver Promoción',
        dimensions: '1200x400',
        position: 'home_hero_sub', // 'home_hero_sub', 'home_middle', 'catalog_banner'
        fechaInicio: today,
        fechaFin: defaultEnd,
        active: true,
        backgroundColor: 'from-blue-600 to-indigo-800'
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      await saveBanner({
        ...editingBanner,
        dimensions: '1200x400'
      });
      showNotify(`Anuncio "${editingBanner.title}" inyectado con éxito.`);
      setIsBannerModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotify(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm(`¿Eliminar este anuncio publicitario?`)) {
      await deleteBanner(id);
      showNotify(`Anuncio eliminado.`);
      loadAllData();
    }
  };

  /* =========================================================
     4. CAREER & UNIVERSITY CRUD HANDLERS
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
        universityId: universities[0]?.id || '',
        universityName: universities[0]?.name || '',
        universityLogo: universities[0]?.logo || '',
        area: 'Tecnología e Informática',
        modality: 'Presencial',
        durationYears: 5,
        durationSemesters: 10,
        monthlyTuition: 1200000,
        enrollmentFee: 600000,
        degree: '',
        totalHours: '4.000 horas',
        citiesStr: 'Asunción, San Lorenzo',
        isAccredited: true,
        accreditation: 'Acreditada por ANEAES',
        shortDescription: '',
        profile: '',
        jobField: '',
        admissionRequirements: '',
        curriculum: [
          { period: "1° Semestre", subjects: ["Introducción a la Carrera", "Matemática Básica", "Metodología", "Comunicación"] },
          { period: "2° Semestre", subjects: ["Fundamentos Técnicos I", "Estadística", "Ética", "Taller Práctico"] }
        ]
      });
    }
    setIsCareerModalOpen(true);
  };

  const handleSaveCareer = async (e) => {
    e.preventDefault();
    try {
      const selectedUni = universities.find(u => u.id === editingCareer.universityId);
      const parsedCities = (editingCareer.citiesStr || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      let parsedCurriculum = editingCareer.curriculum;
      if (editingCareer.curriculumStr) {
        try {
          parsedCurriculum = JSON.parse(editingCareer.curriculumStr);
        } catch {
          // ignore
        }
      }

      const payload = {
        ...editingCareer,
        universityName: selectedUni ? selectedUni.name : editingCareer.universityName,
        universityLogo: selectedUni ? selectedUni.logo : editingCareer.universityLogo,
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
      showNotify(`Carrera "${payload.name}" guardada con éxito.`);
      setIsCareerModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotify(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteCareer = async (id, name) => {
    if (window.confirm(`¿Eliminar la carrera "${name}"?`)) {
      await deleteCareer(id);
      showNotify(`Carrera eliminada.`);
      loadAllData();
    }
  };

  const handleOpenUniModal = (uni = null) => {
    if (uni) {
      setEditingUni({
        ...uni,
        citiesStr: uni.cities?.join(', ') || ''
      });
    } else {
      setEditingUni({
        name: '',
        shortName: '',
        type: 'Privada',
        logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200',
        coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200',
        website: 'https://',
        phone: '+595 21 000 000',
        email: 'informes@universidad.edu.py',
        headquarters: 'Asunción',
        citiesStr: 'Asunción, San Lorenzo, Ciudad del Este',
        description: '',
        accreditationStatus: 'Habilitada por CONES / Acreditaciones ANEAES',
        foundationYear: 1995,
        studentCount: '+10.000',
        featured: false
      });
    }
    setIsUniModalOpen(true);
  };

  const handleSaveUni = async (e) => {
    e.preventDefault();
    try {
      const parsedCities = (editingUni.citiesStr || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        ...editingUni,
        cities: parsedCities,
        foundationYear: Number(editingUni.foundationYear)
      };
      delete payload.citiesStr;

      await saveUniversity(payload);
      showNotify(`Universidad "${payload.name}" guardada.`);
      setIsUniModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotify(`Error: ${err.message}`, 'error');
    }
  };

  const handleDeleteUni = async (id, name) => {
    if (window.confirm(`¿Eliminar la universidad "${name}"?`)) {
      await deleteUniversity(id);
      showNotify(`Universidad eliminada.`);
      loadAllData();
    }
  };

  /* =========================================================
     5. CSV BULK IMPORT
  ========================================================= */
  const downloadSampleCsv = (type) => {
    let csvContent = "";
    let filename = "";

    if (type === 'carreras') {
      csvContent = "id,name,universityId,universityName,area,modality,durationYears,durationSemesters,monthlyTuition,enrollmentFee,degree,cities,isAccredited,accreditation,shortDescription\n" +
        "med-ejemplo,Medicina y Cirugia,uca,Universidad Catolica,Ciencias de la Salud,Presencial,6,12,2800000,1500000,Medico Cirujano,\"Asuncion, CDE\",true,Acreditada ANEAES,Formacion de medicos de excelencia\n" +
        "sistemas-ejemplo,Ingenieria en Sistemas,americana,Universidad Americana,Tecnologia e Informatica,Hibrida,4,8,1450000,750000,Ingeniero en Sistemas,\"Asuncion, Virtual\",true,Acreditada ANEAES,Desarrollo de software y computacion en la nube\n" +
        "derecho-ejemplo,Derecho y Ciencias Juridicas,columbia,Universidad Columbia,Ciencias Sociales y Juridicas,Presencial,5,10,1300000,650000,Abogado/a,\"Asuncion, San Lorenzo\",true,Acreditada ANEAES,Formacion integral en litigio y leyes";
      filename = "plantilla_carreras_datacampus.csv";
    } else {
      csvContent = "id,name,shortName,type,logo,website,phone,email,headquarters,cities,description,accreditationStatus,foundationYear\n" +
        "uaa,Universidad Autonoma de Asuncion,UAA,Privada,https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200,https://www.uaa.edu.py,+595 21 495 873,info@uaa.edu.py,Jejuí 667 Asuncion,\"Asuncion\",Institucion privada enfocada en gestion y tecnologia,Acreditada ANEAES,1991\n" +
        "uni-este,Universidad Nacional del Este,UNE,Publica,https://images.unsplash.com/photo-1562774053-701939374585?w=200,https://www.une.edu.py,+595 61 575 478,informes@une.edu.py,Campus Km 8 Acaray CDE,\"Ciudad del Este, Hernandarias\",Principal universidad publica del Alto Parana,Acreditaciones ANEAES,1993";
      filename = "plantilla_universidades_datacampus.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvPreview(results.data);
        setCsvLoading(false);
        showNotify(`Se leyeron ${results.data.length} filas del archivo CSV.`);
      },
      error: (err) => {
        setCsvLoading(false);
        showNotify(`Error al leer CSV: ${err.message}`, 'error');
      }
    });
  };

  const handleConfirmCsvImport = async () => {
    if (csvPreview.length === 0) return;
    setCsvLoading(true);
    let imported = 0;

    try {
      if (csvType === 'carreras') {
        for (const row of csvPreview) {
          if (!row.name) continue;
          const parsedCities = typeof row.cities === 'string'
            ? row.cities.split(',').map(s => s.trim().replace(/"/g, ''))
            : ['Asunción'];

          const careerObj = {
            id: row.id || `career-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: row.name,
            universityId: row.universityId || 'general',
            universityName: row.universityName || 'Universidad Registrada',
            universityLogo: row.universityLogo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200',
            area: row.area || 'General',
            modality: row.modality || 'Presencial',
            durationYears: Number(row.durationYears) || 5,
            durationSemesters: Number(row.durationSemesters) || 10,
            monthlyTuition: Number(row.monthlyTuition) || 0,
            enrollmentFee: Number(row.enrollmentFee) || 0,
            degree: row.degree || row.name,
            cities: parsedCities,
            isAccredited: String(row.isAccredited).toLowerCase() === 'true',
            accreditation: row.accreditation || 'Acreditada ANEAES',
            shortDescription: row.shortDescription || '',
            curriculum: [
              { period: "Ciclo Inicial", subjects: ["Introducción Básica", "Metodología", "Matemática"] },
              { period: "Ciclo Profesional", subjects: ["Materias Específicas", "Taller Práctico", "Pasantía"] }
            ]
          };

          await saveCareer(careerObj);
          imported++;
        }
      } else {
        for (const row of csvPreview) {
          if (!row.name) continue;
          const parsedCities = typeof row.cities === 'string'
            ? row.cities.split(',').map(s => s.trim().replace(/"/g, ''))
            : ['Asunción'];

          const uniObj = {
            id: row.id || `uni-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: row.name,
            shortName: row.shortName || row.name.substring(0, 4).toUpperCase(),
            type: row.type || 'Privada',
            logo: row.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200',
            coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200',
            website: row.website || 'https://',
            phone: row.phone || '+595 21 000 000',
            email: row.email || 'info@universidad.edu.py',
            headquarters: row.headquarters || 'Asunción',
            cities: parsedCities,
            description: row.description || '',
            accreditationStatus: row.accreditationStatus || 'Habilitada CONES',
            foundationYear: Number(row.foundationYear) || 2000
          };

          await saveUniversity(uniObj);
          imported++;
        }
      }

      showNotify(`¡Importación completada! Se guardaron ${imported} registros con éxito.`);
      setCsvPreview([]);
      loadAllData();
    } catch (err) {
      showNotify(`Error en la importación: ${err.message}`, 'error');
    } finally {
      setCsvLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (window.confirm("¿Deseas poblar la base de datos con los datos predeterminados de Paraguay (UNA, UCA, Americana, Carreras, Banners y Usuarios de Prueba)? Esto no alterará colecciones ajenas.")) {
      setLoading(true);
      const res = await seedDatabase();
      setLoading(false);
      showNotify(res.message);
      loadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
      
      {/* Admin Top Navbar */}
      <header className="bg-[#0A1F33] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-block" title="Ir a la web pública">
              <BrandLogo variant="negative" size="sm" showDescriptor={true} />
            </Link>
            <div className="h-8 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-wider text-slate-300 uppercase font-display">Panel de Control</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase font-display">
                  Poder Total
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentUser?.displayName || currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/portal-universidades"
              className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-xs font-bold border border-emerald-800 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Ver Portal Universidades</span>
            </Link>

            <button
              onClick={loadAllData}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Recargar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

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

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-floating text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <Sparkles className="w-4 h-4" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'analitica', label: '📊 Analítica de Leads & Tests', icon: BarChart3, primary: true },
            { id: 'socios', label: `👥 Socios & Administradores (${sociosList.length})`, icon: KeyRound },
            { id: 'usuarios-uni', label: `🏛️ Usuarios Universidades (${universityUsersList.length})`, icon: Building2 },
            { id: 'banners', label: `📢 Inyección Anuncios (${banners.length})`, icon: Image },
            { id: 'csv', label: '📁 Carga Masiva CSV', icon: FileSpreadsheet },
            { id: 'carreras', label: `🎓 Carreras (${careers.length})`, icon: GraduationCap },
            { id: 'universidades', label: `🏛️ Universidades (${universities.length})`, icon: Building2 },
            { id: 'leads', label: `📝 Prospectos Leads (${leads.length})`, icon: Users },
            { id: 'seed', label: '💾 Base de Datos & Seed', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-campus-600 text-white shadow-md scale-102 ring-2 ring-campus-400'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================
            TAB 1: ANALÍTICA AVANZADA (LEADS & TESTS VOCACIONALES)
        ========================================================= */}
        {activeTab === 'analitica' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-campus-50 text-campus-700 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-campus-600" />
                    Inteligencia de Datos en Tiempo Real
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Panel de Analítica y Prospectiva Universitaria
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleExportAnalyticsCsv}
                  className="px-5 py-2.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Datos en CSV</span>
                </button>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                
                {/* Date Presets */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Rango de Fecha</label>
                  <select
                    value={analyticsDateRange}
                    onChange={(e) => setAnalyticsDateRange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:border-campus-500 focus:outline-none"
                  >
                    <option value="todos">Todo el Historial</option>
                    <option value="hoy">Hoy</option>
                    <option value="7d">Últimos 7 días</option>
                    <option value="30d">Últimos 30 días</option>
                    <option value="custom">Rango Personalizado</option>
                  </select>
                </div>

                {/* Custom Dates if selected */}
                {analyticsDateRange === 'custom' ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Desde</label>
                      <input
                        type="date"
                        value={analyticsStartDate}
                        onChange={(e) => setAnalyticsStartDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Hasta</label>
                      <input
                        type="date"
                        value={analyticsEndDate}
                        onChange={(e) => setAnalyticsEndDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </>
                ) : null}

                {/* Carrera Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Carrera</label>
                  <select
                    value={analyticsCareer}
                    onChange={(e) => setAnalyticsCareer(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:border-campus-500 focus:outline-none"
                  >
                    <option value="">Todas las carreras</option>
                    {careers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Universidad Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Universidad</label>
                  <select
                    value={analyticsUniversity}
                    onChange={(e) => setAnalyticsUniversity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:border-campus-500 focus:outline-none"
                  >
                    <option value="">Todas las universidades</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.shortName})</option>
                    ))}
                  </select>
                </div>

                {/* Zona / Ciudad Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zona / Ciudad</label>
                  <select
                    value={analyticsCity}
                    onChange={(e) => setAnalyticsCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:border-campus-500 focus:outline-none"
                  >
                    <option value="">Todas las ciudades</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-campus-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Leads Filtrados</span>
                  <Users className="w-5 h-5 text-campus-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {filteredAnalyticsLeads.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  de un total histórico de {leads.length} solicitudes
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tests Vocacionales</span>
                  <Brain className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {filteredAnalyticsTests.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  estudiantes completaron el test
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tasa de Conversión</span>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {filteredAnalyticsTests.length > 0 
                    ? `${Math.round((filteredAnalyticsLeads.length / filteredAnalyticsTests.length) * 100)}%`
                    : '100%'}
                </div>
                <p className="text-[11px] text-slate-400">
                  leads por test completado
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Zonas Activas</span>
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {topCitiesOrigin.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  ciudades con prospectos registrados
                </p>
              </div>

            </div>

            {/* Analytics Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Carreras más demandadas */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-campus-600" />
                    Carreras Más Buscadas por Prospectos
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">Solicitudes</span>
                </div>

                <div className="space-y-4">
                  {topDemandedCareers.length > 0 ? (
                    topDemandedCareers.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">{item.name}</span>
                          <span className="text-campus-600 font-extrabold">{item.count} leads ({item.percent}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-campus-500 to-indigo-600 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">No hay datos para los filtros seleccionados.</p>
                  )}
                </div>
              </div>

              {/* Universidades preferidas */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    Preferencia por Universidad
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">Distribución</span>
                </div>

                <div className="space-y-4">
                  {topUniversitiesPref.length > 0 ? (
                    topUniversitiesPref.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-800">{item.name}</span>
                          <span className="text-emerald-600 font-extrabold">{item.count} ({item.percent}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">No hay registros con los filtros actuales.</p>
                  )}
                </div>
              </div>

              {/* Zonas y Ciudades */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    Origen Geográfico de los Prospectos
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">Ciudades</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {topCitiesOrigin.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-800">{item.city}</div>
                      <div className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-black text-xs">
                        {item.count} ({item.percent}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultados Test Vocacional */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Tendencias Vocacionales del Test
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">Afinidad</span>
                </div>

                <div className="space-y-4">
                  {topVocationalAreas.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-800">{item.area}</span>
                        <span className="text-purple-600 font-extrabold">{item.count} tests ({item.percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-accent-600 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Colegios de Origen */}
            {topSchools.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-campus-600" />
                  Principales Colegios Secundarios de Egresados
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {topSchools.map((item, idx) => (
                    <div key={idx} className="px-4 py-2 rounded-2xl bg-campus-50 border border-campus-200 text-xs font-bold text-campus-900 flex items-center gap-2">
                      <span>{item.school}</span>
                      <span className="px-2 py-0.5 rounded-full bg-campus-600 text-white text-[10px]">
                        {item.count} prospectos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            TAB 2: GESTIÓN DE SOCIOS (PODER TOTAL SOBRE LA WEB APP)
        ========================================================= */}
        {activeTab === 'socios' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-50 text-amber-800 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  Control Total de la Plataforma
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Socios con Poder Total sobre DATACAMPUS
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los usuarios creados aquí tienen exactamente los mismos privilegios de administración absoluta que la cuenta master.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenUserModal(null, 'socio')}
                className="px-5 py-2.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nuevo Socio</span>
              </button>
            </div>

            {/* Master User Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm">{currentUser?.displayName || 'Socio Principal'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                      Cuenta Master Fundador
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">{currentUser?.email || 'admin@datacampus.com.py'}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                Poder Total Permanente • Inmutable
              </div>
            </div>

            {/* Socios List */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Socio / Administrador</th>
                    <th className="p-4">Email / Usuario</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Rol & Permisos</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sociosList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        Actualmente solo existe el Socio Master Principal (Aldo Ojeda). Haz clic en <span className="font-bold text-campus-600">"Nuevo Socio"</span> para otorgar poder total a un nuevo socio.
                      </td>
                    </tr>
                  ) : (
                    sociosList.map(socio => (
                    <tr key={socio.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{socio.fullName}</td>
                      <td className="p-4 font-mono text-campus-700">{socio.email}</td>
                      <td className="p-4 text-slate-600">{socio.phone || 'No registrado'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 text-amber-900">
                          Poder Total (Socio)
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          socio.status === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {socio.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenUserModal(socio, 'socio')}
                          className="p-1.5 text-slate-600 hover:text-campus-600 hover:bg-campus-50 rounded-lg"
                          title="Editar socio o cambiar contraseña"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(socio.id, socio.fullName)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar socio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: USUARIOS PARA UNIVERSIDADES (GESTIÓN DE ACCESOS)
        ========================================================= */}
        {activeTab === 'usuarios-uni' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-800 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Accesos Delegados por Universidad
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Usuarios de Facultades y Universidades
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crea accesos institucionales para que cada universidad mantenga sus propias carreras, mallas, costos y atienda a sus prospectos en el portal <code>/portal-universidades</code>.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/portal-universidades"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <span>Abrir Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenUserModal(null, 'universidad')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Usuario Universidad</span>
                </button>
              </div>
            </div>

            {/* University users table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Encargado / Contacto</th>
                    <th className="p-4">Email / Usuario</th>
                    <th className="p-4">Universidad Asignada</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {universityUsersList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        No hay usuarios de facultades registrados todavía. Haz clic en <span className="font-bold text-emerald-600">"Nuevo Usuario Universidad"</span> para crear un acceso institucional.
                      </td>
                    </tr>
                  ) : (
                    universityUsersList.map(uUser => (
                    <tr key={uUser.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{uUser.fullName}</td>
                      <td className="p-4 font-mono text-emerald-700">{uUser.email}</td>
                      <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{uUser.universityName || uUser.universityId}</span>
                      </td>
                      <td className="p-4 text-slate-600">{uUser.phone || 'No registrado'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          uUser.status === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {uUser.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenUserModal(uUser, 'universidad')}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Editar usuario institucional"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(uUser.id, uUser.fullName)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar acceso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: INYECCIÓN DE ANUNCIOS (1200x400 CON FECHAS Y LINK)
        ========================================================= */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-purple-50 text-purple-800 mb-1">
                  <Image className="w-3.5 h-3.5 text-purple-600" />
                  Módulo de Monetización & Anuncios 1200x400
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Inyección de Anuncios Publicitarios
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configura banners con dimensiones estándar de 1200x400 px, fecha de inicio, fecha de fin e hipervínculo de destino.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBannerModal()}
                className="px-5 py-2.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Inyectar Nuevo Anuncio (1200x400)</span>
              </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map(banner => {
                const isActiveNow = isBannerActive(banner);
                const today = new Date().toISOString().slice(0, 10);
                const isScheduled = banner.fechaInicio && banner.fechaInicio > today;
                const isExpired = banner.fechaFin && banner.fechaFin < today;

                return (
                  <div key={banner.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50 space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Status Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                          Posición: {banner.position}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isActiveNow ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                              🟢 Vigente
                            </span>
                          ) : isScheduled ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                              🟡 Programado
                            </span>
                          ) : isExpired ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-800">
                              🔴 Expirado
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-200 text-slate-700">
                              ⚪ Pausado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 1200x400 Banner Preview Thumbnail */}
                      <div className="relative w-full aspect-[3/1] max-h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mb-3 shadow-inner">
                        <img
                          src={banner.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono">
                          1200 x 400 px
                        </div>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900">{banner.title}</h4>
                      {banner.subtitle && (
                        <p className="text-xs text-slate-500 line-clamp-2">{banner.subtitle}</p>
                      )}

                      {/* Validity Dates Info */}
                      <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span className="font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Vigencia:
                          </span>
                          <span>{banner.fechaInicio || 'Inmediata'} al {banner.fechaFin || 'Indefinida'}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 truncate">
                          <span className="font-bold">Enlace:</span>
                          <a href={banner.linkUrl} target="_blank" rel="noreferrer" className="text-campus-600 truncate max-w-[200px] hover:underline">
                            {banner.linkUrl}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenBannerModal(banner)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CARGA MASIVA CSV
        ========================================================= */}
        {activeTab === 'csv' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-campus-50 text-campus-700 mb-2">
                <FileSpreadsheet className="w-4 h-4 text-campus-600" />
                Módulo de Carga Masiva
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Carga Masiva con Archivos CSV
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sube información de carreras o universidades de forma masiva a la base de datos de Firebase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Tipo de datos a cargar
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setCsvType('carreras'); setCsvPreview([]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      csvType === 'carreras'
                        ? 'border-campus-600 bg-campus-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Carreras Universitarias
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCsvType('universidades'); setCsvPreview([]); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      csvType === 'universidades'
                        ? 'border-campus-600 bg-campus-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Universidades
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => downloadSampleCsv(csvType)}
                  className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:border-campus-500 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 text-campus-600" />
                  <span>Descargar Plantilla CSV ({csvType})</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-campus-500 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50 transition-colors">
              <Upload className="w-10 h-10 text-campus-500 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Selecciona tu archivo CSV de {csvType}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formato compatible: .csv delimitado por coma (,)
                </p>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="inline-block py-2.5 px-6 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
              >
                Cargar Archivo CSV
              </label>
            </div>

            {csvPreview.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Vista previa de importación ({csvPreview.length} registros listos)
                  </h3>
                  <button
                    onClick={handleConfirmCsvImport}
                    disabled={csvLoading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {csvLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirmar e Importar a Base de Datos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-72">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <tr>
                        {Object.keys(csvPreview[0] || {}).map(header => (
                          <th key={header} className="p-3">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreview.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-3 truncate max-w-xs">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 6: GESTIÓN DE CARRERAS (ABM)
        ========================================================= */}
        {activeTab === 'carreras' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Gestión de Carreras Universitarias</h2>
                <p className="text-xs text-slate-500">Agrega, edita y administra mallas curriculares, costos y sedes.</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCareerModal()}
                className="px-5 py-2.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Carrera</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Filtrar por carrera, universidad o área..."
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-campus-500 focus:outline-none"
              />
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Carrera</th>
                    <th className="p-4">Universidad</th>
                    <th className="p-4">Área</th>
                    <th className="p-4">Modalidad</th>
                    <th className="p-4">Duración</th>
                    <th className="p-4">Cuota Est.</th>
                    <th className="p-4">Acreditada</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {careers
                    .filter(c => c.name?.toLowerCase().includes(careerSearch.toLowerCase()) || c.universityName?.toLowerCase().includes(careerSearch.toLowerCase()))
                    .map(career => (
                      <tr key={career.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{career.name}</td>
                        <td className="p-4 text-slate-600">{career.universityName}</td>
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
                            className="p-1.5 text-slate-600 hover:text-campus-600 hover:bg-campus-50 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(career.id, career.name)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
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

        {/* =========================================================
            TAB 7: GESTIÓN DE UNIVERSIDADES (ABM)
        ========================================================= */}
        {activeTab === 'universidades' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Gestión de Universidades</h2>
                <p className="text-xs text-slate-500">Administra las instituciones registradas, logos y sedes.</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenUniModal()}
                className="px-5 py-2.5 bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Universidad</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Logo</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Siglas</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Sedes</th>
                    <th className="p-4">Sitio Web</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {universities
                    .filter(u => u.name?.toLowerCase().includes(uniSearch.toLowerCase()))
                    .map(uni => (
                      <tr key={uni.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <img src={uni.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                        </td>
                        <td className="p-4 font-bold text-slate-900">{uni.name}</td>
                        <td className="p-4 font-semibold text-campus-700">{uni.shortName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            uni.type === 'Pública' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {uni.type}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 truncate max-w-xs">{uni.cities?.join(', ')}</td>
                        <td className="p-4">
                          <a href={uni.website} target="_blank" rel="noreferrer" className="text-campus-600 hover:underline flex items-center gap-1">
                            Enlace <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenUniModal(uni)}
                            className="p-1.5 text-slate-600 hover:text-campus-600 hover:bg-campus-50 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUni(uni.id, uni.name)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
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

        {/* =========================================================
            TAB 8: PROSPECTOS DE ESTUDIANTES (LEADS)
        ========================================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Prospectos de Estudiantes Recibidos ({leads.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Estudiantes interesados que completaron el formulario con sus datos de colegio y carrera.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Estado:</span>
                {['Todos', 'Nuevo', 'Contactado', 'Inscrito'].map(st => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      leadStatusFilter === st
                        ? 'bg-campus-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Colegio / Año</th>
                    <th className="p-4">Carrera Solicitada</th>
                    <th className="p-4">Universidad</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads
                    .filter(l => leadStatusFilter === 'Todos' || l.status === leadStatusFilter)
                    .map(lead => {
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
                          <td className="p-4 font-bold text-campus-700">{lead.careerName}</td>
                          <td className="p-4 text-slate-600">{lead.universityName}</td>
                          <td className="p-4">
                            <select
                              value={lead.status || 'Nuevo'}
                              onChange={async (e) => {
                                await updateLeadStatus(lead.id, e.target.value);
                                loadAllData();
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
                                href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(lead.fullName)}!%20Te%20escribimos%20de%20DATACAMPUS%20sobre%20tu%20consulta%20de%20la%20carrera%20${encodeURIComponent(lead.careerName)}.`}
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

        {/* =========================================================
            TAB 9: BASE DE DATOS & SEED
        ========================================================= */}
        {activeTab === 'seed' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-700 mb-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Sembrado y Conexión de Base de Datos
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Poblar Datos Iniciales de Paraguay en Firebase
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Inicializa la base de datos de Firestore en el proyecto <code>alerta-paraguay</code> con el catálogo completo de universidades, carreras, socios, usuarios de universidades, leads y resultados analíticos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <p className="font-bold text-slate-800">Garantía de Seguridad e Integridad:</p>
              <p>• Los datos se guardan estrictamente bajo colecciones con prefijo <code>datacampus_*</code>.</p>
              <p>• Ningún dato ajeno o preexistente de alerta-paraguay es borrado o afectado.</p>
            </div>

            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-campus-600 hover:bg-campus-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Poblar / Restaurar Datos Iniciales en Firebase</span>
            </button>
          </div>
        )}

      </div>

      {/* =========================================================
          MODAL: CREAR / EDITAR USUARIOS (SOCIOS Y UNIVERSIDADES)
      ========================================================= */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {editingUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h3>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  editingUser.role === 'socio' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {editingUser.role === 'socio' ? 'Socio (Poder Total)' : 'Usuario de Universidad'}
                </span>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre y Apellido / Cargo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Marcelo Franco"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico / Usuario *</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@dominio.edu.py"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contraseña de Acceso *</label>
                <input
                  type="text"
                  required
                  placeholder="Contraseña segura"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="0981 000 000"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rol de Permisos</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="socio">Socio (Poder Total Web App)</option>
                    <option value="universidad">Encargado de Universidad</option>
                  </select>
                </div>
              </div>

              {/* University Selector if role is universidad */}
              {editingUser.role === 'universidad' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                  <label className="font-extrabold text-emerald-950 block">
                    Universidad que Administrará *
                  </label>
                  <select
                    required
                    value={editingUser.universityId}
                    onChange={(e) => setEditingUser({ ...editingUser, universityId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-bold"
                  >
                    <option value="">Selecciona una universidad...</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.shortName})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-emerald-800">
                    Este usuario solo podrá ver y editar las carreras y perfil de la universidad elegida.
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado de la Cuenta</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="activo">Activo (Puede iniciar sesión)</option>
                  <option value="inactivo">Inactivo (Acceso bloqueado)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-campus-600 text-white font-black"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: INYECCIÓN DE ANUNCIO (1200x400 CON FECHAS Y LINK)
      ========================================================= */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {editingBanner.id ? 'Editar Anuncio' : 'Inyectar Nuevo Anuncio'}
                </h3>
                <span className="text-[10px] font-black uppercase text-purple-600">
                  Estándar Banner 1200x400 px
                </span>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título del Anuncio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¡Postúlate a Becas Universitarias 2026!"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL de la Imagen (Dimensiones: 1200x400 px) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://... imagen de 1200x400 px"
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Real-time 1200x400 Preview */}
              {editingBanner.imageUrl && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-600 block text-[11px]">
                    Previsualización (Ratio 3:1 - 1200x400):
                  </span>
                  <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-sm">
                    <img
                      src={editingBanner.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop&q=80'; }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hipervínculo / Enlace de Destino *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://universidad.edu.py/becas o /carreras?q=medicina"
                  value={editingBanner.linkUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, linkUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Al hacer clic en el anuncio, el estudiante será redirigido a este enlace.
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={editingBanner.fechaInicio || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, fechaInicio: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Inicio de publicación</span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de Fin *</label>
                  <input
                    type="date"
                    required
                    value={editingBanner.fechaFin || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, fechaFin: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Fin de publicación</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ubicación en la Web</label>
                  <select
                    value={editingBanner.position}
                    onChange={(e) => setEditingBanner({ ...editingBanner, position: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="home_hero_sub">Home Hero (Principal)</option>
                    <option value="home_middle">Home Intermedio</option>
                    <option value="catalog_banner">Encabezado Catálogo</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado</label>
                  <select
                    value={editingBanner.active ? 'true' : 'false'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.value === 'true' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Pausado / Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-campus-600 text-white font-black"
                >
                  Inyectar Anuncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: EDITAR / CREAR CARRERA
      ========================================================= */}
      {isCareerModalOpen && editingCareer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingCareer.id ? 'Editar Carrera' : 'Nueva Carrera'}
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
                  <label className="font-bold text-slate-700 block mb-1">Universidad *</label>
                  <select
                    value={editingCareer.universityId}
                    onChange={(e) => setEditingCareer({ ...editingCareer, universityId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
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
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ciudades / Sedes (separadas por comas)</label>
                <input
                  type="text"
                  value={editingCareer.citiesStr}
                  onChange={(e) => setEditingCareer({ ...editingCareer, citiesStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Malla Curricular (JSON)</label>
                <textarea
                  rows={3}
                  value={editingCareer.curriculumStr || JSON.stringify(editingCareer.curriculum, null, 2)}
                  onChange={(e) => setEditingCareer({ ...editingCareer, curriculumStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
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
                  className="px-6 py-2.5 rounded-xl bg-campus-600 text-white font-black"
                >
                  Guardar Carrera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: EDITAR / CREAR UNIVERSIDAD
      ========================================================= */}
      {isUniModalOpen && editingUni && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingUni.id ? 'Editar Universidad' : 'Nueva Universidad'}
              </h3>
              <button onClick={() => setIsUniModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUni} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingUni.name}
                  onChange={(e) => setEditingUni({ ...editingUni, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Siglas</label>
                  <input
                    type="text"
                    value={editingUni.shortName}
                    onChange={(e) => setEditingUni({ ...editingUni, shortName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo</label>
                  <select
                    value={editingUni.type}
                    onChange={(e) => setEditingUni({ ...editingUni, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Privada">Privada</option>
                    <option value="Pública">Pública</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Logo</label>
                <input
                  type="url"
                  value={editingUni.logo}
                  onChange={(e) => setEditingUni({ ...editingUni, logo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sedes (separadas por comas)</label>
                <input
                  type="text"
                  value={editingUni.citiesStr}
                  onChange={(e) => setEditingUni({ ...editingUni, citiesStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingUni.description}
                  onChange={(e) => setEditingUni({ ...editingUni, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUniModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-campus-600 text-white font-black"
                >
                  Guardar Universidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
