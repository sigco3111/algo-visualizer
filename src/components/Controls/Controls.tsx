import React from 'react';
import type { PlaybackState } from '../../types';
import './Controls.css';

interface ControlsProps {
  state: PlaybackState;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onGenerate: () => void;
  currentStep: number;
  totalSteps: number;
  message: string;
  showGenerate?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  state,
  speed,
  onSpeedChange,
  onPlay,
  onPause,
  onStep,
  onReset,
  onGenerate,
  currentStep,
  totalSteps,
  message,
  showGenerate = true,
}) => {
  const isPlaying = state === 'playing';
  const isDone = state === 'done';
  const canStep = state === 'idle' || state === 'paused';

  return (
    <div className="controls-bar">
      <div className="controls-left">
        {showGenerate && (
          <button className="control-btn generate-btn" onClick={onGenerate} disabled={isPlaying}>
            ⟳ 생성
          </button>
        )}
        {!isPlaying ? (
          <button
            className="control-btn play-btn"
            onClick={onPlay}
            disabled={isDone}
          >
            ▶ 실행
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={onPause}>
            ⏸ 일시정지
          </button>
        )}
        <button
          className="control-btn step-btn"
          onClick={onStep}
          disabled={!canStep || isDone}
        >
          → 단계
        </button>
        <button className="control-btn reset-btn" onClick={onReset} disabled={state === 'idle'}>
          ⊘ 초기화
        </button>
        <div className="controls-separator" />
        <div className="speed-control">
          <span className="speed-label">속도</span>
          <input
            type="range"
            min="0.25"
            max="5"
            step="0.25"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="speed-slider"
          />
          <span className="speed-value">{speed.toFixed(2)}x</span>
        </div>
      </div>
      <div className="controls-right">
        <div className="step-counter">
          {totalSteps > 0 ? (
            <span>
              <span className="step-current">{currentStep}</span>
              <span className="step-sep">/</span>
              <span className="step-total">{totalSteps}</span>
            </span>
          ) : (
            <span className="step-current">0/0</span>
          )}
        </div>
        <div className="controls-separator" />
        <div className="step-message" title={message}>
          {message || '준비됨'}
        </div>
      </div>
    </div>
  );
};
