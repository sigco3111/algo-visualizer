import type { AlgorithmInfo } from '../types';

// ============================================================
// Helper for building messages without template literals
// ============================================================
function msg(parts: string[]): string {
  return parts.join('');
}

// ============================================================
// Searching Algorithm Code
// ============================================================

const bfsCode: string[] = [
  'function bfs(grid, start, end) {',
  '  const queue = [start];',
  '  const visited = new Set([start]);',
  '  const parent = {};',
  '',
  '  while (queue.length > 0) {',
  '    const curr = queue.shift();',
  '    if (curr === end) return path(parent, end);',
  '    for (const neighbor of getNeighbors(curr)) {',
  '      if (!visited.has(neighbor) && grid[neighbor] !== 1) {',
  '        visited.add(neighbor);',
  '        parent[neighbor] = curr;',
  '        queue.push(neighbor);',
  '      }',
  '    }',
  '  }',
  '  return null; // no path',
  '}',
];

const dfsCode: string[] = [
  'function dfs(grid, start, end) {',
  '  const stack = [start];',
  '  const visited = new Set([start]);',
  '  const parent = {};',
  '',
  '  while (stack.length > 0) {',
  '    const curr = stack.pop();',
  '    if (curr === end) return path(parent, end);',
  '    for (const neighbor of getNeighbors(curr)) {',
  '      if (!visited.has(neighbor) && grid[neighbor] !== 1) {',
  '        visited.add(neighbor);',
  '        parent[neighbor] = curr;',
  '        stack.push(neighbor);',
  '      }',
  '    }',
  '  }',
  '  return null; // no path',
  '}',
];

const binarySearchCode: string[] = [
  'function binarySearch(arr, target) {',
  '  let low = 0;',
  '  let high = arr.length - 1;',
  '',
  '  while (low <= high) {',
  '    let mid = Math.floor((low + high) / 2);',
  '    if (arr[mid] === target) return mid;',
  '    else if (arr[mid] < target) low = mid + 1;',
  '    else high = mid - 1;',
  '  }',
  '  return -1; // not found',
  '}',
];

const dijkstraCode: string[] = [
  'function dijkstra(graph, start, end) {',
  '  const dist = {};',
  '  const prev = {};',
  '  const pq = new PriorityQueue();',
  '  dist[start] = 0;',
  '  pq.enqueue(start, 0);',
  '',
  '  while (!pq.isEmpty()) {',
  '    const u = pq.dequeue();',
  '    if (u === end) break;',
  '    for (const {v, w} of graph[u]) {',
  '      const alt = dist[u] + w;',
  '      if (alt < (dist[v] ?? Infinity)) {',
  '        dist[v] = alt;',
  '        prev[v] = u;',
  '        pq.enqueue(v, alt);',
  '      }',
  '    }',
  '  }',
  '  return { dist, path: buildPath(prev, end) };',
  '}',
];

// ============================================================
// Step types for generators
// ============================================================

interface SearchGenStep {
  type: string;
  nodes: string[];
  message: string;
  line: number;
  path?: string[];
}

interface BinarySearchGenStep {
  type: string;
  indices: number[];
  message: string;
  line: number;
}

// ============================================================
// BFS Generator
// ============================================================

export function* bfsGen(
  rows: number,
  cols: number,
  walls: Set<string>,
  start: [number, number],
  end: [number, number],
): Generator<SearchGenStep> {
  const key = (r: number, c: number) => msg([String(r), ',', String(c)]);
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [];
  const startKey = key(start[0], start[1]);
  const endKey = key(end[0], end[1]);

  queue.push(startKey);
  visited.add(startKey);
  yield {
    type: 'enqueue',
    nodes: [startKey],
    message: msg(['start: (', String(start[0]), ', ', String(start[1]), ')']),
    line: 1,
  };

  let found = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const [cr, cc] = curr.split(',').map(Number);
    yield {
      type: 'visit',
      nodes: [curr],
      message: msg(['visit: (', String(cr), ', ', String(cc), ')']),
      line: 5,
    };

    if (curr === endKey) {
      found = true;
      yield {
        type: 'found',
        nodes: [curr],
        message: msg(['reached! (', String(cr), ', ', String(cc), ')']),
        line: 6,
      };
      break;
    }

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr;
      const nc = cc + dc;
      const nk = key(nr, nc);
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nk) && !walls.has(nk)) {
        visited.add(nk);
        parent.set(nk, curr);
        queue.push(nk);
        yield {
          type: 'enqueue',
          nodes: [nk],
          message: msg(['enqueue: (', String(nr), ', ', String(nc), ')']),
          line: 11,
        };
      }
    }
  }

  if (found) {
    const path: string[] = [];
    let cur = endKey;
    while (cur) {
      path.unshift(cur);
      cur = parent.get(cur) || '';
      if (cur === startKey) { path.unshift(cur); break; }
    }
    yield {
      type: 'path',
      nodes: path,
      message: msg(['path found! (', String(path.length), ' cells)']),
      line: 6,
      path,
    };
  } else {
    yield {
      type: 'notfound',
      nodes: [],
      message: 'no path found',
      line: 15,
    };
  }
  yield {
    type: 'done',
    nodes: [],
    message: 'search complete',
    line: 15,
  };
}

