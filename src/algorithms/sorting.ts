import type { AlgorithmInfo, Difficulty } from '../types';

// ============================================================
// Sorting Algorithm Code Displays
// ============================================================

const bubbleSortCode = [
  'function bubbleSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    for (let j = 0; j < n - i - 1; j++) {',
  '      if (arr[j] > arr[j + 1]) {',
  '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];',
  '      }',
  '    }',
  '  }',
  '  return arr;',
  '}',
];

const selectionSortCode = [
  'function selectionSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 0; i < n - 1; i++) {',
  '    let minIdx = i;',
  '    for (let j = i + 1; j < n; j++) {',
  '      if (arr[j] < arr[minIdx]) minIdx = j;',
  '    }',
  '    if (minIdx !== i) {',
  '      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];',
  '    }',
  '  }',
  '  return arr;',
  '}',
];

const insertionSortCode = [
  'function insertionSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = 1; i < n; i++) {',
  '    let key = arr[i];',
  '    let j = i - 1;',
  '    while (j >= 0 && arr[j] > key) {',
  '      arr[j + 1] = arr[j];',
  '      j--;',
  '    }',
  '    arr[j + 1] = key;',
  '  }',
  '  return arr;',
  '}',
];

const quickSortCode = [
  'function quickSort(arr, low, high) {',
  '  if (low < high) {',
  '    let pi = partition(arr, low, high);',
  '    quickSort(arr, low, pi - 1);',
  '    quickSort(arr, pi + 1, high);',
  '  }',
  '}',
  '',
  'function partition(arr, low, high) {',
  '  let pivot = arr[high];',
  '  let i = low - 1;',
  '  for (let j = low; j < high; j++) {',
  '    if (arr[j] <= pivot) {',
  '      i++;',
  '      [arr[i], arr[j]] = [arr[j], arr[i]];',
  '    }',
  '  }',
  '  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];',
  '  return i + 1;',
  '}',
];

const mergeSortCode = [
  'function mergeSort(arr, l, r) {',
  '  if (l < r) {',
  '    let m = Math.floor((l + r) / 2);',
  '    mergeSort(arr, l, m);',
  '    mergeSort(arr, m + 1, r);',
  '    merge(arr, l, m, r);',
  '  }',
  '}',
  '',
  'function merge(arr, l, m, r) {',
  '  let L = arr.slice(l, m + 1);',
  '  let R = arr.slice(m + 1, r + 1);',
  '  let i = 0, j = 0, k = l;',
  '  while (i < L.length && j < R.length) {',
  '    if (L[i] <= R[j]) arr[k++] = L[i++];',
  '    else arr[k++] = R[j++];',
  '  }',
  '  while (i < L.length) arr[k++] = L[i++];',
  '  while (j < R.length) arr[k++] = R[j++];',
  '}',
];

const heapSortCode = [
  'function heapSort(arr) {',
  '  const n = arr.length;',
  '  for (let i = n/2 - 1; i >= 0; i--)',
  '    heapify(arr, n, i);',
  '  for (let i = n - 1; i > 0; i--) {',
  '    [arr[0], arr[i]] = [arr[i], arr[0]];',
  '    heapify(arr, i, 0);',
  '  }',
  '}',
  '',
  'function heapify(arr, n, i) {',
  '  let largest = i;',
  '  let l = 2*i + 1, r = 2*i + 2;',
  '  if (l < n && arr[l] > arr[largest]) largest = l;',
  '  if (r < n && arr[r] > arr[largest]) largest = r;',
  '  if (largest !== i) {',
  '    [arr[i], arr[largest]] = [arr[largest], arr[i]];',
  '    heapify(arr, n, largest);',
  '  }',
  '}',
];

// ============================================================
// Step Types & Generators
// ============================================================

export interface SortGenStep {
  type: string;
  indices: number[];
  message: string;
  line: number;
}

function msg(parts: string[]): string {
  return parts.join('');
}

export function* bubbleSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1], message: msg(['compare: arr[', String(j), ']=', String(a[j]), ' vs arr[', String(j + 1), ']=', String(a[j + 1])]), line: 4 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: 'swap', indices: [j, j + 1], message: msg(['swap: arr[', String(j), '] <-> arr[', String(j + 1), ']']), line: 5 };
      }
    }
    yield { type: 'sorted', indices: [n - 1 - i], message: msg(['arr[', String(n - 1 - i), ']=', String(a[n - 1 - i]), ' sorted']), line: 3 };
  }
  yield { type: 'sorted', indices: [0], message: msg(['arr[0]=', String(a[0]), ' sorted']), line: 9 };
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 9 };
}

