// @ts-nocheck
'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ─── Color Palette (matches original blog style) ─── */
const C = {
  card: "#161b22",
  cardBorder: "#30363d",
  stairColors: ["#58a6ff", "#f97583", "#56d364", "#d2a8ff", "#f0883e", "#79c0ff"],
  text: "#e6edf3",
  textDim: "#8b949e",
  textMuted: "#484f58",
  accent: "#58a6ff",
  accentGreen: "#56d364",
  accentRed: "#f97583",
  accentPurple: "#d2a8ff",
  accentOrange: "#f0883e",
  accentYellow: "#e3b341",
  border: "#30363d",
  codeBg: "#0d1117",
  btnBg: "#21262d",
  btnHover: "#30363d",
  success: "#238636",
  warning: "#9e6a03",
};

/* ─── Shared Components ─── */
const Badge = ({ children, color = C.accent }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 12,
    background: color + "22", color, fontSize: 12, fontWeight: 600,
    border: `1px solid ${color}44`, marginRight: 6,
  }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, borderRadius: 12, border: `1px solid ${C.cardBorder}`,
    padding: "24px", marginBottom: 20, ...style,
  }}>{children}</div>
);

const Btn = ({ children, onClick, active, disabled, small, color = C.accent }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: small ? "4px 12px" : "8px 20px",
      borderRadius: 8,
      border: active ? `2px solid ${color}` : `1px solid ${C.cardBorder}`,
      background: active ? color + "22" : C.btnBg,
      color: disabled ? C.textMuted : active ? color : C.text,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: small ? 12 : 14,
      fontWeight: active ? 600 : 400,
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.15s",
    }}
  >{children}</button>
);

/* ═══════════════════════════════════════════════════
   UTILITY: Magic Square Generators
   ═══════════════════════════════════════════════════ */

/** Odd magic square — Siamese (de la Loubère) method */
const generateOddMagicSquare = (n) => {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  const steps = [];
  let x = 0, y = Math.floor(n / 2);

  for (let i = 1; i <= n * n; i++) {
    grid[x][y] = i;
    steps.push({
      grid: grid.map(r => [...r]),
      placed: i,
      row: x,
      col: y,
      desc: i === 1
        ? `${i}을 (${x}, ${y})에 배치 — 첫 행 가운데에서 시작`
        : grid[(x + 1) % n][(y - 1 + n) % n] !== 0 && i > 1
          ? `${i}을 (${x}, ${y})에 배치 — 충돌 발생, 아래로 이동`
          : `${i}을 (${x}, ${y})에 배치 — ↗ 대각선 이동`,
    });

    const nx = (x - 1 + n) % n;
    const ny = (y + 1) % n;
    if (grid[nx][ny] !== 0) {
      x = (x + 1) % n;
    } else {
      x = nx;
      y = ny;
    }
  }
  return { grid, steps };
};

/**
 * 4N magic square — 십자 교환법 (Cross-Swap)
 *
 * 정답 코드 로직:
 *   for i in range(N // 4):
 *       for j in range(N // 4, 3 * N // 4):
 *           swap(ans[i][j], ans[N-1-i][N-1-j])
 *           swap(ans[j][i], ans[N-1-j][N-1-i])
 *
 * 결과 패턴: 4개 코너 블록(N/4×N/4)과 중앙 블록(N/2×N/2)은 유지,
 *           나머지 십자(+) 영역만 점대칭 교환.
 */
const generate4NMagicSquare = (N) => {
  const grid = Array.from({ length: N }, (_, i) =>
    Array.from({ length: N }, (_, j) => i * N + j + 1)
  );
  const steps = [];
  const swapMask = Array.from({ length: N }, () => Array(N).fill(false));

  steps.push({
    grid: grid.map(r => [...r]),
    swapMask: swapMask.map(r => [...r]),
    desc: "초기 상태: 1부터 N²까지 순서대로 채움",
    phase: "init",
  });

  // Mark which cells will be swapped
  const Q = Math.floor(N / 4);
  for (let i = 0; i < Q; i++) {
    for (let j = Q; j < 3 * Q; j++) {
      swapMask[i][j] = true;
      swapMask[N - 1 - i][N - 1 - j] = true;
      swapMask[j][i] = true;
      swapMask[N - 1 - j][N - 1 - i] = true;
    }
  }

  steps.push({
    grid: grid.map(r => [...r]),
    swapMask: swapMask.map(r => [...r]),
    desc: "교환 대상 표시: 십자(cross) 영역이 점대칭 위치와 교환됨",
    phase: "mark",
  });

  // Perform swaps — exactly as original Python code
  for (let i = 0; i < Q; i++) {
    for (let j = Q; j < 3 * Q; j++) {
      let tmp = grid[i][j];
      grid[i][j] = grid[N - 1 - i][N - 1 - j];
      grid[N - 1 - i][N - 1 - j] = tmp;

      tmp = grid[j][i];
      grid[j][i] = grid[N - 1 - j][N - 1 - i];
      grid[N - 1 - j][N - 1 - i] = tmp;
    }
  }

  steps.push({
    grid: grid.map(r => [...r]),
    swapMask: swapMask.map(r => [...r]),
    desc: "교환 완료 → 마방진 완성! 코너·중앙은 유지, 십자 영역만 교환됨",
    phase: "swap",
  });

  return { grid, steps, swapMask };
};

