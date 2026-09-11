import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, FileSpreadsheet, Sparkles } from 'lucide-react';
import { FISCAL_COLUMNS, FISCAL_EXPLANATIONS } from '../data/fiscalCodes';

export function FiscalGuide() {
  return (
    <div id="fiscal-guide-container" className="space-y-6">
      {/* Section 1: Colunas A a O */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Estrutura Oficial das Colunas (A a O) — Modelo 2026 Goiás
            </h2>
            <p className="text-sm text-slate-500">
              Padrão cadastral homologado para sistemas ERP e pontos de venda (PDV / NFC-e) de supermercados.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <th className="py-2.5 px-3 font-semibold text-center w-12">Col.</th>
                <th className="py-2.5 px-4 font-semibold w-48">NOME DA COLUNA</th>
                <th className="py-2.5 px-4 font-semibold w-72">O QUE É</th>
                <th className="py-2.5 px-4 font-semibold">DETALHES & ORIENTAÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {FISCAL_COLUMNS.map((c) => (
                <tr key={c.col} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700 bg-blue-50/40">
                    {c.col}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {c.nome}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    {c.oQueE}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {c.detalhes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Explicação dos Códigos Fiscais */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Explicação dos Códigos Fiscais — Guia de Conferência Rápida
            </h2>
            <p className="text-sm text-slate-500">
              Significado de cada código de situação tributária para auditar notas e cadastros fiscais.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <th className="py-2.5 px-4 font-semibold w-44">CÓDIGO</th>
                <th className="py-2.5 px-5 font-semibold">O QUE SIGNIFICA</th>
                <th className="py-2.5 px-5 font-semibold">USO GERAL NO SUPERMERCADO</th>
                <th className="py-2.5 px-5 font-semibold">EXEMPLOS PRÁTICOS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {FISCAL_EXPLANATIONS.map((exp) => (
                <tr key={exp.codigo} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-900 bg-slate-50">
                    {exp.codigo}
                  </td>
                  <td className="py-3 px-5 font-medium text-slate-800">
                    {exp.significado}
                  </td>
                  <td className="py-3 px-5 text-slate-600">
                    {exp.usoGeral}
                  </td>
                  <td className="py-3 px-5 text-slate-500">
                    {exp.exemplo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Observações Críticas da Reforma Tributária 2026 em Goiás */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
              <span>⚠️ Observação Importante sobre o IBS e CBS (Reforma Tributária 2026)</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>1. Fase de Transição e Testes:</strong> O IBS (1,2%) e a CBS (0,9%) estão com as alíquotas projetadas para o período de transição da Reforma Tributária (Emenda Constitucional nº 132).
              </p>
              <p>
                <strong>2. Substituição Progressiva:</strong> A CBS substituirá o PIS e a COFINS federais, enquanto o IBS unificará o ICMS estadual e o ISS municipal, garantindo o princípio da não-cumulatividade plena (crédito financeiro).
              </p>
              <p>
                <strong>3. Cesta Básica Nacional Isenta:</strong> Diversos itens de alimentação primária (arroz, feijão, leite, pão) receberão alíquota zero ou redução substancial no regulamento final. Mantenha os cadastros revisados com seu escritório contábil em Goiás!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
