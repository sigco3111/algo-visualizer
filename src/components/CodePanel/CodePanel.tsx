import React, { useState } from 'react';
import './CodePanel.css';

interface CodePanelProps {
  code: string[];
  activeLine: number;
  complexity?: { time: string; space: string };
  description?: string;
  difficulty?: string;
}

// Simple syntax highlighting via regex
const highlightSyntax = (line: string): React.ReactNode => {
  // Keywords
  const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'constructor', 'new', 'this', 'null', 'true', 'false', 'break', 'continue', 'typeof', 'instanceof'];
  const builtins = ['Math', 'Array', 'Set', 'Map', 'console', 'Infinity', 'parseInt', 'parseFloat'];

  // Split into tokens for highlighting
  let result: React.ReactNode[] = [];
  let remaining = line;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Match string
    const strMatch = remaining.match(/^(['\"`])(.*?)\1/);
    if (strMatch) {
      result.push(<span key={keyIdx++} className="syn-string">{strMatch[0]}</span>);
      remaining = remaining.slice(strMatch[0].length);
      continue;
    }

    // Match number
    const numMatch = remaining.match(/^\b(\d+\.?\d*)\b/);
    if (numMatch) {
      result.push(<span key={keyIdx++} className="syn-number">{numMatch[0]}</span>);
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // Match comment
    const commentMatch = remaining.match(/^(\/\/.*)$/);
    if (commentMatch) {
      result.push(<span key={keyIdx++} className="syn-comment">{commentMatch[0]}</span>);
      remaining = '';
      continue;
    }

    // Match word
    const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      if (keywords.includes(word)) {
        result.push(<span key={keyIdx++} className="syn-keyword">{word}</span>);
      } else if (builtins.includes(word)) {
        result.push(<span key={keyIdx++} className="syn-builtin">{word}</span>);
      } else {
        result.push(<span key={keyIdx++} className="syn-ident">{word}</span>);
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    // Match operators and punctuation
    const opMatch = remaining.match(/^[+\-*/%=<>!&|^~?:]+/);
    if (opMatch) {
      result.push(<span key={keyIdx++} className="syn-operator">{opMatch[0]}</span>);
      remaining = remaining.slice(opMatch[0].length);
      continue;
    }

    // Single character
    result.push(<span key={keyIdx++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return result;
};

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  activeLine,
  complexity,
  description,
  difficulty,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const difficultyClass = difficulty === 'basic' ? 'diff-basic' : difficulty === 'intermediate' ? 'diff-intermediate' : 'diff-advanced';

  return (
    <div className={`code-panel ${isCollapsed ? 'code-panel-collapsed' : ''}`}>
      <div className="code-panel-header">
        <div className="code-panel-tabs">
          <div className="code-tab active">코드</div>
        </div>
        <div className="code-panel-meta">
          {difficulty && (
            <span className={`code-difficulty ${difficultyClass}`}>{difficulty}</span>
          )}
          {complexity && (
            <>
              <span className="code-meta-item">
                시간 <span className="code-meta-value">{complexity.time}</span>
              </span>
              <span className="code-meta-item">
                공간 <span className="code-meta-value">{complexity.space}</span>
              </span>
            </>
          )}
          <button
            className="code-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? '코드 펼치기' : '코드 접기'}
          >
            {isCollapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {!isCollapsed && description && (
        <div className="code-description">{description}</div>
      )}
      {!isCollapsed && (
        <div className="code-content">
          <div className="code-lines">
            {code.map((line, i) => (
              <div
                key={i}
                className={`code-line ${i === activeLine ? 'active' : ''}`}
              >
                <span className="line-number">{i + 1}</span>
                <span className="line-content">
                  {highlightSyntax(line)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