export function* selectionSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    yield { type: 'pivot', indices: [i], message: msg(['search min from arr[', String(i), ']=', String(a[i])]), line: 4 };
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [j, minIdx], message: msg(['compare: arr[', String(j), ']=', String(a[j]), ' vs min=', String(a[minIdx])]), line: 6 };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { type: 'pivot', indices: [minIdx], message: msg(['new min: arr[', String(minIdx), ']=', String(a[minIdx])]), line: 6 };
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: 'swap', indices: [i, minIdx], message: msg(['swap: arr[', String(i), '] <-> arr[', String(minIdx), ']']), line: 10 };
    }
    yield { type: 'sorted', indices: [i], message: msg(['arr[', String(i), ']=', String(a[i]), ' sorted']), line: 3 };
  }
  yield { type: 'sorted', indices: [n - 1], message: msg(['arr[', String(n - 1), ']=', String(a[n - 1]), ' sorted']), line: 13 };
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 13 };
}

export function* insertionSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: 'pivot', indices: [i], message: msg(['insert key=', String(key)]), line: 3 };
    while (j >= 0 && a[j] > key) {
      yield { type: 'compare', indices: [j, j + 1], message: msg(['compare: arr[', String(j), ']=', String(a[j]), ' > key=', String(key)]), line: 5 };
      a[j + 1] = a[j];
      yield { type: 'overwrite', indices: [j, j + 1], message: msg(['shift: arr[', String(j), '] to arr[', String(j + 1), ']']), line: 6 };
      j--;
    }
    a[j + 1] = key;
    yield { type: 'sorted', indices: [j + 1], message: msg(['arr[', String(j + 1), ']=', String(key), ' inserted']), line: 8 };
  }
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 10 };
}

export function* quickSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];

  function* partition(low: number, high: number): Generator<SortGenStep, number, undefined> {
    const pivot = a[high];
    yield { type: 'pivot', indices: [high], message: msg(['pivot: arr[', String(high), ']=', String(pivot)]), line: 10 };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { type: 'compare', indices: [j, high], message: msg(['compare: arr[', String(j), ']=', String(a[j]), ' vs pivot=', String(pivot)]), line: 12 };
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          yield { type: 'swap', indices: [i, j], message: msg(['swap: arr[', String(i), '] <-> arr[', String(j), ']']), line: 14 };
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    yield { type: 'swap', indices: [i + 1, high], message: msg(['place pivot: arr[', String(i + 1), '] <-> arr[', String(high), ']']), line: 16 };
    yield { type: 'sorted', indices: [i + 1], message: msg(['arr[', String(i + 1), ']=', String(a[i + 1]), ' in place']), line: 16 };
    return i + 1;
  }

  function* qs(low: number, high: number): Generator<SortGenStep, void, undefined> {
    if (low < high) {
      yield { type: 'range', indices: [low, high], message: msg(['partition: arr[', String(low), '..', String(high), ']']), line: 2 };
      const piGen = partition(low, high);
      let result = piGen.next();
      while (!result.done) {
        yield result.value;
        result = piGen.next();
      }
      const pi = result.value as number;
      yield* qs(low, pi - 1);
      yield* qs(pi + 1, high);
    } else if (low === high) {
      yield { type: 'sorted', indices: [low], message: msg(['arr[', String(low), ']=', String(a[low]), ' sorted']), line: 2 };
    }
  }

  yield* qs(0, a.length - 1);
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 6 };
}

