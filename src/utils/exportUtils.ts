import { FiscalProduct, TaxCalculationResult } from '../types';

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPercent(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
}

/**
 * Calculates tax breakdown for a product given a sale price (R$)
 */
export function calculateProductTaxes(product: FiscalProduct, precoVenda: number): TaxCalculationResult {
  const isST = product.cstIcms === '060';
  
  // No varejo (supermercado), produtos com CST 060 (ST) já tiveram o ICMS recolhido antecipadamente pela indústria/distribuidor
  const valorIcms = isST ? 0 : (precoVenda * (product.aliqIcms / 100));
  const valorProtege = (product.protegeGo && !isST) ? (precoVenda * (product.protegeGo / 100)) : 0;
  
  // PIS e COFINS (0% se Alíquota Zero CST 06 ou Monofásico CST 04)
  const valorPis = precoVenda * (product.aliqPis / 100);
  const valorCofins = precoVenda * (product.aliqCofins / 100);
  
  // Reforma Tributária 2026 (IBS, CBS e Imposto Seletivo IS)
  const valorIbs = precoVenda * (product.aliqIbs / 100);
  const valorCbs = precoVenda * (product.aliqCbs / 100);
  const valorIs = product.aliqIs ? (precoVenda * (product.aliqIs / 100)) : 0;

  // Totais comparativos
  const totalAtual = valorIcms + valorProtege + valorPis + valorCofins;
  const percentualAtual = precoVenda > 0 ? (totalAtual / precoVenda) * 100 : 0;

  const totalReforma = valorIbs + valorCbs + valorIs;
  const percentualReforma = precoVenda > 0 ? (totalReforma / precoVenda) * 100 : 0;

  // Carga tributária atual adotada como padrão contábil vigente
  const totalImpostos = totalAtual;
  const percentualCarga = percentualAtual;
  const valorLiquido = precoVenda - totalImpostos;

  return {
    precoVenda,
    valorIcms,
    valorProtege,
    valorPis,
    valorCofins,
    valorIbs,
    valorCbs,
    valorIs,
    totalImpostos,
    percentualCarga,
    valorLiquido,
    totalAtual,
    percentualAtual,
    totalReforma,
    percentualReforma
  };
}

/**
 * Export products to Brazilian Excel CSV (separated by ';' with UTF-8 BOM)
 */
