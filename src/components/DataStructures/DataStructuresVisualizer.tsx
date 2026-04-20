import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AlgorithmInfo, PlaybackState, TreeNode, LLNode } from '../../types';
import {
  stackPushGen, stackPopGen,
  queueEnqueueGen, queueDequeueGen,
  bstInsertGen,
  llInsertGen, llDeleteGen,
} from '../../algorithms/dataStructures';
import { Controls } from '../Controls/Controls';
import { CodePanel } from '../CodePanel/CodePanel';
import './DataStructuresVisualizer.css';

interface DSStepData {
  type: string;
  indices: number[];
  values: number[];
  message: string;
  line: number;
  data?: any;
}

interface Props {
  algorithm: AlgorithmInfo;
}

export const DataStructuresVisualizer: React.FC<Props> = ({ algorithm }) => {
  // Linear DS (stack/queue)
  const [items, setItems] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Tree
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());

  // Linked list
  const [linkedList, setLinkedList] = useState<LLNode | null>(null);
  const [llHighlighted, setLlHighlighted] = useState<Set<number>>(new Set());

  // Playback
  const [steps, setSteps] = useState<DSStepData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState('준비됨');
  const [inputValue, setInputValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTree = algorithm.id === 'binary-tree';
  const isLinkedList = algorithm.id === 'linked-list';
  const isStack = algorithm.id === 'stack';
  const isQueue = algorithm.id === 'queue';

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
  }, []);

  const resetVisState = useCallback(() => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    setSteps([]);
    setCurrentStep(0);
    setActiveIndex(-1);
    setHighlightedNodes(new Set());
    setLlHighlighted(new Set());
    setMessage('준비됨');
    setPlaybackState('idle');
  }, []);

  // Compute steps for push/enqueue/insert
  const computeInsertSteps = useCallback((value: number) => {
    const allSteps: DSStepData[] = [];

    if (isStack) {
      for (const step of stackPushGen(items, value)) {
        allSteps.push(step as DSStepData);
      }
    } else if (isQueue) {
      for (const step of queueEnqueueGen(items, value)) {
        allSteps.push(step as DSStepData);
      }
    } else if (isTree) {
      for (const step of bstInsertGen(tree, value)) {
        allSteps.push({
          type: step.type,
          indices: [],
          values: step.values,
          message: step.message,
          line: step.line,
          data: step.tree,
        });
      }
    } else if (isLinkedList) {
      for (const step of llInsertGen(linkedList, value)) {
        allSteps.push({
          type: step.type,
          indices: [],
          values: step.values,
          message: step.message,
          line: step.line,
          data: step.list,
        });
      }
    }
    return allSteps;
  }, [isStack, isQueue, isTree, isLinkedList, items, tree, linkedList]);

  const computePopSteps = useCallback(() => {
    const allSteps: DSStepData[] = [];
    if (isStack) {
      for (const step of stackPopGen(items)) {
        allSteps.push(step as DSStepData);
      }
    } else if (isQueue) {
      for (const step of queueDequeueGen(items)) {
        allSteps.push(step as DSStepData);
      }
    }
    return allSteps;
  }, [isStack, isQueue, items]);

  const computeDeleteSteps = useCallback((value: number) => {
    const allSteps: DSStepData[] = [];
    if (isLinkedList) {
      for (const step of llDeleteGen(linkedList, value)) {
        allSteps.push({
          type: step.type,
          indices: [],
          values: step.values,
          message: step.message,
          line: step.line,
          data: step.list,
        });
      }
    }
    return allSteps;
  }, [isLinkedList, linkedList]);

  const applyStep = useCallback((step: DSStepData) => {
    // Clear any pending highlight-clear timer when a new step is applied
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }

    if (isStack || isQueue) {
      if (step.type === 'prepare' || step.type === 'push' || step.type === 'enqueue') {
        setItems([...step.values]);
        setActiveIndex(step.indices[0] ?? -1);
      } else if (step.type === 'pop' || step.type === 'dequeue') {
        setActiveIndex(step.indices[0] ?? -1);
      } else if (step.type === 'done') {
        setItems([...step.values]);
        // Keep highlight visible briefly, then clear
        if (step.indices.length > 0) {
          setActiveIndex(step.indices[0]);
        } else {
          setActiveIndex(-1);
        }
        highlightTimerRef.current = setTimeout(() => {
          setActiveIndex(-1);
          highlightTimerRef.current = null;
        }, 500);
      }
    } else if (isTree) {
      if (step.type === 'highlight') {
        setHighlightedNodes(new Set(step.values));
      } else if (step.type === 'insert' || step.type === 'done') {
        if (step.data) {
          setTree(JSON.parse(JSON.stringify(step.data)));
        }
        // Keep path highlight visible on insert/done
        if (step.values.length > 0) {
          setHighlightedNodes(new Set(step.values));
        }
        // On done, clear highlight after delay
        if (step.type === 'done') {
          highlightTimerRef.current = setTimeout(() => {
            setHighlightedNodes(new Set());
            highlightTimerRef.current = null;
          }, 500);
        }
      }
    } else if (isLinkedList) {
      if (step.type === 'highlight') {
        setLlHighlighted(new Set(step.values));
      } else if (step.type === 'insert' || step.type === 'delete') {
        if (step.data) {
          setLinkedList(JSON.parse(JSON.stringify(step.data)));
        }
        // Keep highlight on insert/delete
        if (step.values.length > 0) {
          setLlHighlighted(new Set(step.values));
        }
      } else if (step.type === 'done') {
        if (step.data) {
          setLinkedList(JSON.parse(JSON.stringify(step.data)));
        }
        // Keep highlight visible briefly, then clear
        if (step.values.length > 0) {
          setLlHighlighted(new Set(step.values));
        }
        highlightTimerRef.current = setTimeout(() => {
          setLlHighlighted(new Set());
          highlightTimerRef.current = null;
        }, 500);
      }
    }
    setMessage(step.message);
  }, [isStack, isQueue, isTree, isLinkedList]);

  // Playback effect
  useEffect(() => {
    if (playbackState === 'playing' && steps.length > 0) {
      if (currentStep >= steps.length - 1) {
        setPlaybackState('done');
        return;
      }
      const interval = Math.max(50, 400 / speed);
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

  const runSteps = useCallback((computed: DSStepData[]) => {
    setSteps(computed);
    if (computed.length > 0) {
      setCurrentStep(0);
      applyStep(computed[0]);
    }
    setPlaybackState('playing');
  }, [applyStep]);

  const handleInsert = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    resetVisState();
    const computed = computeInsertSteps(val);
    runSteps(computed);
    setInputValue('');
  }, [inputValue, computeInsertSteps, runSteps, resetVisState]);

  const handlePop = useCallback(() => {
    if (items.length === 0) return;
    resetVisState();
    const computed = computePopSteps();
    runSteps(computed);
  }, [items, computePopSteps, runSteps, resetVisState]);

  const handleDelete = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    resetVisState();
    const computed = computeDeleteSteps(val);
    runSteps(computed);
    setInputValue('');
  }, [inputValue, computeDeleteSteps, runSteps, resetVisState]);

  const handleReset = useCallback(() => {
    stopPlayback();
    setItems([]);
    setTree(null);
    setLinkedList(null);
    resetVisState();
  }, [stopPlayback, resetVisState]);

  const handlePlay = useCallback(() => {
    setPlaybackState('playing');
  }, []);

  const handlePause = useCallback(() => {
    stopPlayback();
    setPlaybackState('paused');
  }, [stopPlayback]);

  const handleStep = useCallback(() => {
    if (steps.length === 0) return;
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      applyStep(steps[nextStep]);
      setPlaybackState('paused');
    } else {
      setPlaybackState('done');
    }
  }, [steps, currentStep, applyStep]);

  // Random fill
  const handleRandomFill = useCallback(() => {
    resetVisState();
    if (isStack || isQueue) {
      const count = 6 + Math.floor(Math.random() * 4);
      const arr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
      setItems(arr);
    } else if (isTree) {
      const count = 8 + Math.floor(Math.random() * 5);
      let t: TreeNode | null = null;
      const vals = Array.from({ length: count }, () => Math.floor(Math.random() * 99) + 1);
      for (const v of vals) {
        t = insertBST(t, v);
      }
      setTree(t);
    } else if (isLinkedList) {
      const count = 6 + Math.floor(Math.random() * 4);
      const vals = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
      let head: LLNode | null = null;
      for (const v of vals) {
        head = appendLL(head, v);
      }
      setLinkedList(head);
    }
    setMessage('랜덤 데이터 생성됨');
  }, [isStack, isQueue, isTree, isLinkedList, resetVisState]);

  const activeLine = steps.length > 0 && currentStep < steps.length ? steps[currentStep].line : -1;

  // SVG layout for tree — using viewBox for responsive scaling
  const renderTree = () => {
    if (!tree) return null;
    const positions = new Map<string, { x: number; y: number }>();
    const svgWidth = 700;
    const svgHeight = 400;

    function layout(node: TreeNode | null, x: number, y: number, spread: number) {
      if (!node) return;
      positions.set(String(node.value), { x, y });
      layout(node.left, x - spread, y + 60, spread * 0.55);
      layout(node.right, x + spread, y + 60, spread * 0.55);
    }

    layout(tree, svgWidth / 2, 30, svgWidth / 4);

    const nodes: React.ReactNode[] = [];
    const edges: React.ReactNode[] = [];

    function draw(node: TreeNode | null) {
      if (!node) return;
      const pos = positions.get(String(node.value));
      if (!pos) return;
      const key = String(node.value);
      const isHighlighted = highlightedNodes.has(node.value);

      if (node.left) {
        const childPos = positions.get(String(node.left.value));
        if (childPos) {
          edges.push(
            <line
              key={`edge-${key}-left`}
              x1={pos.x} y1={pos.y}
              x2={childPos.x} y2={childPos.y}
              stroke={isHighlighted ? '#58a6ff' : '#30363d'}
              strokeWidth={isHighlighted ? 2 : 1}
            />
          );
        }
      }
      if (node.right) {
        const childPos = positions.get(String(node.right.value));
        if (childPos) {
          edges.push(
            <line
              key={`edge-${key}-right`}
              x1={pos.x} y1={pos.y}
              x2={childPos.x} y2={childPos.y}
              stroke={isHighlighted ? '#58a6ff' : '#30363d'}
              strokeWidth={isHighlighted ? 2 : 1}
            />
          );
        }
      }

      nodes.push(
        <g key={`node-${key}`}>
          <circle
            cx={pos.x} cy={pos.y}
            r={18}
            fill={isHighlighted ? '#1f6feb' : '#21262d'}
            stroke={isHighlighted ? '#58a6ff' : '#484f58'}
            strokeWidth={1.5}
          />
          <text
            x={pos.x} y={pos.y + 4}
            textAnchor="middle"
            fill={isHighlighted ? '#fff' : '#e6edf3'}
            fontSize={11}
            fontFamily="var(--font-mono)"
          >
            {node.value}
          </text>
        </g>
      );

      draw(node.left);
      draw(node.right);
    }

    draw(tree);

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="tree-svg"
      >
        {edges}
        {nodes}
      </svg>
    );
  };

  // SVG layout for linked list — using viewBox for responsive scaling
  const renderLinkedList = () => {
    if (!linkedList) return null;
    const nodes: React.ReactNode[] = [];
    let curr: LLNode | null = linkedList;
    let idx = 0;

    while (curr) {
      const isHighlighted = llHighlighted.has(curr.value);
      const x = 60 + idx * 120;
      const y = 50;

      nodes.push(
        <g key={`ll-${idx}`}>
          <rect
            x={x} y={y}
            width={90} height={40}
            fill={isHighlighted ? '#1f6feb' : '#21262d'}
            stroke={isHighlighted ? '#58a6ff' : '#484f58'}
            strokeWidth={1.5}
          />
          <text
            x={x + 45} y={y + 24}
            textAnchor="middle"
            fill={isHighlighted ? '#fff' : '#e6edf3'}
            fontSize={13}
            fontFamily="var(--font-mono)"
          >
            {curr.value}
          </text>
          {/* Arrow */}
          {curr.next && (
            <line
              x1={x + 90} y1={y + 20}
              x2={x + 110} y2={y + 20}
              stroke="#484f58"
              strokeWidth={1.5}
              markerEnd="url(#arrowhead)"
            />
          )}
        </g>
      );

      curr = curr.next;
      idx++;
    }

    const svgWidth = Math.max(200, 60 + idx * 120);
    const svgHeight = 120;

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMin meet"
        className="ll-svg"
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#484f58" />
          </marker>
        </defs>
        {nodes}
        {linkedList && (
          <text x={30} y={74} fill="#484f58" fontSize={10} fontFamily="var(--font-mono)">head</text>
        )}
      </svg>
    );
  };

  return (
    <div className="ds-visualizer">
      <Controls
        state={playbackState}
        speed={speed}
        onSpeedChange={setSpeed}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        onGenerate={handleRandomFill}
        currentStep={currentStep}
        totalSteps={steps.length}
        message={message}
      />
      <div className="viz-area">
        <div className="ds-toolbar">
          <input
            type="number"
            placeholder={isLinkedList ? '값 입력 (삽입/삭제)' : '값 입력'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (isLinkedList) handleInsert();
                else handleInsert();
              }
            }}
            className="ds-input"
          />
          <button onClick={handleInsert} disabled={!inputValue.trim() || playbackState === 'playing'}>
            {isTree ? '삽입' : isLinkedList ? '삽입' : isStack ? 'Push' : 'Enqueue'}
          </button>
          {(isStack || isQueue) && (
            <button onClick={handlePop} disabled={items.length === 0 || playbackState === 'playing'}>
              {isStack ? 'Pop' : 'Dequeue'}
            </button>
          )}
          {isLinkedList && (
            <button onClick={handleDelete} disabled={!inputValue.trim() || playbackState === 'playing'}>
              삭제
            </button>
          )}
          <span className="ds-size">
            {isStack && `size: ${items.length}`}
            {isQueue && `size: ${items.length}`}
            {isTree && `nodes: ${countNodes(tree)}`}
            {isLinkedList && `nodes: ${countLLNodes(linkedList)}`}
          </span>
        </div>

        <div className="ds-canvas">
          {(isStack || isQueue) && (
            <div className={`linear-ds ${isStack ? 'stack-layout' : 'queue-layout'}`}>
              {items.length === 0 ? (
                <div className="ds-empty">비어있음</div>
              ) : (
                items.map((val, idx) => {
                  const isActive = idx === activeIndex;
                  const isTop = isStack && idx === items.length - 1;
                  const isFront = isQueue && idx === 0;
                  const isRear = isQueue && idx === items.length - 1;

                  return (
                    <div
                      key={idx}
                      className={`ds-box ${isActive ? 'ds-box-active' : ''} ${isTop ? 'ds-box-top' : ''} ${isFront ? 'ds-box-front' : ''} ${isRear ? 'ds-box-rear' : ''}`}
                    >
                      <span className="ds-box-value">{val}</span>
                      {isTop && <span className="ds-box-label">TOP</span>}
                      {isFront && <span className="ds-box-label">FRONT</span>}
                      {isRear && <span className="ds-box-label">REAR</span>}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {isTree && (
            <div className="tree-container">
              {tree ? renderTree() : <div className="ds-empty">노드를 삽입하세요</div>}
            </div>
          )}

          {isLinkedList && (
            <div className="ll-container">
              {linkedList ? renderLinkedList() : <div className="ds-empty">노드를 삽입하세요</div>}
            </div>
          )}
        </div>
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

// Helpers
function insertBST(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertBST(root.left, value);
  else root.right = insertBST(root.right, value);
  return root;
}

function appendLL(head: LLNode | null, value: number): LLNode {
  const node: LLNode = { value, next: null };
  if (!head) return node;
  let curr = head;
  while (curr.next) curr = curr.next;
  curr.next = node;
  return head;
}

function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function countLLNodes(head: LLNode | null): number {
  let count = 0;
  let curr = head;
  while (curr) { count++; curr = curr.next; }
  return count;
}