export function* mergeSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];

  function* merge(l: number, m: number, r: number): Generator<SortGenStep, void, undefined> {
    const L = a.slice(l, m + 1);
    const R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    yield { type: 'range', indices: [l, r], message: msg(['merge: arr[', String(l), '..', String(m), '] + arr[', String(m + 1), '..', String(r), ']']), line: 9 };
    while (i < L.length && j < R.length) {
      yield { type: 'compare', indices: [l + i, m + 1 + j], message: msg(['compare: ', String(L[i]), ' vs ', String(R[j])]), line: 11 };
      if (L[i] <= R[j]) {
        a[k] = L[i];
        yield { type: 'overwrite', indices: [k], message: msg(['arr[', String(k), '] = ', String(L[i])]), line: 12 };
        i++;
      } else {
        a[k] = R[j];
        yield { type: 'overwrite', indices: [k], message: msg(['arr[', String(k), '] = ', String(R[j])]), line: 13 };
        j++;
      }
      k++;
    }
    while (i < L.length) {
      a[k] = L[i];
      yield { type: 'overwrite', indices: [k], message: msg(['arr[', String(k), '] = ', String(L[i])]), line: 15 };
      i++; k++;
    }
    while (j < R.length) {
      a[k] = R[j];
      yield { type: 'overwrite', indices: [k], message: msg(['arr[', String(k), '] = ', String(R[j])]), line: 16 };
      j++; k++;
    }
  }

  function* ms(l: number, r: number): Generator<SortGenStep, void, undefined> {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      yield { type: 'range', indices: [l, r], message: msg(['divide: arr[', String(l), '..', String(r), '], mid=', String(m)]), line: 3 };
      yield* ms(l, m);
      yield* ms(m + 1, r);
      yield* merge(l, m, r);
    }
  }

  yield* ms(0, a.length - 1);
  for (let i = 0; i < a.length; i++) {
    yield { type: 'sorted', indices: [i], message: msg(['arr[', String(i), ']=', String(a[i])]), line: 6 };
  }
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 6 };
}

export function* heapSortGen(arr: number[]): Generator<SortGenStep> {
  const a = [...arr];
  const n = a.length;

  function* heapify(size: number, i: number): Generator<SortGenStep, void, undefined> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size) {
      yield { type: 'compare', indices: [l, largest], message: msg(['compare: arr[', String(l), ']=', String(a[l]), ' vs arr[', String(largest), ']=', String(a[largest])]), line: 20 };
      if (a[l] > a[largest]) largest = l;
    }
    if (r < size) {
      yield { type: 'compare', indices: [r, largest], message: msg(['compare: arr[', String(r), ']=', String(a[r]), ' vs arr[', String(largest), ']=', String(a[largest])]), line: 21 };
      if (a[r] > a[largest]) largest = r;
    }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      yield { type: 'swap', indices: [i, largest], message: msg(['swap: arr[', String(i), '] <-> arr[', String(largest), ']']), line: 23 };
      yield* heapify(size, largest);
    }
  }

  yield { type: 'range', indices: [0, n - 1], message: 'build max heap', line: 3 };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { type: 'swap', indices: [0, i], message: msg(['extract: arr[0]=', String(a[i]), ' to arr[', String(i), ']']), line: 6 };
    yield { type: 'sorted', indices: [i], message: msg(['arr[', String(i), ']=', String(a[i]), ' sorted']), line: 6 };
    yield* heapify(i, 0);
  }
  yield { type: 'sorted', indices: [0], message: msg(['arr[0]=', String(a[0]), ' sorted']), line: 8 };
  yield { type: 'done', indices: [], message: 'Sort complete!', line: 8 };
}

// ============================================================
// Algorithm Info Exports
// ============================================================

export const sortingAlgorithms: AlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'basic' as Difficulty,
    timeComplexity: 'O(n\u00B2)',
    spaceComplexity: 'O(1)',
    description: 'Compare adjacent elements and swap if out of order',
    code: bubbleSortCode,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    difficulty: 'basic' as Difficulty,
    timeComplexity: 'O(n\u00B2)',
    spaceComplexity: 'O(1)',
    description: 'Find minimum and place at the beginning each pass',
    code: selectionSortCode,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'basic' as Difficulty,
    timeComplexity: 'O(n\u00B2)',
    spaceComplexity: 'O(1)',
    description: 'Insert each element into its correct position',
    code: insertionSortCode,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'intermediate' as Difficulty,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Divide and conquer with pivot partitioning',
    code: quickSortCode,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'intermediate' as Difficulty,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divide, sort, then merge sorted subarrays',
    code: mergeSortCode,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    difficulty: 'advanced' as Difficulty,
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Build max heap then extract elements one by one',
    code: heapSortCode,
  },
];

export const sortingGenerators: Record<string, (arr: number[]) => Generator<SortGenStep>> = {
  'bubble-sort': bubbleSortGen,
  'selection-sort': selectionSortGen,
  'insertion-sort': insertionSortGen,
  'quick-sort': quickSortGen,
  'merge-sort': mergeSortGen,
  'heap-sort': heapSortGen,
};
