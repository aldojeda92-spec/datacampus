import React from 'react';

/**
 * BrandLogo - Implementación oficial del Wordmark DATACAMPUS
 * Referencia normativa: Brandbook DATABRAND V4.1, Lámina 03 (p. 4) y Lámina 04 (p. 5).
 * 
 * Reglas de marca inalterables:
 * 1. DATA siempre corporativo (#0A1F33 sobre fondos claros, blanco sobre fondos oscuros).
 * 2. Color solo en la terminación (CAMPUS en verde esmeralda #008F7A).
 * 3. Construcción sin isotipos: wordmark tipográfico dual sin símbolos ni birretes añadidos.
 */
export default function BrandLogo({ 
  variant = 'default', // 'default' (fondo claro) | 'negative' (fondo oscuro)
  size = 'md',         // 'sm' | 'md' | 'lg' | 'xl'
  showDescriptor = true,
  showEcosystem = false,
  className = ''
}) {
  const isNegative = variant === 'negative';

  const sizeClasses = {
    sm: {
      text: 'text-xl tracking-tight',
      descriptor: 'text-[9px] tracking-[0.22em]',
      ecosystem: 'text-[8px] tracking-[0.16em]',
    },
    md: {
      text: 'text-2xl sm:text-[28px] tracking-tight',
      descriptor: 'text-[10px] tracking-[0.24em]',
      ecosystem: 'text-[9px] tracking-[0.18em]',
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-tight',
      descriptor: 'text-xs tracking-[0.26em]',
      ecosystem: 'text-[10px] tracking-[0.2em]',
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-tight',
      descriptor: 'text-sm tracking-[0.28em]',
      ecosystem: 'text-xs tracking-[0.22em]',
    }
  };

  const current = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex flex-col select-none leading-none ${className}`}>
      {showEcosystem && (
        <span className={`font-semibold uppercase font-display text-slate-400 mb-1 ${current.ecosystem}`}>
          Una marca de <span className={isNegative ? 'text-slate-200 font-bold' : 'text-[#0A1F33] font-bold'}>DATABRAND</span>
        </span>
      )}

      {/* Dual Wordmark */}
      <div className={`flex items-baseline font-display ${current.text}`}>
        <span className={`font-black ${isNegative ? 'text-white' : 'text-[#0A1F33]'}`}>
          DATA
        </span>
        <span className="font-light text-[#008F7A]">
          CAMPUS
        </span>
      </div>

      {/* Category Descriptor */}
      {showDescriptor && (
        <span className={`font-bold uppercase font-display mt-1 ${current.descriptor} ${
          isNegative ? 'text-emerald-300' : 'text-[#087360]'
        }`}>
          Inteligencia Educativa
        </span>
      )}
    </div>
  );
}
