# ⬡ Algo Visualizer

<div align="center">

**알고리즘 시각화 플랫폼**

정렬 · 탐색 · 자료구조 — 단계별 시각화로 알고리즘을 쉽게 이해하세요

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 📋 프로젝트 소개

**Algo Visualizer**는 웹 브라우저에서 동작하는 인터랙티브 알고리즘 시각화 도구입니다. 다양한 정렬, 탐색, 자료구조 알고리즘을 **단계별(step-by-step)**로 실행하며, 각 단계에서 수행되는 연산을 시각적으로 확인할 수 있습니다.

### ✨ 주요 특징

- 🎯 **14개 알고리즘** 시각화 지원 (정렬 6, 탐색 4, 자료구조 4)
- 📝 **실시간 코드 하이라이팅** — 알고리즘 실행 중 현재 실행 라인이 코드 패널에 표시됩니다
- 🎨 **다크 개발자 테마** — GitHub Dark 스타일의 세련된 UI
- ⏯️ **재생 제어** — 실행, 일시정지, 단계 이동, 초기화 기능
- 🖱️ **인터랙티브 그리드** — 마우스/터치로 벽을 직접 그릴 수 있습니다 (BFS, DFS, Dijkstra)
- 📱 **반응형 디자인** — 모바일/태블릿/데스크톱 모두 지원
- 🚀 **빠른 로딩** — Vite 기반 빌드로 즉각적인 개발 서버 시작

---

## 🧮 지원 알고리즘

### 📊 정렬 (Sorting) — 6개

| 알고리즘 | 난이도 | 시간 복잡도 | 공간 복잡도 | 설명 |
|---|---|---|---|---|
| **Bubble Sort** | 기본 (Basic) | O(n²) | O(1) | 인접한 원소를 비교하여 순서가 잘못된 경우 교환 |
| **Selection Sort** | 기본 (Basic) | O(n²) | O(1) | 매 패스마다 최솟값을 찾아 맨 앞에 배치 |
| **Insertion Sort** | 기본 (Basic) | O(n²) | O(1) | 각 원소를 올바른 위치에 삽입 |
| **Quick Sort** | 중급 (Intermediate) | O(n log n) | O(log n) | 피벗을 기준으로 분할 정복 |
| **Merge Sort** | 중급 (Intermediate) | O(n log n) | O(n) | 분할 후 정렬된 하위 배열을 병합 |
| **Heap Sort** | 고급 (Advanced) | O(n log n) | O(1) | 최대 힙을 구성한 후 원소를 순서대로 추출 |

### 🔍 탐색 (Searching) — 4개

| 알고리즘 | 난이도 | 시간 복잡도 | 공간 복잡도 | 설명 |
|---|---|---|---|---|
| **BFS (너비 우선 탐색)** | 기본 (Basic) | O(V + E) | O(V) | 큐를 사용한 레벨별 탐색, 최단 경로 탐색 |
| **DFS (깊이 우선 탐색)** | 기본 (Basic) | O(V + E) | O(V) | 스택을 사용한 경로 우선 탐색 |
| **Binary Search (이진 탐색)** | 기본 (Basic) | O(log n) | O(1) | 정렬된 배열에서 이분법으로 원소 탐색 |
| **Dijkstra (데이크스트라)** | 고급 (Advanced) | O(V²) | O(V) | 가중치 그래프에서 최단 경로 탐색 |

### 🏗️ 자료구조 (Data Structures) — 4개

| 자료구조 | 난이도 | 시간 복잡도 | 공간 복잡도 | 지원 연산 | 설명 |
|---|---|---|---|---|---|
| **Stack (스택)** | 기본 (Basic) | O(1) | O(n) | Push, Pop | LIFO (후입선출) 구조 |
| **Queue (큐)** | 기본 (Basic) | O(1) | O(n) | Enqueue, Dequeue | FIFO (선입선출) 구조 |
| **Binary Tree (이진 탐색 트리)** | 중급 (Intermediate) | O(log n) | O(n) | Insert | BST 삽입 연산 시각화 |
| **Linked List (연결 리스트)** | 기본 (Basic) | O(n) | O(n) | Insert, Delete | 단방향 연결 리스트의 삽입/삭제 |

---

## 🛠️ 주요 기능

### 🎬 재생 컨트롤 (Controls)
- **▶ 실행** — 알고리즘을 처음부터 자동 재생
- **⏸ 일시정지** — 실행 중인 애니메이션 일시 정지
- **→ 단계** — 한 단계씩 진행 (스텝모드)
- **⊘ 초기화** — 시각화 상태를 초기 상태로 리셋
- **⟳ 생성** — 새로운 랜덤 데이터 생성
- **속도 조절** — 0.25x ~ 5x 속도 슬라이더
- **단계 카운터** — 현재 단계 / 전체 단계 표시
- **실시간 메시지** — 각 단계에서 수행 중인 연산 설명