// ============================================================
// DFS Generator
// ============================================================

export function* dfsGen(
  rows: number,
  cols: number,
  walls: Set<string>,
  start: [number, number],
  end: [number, number],
): Generator<SearchGenStep> {
  const key = (r: number, c: number) => msg([String(r), ',', String(c)]);
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const stack: string[] = [];
  const startKey = key(start[0], start[1]);
  const endKey = key(end[0], end[1]);

  stack.push(startKey);
  yield {
    type: 'enqueue',
    nodes: [startKey],
    message: msg(['start: (', String(start[0]), ', ', String(start[1]), ')']),
    line: 1,
  };

  let found = false;
  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (visited.has(curr)) continue;
    visited.add(curr);
    const [cr, cc] = curr.split(',').map(Number);
    yield {
      type: 'visit',
      nodes: [curr],
      message: msg(['visit: (', String(cr), ', ', String(cc), ')']),
      line: 5,
    };

    if (curr === endKey) {
      found = true;
      yield {
        type: 'found',
        nodes: [curr],
        message: msg(['reached! (', String(cr), ', ', String(cc), ')']),
        line: 6,
      };
      break;
    }

    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr;
      const nc = cc + dc;
      const nk = key(nr, nc);
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nk) && !walls.has(nk)) {
        parent.set(nk, curr);
        stack.push(nk);
        yield {
          type: 'enqueue',
          nodes: [nk],
          message: msg(['push: (', String(nr), ', ', String(nc), ')']),
          line: 11,
        };
      }
    }
  }

  if (found) {
    const path: string[] = [];
    let cur = endKey;
    while (cur) {
      path.unshift(cur);
      cur = parent.get(cur) || '';
      if (cur === startKey) { path.unshift(cur); break; }
    }
    yield {
      type: 'path',
      nodes: path,
      message: msg(['path found! (', String(path.length), ' cells)']),
      line: 6,
      path,
    };
  } else {
    yield {
      type: 'notfound',
      nodes: [],
      message: 'no path found',
      line: 15,
    };
  }
  yield {
    type: 'done',
    nodes: [],
    message: 'search complete',
    line: 15,
  };
}

// ============================================================
// Binary Search Generator
// ============================================================

export function* binarySearchGen(
  arr: number[],
  target: number,
): Generator<BinarySearchGenStep> {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield {
      type: 'compare',
      indices: [mid],
      message: msg(['mid=', String(mid), ', arr[', String(mid), ']=', String(arr[mid])]),
      line: 5,
    };

    if (arr[mid] === target) {
      yield {
        type: 'found',
        indices: [mid],
        message: msg(['found! target=', String(target), ' at index ', String(mid)]),
        line: 6,
      };
      yield {
        type: 'done',
        indices: [],
        message: 'search complete',
        line: 6,
      };
      return;
    } else if (arr[mid] < target) {
      yield {
        type: 'visit',
        indices: Array.from({ length: mid - low + 1 }, (_, i) => low + i),
        message: msg([
          'arr[', String(mid), ']=', String(arr[mid]),
          ' < ', String(target),
          ' -> low = ', String(mid + 1),
        ]),
        line: 7,
      };
      low = mid + 1;
    } else {
      yield {
        type: 'visit',
        indices: Array.from({ length: high - mid + 1 }, (_, i) => mid + i),
        message: msg([
          'arr[', String(mid), ']=', String(arr[mid]),
          ' > ', String(target),
          ' -> high = ', String(mid - 1),
        ]),
        line: 8,
      };
      high = mid - 1;
    }
  }

  yield {
    type: 'notfound',
    indices: [],
    message: msg(['target=', String(target), ' not found']),
    line: 10,
  };
  yield {
    type: 'done',
    indices: [],
    message: 'search complete',
    line: 10,
  };
}

