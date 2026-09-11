import { useState, useEffect, FormEvent } from 'react';
import { X, Save, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { FiscalProduct } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: FiscalProduct) => void;
  productToEdit?: FiscalProduct | null;
  nextSuggestedCode: string;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  nextSuggestedCode
}: ProductFormModalProps) {
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('PCT');
  const [ncm, setNcm] = useState('');
  const [cest, setCest] = useState('');
  const [cfop, setCfop] = useState('5.102');
  const [cstIcms, setCstIcms] = useState('000');
  const [aliqIcms, setAliqIcms] = useState(19);
  const [protegeGo, setProtegeGo] = useState(false);
  const [benefFiscal, setBenefFiscal] = useState('Nenhum');
  const [cstPis, setCstPis] = useState('01');
  const [cstCofins, setCstCofins] = useState('01');
  const [regimePisCofins, setRegimePisCofins] = useState('Tributação Normal');
  const [aliqPis, setAliqPis] = useState(1.65);
  const [aliqCofins, setAliqCofins] = useState(7.60);
  const [aliqIbs, setAliqIbs] = useState(1.2);
  const [aliqCbs, setAliqCbs] = useState(0.9);
  const [aliqIs, setAliqIs] = useState(0);
  const [classificacaoReforma, setClassificacaoReforma] = useState('Tributação Padrão 2026 (1,2% IBS / 0,9% CBS)');
  const [observacao, setObservacao] = useState('');
  const [categoria, setCategoria] = useState('Mercearia');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setCodigo(productToEdit.codigo);
      setDescricao(productToEdit.descricao);
      setUnidade(productToEdit.unidade);
      setNcm(productToEdit.ncm);
      setCest(productToEdit.cest || '');
      setCfop(productToEdit.cfop || '5.102');
      setCstIcms(productToEdit.cstIcms);
      setAliqIcms(productToEdit.aliqIcms);
      setProtegeGo(!!productToEdit.protegeGo);
      setBenefFiscal(productToEdit.benefFiscal || 'Nenhum');
      setCstPis(productToEdit.cstPis);
      setCstCofins(productToEdit.cstCofins);
      setRegimePisCofins(productToEdit.regimePisCofins || 'Tributação Normal');
      setAliqPis(productToEdit.aliqPis);
      setAliqCofins(productToEdit.aliqCofins);
      setAliqIbs(productToEdit.aliqIbs);
      setAliqCbs(productToEdit.aliqCbs);
      setAliqIs(productToEdit.aliqIs || 0);
      setClassificacaoReforma(productToEdit.classificacaoReforma || 'Tributação Padrão 2026 (1,2% IBS / 0,9% CBS)');
      setObservacao(productToEdit.observacao || '');
      setCategoria(productToEdit.categoria || 'Mercearia');
    } else {
      setCodigo(nextSuggestedCode);
      setDescricao('');
      setUnidade('PCT');
      setNcm('');
      setCest('');
      setCfop('5.102');
      setCstIcms('000');
      setAliqIcms(19);
      setProtegeGo(false);
      setBenefFiscal('Nenhum');
      setCstPis('01');
      setCstCofins('01');
      setRegimePisCofins('Tributação Normal');
      setAliqPis(1.65);
      setAliqCofins(7.60);
      setAliqIbs(1.2);
      setAliqCbs(0.9);
      setAliqIs(0);
      setClassificacaoReforma('Tributação Padrão 2026 (1,2% IBS / 0,9% CBS)');
      setObservacao('');
      setCategoria('Mercearia');
    }
    setErrors({});
  }, [productToEdit, nextSuggestedCode, isOpen]);

  if (!isOpen) return null;

  const handleCstIcmsChange = (val: string) => {
    setCstIcms(val);
    if (val === '060') {
      setCfop('5.405');
      setAliqIcms(0);
      setBenefFiscal('Substituição Tributária (ST)');
      if (!observacao) setObservacao('Substituição Tributária (ST na fonte)');
    } else if (val === '020') {
      setCfop('5.102');
      setAliqIcms(7);
      setBenefFiscal('Cesta Básica GO (Art. 8º, VIII)');
    } else if (val === '040') {
      setCfop('5.102');
      setAliqIcms(0);
      setBenefFiscal('Isenção Hortifrúti (Art. 6º, I)');
    } else if (val === '000') {
      setCfop('5.102');
      setAliqIcms(19);
      setBenefFiscal('Nenhum');
    }
  };

  const handleCstPisCofinsChange = (pis: string, cofins: string) => {
    setCstPis(pis);
    setCstCofins(cofins);
    if (pis === '06') {
      setAliqPis(0.0);
      setAliqCofins(0.0);
      setRegimePisCofins('Alíquota Zero (Lei 10.925/04)');
    } else if (pis === '04') {
      setAliqPis(0.0);
      setAliqCofins(0.0);
      setRegimePisCofins('Monofásico no Varejo (Lei 13.097/15)');
    } else if (pis === '01') {
      setAliqPis(1.65);
      setAliqCofins(7.60);
      setRegimePisCofins('Lucro Real Não-Cumulativo');
    } else if (pis === '03') {
      setAliqPis(0.65);
      setAliqCofins(3.00);
      setRegimePisCofins('Lucro Presumido Cumulativo');
    }
  };

  const handleReformaClassificationChange = (val: string) => {
    setClassificacaoReforma(val);
    if (val.includes('Cesta Básica')) {
      setAliqIbs(0.0);
      setAliqCbs(0.0);
      setAliqIs(0.0);
    } else if (val.includes('Redução')) {
      setAliqIbs(0.48);
      setAliqCbs(0.36);
      setAliqIs(0.0);
    } else if (val.includes('Seletivo')) {
      setAliqIbs(1.2);
      setAliqCbs(0.9);
      if (aliqIs === 0) setAliqIs(10);
    } else {
      setAliqIbs(1.2);
      setAliqCbs(0.9);
      setAliqIs(0);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!ncm.trim()) newErrors.ncm = 'NCM (8 dígitos) é obrigatório';
    if (cstIcms === '060' && !cest.trim()) {
      newErrors.cest = 'CEST é obrigatório para produtos com Substituição Tributária (CST 060)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      codigo: codigo.trim(),
      descricao: descricao.trim(),
      unidade,
      ncm: ncm.trim(),
      cest: cest.trim() || '—',
      cfop: cfop.trim() || '5.102',
      cstIcms,
      aliqIcms: Number(aliqIcms) || 0,
      protegeGo,
      benefFiscal: benefFiscal.trim() || 'Nenhum',
      cstPis,
      cstCofins,
      regimePisCofins,
      aliqPis: Number(aliqPis) || 0,
      aliqCofins: Number(aliqCofins) || 0,
      aliqIbs: Number(aliqIbs) || 0,
      aliqCbs: Number(aliqCbs) || 0,
      aliqIs: Number(aliqIs) || 0,
      classificacaoReforma,
      observacao: observacao.trim() || '—',
      categoria
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="modal-product-form"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-lg text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {productToEdit ? 'Editar Cadastro Fiscal' : 'Adicionar Novo Produto Fiscal'}
              </h2>
              <p className="text-xs text-slate-300">
                Estrutura oficial GO 2026 · NCM, CEST, CSTs e Reforma Tributária (IBS/CBS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Dados do Produto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b pb-1.5">
              <span>1. Identificação Básica (Colunas A, B, C)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cód. Interno (A)*
                </label>
                <input
                  id="form-codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: 039"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    errors.codigo ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.codigo && <span className="text-[11px] text-rose-600">{errors.codigo}</span>}
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição do Produto (B)*
                </label>
                <input
                  id="form-descricao"
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Café Torrado Especial 500g"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.descricao ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.descricao && <span className="text-[11px] text-rose-600">{errors.descricao}</span>}
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unidade (C)*
                </label>
                <select
                  id="form-unidade"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="PCT">PCT (Pacote)</option>
                  <option value="KG">KG (Quilo)</option>
                  <option value="UN">UN (Unidade)</option>
                  <option value="CX">CX (Caixa)</option>
                  <option value="LT">LT (Lata)</option>
                  <option value="GF">GF (Garrafa)</option>
                  <option value="TB">TB (Tubo/Pote)</option>
                  <option value="BD">BD (Bandeja)</option>
                  <option value="SCH">SCH (Sachê)</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  id="form-categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mercearia">Mercearia</option>
                  <option value="Hortifrúti">Hortifrúti</option>
                  <option value="Açougue">Açougue</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Frios & Laticínios">Frios & Laticínios</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Padaria">Padaria</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: NCM, CEST e ICMS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b pb-1.5">
              <span>2. Classificação Fiscal & ICMS Goiás (Colunas D, E, F, G, H & CFOP)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NCM (8 dígitos) (D)*
                </label>
                <input
                  id="form-ncm"
                  type="text"
                  value={ncm}
                  onChange={(e) => setNcm(e.target.value)}
                  placeholder="Ex: 1006.30.21"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    errors.ncm ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.ncm && <span className="text-[11px] text-rose-600">{errors.ncm}</span>}
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>CEST (7 dígitos) (E)</span>
                  {cstIcms === '060' && <span className="text-amber-700 text-[10px] font-bold">Obrigatório ST</span>}
                </label>
                <input
                  id="form-cest"
                  type="text"
                  value={cest}
                  onChange={(e) => setCest(e.target.value)}
                  placeholder="Ex: 03.007.00"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    errors.cest ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                  }`}
                />
                {errors.cest && <span className="text-[11px] text-rose-600">{errors.cest}</span>}
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CFOP no PDV*
                </label>
                <select
                  id="form-cfop"
                  value={cfop}
                  onChange={(e) => setCfop(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-medium"
                >
                  <option value="5.102">5.102 — Venda de Terceiros</option>
                  <option value="5.405">5.405 — Venda Mercadoria com ST</option>
                  <option value="5.101">5.101 — Fabricação Própria (Padaria/Açougue)</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CST ICMS (F)*
                </label>
                <select
                  id="form-cst-icms"
                  value={cstIcms}
                  onChange={(e) => handleCstIcmsChange(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="020">020 — Cesta Básica GO (7%)</option>
                  <option value="040">040 — Isenção Hortifrúti (0%)</option>
                  <option value="060">060 — Substituição Tributária (ST)</option>
                  <option value="000">000 — Tributação Normal (19%)</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alíq. ICMS % (G)
                </label>
                <input
                  id="form-aliq-icms"
                  type="number"
                  step="0.01"
                  value={aliqIcms}
                  onChange={(e) => setAliqIcms(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
                <span className="text-[10px] text-slate-500">GO = 19% (Lei 22.460/23)</span>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Benefício Fiscal (H)
                </label>
                <input
                  id="form-benef-fiscal"
                  type="text"
                  value={benefFiscal}
                  onChange={(e) => setBenefFiscal(e.target.value)}
                  placeholder="Ex: Cesta Básica GO"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Protege GO Checkbox */}
            <div className="mt-3 flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <input
                id="form-protege-go"
                type="checkbox"
                checked={protegeGo}
                onChange={(e) => setProtegeGo(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="form-protege-go" className="text-xs text-slate-700 cursor-pointer">
                <strong>Fundo PROTEGE GOIÁS (+2% de ICMS):</strong> Aplicável a produtos considerados supérfluos (bebidas alcoólicas, cervejas, cigarros) conforme Lei Estadual nº 14.469/2003.
              </label>
            </div>

            {cstIcms === '060' && (
              <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Substituição Tributária (CST 060):</strong> Exige preenchimento do código CEST de 7 dígitos e CFOP 5.405 na saída. O imposto estadual já foi retido na indústria.
                </span>
              </div>
            )}
          </div>

          {/* Section 3: PIS / COFINS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b pb-1.5">
              <span>3. PIS e COFINS no Varejo (Colunas I, J, K, L)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CST PIS (I)
                </label>
                <select
                  id="form-cst-pis"
                  value={cstPis}
                  onChange={(e) => handleCstPisCofinsChange(e.target.value, cstCofins)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="06">06 — Alíquota Zero (Cesta Básica / Carnes)</option>
                  <option value="04">04 — Tributação Monofásica (Bebidas / Higiene)</option>
                  <option value="01">01 — Tributação Normal (Não-Cumulativo 1,65%)</option>
                  <option value="03">03 — Alíquota Cumulativa (Presumido 0,65%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIS % Efetivo (K)
                </label>
                <input
                  id="form-aliq-pis"
                  type="number"
                  step="0.01"
                  value={aliqPis}
                  onChange={(e) => setAliqPis(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CST COFINS (J)
                </label>
                <select
                  id="form-cst-cofins"
                  value={cstCofins}
                  onChange={(e) => handleCstPisCofinsChange(cstPis, e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="06">06 — Alíquota Zero (Cesta Básica / Carnes)</option>
                  <option value="04">04 — Tributação Monofásica (Bebidas / Higiene)</option>
                  <option value="01">01 — Tributação Normal (Não-Cumulativo 7,60%)</option>
                  <option value="03">03 — Alíquota Cumulativa (Presumido 3,00%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  COFINS % Efetivo (L)
                </label>
                <input
                  id="form-aliq-cofins"
                  type="number"
                  step="0.01"
                  value={aliqCofins}
                  onChange={(e) => setAliqCofins(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Regime atual: <strong>{regimePisCofins}</strong> (Em supermercados, produtos da Cesta Básica contam com PIS/COFINS Zero pela Lei 10.925/04 e bebidas frias/higiene são monofásicos com alíquota zero no varejo).
            </p>
          </div>

          {/* Section 4: Reforma Tributária 2026 (IBS e CBS) & Observações */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b pb-1.5">
              <span>4. Reforma Tributária 2026 (IBS, CBS & Imposto Seletivo) (Colunas M, N, O)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classificação na Reforma Tributária
                </label>
                <select
                  id="form-classificacao-reforma"
                  value={classificacaoReforma}
                  onChange={(e) => handleReformaClassificationChange(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-blue-300 bg-blue-50/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Cesta Básica Nacional (0% IBS/CBS)">Cesta Básica Nacional (Alíquota 0% IBS/CBS)</option>
                  <option value="Redução de 60% (0,48% IBS / 0,36% CBS)">Redução de 60% (Alimentos Especiais / Higiene)</option>
                  <option value="Tributação Padrão 2026 (1,2% IBS / 0,9% CBS)">Tributação Padrão 2026 (1,2% IBS / 0,9% CBS)</option>
                  <option value="Imposto Seletivo (Bebidas Alcoólicas / Açucaradas)">Imposto Seletivo (IS - Bebidas Alcoólicas / Açucaradas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">
                  IBS % (M)
                </label>
                <input
                  id="form-aliq-ibs"
                  type="number"
                  step="0.01"
                  value={aliqIbs}
                  onChange={(e) => setAliqIbs(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-blue-300 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-blue-900"
                />
                <span className="text-[10px] text-blue-600">Estadual/Municipal</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-900 mb-1">
                  CBS % (N)
                </label>
                <input
                  id="form-aliq-cbs"
                  type="number"
                  step="0.01"
                  value={aliqCbs}
                  onChange={(e) => setAliqCbs(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-indigo-300 bg-indigo-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-900"
                />
                <span className="text-[10px] text-indigo-600">Federal</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">
                  Imposto Seletivo % (IS)
                </label>
                <input
                  id="form-aliq-is"
                  type="number"
                  step="0.01"
                  value={aliqIs}
                  onChange={(e) => setAliqIs(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-rose-300 bg-rose-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold text-rose-900"
                />
                <span className="text-[10px] text-rose-600">Supérfluos / Açúcar</span>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observação Operacional (O)
              </label>
              <input
                id="form-observacao"
                type="text"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Cesta básica estadual e federal, isenção ou regime especial..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-save-product"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Produto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