### 📝 코드 패널 (Code Panel)
- 알고리즘 소스 코드를 실시간으로 표시
- **실행 라인 하이라이팅** — 현재 실행 중인 코드 라인이 표시됨
- **문법 강조 (Syntax Highlighting)** — 키워드, 문자열, 숫자, 주석 등 색상 구분
- 시간/공간 복잡도 표시
- 난이도 뱃지 (Basic / Intermediate / Advanced)
- 접기/펼치기 토글

### 📊 정렬 시각화
- 막대 그래프 형태의 배열 시각화
- **색상 구분**: 비교/교환 (파란색), 피벗 (보라색), 정렬됨 (초록색), 현재 범위 (회색)
- 커스텀 배열 입력 지원 (쉼표 또는 공백 구분)
- 배열 크기 50 이하 시 수치 표시

### 🔍 탐색 시각화
- **그리드 기반 탐색** (BFS, DFS, Dijkstra)
  - HTML5 Canvas를 활용한 고성능 렌더링
  - 마우스 클릭/드래그로 벽(Wall) 직접 그리기
  - 시작/도착 노드 드래그 이동
  - 반응형 셀 크기 자동 조절
  - 터치 입력 지원
  - **색상 구분**: 시작(초록), 도착(빨강), 벽(회색), 방문(파랑), 프론티어(밝은파랑), 경로(주황)
- **이진 탐색** — low/high/mid 포인터 시각화

### 🏗️ 자료구조 시각화
- **Stack / Queue** — 박스 형태의 선형 구조 시각화 (TOP/FRONT/REAR 라벨)
- **Binary Tree (BST)** — SVG 기반 트리 레이아웃, 경로 하이라이팅
- **Linked List** — SVG 기반 노드-화살표 시각화, 순회 하이라이팅
- 값 입력 후 삽입/삭제 연산 애니메이션
- 랜덤 데이터 자동 생성 기능

### 📱 반응형 디자인
- 모바일 해시버거 메뉴
- 사이드바 슬라이드 오버레이
- 반응형 CSS 변수 자동 조절
- 터치 이벤트 지원

---

## ⚙️ 기술 스택

| 분류 | 기술 | 버전 |
|---|---|---|
| **프론트엔드 프레임워크** | React | 19.2.5 |
| **언어** | TypeScript | ~6.0.2 |
| **빌드 도구** | Vite | 8.0.9 |
| **React 플러그인** | @vitejs/plugin-react | 6.0.1 |
| **코드 품질** | ESLint | 9.39.4 |
| **타입 정의** | @types/react, @types/react-dom, @types/node | 최신 |
| **렌더링** | HTML5 Canvas (탐색 그리드), SVG (트리, 연결 리스트) | — |
| **알고리즘 구현** | JavaScript Generator (단계별 yield) | ES2023 |
| **스타일링** | Vanilla CSS (CSS Variables, Dark Theme) | — |

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.0 이상
- **npm** 또는 **yarn** / **pnpm**

### 설치 및 실행

```bash
# 1. 리포지토리 클론
git clone https://github.com/sigco3111/algo-visualizer.git
cd algo-visualizer

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:5173` 에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 린트

```bash
# ESLint 검사
npm run lint
```

---

## 📁 프로젝트 구조

```
algo-visualizer/
├── public/                          # 정적 에셋
├── src/
│   ├── main.tsx                     # 앱 진입점 (React Root)
│   ├── App.tsx                      # 메인 앱 컴포넌트 (라우팅/레이아웃)
│   ├── App.css                      # 앱 레이아웃 및 반응형 스타일
│   ├── index.css                    # 글로벌 스타일 (다크 테마, CSS 변수)
│   ├── types.ts                     # TypeScript 타입 정의
│   │
│   ├── algorithms/                  # 알고리즘 구현 (Generator 패턴)
│   │   ├── sorting.ts               #   정렬 알고리즘 6종 + 메타데이터
│   │   ├── searching.ts             #   탐색 알고리즘 4종 + 메타데이터
│   │   └── dataStructures.ts        #   자료구조 연산 4종 + 메타데이터
│   │
│   └── components/                  # React 컴포넌트
│       ├── Layout/
│       │   ├── Sidebar.tsx          #   사이드바 네비게이션
│       │   └── Sidebar.css
│       ├── Controls/
│       │   ├── Controls.tsx         #   재생 컨트롤 바
│       │   └── Controls.css
│       ├── CodePanel/
│       │   ├── CodePanel.tsx        #   코드 표시 패널 (문법 강조)
│       │   └── CodePanel.css
│       ├── Sorting/
│       │   ├── SortingVisualizer.tsx #   정렬 시각화
│       │   └── SortingVisualizer.css
│       ├── Searching/
│       │   ├── SearchingVisualizer.tsx # 탐색 시각화 (Canvas + 이진탐색)
│       │   └── SearchingVisualizer.css
│       └── DataStructures/
│           ├── DataStructuresVisualizer.tsx # 자료구조 시각화 (SVG)
│           └── DataStructuresVisualizer.css
│
├── index.html                       # HTML 엔트리 포인트
├── package.json                     # 프로젝트 설정 및 의존성
├── tsconfig.json                    # TypeScript 설정 (레퍼런스)
├── tsconfig.app.json                # TypeScript 설정 (앱)
├── tsconfig.node.json               # TypeScript 설정 (Node/Vite)
├── vite.config.ts                   # Vite 빌드 설정
└── README.md                        # 프로젝트 설명서
```

