import { useState, useMemo } from 'react';
import { Calculator, ArrowRight, ShieldAlert, Sparkles, Percent, DollarSign, Info } from 'lucide-react';
import { FiscalProduct } from '../types';
import { calculateProductTaxes, formatCurrencyBRL, formatPercent } from '../utils/exportUtils';

interface TaxCalculatorProps {
  products: FiscalProduct[];
  selectedProduct?: FiscalProduct | null;
  onSelectProduct: (product: FiscalProduct) => void;
}

export function TaxCalculator({ products, selectedProduct, onSelectProduct }: TaxCalculatorProps) {
  const [currentProduct, setCurrentProduct] = useState<FiscalProduct>(
    selectedProduct || products[0] || null
  );
  const [precoInput, setPrecoInput] = useState<string>('10.00');

  // Sync if selectedProduct changes externally
  useMemo(() => {
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
    }
  }, [selectedProduct]);

  const precoNumerico = Math.max(0, parseFloat(precoInput.replace(',', '.')) || 0);

  const calc = useMemo(() => {
    if (!currentProduct) return null;
    return calculateProductTaxes(currentProduct, precoNumerico);
  }, [currentProduct, precoNumerico]);

  const isST = currentProduct?.cstIcms === '060';

  return (
    <div id="tax-calculator-view" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Simulador Fiscal & Cálculo de Carga Tributária 2026
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Simule o impacto do ICMS GO (18%), PIS, COFINS e a nova sistemática da Reforma Tributária (IBS 1,2% + CBS 0,9%).
          </p>
        </div>

        {/* Product selector dropdown */}
        <div className="w-full md:w-80">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Selecione o Produto para Simular:
          </label>
          <select
            id="calculator-product-select"
            value={currentProduct?.id || ''}
            onChange={(e) => {
              const prod = products.find(p => p.id === e.target.value);
              if (prod) {
                setCurrentProduct(prod);
                onSelectProduct(prod);
              }
            }}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                [{p.codigo}] {p.descricao} ({p.unidade}) - CST {p.cstIcms}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentProduct && calc && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Fiscal Card and Price Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Cód. {currentProduct.codigo}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isST ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {isST ? 'Substituição Tributária (ST)' : 'Tributação Normal'}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1">
                {currentProduct.descricao}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                NCM: <strong className="font-mono text-slate-700">{currentProduct.ncm}</strong>
                {currentProduct.cest && currentProduct.cest !== '—' && (
                  <span> · CEST: <strong className="font-mono text-slate-700">{currentProduct.cest}</strong></span>
                )}
                {currentProduct.categoria && (
                  <span> · Categoria: <strong className="text-slate-700">{currentProduct.categoria}</strong></span>
                )}
              </p>

              {/* Price Input Field */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preço de Venda Praticado (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    R$
                  </span>
                  <input
                    id="input-calc-preco"
                    type="number"
                    step="0.10"
                    min="0"
                    value={precoInput}
                    onChange={(e) => setPrecoInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-11 pr-4 py-2.5 text-xl font-bold text-slate-900 bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[5, 10, 25, 50, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => setPrecoInput(val.toFixed(2))}
                      className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
              </div>

              {isST && (
                <div className="mt-4 p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Nota Fiscal ICMS ST:</strong> Para produtos com CST 060 (como refrigerantes e cervejas), o ICMS estadual já foi recolhido antecipadamente pelo fabricante ou distribuidor. Na saída do varejista não há novo destaque de débito de ICMS.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Breakdown Table and Summary Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block mb-1">Preço Bruto</span>
                <span className="text-xl font-bold text-slate-900">
                  {formatCurrencyBRL(calc.precoVenda)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">100% da venda</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-semibold text-rose-700 block mb-1">Total de Tributos</span>
                <span className="text-xl font-bold text-rose-700">
                  {formatCurrencyBRL(calc.totalImpostos)}
                </span>
                <span className="text-[11px] text-rose-600 block mt-0.5">
                  Carga efetiva: <strong>{formatPercent(calc.percentualCarga)}</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-700 block mb-1">Receita Líquida</span>
                <span className="text-xl font-bold text-emerald-800">
                  {formatCurrencyBRL(calc.valorLiquido)}
                </span>
                <span className="text-[11px] text-emerald-600 block mt-0.5">
                  Margem pré-custo mercadoria
                </span>
              </div>
            </div>

            {/* Detailed Tax Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Demonstrativo Fiscal Item a Item</span>
                <span className="text-blue-300 font-normal">Reforma Tributária 2026</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">Tributo / Enquadramento</th>
                    <th className="py-2.5 px-3 text-center">Esfera</th>
                    <th className="py-2.5 px-3 text-center">Alíquota</th>
                    <th className="py-2.5 px-4 text-right">Valor Calculado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {/* ICMS */}
                  <tr className={isST ? 'bg-amber-50/30' : ''}>
                    <td className="py-2.5 px-4 text-slate-800">
                      <div className="font-semibold">ICMS Goiás (CST {currentProduct.cstIcms})</div>
                      <div className="text-[11px] text-slate-500">
                        {isST ? 'Cobrado por ST no início da cadeia' : 'Tributação normal estadual'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Estadual (GO)</td>
                    <td className="py-2.5 px-3 text-center text-slate-800 font-mono">
                      {isST ? 'ST (Retido)' : `${currentProduct.aliqIcms}%`}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrencyBRL(calc.valorIcms)}
                    </td>
                  </tr>

                  {/* PIS */}
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800">
                      <div className="font-semibold">PIS (CST {currentProduct.cstPis})</div>
                      <div className="text-[11px] text-slate-500">Programa de Integração Social</div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Federal</td>
                    <td className="py-2.5 px-3 text-center text-slate-800 font-mono">
                      {currentProduct.aliqPis.toFixed(2).replace('.', ',')}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrencyBRL(calc.valorPis)}
                    </td>
                  </tr>

                  {/* COFINS */}
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800">
                      <div className="font-semibold">COFINS (CST {currentProduct.cstCofins})</div>
                      <div className="text-[11px] text-slate-500">Financiamento da Seguridade Social</div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">Federal</td>
                    <td className="py-2.5 px-3 text-center text-slate-800 font-mono">
                      {currentProduct.aliqCofins.toFixed(2).replace('.', ',')}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrencyBRL(calc.valorCofins)}
                    </td>
                  </tr>

                  {/* IBS (Nova Reforma) */}
                  <tr className="bg-blue-50/40">
                    <td className="py-2.5 px-4 text-blue-950">
                      <div className="font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>IBS — Imposto Bens e Serviços</span>
                      </div>
                      <div className="text-[11px] text-blue-700">
                        Novo tributo estadual e municipal (Reforma Tributária 2026)
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-blue-800 font-medium">Estadual / Mun.</td>
                    <td className="py-2.5 px-3 text-center text-blue-900 font-mono font-bold">
                      {currentProduct.aliqIbs.toFixed(1).replace('.', ',')}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-blue-900">
                      {formatCurrencyBRL(calc.valorIbs)}
                    </td>
                  </tr>

                  {/* CBS (Nova Reforma) */}
                  <tr className="bg-indigo-50/40">
                    <td className="py-2.5 px-4 text-indigo-950">
                      <div className="font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>CBS — Contribuição Bens e Serviços</span>
                      </div>
                      <div className="text-[11px] text-indigo-700">
                        Novo tributo federal unificado (Reforma Tributária 2026)
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-indigo-800 font-medium">Federal</td>
                    <td className="py-2.5 px-3 text-center text-indigo-900 font-mono font-bold">
                      {currentProduct.aliqCbs.toFixed(1).replace('.', ',')}%
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-indigo-900">
                      {formatCurrencyBRL(calc.valorCbs)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-100 font-bold text-slate-900 text-xs border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-right">
                      SOMA TOTAL DOS TRIBUTOS:
                    </td>
                    <td className="py-3 px-4 text-right text-rose-700 font-mono text-sm">
                      {formatCurrencyBRL(calc.totalImpostos)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Aviso Legal & Contábil:</strong> As alíquotas de IBS (1,2%) e CBS (0,9%) representam a fase de implementação e transição da Reforma Tributária. Conforme regulamentação e aprovação de leis complementares pelos órgãos fiscais de Goiás e Receita Federal, certas cestas básicas e medicamentos terão alíquota reduzida a zero ou 60% de desconto.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
