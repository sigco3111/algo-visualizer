import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AlgorithmInfo, SortStep, PlaybackState } from '../../types';
import { sortingGenerators } from '../../algorithms/sorting';
import { Controls } from '../Controls/Controls';
import { CodePanel } from '../CodePanel/CodePanel';
import './SortingVisualizer.css';

interface Props {
  algorithm: AlgorithmInfo;
}

export const SortingVisualizer: React.FC<Props> = ({ algorithm }) => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [rangeStart, setRangeStart] = useState(-1);
  const [rangeEnd, setRangeEnd] = useState(-1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState('준비됨');
  const [customInput, setCustomInput] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsRef = useRef<SortStep[]>([]);

  const generateArray = useCallback(() => {
    stopPlayback();
    const size = 30 + Math.floor(Math.random() * 20);
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setArray(arr);
    setSteps([]);
    setCurrentStep(0);
    setActiveIndices(new Set());
    setSortedIndices(new Set());
    setPivotIndex(-1);
    setRangeStart(-1);
    setRangeEnd(-1);
    setMessage('새 배열 생성됨');
    setPlaybackState('idle');
  }, []);

  const generateFromInput = useCallback(() => {
    stopPlayback();
    const nums = customInput
      .split(/[\s,]+/)
      .map(Number)
      .filter(n => !isNaN(n) && n > 0 && n <= 200);
    if (nums.length < 2) return;
    setArray(nums);
    setSteps([]);
    setCurrentStep(0);
    setActiveIndices(new Set());
    setSortedIndices(new Set());
    setPivotIndex(-1);
    setRangeStart(-1);
    setRangeEnd(-1);
    setMessage(`${nums.length}개 원소 로드됨`);
    setPlaybackState('idle');
  }, [customInput]);

  const computeSteps = useCallback(() => {
    const gen = sortingGenerators[algorithm.id];
    if (!gen) return [];
    const allSteps: SortStep[] = [];
    for (const step of gen(array)) {
      allSteps.push(step as SortStep);
    }
    return allSteps;
  }, [algorithm.id, array]);

  const applyStep = useCallback((step: SortStep) => {
    switch (step.type) {
      case 'compare':
        setActiveIndices(new Set(step.indices));
        setPivotIndex(-1);
        break;
      case 'swap':
        setActiveIndices(new Set(step.indices));
        setPivotIndex(-1);
        break;
      case 'overwrite':
        setActiveIndices(new Set(step.indices));
        break;
      case 'sorted':
        setSortedIndices(prev => {
          const next = new Set(prev);
          step.indices.forEach(i => next.add(i));
          return next;
        });
        break;
      case 'pivot':
        setPivotIndex(step.indices[0]);
        setActiveIndices(new Set(step.indices));
        break;
      case 'range':
        if (step.indices.length === 2) {
          setRangeStart(step.indices[0]);
          setRangeEnd(step.indices[1]);
        }
        break;
      case 'done':
        // Mark all as sorted
        setSortedIndices(new Set(array.map((_, i) => i)));
        setActiveIndices(new Set());
        setPivotIndex(-1);
        setRangeStart(-1);
        setRangeEnd(-1);
        break;
    }
    setMessage(step.message);
  }, [array]);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Actually, let me redo playback with a proper useEffect approach
  useEffect(() => {
    if (playbackState === 'playing' && steps.length > 0) {
      if (currentStep >= steps.length - 1) {
        setPlaybackState('done');
        return;
      }
      const interval = Math.max(10, 200 / speed);
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
      const computed = computeSteps();
      stepsRef.current = computed;
      setSteps(computed);
    }
    if (currentStep >= steps.length - 1 && steps.length > 0) {
      // Reset to beginning
      setCurrentStep(0);
      setSortedIndices(new Set());
      setPivotIndex(-1);
      setRangeStart(-1);
      setRangeEnd(-1);
      setActiveIndices(new Set());
    }
    setPlaybackState('playing');
  }, [steps, currentStep, computeSteps]);

  const handlePause = useCallback(() => {
    stopPlayback();
    setPlaybackState('paused');
  }, [stopPlayback]);

  const handleStep = useCallback(() => {
    if (steps.length === 0) {
      const computed = computeSteps();
      stepsRef.current = computed;
      setSteps(computed);
    }
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      applyStep(steps[nextStep]);
      setPlaybackState('paused');
    } else {
      setPlaybackState('done');
    }
  }, [steps, currentStep, computeSteps, applyStep]);

  const handleReset = useCallback(() => {
    stopPlayback();
    stepsRef.current = [];
    setSteps([]);
    setCurrentStep(0);
    setActiveIndices(new Set());
    setSortedIndices(new Set());
    setPivotIndex(-1);
    setRangeStart(-1);
    setRangeEnd(-1);
    setMessage('초기화됨');
    setPlaybackState('idle');
  }, [stopPlayback]);

  // Active line for code panel
  const activeLine = steps.length > 0 && currentStep < steps.length ? steps[currentStep].line : -1;

  const maxVal = Math.max(...array, 1);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  return (
    <div className="sorting-visualizer">
      <Controls
        state={playbackState}
        speed={speed}
        onSpeedChange={setSpeed}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        onGenerate={generateArray}
        currentStep={currentStep}
        totalSteps={steps.length}
        message={message}
      />
      <div className="viz-area">
        <div className="sorting-input-row">
          <input
            type="text"
            placeholder="숫자 입력 (쉼표/공백 구분): 38 27 43 3 9 82 10"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateFromInput()}
            className="sorting-custom-input"
          />
          <button onClick={generateFromInput} disabled={!customInput.trim()}>
            적용
          </button>
        </div>
        <div className="bars-container">
          {array.map((val, idx) => {
            const isActive = activeIndices.has(idx);
            const isSorted = sortedIndices.has(idx);
            const isPivot = idx === pivotIndex;
            const inRange = rangeStart >= 0 && idx >= rangeStart && idx <= rangeEnd;

            let barClass = 'bar';
            if (isSorted) barClass += ' bar-sorted';
            if (isActive) barClass += ' bar-active';
            if (isPivot) barClass += ' bar-pivot';
            if (inRange && !isSorted) barClass += ' bar-range';

            const height = (val / maxVal) * 100;

            return (
              <div key={idx} className="bar-wrapper">
                <div
                  className={barClass}
                  style={{ height: `${height}%` }}
                  title={`arr[${idx}] = ${val}`}
                />
                {array.length <= 50 && (
                  <span className="bar-value">{val}</span>
                )}
              </div>
            );
          })}
        </div>
        {array.length > 0 && (
          <div className="sorting-legend">
            <span className="legend-item"><span className="legend-swatch swatch-active" />비교/교환</span>
            <span className="legend-item"><span className="legend-swatch swatch-pivot" />피벗</span>
            <span className="legend-item"><span className="legend-swatch swatch-sorted" />정렬됨</span>
            <span className="legend-item"><span className="legend-swatch swatch-range" />범위</span>
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
};
