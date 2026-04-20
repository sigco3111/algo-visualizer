import React from 'react';
import type { AlgorithmInfo, CategoryDef } from '../../types';
import { sortingAlgorithms } from '../../algorithms/sorting';
import { searchingAlgorithms } from '../../algorithms/searching';
import { dsAlgorithms } from '../../algorithms/dataStructures';

import './Sidebar.css';

const categories: CategoryDef[] = [
  {
    id: 'sorting',
    label: '정렬',
    algorithms: sortingAlgorithms,
  },
  {
    id: 'searching',
    label: '탐색',
    algorithms: searchingAlgorithms,
  },
  {
    id: 'datastructures',
    label: '자료구조',
    algorithms: dsAlgorithms,
  },
];

interface SidebarProps {
  selectedAlgorithm: AlgorithmInfo | null;
  onSelectAlgorithm: (algo: AlgorithmInfo) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedAlgorithm, onSelectAlgorithm, isOpen, onClose }) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    sorting: true,
    searching: false,
    datastructures: false,
  });

  const toggleCategory = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'basic': return 'difficulty-basic';
      case 'intermediate': return 'difficulty-intermediate';
      default: return 'difficulty-advanced';
    }
  };

  const handleSelect = (algo: AlgorithmInfo) => {
    onSelectAlgorithm(algo);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo">⬡</span>
        <span className="sidebar-title">Algo Visualizer</span>
      </div>
      <nav className="sidebar-nav">
        {categories.map(cat => (
          <div key={cat.id} className="sidebar-category">
            <button
              className={`category-toggle ${expanded[cat.id] ? 'expanded' : ''}`}
              onClick={() => toggleCategory(cat.id)}
            >
              <span className="category-arrow">▸</span>
              <span className="category-label">{cat.label}</span>
              <span className="category-count">{cat.algorithms.length}</span>
            </button>
            {expanded[cat.id] && (
              <div className="algorithm-list">
                {cat.algorithms.map(algo => (
                  <button
                    key={algo.id}
                    className={`algorithm-item ${selectedAlgorithm?.id === algo.id ? 'active' : ''}`}
                    onClick={() => handleSelect(algo)}
                  >
                    <span className="algo-name">{algo.name}</span>
                    <span className={`algo-difficulty ${difficultyColor(algo.difficulty)}`}>
                      {algo.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-version">v1.0.0</span>
      </div>
    </aside>
  );
};