// ============================================================
// Dijkstra Generator
// ============================================================

export function* dijkstraGen(
  rows: number,
  cols: number,
  weights: number[][],
  start: [number, number],
  end: [number, number],
): Generator<SearchGenStep> {
  const key = (r: number, c: number) => msg([String(r), ',', String(c)]);
  const startKey = key(start[0], start[1]);
  const endKey = key(end[0], end[1]);
  const dist = new Map<string, number>();
  const prev = new Map<string, string>();
  const visited = new Set<string>();

  const pq: { node: string; cost: number }[] = [];

  dist.set(startKey, 0);
  pq.push({ node: startKey, cost: 0 });
  yield {
    type: 'enqueue',
    nodes: [startKey],
    message: msg(['start: (', String(start[0]), ', ', String(start[1]), '), cost=0']),
    line: 4,
  };

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node: u, cost: uCost } = pq.shift()!;
    const [ur, uc] = u.split(',').map(Number);

    if (visited.has(u)) continue;
    visited.add(u);
    yield {
      type: 'visit',
      nodes: [u],
      message: msg(['visit: (', String(ur), ', ', String(uc), '), cost=', String(uCost)]),
      line: 7,
    };

    if (u === endKey) {
      yield {
        type: 'found',
        nodes: [u],
        message: msg(['reached! shortest distance=', String(uCost)]),
        line: 8,
      };
      break;
    }

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = ur + dr;
      const nc = uc + dc;
      const nk = key(nr, nc);
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && weights[nr][nc] >= 0) {
        const alt = uCost + weights[nr][nc];
        const currDist = dist.get(nk) ?? Infinity;
        yield {
          type: 'compare',
          nodes: [nk],
          message: msg(['(', String(nr), ',', String(nc), '): ', String(alt), ' < ', String(currDist), '?']),
          line: 12,
        };
        if (alt < currDist) {
          dist.set(nk, alt);
          prev.set(nk, u);
          pq.push({ node: nk, cost: alt });
          yield {
            type: 'enqueue',
            nodes: [nk],
            message: msg(['update: (', String(nr), ',', String(nc), ') cost=', String(alt)]),
            line: 14,
          };
        }
      }
    }
  }

  if (visited.has(endKey)) {
    const path: string[] = [];
    let cur = endKey;
    while (cur) {
      path.unshift(cur);
      cur = prev.get(cur) || '';
      if (cur === startKey) { path.unshift(cur); break; }
    }
    yield {
      type: 'path',
      nodes: path,
      message: msg(['shortest path! (', String(path.length), ' cells)']),
      line: 17,
      path,
    };
  } else {
    yield {
      type: 'notfound',
      nodes: [],
      message: 'no path found',
      line: 17,
    };
  }
  yield {
    type: 'done',
    nodes: [],
    message: 'search complete',
    line: 17,
  };
}

// ============================================================
// Algorithm Info Exports
// ============================================================

export const searchingAlgorithms: AlgorithmInfo[] = [
  {
    id: 'bfs',
    name: 'BFS',
    category: 'searching',
    difficulty: 'basic',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Breadth-First Search - level-by-level traversal using a queue',
    code: bfsCode,
  },
  {
    id: 'dfs',
    name: 'DFS',
    category: 'searching',
    difficulty: 'basic',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Depth-First Search - path exploration using a stack',
    code: dfsCode,
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    difficulty: 'basic',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Binary search on a sorted array to find an element',
    code: binarySearchCode,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    category: 'searching',
    difficulty: 'advanced',
    timeComplexity: 'O(V^2)',
    spaceComplexity: 'O(V)',
    description: 'Shortest path search on a weighted graph',
    code: dijkstraCode,
  },
];
