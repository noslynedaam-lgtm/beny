import { FileSpreadsheet, Calculator, BookOpen, Plus, Download, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { FiscalTab } from '../types';

interface HeaderProps {
  currentTab: FiscalTab;
  onTabChange: (tab: FiscalTab) => void;
  onOpenNewProduct: () => void;
  onExportCsv: () => void;
  onOpenAsciiModal: () => void;
  onResetDefaults: () => void;
  isModified: boolean;
}

export function Header({
  currentTab,
  onTabChange,
  onOpenNewProduct,
  onExportCsv,
  onOpenAsciiModal,
  onResetDefaults,
  isModified
}: HeaderProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  return (
    <header id="app-header" className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/50 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Modelo Oficial · Goiás 2026
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Reforma Tributária (IBS / CBS / Seletivo)
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ICMS GO 19% (Lei 22.460/23)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>📋 Planilha Fiscal de Produtos</span>
            <span className="text-blue-400 text-xl font-normal hidden sm:inline">— Supermercado</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1.5 max-w-3xl leading-relaxed">
            Base oficial atualizada com todas as colunas fiscais (A a O), NCM, CEST, CFOP, CST ICMS/PIS/COFINS, Fundo Protege GO (+2%) e nova tributação IBS/CBS 2026.
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-add-product"
            onClick={onOpenNewProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>

          <button
            id="btn-export-csv"
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
            title="Exportar para Excel / CSV em formato brasileiro com ponto-e-vírgula"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            id="btn-view-ascii"
            onClick={onOpenAsciiModal}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Visualizar formato textual / pronto para copiar"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden md:inline">Texto / Copiar</span>
          </button>

          {isModified && (
            <button
              id="btn-reset-defaults"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-2 px-3 py-2.5 bg-slate-800/80 hover:bg-rose-950 text-rose-300 hover:text-rose-200 text-xs font-medium rounded-xl border border-rose-900/40 transition-colors cursor-pointer"
              title="Restaurar base oficial atualizada com 78 produtos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Base (78)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
        <button
          id="tab-btn-tabela"
          onClick={() => onTabChange('tabela')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'tabela'
              ? 'bg-white text-slate-900 shadow font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-500" />
          <span>Planilha Fiscal Completa (A a O)</span>
        </button>

        <button
          id="tab-btn-calculadora"
          onClick={() => onTabChange('calculadora')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'calculadora'
              ? 'bg-white text-slate-900 shadow font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-500" />
          <span>Simulador de Tributos & Margem</span>
        </button>

        <button
          id="tab-btn-guia"
          onClick={() => onTabChange('guia')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'guia'
              ? 'bg-white text-slate-900 shadow font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Guia de Códigos & Legislação GO</span>
        </button>
      </div>
    </header>
  );
}
