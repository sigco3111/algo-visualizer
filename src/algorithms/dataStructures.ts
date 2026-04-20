import type { AlgorithmInfo, TreeNode, LLNode } from '../types';

// ============================================================
// Helper for building messages without template literals
// ============================================================
function msg(parts: string[]): string {
  return parts.join('');
}

// ============================================================
// Data Structure Algorithm Code
// ============================================================

const stackCode: string[] = [
  'class Stack {',
  '  constructor() { this.items = []; }',
  '',
  '  push(item) {',
  '    this.items.push(item);',
  '  }',
  '',
  '  pop() {',
  '    if (this.isEmpty()) return null;',
  '    return this.items.pop();',
  '  }',
  '',
  '  peek() {',
  '    return this.items[this.items.length - 1];',
  '  }',
  '',
  '  isEmpty() {',
  '    return this.items.length === 0;',
  '  }',
  '}',
];

const queueCode: string[] = [
  'class Queue {',
  '  constructor() { this.items = []; }',
  '',
  '  enqueue(item) {',
  '    this.items.push(item);',
  '  }',
  '',
  '  dequeue() {',
  '    if (this.isEmpty()) return null;',
  '    return this.items.shift();',
  '  }',
  '',
  '  front() {',
  '    return this.items[0];',
  '  }',
  '',
  '  isEmpty() {',
  '    return this.items.length === 0;',
  '  }',
  '}',
];

const binaryTreeCode: string[] = [
  'class BSTNode {',
  '  constructor(value) {',
  '    this.value = value;',
  '    this.left = null;',
  '    this.right = null;',
  '  }',
  '}',
  '',
  'class BST {',
  '  constructor() { this.root = null; }',
  '',
  '  insert(value) {',
  '    const node = new BSTNode(value);',
  '    if (!this.root) {',
  '      this.root = node;',
  '      return;',
  '    }',
  '    let curr = this.root;',
  '    while (true) {',
  '      if (value < curr.value) {',
  '        if (!curr.left) { curr.left = node; return; }',
  '        curr = curr.left;',
  '      } else {',
  '        if (!curr.right) { curr.right = node; return; }',
  '        curr = curr.right;',
  '      }',
  '    }',
  '  }',
  '}',
];

const linkedListCode: string[] = [
  'class ListNode {',
  '  constructor(value) {',
  '    this.value = value;',
  '    this.next = null;',
  '  }',
  '}',
  '',
  'class LinkedList {',
  '  constructor() { this.head = null; }',
  '',
  '  insert(value) {',
  '    const node = new ListNode(value);',
  '    if (!this.head) {',
  '      this.head = node;',
  '      return;',
  '    }',
  '    let curr = this.head;',
  '    while (curr.next) curr = curr.next;',
  '    curr.next = node;',
  '  }',
  '',
  '  delete(value) {',
  '    if (!this.head) return;',
  '    if (this.head.value === value) {',
  '      this.head = this.head.next;',
  '      return;',
  '    }',
  '    let curr = this.head;',
  '    while (curr.next && curr.next.value !== value)',
  '      curr = curr.next;',
  '    if (curr.next) curr.next = curr.next.next;',
  '  }',
  '}',
];

// ============================================================
// Step types for generators
// ============================================================

interface StackQueueStep {
  type: string;
  indices: number[];
  values: number[];
  message: string;
  line: number;
}

interface TreeStep {
  type: string;
  values: number[];
  message: string;
  line: number;
  tree: TreeNode | null;
}

interface LLStep {
  type: string;
  values: number[];
  message: string;
  line: number;
  list: LLNode | null;
}

// ============================================================
// Stack Generators
// ============================================================

export function* stackPushGen(items: number[], value: number): Generator<StackQueueStep> {
  const newItems = [...items, value];
  const targetIdx = newItems.length - 1;
  // Step 1: prepare — show the item appearing
  yield {
    type: 'prepare',
    indices: [targetIdx],
    values: newItems,
    message: msg(['preparing push(', String(value), ') at position ', String(targetIdx)]),
    line: 4,
  };
  // Step 2: push — confirm the push
  yield {
    type: 'push',
    indices: [targetIdx],
    values: newItems,
    message: msg(['push(', String(value), ')']),
    line: 5,
  };
  // Step 3: done — keep highlight briefly
  yield {
    type: 'done',
    indices: [targetIdx],
    values: newItems,
    message: msg(['pushed: ', String(value), ' | stack size: ', String(newItems.length)]),
    line: 5,
  };
}

