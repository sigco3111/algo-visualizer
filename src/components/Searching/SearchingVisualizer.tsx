import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AlgorithmInfo, PlaybackState } from '../../types';
import { bfsGen, dfsGen, binarySearchGen, dijkstraGen } from '../../algorithms/searching';
import { Controls } from '../Controls/Controls';
import { CodePanel } from '../CodePanel/CodePanel';
import './SearchingVisualizer.css';

interface SearchStepData {
  type: string;
  nodes: string[];
  indices: number[];
  message: string;
  line: number;
  path?: string[];
}

interface Props {
  algorithm: AlgorithmInfo;
}

const ROWS = 15;
const COLS = 30;

export const SearchingVisualizer: React.FC<Props> = ({ algorithm }) => {
  const isBinarySearch = algorithm.id === 'binary-search';

  // Grid state
  const [grid, setGrid] = useState<number[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [startNode, setStartNode] = useState<[number, number]>([1, 1]);
  const [endNode, setEndNode] = useState<[number, number]>([ROWS - 2, COLS - 2]);
  const [drawingMode, setDrawingMode] = useState<'wall' | 'start' | 'end' | null>(null);

  // Binary search state
  const [bsArray, setBsArray] = useState<number[]>([]);
  const [bsTarget, setBsTarget] = useState(0);

  // Visualization state
  const [steps, setSteps] = useState<SearchStepData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [frontierCells, setFrontierCells] = useState<Set<string>>(new Set());
  const [pathCells, setPathCells] = useState<Set<string>>(new Set());
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState('준비됨');
  const [bsLow, setBsLow] = useState(-1);
  const [bsHigh, setBsHigh] = useState(-1);
  const [bsMid, setBsMid] = useState(-1);
  const [bsFound, setBsFound] = useState(false);
  const [bsVisited, setBsVisited] = useState<Set<number>>(new Set());

  // Responsive canvas sizing
  const [canvasSize, setCanvasSize] = useState({ width: COLS * 24, height: ROWS * 24 });
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic canvas sizing based on container width
  useEffect(() => {
    if (isBinarySearch) return;
    const container = gridContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;
      const cellSize = Math.max(12, Math.floor(containerWidth / COLS));
      setCanvasSize({
        width: cellSize * COLS,
        height: cellSize * ROWS,
      });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isBinarySearch]);

  // Generate random grid
  const generateGrid = useCallback(() => {
    stopPlayback();
    const newGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    // Random walls (~25%)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.25) newGrid[r][c] = 1;
      }
    }
    // Clear start and end
    const s: [number, number] = [1, 1];
    const e: [number, number] = [ROWS - 2, COLS - 2];
    newGrid[s[0]][s[1]] = 0;
    newGrid[e[0]][e[1]] = 0;
    // Clear around start and end
    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nr = s[0]+dr, nc = s[1]+dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) newGrid[nr][nc] = 0;
      const er = e[0]+dr, ec = e[1]+dc;
      if (er >= 0 && er < ROWS && ec >= 0 && ec < COLS) newGrid[er][ec] = 0;
    }
    setGrid(newGrid);
    setStartNode(s);
    setEndNode(e);
    resetVisState();
  }, []);

  // Generate binary search array
  const generateBsArray = useCallback(() => {
    stopPlayback();
    const size = 30;
    const sorted = Array.from({ length: size }, (_, i) => (i + 1) * Math.floor(Math.random() * 3 + 2));
    // Make sure it's sorted
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] <= sorted[i-1]) sorted[i] = sorted[i-1] + Math.floor(Math.random() * 3 + 1);
    }
    setBsArray(sorted);
    setBsTarget(sorted[Math.floor(Math.random() * sorted.length)]);
    resetVisState();
  }, []);

  const resetVisState = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setVisitedCells(new Set());
    setFrontierCells(new Set());
    setPathCells(new Set());
    setMessage('준비됨');
    setPlaybackState('idle');
    setBsLow(-1);
    setBsHigh(-1);
    setBsMid(-1);
    setBsFound(false);
    setBsVisited(new Set());
  }, []);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Compute steps for graph algorithms
  const computeGraphSteps = useCallback(() => {
    const walls = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] === 1) walls.add(`${r},${c}`);
      }
    }

    let gen: Generator<any>;
    switch (algorithm.id) {
      case 'bfs':
        gen = bfsGen(ROWS, COLS, walls, startNode, endNode);
        break;
      case 'dfs':
        gen = dfsGen(ROWS, COLS, walls, startNode, endNode);
        break;
      case 'dijkstra':
        // For dijkstra, use grid values as weights (0 for empty, -1 for wall)
        const weights = grid.map(row => row.map(v => v === 1 ? -1 : 1));
        gen = dijkstraGen(ROWS, COLS, weights, startNode, endNode);
        break;
      default:
        return [];
    }

    const allSteps: SearchStepData[] = [];
    for (const step of gen) {
      allSteps.push({
        type: step.type,
        nodes: step.nodes || [],
        indices: [],
        message: step.message,
        line: step.line,
        path: step.path,
      });
    }
    return allSteps;
  }, [algorithm.id, grid, startNode, endNode]);

  // Compute steps for binary search
  const computeBsSteps = useCallback(() => {
    const gen = binarySearchGen(bsArray, bsTarget);
    const allSteps: SearchStepData[] = [];
    for (const step of gen) {
      allSteps.push({
        type: step.type,
        nodes: [],
        indices: step.indices || [],
        message: step.message,
        line: step.line,
      });
    }
    return allSteps;
  }, [bsArray, bsTarget]);

  const applyStep = useCallback((step: SearchStepData) => {
    if (isBinarySearch) {
      switch (step.type) {
        case 'compare':
          setBsMid(step.indices[0] ?? -1);
          break;
        case 'visit':
          step.indices.forEach(i => {
            setBsVisited(prev => new Set(prev).add(i));
          });
          break;
        case 'found':
          setBsMid(step.indices[0] ?? -1);
          setBsFound(true);
          break;
        case 'done':
          break;
      }
    } else {
      switch (step.type) {
        case 'visit':
          setVisitedCells(prev => {
            const next = new Set(prev);
            step.nodes.forEach(n => next.add(n));
            return next;
          });
          setFrontierCells(prev => {
            const next = new Set(prev);
            step.nodes.forEach(n => next.delete(n));
            return next;
          });
          break;
        case 'enqueue':
          setFrontierCells(prev => {
            const next = new Set(prev);
            step.nodes.forEach(n => next.add(n));
            return next;
          });
          break;
        case 'found':
          setPathCells(prev => new Set(prev));
          break;
        case 'path':
          if (step.path) {
            setPathCells(new Set(step.path));
          }
          break;
        case 'done':
          break;
      }
    }
    setMessage(step.message);
  }, [isBinarySearch]);

  // Playback effect
  useEffect(() => {
    if (playbackState === 'playing' && steps.length > 0) {
      if (currentStep >= steps.length - 1) {
        setPlaybackState('done');
        return;
      }
      const interval = Math.max(5, 100 / speed);
      timerRef.current = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        applyStep(steps[nextStep]);
      }, interval);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [playbackState, currentStep, steps, speed, applyStep]);

  const handlePlay = useCallback(() => {
    if (steps.length === 0) {
      const computed = isBinarySearch ? computeBsSteps() : computeGraphSteps();
      setSteps(computed);
      // Need to apply first step on next tick
      setTimeout(() => {
        if (computed.length > 0) {
          applyStep(computed[0]);
          setCurrentStep(0);
        }
      }, 0);
    }
    setPlaybackState('playing');
  }, [steps, computeGraphSteps, computeBsSteps, applyStep, isBinarySearch]);

  const handlePause = useCallback(() => {
    stopPlayback();
    setPlaybackState('paused');
  }, [stopPlayback]);

  const handleStep = useCallback(() => {
    if (steps.length === 0) {
      const computed = isBinarySearch ? computeBsSteps() : computeGraphSteps();
      setSteps(computed);
      if (computed.length > 0) {
        applyStep(computed[0]);
        setCurrentStep(0);
      }
      setPlaybackState('paused');
      return;
    }
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      applyStep(steps[nextStep]);
      setPlaybackState('paused');
    } else {
      setPlaybackState('done');
    }
  }, [steps, currentStep, computeGraphSteps, computeBsSteps, applyStep, isBinarySearch]);

  const handleReset = useCallback(() => {
    stopPlayback();
    resetVisState();
  }, [stopPlayback, resetVisState]);

  // Helper to get cell from pointer position (works for mouse and touch)
  const getCellFromPosition = useCallback((clientX: number, clientY: number): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const col = Math.floor(x / (canvas.width / COLS));
    const row = Math.floor(y / (canvas.height / ROWS));
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    return [row, col];
  }, []);

  // Grid mouse interaction
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromPosition(e.clientX, e.clientY);
    if (!cell) return;
    const [row, col] = cell;

    if (playbackState !== 'idle') return;

    if (row === startNode[0] && col === startNode[1]) {
      setDrawingMode('start');
    } else if (row === endNode[0] && col === endNode[1]) {
      setDrawingMode('end');
    } else {
      setDrawingMode('wall');
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = next[row][col] === 1 ? 0 : 1;
        return next;
      });
    }
  }, [startNode, endNode, playbackState, getCellFromPosition]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingMode) return;
    const cell = getCellFromPosition(e.clientX, e.clientY);
    if (!cell) return;
    const [row, col] = cell;

    if (drawingMode === 'wall') {
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if ((row === startNode[0] && col === startNode[1]) || (row === endNode[0] && col === endNode[1])) return next;
        next[row][col] = 1;
        return next;
      });
    } else if (drawingMode === 'start') {
      if (grid[row][col] !== 1 && !(row === endNode[0] && col === endNode[1])) {
        setStartNode([row, col]);
      }
    } else if (drawingMode === 'end') {
      if (grid[row][col] !== 1 && !(row === startNode[0] && col === startNode[1])) {
        setEndNode([row, col]);
      }
    }
  }, [drawingMode, startNode, endNode, grid, getCellFromPosition]);

  const handleCanvasMouseUp = useCallback(() => {
    setDrawingMode(null);
  }, []);

  // Touch support for canvas
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (!cell) return;
    const [row, col] = cell;

    if (playbackState !== 'idle') return;

    if (row === startNode[0] && col === startNode[1]) {
      setDrawingMode('start');
    } else if (row === endNode[0] && col === endNode[1]) {
      setDrawingMode('end');
    } else {
      setDrawingMode('wall');
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = next[row][col] === 1 ? 0 : 1;
        return next;
      });
    }
  }, [startNode, endNode, playbackState, getCellFromPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawingMode) return;
    const touch = e.touches[0];
    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (!cell) return;
    const [row, col] = cell;

    if (drawingMode === 'wall') {
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        if ((row === startNode[0] && col === startNode[1]) || (row === endNode[0] && col === endNode[1])) return next;
        next[row][col] = 1;
        return next;
      });
    } else if (drawingMode === 'start') {
      if (grid[row][col] !== 1 && !(row === endNode[0] && col === endNode[1])) {
        setStartNode([row, col]);
      }
    } else if (drawingMode === 'end') {
      if (grid[row][col] !== 1 && !(row === startNode[0] && col === startNode[1])) {
        setEndNode([row, col]);
      }
    }
  }, [drawingMode, startNode, endNode, grid, getCellFromPosition]);

  const handleTouchEnd = useCallback(() => {
    setDrawingMode(null);
  }, []);

  // Draw grid on canvas
  useEffect(() => {
    if (isBinarySearch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cellW;
        const y = r * cellH;
        const key = `${r},${c}`;

        if (r === startNode[0] && c === startNode[1]) {
          ctx.fillStyle = '#3fb950';
        } else if (r === endNode[0] && c === endNode[1]) {
          ctx.fillStyle = '#f85149';
        } else if (pathCells.has(key)) {
          ctx.fillStyle = '#d29922';
        } else if (visitedCells.has(key)) {
          ctx.fillStyle = '#1f6feb';
        } else if (frontierCells.has(key)) {
          ctx.fillStyle = '#388bfd';
        } else if (grid[r][c] === 1) {
          ctx.fillStyle = '#30363d';
        } else {
          ctx.fillStyle = '#0d1117';
        }

        ctx.fillRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);
      }
    }
  }, [grid, startNode, endNode, visitedCells, frontierCells, pathCells, isBinarySearch, canvasSize]);

  const activeLine = steps.length > 0 && currentStep < steps.length ? steps[currentStep].line : -1;

  useEffect(() => {
    if (isBinarySearch) {
      generateBsArray();
    } else {
      generateGrid();
    }
  }, [isBinarySearch, generateGrid, generateBsArray]);

  return (
    <div className="searching-visualizer">
      <Controls
        state={playbackState}
        speed={speed}
        onSpeedChange={setSpeed}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        onGenerate={isBinarySearch ? generateBsArray : generateGrid}
        currentStep={currentStep}
        totalSteps={steps.length}
        message={message}
      />
      <div className="viz-area">
        {isBinarySearch ? (
          <div className="binary-search-area">
            <div className="bs-info">
              <span className="bs-label">target:</span>
              <input
                type="number"
                value={bsTarget}
                onChange={(e) => setBsTarget(Number(e.target.value))}
                className="bs-target-input"
              />
              <span className="bs-label" style={{ marginLeft: 12 }}>
                {bsLow >= 0 ? `low=${bsLow}` : ''}
              </span>
              <span className="bs-label" style={{ marginLeft: 8 }}>
                {bsHigh >= 0 ? `high=${bsHigh}` : ''}
              </span>
              <span className="bs-label" style={{ marginLeft: 8 }}>
                {bsMid >= 0 ? `mid=${bsMid}` : ''}
              </span>
            </div>
            <div className="bs-array">
              {bsArray.map((val, idx) => {
                let cellClass = 'bs-cell';
                if (bsFound && idx === bsMid) cellClass += ' bs-found';
                else if (idx === bsMid) cellClass += ' bs-mid';
                else if (bsVisited.has(idx)) cellClass += ' bs-visited';
                if (bsLow >= 0 && idx >= bsLow && idx <= bsHigh && playbackState !== 'idle') cellClass += ' bs-range';

                return (
                  <div key={idx} className={cellClass}>
                    <span className="bs-index">{idx}</span>
                    <span className="bs-value">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid-area" ref={gridContainerRef}>
            <div className="grid-tools">
              <span className="grid-tool-info">
                <span className="grid-tool-swatch" style={{ background: '#3fb950' }} />시작
              </span>
              <span className="grid-tool-info">
                <span className="grid-tool-swatch" style={{ background: '#f85149' }} />도착
              </span>
              <span className="grid-tool-info">
                <span className="grid-tool-swatch" style={{ background: '#30363d' }} />벽
              </span>
              <span className="grid-tool-info">
                <span className="grid-tool-swatch" style={{ background: '#1f6feb' }} />방문
              </span>
              <span className="grid-tool-info">
                <span className="grid-tool-swatch" style={{ background: '#d29922' }} />경로
              </span>
              <span className="grid-hint">클릭/드래그로 벽 그리기</span>
            </div>
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="grid-canvas"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
        )}
      </div>
      <CodePanel
        code={algorithm.code}
        activeLine={activeLine}
        complexity={{ time: algorithm.timeComplexity, space: algorithm.spaceComplexity }}
        description={algorithm.description}
        difficulty={algorithm.difficulty}
      />
    </div>
  );
}