---

## 📖 사용 방법

### 1. 알고리즘 선택
왼쪽 **사이드바**에서 카테고리(정렬 / 탐색 / 자료구조)를 펼치고 원하는 알고리즘을 클릭합니다. 난이도 뱃지(Basic / Intermediate / Advanced)로 알고리즘 난이도를 확인할 수 있습니다.

### 2. 정렬 알고리즘 사용법
1. 좌측 사이드바에서 정렬 알고리즘 선택 (예: Quick Sort)
2. **⟳ 생성** 버튼으로 새로운 랜덤 배열 생성
3. 직접 숫자를 입력하려면 입력창에 `38 27 43 3 9 82 10` 형태로 입력 후 **적용** 클릭
4. **▶ 실행** 버튼으로 자동 재생, 또는 **→ 단계** 버튼으로 한 단계씩 진행
5. 속도 슬라이더로 재생 속도 조절 (0.25x ~ 5x)
6. 하단 코드 패널에서 현재 실행 라인 확인

### 3. 탐색 알고리즘 사용법
**그리드 탐색 (BFS, DFS, Dijkstra):**
1. 좌측 사이드바에서 탐색 알고리즘 선택
2. **⟳ 생성** 버튼으로 랜덤 미로 생성
3. 캔버스에서 **클릭/드래그**로 벽을 직접 그리거나 지우기
4. 초록색(시작) / 빨간색(도착) 노드를 드래그하여 위치 변경
5. **▶ 실행**으로 탐색 경로 시각화

**이진 탐색 (Binary Search):**
1. Binary Search 선택
2. **target** 값을 변경하여 다른 값 탐색
3. **▶ 실행**으로 low → mid → high 포인터 이동 확인

### 4. 자료구조 사용법
1. 좌측 사이드바에서 자료구조 선택 (Stack, Queue, Binary Tree, Linked List)
2. 값 입력 후 **삽입(Push/Enqueue)** 또는 **삭제(Pop/Dequeue)** 클릭
3. **⟳ 생성** 버튼으로 랜덤 데이터 자동 채우기
4. 연산 시 경로 하이라이팅 애니메이션 확인

### 5. 공통 기능
| 기능 | 설명 |
|---|---|
| **속도 조절** | 슬라이더로 0.25x ~ 5x 속도 조절 |
| **단계 진행** | → 단계 버튼으로 한 단계씩 상세 확인 |
| **코드 하이라이팅** | 하단 코드 패널에서 현재 실행 라인 표시 |
| **복잡도 확인** | 코드 패널 상단에서 시간/공간 복잡도 표시 |
| **모바일 지원** | 해시버거 메뉴(☰)로 사이드바 열기 |

---

## 📸 스크린샷

<!-- 
  스크린샷을 추가하려면 아래 주석을 해제하고 이미지 경로를 설정하세요.
  예: ![정렬 시각화](./screenshots/sorting.png)
-->

### 정렬 시각화 (Quick Sort)
![정렬 시각화](https://via.placeholder.com/800x450?text=Sorting+Visualization+-+Quick+Sort)

### 그리드 탐색 (BFS)
![BFS 탐색](https://via.placeholder.com/800x450?text=BFS+Pathfinding+Visualization)

### 자료구조 (Binary Search Tree)
![BST 시각화](https://via.placeholder.com/800x450?text=Binary+Search+Tree+Visualization)

### 코드 패널
![코드 패널](https://via.placeholder.com/800x450?text=Code+Panel+with+Syntax+Highlighting)

---

## 🏗️ 아키텍처

### Generator 패턴
모든 알고리즘은 **JavaScript Generator** (`function*`)를 사용하여 구현됩니다. 각 알고리즘은 실행 중 각 단계를 `yield`로 반환하며, 시각화 컴포넌트는 이 단계들을 순차적으로 소비하여 애니메이션을 생성합니다.

```
알고리즘 Generator → 단계(Step) 배열 → 시각화 컴포넌트 → 화면 렌더링
```

### 상태 관리
각 시각화 컴포넌트는 React의 `useState`와 `useCallback`을 사용하여 독립적인 상태를 관리합니다. 재생 상태는 `idle → playing → paused/done` 라이프사이클을 따릅니다.

---

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다.

```
MIT License

Copyright (c) 2026 Algo Visualizer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**⬡ Algo Visualizer** — 알고리즘을 보고, 이해하고, 배우세요.

</div>
