export interface ColumnDefinition {
  col: string;
  nome: string;
  oQueE: string;
  detalhes: string;
}

export const FISCAL_COLUMNS: ColumnDefinition[] = [
  { col: 'A', nome: 'CÓD. INTERNO', oQueE: 'Código do produto no sistema', detalhes: 'Identificador único do supermercado (Ex: 001, 002).' },
  { col: 'B', nome: 'DESCRIÇÃO DO PRODUTO', oQueE: 'Nome completo com gramatura/tamanho', detalhes: 'Ex: Arroz branco tipo 1 — pacote 5kg.' },
  { col: 'C', nome: 'UNID', oQueE: 'Unidade de medida comercial', detalhes: 'UN, KG, LT, CX, PCT, GF, TB, BD, SCH, CRT, FR.' },
  { col: 'D', nome: 'NCM', oQueE: 'Nomenclatura Comum do Mercosul — 8 dígitos', detalhes: 'Classificação fiscal obrigatória para tributação e emissão de NFC-e/NF-e (Ex: 1006.30.21).' },
  { col: 'E', nome: 'CEST', oQueE: 'Código Especificador da ST — 7 dígitos', detalhes: 'Obrigatório para mercadorias sujeitas à Substituição Tributária conforme Convênio ICMS 142/18 (Ex: 03.007.00 para refrigerantes).' },
  { col: 'F', nome: 'CST ICMS', oQueE: 'Código de Situação Tributária do ICMS', detalhes: '000 = Tributação normal (19%), 020 = Redução de base Cesta Básica (7%), 040 = Isento (FLV), 060 = ST retido anteriormente.' },
  { col: 'G', nome: 'ALÍQ. ICMS %', oQueE: 'Alíquota interna do Estado de Goiás', detalhes: 'Goiás: 19% geral (Lei 22.460/23), 7% Cesta Básica (Anexo IX RCTE-GO), 0% Hortifrúti isento, ou +2% Fundo Protege em supérfluos.' },
  { col: 'H', nome: 'BENEF. FISCAL / PROTEGE', oQueE: 'Redução de base, isenção ou adicional', detalhes: 'Cesta Básica GO (Art. 8º, VIII), Isenção Hortifrúti (Art. 6º, I), ST na fonte ou adicional Protege GO (+2%).' },
  { col: 'I', nome: 'CST PIS', oQueE: 'Situação Tributária do PIS', detalhes: '06 = Alíquota Zero (Cesta Básica / Carnes), 04 = Monofásico (Bebidas/Higiene no varejo), 01 = Tributação Normal (1,65%).' },
  { col: 'J', nome: 'CST COFINS', oQueE: 'Situação Tributária da COFINS', detalhes: '06 = Alíquota Zero (Lei 10.925/04), 04 = Monofásico no varejo (0%), 01 = Tributação Normal (7,60%).' },
  { col: 'K', nome: 'ALÍQ. PIS %', oQueE: 'Alíquota efetiva de PIS no Varejo', detalhes: '0,00% (para Alíquota Zero CST 06 e Monofásico CST 04) ou 1,65% (Lucro Real CST 01).' },
  { col: 'L', nome: 'ALÍQ. COFINS %', oQueE: 'Alíquota efetiva de COFINS no Varejo', detalhes: '0,00% (para Alíquota Zero CST 06 e Monofásico CST 04) ou 7,60% (Lucro Real CST 01).' },
  { col: 'M', nome: 'IBS %', oQueE: 'Imposto sobre Bens e Serviços (Reforma Tributária)', detalhes: '0,00% Cesta Básica Nacional; 0,48% com redução de 60%; 1,20% alíquota teste padrão 2026.' },
  { col: 'N', nome: 'CBS %', oQueE: 'Contribuição sobre Bens e Serviços (Reforma Tributária)', detalhes: '0,00% Cesta Básica Nacional; 0,36% com redução de 60%; 0,90% alíquota teste padrão 2026.' },
  { col: 'O', nome: 'OBSERVAÇÃO OPERACIONAL', oQueE: 'CFOP, Seletivo (IS) e Regime Tributário', detalhes: 'CFOPs (5.102 / 5.405 / 5.101), Imposto Seletivo (IS) e enquadramentos contábeis específicos.' }
];

export interface CodeExplanation {
  codigo: string;
  significado: string;
  usoGeral: string;
  exemplo: string;
}

