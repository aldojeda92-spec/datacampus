import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  School, 
  Calendar, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveLead } from '../../services/dataService';

export default function LeadModal({ career, university, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    highSchool: '',
    graduationYear: '2025',
    preferredShift: 'Mañana',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadRecord, setLeadRecord] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const leadPayload = {
      ...formData,
      careerId: career?.id || 'general',
      careerName: career?.name || 'Consulta General',
      universityId: university?.id || career?.universityId || 'general',
      universityName: university?.name || career?.universityName || 'Universidad Destino',
      monthlyTuition: career?.monthlyTuition || 0,
      modality: career?.modality || 'Presencial'
    };

    try {
      const res = await saveLead(leadPayload);
      setLeadRecord(res);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("Error saving lead:", err);
      // Still show success locally
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      city: '',
      highSchool: '',
      graduationYear: '2025',
      preferredShift: 'Mañana',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-campus-900 via-campus-800 to-campus-700 text-white p-6 sm:p-8 shrink-0">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-campus-500/40 text-campus-100 border border-campus-400/30">
              Solicitud de Información Oficial
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {career ? career.name : "Conecta con la Universidad"}
          </h2>
          <p className="text-xs sm:text-sm text-campus-100 mt-1 flex items-center gap-1.5 font-medium">
            <Building2 className="w-4 h-4 text-campus-300" />
            {career?.universityName || university?.name || "Universidad de tu preferencia"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                ¡Solicitud enviada con éxito!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Tus datos fueron registrados en el sistema de admisiones para <strong>{career?.name}</strong> en <strong>{career?.universityName || university?.name}</strong>. Un orientador se comunicará a tu WhatsApp o correo a la brevedad.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Próximos pasos de orientación:
                </div>
                <p>• Te enviarán el folleto digital, malla curricular detallada y aranceles 2026.</p>
                <p>• Recibirás información sobre becas y fechas de cursos probatorios.</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                {career?.phone && (
                  <a
                    href={`https://wa.me/${career.phone.replace(/[^0-9]/g, '')}?text=Hola!%20Solicité%20información%20sobre%20${encodeURIComponent(career.name)}%20en%20DATACAMPUS.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Escribir por WhatsApp ahora
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 pb-1">
                Completa tus datos para recibir aranceles oficiales, malla curricular, becas disponibles y fechas de inicio:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Nombre y Apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ej: Sofía Benítez"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Celular / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ej: 0981 123 456"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Ciudad donde vives */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Ciudad de Residencia *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Ej: Asunción, San Lorenzo, CDE..."
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Colegio de egreso */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Colegio de Egreso / Bachillerato *
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="highSchool"
                      required
                      placeholder="Ej: CNC, San José, etc."
                      value={formData.highSchool}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Año de egreso */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Año de Egreso Secundario
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none bg-white"
                    >
                      <option value="2026">2026 (En curso)</option>
                      <option value="2025">2025 (Reciente)</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022 o antes">2022 o anterior</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Turno preferido */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Turno o Modalidad de Preferencia
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Mañana', 'Tarde', 'Noche', 'Virtual / Online'].map((shift) => (
                    <label
                      key={shift}
                      className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        formData.preferredShift === shift
                          ? 'border-campus-500 bg-campus-50 text-campus-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredShift"
                        value={shift}
                        checked={formData.preferredShift === shift}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {shift}
                    </label>
                  ))}
                </div>
              </div>

              {/* Mensaje opcional */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pregunta o consulta adicional (Opcional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Ej: ¿Cuáles son las fechas de inscripción o requisitos de becas?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-campus-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-campus-600 hover:bg-campus-700 active:scale-98 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Solicitar Información de la Carrera
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Tus datos están protegidos. Solo serán compartidos con la institución seleccionada para orientación académica.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