/**
 * 4N+2 magic square — Strachey 방법
 *
 * 정답 코드 로직:
 *   상반부 k=[3,0,2,1], 하반부 k=[0,3,1,2]
 *   일반 행: 좌측 [0,Q) → k[0], [Q,H) → k[1]
 *   특수 행 (i%H == Q): 0열 → k[1], [1,1+Q) → k[0], [1+Q,H) → k[1]
 *   우측: [H, N-Q+1) → k[2], [N-Q+1, N) → k[3]
 *   최종: ans = offMult * n² + odd[i%n][j%n]
 */
const generate4N2MagicSquare = (N) => {
  const n = Math.floor(N / 2); // n is odd
  const odd = generateOddMagicSquare(n).grid;
  const steps = [];
  const q = Math.floor(N * N / 4); // = n*n
  const Q = Math.floor(N / 4);     // N//4
  const H = Math.floor(N / 2);     // N//2

  steps.push({
    grid: odd.map(r => [...r]),
    size: n,
    desc: `${n}×${n} 홀수 마방진을 먼저 구성 (1~${n * n})`,
    phase: "odd",
  });

  // Build offset multiplier array — exactly matching original Python code
  const offMult = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    const k = i < H ? [3, 0, 2, 1] : [0, 3, 1, 2];

    // Left half (cols 0..H-1)
    if (i % H !== Q) {
      // Normal row
      for (let j = 0; j < Q; j++) offMult[i][j] = k[0];
      for (let j = Q; j < H; j++) offMult[i][j] = k[1];
    } else {
      // Special row: first col gets k[1], then Q cols of k[0], rest k[1]
      offMult[i][0] = k[1];
      for (let j = 1; j < 1 + Q; j++) offMult[i][j] = k[0];
      for (let j = 1 + Q; j < H; j++) offMult[i][j] = k[1];
    }

    // Right half (cols H..N-1)
    for (let j = H; j < N - Q + 1; j++) offMult[i][j] = k[2];
    for (let j = N - Q + 1; j < N; j++) offMult[i][j] = k[3];
  }

  steps.push({
    grid: offMult.map(r => [...r]),
    desc: `오프셋 승수 배열: 각 셀의 값 × n²(=${q})을 더함`,
    phase: "offset",
    q,
  });

  // Build final grid
  const ans = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < H; j++) {
      const ov = odd[i][j];
      ans[i][j] = offMult[i][j] * q + ov;
      ans[i + H][j] = offMult[i + H][j] * q + ov;
      ans[i][j + H] = offMult[i][j + H] * q + ov;
      ans[i + H][j + H] = offMult[i + H][j + H] * q + ov;
    }
  }

  steps.push({
    grid: ans.map(r => [...r]),
    offMult,
    desc: `최종 마방진: odd[i%n][j%n] + 승수×n² → ${N}×${N} 마방진 완성!`,
    phase: "final",
  });

  return { grid: ans, steps, offMult };
};

/* ═══════════════════════════════════════════════════
   UTILITY: Validation
   ═══════════════════════════════════════════════════ */
const validateMagicSquare = (grid) => {
  const n = grid.length;
  const target = n * (n * n + 1) / 2;
  let valid = true, diag1 = 0, diag2 = 0;
  for (let i = 0; i < n; i++) {
    let rs = 0, cs = 0;
    for (let j = 0; j < n; j++) { rs += grid[i][j]; cs += grid[j][i]; }
    if (rs !== target || cs !== target) valid = false;
    diag1 += grid[i][i];
    diag2 += grid[i][n - 1 - i];
  }
  if (diag1 !== target || diag2 !== target) valid = false;
  return { target, valid };
};

/* ═══════════════════════════════════════════════════
   COMPONENT: Magic Square Grid Renderer
   ═══════════════════════════════════════════════════ */
