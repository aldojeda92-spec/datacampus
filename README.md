# DATACAMPUS 🎓🇵🇾

**DATACAMPUS** es una plataforma tecnológica de orientación, búsqueda y comparación de carreras universitarias en Paraguay (inspirada en la funcionalidad de datacarpy y el estándar de Educaweb).

---

## 🚀 Características Principales

1. **Buscador Autopredictivo de Carreras y Universidades**:
   - Autocompletado en tiempo real mientras el usuario escribe.
   - Categorización instantánea de carreras, universidades y áreas de estudio.
   - Búsquedas frecuentes y etiquetas directas (Medicina, Informática, Derecho, etc.).

2. **Catálogo y Ficha Informativa Completa**:
   - Duración (años y semestres).
   - Malla curricular desglosada por semestres con asignaturas.
   - Costos y aranceles (cuota mensual y matrícula estimada o gratuidad).
   - Modalidad: Presencial, Híbrida, Virtual / Online.
   - Sedes y ciudades disponibles con turnos (mañana, tarde, noche).
   - Perfil del egresado y competencias adquiridas.
   - Salidas profesionales y campo laboral.
   - Acreditación oficial ANEAES / CONES.

3. **Formulario de Contacto para Prospectos de Estudiantes**:
   - Selección de carrera e institución.
   - Guarda datos del estudiante: nombre, WhatsApp/teléfono, correo, ciudad de residencia, colegio secundario de egreso, año de egreso y turno de preferencia.
   - Animación interactiva de confirmación (confetti) y botón de contacto directo vía WhatsApp.
   - Almacenamiento seguro en Firestore (`datacampus_leads`).

4. **Módulo "¿No sabes qué estudiar?" (Test Vocacional)**:
   - Cuestionario dinámico de intereses y fortalezas personales.
   - Algoritmo psicopedagógico que calcula porcentajes de afinidad por área.
   - Arquetipos vocacionales (Arquitecto Digital, Sanador Científico, Defensor de la Justicia, etc.).
   - Mapeo directo y automático con las carreras del catálogo para inscripción o comparación.

5. **Comparador Lado a Lado & Recomendador Inteligente**:
   - Selección de hasta 4 carreras para contrastar en una matriz detallada.
   - **Sugerir cuál es la mejor carrera**: Evaluador que pondera según la prioridad del estudiante:
     - 💰 Menor Costo / Arancel Cero
     - ⚡ Menor Tiempo / Rapidez
     - 🏆 Acreditación Oficial ANEAES
     - 🌐 Flexibilidad Online / Híbrida
     - ⭐ Balance General
   - Resalta a la carrera ganadora con trofeo y justificación punto por punto.

6. **Panel de Administración Exclusivo ([/admin](http://localhost:5173/admin))**:
   - **Gestión de Socios (Poder Total)**: Creación y administración de socios con usuario y contraseña, con los mismos privilegios totales de administración que el usuario master.
   - **Analítica Avanzada de Prospectiva Universitaria**:
     - Filtros dinámicos por: Rango de Fechas (Presets: Hoy, 7d, 30d, Personalizado), Carrera, Universidad y Zona/Ciudad.
     - Métricas clave: Total de Leads, Tests Vocacionales completados, Tasa de Conversión y Zonas activas.
     - Gráficos interactivos: Carreras más demandadas, Universidades preferidas, Distribución geográfica/ciudades, Resultados y afinidades del test vocacional, Principales colegios secundarios de egreso.
     - Exportación de reporte analítico en archivo CSV con 1 clic.
   - **Usuarios para Universidades**:
     - Creación de cuentas institucionales asociadas a su universidad.
     - Panel exclusivo **`/portal-universidades`** (o `/universidades/portal`) donde las universidades inician sesión y acceden **únicamente** a sus facultades/carreras, mallas curriculares, costos y prospectos recibidos.
   - **Inyección de Anuncios Publicitarios (1200x400 px)**:
     - Configuración de anuncios con fecha de inicio y fecha de fin para controlar su vigencia automáticamente.
     - Dimensiones estándar de 1200x400 px con previsualización en tiempo real.
     - Hipervínculo de destino obligatorio (soporta enlaces externos o rutas internas).
     - Estados automáticos: Vigente, Programado, Expirado o Pausado.
   - **Cargas Masivas CSV**: Carga en lote para carreras y universidades con plantillas descargables, vista previa en tabla y confirmación directa.
   - **Credenciales Master**: `aldojeda92@gmail.com` / `Aldo3492018*`.

7. **Portal Institucional de Universidades ([/portal-universidades](http://localhost:5173/portal-universidades))**:
   - Acceso con usuarios asignados (ej. `admision@uca.edu.py` / `Uca2026*` o `informes@una.py` / `Una2026*`).
   - Gestión restringida: sólo pueden visualizar y actualizar las carreras, mallas curriculares, costos y prospectos de su propia institución.

---

## 🔒 Conexión Firebase (Proyecto `alerta-paraguay`)

Las colecciones de DATACAMPUS están estrictamente aisladas bajo el prefijo `datacampus_*` para **garantizar que ningún dato previo del proyecto sea modificado ni borrado**:
- `datacampus_universities`
- `datacampus_careers`
- `datacampus_leads`
- `datacampus_banners`
- `datacampus_settings`

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + Vite
- **Estilos**: Tailwind CSS con paleta moderna, bordes redondeados (`rounded-2xl`, `rounded-3xl`) y sombras suaves
- **Iconografía**: Lucide React
- **Base de Datos & Auth**: Firebase SDK (Firestore + Auth)
- **Parser CSV**: PapaParse
- **Efectos**: Canvas-Confetti

---

## 💻 Ejecución en Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

El servidor queda disponible en `http://localhost:5173/`.
