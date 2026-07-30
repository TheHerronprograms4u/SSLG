import React, { useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link,
  Table,
  Image,
  Code,
  Eye,
  Edit3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write complete project description, methodology, findings, and notes here...'
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = document.getElementById('rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Metric | Baseline | Target |\n| :--- | :--- | :--- |\n| Performance | 80% | 98% |\n| Latency | 500ms | 150ms |\n\n`;
    insertFormatting('', '', tableTemplate);
  };

  const renderSimpleMarkdown = (text: string) => {
    if (!text) return <em style={{ color: 'var(--text-secondary)' }}>No content written yet. Switch to "Write" tab to add text.</em>;

    // Simple markdown renderer for preview tab
    const lines = text.split('\n');
    return (
      <div className="rendered-rich-content">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) return <h1 key={idx} style={{ fontSize: '1.8rem', margin: '1.2rem 0 0.6rem', color: 'var(--text-primary)' }}>{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={idx} style={{ fontSize: '1.4rem', margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>{line.replace('## ', '')}</h2>;
          if (line.startsWith('### ')) return <h3 key={idx} style={{ fontSize: '1.15rem', margin: '0.8rem 0 0.4rem', color: 'var(--text-primary)' }}>{line.replace('### ', '')}</h3>;
          if (line.startsWith('> ')) return <blockquote key={idx} style={{ borderLeft: '4px solid var(--accent-color)', paddingLeft: '1rem', fontStyle: 'italic', margin: '0.8rem 0', color: 'var(--text-secondary)' }}>{line.replace('> ', '')}</blockquote>;
          if (line.startsWith('- ')) return <li key={idx} style={{ marginLeft: '1.5rem', margin: '0.2rem 0' }}>{line.replace('- ', '')}</li>;
          if (line.startsWith('```')) return <pre key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem', color: '#60a5fa', margin: '0.8rem 0' }}><code>{line}</code></pre>;
          if (line.trim() === '') return <br key={idx} />;
          return <p key={idx} style={{ marginBottom: '0.6rem', lineHeight: '1.6' }}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-editor-header">
        <div className="rich-editor-toolbar">
          <button type="button" onClick={() => insertFormatting('# ', '', 'Heading 1')} title="Heading 1" className="toolbar-btn">
            <Heading1 size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('## ', '', 'Heading 2')} title="Heading 2" className="toolbar-btn">
            <Heading2 size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('### ', '', 'Heading 3')} title="Heading 3" className="toolbar-btn">
            <Heading3 size={16} />
          </button>
          <span className="toolbar-divider" />
          <button type="button" onClick={() => insertFormatting('**', '**', 'bold text')} title="Bold" className="toolbar-btn">
            <Bold size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('*', '*', 'italic text')} title="Italic" className="toolbar-btn">
            <Italic size={16} />
          </button>
          <span className="toolbar-divider" />
          <button type="button" onClick={() => insertFormatting('- ', '', 'List item')} title="Bullet List" className="toolbar-btn">
            <List size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('1. ', '', 'Numbered item')} title="Numbered List" className="toolbar-btn">
            <ListOrdered size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('> ', '', 'Important quote or note')} title="Quote" className="toolbar-btn">
            <Quote size={16} />
          </button>
          <span className="toolbar-divider" />
          <button type="button" onClick={() => insertFormatting('[', '](https://example.com)', 'Link Title')} title="Hyperlink" className="toolbar-btn">
            <Link size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('![Image Alt](', ')', 'https://images.unsplash.com/photo-1531482615713-2afd69097998')} title="Embedded Media / Image" className="toolbar-btn">
            <Image size={16} />
          </button>
          <button type="button" onClick={insertTable} title="Insert Table" className="toolbar-btn">
            <Table size={16} />
          </button>
          <button type="button" onClick={() => insertFormatting('```typescript\n', '\n```', '// Your code logic here')} title="Code Block" className="toolbar-btn">
            <Code size={16} />
          </button>
        </div>

        <div className="rich-editor-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            <Edit3 size={14} /> Write
          </button>
          <button
            type="button"
            className={`mode-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={14} /> Live Preview
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <textarea
          id="rich-editor-textarea"
          className="rich-editor-textarea"
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className="rich-editor-preview">
          {renderSimpleMarkdown(value)}
        </div>
      )}
    </div>
  );
};