const MagicGrid = ({
  grid, highlight = null, cellColorFn = null,
  maxCellSize = 48, showSums = false, label = null,
}) => {
  const n = grid.length;
  const cellSize = Math.min(maxCellSize, Math.floor(600 / n));
  const fontSize = n <= 5 ? 15 : n <= 8 ? 12 : n <= 12 ? 10 : 8;
  const validation = showSums ? validateMagicSquare(grid) : null;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
        gap: 1,
        background: C.cardBorder,
        borderRadius: 8,
        padding: 1,
        border: `1px solid ${C.cardBorder}`,
      }}>
        {grid.flatMap((row, i) =>
          row.map((val, j) => {
            const isHL = highlight && highlight.row === i && highlight.col === j;
            const bg = cellColorFn ? cellColorFn(i, j, val) : (val === 0 ? C.codeBg : C.card);
            return (
              <div key={`${i}-${j}`} style={{
                width: cellSize, height: cellSize,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isHL ? C.accentGreen + "44" : bg,
                color: val === 0 ? C.textMuted : C.text,
                fontSize, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontWeight: isHL ? 700 : 500,
                transition: "all 0.15s",
                borderRadius:
                  i === 0 && j === 0 ? "7px 0 0 0" :
                  i === 0 && j === n - 1 ? "0 7px 0 0" :
                  i === n - 1 && j === 0 ? "0 0 0 7px" :
                  i === n - 1 && j === n - 1 ? "0 0 7px 0" : "0",
                boxShadow: isHL ? `inset 0 0 0 2px ${C.accentGreen}` : "none",
              }}>
                {val === 0 ? "" : val}
              </div>
            );
          })
        )}
      </div>

      {showSums && validation && (
        <div style={{
          marginTop: 12, padding: "10px 16px", borderRadius: 8,
          background: validation.valid ? C.success + "15" : C.accentRed + "15",
          border: `1px solid ${validation.valid ? C.success + "44" : C.accentRed + "44"}`,
          display: "inline-block",
        }}>
          <span style={{
            color: validation.valid ? C.accentGreen : C.accentRed,
            fontSize: 13, fontWeight: 600,
          }}>
            {validation.valid ? "✅ " : "❌ "}
            매직 상수 = {validation.target}
            {validation.valid ? " — 모든 합이 일치합니다!" : " — 검증 실패"}
          </span>
        </div>
      )}

      {label && (
        <p style={{ color: C.textDim, fontSize: 12, margin: "8px 0 0 0" }}>{label}</p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 1: Odd Magic Square — Siamese Method
   ═══════════════════════════════════════════════════ */
const OddMagicSquare = () => {
  const [n, setN] = useState(5);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef(null);

  const { steps } = useMemo(() => generateOddMagicSquare(n), [n]);
  const totalSteps = steps.length;

  useEffect(() => { setStep(0); setAutoPlay(false); }, [n]);

  useEffect(() => {
    if (autoPlay && step < totalSteps - 1) {
      intervalRef.current = setTimeout(() => setStep(s => s + 1), speed);
    } else if (step >= totalSteps - 1) {
      setAutoPlay(false);
    }
    return () => clearTimeout(intervalRef.current);
  }, [autoPlay, step, totalSteps, speed]);

  const cur = steps[step];

  const cellColorFn = (i, j, val) => {
    if (val === 0) return C.codeBg;
    if (cur.row === i && cur.col === j) return C.accentGreen + "44";
    const ratio = val / (n * n);
    if (ratio < 0.33) return C.accent + "18";
    if (ratio < 0.66) return C.accentPurple + "18";
    return C.accentOrange + "18";
  };

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>
        인터랙티브 시뮬레이터
      </h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        숫자를 하나씩 배치하는 과정을 관찰해 보세요. ↗ 방향으로 이동하다가 충돌하면 ↓로 내려갑니다.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: C.textDim, fontSize: 13 }}>크기:</span>
        {[3, 5, 7, 9].map(s => (
          <Btn key={s} small active={n === s} onClick={() => setN(s)}>{s}×{s}</Btn>
        ))}
        <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 8 }}>
          Step {step + 1} / {totalSteps}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <MagicGrid
          grid={cur.grid}
          highlight={{ row: cur.row, col: cur.col }}
          cellColorFn={cellColorFn}
          showSums={step === totalSteps - 1}
        />
      </div>

      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "12px 16px",
        border: `1px solid ${C.cardBorder}`, marginBottom: 16,
        fontFamily: "monospace", fontSize: 13, color: C.textDim,
      }}>
        <span style={{ color: C.accent }}>Step {step + 1}</span>
        {" — "}
        <span style={{ color: C.text }}>{cur.desc}</span>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        <Btn onClick={() => setStep(0)} disabled={step === 0} small>⏮</Btn>
        <Btn onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} small>◀</Btn>
        <Btn onClick={() => setAutoPlay(!autoPlay)} small color={autoPlay ? C.accentRed : C.accentGreen}>
          {autoPlay ? "⏸ 정지" : "▶ 재생"}
        </Btn>
        <Btn onClick={() => setStep(Math.min(totalSteps - 1, step + 1))} disabled={step >= totalSteps - 1} small>▶</Btn>
        <Btn onClick={() => setStep(totalSteps - 1)} disabled={step >= totalSteps - 1} small>⏭</Btn>
        <span style={{ color: C.textMuted, fontSize: 11, marginLeft: 8 }}>속도:</span>
        {[400, 200, 80].map((s, i) => (
          <Btn key={s} small active={speed === s} onClick={() => setSpeed(s)}>
            {["느림", "보통", "빠름"][i]}
          </Btn>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 2: 4N Magic Square — Cross-Swap Visualizer
   ═══════════════════════════════════════════════════ */
const FourNMagicSquare = () => {
  const [n, setN] = useState(4);
  const [step, setStep] = useState(0);

  const { steps } = useMemo(() => generate4NMagicSquare(n), [n]);

  useEffect(() => { setStep(0); }, [n]);

  const cur = steps[step];
  const Q = Math.floor(n / 4);

  const cellColorFn4N = (i, j, val) => {
    if (cur.phase === "init") return C.card;
    const isSwapped = cur.swapMask[i][j];
    if (!isSwapped) {
      // Kept cells: corner blocks vs center block
      const isCorner = (i < Q || i >= n - Q) && (j < Q || j >= n - Q);
      return isCorner ? C.accentGreen + "18" : C.accent + "18";
    }
    // Swapped cells: top/bottom strip vs left/right strip
    const isTopBottom = i < Q || i >= n - Q;
    return isTopBottom ? C.accentRed + "28" : C.accentOrange + "28";
  };

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>
        인터랙티브 시뮬레이터
      </h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        순서대로 채운 뒤, 코너·중앙은 유지하고 십자(cross) 영역만 점대칭 교환합니다.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: C.textDim, fontSize: 13 }}>크기:</span>
        {[4, 8, 12].map(s => (
          <Btn key={s} small active={n === s} onClick={() => setN(s)}>{s}×{s}</Btn>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <MagicGrid
          grid={cur.grid}
          cellColorFn={cur.phase !== "init" ? cellColorFn4N : undefined}
          showSums={step === steps.length - 1}
          maxCellSize={n <= 4 ? 56 : n <= 8 ? 42 : 34}
        />
      </div>

      {/* Legend */}
      {cur.phase !== "init" && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { color: C.accentGreen, label: "코너 블록 (유지)" },
            { color: C.accent, label: "중앙 블록 (유지)" },
            { color: C.accentRed, label: "상·하 교환 영역" },
            { color: C.accentOrange, label: "좌·우 교환 영역" },
          ].map(({ color, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 6,
              background: color + "15", border: `1px solid ${color}33`,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.7 }} />
              <span style={{ color, fontSize: 11, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "12px 16px",
        border: `1px solid ${C.cardBorder}`, marginBottom: 16,
        fontFamily: "monospace", fontSize: 13, color: C.textDim,
      }}>
        <span style={{ color: C.accent }}>Phase {step + 1}/{steps.length}</span>
        {" — "}
        <span style={{ color: C.text }}>{cur.desc}</span>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {steps.map((s, i) => (
          <Btn key={i} small active={i === step} onClick={() => setStep(i)}>
            {s.phase === "init" ? "① 순서 채움" : s.phase === "mark" ? "② 영역 표시" : "③ 교환 완료"}
          </Btn>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 3: 4N+2 Magic Square — Strachey Visualizer
   ═══════════════════════════════════════════════════ */
const FourN2MagicSquare = () => {
  const [N, setN] = useState(6);
  const [step, setStep] = useState(0);

  const { steps, offMult } = useMemo(() => generate4N2MagicSquare(N), [N]);

  useEffect(() => { setStep(0); }, [N]);

  const cur = steps[step];
  const quadColors = [C.accent, C.accentGreen, C.accentPurple, C.accentOrange];

  const cellColorOdd = (i, j, val) => {
    if (val === 0) return C.codeBg;
    const nn = cur.size || Math.floor(N / 2);
    const ratio = val / (nn * nn);
    if (ratio < 0.33) return C.accent + "18";
    if (ratio < 0.66) return C.accentPurple + "18";
    return C.accentOrange + "18";
  };

  const cellColorOffset = (i, j, val) => quadColors[val] + "33";

  const cellColorFinal = (i, j, _val) => {
    if (!offMult) return C.card;
    return quadColors[offMult[i][j]] + "18";
  };

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>
        인터랙티브 시뮬레이터
      </h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        홀수 마방진을 4개 사분면에 복사한 뒤, 오프셋 패턴에 따라 값을 더합니다.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: C.textDim, fontSize: 13 }}>크기:</span>
        {[6, 10, 14].map(s => (
          <Btn key={s} small active={N === s} onClick={() => setN(s)}>{s}×{s}</Btn>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        {cur.phase === "odd" ? (
          <MagicGrid
            grid={cur.grid}
            cellColorFn={cellColorOdd}
            maxCellSize={N <= 6 ? 52 : N <= 10 ? 36 : 28}
            label={`${Math.floor(N / 2)}×${Math.floor(N / 2)} 홀수 마방진`}
          />
        ) : cur.phase === "offset" ? (
          <MagicGrid
            grid={cur.grid}
            cellColorFn={cellColorOffset}
            maxCellSize={N <= 6 ? 52 : N <= 10 ? 36 : 28}
            label="오프셋 승수 배열 (×n²)"
          />
        ) : (
          <MagicGrid
            grid={cur.grid}
            cellColorFn={cellColorFinal}
            showSums={true}
            maxCellSize={N <= 6 ? 52 : N <= 10 ? 36 : 28}
          />
        )}
      </div>

      {/* Legend */}
      {(cur.phase === "offset" || cur.phase === "final") && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
          {[0, 1, 2, 3].map(k => (
            <div key={k} style={{
              padding: "4px 12px", borderRadius: 6,
              background: quadColors[k] + "22",
              border: `1px solid ${quadColors[k]}44`,
            }}>
              <span style={{ color: quadColors[k], fontSize: 12, fontWeight: 600 }}>
                ×{k} {cur.phase === "offset" && `(+${k * Math.floor(N * N / 4)})`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "12px 16px",
        border: `1px solid ${C.cardBorder}`, marginBottom: 16,
        fontFamily: "monospace", fontSize: 13, color: C.textDim,
      }}>
        <span style={{ color: C.accent }}>Phase {step + 1}/{steps.length}</span>
        {" — "}
        <span style={{ color: C.text }}>{cur.desc}</span>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <Btn key={i} small active={i === step} onClick={() => setStep(i)}>
            {s.phase === "odd" ? "① 홀수 마방진" : s.phase === "offset" ? "② 오프셋 배열" : "③ 최종 합산"}
          </Btn>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 4: Algorithm Explanation Cards
   ═══════════════════════════════════════════════════ */
const OddAlgorithmExplainer = () => (
  <Card>
    <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
      알고리즘: Siamese (de la Loubère) 방법
    </h3>
    <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
      17세기 프랑스 외교관 Simon de la Loubère가 태국에서 배워온 방법입니다.
      홀수 크기 마방진을 구성하는 가장 고전적이고 직관적인 방법으로,
      단순한 규칙 두 가지만으로 완전한 마방진을 만들어냅니다.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ padding: "16px", borderRadius: 10, background: C.accentGreen + "08", border: `1px solid ${C.accentGreen}33` }}>
        <h4 style={{ color: C.accentGreen, fontSize: 14, margin: "0 0 8px 0" }}>규칙 1: 기본 이동 ↗</h4>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          현재 위치에서 <strong style={{ color: C.text }}>한 칸 위, 한 칸 오른쪽</strong>으로 이동합니다.
          격자 바깥으로 나가면 반대편으로 되돌아옵니다 (토러스 구조).
        </p>
      </div>
      <div style={{ padding: "16px", borderRadius: 10, background: C.accentOrange + "08", border: `1px solid ${C.accentOrange}33` }}>
        <h4 style={{ color: C.accentOrange, fontSize: 14, margin: "0 0 8px 0" }}>규칙 2: 충돌 시 ↓</h4>
        <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          이동하려는 칸에 이미 숫자가 있으면, 대신 원래 위치에서
          <strong style={{ color: C.text }}> 한 칸 아래</strong>로 이동합니다.
        </p>
      </div>
    </div>

    <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.cardBorder}` }}>
      <pre style={{
        color: C.text, fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
        margin: 0, overflow: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap",
      }}>{`# 시작: 첫 행의 가운데 열에 1 배치
x, y = 0, n // 2

for i in 1 to n*n:
    grid[x][y] = i
    nx, ny = (x-1) % n, (y+1) % n  # ↗ 이동
    if grid[nx][ny] != 0:           # 충돌!
        x = (x+1) % n              # ↓ 아래로
    else:
        x, y = nx, ny`}</pre>
    </div>
  </Card>
);

const FourNAlgorithmExplainer = () => {
  // Build 8×8 swap pattern for visual
  const n = 8, Q = 2;
  const mask = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = 0; i < Q; i++) {
    for (let j = Q; j < 3 * Q; j++) {
      mask[i][j] = mask[n-1-i][n-1-j] = true;
      mask[j][i] = mask[n-1-j][n-1-i] = true;
    }
  }

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        알고리즘: 십자 교환법 (Cross-Swap)
      </h3>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        N이 4의 배수일 때 사용하는 간결한 방법입니다.
        핵심 아이디어는 <strong style={{ color: C.text }}>1~N²을 순서대로 채운 뒤,
        특정 영역의 셀을 점대칭 위치와 교환</strong>하는 것입니다.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: "16px", borderRadius: 10, background: C.accent + "08", border: `1px solid ${C.accent}33` }}>
          <h4 style={{ color: C.accent, fontSize: 14, margin: "0 0 8px 0" }}>유지 영역</h4>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: C.accentGreen }}>4개의 코너 블록</strong> (각 N/4 × N/4) 과{" "}
            <strong style={{ color: C.accent }}>중앙 블록</strong> (N/2 × N/2) 은 원래 값을 유지합니다.
          </p>
        </div>
        <div style={{ padding: "16px", borderRadius: 10, background: C.accentRed + "08", border: `1px solid ${C.accentRed}33` }}>
          <h4 style={{ color: C.accentRed, fontSize: 14, margin: "0 0 8px 0" }}>교환 영역 (십자)</h4>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            코너와 중앙 사이를 잇는 <strong style={{ color: C.text }}>십자(+) 모양 영역</strong>의
            셀 (i, j)를 점대칭 위치 (N-1-i, N-1-j)와 교환합니다.
          </p>
        </div>
      </div>

      {/* 8×8 swap pattern diagram */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{
          display: "inline-grid", gridTemplateColumns: `repeat(8, 28px)`,
          gap: 2, padding: 4, borderRadius: 8,
          background: C.codeBg, border: `1px solid ${C.cardBorder}`,
        }}>
          {mask.flatMap((row, i) =>
            row.map((isSwap, j) => {
              const isCorner = !isSwap && ((i < Q || i >= n - Q) && (j < Q || j >= n - Q));
              return (
                <div key={`${i}-${j}`} style={{
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 3, fontSize: 10, fontWeight: 600, fontFamily: "monospace",
                  background: isSwap ? C.accentRed + "33" : isCorner ? C.accentGreen + "22" : C.accent + "18",
                  color: isSwap ? C.accentRed : isCorner ? C.accentGreen : C.accent,
                }}>
                  {isSwap ? "↔" : "·"}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p style={{ color: C.textDim, fontSize: 12, textAlign: "center", margin: "0 0 16px 0" }}>
        8×8 교환 패턴: <span style={{ color: C.accentRed }}>↔</span> = 교환,{" "}
        <span style={{ color: C.accentGreen }}>·</span> = 코너 유지,{" "}
        <span style={{ color: C.accent }}>·</span> = 중앙 유지
      </p>

      <div style={{ padding: "14px 18px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.cardBorder}` }}>
        <pre style={{
          color: C.text, fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          margin: 0, overflow: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap",
        }}>{`# 1~N² 순서대로 채우기
ans[i][j] = i * N + j + 1

# 십자(cross) 영역을 점대칭 교환
for i in range(N // 4):              # 상단 Q행
    for j in range(N//4, 3*N//4):    # 중앙 열
        swap(ans[i][j], ans[N-1-i][N-1-j])     # 상↔하
        swap(ans[j][i], ans[N-1-j][N-1-i])     # 좌↔우`}</pre>
      </div>

      <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: C.warning + "15", border: `1px solid ${C.warning}44` }}>
        <p style={{ color: C.accentYellow, fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
          왜 동작하는가?
        </p>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          순서대로 채운 격자에서 (i, j)의 값과 점대칭 위치 (N-1-i, N-1-j)의 값의 합은
          항상 <strong style={{ color: C.text }}>N² + 1</strong>입니다.
          교환 시 두 위치를 포함하는 행·열 쌍의 합이 보존되며,
          십자 패턴이 각 행·열에서 정확히 절반의 셀만 교환되도록 보장합니다.
        </p>
      </div>
    </Card>
  );
};

const FourN2AlgorithmExplainer = () => (
  <Card>
    <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
      알고리즘: Strachey 방법
    </h3>
    <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
      N = 4k+2 (예: 6, 10, 14, …) 형태는 홀수도 아니고 4의 배수도 아닌 가장 까다로운 경우입니다.
      Strachey 방법은 <strong style={{ color: C.text }}>n = N/2 크기의 홀수 마방진을 기반</strong>으로,
      각 사분면에 서로 다른 오프셋을 더하는 합성 방법입니다.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
      {[
        { step: "1", title: "홀수 마방진 구성", desc: "n = N/2 크기의 홀수 마방진 M을 만듭니다 (값: 1~n²).", color: C.accent },
        { step: "2", title: "오프셋 승수 결정", desc: "N×N의 각 셀에 0, 1, 2, 3 중 하나의 승수를 배정합니다.", color: C.accentGreen },
        { step: "3", title: "최종 합산", desc: "ans[i][j] = 승수 × n² + M[i%n][j%n]으로 값을 결정합니다.", color: C.accentPurple },
      ].map(({ step, title, desc, color }) => (
        <div key={step} style={{ padding: "14px", borderRadius: 10, background: color + "08", border: `1px solid ${color}33` }}>
          <Badge color={color}>Step {step}</Badge>
          <h4 style={{ color, fontSize: 13, margin: "8px 0 6px 0" }}>{title}</h4>
          <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </div>
      ))}
    </div>

    <div style={{ padding: "14px 18px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.cardBorder}`, marginBottom: 16 }}>
      <p style={{ color: C.textDim, fontSize: 12, margin: "0 0 8px 0" }}>
        <strong style={{ color: C.text }}>오프셋 승수 배치 규칙:</strong>
      </p>
      <pre style={{
        color: C.text, fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
        margin: 0, overflow: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap",
      }}>{`# 상반부 (i < N/2): k = [3, 0, 2, 1]
# 하반부 (i ≥ N/2): k = [0, 3, 1, 2]
#
# 좌측 절반 (cols 0..N/2-1):
#   일반 행: [0, N/4)열 → k[0],  [N/4, N/2)열 → k[1]
#   특수 행 (i % (N/2) == N/4):
#     0열 → k[1], [1, 1+N/4)열 → k[0], 나머지 → k[1]
#
# 우측 절반 (cols N/2..N-1):
#   [N/2, N-N/4]열 → k[2],  [N-N/4+1, N)열 → k[3]
#
# 최종: ans[i][j] = 승수[i][j] × n² + M[i%n][j%n]`}</pre>
    </div>

    <div style={{ padding: "12px 16px", borderRadius: 8, background: C.warning + "15", border: `1px solid ${C.warning}44` }}>
      <p style={{ color: C.accentYellow, fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
        왜 동작하는가?
      </p>
      <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
        오프셋 배치는 각 행·열에서 승수 0, 1, 2, 3이 각각 정확히 n번(= N/2번) 등장하도록 설계되었습니다.
        따라서 오프셋의 행/열 합이 균일해지고, 4개 사분면에 복사된 홀수 마방진의 합 성질도 보존되므로
        전체가 마방진이 됩니다.
      </p>
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════
   COMPONENT 5: Summary
   ═══════════════════════════════════════════════════ */
const Summary = () => (
  <Card>
    <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 20px 0" }}>세 가지 방법 요약</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      {[
        { label: "홀수 (2k+1)", method: "Siamese", complexity: "O(N²)", color: C.accent, examples: "3, 5, 7, 9, …" },
        { label: "4의 배수 (4k)", method: "십자 교환", complexity: "O(N²)", color: C.accentGreen, examples: "4, 8, 12, 16, …" },
        { label: "4k+2", method: "Strachey", complexity: "O(N²)", color: C.accentPurple, examples: "6, 10, 14, 18, …" },
      ].map(({ label, method, complexity, color, examples }) => (
        <div key={label} style={{ padding: "18px", borderRadius: 10, textAlign: "center", background: color + "08", border: `1px solid ${color}33` }}>
          <Badge color={color}>{label}</Badge>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: "12px 0 4px 0" }}>{method}</p>
          <p style={{ color, fontSize: 13, fontWeight: 600, margin: "0 0 8px 0" }}>{complexity}</p>
          <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>예: {examples}</p>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 8, background: C.success + "15", border: `1px solid ${C.success}44` }}>
      <p style={{ color: C.accentGreen, fontSize: 14, fontWeight: 600, margin: "0 0 4px 0" }}>핵심 포인트</p>
      <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.8 }}>
        세 방법 모두 시간·공간 복잡도가 <strong style={{ color: C.text }}>O(N²)</strong>이며,
        N ≤ 300 범위에서 충분히 빠릅니다.
        입력 N의 형태(홀수 / 4의 배수 / 4k+2)에 따라 적절한 방법을 선택하면 됩니다.
      </p>
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════
   COMPONENT 6: Code Walkthrough
   ═══════════════════════════════════════════════════ */
const CodeWalkthrough = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    {
      title: "홀수 마방진",
      code: `n = N  # N은 홀수
odd = [[0] * n for _ in range(n)]
x, y = 0, n // 2          # 첫 행 가운데에서 시작

for i in range(1, n * n + 1):
    odd[x][y] = i
    nx = (x - 1) % n       # ↗ 위로
    ny = (y + 1) % n       # ↗ 오른쪽으로
    if odd[nx][ny] != 0:    # 충돌 시
        x = (x + 1) % n    # 대신 ↓ 아래로
    else:
        x, y = nx, ny`,
      desc: "Siamese 방법의 핵심 루프입니다. 각 숫자를 배치한 뒤 ↗ 이동을 시도하고, 이미 숫자가 있으면 ↓로 방향을 바꿉니다.",
    },
    {
      title: "4N 마방진",
      code: `# 1~N² 순서대로 채우기
ans = [[i * N + j + 1 for j in range(N)]
       for i in range(N)]

# 십자(cross) 영역을 점대칭 교환
for i in range(N // 4):
    for j in range(N // 4, 3 * N // 4):
        # 상단 중앙 ↔ 하단 중앙 (점대칭)
        swap(ans[i][j], ans[N-1-i][N-1-j])
        # 좌측 중앙 ↔ 우측 중앙 (전치→점대칭)
        swap(ans[j][i], ans[N-1-j][N-1-i])`,
      desc: "십자 영역만 점대칭 교환합니다. 루프 범위가 rows [0, N/4) × cols [N/4, 3N/4)이고, 두 번째 swap은 이를 전치한 영역(좌·우)을 처리합니다.",
    },
    {
      title: "4N+2 마방진",
      code: `n = N // 2  # n은 홀수
odd = siamese(n)  # n×n 홀수 마방진

# 오프셋 승수 배열 구성
# 상반부: k=[3,0,2,1], 하반부: k=[0,3,1,2]
# 좌측 N/4열 → k[0], 다음 → k[1] (특수 행: 첫열만 k[1])
# 우측 → k[2], 마지막 (N/4-1)열 → k[3]

# 최종 합산: 4개 사분면에 홀수 마방진 복사 + 오프셋
for i in range(n):
    for j in range(n):
        ans[i][j]         = off[i][j]     * n*n + odd[i][j]
        ans[i+n][j]       = off[i+n][j]   * n*n + odd[i][j]
        ans[i][j+n]       = off[i][j+n]   * n*n + odd[i][j]
        ans[i+n][j+n]     = off[i+n][j+n] * n*n + odd[i][j]`,
      desc: "Strachey 방법은 홀수 마방진을 4개 사분면에 복사하고, 각 위치에 정해진 오프셋(0·n², 1·n², 2·n², 3·n²)을 더합니다.",
    },
  ];

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>코드 구조</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {sections.map((s, i) => (
          <Btn key={i} small active={i === activeSection} onClick={() => setActiveSection(i)}>
            {s.title}
          </Btn>
        ))}
      </div>
      <div style={{ background: C.codeBg, borderRadius: 8, padding: "16px 20px", border: `1px solid ${C.cardBorder}`, marginBottom: 12 }}>
        <pre style={{
          color: C.text, fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          margin: 0, overflow: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap",
        }}>
          {sections[activeSection].code}
        </pre>
      </div>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
        {sections[activeSection].desc}
      </p>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 7: Free-form Magic Square Tester
   ═══════════════════════════════════════════════════ */
const MagicSquareTester = () => {
  const [inputN, setInputN] = useState(5);

  const result = useMemo(() => {
    const n = inputN;
    if (n < 3 || n > 20) return null;
    if (n % 2 === 1) return { ...generateOddMagicSquare(n), method: "홀수 (Siamese)" };
    if (n % 4 === 0) return { ...generate4NMagicSquare(n), method: "4N (십자 교환)" };
    return { ...generate4N2MagicSquare(n), method: "4N+2 (Strachey)" };
  }, [inputN]);

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>직접 테스트해 보기</h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        원하는 크기를 입력하면 적절한 방법이 자동으로 선택됩니다.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ color: C.textDim, fontSize: 13 }}>N =</span>
        <input
          type="number" min={3} max={20} value={inputN}
          onChange={(e) => setInputN(Math.max(3, Math.min(20, parseInt(e.target.value) || 3)))}
          style={{
            background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
            color: C.text, padding: "6px 12px", fontSize: 14, fontFamily: "monospace", width: 60,
          }}
        />
        {result && (
          <Badge color={inputN % 2 === 1 ? C.accent : inputN % 4 === 0 ? C.accentGreen : C.accentPurple}>
            {result.method}
          </Badge>
        )}
        {[3, 4, 5, 6, 7, 8, 9, 10].map(s => (
          <Btn key={s} small active={inputN === s} onClick={() => setInputN(s)}>{s}</Btn>
        ))}
      </div>

      {result && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MagicGrid
            grid={result.grid}
            showSums={true}
            maxCellSize={inputN <= 5 ? 56 : inputN <= 8 ? 42 : inputN <= 12 ? 34 : 28}
          />
        </div>
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN: Blog Article
   ═══════════════════════════════════════════════════ */
export default function MagicSquareArticle() {
  return (
    <div style={{
      minHeight: "100vh", padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 840, margin: "0 auto",
    }}>
      {/* Intro */}
      <Card>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 12px 0" }}>
          <strong style={{ color: C.text }}>마방진(Magic Square)</strong>이란
          N×N 격자에 1부터 N²까지의 정수를 하나씩 배치하여
          모든 가로줄, 세로줄, 대각선의 합이 동일한 배치를 말합니다.
          이때 공통 합을 <strong style={{ color: C.accent }}>매직 상수(Magic Constant)</strong>라 하며,
          그 값은 <strong style={{ color: C.accent }}>M = N(N² + 1) / 2</strong>입니다.
        </p>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          N의 형태에 따라 구성 방법이 달라집니다.
          이 글에서는 <Badge color={C.accent}>홀수 N</Badge>,
          <Badge color={C.accentGreen}>4의 배수 N</Badge>,
          <Badge color={C.accentPurple}>4k+2 형태의 N</Badge>
          세 가지 경우를 각각 다룹니다.
        </p>
      </Card>

      {/* ── Section 1: Odd ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accent }}>①</span> 홀수 마방진 (N = 2k+1)
      </h2>
      <OddAlgorithmExplainer />
      <OddMagicSquare />

      {/* ── Section 2: 4N ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accentGreen }}>②</span> 4N 마방진 (N = 4k)
      </h2>
      <FourNAlgorithmExplainer />
      <FourNMagicSquare />

      {/* ── Section 3: 4N+2 ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accentPurple }}>③</span> 4N+2 마방진 (N = 4k+2)
      </h2>
      <FourN2AlgorithmExplainer />
      <FourN2MagicSquare />

      {/* ── Summary ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>정리</h2>
      <Summary />

      {/* ── Code ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>구현</h2>
      <CodeWalkthrough />

      {/* ── Tester ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>테스트</h2>
      <MagicSquareTester />
    </div>
  );
}
