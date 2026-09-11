import { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  Calculator, 
  Copy, 
  Check, 
  ShieldAlert, 
  HelpCircle,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FiscalProduct } from '../types';

interface FiscalTableProps {
  products: FiscalProduct[];
  onEdit: (product: FiscalProduct) => void;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (product: FiscalProduct) => void;
  onSimulateTaxes: (product: FiscalProduct) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  cstFilter: string;
  onSelectCstFilter: (cst: string) => void;
}

type SortField = 'codigo' | 'descricao' | 'ncm' | 'cstIcms' | 'aliqIcms';

export function FiscalTable({
  products,
  onEdit,
  onDelete,
  onDuplicate,
  onSimulateTaxes,
  selectedCategory,
  onSelectCategory,
  cstFilter,
  onSelectCstFilter
}: FiscalTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('codigo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch = searchTerm === '' || 
        p.codigo.toLowerCase().includes(lowerSearch) ||
        p.descricao.toLowerCase().includes(lowerSearch) ||
        p.ncm.includes(searchTerm) ||
        (p.cfop && p.cfop.includes(searchTerm)) ||
        (p.cest && p.cest.includes(searchTerm)) ||
        (p.benefFiscal && p.benefFiscal.toLowerCase().includes(lowerSearch)) ||
        (p.classificacaoReforma && p.classificacaoReforma.toLowerCase().includes(lowerSearch)) ||
        (p.observacao && p.observacao.toLowerCase().includes(lowerSearch));

      const matchCategory = selectedCategory === 'all' || p.categoria === selectedCategory;
      const matchCst = cstFilter === 'all' || p.cstIcms === cstFilter;

      return matchSearch && matchCategory && matchCst;
    });
  }, [products, searchTerm, selectedCategory, cstFilter]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'codigo') {
        valA = parseInt(a.codigo, 10) || a.codigo;
        valB = parseInt(b.codigo, 10) || b.codigo;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCopyRowData = (p: FiscalProduct) => {
    const rowText = `${p.codigo}\t${p.descricao}\t${p.unidade}\t${p.ncm}\t${p.cest || '—'}\t${p.cstIcms}\t${p.aliqIcms}%\t${p.cstPis}\t${p.cstCofins}\t${p.aliqPis}%\t${p.aliqCofins}%\t${p.aliqIbs}%\t${p.aliqCbs}%\t${p.observacao || '—'}`;
    navigator.clipboard.writeText(rowText);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="fiscal-table-container" className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Search and filtering tool bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-products"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Pesquisar por descrição, código, NCM (ex: 1006) ou CEST..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-category-filter"
              value={selectedCategory}
              onChange={(e) => {
                onSelectCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* CST ICMS Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <select
              id="select-cst-filter"
              value={cstFilter}
              onChange={(e) => {
                onSelectCstFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">Todos os CST ICMS</option>
              <option value="020">CST 020 — Cesta Básica GO (7%)</option>
              <option value="040">CST 040 — Isenção Hortifrúti (0%)</option>
              <option value="060">CST 060 — Substituição Tributária (ST)</option>
              <option value="000">CST 000 — Tributação Normal (19%)</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium pl-1">
            <span className="font-semibold text-slate-800">{sortedProducts.length}</span> {sortedProducts.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>

      {/* Main Fiscal Table (Columns A through O) */}
      <div className="overflow-x-auto">
        <table id="main-fiscal-table" className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-200 border-b border-slate-800 select-none">
              <th className="py-3 px-3.5 font-semibold tracking-wider cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap" onClick={() => handleSort('codigo')}>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-blue-400 font-mono">A:</span>
                  <span>CÓD</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3.5 font-semibold tracking-wider cursor-pointer hover:bg-slate-800 transition-colors min-w-[260px]" onClick={() => handleSort('descricao')}>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-blue-400 font-mono">B:</span>
                  <span>DESCRIÇÃO DO PRODUTO / CFOP</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                <span className="text-[10px] text-blue-400 font-mono">C:</span> UN
              </th>
              <th className="py-3 px-3 font-semibold cursor-pointer hover:bg-slate-800 transition-colors whitespace-nowrap" onClick={() => handleSort('ncm')}>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-blue-400 font-mono">D:</span>
                  <span>NCM</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">
                <span className="text-[10px] text-amber-400 font-mono">E:</span> CEST (ST)
              </th>
              <th className="py-3 px-2.5 font-semibold cursor-pointer hover:bg-slate-800 transition-colors text-center whitespace-nowrap" onClick={() => handleSort('cstIcms')}>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] text-blue-400 font-mono">F:</span>
                  <span>CST ICMS</span>
                </div>
              </th>
              <th className="py-3 px-2.5 font-semibold text-center whitespace-nowrap">
                <span className="text-[10px] text-blue-400 font-mono">G:</span> ICMS %
              </th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">
                <span className="text-[10px] text-blue-400 font-mono">H:</span> BENEFÍCIO / PROTEGE
              </th>
              <th className="py-3 px-2 font-semibold text-center whitespace-nowrap" title="CST PIS e CST COFINS">
                <span className="text-[10px] text-blue-400 font-mono">I/J:</span> PIS/COF
              </th>
              <th className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                <span className="text-[10px] text-blue-400 font-mono">K:</span> PIS %
              </th>
              <th className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                <span className="text-[10px] text-blue-400 font-mono">L:</span> COF %
              </th>
              <th className="py-3 px-2.5 font-semibold text-center whitespace-nowrap bg-blue-950/80 text-blue-200">
                <span className="text-[10px] text-emerald-400 font-mono">M:</span> IBS %
              </th>
              <th className="py-3 px-2.5 font-semibold text-center whitespace-nowrap bg-blue-950/80 text-blue-200">
                <span className="text-[10px] text-emerald-400 font-mono">N:</span> CBS %
              </th>
              <th className="py-3 px-3 font-semibold min-w-[170px]">
                <span className="text-[10px] text-blue-400 font-mono">O:</span> OBSERVAÇÃO / REFORMA
              </th>
              <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-12 text-center text-slate-500">
                  <p className="text-sm font-medium">Nenhum produto encontrado com os filtros atuais.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      onSelectCategory('all');
                      onSelectCstFilter('all');
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Limpar filtros de busca
                  </button>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const isST = p.cstIcms === '060';
                return (
                  <tr 
                    key={p.id}
                    id={`product-row-${p.codigo}`}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isST ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* A: Código */}
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {p.codigo}
                    </td>

                    {/* B: Descrição & CFOP */}
                    <td className="py-2.5 px-3.5 font-medium text-slate-900">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{p.descricao}</span>
                          {p.categoria && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-normal">
                              {p.categoria}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          {p.cfop && (
                            <span className="font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium" title="Código Fiscal de Operações e Prestações">
                              CFOP {p.cfop}
                            </span>
                          )}
                          {p.classificacaoReforma === 'Cesta Básica Nacional (0% IBS/CBS)' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                              Cesta Básica 0%
                            </span>
                          )}
                          {p.aliqIs && p.aliqIs > 0 ? (
                            <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                              Imposto Seletivo (IS {p.aliqIs}%)
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* C: Unidade */}
                    <td className="py-2.5 px-2 text-center font-semibold text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80">
                        {p.unidade}
                      </span>
                    </td>

                    {/* D: NCM */}
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {p.ncm}
                    </td>

                    {/* E: CEST */}
                    <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                      {isST ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300">
                          <ShieldAlert className="w-3 h-3 text-amber-700" />
                          {p.cest}
                        </span>
                      ) : (
                        <span className="text-slate-400">{p.cest || '—'}</span>
                      )}
                    </td>

                    {/* F: CST ICMS */}
                    <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                      <span className={`inline-block font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p.cstIcms === '020'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : p.cstIcms === '040'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isST
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {p.cstIcms}
                      </span>
                    </td>

                    {/* G: ALÍQ ICMS % */}
                    <td className="py-2.5 px-2.5 text-center font-medium text-slate-800 whitespace-nowrap">
                      {p.aliqIcms}%
                    </td>

                    {/* H: BENEFÍCIO FISCAL / PROTEGE */}
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 items-start">
                        {p.benefFiscal && p.benefFiscal !== 'Nenhum' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            {p.benefFiscal}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                        {p.protegeGo && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-medium" title="Fundo Protege Goiás (+2%) - Lei 14.469/03">
                            Protege GO (+2%)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* I/J: CST PIS / COFINS */}
                    <td className="py-2.5 px-2 text-center font-mono text-slate-600 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        p.cstPis === '06'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                          : p.cstPis === '04'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`} title={p.cstPis === '06' ? 'Alíquota Zero (Lei 10.925/04)' : p.cstPis === '04' ? 'Monofásico no Varejo' : 'Tributação Normal'}>
                        {p.cstPis}/{p.cstCofins}
                      </span>
                    </td>

                    {/* K: PIS % */}
                    <td className="py-2.5 px-2 text-center text-slate-700 whitespace-nowrap">
                      {p.aliqPis.toFixed(2).replace('.', ',')}%
                    </td>

                    {/* L: COFINS % */}
                    <td className="py-2.5 px-2 text-center text-slate-700 whitespace-nowrap">
                      {p.aliqCofins.toFixed(2).replace('.', ',')}%
                    </td>

                    {/* M: IBS % (Reforma Tributária) */}
                    <td className="py-2.5 px-2.5 text-center font-semibold text-blue-700 bg-blue-50/40 whitespace-nowrap">
                      {p.aliqIbs.toFixed(2).replace('.', ',')}%
                    </td>

                    {/* N: CBS % (Reforma Tributária) */}
                    <td className="py-2.5 px-2.5 text-center font-semibold text-indigo-700 bg-indigo-50/40 whitespace-nowrap">
                      {p.aliqCbs.toFixed(2).replace('.', ',')}%
                    </td>

                    {/* O: OBSERVAÇÃO & REFORMA */}
                    <td className="py-2.5 px-3 text-slate-600 max-w-[200px]" title={p.observacao}>
                      <div className="truncate font-medium text-slate-700">
                        {p.observacao || '—'}
                      </div>
                      {p.classificacaoReforma && (
                        <div className="text-[10px] text-slate-400 truncate">
                          {p.classificacaoReforma}
                        </div>
                      )}
                    </td>

                    {/* AÇÕES */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onSimulateTaxes(p)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Simular impostos e margem para este produto"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyRowData(p)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Copiar dados da linha para a área de transferência"
                        >
                          {copiedId === p.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar cadastro fiscal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(p.id, p.descricao)}
                          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer with pagination and column breakdown notice */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Mostrando <span className="font-semibold text-slate-800">{paginatedProducts.length}</span> de <span className="font-semibold text-slate-800">{sortedProducts.length}</span> produtos
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            Coluna <span className="font-mono text-slate-700">A</span> a <span className="font-mono text-slate-700">O</span> conforme padrão oficial GO
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
