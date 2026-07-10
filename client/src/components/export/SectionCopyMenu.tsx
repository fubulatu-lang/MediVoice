import { useState } from 'react';
import { HiClipboardCopy, HiChevronDown } from 'react-icons/hi';
import { useClipboard } from '../../hooks/useClipboard';

interface SectionCopyMenuProps {
  sections: Record<string, string>;
  noteTitle?: string;
}

export default function SectionCopyMenu({ sections, noteTitle = 'Note' }: SectionCopyMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { copyToClipboard } = useClipboard();

  const handleCopySection = (sectionName: string, content: string) => {
    copyToClipboard(content, `${sectionName} section`);
    setIsOpen(false);
  };

  const handleCopyAll = () => {
    const fullText = Object.entries(sections)
      .map(([key, value]) => `**${key}:**\n${value}`)
      .join('\n\n');
    copyToClipboard(fullText, noteTitle);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center gap-2"
      >
        <HiClipboardCopy className="w-5 h-5" />
        Copy to EMR
        <HiChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevation-3 
                        border border-outline-variant z-20 overflow-hidden animate-fade-in">
            <div className="p-2">
              <button
                onClick={handleCopyAll}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 
                         text-label-lg font-semibold text-primary transition-colors"
              >
                Copy Complete Note
              </button>
              
              <div className="h-px bg-outline-variant my-2" />
              
              <p className="px-4 py-1 text-label-sm text-on-surface-variant">
                Copy Section Only
              </p>
              
              {Object.entries(sections).map(([name, content]) => (
                <button
                  key={name}
                  onClick={() => handleCopySection(name, content)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary-50
                           text-body-md transition-colors flex items-center justify-between"
                >
                  <span>{name}</span>
                  <HiClipboardCopy className="w-4 h-4 text-primary" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
