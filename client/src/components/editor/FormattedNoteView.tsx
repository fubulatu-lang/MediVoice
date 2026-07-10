import { useState } from 'react';
import { useClipboard } from '../../hooks/useClipboard';
import type { FormattedNote } from '../../types';
import { HiClipboardCopy, HiClipboardCheck } from 'react-icons/hi';

interface FormattedNoteViewProps {
  note: FormattedNote;
  onCopySection?: (section: string, content: string) => void;
}

export default function FormattedNoteView({ note, onCopySection }: FormattedNoteViewProps) {
  const { copyToClipboard, isCopied } = useClipboard();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = note.formattedNote.split(/\*\*(S|O|A|P|Subjective|Objective|Assessment|Plan):\*\*/g);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-title-md">Formatted {note.template.toUpperCase()} Note</h3>
        <button
          onClick={() => copyToClipboard(note.formattedNote, 'Full note')}
          className="btn-secondary flex items-center gap-2"
        >
          {isCopied ? (
            <HiClipboardCheck className="w-5 h-5" />
          ) : (
            <HiClipboardCopy className="w-5 h-5" />
          )}
          Copy All
        </button>
      </div>

      <div className="bg-white rounded-xl border-2 border-outline-variant overflow-hidden">
        {sections.map((section, index) => {
          if (index % 2 === 1) {
            // Section header
            return (
              <button
                key={index}
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-3 
                         bg-primary-50 hover:bg-primary-100 transition-colors
                         border-b border-outline-variant"
              >
                <span className="text-label-lg text-primary font-bold">
                  {section}
                </span>
                <span className="text-primary">
                  {expandedSections.has(section) ? '▼' : '▶'}
                </span>
              </button>
            );
          } else if (section.trim()) {
            // Section content
            const headerText = sections[index - 1] || '';
            const isExpanded = expandedSections.has(headerText);
            
            return (
              <div
                key={index}
                className={`px-4 py-3 border-b border-outline-variant last:border-b-0
                  ${isExpanded ? '' : 'hidden'}`}
              >
                <p className="text-body-md whitespace-pre-wrap">{section}</p>
                {onCopySection && (
                  <button
                    onClick={() => onCopySection(headerText, section)}
                    className="mt-2 text-label-sm text-primary hover:underline"
                  >
                    Copy this section
                  </button>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
        <span>Template: {note.template.toUpperCase()}</span>
        <span>Processed in {note.processingTime.toFixed(1)}s</span>
      </div>
    </div>
  );
}
