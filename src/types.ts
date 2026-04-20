// ============================================================
// Core Types for Algorithm Visualizer
// ============================================================

// --- Step types yielded by algorithm generators ---

export type SortStepType = 'compare' | 'swap' | 'overwrite' | 'sorted' | 'pivot' | 'range' | 'done';
export type SearchStepType = 'visit' | 'enqueue' | 'dequeue' | 'compare' | 'found' | 'notfound' | 'path' | 'done';
export type DSStepType = 'push' | 'pop' | 'enqueue' | 'dequeue' | 'insert' | 'delete' | 'highlight' | 'done';

export interface SortStep {
  type: SortStepType;
  indices: number[];
  values?: number[];
  message: string;
  line: number;
}

export interface SearchStep {
  type: SearchStepType;
  indices: number[];
  message: string;
  line: number;
  path?: number[];
}

export interface DSStep {
  type: DSStepType;
  indices: number[];
  values?: number[];
  message: string;
  line: number;
  data?: any;
}

export type AlgorithmStep = SortStep | SearchStep | DSStep;

// --- Difficulty badge ---
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

// --- Algorithm metadata ---
export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: Difficulty;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  code: string[];
}

export type AlgorithmCategory = 'sorting' | 'searching' | 'datastructures';

// --- App state ---
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stepping' | 'done';

// --- Sorting visualizer state ---
export interface SortingState {
  array: number[];
  steps: SortStep[];
  currentStep: number;
  activeIndices: Set<number>;
  sortedIndices: Set<number>;
  pivotIndex: number;
  rangeIndices: [number, number];
  state: PlaybackState;
}

// --- Searching visualizer state ---
export interface SearchingState {
  graph: number[][];
  rows: number;
  cols: number;
  startNode: [number, number];
  endNode: [number, number];
  steps: SearchStep[];
  currentStep: number;
  visitedNodes: Set<string>;
  frontierNodes: Set<string>;
  pathNodes: Set<string>;
  found: boolean;
  state: PlaybackState;
  // For binary search
  array?: number[];
  target?: number;
  low?: number;
  high?: number;
  mid?: number;
  // For dijkstra
  weights?: number[][];
}

// --- Data Structure visualizer state ---
export interface DSState {
  items: number[];
  steps: DSStep[];
  currentStep: number;
  activeIndices: Set<number>;
  state: PlaybackState;
  // For tree
  tree?: TreeNode | null;
  // For linked list
  linkedList?: LLNode | null;
}

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface LLNode {
  value: number;
  next: LLNode | null;
}

// --- Category / nav ---
export interface CategoryDef {
  id: AlgorithmCategory;
  label: string;
  algorithms: AlgorithmInfo[];
}
