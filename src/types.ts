export interface FiscalProduct {
  id: string;
  codigo: string;          // A: Cód. Interno
  descricao: string;       // B: Descrição do produto
  unidade: string;         // C: Unidade (PCT, KG, UN, CX, LT, GF, TB, BD, SCH, etc.)
  ncm: string;             // D: NCM 8 dígitos (ex: 1006.30.21)
  cest: string;            // E: CEST 7 dígitos (ex: 03.007.00)
  cstIcms: string;         // F: CST ICMS (ex: 000, 060, 020, 040)
  aliqIcms: number;        // G: Alíquota ICMS % (GO padrão 19% pela Lei 22.460/23, 7% Cesta Básica, 0% Isenção FLV)
  benefFiscal?: string;    // H: Benefício Fiscal (ex: Cesta Básica 7%, Isenção Hortifrúti, Substituição Tributária)
  cstPis: string;          // I: CST PIS (ex: 01, 04, 06)
  cstCofins: string;       // J: CST COFINS (ex: 01, 04, 06)
  aliqPis: number;         // K: Alíquota PIS % (ex: 0.00%, 1.65%)
  aliqCofins: number;      // L: Alíquota COFINS % (ex: 0.00%, 7.60%)
  aliqIbs: number;         // M: IBS % (Reforma Tributária - 0% Cesta Básica, 0.48% c/ redução 60%, 1.2% padrão)
  aliqCbs: number;         // N: CBS % (Reforma Tributária - 0% Cesta Básica, 0.36% c/ redução 60%, 0.9% padrão)
  observacao: string;      // O: Observação (ex: Cesta Básica GO, ST Bebidas, Monofásico)
  categoria?: string;      // Mercearia, Hortifrúti, Carnes, Bebidas, Limpeza, Higiene, Padaria, Laticínios, Pet Shop, etc.
  cfop?: string;           // CFOP de Saída no PDV (5.102 Venda Normal, 5.405 Venda ST, 5.101 Fabricação Própria)
  protegeGo?: number;      // Fundo Protege Goiás % (adicional de 2% para bebidas alcoólicas / supérfluos)
  aliqIs?: number;         // Imposto Seletivo % da Reforma Tributária (IS - bebidas alcoólicas, açucaradas)
  regimePisCofins?: string; // Classificação Federal: Alíquota Zero (Lei 10.925), Monofásico (Lei 13.097/10.147), Tributado
  classificacaoReforma?: string; // Cesta Básica Nacional (0%), Redução 60%, Padrão 2026, Imposto Seletivo
}

export type FiscalTab = 'tabela' | 'calculadora' | 'guia';

export interface TaxCalculationResult {
  precoVenda: number;
  valorIcms: number;
  valorProtege: number;
  valorPis: number;
  valorCofins: number;
  valorIbs: number;
  valorCbs: number;
  valorIs: number;
  totalImpostos: number;
  percentualCarga: number;
  valorLiquido: number;
  totalAtual: number;
  percentualAtual: number;
  totalReforma: number;
  percentualReforma: number;
}

