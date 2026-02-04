// @ts-nocheck
'use client';

import { useState, useCallback, useRef, useEffect } from "react";

/* ─── Color Palette ─── */
const C = {
  //bg: "#0d1117",
  card: "#161b22",
  cardBorder: "#30363d",
  bar: "#58a6ff",
  barDim: "#58a6ff44",
  stairColors: ["#58a6ff", "#f97583", "#56d364", "#d2a8ff", "#f0883e", "#79c0ff"],
  orb: "#ffd700",
  orbGlow: "rgba(255,215,0,0.3)",
  text: "#e6edf3",
  textDim: "#8b949e",
  textMuted: "#484f58",
  accent: "#58a6ff",
  accentGreen: "#56d364",
  accentRed: "#f97583",
  accentPurple: "#d2a8ff",
  border: "#30363d",
  codeBg: "#0d1117",
  btnBg: "#21262d",
  btnHover: "#30363d",
  success: "#238636",
  warning: "#9e6a03",
};

/* ─── Utility ─── */
const simulate = (initValues, numOrbs) => {
  const v = [...initValues];
  const history = [{ values: [...v], orbPath: null, desc: "초기 상태" }];
  for (let o = 0; o < numOrbs; o++) {
    let pos = 0;
    const path = [0];
    while (pos + 1 < v.length && v[pos] > v[pos + 1]) {
      pos++;
      path.push(pos);
    }
    v[pos]++;
    history.push({
      values: [...v],
      orbPath: path,
      stoppedAt: pos,
      desc: `구슬 ${o + 1}: ${pos + 1}번 구역에서 정지 → V[${pos + 1}] = ${v[pos]}`,
    });
  }
  return history;
};

const buildStairs = (values) => {
  const stairs = [];
  for (let i = 0; i < values.length; i++) {
    const last = stairs.length > 0 ? stairs[stairs.length - 1] : null;
    if (!last || last.start - last.len < values[i]) {
      stairs.push({ start: values[i], len: 1, indices: [i], minVal() { return Math.min(...this.indices.map(j => values[j])); } });
    } else {
      last.len++;
      last.indices.push(i);
    }
  }
  return stairs;
};

