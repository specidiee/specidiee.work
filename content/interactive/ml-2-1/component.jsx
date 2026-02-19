'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/* ─── colour tokens (aligned with site theme) ─── */
const C = {
  bg: "#050510",
  surface: "rgba(20, 20, 40, 0.6)",
  surfaceAlt: "rgba(30, 30, 60, 0.8)",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#00f3ff",
  accentDim: "#00b8cc",
  text: "#e0e0ff",
  textDim: "#a0a0c0",
  textMuted: "#707090",
  blue: "#5b9bd5",
  green: "#6bcb77",
  red: "#ee6055",
  purple: "#b68cd8",
  orange: "#f4a261",
  yellow: "#e9c46a",
  question: "#ffd700",
};

/* ─── Gradient Link (matches CasualLayout .content a style) ─── */
const GradLink = ({ href, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontWeight: 600,
        textDecoration: "none",
        background: "linear-gradient(90deg, #60a5fa, #e879f9)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        position: "relative",
        display: "inline-block",
        transition: "all 0.3s ease",
        textShadow: hovered ? "0 0 15px rgba(232, 121, 249, 0.5)" : "none",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: -2,
          height: 1,
          width: hovered ? "100%" : 0,
          background: "linear-gradient(90deg, #60a5fa, #e879f9)",
          transition: "width 0.3s ease",
          display: "block",
        }}
      />
    </a>
  );
};

/* ─── Highlighted box ─── */
const Box = ({ children, color = C.accent, label }) => (
  <div
    style={{
      background: `${color}12`,
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: "0 12px 12px 0",
      padding: "1.25rem 1.5rem",
      margin: "2rem 0",
      fontSize: "0.95rem",
      lineHeight: 1.8,
      backdropFilter: "blur(10px)",
    }}
  >
    {label && (
      <div
        style={{
          fontSize: "0.7em",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ display: "inline-block", width: 4, height: 4, background: color, borderRadius: "50%" }} />
        {label}
      </div>
    )}
    {children}
  </div>
);

/* ─── Socratic Question Component ─── */
const Question = ({ number, children, revealed, onReveal }) => (
  <div
    style={{
      margin: "2rem 0",
      padding: "1.5rem",
      background: `linear-gradient(135deg, ${C.question}08, transparent)`,
      border: `1px solid ${C.question}30`,
      borderRadius: 12,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 4,
        height: "100%",
        background: `linear-gradient(to bottom, ${C.question}, ${C.question}40)`,
      }}
    />
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span
        style={{
          background: `${C.question}20`,
          color: C.question,
          padding: "4px 10px",
          borderRadius: 6,
          fontSize: "0.75em",
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
        }}
      >
        Q{number}
      </span>
      <div style={{ color: C.text, fontWeight: 500, lineHeight: 1.7, fontSize: "1.05rem" }}>
        {children}
      </div>
    </div>
    {!revealed && onReveal && (
      <button
        onClick={onReveal}
        style={{
          marginTop: "1rem",
          marginLeft: 44,
          padding: "8px 16px",
          background: `${C.question}15`,
          border: `1px solid ${C.question}40`,
          borderRadius: 8,
          color: C.question,
          fontSize: "0.85em",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${C.question}25`;
          e.currentTarget.style.borderColor = C.question;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${C.question}15`;
          e.currentTarget.style.borderColor = `${C.question}40`;
        }}
      >
        💭 생각해보기...
      </button>
    )}
  </div>
);

/* ─── Socratic Answer Component ─── */
const Answer = ({ children, visible }) => (
  <div
    style={{
      maxHeight: visible ? 3000 : 0,
      opacity: visible ? 1 : 0,
      overflow: "hidden",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      marginBottom: visible ? "1.5rem" : 0,
    }}
  >
    <div
      style={{
        padding: "1.25rem 1.5rem",
        background: C.surface,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        marginLeft: "1rem",
        borderLeft: `3px solid ${C.accent}`,
      }}
    >
      <div style={{ color: C.textDim, lineHeight: 1.8, fontSize: "1rem" }}>
        {children}
      </div>
    </div>
  </div>
);

