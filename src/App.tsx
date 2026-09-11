/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FiscalTable } from './components/FiscalTable';
import { ProductFormModal } from './components/ProductFormModal';
import { TaxCalculator } from './components/TaxCalculatorModal';
import { FiscalGuide } from './components/FiscalGuide';
import { AsciiTableModal } from './components/AsciiTableModal';
import { FiscalProduct, FiscalTab } from './types';
import { DEFAULT_FISCAL_PRODUCTS } from './data/defaultProducts';
import { exportToCsv } from './utils/exportUtils';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const STORAGE_KEY = 'cadastro_produtos_fiscais_go_2026_v2';

export default function App() {
  const [products, setProducts] = useState<FiscalProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 70 && parsed[0]?.cfop) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
    }
    return DEFAULT_FISCAL_PRODUCTS;
  });

  const [currentTab, setCurrentTab] = useState<FiscalTab>('tabela');
  const [summaryFilter, setSummaryFilter] = useState<'all' | 'st' | 'normal' | 'alimentos'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cstFilter, setCstFilter] = useState<string>('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<FiscalProduct | null>(null);
  const [isAsciiModalOpen, setIsAsciiModalOpen] = useState(false);
  const [calcProduct, setCalcProduct] = useState<FiscalProduct | null>(products[0] || null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }, [products]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSummaryFilterChange = (filter: 'all' | 'st' | 'normal' | 'alimentos') => {
    setSummaryFilter(filter);
    if (filter === 'st') {
      setCstFilter('060');
      setSelectedCategory('all');
    } else if (filter === 'normal') {
      setCstFilter('000');
      setSelectedCategory('all');
    } else if (filter === 'alimentos') {
      setCstFilter('020');
      setSelectedCategory('all');
    } else {
      setCstFilter('all');
      setSelectedCategory('all');
    }
    if (currentTab !== 'tabela') {
      setCurrentTab('tabela');
    }
  };

  const handleOpenNewProduct = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (p: FiscalProduct) => {
    setProductToEdit(p);
    setIsFormModalOpen(true);
  };

  const handleDuplicateProduct = (p: FiscalProduct) => {
    const nextCodeNum = products.length + 1;
    const newCode = String(nextCodeNum).padStart(3, '0');
    const duplicated: FiscalProduct = {
      ...p,
      id: `prod-${Date.now()}`,
      codigo: newCode,
      descricao: `${p.descricao} (Cópia)`
    };
    setProducts(prev => [...prev, duplicated]);
    showNotification(`Produto duplicado com código ${newCode}!`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente excluir "${name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification(`Produto "${name}" excluído.`, 'info');
    }
  };

  const handleSaveProduct = (p: FiscalProduct) => {
    if (productToEdit) {
      setProducts(prev => prev.map(item => item.id === p.id ? p : item));
      showNotification(`Produto "${p.descricao}" atualizado com sucesso!`);
    } else {
      setProducts(prev => [...prev, p]);
      showNotification(`Produto "${p.descricao}" cadastrado com sucesso!`);
    }
  };

  const handleSimulateTaxes = (p: FiscalProduct) => {
    setCalcProduct(p);
    setCurrentTab('calculadora');
  };

  const handleExportCsv = () => {
    if (products.length === 0) {
      showNotification('Não há produtos para exportar.', 'error');
      return;
    }
    exportToCsv(products, `cadastro_produtos_fiscais_GO_2026_${new Date().toISOString().slice(0,10)}.csv`);
    showNotification(`Exportado ${products.length} produtos para Excel/CSV com sucesso!`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar a base oficial completa de 78 produtos de supermercado com códigos fiscais de Goiás 2026? Suas alterações serão substituídas pela base padrão.')) {
      setProducts(DEFAULT_FISCAL_PRODUCTS);
      setCalcProduct(DEFAULT_FISCAL_PRODUCTS[0]);
      showNotification('Base restaurada com os 78 produtos oficiais!', 'success');
    }
  };

  // Calculate next suggested code
  const nextSuggestedCode = String(products.length + 1).padStart(3, '0');

  // Check if modified compared to default
  const isModified = JSON.stringify(products) !== JSON.stringify(DEFAULT_FISCAL_PRODUCTS);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Toast / Floating Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all bg-slate-900 text-white border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <Header
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenNewProduct={handleOpenNewProduct}
          onExportCsv={handleExportCsv}
          onOpenAsciiModal={() => setIsAsciiModalOpen(true)}
          onResetDefaults={handleResetDefaults}
          isModified={isModified}
        />

        {/* Summary Metric Cards */}
        <SummaryCards
          products={products}
          activeFilter={summaryFilter}
          onFilterChange={handleSummaryFilterChange}
        />

        {/* Main Tab Content */}
        <main id="app-main-content">
          {currentTab === 'tabela' && (
            <FiscalTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onDuplicate={handleDuplicateProduct}
              onSimulateTaxes={handleSimulateTaxes}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              cstFilter={cstFilter}
              onSelectCstFilter={setCstFilter}
            />
          )}

          {currentTab === 'calculadora' && (
            <TaxCalculator
              products={products}
              selectedProduct={calcProduct}
              onSelectProduct={setCalcProduct}
            />
          )}

          {currentTab === 'guia' && (
            <FiscalGuide />
          )}
        </main>

        {/* Footer info note */}
        <footer className="mt-8 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-1">
          <p>
            Cadastro Fiscal de Produtos de Supermercado · Atualizado Setembro/2026 · Goiás (GO)
          </p>
          <p className="text-slate-400">
            Regulamentação: SEFAZ/GO · NCM Mercosul · Convênio ICMS 142/18 (CEST) · Emenda Constitucional nº 132/2023 (Reforma Tributária IBS / CBS)
          </p>
        </footer>

        {/* Add/Edit Modal */}
        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
          nextSuggestedCode={nextSuggestedCode}
        />

        {/* Ascii Table Ready-to-copy Modal */}
        <AsciiTableModal
          isOpen={isAsciiModalOpen}
          onClose={() => setIsAsciiModalOpen(false)}
          products={products}
        />
      </div>
    </div>
  );
}