export function* stackPopGen(items: number[]): Generator<StackQueueStep> {
  if (items.length === 0) {
    yield {
      type: 'done',
      indices: [],
      values: [],
      message: 'stack is empty',
      line: 9,
    };
    return;
  }
  const popped = items[items.length - 1];
  const topIdx = items.length - 1;
  const newItems = items.slice(0, -1);
  // Step 1: highlight top element
  yield {
    type: 'prepare',
    indices: [topIdx],
    values: items,
    message: msg(['peek top: ', String(popped)]),
    line: 8,
  };
  // Step 2: pop
  yield {
    type: 'pop',
    indices: [topIdx],
    values: items,
    message: msg(['pop() -> ', String(popped)]),
    line: 9,
  };
  // Step 3: done — keep highlight briefly
  yield {
    type: 'done',
    indices: topIdx < newItems.length ? [topIdx] : (newItems.length > 0 ? [newItems.length - 1] : []),
    values: newItems,
    message: msg(['popped: ', String(popped), ' | stack size: ', String(newItems.length)]),
    line: 10,
  };
}

// ============================================================
// Queue Generators
// ============================================================

export function* queueEnqueueGen(items: number[], value: number): Generator<StackQueueStep> {
  const newItems = [...items, value];
  const targetIdx = newItems.length - 1;
  // Step 1: prepare
  yield {
    type: 'prepare',
    indices: [targetIdx],
    values: newItems,
    message: msg(['preparing enqueue(', String(value), ') at rear']),
    line: 4,
  };
  // Step 2: enqueue
  yield {
    type: 'enqueue',
    indices: [targetIdx],
    values: newItems,
    message: msg(['enqueue(', String(value), ')']),
    line: 5,
  };
  // Step 3: done — keep highlight
  yield {
    type: 'done',
    indices: [targetIdx],
    values: newItems,
    message: msg(['enqueued: ', String(value), ' | queue size: ', String(newItems.length)]),
    line: 5,
  };
}

export function* queueDequeueGen(items: number[]): Generator<StackQueueStep> {
  if (items.length === 0) {
    yield {
      type: 'done',
      indices: [],
      values: [],
      message: 'queue is empty',
      line: 9,
    };
    return;
  }
  const dequeued = items[0];
  const newItems = items.slice(1);
  // Step 1: highlight front
  yield {
    type: 'prepare',
    indices: [0],
    values: items,
    message: msg(['peek front: ', String(dequeued)]),
    line: 8,
  };
  // Step 2: dequeue
  yield {
    type: 'dequeue',
    indices: [0],
    values: items,
    message: msg(['dequeue() -> ', String(dequeued)]),
    line: 9,
  };
  // Step 3: done — keep highlight on new front
  yield {
    type: 'done',
    indices: newItems.length > 0 ? [0] : [],
    values: newItems,
    message: msg(['dequeued: ', String(dequeued), ' | queue size: ', String(newItems.length)]),
    line: 10,
  };
}

// ============================================================
// BST Insert Generator
// ============================================================

function insertNode(node: TreeNode | null, val: number): TreeNode {
  if (!node) return { value: val, left: null, right: null };
  if (val < node.value) node.left = insertNode(node.left, val);
  else node.right = insertNode(node.right, val);
  return node;
}

export function* bstInsertGen(root: TreeNode | null, value: number): Generator<TreeStep> {
  yield {
    type: 'insert',
    values: [value],
    message: msg(['insert(', String(value), ')']),
    line: 13,
    tree: root,
  };

  // Simulate traversal for visualization
  let curr = root;
  const path: number[] = [];
  if (curr) {
    path.push(curr.value);
    while (true) {
      if (value < curr.value) {
        if (curr.left) {
          curr = curr.left;
          path.push(curr.value);
          yield {
            type: 'highlight',
            values: [...path],
            message: msg([String(value), ' < ', String(curr.value), ' -> left']),
            line: 19,
            tree: root,
          };
        } else break;
      } else {
        if (curr.right) {
          curr = curr.right;
          path.push(curr.value);
          yield {
            type: 'highlight',
            values: [...path],
            message: msg([String(value), ' >= ', String(curr.value), ' -> right']),
            line: 21,
            tree: root,
          };
        } else break;
      }
    }
  }

  const newRoot = insertNode(root, value);
  // Insert step: highlight the new node along with the path
  yield {
    type: 'insert',
    values: [value, ...path],
    message: msg(['inserted: ', String(value)]),
    line: 16,
    tree: newRoot,
  };
  // Done step: keep highlight briefly
  yield {
    type: 'done',
    values: [value, ...path],
    message: 'insert complete',
    line: 16,
    tree: newRoot,
  };
}