/* ─── Section Title ─── */
const SectionTitle = ({ children, subtitle }) => (
  <div style={{ marginBottom: "2rem" }}>
    <h2 style={{
      fontSize: "1.8rem",
      fontWeight: 700,
      color: C.text,
      marginBottom: subtitle ? "0.5rem" : 0,
      background: `linear-gradient(135deg, ${C.text}, ${C.accent})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {children}
    </h2>
    {subtitle && (
      <p style={{ color: C.textMuted, fontSize: "0.95rem" }}>{subtitle}</p>
    )}
  </div>
);

/* ─── Math Display ─── */
const MathBlock = ({ children }) => (
  <div
    style={{
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "1.5rem 2rem",
      margin: "1.5rem 0",
      textAlign: "center",
      fontSize: "1.1rem",
      color: C.accent,
      overflowX: "auto",
    }}
  >
    <BlockMath math={children} />
  </div>
);

/* ─── Inline Math ─── */
const Eq = ({ children }) => <InlineMath math={children} />;

/* ─── Simple seeded random ─── */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianRandom(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function dot(a, b) {
  return a.reduce((s, ai, i) => s + ai * b[i], 0);
}

/* ═══════════════════════════════════════════════════════════════
   0. Introduction
   ═══════════════════════════════════════════════════════════════ */
function Introduction() {
  return (
    <div>
      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        <GradLink href="/blog/ml-1-2">이전 글</GradLink>에서 우리는 <strong style={{ color: C.text }}>학습이 언제 가능한지</strong>를 이론적으로 분석했습니다.
        VC 차원이 유한하고 데이터가 충분하면, 훈련 오차 <Eq>{'E_{\\text{in}}'}</Eq>과 일반화 오차 <Eq>{'E_{\\text{out}}'}</Eq>이
        가까워진다는 것을 확인했죠.
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        이제 자연스러운 다음 질문으로 넘어갑니다: <strong style={{ color: C.text }}>실제로 어떻게 학습하는가?</strong>{" "}
        이 글에서는 가장 기본적이면서도 놀라울 만큼 강력한 도구인 <strong style={{ color: C.accent }}>선형 모델</strong>을 다룹니다.
      </p>

      <Box color={C.accent} label="이 글의 여정">
        <strong style={{ color: C.blue }}>선형 분류기의 기하학</strong>에서 출발하여,{" "}
        <strong style={{ color: C.green }}>퍼셉트론</strong>으로 분류를 학습하고,{" "}
        <strong style={{ color: C.purple }}>선형 회귀</strong>로 닫힌 형태의 해를 구하며,{" "}
        <strong style={{ color: C.orange }}>경사하강법</strong>으로 대규모 학습의 문을 열고,{" "}
        <strong style={{ color: C.yellow }}>특성 변환</strong>으로 선형 모델의 한계를 돌파합니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. Geometry of Linear Classifiers
   ═══════════════════════════════════════════════════════════════ */
function LinearClassifierGeometry() {
  const [revealed, setRevealed] = useState({});
  const reveal = (id) => setRevealed((p) => ({ ...p, [id]: true }));

  return (
    <div>
      <SectionTitle subtitle="초평면으로 공간을 나누다">
        1. 선형 분류기의 기하학
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        은행에서 대출 심사를 한다고 합시다. 고객의 <strong style={{ color: C.text }}>연소득</strong>과{" "}
        <strong style={{ color: C.text }}>기존 부채 금액</strong> 두 가지 정보를 보고 대출을 승인(<Eq>{'+1'}</Eq>)할지
        거절(<Eq>{'-1'}</Eq>)할지 결정해야 합니다.
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        2차원 평면에서 각 고객은 한 점이 되고, 우리가 하고 싶은 것은 평면 위에{" "}
        <strong style={{ color: C.accent }}>직선 하나를 그어서</strong> 승인과 거절을 양쪽으로 나누는 것입니다.
        이것이 바로 <strong style={{ color: C.text }}>선형 분류기</strong>이며, 수식으로 쓰면 다음과 같습니다.
      </p>

      <MathBlock>{'h(\\mathbf{x}) = \\text{sign}(\\mathbf{w}^T\\mathbf{x})'}</MathBlock>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        여기서 <Eq>{'\\mathbf{w}'}</Eq>는 가중치 열벡터(column vector), <Eq>{'\\mathbf{x}'}</Eq>는 입력 열벡터입니다.
        내적 <Eq>{'\\mathbf{w}^T\\mathbf{x}'}</Eq>의 부호가 양이면 +1, 음이면 -1을 출력합니다.
      </p>

      <Question number={1} revealed={revealed.q1} onReveal={() => reveal("q1")}>
        <Eq>{'\\mathbf{w}^T\\mathbf{x} = 0'}</Eq>은 기하학적으로 어떤 도형을 나타낼까요?
        2차원이라면? 3차원이라면? 일반적인 <Eq>{'d'}</Eq>차원이라면?
      </Question>
      <Answer visible={revealed.q1}>
        <Eq>{'\\mathbf{w} = (a, b)^T'}</Eq>이면 <Eq>{'\\mathbf{w}^T\\mathbf{x} = ax_1 + bx_2 = 0'}</Eq>은{" "}
        <strong style={{ color: C.accent }}>직선</strong>입니다.
        3차원이면 <strong style={{ color: C.accent }}>평면</strong>, 일반적인 <Eq>{'d'}</Eq>차원에서는{" "}
        <strong style={{ color: C.accent }}>초평면(hyperplane)</strong>이 됩니다.
        이 초평면이 공간을 양의 영역과 음의 영역으로 이등분하고,
        선형 분류기는 이 영역에 따라 +1 또는 -1을 출력합니다.
      </Answer>

      {revealed.q1 && (
        <>
          <Question number={2} revealed={revealed.q2} onReveal={() => reveal("q2")}>
            <Eq>{'ax_1 + bx_2 = 0'}</Eq>이라는 직선은 반드시 어떤 점을 지나야 합니다.
            이것이 분류기로서 문제가 되는 경우는 언제일까요?
          </Question>
          <Answer visible={revealed.q2}>
            이 직선은 반드시 <strong style={{ color: C.accent }}>원점</strong>을 지납니다.
            그런데 두 클래스를 나누는 최적의 경계가 원점을 지나지 않을 수 있습니다.
            이를 해결하기 위해 <strong style={{ color: C.text }}>편향(bias)</strong> 항 <Eq>{'b'}</Eq>를 도입하여{" "}
            <Eq>{'h(\\mathbf{x}) = \\text{sign}(\\mathbf{w}^T\\mathbf{x} + b)'}</Eq>로 확장합니다.
          </Answer>
        </>
      )}

      {revealed.q2 && (
        <Box color={C.blue} label="표기법 관례: 편향 흡수">
          입력 벡터에 항상 1인 좌표를 추가합니다:
          <MathBlock>{'\\mathbf{x} = \\begin{pmatrix} 1 \\\\ x_1 \\\\ x_2 \\end{pmatrix}, \\quad \\mathbf{w} = \\begin{pmatrix} w_0 \\\\ w_1 \\\\ w_2 \\end{pmatrix}'}</MathBlock>
          이렇게 하면 <Eq>{'\\mathbf{w}^T\\mathbf{x} = w_0 + w_1 x_1 + w_2 x_2'}</Eq>가 되어,{" "}
          <Eq>{'w_0'}</Eq>가 자연스럽게 bias 역할을 합니다.
          <Eq>{'h(\\mathbf{x}) = \\text{sign}(\\mathbf{w}^T\\mathbf{x})'}</Eq>라는{" "}
          <strong style={{ color: C.accent }}>깔끔한 형태 하나</strong>로 bias까지 포함한 선형 분류기를 표현할 수 있습니다.
        </Box>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Perceptron Learning Algorithm
   ═══════════════════════════════════════════════════════════════ */
function generateLinearData(seed, n) {
  const rng = mulberry32(seed);
  const trueW = [0.3, 0.7, -0.15];
  const points = [];
  let attempts = 0;
  while (points.length < n && attempts < n * 10) {
    attempts++;
    const x1 = rng() * 2 - 1;
    const x2 = rng() * 2 - 1;
    const val = trueW[0] + trueW[1] * x1 + trueW[2] * x2;
    if (Math.abs(val) < 0.12) continue;
    const y = val > 0 ? 1 : -1;
    points.push({ x1, x2, y, x: [1, x1, x2] });
  }
  return { points, trueW };
}

function runPLA(points) {
  let w = [0, 0, 0];
  const steps = [{ w: [...w], mis: null, message: "초기 가중치 w = (0, 0, 0)", ein: null }];
  for (let iter = 0; iter < 300; iter++) {
    let found = -1;
    for (let i = 0; i < points.length; i++) {
      if ((dot(w, points[i].x) > 0 ? 1 : -1) !== points[i].y) { found = i; break; }
    }
    if (found === -1) {
      steps.push({ w: [...w], mis: null, message: `수렴 완료! (${iter}회 업데이트)`, converged: true });
      break;
    }
    const p = points[found];
    const oldW = [...w];
    w = w.map((wi, j) => wi + p.y * p.x[j]);
    steps.push({ w: [...w], oldW, mis: found, message: `${found + 1}번 점 오분류 → w 업데이트`, yn: p.y });
  }
  return steps;
}

function PlotSVG({ points, w, oldW, misIdx, trueW, showTrue, size = 340 }) {
  const pad = 34;
  const ps = size - pad * 2;
  const toSvg = (x1, x2) => ({ sx: pad + ((x1 + 1.15) / 2.3) * ps, sy: pad + ((1.15 - x2) / 2.3) * ps });
  const getLine = (wv) => {
    if (!wv || (wv[1] === 0 && wv[2] === 0)) return null;
    const pts = [];
    const r = 1.2;
    if (Math.abs(wv[2]) > 1e-9) { for (const x1 of [-r, r]) { const x2 = -(wv[0] + wv[1] * x1) / wv[2]; if (x2 >= -r && x2 <= r) pts.push({ x1, x2 }); } }
    if (Math.abs(wv[1]) > 1e-9) { for (const x2 of [-r, r]) { const x1 = -(wv[0] + wv[2] * x2) / wv[1]; if (x1 >= -r && x1 <= r) pts.push({ x1, x2 }); } }
    const unique = [];
    for (const p of pts) { if (!unique.some(u => Math.abs(u.x1 - p.x1) < 0.001 && Math.abs(u.x2 - p.x2) < 0.001)) unique.push(p); }
    return unique.length >= 2 ? [unique[0], unique[unique.length - 1]] : null;
  };
  const curLine = getLine(w), oLine = oldW ? getLine(oldW) : null, tLine = showTrue ? getLine(trueW) : null;

  return (
    <svg width={size} height={size} style={{ background: "rgba(5,5,16,0.8)", borderRadius: 10 }}>
      {[-1, -0.5, 0, 0.5, 1].map(v => {
        const { sx, sy } = toSvg(v, v);
        const { sx: sx0 } = toSvg(-1.15, 0); const { sx: sx1 } = toSvg(1.15, 0);
        const { sy: sy0 } = toSvg(0, -1.15); const { sy: sy1 } = toSvg(0, 1.15);
        return (
          <g key={v}>
            <line x1={sx} y1={sy0} x2={sx} y2={sy1} stroke="rgba(255,255,255,0.06)" strokeWidth={v === 0 ? 1 : 0.5} />
            <line x1={sx0} y1={sy} x2={sx1} y2={sy} stroke="rgba(255,255,255,0.06)" strokeWidth={v === 0 ? 1 : 0.5} />
            {v !== 0 && <text x={sx} y={size - pad + 13} textAnchor="middle" fill={C.textMuted} fontSize={8}>{v}</text>}
          </g>
        );
      })}
      {tLine && (() => { const a = toSvg(tLine[0].x1, tLine[0].x2), b = toSvg(tLine[1].x1, tLine[1].x2); return <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={C.green} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.5} />; })()}
      {oLine && (() => { const a = toSvg(oLine[0].x1, oLine[0].x2), b = toSvg(oLine[1].x1, oLine[1].x2); return <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={C.accent} strokeWidth={1} opacity={0.15} />; })()}
      {curLine && (() => { const a = toSvg(curLine[0].x1, curLine[0].x2), b = toSvg(curLine[1].x1, curLine[1].x2); return <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={C.accent} strokeWidth={2} />; })()}
      {points.map((p, i) => {
        const { sx, sy } = toSvg(p.x1, p.x2);
        const isMis = i === misIdx;
        const color = p.y === 1 ? C.blue : C.red;
        return (
          <g key={i}>
            {isMis && <circle cx={sx} cy={sy} r={10} fill="none" stroke={C.yellow} strokeWidth={2.5} opacity={0.9} />}
            <circle cx={sx} cy={sy} r={4.5} fill={color} opacity={isMis ? 1 : 0.75} />
          </g>
        );
      })}
      <text x={size / 2} y={size - 4} textAnchor="middle" fill={C.textMuted} fontSize={10}>x₁</text>
      <text x={6} y={size / 2} textAnchor="middle" fill={C.textMuted} fontSize={10} transform={`rotate(-90,6,${size / 2})`}>x₂</text>
    </svg>
  );
}

function PerceptronSection() {
  const [revealed, setRevealed] = useState({});
  const reveal = (id) => setRevealed(p => ({ ...p, [id]: true }));
  const [seed, setSeed] = useState(42);
  const [numPoints, setNumPoints] = useState(24);
  const [data, setData] = useState(() => generateLinearData(42, 24));
  const [steps, setSteps] = useState(() => runPLA(generateLinearData(42, 24).points));
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [showTrue, setShowTrue] = useState(false);
  const intRef = useRef(null);

  const regen = useCallback(() => {
    const s = Math.floor(Math.random() * 10000);
    setSeed(s);
    const d = generateLinearData(s, numPoints);
    setData(d); setSteps(runPLA(d.points)); setCur(0); setPlaying(false);
  }, [numPoints]);

  const handleN = useCallback((n) => {
    setNumPoints(n);
    const d = generateLinearData(seed, n);
    setData(d); setSteps(runPLA(d.points)); setCur(0); setPlaying(false);
  }, [seed]);

  useEffect(() => {
    if (playing) {
      intRef.current = setInterval(() => {
        setCur(p => { if (p >= steps.length - 1) { setPlaying(false); return p; } return p + 1; });
      }, speed);
    }
    return () => clearInterval(intRef.current);
  }, [playing, speed, steps.length]);

  const step = steps[cur];
  const misCount = data.points.filter(p => (dot(step.w, p.x) > 0 ? 1 : -1) !== p.y).length;

  const Btn = ({ onClick, disabled, children, primary }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: primary ? C.accent : C.surface,
        color: primary ? C.bg : disabled ? C.textMuted : C.textDim,
        border: primary ? "none" : `1px solid ${C.border}`,
        borderRadius: 8, padding: "7px 14px", cursor: disabled ? "default" : "pointer",
        fontWeight: primary ? 700 : 500, fontSize: "0.85em", fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <SectionTitle subtitle="오분류를 하나씩 고쳐나가기">
        2. 퍼셉트론 학습 알고리즘 (PLA)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        좋은 <Eq>{'\\mathbf{w}'}</Eq>를 어떻게 찾을까요? 가장 단순한 전략은 이렇습니다.
        현재 <Eq>{'\\mathbf{w}'}</Eq>로 모든 데이터를 훑어보다가,{" "}
        <strong style={{ color: C.yellow }}>틀리게 분류된 점</strong>을 하나 발견하면
        그 점을 이용해서 <Eq>{'\\mathbf{w}'}</Eq>를 수정합니다.
      </p>

      <MathBlock>{'\\mathbf{w}(t+1) = \\mathbf{w}(t) + y_n\\mathbf{x}_n'}</MathBlock>

      <Question number={1} revealed={revealed.q3} onReveal={() => reveal("q3")}>
        이 업데이트가 왜 "맞는 방향"일까요?{" "}
        <Eq>{'y_n = +1'}</Eq>인 점이 잘못 분류되었다면{" "}
        <Eq>{'\\mathbf{w}^T\\mathbf{x}_n < 0'}</Eq>입니다. 업데이트 후{" "}
        <Eq>{'\\mathbf{w}(t+1)^T\\mathbf{x}_n'}</Eq>은 어떻게 변할까요?
      </Question>
      <Answer visible={revealed.q3}>
        <MathBlock>{'\\mathbf{w}(t+1)^T\\mathbf{x}_n = \\mathbf{w}(t)^T\\mathbf{x}_n + y_n\\|\\mathbf{x}_n\\|^2'}</MathBlock>
        <Eq>{'\\|\\mathbf{x}_n\\|^2 \\geq 0'}</Eq>이고 <Eq>{'y_n = +1'}</Eq>이므로,
        업데이트 후의 값은 반드시 <strong style={{ color: C.accent }}>증가</strong>합니다.
        즉, 양수 영역 쪽으로 밀어주는 것입니다.
        <Eq>{'y_n = -1'}</Eq>인 경우에도 대칭적으로,
        값이 감소하여 음수 영역 쪽으로 밀어줍니다.
      </Answer>

      {revealed.q3 && <>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1rem" }}>
        한 점에 대한 수정이 다른 점을 망가뜨릴 수 있지만,{" "}
        <strong style={{ color: C.text }}>데이터가 선형 분리 가능하면 PLA는 반드시 유한 번 안에 수렴합니다.</strong>{" "}
        아래에서 직접 확인해 보세요.
      </p>

      {/* ─── Interactive PLA ─── */}
      <div style={{
        background: C.surfaceAlt, borderRadius: 16, padding: "1.5rem",
        border: `1px solid ${C.border}`, margin: "2rem 0",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 16, fontSize: "1rem" }}>
          🔬 퍼셉트론 학습 시뮬레이션
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <PlotSVG points={data.points} w={step.w} oldW={step.oldW} misIdx={step.mis} trueW={data.trueW} showTrue={showTrue} />

          <div style={{ flex: 1, minWidth: 220 }}>
            {/* Status */}
            <div style={{
              background: C.surface, borderRadius: 10, padding: "12px 16px", marginBottom: 12,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.accent, fontFamily: "var(--font-mono)", fontSize: "0.9em" }}>단계 {cur}/{steps.length - 1}</span>
                <span style={{ color: misCount === 0 ? C.green : C.red, fontWeight: 600, fontSize: "0.9em" }}>
                  오분류: {misCount}/{data.points.length}
                </span>
              </div>
              <div style={{ color: step.converged ? C.green : C.yellow, fontSize: "0.85em" }}>{step.message}</div>
            </div>

            {/* Weights */}
            <div style={{
              background: C.surface, borderRadius: 10, padding: "10px 16px", marginBottom: 12,
              border: `1px solid ${C.border}`, fontFamily: "var(--font-mono)", fontSize: "0.85em",
            }}>
              {['w₀', 'w₁', 'w₂'].map((label, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                  <span style={{ color: C.textMuted }}>{label}</span>
                  <span style={{ color: C.accent }}>{step.w[i].toFixed(4)}</span>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              <Btn onClick={() => { setCur(0); setPlaying(false); }} disabled={cur === 0}>⏮</Btn>
              <Btn onClick={() => setCur(Math.max(0, cur - 1))} disabled={cur === 0}>◀</Btn>
              <Btn onClick={() => setPlaying(!playing)} primary>{playing ? "⏸" : "▶ 재생"}</Btn>
              <Btn onClick={() => setCur(Math.min(steps.length - 1, cur + 1))} disabled={cur >= steps.length - 1}>▶</Btn>
              <Btn onClick={regen}>🔄</Btn>
            </div>

            {/* Sliders */}
            <div style={{ fontSize: "0.8em", color: C.textMuted }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ minWidth: 52 }}>데이터 수</span>
                <input type="range" min={8} max={60} step={2} value={numPoints}
                  onChange={e => handleN(Number(e.target.value))} style={{ flex: 1, accentColor: C.accent }} />
                <span style={{ color: C.accent, fontFamily: "var(--font-mono)", minWidth: 20 }}>{numPoints}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ minWidth: 52 }}>속도</span>
                <input type="range" min={80} max={800} step={40} value={840 - speed}
                  onChange={e => setSpeed(840 - Number(e.target.value))} style={{ flex: 1, accentColor: C.accent }} />
                <span style={{ fontFamily: "var(--font-mono)", minWidth: 36 }}>{speed}ms</span>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginTop: 4 }}>
                <input type="checkbox" checked={showTrue} onChange={() => setShowTrue(!showTrue)} style={{ accentColor: C.green }} />
                <span>실제 경계 표시</span>
                {showTrue && <span style={{ width: 20, height: 2, background: C.green, display: "inline-block", opacity: 0.6 }} />}
              </label>
            </div>
          </div>
        </div>

        {step.converged && (
          <div style={{
            marginTop: 12, padding: "10px 16px", background: `${C.green}10`,
            border: `1px solid ${C.green}30`, borderRadius: 10, fontSize: "0.9em", color: C.green,
          }}>
            ✓ 모든 데이터가 올바르게 분류되어 수렴했습니다. "실제 경계"를 켜서 비교해 보세요.
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap", fontSize: "0.8em", color: C.textMuted }}>
        {[
          { c: C.blue, l: "+1 클래스", shape: "circle" },
          { c: C.red, l: "−1 클래스", shape: "circle" },
          { c: C.accent, l: "학습된 경계", shape: "line" },
          { c: C.yellow, l: "오분류 점", shape: "ring" },
        ].map(item => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {item.shape === "line"
              ? <div style={{ width: 14, height: 2, background: item.c, borderRadius: 1 }} />
              : item.shape === "ring"
              ? <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${item.c}` }} />
              : <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.c }} />}
            <span>{item.l}</span>
          </div>
        ))}
      </div>

      <Box color={C.orange} label="포켓 알고리즘 (Pocket Algorithm)">
        데이터가 선형 분리 <strong style={{ color: C.text }}>불가능</strong>하면 PLA는 영원히 수렴하지 않습니다.
        <strong style={{ color: C.orange }}> 포켓 알고리즘</strong>은 PLA를 돌리되,
        지금까지의 최소 <Eq>{'E_{\\text{in}}'}</Eq>을 달성한 <Eq>{'\\mathbf{w}'}</Eq>를 "주머니"에 기억해 둡니다.
        정해진 횟수만큼 반복한 뒤, 주머니 속의 <Eq>{'\\mathbf{w}'}</Eq>를 최종 답으로 내놓습니다.
      </Box>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Linear Regression
   ═══════════════════════════════════════════════════════════════ */