export const FISCAL_EXPLANATIONS: CodeExplanation[] = [
  {
    codigo: 'CST ICMS 020 (Cesta Básica GO)',
    significado: 'Tributação com Redução de Base de Cálculo (Carga efetiva de 7%)',
    usoGeral: 'Regulamentado pelo RCTE-GO (Anexo IX, Art. 8º, VIII). Garante alíquota reduzida para itens alimentícios básicos.',
    exemplo: 'Arroz, feijão, açúcar cristal, farinha de trigo, café moído, sal de cozinha, carnes frescas e leite pasteurizado.'
  },
  {
    codigo: 'CST ICMS 040 (Isenção Hortifrúti)',
    significado: 'Isenção total de ICMS (Alíquota 0%)',
    usoGeral: 'Regulamentado pelo RCTE-GO (Anexo IX, Art. 6º, I). Aplica-se a produtos hortifrutícolas frescos em estado natural.',
    exemplo: 'Banana, maçã, tomate, cebola, batata, cenoura, alface, legumes, raízes e ovos in natura.'
  },
  {
    codigo: 'CST ICMS 060 (Substituição Tributária)',
    significado: 'ICMS cobrado anteriormente por Substituição Tributária (ICMS-ST retido)',
    usoGeral: 'No supermercado, a saída ao consumidor sai sem débito de ICMS e com CFOP 5.405, pois o imposto foi retido pela indústria.',
    exemplo: 'Refrigerantes, cervejas, sucos prontos, isotônicos, pilhas elétricas e lâmpadas.'
  },
  {
    codigo: 'CST ICMS 000 (Tributação Normal 19%)',
    significado: 'Tributação integral do ICMS pela alíquota interna padrão de Goiás',
    usoGeral: 'Lei nº 22.460/2023 fixou a alíquota modal interna de Goiás em 19% (com CFOP 5.102).',
    exemplo: 'Produtos de limpeza (detergentes, amaciantes), biscoitos recheados, condimentos, maionese e bazar.'
  },
  {
    codigo: 'CST PIS/COFINS 06 (Alíquota Zero)',
    significado: 'Operação tributável com alíquota zero de PIS e COFINS',
    usoGeral: 'Benefício federal da Lei nº 10.925/2004 e Lei nº 12.058/2009 para conter a inflação da cesta de alimentos.',
    exemplo: 'Arroz, feijão, farinha, carnes bovinas, suínas e aves, leite fluido e em pó, café moído e hortaliças.'
  },
  {
    codigo: 'CST PIS/COFINS 04 (Monofásico no Varejo)',
    significado: 'Tributação Monofásica — alíquota 0% para o varejista/supermercado',
    usoGeral: 'A indústria recolhe com alíquota concentrada (Lei 13.097/15 para bebidas e Lei 10.147/00 para cosméticos/higiene). No supermercado o PIS/COFINS é ZERO.',
    exemplo: 'Refrigerantes, cervejas, águas minerais, sabonetes, cremes dentais, shampoos e desodorantes.'
  },
  {
    codigo: 'CFOP 5.102, 5.405 e 5.101',
    significado: 'Códigos Fiscais de Operações e Prestações no Ponto de Venda (PDV)',
    usoGeral: '5.102 = Venda normal de mercadorias de terceiros; 5.405 = Venda de mercadorias com ICMS-ST; 5.101 = Fabricação própria (Padaria/Confeitaria).',
    exemplo: 'Obrigatoriamente registrado no XML de cada NFC-e emitida ao consumidor.'
  },
  {
    codigo: 'Fundo PROTEGE GOIÁS (+2%)',
    significado: 'Adicional de 2% de ICMS sobre produtos supérfluos (Lei Estadual nº 14.469/2003)',
    usoGeral: 'Destinado a programas sociais de combate à pobreza no Estado de Goiás.',
    exemplo: 'Bebidas alcoólicas (cervejas, vinhos, destilados) e cigarros.'
  },
  {
    codigo: 'Reforma Tributária: Cesta Básica Nacional (0%)',
    significado: 'Alíquota Zero total de IBS (0%) e CBS (0%) — EC 132/2023 e PLP 68/2024',
    usoGeral: 'Lista de produtos essenciais que contarão com desoneração integral de impostos sobre o consumo a partir de 2026.',
    exemplo: 'Arroz, feijão, leite, carnes in natura, ovos, pão francês, farinhas, frutas e hortaliças.'
  },
  {
    codigo: 'Reforma Tributária: Imposto Seletivo (IS)',
    significado: 'Tributo extra sobre produtos prejudiciais à saúde ou ao meio ambiente',
    usoGeral: 'Incidirá sobre bebidas alcoólicas e bebidas açucaradas (refrigerantes e energéticos com alto teor de açúcar).',
    exemplo: 'Cervejas, destilados, refrigerantes regulares e energéticos.'
  }
];