// ============================================================
// Linked List Generators
// ============================================================

function deepCloneLL(n: LLNode | null): LLNode | null {
  if (!n) return null;
  return { value: n.value, next: deepCloneLL(n.next) };
}

export function* llInsertGen(head: LLNode | null, value: number): Generator<LLStep> {
  yield {
    type: 'insert',
    values: [value],
    message: msg(['insert(', String(value), ')']),
    line: 14,
    list: head,
  };

  const newNode: LLNode = { value, next: null };
  let newHead: LLNode | null;
  const path: number[] = [];

  if (!head) {
    newHead = newNode;
  } else {
    newHead = deepCloneLL(head);
    let curr: LLNode | null = newHead;
    if (curr) {
      path.push(curr.value);
      while (curr.next) {
        curr = curr.next;
        path.push(curr.value);
        yield {
          type: 'highlight',
          values: [...path],
          message: msg(['traverse: ', String(curr.value)]),
          line: 17,
          list: newHead,
        };
      }
      curr.next = newNode;
    }
  }

  yield {
    type: 'insert',
    values: [value, ...path],
    message: msg(['inserted: ', String(value)]),
    line: 18,
    list: newHead,
  };
  yield {
    type: 'done',
    values: [value, ...path],
    message: 'insert complete',
    line: 18,
    list: newHead,
  };
}

export function* llDeleteGen(head: LLNode | null, value: number): Generator<LLStep> {
  if (!head) {
    yield {
      type: 'done',
      values: [],
      message: 'list is empty',
      line: 21,
      list: null,
    };
    return;
  }

  let newHead = deepCloneLL(head);
  let found = false;

  if (newHead) {
    yield {
      type: 'highlight',
      values: [newHead.value],
      message: msg(['search: ', String(newHead.value)]),
      line: 22,
      list: newHead,
    };

    if (newHead.value === value) {
      newHead = newHead.next;
      found = true;
      yield {
        type: 'delete',
        values: [value],
        message: msg(['delete: ', String(value), ' (head)']),
        line: 23,
        list: newHead,
      };
    } else {
      let curr: LLNode | null = newHead;
      while (curr && curr.next) {
        yield {
          type: 'highlight',
          values: [curr.next.value],
          message: msg(['traverse: ', String(curr.next.value)]),
          line: 24,
          list: newHead,
        };
        if (curr.next.value === value) {
          curr.next = curr.next.next;
          found = true;
          yield {
            type: 'delete',
            values: [value],
            message: msg(['deleted: ', String(value)]),
            line: 25,
            list: newHead,
          };
          break;
        }
        curr = curr.next;
      }
    }
  }

  if (!found) {
    yield {
      type: 'done',
      values: [value],
      message: msg([String(value), ' not found']),
      line: 25,
      list: newHead,
    };
  } else {
    yield {
      type: 'done',
      values: [value],
      message: 'delete complete',
      line: 25,
      list: newHead,
    };
  }
}

// ============================================================
// Algorithm Info Exports
// ============================================================

export const dsAlgorithms: AlgorithmInfo[] = [
  {
    id: 'stack',
    name: 'Stack',
    category: 'datastructures',
    difficulty: 'basic',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'LIFO structure - push, pop',
    code: stackCode,
  },
  {
    id: 'queue',
    name: 'Queue',
    category: 'datastructures',
    difficulty: 'basic',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    description: 'FIFO structure - enqueue, dequeue',
    code: queueCode,
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    category: 'datastructures',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    description: 'Binary Search Tree - insert',
    code: binaryTreeCode,
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'datastructures',
    difficulty: 'basic',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    description: 'Singly Linked List - insert, delete',
    code: linkedListCode,
  },
];
