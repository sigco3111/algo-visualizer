import React, { useState } from 'react';
import type { AlgorithmInfo } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { SortingVisualizer } from './components/Sorting/SortingVisualizer';
import { SearchingVisualizer } from './components/Searching/SearchingVisualizer';
import { DataStructuresVisualizer } from './components/DataStructures/DataStructuresVisualizer';
import './App.css';

const App: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmInfo | null>(null);

  const renderVisualizer = () => {
    if (!selectedAlgorithm) {
      return (
        <div className="empty-state">
          <div className="empty-logo">⬡</div>
          <div className="empty-title">Algorithm Visualizer</div>
          <div className="empty-desc">왼쪽에서 알고리즘을 선택하세요</div>
          <div className="empty-stats">
            <span>정렬 6</span>
            <span className="empty-sep">·</span>
            <span>탐색 4</span>
            <span className="empty-sep">·</span>
            <span>자료구조 4</span>
          </div>
        </div>
      );
    }

    switch (selectedAlgorithm.category) {
      case 'sorting':
        return <SortingVisualizer key={selectedAlgorithm.id} algorithm={selectedAlgorithm} />;
      case 'searching':
        return <SearchingVisualizer key={selectedAlgorithm.id} algorithm={selectedAlgorithm} />;
      case 'datastructures':
        return <DataStructuresVisualizer key={selectedAlgorithm.id} algorithm={selectedAlgorithm} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Sidebar
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={setSelectedAlgorithm}
      />
      <main className="main-content">
        {renderVisualizer()}
      </main>
    </div>
  );
};

export default App;