/* ─── Stair History (build once, merge only) ─── */
const computeStairHistory = (history) => {
  if (history.length === 0) return [];
  const initGroups = buildStairs(history[0].values).map((s) => [...s.indices]);
  const result = [initGroups];
  for (let step = 1; step < history.length; step++) {
    const v = history[step].values;
    const groups = result[step - 1].map((g) => [...g]);
    // Only merge — never split
    while (groups.length > 1) {
      const minOfFirst = Math.min(...groups[0].map((i) => v[i]));
      const startOfSecond = v[groups[1][0]];
      if (minOfFirst >= startOfSecond) {
        groups[0] = [...groups[0], ...groups[1]];
        groups.splice(1, 1);
      } else {
        break;
      }
    }
    result.push(groups);
  }
  return result;
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

/* ─── Bar Chart ─── */
const BarChart = ({
  values, maxVal = null, orbPos = null, orbPath = [],
  stairGroupIndices = [], highlights = [], width = 500, height = 260,
  label = null, showIndices = true, compact = false,
}) => {
  const n = values.length;
  const mx = maxVal || Math.max(...values, 1);
  const pad = { top: 24, bottom: compact ? 36 : 48, left: 44, right: 20 };
  const cW = width - pad.left - pad.right;
  const cH = height - pad.top - pad.bottom;
  const gap = cW / n;
  const barW = Math.min(56, gap * 0.65);

  const getColor = (i) => {
    if (highlights.includes(i)) return C.accentRed;
    for (let g = 0; g < stairGroupIndices.length; g++) {
      if (stairGroupIndices[g].includes(i)) return C.stairColors[g % C.stairColors.length];
    }
    return C.bar;
  };

  const isOnPath = (i) => orbPath.includes(i);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Grid */}
      {Array.from({ length: Math.min(mx + 1, 15) }, (_, i) => {
        const step = mx > 14 ? Math.ceil(mx / 10) : 1;
        if (i % step !== 0 && i !== mx) return null;
        const y = pad.top + cH - (i / mx) * cH;
        return (
          <g key={`g${i}`}>
            <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke={C.textMuted + "33"} strokeWidth={1} />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" fill={C.textMuted} fontSize={11} fontFamily="monospace">{i}</text>
          </g>
        );
      })}
      {/* Bars */}
      {values.map((v, i) => {
        const x = pad.left + i * gap + (gap - barW) / 2;
        const barH = Math.max(1, (v / mx) * cH);
        const y = pad.top + cH - barH;
        const col = getColor(i);
        return (
          <g key={`b${i}`}>
            {isOnPath(i) && (
              <rect x={x - 3} y={pad.top} width={barW + 6} height={cH} fill={C.orbGlow} rx={4} opacity={0.3} />
            )}
            <rect x={x} y={y} width={barW} height={barH} fill={col} rx={3} opacity={0.85} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={C.text} fontSize={compact ? 11 : 13} fontWeight="bold" fontFamily="monospace">
              {v}
            </text>
            {showIndices && (
              <text x={x + barW / 2} y={pad.top + cH + 18} textAnchor="middle" fill={C.textMuted} fontSize={11} fontFamily="monospace">
                {i + 1}
              </text>
            )}
          </g>
        );
      })}
      {/* Orb */}
      {orbPos !== null && orbPos >= 0 && orbPos < n && (
        <g>
          <circle
            cx={pad.left + orbPos * gap + gap / 2}
            cy={pad.top + cH - (values[orbPos] / mx) * cH - 22}
            r={12} fill={C.orbGlow}
          />
          <circle
            cx={pad.left + orbPos * gap + gap / 2}
            cy={pad.top + cH - (values[orbPos] / mx) * cH - 22}
            r={8} fill={C.orb}
          />
          <text
            x={pad.left + orbPos * gap + gap / 2}
            y={pad.top + cH - (values[orbPos] / mx) * cH - 18}
            textAnchor="middle" fontSize={8} fontWeight="bold" fill="#333"
          >⬤</text>
        </g>
      )}
      {/* Orb path arrows */}
      {orbPath.length > 1 && orbPath.map((p, i) => {
        if (i === 0) return null;
        const prev = orbPath[i - 1];
        const x1 = pad.left + prev * gap + gap / 2;
        const x2 = pad.left + p * gap + gap / 2;
        const y1 = pad.top + cH - (values[prev] / mx) * cH - 22;
        return (
          <line key={`arrow${i}`} x1={x1 + 10} y1={y1} x2={x2 - 10} y2={y1}
            stroke={C.orb} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      {orbPath.length > 1 && (
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.orb} opacity={0.6} />
          </marker>
        </defs>
      )}
      {/* Label */}
      {label && (
        <text x={width / 2} y={height - 2} textAnchor="middle" fill={C.textDim} fontSize={12} fontFamily="sans-serif">{label}</text>
      )}
    </svg>
  );
};


/* ════════════════════════════════════════════════
   COMPONENT 1: Interactive Orb Simulator
   ════════════════════════════════════════════════ */
const OrbSimulator = () => {
  const [inputStr, setInputStr] = useState("1 3 2 5 4");
  const [values, setValues] = useState([1, 3, 2, 5, 4]);
  const [history, setHistory] = useState([]);
  const [stairHistory, setStairHistory] = useState([]);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const intervalRef = useRef(null);

  const initSim = useCallback((numOrbs = 10) => {
    const parsed = inputStr.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (parsed.length === 0) return;
    setValues(parsed);
    const h = simulate(parsed, numOrbs);
    setHistory(h);
    setStairHistory(computeStairHistory(h));
    setStep(0);
    setAutoPlay(false);
  }, [inputStr]);

  useEffect(() => { initSim(10); }, []);

  useEffect(() => {
    if (autoPlay && step < history.length - 1) {
      intervalRef.current = setTimeout(() => setStep((s) => s + 1), 600);
    } else {
      setAutoPlay(false);
    }
    return () => clearTimeout(intervalRef.current);
  }, [autoPlay, step, history.length]);

  const cur = history[step] || { values: values, desc: "" };
  const stairIndices = stairHistory[step] || [];
  const stairInfo = stairIndices.map((indices) => ({
    start: cur.values[indices[0]],
    len: indices.length,
    minVal: Math.min(...indices.map((i) => cur.values[i])),
    indices,
  }));

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ color: C.textDim, fontSize: 13 }}>초기 배열:</span>
        <input
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          style={{
            background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
            color: C.text, padding: "6px 12px", fontSize: 14, fontFamily: "monospace", width: 200,
          }}
        />
        <Btn small onClick={() => initSim(10)}>구슬 10개</Btn>
        <Btn small onClick={() => initSim(30)}>구슬 30개</Btn>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <BarChart
          values={cur.values}
          maxVal={Math.max(...history.map((h) => Math.max(...h.values)), 1) + 1}
          orbPos={cur.stoppedAt ?? null}
          orbPath={cur.orbPath || []}
          stairGroupIndices={stairIndices}
          width={Math.min(600, Math.max(300, cur.values.length * 70))}
          height={280}
        />
      </div>

      {/* Step info */}
      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "12px 16px",
        border: `1px solid ${C.cardBorder}`, marginTop: 12, marginBottom: 16,
        fontFamily: "monospace", fontSize: 13, color: C.textDim,
      }}>
        <span style={{ color: C.accent }}>Step {step}/{history.length - 1}</span>
        {" — "}
        <span style={{ color: C.text }}>{cur.desc}</span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn onClick={() => setStep(0)} disabled={step === 0} small>⏮</Btn>
        <Btn onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} small>◀ 이전</Btn>
        <Btn onClick={() => { setAutoPlay(!autoPlay); }} small color={autoPlay ? C.accentRed : C.accentGreen}>
          {autoPlay ? "⏸ 정지" : "▶ 재생"}
        </Btn>
        <Btn onClick={() => setStep(Math.min(history.length - 1, step + 1))} disabled={step >= history.length - 1} small>
          다음 ▶
        </Btn>
        <Btn onClick={() => setStep(history.length - 1)} disabled={step >= history.length - 1} small>⏭</Btn>
      </div>

      {/* Stair info */}
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {stairInfo.map((s, i) => (
          <div key={i} style={{
            padding: "8px 14px", borderRadius: 8,
            background: C.stairColors[i % C.stairColors.length] + "15",
            border: `1px solid ${C.stairColors[i % C.stairColors.length]}44`,
          }}>
            <span style={{ color: C.stairColors[i % C.stairColors.length], fontSize: 13, fontWeight: 600 }}>
              계단 {i + 1}
            </span>
            <span style={{ color: C.textDim, fontSize: 12, marginLeft: 8 }}>
              시작={s.start}, 길이={s.len}, 최솟값={s.minVal}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════════
   COMPONENT 2: Stair Concept Explainer
   ════════════════════════════════════════════════ */
const StairExplainer = () => {
  const examples = [
    { values: [4, 3, 2, 5, 4], label: "2개의 계단", desc: "[4, 3, 2]와 [5, 4]" },
    { values: [5, 4, 3, 2, 1], label: "1개의 계단", desc: "전체가 하나의 내림차순" },
    { values: [1, 2, 3, 4, 5], label: "5개의 계단", desc: "오름차순이면 모두 별개" },
    { values: [3, 2, 5, 4, 3, 7, 6], label: "3개의 계단", desc: "[3, 2], [5, 4, 3], [7, 6]" },
  ];
  const [selected, setSelected] = useState(0);
  const ex = examples[selected];
  const stairs = buildStairs(ex.values);

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        계단(Stair)이란?
      </h3>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px 0" }}>
        배열을 <strong style={{ color: C.text }}>연속으로 1씩 감소하는 최대 구간</strong>들로
        분할한 것을 "계단"이라 부릅니다. 구슬은 하나의 계단 내에서는 끝까지 굴러가고,
        다음 계단의 시작값이 더 크거나 같으면 거기서 멈춥니다.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {examples.map((e, i) => (
          <Btn key={i} small active={i === selected} onClick={() => setSelected(i)}>
            {e.label}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <BarChart
          values={ex.values}
          stairGroupIndices={stairs.map((s) => s.indices)}
          maxVal={Math.max(...ex.values) + 2}
          width={Math.min(520, Math.max(300, ex.values.length * 68))}
          height={240}
          label={`[${ex.values.join(", ")}] → ${ex.desc}`}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {stairs.map((s, i) => (
          <div key={i} style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 13,
            background: C.stairColors[i % C.stairColors.length] + "15",
            border: `1px solid ${C.stairColors[i % C.stairColors.length]}44`,
            color: C.stairColors[i % C.stairColors.length],
          }}>
            [{ex.values.slice(s.indices[0], s.indices[0] + s.len).join(", ")}]
            <span style={{ color: C.textDim, marginLeft: 6 }}>
              (시작={s.start}, 길이={s.len})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════════
   COMPONENT 3: Merge Visualization
   ════════════════════════════════════════════════ */
const MergeVisualizer = () => {
  const stages = [
    {
      values: [4, 3, 2, 5, 4],
      groups: [[0, 1, 2], [3, 4]],
      label: "구슬 3개 후",
      note: "계단 1: [4, 3, 2], 계단 2: [5, 4]",
      detail: "1번 구역의 가치를 높여 계단 1의 최솟값을 올린다",
    },
    {
      values: [5, 4, 3, 5, 4],
      groups: [[0, 1, 2], [3, 4]],
      label: "구슬 6개 후",
      note: "계단 1 최솟값 = 3, 계단 2 시작 = 5",
      detail: "아직 최솟값(3) < 시작값(5), 구슬은 여전히 계단 1에서 멈춤",
    },
    {
      values: [6, 5, 4, 5, 4],
      groups: [[0, 1, 2], [3, 4]],
      label: "구슬 9개 후",
      note: "계단 1 최솟값 = 4, 계단 2 시작 = 5",
      detail: "최솟값(4) < 시작값(5), 구슬이 계단 1을 통과하여 계단 2에서 멈춤",
    },
    {
      values: [7, 6, 5, 5, 4],
      groups: [[0, 1, 2], [3, 4]],
      label: "구슬 12개 후",
      note: "계단 1 최솟값 = 5 = 계단 2 시작값",
      detail: "이제 최솟값(5) ≥ 시작값(5)! 두 계단이 병합 가능",
    },
    {
      values: [7, 6, 5, 5, 4],
      groups: [[0, 1, 2, 3, 4]],
      label: "병합 후",
      note: "하나의 큰 계단이 됨",
      detail: "이제 구슬은 이 계단의 맨 끝에서부터 채워나감",
    },
  ];
  const [step, setStep] = useState(0);
  const s = stages[step];

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        계단 병합 과정
      </h3>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <BarChart
          values={s.values}
          stairGroupIndices={s.groups}
          maxVal={10}
          width={440}
          height={240}
          label={s.label}
        />
      </div>

      {/* Info box */}
      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "14px 18px",
        border: `1px solid ${C.cardBorder}`, marginBottom: 16,
      }}>
        <p style={{ color: C.accent, fontSize: 14, fontWeight: 600, margin: "0 0 4px 0" }}>{s.note}</p>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0 }}>{s.detail}</p>
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center", marginBottom: 8 }}>
        {stages.map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setStep(i)}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: i === step ? `2px solid ${C.accent}` : `1px solid ${C.cardBorder}`,
                background: i <= step ? (i === step ? C.accent + "33" : C.accent + "11") : C.btnBg,
                color: i === step ? C.accent : C.textDim,
                cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}
            >{i + 1}</button>
            {i < stages.length - 1 && (
              <div style={{
                width: 40, height: 2,
                background: i < step ? C.accent + "66" : C.cardBorder,
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Btn small onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀ 이전</Btn>
        <Btn small onClick={() => setStep(Math.min(stages.length - 1, step + 1))} disabled={step >= stages.length - 1}>다음 ▶</Btn>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════════
   COMPONENT 4: Tuple Explainer
   ════════════════════════════════════════════════ */
const TupleExplainer = () => {
  const [hovered, setHovered] = useState(null);
  const fields = [
    { label: "start", color: C.accent, desc: "계단 시작점(최대)의 가치", example: "5" },
    { label: "len", color: C.accentGreen, desc: "이어진 계단의 길이", example: "3" },
    { label: "deficit", color: C.accentRed, desc: "계단을 완성하기 위해 부족한 구슬의 합", example: "2" },
    { label: "partial", color: C.accentPurple, desc: "현재 층에 이미 쌓인 구슬 수", example: "1" },
  ];

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        계단 튜플: <code style={{ color: C.accent }}>(start, len, deficit, partial)</code>
      </h3>

      {/* Visual tuple */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        <span style={{ color: C.textDim, fontSize: 24, lineHeight: "48px" }}>(</span>
        {fields.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "10px 18px", borderRadius: 8, cursor: "pointer",
                background: hovered === i ? f.color + "33" : f.color + "15",
                border: `2px solid ${hovered === i ? f.color : f.color + "44"}`,
                transition: "all 0.15s",
              }}
            >
              <span style={{ color: f.color, fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>{f.example}</span>
            </div>
            {i < fields.length - 1 && <span style={{ color: C.textMuted, fontSize: 20 }}>,</span>}
          </div>
        ))}
        <span style={{ color: C.textDim, fontSize: 24, lineHeight: "48px" }}>)</span>
      </div>

      {/* Descriptions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {fields.map((f, i) => (
          <div key={i} style={{
            padding: "12px 16px", borderRadius: 8,
            background: hovered === i ? f.color + "11" : "transparent",
            border: `1px solid ${hovered === i ? f.color + "44" : C.cardBorder}`,
            transition: "all 0.15s",
          }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ color: f.color, fontSize: 13, fontWeight: 600 }}>{f.label}</span>
            <p style={{ color: C.textDim, fontSize: 13, margin: "4px 0 0 0" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Example */}
      <div style={{
        marginTop: 20, padding: "16px 20px", borderRadius: 8,
        background: C.codeBg, border: `1px solid ${C.cardBorder}`,
      }}>
        <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 8px 0" }}>
          <strong style={{ color: C.text }}>예시:</strong> 배열 [5, 4, 2]를 하나의 계단으로 표현
        </p>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          시작값 = <span style={{ color: C.accent }}>5</span>,
          길이 = <span style={{ color: C.accentGreen }}>3</span>,
          부족분 = (5-1) - 4 + (5-2) - 2 = <span style={{ color: C.accentRed }}>1</span> (4번째 칸이 3이 아닌 2),
          부분 = <span style={{ color: C.accentPurple }}>0</span>
        </p>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════════
   COMPONENT 5: Amortized Analysis
   ════════════════════════════════════════════════ */
const AmortizedAnalysis = () => {
  const stages = [
    { stairs: 5, merged: 0, total: 5, label: "초기", note: "N개의 구역 → 최대 N개의 계단" },
    { stairs: 4, merged: 1, total: 5, label: "병합 1회", note: "계단 수가 4개로 감소" },
    { stairs: 3, merged: 2, total: 5, label: "병합 2회", note: "계단 수가 3개로 감소" },
    { stairs: 1, merged: 4, total: 5, label: "모두 병합", note: "최종: 하나의 큰 계단" },
  ];

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        분할 상환 분석
      </h3>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "0 0 20px 0" }}>
        병합은 계단 수를 <strong style={{ color: C.text }}>항상 감소</strong>시킵니다.
        초기에 최대 N개의 계단이 있으므로, 전체 쿼리에 걸쳐 총 병합 횟수는
        <strong style={{ color: C.accent }}> O(N)</strong>을 넘지 않습니다.
      </p>

      {/* Visual */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {stages.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              display: "flex", gap: 3, justifyContent: "center", alignItems: "flex-end",
              height: 80, padding: "0 8px",
            }}>
              {Array.from({ length: s.stairs }, (_, j) => (
                <div key={j} style={{
                  width: 16, height: 20 + j * 12, borderRadius: 4,
                  background: C.stairColors[j % C.stairColors.length],
                  opacity: 0.8,
                }} />
              ))}
            </div>
            <p style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: "8px 0 2px 0" }}>{s.label}</p>
            <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>계단 {s.stairs}개</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20, padding: "16px 20px", borderRadius: 8,
        background: C.success + "15", border: `1px solid ${C.success}44`,
      }}>
        <p style={{ color: C.accentGreen, fontSize: 14, fontWeight: 600, margin: "0 0 4px 0" }}>
          시간 복잡도
        </p>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          각 쿼리에서 while 루프 외의 작업은 O(1)입니다.
          병합 루프의 총 실행 횟수는 O(N)이므로, 전체 시간 복잡도는 <strong style={{ color: C.text }}>O(N + Q)</strong>입니다.
        </p>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════════════
   COMPONENT 6: Code Walkthrough
   ════════════════════════════════════════════════ */
const CodeWalkthrough = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    {
      title: "초기화",
      desc: "배열을 순회하며 계단 구조를 구성합니다. 현재 값이 마지막 계단의 최솟값보다 엄격히 작으면 기존 계단에 편입시키고, 그렇지 않으면 새 계단을 시작합니다.",
      code: `for Vi in V:
    if len(stairs) == 0 or stairs[-1][0] - stairs[-1][1] < Vi:
        stairs.append((Vi, 1, 0, 0))
    else:
        stairs[-1] = (stairs[-1][0], stairs[-1][1] + 1,
            stairs[-1][2] + (stairs[-1][0] - stairs[-1][1] - Vi), 0)`,
    },
    {
      title: "병합 루프",
      desc: "구슬이 충분하면 첫 번째 계단을 두 번째 계단과 병합합니다. merge_cond는 첫 번째 계단의 시작값을 두 번째 계단의 높이까지 올리는 데 필요한 구슬 수입니다.",
      code: `while len(stairs) > 1 and x[0] >= merge_cond:
    x[0] -= merge_cond
    merged = (stairs[1][0] + stairs[0][1],
              stairs[0][1] + stairs[1][1],
              stairs[1][2], 0)
    stairs.popleft()
    stairs[0] = merged`,
    },
    {
      title: "잔여 구슬 처리",
      desc: "병합 후 남은 구슬로 현재 계단을 채웁니다. deficit(부족분)을 먼저 채우고, 나머지는 계단 전체를 균등하게 올립니다.",
      code: `if x[0] >= stairs[0][2]:
    x[0] -= stairs[0][2]
    stairs[0] = (stairs[0][0] + (x[0] + stairs[0][3]) // stairs[0][1],
                 stairs[0][1], 0,
                 (stairs[0][3] + x[0]) % stairs[0][1])
else:
    stairs[0] = (stairs[0][0], stairs[0][1],
                 stairs[0][2] - x[0], 0)`,
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

      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "16px 20px",
        border: `1px solid ${C.cardBorder}`, marginBottom: 12,
      }}>
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

/* ════════════════════════════════════════════════
   COMPONENT 7: Complexity Comparison
   ════════════════════════════════════════════════ */
const ComplexityComparison = () => (
  <Card>
    <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 20px 0" }}>복잡도 비교</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{
        padding: "20px", borderRadius: 12,
        background: C.accentRed + "08", border: `1px solid ${C.accentRed}33`,
      }}>
        <h4 style={{ color: C.accentRed, fontSize: 16, margin: "0 0 12px 0" }}>❌ 단순 시뮬레이션</h4>
        <div style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 8px 0" }}>구슬 하나당 최대 O(N) 이동</p>
          <p style={{ margin: "0 0 8px 0" }}>쿼리당: O(x · N)</p>
          <p style={{ margin: 0, color: C.accentRed, fontWeight: 600, fontSize: 18 }}>
            O(Q · x · N) ≈ 10¹¹
          </p>
        </div>
      </div>
      <div style={{
        padding: "20px", borderRadius: 12,
        background: C.accentGreen + "08", border: `1px solid ${C.accentGreen}33`,
      }}>
        <h4 style={{ color: C.accentGreen, fontSize: 16, margin: "0 0 12px 0" }}>✅ 계단 자료구조</h4>
        <div style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 8px 0" }}>초기화: O(N)</p>
          <p style={{ margin: "0 0 8px 0" }}>병합 총합: O(N), 나머지: 쿼리당 O(1)</p>
          <p style={{ margin: 0, color: C.accentGreen, fontWeight: 600, fontSize: 18 }}>
            O(N + Q) ≈ 10⁶
          </p>
        </div>
      </div>
    </div>
  </Card>
);