function LinearRegressionSection() {
  const [revealed, setRevealed] = useState({});
  const reveal = (id) => setRevealed(p => ({ ...p, [id]: true }));
  const [noise, setNoise] = useState(0.3);
  const [numPts, setNumPts] = useState(20);
  const [seed] = useState(77);

  // Generate 1D regression data
  const rng = mulberry32(seed);
  const trueSlope = 1.2, trueIntercept = -0.3;
  const regData = [];
  for (let i = 0; i < numPts; i++) {
    const x = rng() * 2 - 1;
    const y = trueIntercept + trueSlope * x + gaussianRandom(mulberry32(seed + i * 137)) * noise;
    regData.push({ x, y });
  }

  // Closed-form solution: w = (X^TX)^{-1}X^Ty
  const N = regData.length;
  let sX = 0, sY = 0, sXX = 0, sXY = 0;
  regData.forEach(p => { sX += p.x; sY += p.y; sXX += p.x * p.x; sXY += p.x * p.y; });
  const det = N * sXX - sX * sX;
  const fitW0 = det !== 0 ? (sXX * sY - sX * sXY) / det : 0;
  const fitW1 = det !== 0 ? (N * sXY - sX * sY) / det : 0;

  const ein = regData.reduce((s, p) => s + (fitW0 + fitW1 * p.x - p.y) ** 2, 0) / N;

  const svgW = 360, svgH = 260, pad = 36;

  return (
    <div>
      <SectionTitle subtitle="닫힌 형태의 해">
        3. 선형 회귀 (Linear Regression)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        퍼셉트론은 +1 또는 -1이라는 이산적 답을 내놓았지만, 많은 문제는{" "}
        <strong style={{ color: C.text }}>연속적인 실수값</strong>을 예측해야 합니다.
        선형 회귀는 sign 함수를 벗겨내고 <Eq>{'\\mathbf{w}^T\\mathbf{x}'}</Eq> 자체를 출력으로 사용합니다.
      </p>

      <MathBlock>{'h(\\mathbf{x}) = \\mathbf{w}^T\\mathbf{x}'}</MathBlock>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        "가깝다"를 <strong style={{ color: C.purple }}>제곱 오차</strong>로 측정하고,
        모든 데이터를 행렬로 쌓으면 다음과 같이 쓸 수 있습니다.
      </p>

      <MathBlock>{'E_{\\text{in}}(\\mathbf{w}) = \\frac{1}{N}\\|X\\mathbf{w} - \\mathbf{y}\\|^2'}</MathBlock>

      <Question number={1} revealed={revealed.q4} onReveal={() => reveal("q4")}>
        <Eq>{'X'}</Eq>가 <Eq>{'N \\times (d+1)'}</Eq> 행렬이고 보통 <Eq>{'N \\gg d+1'}</Eq>입니다.
        <Eq>{'X\\mathbf{w} = \\mathbf{y}'}</Eq>라는 연립방정식은 어떤 상태가 되나요?
      </Question>
      <Answer visible={revealed.q4}>
        방정식의 수(<Eq>{'N'}</Eq>)가 미지수의 수(<Eq>{'d+1'}</Eq>)보다 많으므로{" "}
        <strong style={{ color: C.accent }}>과결정(overdetermined)</strong> 시스템입니다.
        일반적으로 정확한 해가 존재하지 않으므로, 오차를 <strong style={{ color: C.text }}>최소화</strong>하는
        <Eq>{'\\mathbf{w}'}</Eq>를 구해야 합니다.
      </Answer>

      {revealed.q4 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
            <Eq>{'E_{\\text{in}}'}</Eq>을 <Eq>{'\\mathbf{w}'}</Eq>에 대해 미분하여 0으로 놓으면{" "}
            <strong style={{ color: C.purple }}>정규방정식(normal equation)</strong>을 얻습니다.
          </p>

          <MathBlock>{'X^TX\\mathbf{w} = X^T\\mathbf{y}'}</MathBlock>

          <Question number={2} revealed={revealed.q5} onReveal={() => reveal("q5")}>
            <Eq>{'X'}</Eq>가 <Eq>{'N \\times (d+1)'}</Eq>이면 <Eq>{'X^TX'}</Eq>는 어떤 크기인가요?
            원래의 과결정 시스템과 비교하면 어떻게 바뀌었나요?
          </Question>
          <Answer visible={revealed.q5}>
            <Eq>{'X^TX'}</Eq>는 <Eq>{'(d+1) \\times (d+1)'}</Eq> 정방 행렬입니다.
            원래 <Eq>{'N'}</Eq>개의 방정식이 <Eq>{'d+1'}</Eq>개로 "압축"되어{" "}
            방정식과 미지수의 수가 같아졌습니다.
            <Eq>{'X^TX'}</Eq>가 역행렬을 가지면 해가 유일하게 결정됩니다:
            <MathBlock>{'\\mathbf{w}_{\\text{lin}} = (X^TX)^{-1}X^T\\mathbf{y}'}</MathBlock>
            여기서 <Eq>{'(X^TX)^{-1}X^T'}</Eq>를{" "}
            <strong style={{ color: C.accent }}>의사역행렬(pseudo-inverse)</strong>이라 하며{" "}
            <Eq>{'X^\\dagger'}</Eq>로 표기합니다.
          </Answer>
        </>
      )}

      {revealed.q5 && <>
      {/* ─── Interactive 1D Regression ─── */}
      <div style={{
        background: C.surfaceAlt, borderRadius: 16, padding: "1.5rem",
        border: `1px solid ${C.border}`, margin: "2rem 0",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 16, fontSize: "1rem" }}>
          📈 선형 회귀: 1차원 피팅
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <svg width={svgW} height={svgH} style={{ background: "rgba(5,5,16,0.8)", borderRadius: 10 }}>
            {/* Grid */}
            {[-1, -0.5, 0, 0.5, 1].map(v => {
              const sx = pad + ((v + 1.1) / 2.2) * (svgW - pad * 2);
              return <line key={`gx${v}`} x1={sx} y1={pad} x2={sx} y2={svgH - pad} stroke="rgba(255,255,255,0.05)" strokeWidth={v === 0 ? 0.8 : 0.4} />;
            })}
            {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map(v => {
              const sy = pad + ((1.8 - v) / 3.6) * (svgH - pad * 2);
              if (sy < pad || sy > svgH - pad) return null;
              return <line key={`gy${v}`} x1={pad} y1={sy} x2={svgW - pad} y2={sy} stroke="rgba(255,255,255,0.05)" strokeWidth={v === 0 ? 0.8 : 0.4} />;
            })}

            {/* True line */}
            {(() => {
              const x2sx = x => pad + ((x + 1.1) / 2.2) * (svgW - pad * 2);
              const y2sy = y => pad + ((1.8 - y) / 3.6) * (svgH - pad * 2);
              return (
                <>
                  <line x1={x2sx(-1.1)} y1={y2sy(trueIntercept + trueSlope * -1.1)} x2={x2sx(1.1)} y2={y2sy(trueIntercept + trueSlope * 1.1)} stroke={C.green} strokeWidth={1.2} strokeDasharray="5,4" opacity={0.5} />
                  <line x1={x2sx(-1.1)} y1={y2sy(fitW0 + fitW1 * -1.1)} x2={x2sx(1.1)} y2={y2sy(fitW0 + fitW1 * 1.1)} stroke={C.accent} strokeWidth={2} />
                </>
              );
            })()}

            {/* Data points + residuals */}
            {regData.map((p, i) => {
              const sx = pad + ((p.x + 1.1) / 2.2) * (svgW - pad * 2);
              const sy = pad + ((1.8 - p.y) / 3.6) * (svgH - pad * 2);
              const predY = fitW0 + fitW1 * p.x;
              const predSy = pad + ((1.8 - predY) / 3.6) * (svgH - pad * 2);
              return (
                <g key={i}>
                  <line x1={sx} y1={sy} x2={sx} y2={predSy} stroke={C.red} strokeWidth={1} opacity={0.3} />
                  <circle cx={sx} cy={sy} r={4} fill={C.blue} opacity={0.8} />
                </g>
              );
            })}

            <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={C.textMuted} fontSize={10}>x</text>
            <text x={8} y={svgH / 2} textAnchor="middle" fill={C.textMuted} fontSize={10} transform={`rotate(-90,8,${svgH / 2})`}>y</text>
          </svg>
        </div>

        {/* Controls + info */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: "0.8em", color: C.textMuted }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>노이즈 σ</span>
            <input type="range" min={0} max={0.8} step={0.05} value={noise}
              onChange={e => setNoise(Number(e.target.value))} style={{ width: 80, accentColor: C.accent }} />
            <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>{noise.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>데이터 수</span>
            <input type="range" min={6} max={60} step={2} value={numPts}
              onChange={e => setNumPts(Number(e.target.value))} style={{ width: 80, accentColor: C.accent }} />
            <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>{numPts}</span>
          </div>
        </div>

        <div style={{
          display: "flex", gap: 16, justifyContent: "center", marginTop: 12, fontSize: "0.8em", color: C.textMuted, flexWrap: "wrap",
        }}>
          <span>학습된 가중치: <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>w₀={fitW0.toFixed(3)}, w₁={fitW1.toFixed(3)}</span></span>
          <span>E_in: <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>{ein.toFixed(4)}</span></span>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 10, fontSize: "0.75em", color: C.textMuted }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 2, background: C.accent }} /> 학습된 직선
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 2, background: C.green, opacity: 0.5, borderTop: "1px dashed transparent" }} /> 실제 함수
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 1, background: C.red, opacity: 0.5 }} /> 잔차
          </div>
        </div>
      </div>

      <Box color={C.purple} label="핵심 비교: 퍼셉트론 vs 선형 회귀">
        <strong style={{ color: C.green }}>퍼셉트론</strong>은 오분류된 점을 하나씩 반복적으로 수정하며, 수렴까지 몇 번이 걸릴지 미리 알 수 없습니다.
        <br /><br />
        <strong style={{ color: C.purple }}>선형 회귀</strong>는{" "}
        <Eq>{'\\mathbf{w}_{\\text{lin}} = (X^TX)^{-1}X^T\\mathbf{y}'}</Eq>{" "}
        한 줄로 끝납니다. 반복도 없고, 수렴 걱정도 없습니다.
        놀랍게도, 선형 회귀의 가중치에 sign을 씌우면 분류에도 사용할 수 있으며,
        퍼셉트론이나 포켓 알고리즘의 좋은 초기값이 됩니다.
      </Box>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. Gradient Descent
   ═══════════════════════════════════════════════════════════════ */
