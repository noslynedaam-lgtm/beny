import { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import { FiscalProduct } from '../types';
import { generateFormattedAsciiTable } from '../utils/exportUtils';

interface AsciiTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: FiscalProduct[];
}

export function AsciiTableModal({ isOpen, onClose, products }: AsciiTableModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const asciiText = generateFormattedAsciiTable(products);

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([asciiText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cadastro_fiscal_supermercado_GO_2026.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="modal-ascii-table"
        className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-5xl overflow-hidden my-8"
      >
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Tabela Formatada para Copiar & Salvar (Texto / Bloco de Notas)
              </h2>
              <p className="text-xs text-slate-400">
                Padrão ASCII com todos os {products.length} produtos preenchidos com códigos oficiais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Tudo</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Baixar como arquivo .txt"
            >
              <Download className="w-4 h-4" />
              <span>Baixar .TXT</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-950">
          <pre className="font-mono text-[11px] sm:text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[65vh] leading-relaxed whitespace-pre select-all">
            {asciiText}
          </pre>
        </div>

        <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Dica: Cole diretamente no Bloco de Notas ou envie por e-mail para sua equipe contábil.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-300 hover:text-white rounded-lg text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