/* ════════════════════════════════════════════════
   MAIN: Blog Article
   ════════════════════════════════════════════════ */
export default function MagicOrbArticle() {
  return (
    <div style={{
      background: C.bg, minHeight: "100vh", padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 800, margin: "0 auto",
    }}>
      {/* Section 1: 문제 소개 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>문제 소개</h2>
      <Card>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
          N개의 구역이 일직선으로 놓여 있고, 구슬을 1번 구역에 내려놓으면
          <strong style={{ color: C.text }}> 현재 가치 {">"} 다음 가치</strong>인 동안
          오른쪽으로 이동합니다. 멈추면 해당 구역의 가치를 1 높입니다.
        </p>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
          아래 시뮬레이터에서 직접 배열을 입력하고 구슬을 굴려보세요.
        </p>
      </Card>
      <OrbSimulator />

      {/* Section 2: 핵심 관찰 - 계단 구조 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>핵심 관찰: 계단 구조</h2>
      <StairExplainer />

      {/* Section 3: 계단의 병합 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>계단의 병합</h2>
      <Card>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          구슬을 계속 넣으면 첫 번째 계단의 시작값이 증가합니다.
          이에 따라 최솟값도 올라가고, 최솟값이 다음 계단의 시작값 이상이 되면
          두 계단이 <strong style={{ color: C.accent }}>하나로 병합</strong>됩니다.
          병합 후에는 더 큰 하나의 계단이 되어, 이후 구슬이 더 뒤쪽까지 굴러갈 수 있습니다.
        </p>
      </Card>
      <MergeVisualizer />

      {/* Section 4: 자료구조 설계 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>자료구조 설계</h2>
      <TupleExplainer />

      {/* Section 5: 복잡도 분석 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>복잡도 분석</h2>
      <AmortizedAnalysis />
      <ComplexityComparison />

      {/* Section 6: 구현 */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>구현</h2>
      <CodeWalkthrough />
    </div>
  );
}