function GradientDescentSection() {
  const [revealed, setRevealed] = useState({});
  const reveal = (id) => setRevealed(p => ({ ...p, [id]: true }));
  const [eta, setEta] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [gdSteps, setGdSteps] = useState([{ x: 2.5, fx: null }]);
  const intRef = useRef(null);

  // 1D function: f(x) = x^2 + 0.5*sin(3x) (has clear global min near 0)
  const f = x => x * x + 0.5 * Math.sin(3 * x);
  const df = x => 2 * x + 1.5 * Math.cos(3 * x);

  const reset = useCallback(() => {
    setGdSteps([{ x: 2.5, fx: f(2.5) }]);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (running) {
      intRef.current = setInterval(() => {
        setGdSteps(prev => {
          const last = prev[prev.length - 1];
          const newX = last.x - eta * df(last.x);
          if (prev.length > 80 || Math.abs(newX) > 10) { setRunning(false); return prev; }
          return [...prev, { x: newX, fx: f(newX) }];
        });
      }, 120);
    }
    return () => clearInterval(intRef.current);
  }, [running, eta]);

  const svgW = 380, svgH = 220, pad = 36;
  const xRange = [-3, 3.5], yRange = [-0.8, 8];
  const x2sx = x => pad + ((x - xRange[0]) / (xRange[1] - xRange[0])) * (svgW - pad * 2);
  const y2sy = y => pad + ((yRange[1] - y) / (yRange[1] - yRange[0])) * (svgH - pad * 2);

  // Function curve points
  const curvePts = [];
  for (let x = xRange[0]; x <= xRange[1]; x += 0.05) {
    curvePts.push({ x, y: f(x) });
  }
  const curvePath = curvePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x2sx(p.x)},${y2sy(p.y)}`).join(' ');

  const lastStep = gdSteps[gdSteps.length - 1];

  return (
    <div>
      <SectionTitle subtitle="산에서 내려오기">
        4. 경사하강법 (Gradient Descent)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        선형 회귀의 닫힌 형태 해는 <Eq>{'X^TX'}</Eq>의 역행렬이 필요합니다. {" "}
        <Eq>{'d'}</Eq>가 수만, 수십만이면 이 계산이 비현실적이 됩니다.
        대안은 <strong style={{ color: C.orange }}>최적해를 한 번에 구하는 대신, 좋은 방향으로 조금씩 이동</strong>하는 것입니다.
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        안개 속의 산에서 내려오는 상황을 떠올려 보세요.
        전체 지형을 볼 수 없고, 할 수 있는 것은 <strong style={{ color: C.text }}>발밑의 경사를 느끼는 것</strong>뿐입니다.
        가장 가파르게 내려가는 방향, 즉 그래디언트의 <strong style={{ color: C.accent }}>반대 방향</strong>으로 한 걸음 내딛습니다.
      </p>

      <MathBlock>{'\\mathbf{w}(t+1) = \\mathbf{w}(t) - \\eta \\, \\nabla E_{\\text{in}}(\\mathbf{w}(t))'}</MathBlock>

      <Question number={1} revealed={revealed.q6} onReveal={() => reveal("q6")}>
        학습률 <Eq>{'\\eta'}</Eq>가 너무 크거나 너무 작으면 어떤 일이 벌어질까요?
      </Question>
      <Answer visible={revealed.q6}>
        <Eq>{'\\eta'}</Eq>가 <strong style={{ color: C.red }}>너무 크면</strong> 최솟값을 뛰어넘어 반대편으로 가고,
        진동하다가 오히려 발산합니다.{" "}
        <Eq>{'\\eta'}</Eq>가 <strong style={{ color: C.yellow }}>너무 작으면</strong> 수렴은 하겠지만
        실용적인 시간 안에 도달하지 못합니다.{" "}
        아래 시뮬레이션에서 <Eq>{'\\eta'}</Eq>를 극단적으로 바꿔보며 확인해 보세요.
      </Answer>

      {revealed.q6 && <>
      {/* ─── Interactive GD ─── */}
      <div style={{
        background: C.surfaceAlt, borderRadius: 16, padding: "1.5rem",
        border: `1px solid ${C.border}`, margin: "2rem 0",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 16, fontSize: "1rem" }}>
          🏔️ 경사하강법 시뮬레이션
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <svg width={svgW} height={svgH} style={{ background: "rgba(5,5,16,0.8)", borderRadius: 10 }}>
            {/* Curve */}
            <path d={curvePath} fill="none" stroke={C.textMuted} strokeWidth={1.5} opacity={0.5} />

            {/* GD path */}
            {gdSteps.map((s, i) => {
              const sx = x2sx(s.x), sy = y2sy(f(s.x));
              const isLast = i === gdSteps.length - 1;
              return (
                <g key={i}>
                  {i > 0 && (() => {
                    const prev = gdSteps[i - 1];
                    return <line x1={x2sx(prev.x)} y1={y2sy(f(prev.x))} x2={sx} y2={sy}
                      stroke={C.orange} strokeWidth={1} opacity={0.4} />;
                  })()}
                  <circle cx={sx} cy={sy} r={isLast ? 5 : 2.5} fill={isLast ? C.orange : C.accent} opacity={isLast ? 1 : 0.5} />
                </g>
              );
            })}

            <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={C.textMuted} fontSize={10}>w</text>
            <text x={10} y={svgH / 2} textAnchor="middle" fill={C.textMuted} fontSize={10} transform={`rotate(-90,10,${svgH / 2})`}>E(w)</text>
          </svg>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
          <button onClick={() => { setRunning(!running); }} style={{
            background: running ? `${C.orange}20` : C.accent, color: running ? C.orange : C.bg,
            border: running ? `1px solid ${C.orange}` : "none",
            borderRadius: 8, padding: "7px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85em", fontFamily: "inherit",
          }}>
            {running ? "⏸ 일시정지" : "▶ 시작"}
          </button>
          <button onClick={reset} style={{
            background: C.surface, color: C.textDim, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.85em", fontFamily: "inherit",
          }}>
            🔄 초기화
          </button>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: "0.8em", color: C.textMuted }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>학습률 η</span>
            <input type="range" min={0.01} max={0.5} step={0.01} value={eta}
              onChange={e => { setEta(Number(e.target.value)); reset(); }}
              style={{ width: 100, accentColor: C.orange }} />
            <span style={{ color: C.orange, fontFamily: "var(--font-mono)" }}>{eta.toFixed(2)}</span>
          </div>
          <span>단계: <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>{gdSteps.length - 1}</span></span>
          <span>현재 w: <span style={{ color: C.accent, fontFamily: "var(--font-mono)" }}>{lastStep.x.toFixed(3)}</span></span>
        </div>
      </div>

      <Box color={C.orange} label="확률적 경사하강법 (SGD)">
        배치 경사하강법은 매 스텝마다 <Eq>{'N'}</Eq>개의 데이터 <strong style={{ color: C.text }}>전체</strong>를 사용합니다.{" "}
        <Eq>{'N'}</Eq>이 백만이면 한 걸음에 백만 개를 살펴봐야 합니다.
        <br /><br />
        <strong style={{ color: C.orange }}>SGD</strong>는 무작위로{" "}
        <strong style={{ color: C.text }}>한 점</strong>만 골라서 그래디언트를 추정합니다.
        방향이 부정확하지만 계산 비용이 <Eq>{'N'}</Eq>분의 1로 줄어들고,
        평균적으로는 배치 그래디언트와 같은 방향을 가리킵니다.
        <MathBlock>{'\\mathbf{w}(t+1) = \\mathbf{w}(t) - \\eta \\cdot 2(\\mathbf{w}^T\\mathbf{x}_n - y_n)\\mathbf{x}_n'}</MathBlock>
        흥미롭게도, 퍼셉트론의 업데이트{" "}
        <Eq>{'\\mathbf{w}(t+1) = \\mathbf{w}(t) + y_n\\mathbf{x}_n'}</Eq>도
        특정 오차 함수에 대한 SGD로 해석할 수 있습니다.{" "}
        <strong style={{ color: C.accent }}>세 가지 알고리즘이 하나의 프레임워크 안에서 연결됩니다.</strong>
      </Box>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. Feature Transformation
   ═══════════════════════════════════════════════════════════════ */
function FeatureTransformSection() {
  const [revealed, setRevealed] = useState({});
  const reveal = (id) => setRevealed(p => ({ ...p, [id]: true }));
  const [degree, setDegree] = useState(1);
  const [noiseLv, setNoiseLv] = useState(0.25);
  const [showTrue, setShowTrue] = useState(true);

  // Generate 1D regression data for polynomial fitting
  const seed = 99;
  const nPts = 20;
  const rng = mulberry32(seed);
  const trueF = x => 0.5 * Math.sin(Math.PI * x * 1.5) + 0.3 * x;
  const dataF = [];
  for (let i = 0; i < nPts; i++) {
    const x = rng() * 2 - 1;
    const y = trueF(x) + gaussianRandom(mulberry32(seed + i * 31)) * noiseLv;
    dataF.push({ x, y });
  }

  // Polynomial regression via normal equation
  function polyFit(data, deg) {
    const n = data.length;
    const d = deg + 1;
    // Build X matrix
    const X = data.map(p => {
      const row = [];
      for (let j = 0; j < d; j++) row.push(Math.pow(p.x, j));
      return row;
    });
    // X^T X
    const XtX = Array.from({ length: d }, (_, i) =>
      Array.from({ length: d }, (_, j) =>
        X.reduce((s, row) => s + row[i] * row[j], 0)
      )
    );
    // X^T y
    const Xty = Array.from({ length: d }, (_, i) =>
      X.reduce((s, row, k) => s + row[i] * data[k].y, 0)
    );
    // Solve via simple Gaussian elimination
    const A = XtX.map((row, i) => [...row, Xty[i]]);
    for (let col = 0; col < d; col++) {
      let maxRow = col;
      for (let row = col + 1; row < d; row++) {
        if (Math.abs(A[row][col]) > Math.abs(A[maxRow][col])) maxRow = row;
      }
      [A[col], A[maxRow]] = [A[maxRow], A[col]];
      if (Math.abs(A[col][col]) < 1e-12) continue;
      for (let row = col + 1; row < d; row++) {
        const f = A[row][col] / A[col][col];
        for (let j = col; j <= d; j++) A[row][j] -= f * A[col][j];
      }
    }
    const w = new Array(d).fill(0);
    for (let i = d - 1; i >= 0; i--) {
      let sum = A[i][d];
      for (let j = i + 1; j < d; j++) sum -= A[i][j] * w[j];
      w[i] = Math.abs(A[i][i]) > 1e-12 ? sum / A[i][i] : 0;
    }
    return w;
  }

  const polyW = polyFit(dataF, degree);
  const evalPoly = (x, w) => w.reduce((s, wi, i) => s + wi * Math.pow(x, i), 0);

  const ein = dataF.reduce((s, p) => s + (evalPoly(p.x, polyW) - p.y) ** 2, 0) / dataF.length;

  const svgW = 380, svgH = 240, pad = 36;
  const xR = [-1.1, 1.1], yR = [-1.2, 1.5];
  const x2sx = x => pad + ((x - xR[0]) / (xR[1] - xR[0])) * (svgW - pad * 2);
  const y2sy = y => pad + ((yR[1] - y) / (yR[1] - yR[0])) * (svgH - pad * 2);

  // Curve points
  const fitPts = [], truePts = [];
  for (let x = -1.1; x <= 1.1; x += 0.02) {
    const fy = evalPoly(x, polyW);
    if (Math.abs(fy) < 10) fitPts.push({ x, y: fy });
    truePts.push({ x, y: trueF(x) });
  }
  const fitPath = fitPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x2sx(p.x)},${y2sy(p.y)}`).join(' ');
  const truePath = truePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x2sx(p.x)},${y2sy(p.y)}`).join(' ');

  const degreeColors = { 1: C.blue, 2: C.green, 3: C.purple, 5: C.orange, 8: C.red, 12: C.red, 15: C.red };
  const curColor = degreeColors[degree] || C.accent;

  return (
    <div>
      <SectionTitle subtitle="선형 모델의 한계를 돌파하다">
        5. 특성 변환 (Feature Transformation)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        선형 모델의 결정 경계는 반드시 직선(초평면)이어야 합니다.
        하지만 현실의 많은 문제는 직선으로 분리할 수 없죠.
        해결책은 간단하면서도 강력합니다: <strong style={{ color: C.yellow }}>입력을 변환된 공간으로 보내고,
        그 공간에서 선형 모델을 적용</strong>하는 것입니다.
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        예를 들어, 2차원 입력 <Eq>{'(x_1, x_2)'}</Eq>에 2차 다항식 변환을 적용하면:
      </p>

      <MathBlock>{'\\Phi(\\mathbf{x}) = (1, \\; x_1, \\; x_2, \\; x_1^2, \\; x_1 x_2, \\; x_2^2)'}</MathBlock>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        원래 3개의 가중치로 직선만 표현할 수 있었는데, 변환 후에는 6개의 가중치로 타원, 포물선, 쌍곡선 등
        훨씬 풍부한 결정 경계를 만들 수 있습니다. 핵심은,{" "}
        <strong style={{ color: C.accent }}>변환된 공간에서 보면 여전히 선형</strong>이므로
        앞서 배운 모든 알고리즘을 그대로 사용할 수 있다는 것입니다.
      </p>

      <Question number={1} revealed={revealed.q7} onReveal={() => reveal("q7")}>
        다항식 변환의 차수를 계속 높이면 <Eq>{'E_{\\text{in}}'}</Eq>을 더 줄일 수 있습니다.
        하지만 <GradLink href="/blog/ml-1-2">이전 글</GradLink>에서 배운 VC 차원과 일반화 경계를 떠올리면, 이 전략에는 어떤 위험이 있을까요?
      </Question>
      <Answer visible={revealed.q7}>
        차수가 높아지면 가설 공간의 <strong style={{ color: C.accent }}>VC 차원이 커집니다.</strong>{" "}
        VC 일반화 경계를 떠올리면:
        <MathBlock>{'E_{\\text{out}} \\leq E_{\\text{in}} + O\\left(\\sqrt{\\frac{d_{\\text{VC}}}{N} \\ln \\frac{N}{d_{\\text{VC}}}}\\right)'}</MathBlock>
        <Eq>{'E_{\\text{in}}'}</Eq>은 줄어들지만 페널티 항이 커져서,
        훈련 데이터에는 잘 맞추지만 새로운 데이터에서 성능이 나빠지는{" "}
        <strong style={{ color: C.red }}>과적합(overfitting)</strong>이 발생합니다.
        아래 시뮬레이션에서 차수를 12 이상으로 올려보면 이 현상을 직접 관찰할 수 있습니다.
      </Answer>

      {revealed.q7 && <>
      {/* ─── Interactive Polynomial Fitting ─── */}
      <div style={{
        background: C.surfaceAlt, borderRadius: 16, padding: "1.5rem",
        border: `1px solid ${C.border}`, margin: "2rem 0",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 16, fontSize: "1rem" }}>
          📐 다항식 특성 변환: 차수에 따른 피팅
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <svg width={svgW} height={svgH} style={{ background: "rgba(5,5,16,0.8)", borderRadius: 10 }}>
            {showTrue && <path d={truePath} fill="none" stroke={C.green} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5} />}
            <path d={fitPath} fill="none" stroke={curColor} strokeWidth={2} />
            {dataF.map((p, i) => (
              <circle key={i} cx={x2sx(p.x)} cy={y2sy(p.y)} r={4} fill={C.blue} opacity={0.8} />
            ))}
            <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={C.textMuted} fontSize={10}>x</text>
          </svg>
        </div>

        {/* Degree selector */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
          {[1, 2, 3, 5, 8, 12, 15].map(d => (
            <button
              key={d}
              onClick={() => setDegree(d)}
              style={{
                padding: "6px 14px",
                background: degree === d ? `${degreeColors[d] || C.accent}25` : C.surface,
                border: `1.5px solid ${degree === d ? (degreeColors[d] || C.accent) : C.border}`,
                borderRadius: 8,
                color: degree === d ? (degreeColors[d] || C.accent) : C.textMuted,
                fontWeight: degree === d ? 700 : 500,
                cursor: "pointer",
                fontSize: "0.85em",
                fontFamily: "inherit",
              }}
            >
              {d}차
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: "0.8em", color: C.textMuted }}>
          <span>파라미터 수: <span style={{ color: curColor, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{degree + 1}</span></span>
          <span>E_in: <span style={{ color: ein < 0.01 ? C.red : C.accent, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{ein.toFixed(4)}</span></span>
          <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <input type="checkbox" checked={showTrue} onChange={() => setShowTrue(!showTrue)} style={{ accentColor: C.green }} />
            실제 함수
          </label>
        </div>

        {degree >= 8 && (
          <div style={{
            marginTop: 12, padding: "10px 16px", background: `${C.red}10`,
            border: `1px solid ${C.red}30`, borderRadius: 10, fontSize: "0.85em", color: C.red,
          }}>
            ⚠ 차수가 높아 데이터 포인트 사이에서 격렬하게 진동합니다 — 전형적인 과적합입니다.
            E_in은 작지만 E_out은 클 것입니다.
          </div>
        )}
      </div>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. Summary
   ═══════════════════════════════════════════════════════════════ */
function Summary() {
  return (
    <div>
      <SectionTitle subtitle="전체 흐름 정리">
        요약: 선형 모델의 세계
      </SectionTitle>

      <div style={{
        background: C.surfaceAlt, borderRadius: 16, padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            {
              title: "선형 분류기의 기하학",
              desc: "sign(wᵀx) — 초평면으로 공간을 이등분",
              color: C.accent,
              detail: "bias를 w₀로 흡수하여 표기를 통일",
            },
            {
              title: "퍼셉트론 (PLA)",
              desc: "오분류 점을 하나씩 수정하는 반복적 학습",
              color: C.green,
              detail: "선형 분리 가능 시 유한 번에 수렴 보장",
            },
            {
              title: "선형 회귀",
              desc: "w = (XᵀX)⁻¹Xᵀy — 닫힌 형태의 최적해",
              color: C.purple,
              detail: "정규방정식으로 한 번에 해결, 분류에도 활용 가능",
            },
            {
              title: "경사하강법",
              desc: "w(t+1) = w(t) − η∇E — 기울기를 따라 하강",
              color: C.orange,
              detail: "SGD로 대규모 데이터 처리, 퍼셉트론과의 연결",
            },
            {
              title: "특성 변환",
              desc: "Φ(x) → 비선형 경계를 선형으로 변환",
              color: C.yellow,
              detail: "표현력 증가 ↔ VC 차원 증가의 트레이드오프",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.surface,
                borderRadius: 12,
                borderLeft: `4px solid ${item.color}`,
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: item.color, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: C.textDim, fontSize: "0.85em" }}>{item.desc}</div>
              </div>
              <div style={{ color: C.textMuted, fontSize: "0.9em" }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <Box color={C.accent} label="핵심 메시지">
        <strong style={{ color: C.text, fontSize: "1.1em" }}>
          선형 모델은 단순하지만, 특성 변환을 통해 비선형 문제까지 다룰 수 있는 강력한 프레임워크입니다.
        </strong>
        <br /><br />
        퍼셉트론, 선형 회귀, 경사하강법은 별개가 아니라 하나의 흐름 안에서 연결됩니다.
        그리고 표현력을 높일수록 VC 차원이 커져 과적합 위험이 증가한다는 것 —
        이것이 다음 섹션에서 다룰 <strong style={{ color: C.yellow }}>정규화(regularization)</strong>의 동기가 됩니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function LinearModelsBlog() {
  return (
    <div
      style={{
        color: C.text,
        fontFamily: "var(--font-sans)",
        lineHeight: 1.7,
      }}
    >
      <style>{`
        input[type="range"] {
          height: 6px;
          border-radius: 3px;
          background: ${C.surface};
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${C.accent};
          cursor: pointer;
          box-shadow: 0 0 10px ${C.accent}80;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${C.accent};
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px ${C.accent}80;
        }
        ::selection { background: ${C.accent}40; }
      `}</style>

      <article>
        <section style={{ marginBottom: "5rem" }}>
          <Introduction />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <LinearClassifierGeometry />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <PerceptronSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <LinearRegressionSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <GradientDescentSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <FeatureTransformSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <Summary />
        </section>
      </article>
    </div>
  );
}
