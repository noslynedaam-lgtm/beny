import { Package, ShieldAlert, CheckCircle2, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { FiscalProduct } from '../types';

interface SummaryCardsProps {
  products: FiscalProduct[];
  activeFilter: 'all' | 'st' | 'normal' | 'alimentos';
  onFilterChange: (filter: 'all' | 'st' | 'normal' | 'alimentos') => void;
}

export function SummaryCards({ products, activeFilter, onFilterChange }: SummaryCardsProps) {
  const total = products.length;
  const totalST = products.filter(p => p.cstIcms === '060').length;
  const totalNormal = products.filter(p => p.cstIcms === '000').length;
  const totalCesta = products.filter(p => 
    p.cstIcms === '020' || 
    p.cstIcms === '040' || 
    p.categoria === 'Hortifrúti' ||
    p.classificacaoReforma === 'Cesta Básica Nacional (0% IBS/CBS)'
  ).length;

  return (
    <section id="summary-metrics" className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Card 1: Total */}
      <button
        onClick={() => onFilterChange('all')}
        className={`p-4 sm:p-5 rounded-xl text-left transition-all border cursor-pointer ${
          activeFilter === 'all'
            ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-400/20 shadow-sm'
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Cadastrados</span>
          <Package className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900">{total}</div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span>78 itens de supermercado</span>
          {activeFilter === 'all' && <span className="font-semibold text-blue-600">(todos)</span>}
        </p>
      </button>

      {/* Card 2: Substituição Tributária (ST) */}
      <button
        onClick={() => onFilterChange('st')}
        className={`p-4 sm:p-5 rounded-xl text-left transition-all border cursor-pointer ${
          activeFilter === 'st'
            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Subst. Tributária (ST)</span>
          <ShieldAlert className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-amber-700">{totalST}</div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span>CST 060 · CFOP 5.405</span>
          {activeFilter === 'st' && <span className="font-semibold text-amber-700">(filtrado)</span>}
        </p>
      </button>

      {/* Card 3: Tributação Normal */}
      <button
        onClick={() => onFilterChange('normal')}
        className={`p-4 sm:p-5 rounded-xl text-left transition-all border cursor-pointer ${
          activeFilter === 'normal'
            ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Tributação Normal</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{totalNormal}</div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span>CST 000 (ICMS GO 19%)</span>
          {activeFilter === 'normal' && <span className="font-semibold text-emerald-700">(filtrado)</span>}
        </p>
      </button>

      {/* Card 4: Alimentos Básicos / Hortifrúti */}
      <button
        onClick={() => onFilterChange('alimentos')}
        className={`p-4 sm:p-5 rounded-xl text-left transition-all border cursor-pointer ${
          activeFilter === 'alimentos'
            ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-400/20 shadow-sm'
            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Cesta Básica / Hortifrúti</span>
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-indigo-700">{totalCesta}</div>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span>CST 020 (7%) / CST 040 (0%)</span>
          {activeFilter === 'alimentos' && <span className="font-semibold text-indigo-700">(filtrado)</span>}
        </p>
      </button>
    </section>
  );
}