export function exportToCsv(products: FiscalProduct[], filename = 'cadastro_produtos_fiscais_2026_GO.csv') {
  const headers = [
    'Código',
    'Descrição',
    'Unidade',
    'Categoria',
    'CFOP Saída',
    'NCM',
    'CEST',
    'CST ICMS',
    'Alíq ICMS %',
    'Benefício Fiscal / Protege',
    'CST PIS',
    'Alíq PIS %',
    'CST COFINS',
    'Alíq COFINS %',
    'Regime Federal PIS/COFINS',
    'IBS %',
    'CBS %',
    'Imposto Seletivo IS %',
    'Classificação Reforma 2026',
    'Observação Operacional'
  ];

  const rows = products.map(p => [
    `"${p.codigo}"`,
    `"${p.descricao.replace(/"/g, '""')}"`,
    `"${p.unidade}"`,
    `"${p.categoria || 'Geral'}"`,
    `"${p.cfop || (p.cstIcms === '060' ? '5.405' : '5.102')}"`,
    `"${p.ncm}"`,
    `"${p.cest || '—'}"`,
    `"${p.cstIcms}"`,
    `"${p.aliqIcms.toString().replace('.', ',')}%"`,
    `"${p.benefFiscal || (p.protegeGo ? `Protege GO +${p.protegeGo}%` : '—')}"`,
    `"${p.cstPis}"`,
    `"${p.aliqPis.toFixed(2).replace('.', ',')}%"`,
    `"${p.cstCofins}"`,
    `"${p.aliqCofins.toFixed(2).replace('.', ',')}%"`,
    `"${p.regimePisCofins || (p.cstPis === '06' ? 'Alíquota Zero (Lei 10.925)' : p.cstPis === '04' ? 'Monofásico' : 'Tributação Normal')}"`,
    `"${p.aliqIbs.toFixed(2).replace('.', ',')}%"`,
    `"${p.aliqCbs.toFixed(2).replace('.', ',')}%"`,
    `"${p.aliqIs ? `${p.aliqIs.toFixed(1).replace('.', ',')}%` : '0,0%'}"`,
    `"${p.classificacaoReforma || 'Tributação Geral 2026'}"`,
    `"${(p.observacao || '—').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates the clean ASCII table formatted string (Option 1 format)
 */
export function generateFormattedAsciiTable(products: FiscalProduct[]): string {
  const line = '----+-----------------------------------+----+-------+-------------+--------------+----------+-----------+---------+-----------+-------+---------+-------+-------+------+-----------------------------------';
  const header = 
`=============================================================================================================================================================
                          CADASTRO FISCAL DE PRODUTOS DE SUPERMERCADO — GOIÁS (GO)
                        Atualizado: 2026 · SEFAZ-GO (Lei 22.460/23) & Reforma Tributária (PLP 68/24)
=============================================================================================================================================================

CÓD | DESCRIÇÃO                           | UN | CFOP  | NCM         | CEST         | CST ICMS | ALÍQ ICMS | CST PIS | CST COFINS| PIS%  | COFINS% | IBS%  | CBS%  | IS%  | OBSERVAÇÃO
${line}`;

  const rows = products.map(p => {
    const cod = p.codigo.padEnd(3).slice(0, 3);
    const desc = p.descricao.padEnd(33).slice(0, 33);
    const un = p.unidade.padEnd(2).slice(0, 2);
    const cfop = (p.cfop || (p.cstIcms === '060' ? '5.405' : '5.102')).padEnd(5).slice(0, 5);
    const ncm = p.ncm.padEnd(11).slice(0, 11);
    const cest = (p.cest || '—').padEnd(12).slice(0, 12);
    const cstIcms = p.cstIcms.padEnd(8).slice(0, 8);
    const aliqIcms = `${p.aliqIcms}%`.padEnd(9).slice(0, 9);
    const cstPis = p.cstPis.padEnd(7).slice(0, 7);
    const cstCofins = p.cstCofins.padEnd(9).slice(0, 9);
    const pis = p.aliqPis.toFixed(2).replace('.', ',').padEnd(5).slice(0, 5);
    const cofins = p.aliqCofins.toFixed(2).replace('.', ',').padEnd(7).slice(0, 7);
    const ibs = p.aliqIbs.toFixed(2).replace('.', ',').padEnd(5).slice(0, 5);
    const cbs = p.aliqCbs.toFixed(2).replace('.', ',').padEnd(5).slice(0, 5);
    const is = (p.aliqIs ? `${p.aliqIs}%` : '—').padEnd(4).slice(0, 4);
    const obs = (p.observacao || '—').padEnd(35).slice(0, 35);

    return `${cod} | ${desc} | ${un} | ${cfop} | ${ncm} | ${cest} | ${cstIcms} | ${aliqIcms} | ${cstPis} | ${cstCofins} | ${pis} | ${cofins} | ${ibs} | ${cbs} | ${is} | ${obs}`;
  });

  const footer = 
`${line}
LEGENDA & FUNDAMENTAÇÃO FISCAL:
1. ICMS Goiás (Lei Estadual 22.460/2023):
   - Alíquota Geral Interna: 19% (CST 000 / CFOP 5.102)
   - Cesta Básica GO (Anexo IX, Art. 8º, VIII): Redução de base de cálculo para carga líquida de 7% (CST 020)
   - Hortifrúti Fresco (Anexo IX, Art. 6º, I): Isenção total de ICMS 0% (CST 040)
   - Substituição Tributária (ST): CST 060 / CFOP 5.405 (recolhido na fonte / bebidas frias, pilhas, lâmpadas)
   - Adicional Fundo PROTEGE GOIÁS: +2% sobre bebidas alcoólicas e supérfluos (Lei 14.469/2003)

2. PIS e COFINS no Varejo (Supermercado):
   - CST 06 (Alíquota Zero 0%): Alimentos da Cesta Básica (Lei 10.925/2004) e Carnes/Aves (Lei 12.058/2009)
   - CST 04 (Monofásico 0% no Varejo): Bebidas Frias (Lei 13.097/2015) e Higiene/Perfumaria (Lei 10.147/2000)
   - CST 01 (Tributação Normal 1,65% / 7,60%): Produtos de limpeza geral, biscoitos, matinais e bazar

3. Reforma Tributária 2026 (EC 132/2023 & PLP 68/2024):
   - Cesta Básica Nacional: Alíquota Zero de IBS (0%) e CBS (0%) para arroz, feijão, leite, carnes, ovos e FLV
   - Regime com Redução de 60%: Queijos, óleos comestíveis e itens essenciais de higiene pessoal
   - Imposto Seletivo (IS): Incidência sobre bebidas alcoólicas, refrigerantes e produtos açucarados
=============================================================================================================================================================`;

  return [header, ...rows, footer].join('\n');
}

