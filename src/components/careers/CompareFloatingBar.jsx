import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export default function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <aside aria-label="Barra de carreras en comparación" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto max-w-xl z-30 bg-slate-900/95 text-white backdrop-blur-md rounded-3xl p-4 shadow-floating border border-slate-700 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Left indicators */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Comparando ({compareList.length}/4)
              </p>
              <p className="text-[10px] text-slate-400">
                {compareList.length < 2 ? 'Agrega 1 carrera más para comparar' : '¡Listo para comparar!'}
              </p>
            </div>
          </div>

          <button
            onClick={clearCompare}
            className="sm:hidden text-[10px] font-semibold text-slate-400 hover:text-white underline"
          >
            Limpiar
          </button>
        </div>

        {/* Selected items badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
          {compareList.map((career) => (
            <div
              key={career.id}
              className="flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap"
            >
              <span className="truncate max-w-[100px] font-medium">{career.name}</span>
              <button
                type="button"
                onClick={() => removeFromCompare(career.id)}
                className="hover:text-red-400 p-0.5 rounded-full"
                title="Quitar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="hidden sm:inline-block text-xs font-semibold text-slate-400 hover:text-white px-2 py-1"
          >
            Limpiar
          </button>

          <Link
            to="/comparador"
            className="w-full sm:w-auto px-5 py-2.5 bg-campus-500 hover:bg-campus-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Comparar Ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
