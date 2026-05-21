'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  onExport: (format: string, options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  includeRequirements: boolean;
  includeTechStack: boolean;
  includeRisks: boolean;
  includeMetrics: boolean;
  includeNotes: boolean;
  format: string;
}

export function ExportModal({
  isOpen,
  onClose,
  projectTitle,
  onExport,
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [selectedOptions, setSelectedOptions] = useState<ExportOptions>({
    includeRequirements: true,
    includeTechStack: true,
    includeRisks: true,
    includeMetrics: true,
    includeNotes: true,
    format: 'pdf',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOption = (key: keyof Omit<ExportOptions, 'format'>) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await onExport(selectedFormat, {
        ...selectedOptions,
        format: selectedFormat,
      });
      // Don't close immediately to show success state or just finish
      onClose();
    } catch (err: any) {
      setError(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats = [
    { id: 'pdf', label: 'PDF', description: 'Best for sharing', icon: '📄', color: 'text-red-500' },
    { id: 'docx', label: 'Word', description: 'Editable document', icon: '📝', color: 'text-blue-500' },
    { id: 'csv', label: 'CSV', description: 'Data spreadsheet', icon: '📊', color: 'text-green-500' },
    { id: 'json', label: 'JSON', description: 'Structured data', icon: '{ }', color: 'text-yellow-500' },
    { id: 'markdown', label: 'Markdown', description: 'Plain text', icon: '📋', color: 'text-purple-500' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Project Analysis"
      size="lg"
      footer={
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className='text-sm text-neutral-500'>
                {Object.values(selectedOptions).filter(Boolean).length - 1} sections selected
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={onClose} disabled={isExporting} className="min-h-[44px] w-full sm:w-auto">
                Cancel
            </Button>
            <Button 
                onClick={handleExport} 
                disabled={isExporting || !selectedFormat}
                className="min-h-[44px] w-full bg-gradient-to-r from-accent to-accent/80 text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:from-accent/90 hover:to-accent/70 sm:w-auto"
            >
                {isExporting ? (
                <>
                    <Spinner size="sm" className="mr-2" />
                    Generating...
                </>
                ) : (
                <div className="flex items-center gap-2">
                    <span>Export as {exportFormats.find(f => f.id === selectedFormat)?.label}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                )}
            </Button>
            </div>
        </div>
      }
    >
        <div className="space-y-8 py-2">
        {/* Format Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">
            Select Format
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`relative group p-4 rounded-xl border-2 text-left transition-all duration-200 outline-none
                  ${selectedFormat === format.id
                    ? 'border-accent bg-accent/5 shadow-md shadow-accent/10 ring-1 ring-accent/50'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-accent/40 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
              >
                <div className={`text-2xl mb-3 transition-transform duration-300 group-hover:scale-110 ${format.color}`}>
                    {format.icon}
                </div>
                <div className="space-y-1">
                    <p className={`font-semibold transition-colors ${selectedFormat === format.id ? 'text-accent' : 'text-neutral-900 dark:text-neutral-100'}`}>
                        {format.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                        {format.description}
                    </p>
                </div>
                
                {selectedFormat === format.id && (
                  <div className="absolute top-3 right-3 text-accent">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Selection */}
        <div className="space-y-4">
          <div className="ml-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Include Sections
            </h3>
            <span className="text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                Customizable
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                key: 'includeRequirements',
                label: 'Requirements Analysis',
                desc: 'Functional & Non-functional',
                icon: '📋'
              },
              {
                key: 'includeTechStack',
                label: 'Tech Stack',
                desc: 'Recommendations & Reasoning',
                icon: '💻'
              },
              {
                key: 'includeRisks',
                label: 'Risk Analysis',
                desc: 'Risks & Mitigations',
                icon: '⚠️'
              },
              {
                key: 'includeMetrics',
                label: 'Metrics',
                desc: 'KPIs & Estimates',
                icon: '📊'
              },
              {
                key: 'includeNotes',
                label: 'Notes',
                desc: 'Additional Comments',
                icon: '📝'
              },
            ].map((section) => (
              <label 
                key={section.key} 
                className={`flex items-start gap-4 p-3 rounded-lg border border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-200
                    ${selectedOptions[section.key as keyof ExportOptions] ? 'bg-neutral-50/50 dark:bg-neutral-800/50' : 'opacity-80 hover:opacity-100'}
                `}
              >
                <div className="relative flex items-center mt-1">
                    <input
                    type="checkbox"
                    checked={selectedOptions[section.key as keyof ExportOptions] as boolean}
                    onChange={() => toggleOption(section.key as Exclude<keyof ExportOptions, 'format'>)}
                    className="peer w-5 h-5 rounded border-2 border-neutral-300 text-accent focus:ring-accent/20 transition-all checked:bg-accent checked:border-accent"
                    />
                    <div className="absolute inset-0 pointer-events-none text-white hidden peer-checked:block">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg opacity-80">{section.icon}</span>
                    <p className={`font-medium transition-colors ${selectedOptions[section.key as keyof ExportOptions] ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                        {section.label}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 ml-7">
                    {section.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Preview */}
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                    <span className="text-xl">
                        {exportFormats.find(f => f.id === selectedFormat)?.icon}
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {projectTitle.replace(/\s+/g, '-').toLowerCase()}.{selectedFormat}
                    </p>
                    <p className="text-xs text-neutral-500">
                        {Object.values(selectedOptions).filter(Boolean).length - 1} sections included
                    </p>
                </div>
            </div>
            <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleExport}
                disabled={isExporting}
                className="min-h-[44px] w-full text-accent hover:bg-accent/5 hover:text-accent-2 sm:w-auto"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
