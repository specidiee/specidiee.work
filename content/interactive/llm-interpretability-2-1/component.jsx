'use client';

import { useState, useCallback } from "react";
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

/* ─── Gradient Link ─── */
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
        생각해보기...
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

/* ─── Math Components ─── */
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

const Eq = ({ children }) => <InlineMath math={children} />;

/* ─── Interactive panel wrapper ─── */
const Panel = ({ children, label }) => (
  <div style={{
    background: C.surfaceAlt,
    borderRadius: 16,
    padding: "1.5rem",
    border: `1px solid ${C.border}`,
    margin: "2rem 0",
  }}>
    {label && (
      <div style={{
        fontSize: "0.75em",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: C.accent,
        marginBottom: 12,
      }}>
        {label}
      </div>
    )}
    {children}
  </div>
);

/* ─── Btn ─── */
const Btn = ({ children, onClick, active, color = C.accent, style: sx }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      background: active ? `${color}30` : `${color}10`,
      border: `1px solid ${active ? color : `${color}40`}`,
      borderRadius: 8,
      color: active ? color : C.textDim,
      fontSize: "0.85em",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      ...sx,
    }}
  >
    {children}
  </button>
);

/* ─── P (paragraph shorthand) ─── */
const P = ({ children }) => (
  <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1rem" }}>{children}</p>
);


/* ══════════════════════════════════════════════════════
   SECTION 0 — Introduction
   ══════════════════════════════════════════════════════ */

function Introduction() {
  const roadmap = [
    { label: "FFN의 수식 구조", color: C.blue },
    { label: "Key-Value Memory 대응", color: C.accent, highlight: true },
    { label: "Attention K-V와의 비교", color: C.purple },
    { label: "FFN이 실제로 저장하는 것", color: C.green },
    { label: "ROME으로의 연결", color: C.orange },
  ];

  return (
    <>
      <SectionTitle subtitle="Week 1에서 남은 질문">0. Introduction</SectionTitle>

      <P>
        <GradLink href="/blog/llm-interpretability-1-1">이전 글</GradLink>에서 Transformer의 구조를 따라갔습니다.
        Self-Attention이 토큰 간 정보를 교환하는 메커니즘이라는 것, Residual Stream이 정보의 공유 버스라는 것을 확인했습니다.
      </P>

      <P>
        그런데 Transformer 블록에는 Attention 말고도 또 하나의 핵심 구성요소가 있습니다 —{" "}
        <strong style={{ color: C.accent }}>FFN(Feed-Forward Network)</strong>.
        FFN은 Residual Stream에서 어떤 역할을 하고 있을까요?
      </P>

      <P>
        Geva et al.의 논문 <em>"Transformer Feed-Forward Layers Are Key-Value Memories"</em> (EMNLP 2021)은
        이 질문에 대한 놀라운 답을 제시합니다. FFN이 단순한 비선형 변환이 아니라,{" "}
        <strong style={{ color: C.green }}>사실적 지식을 저장하는 키-값 메모리</strong>라는 것입니다.
      </P>

      <Box label="이 글의 여정" color={C.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {roadmap.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: item.color, flexShrink: 0,
                boxShadow: item.highlight ? `0 0 8px ${item.color}` : "none",
              }} />
              <span style={{
                color: item.highlight ? item.color : C.textDim,
                fontWeight: item.highlight ? 700 : 400,
              }}>
                {i + 1}. {item.label}
              </span>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 1 — FFN의 수식 구조
   ══════════════════════════════════════════════════════ */

function FFNStructureSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [dModel, setDModel] = useState(768);
  const dFF = dModel * 4;

  const dModelOptions = [256, 512, 768];

  return (
    <>
      <SectionTitle subtitle="차원(shape)까지 정확히 이해하기">1. FFN의 수식 구조</SectionTitle>

      <P>
        Transformer 블록 안에서 Attention 이후에 실행되는 FFN은 다음과 같은 수식을 따릅니다:
      </P>

      <MathBlock>{'\\text{FFN}(x) = W_2 \\cdot \\text{ReLU}(W_1 x + b_1) + b_2'}</MathBlock>

      <P>
        각 구성요소의 shape을 살펴봅시다:
      </P>

      <Box label="차원 정리" color={C.blue}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: C.textDim }}>
            입력 <Eq>{'x \\in \\mathbb{R}^{d_{model}}'}</Eq> (예: 768)
          </span>
          <span style={{ color: C.textDim }}>
            <Eq>{'W_1 \\in \\mathbb{R}^{d_{ff} \\times d_{model}}'}</Eq> (예: 3072 × 768) — <strong style={{ color: C.blue }}>차원 확장</strong>
          </span>
          <span style={{ color: C.textDim }}>
            ReLU 적용 → 음수를 0으로
          </span>
          <span style={{ color: C.textDim }}>
            <Eq>{'W_2 \\in \\mathbb{R}^{d_{model} \\times d_{ff}}'}</Eq> (예: 768 × 3072) — <strong style={{ color: C.blue }}>차원 축소</strong>
          </span>
          <span style={{ color: C.textDim }}>
            출력: 다시 <Eq>{'\\mathbb{R}^{d_{model}}'}</Eq> → Residual Stream에 더해짐
          </span>
        </div>
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        <Eq>{'W_1 x'}</Eq>를 계산할 때, <Eq>{'W_1'}</Eq>의 각 <strong style={{ color: C.accent }}>행(row) 벡터</strong>는
        입력 <Eq>{'x'}</Eq>와 어떤 연산을 수행하게 될까요?
      </Question>

      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>내적(dot product)</strong>입니다.{" "}
        <Eq>{'W_1'}</Eq>의 i번째 행과 <Eq>{'x'}</Eq>의 내적이 출력 벡터의 i번째 원소가 됩니다.
        <MathBlock>{'(W_1 x)_i = w_i^{(1)} \\cdot x'}</MathBlock>
        즉, <Eq>{'W_1'}</Eq>의 각 행은 입력 벡터와의 <strong style={{ color: C.accent }}>유사도</strong>를 측정하는 것입니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            ReLU를 거치면 {dFF}개의 내적값 중 일부만 살아남습니다. 이것은 직관적으로 무엇을 의미할까요?
          </Question>

          <Answer visible={q2}>
            {dFF}개의 행 벡터가 각각 하나의 <strong style={{ color: C.accent }}>'패턴'</strong>이라고 하면,
            입력 <Eq>{'x'}</Eq>와 비슷한 방향인 패턴만 활성화되는 것입니다.
            일종의 <strong style={{ color: C.green }}>패턴 매칭</strong> 또는{" "}
            <strong style={{ color: C.green }}>검색(retrieval)</strong>으로 볼 수 있습니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="FFN 차원 흐름 시각화">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {dModelOptions.map((d) => (
              <Btn key={d} active={dModel === d} onClick={() => setDModel(d)}>
                d_model = {d}
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 280" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Input vector */}
            <rect x={40} y={40} width={30} height={Math.min(dModel / 5, 180)} rx={4}
              fill={C.blue} opacity={0.6} />
            <text x={55} y={30} fill={C.textDim} fontSize={11} textAnchor="middle">x</text>
            <text x={55} y={40 + Math.min(dModel / 5, 180) + 16} fill={C.textMuted} fontSize={10} textAnchor="middle">
              {dModel}
            </text>

            {/* Arrow to W1 */}
            <line x1={80} y1={40 + Math.min(dModel / 5, 180) / 2}
              x2={140} y2={40 + Math.min(dModel / 5, 180) / 2}
              stroke={C.textMuted} strokeWidth={1.5} markerEnd="url(#arrowhead)" />
            <text x={110} y={40 + Math.min(dModel / 5, 180) / 2 - 10}
              fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={600}>W₁</text>

            {/* W1 matrix */}
            <rect x={150} y={20} width={60} height={Math.min(dFF / 10, 220)} rx={4}
              fill={C.accent} opacity={0.15} stroke={C.accent} strokeWidth={1} />
            <text x={180} y={12} fill={C.textMuted} fontSize={9} textAnchor="middle">
              {dFF}×{dModel}
            </text>

            {/* Hidden vector (pre-ReLU) */}
            <rect x={240} y={20} width={30} height={Math.min(dFF / 10, 220)} rx={4}
              fill={C.accent} opacity={0.4} />
            <text x={255} y={12} fill={C.textDim} fontSize={10} textAnchor="middle">{dFF}</text>

            {/* ReLU zone */}
            <rect x={290} y={20} width={60} height={Math.min(dFF / 10, 220)} rx={8}
              fill="transparent" stroke={C.red} strokeWidth={1} strokeDasharray="4 4" />
            <text x={320} y={12} fill={C.red} fontSize={11} textAnchor="middle" fontWeight={600}>ReLU</text>
            {/* Show top half bright, bottom half dimmed */}
            <rect x={292} y={22} width={56} height={Math.min(dFF / 10, 220) / 2 - 4} rx={4}
              fill={C.accent} opacity={0.3} />
            <rect x={292} y={20 + Math.min(dFF / 10, 220) / 2} width={56} height={Math.min(dFF / 10, 220) / 2 - 2} rx={4}
              fill={C.textMuted} opacity={0.15} />

            {/* Hidden vector (post-ReLU) */}
            <rect x={370} y={20} width={30} height={Math.min(dFF / 10, 220)} rx={4}
              fill={C.green} opacity={0.4} />
            <text x={385} y={12} fill={C.textDim} fontSize={10} textAnchor="middle">{dFF}</text>

            {/* Arrow to W2 */}
            <line x1={410} y1={20 + Math.min(dFF / 10, 220) / 2}
              x2={460} y2={20 + Math.min(dFF / 10, 220) / 2}
              stroke={C.textMuted} strokeWidth={1.5} markerEnd="url(#arrowhead)" />
            <text x={435} y={20 + Math.min(dFF / 10, 220) / 2 - 10}
              fill={C.green} fontSize={11} textAnchor="middle" fontWeight={600}>W₂</text>

            {/* W2 matrix */}
            <rect x={470} y={20} width={60} height={Math.min(dFF / 10, 220)} rx={4}
              fill={C.green} opacity={0.15} stroke={C.green} strokeWidth={1} />
            <text x={500} y={12} fill={C.textMuted} fontSize={9} textAnchor="middle">
              {dModel}×{dFF}
            </text>

            {/* Output vector */}
            <rect x={560} y={40} width={30} height={Math.min(dModel / 5, 180)} rx={4}
              fill={C.purple} opacity={0.6} />
            <text x={575} y={30} fill={C.textDim} fontSize={11} textAnchor="middle">out</text>
            <text x={575} y={40 + Math.min(dModel / 5, 180) + 16} fill={C.textMuted} fontSize={10} textAnchor="middle">
              {dModel}
            </text>

            {/* Flow labels */}
            <text x={350} y={20 + Math.min(dFF / 10, 220) + 30} fill={C.textMuted} fontSize={10} textAnchor="middle">
              확장 → 활성화 → 축소
            </text>

            {/* Arrowhead marker */}
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.textMuted} />
              </marker>
            </defs>
          </svg>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 2 — Key-Value Memory 대응 (핵심)
   ══════════════════════════════════════════════════════ */

const KV_LABELS = ["수도/도시", "음식/요리", "색상/시각", "과학/연구", "음악/예술", "스포츠", "역사/시대", "동물/자연"];
const KV_INPUTS = [
  { label: "에펠탑", emoji: "🗼" },
  { label: "스시", emoji: "🍣" },
  { label: "파란 하늘", emoji: "🌌" },
  { label: "피아노", emoji: "🎹" },
  { label: "고양이", emoji: "🐱" },
];

// scores[input][key] — mock matching scores
const KV_SCORES = [
  [0.92, 0.08, 0.05, 0.03, 0.10, 0.04, 0.45, 0.02], // 에펠탑
  [0.05, 0.95, 0.03, 0.02, 0.04, 0.03, 0.06, 0.08],  // 스시
  [0.03, 0.02, 0.93, 0.12, 0.06, 0.04, 0.03, 0.15],  // 파란 하늘
  [0.04, 0.03, 0.02, 0.08, 0.91, 0.05, 0.12, 0.03],  // 피아노
  [0.03, 0.06, 0.04, 0.10, 0.03, 0.07, 0.02, 0.94],  // 고양이
];

const KV_VALUES = [
  ["Paris 40%", "France 18%", "Europe 12%", "tower 8%", "city 6%"],
  ["Japan 28%", "rice 20%", "fish 16%", "chef 10%", "sea 8%"],
  ["blue 35%", "sky 22%", "white 12%", "cloud 8%", "light 6%"],
  ["music 30%", "key 18%", "chord 14%", "song 10%", "note 8%"],
  ["pet 25%", "fur 18%", "small 14%", "cute 12%", "meow 8%"],
];

function KeyValueSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [selectedInput, setSelectedInput] = useState(0);

  const scores = KV_SCORES[selectedInput];
  const threshold = 0.3;

  return (
    <>
      <SectionTitle subtitle="FFN의 수식을 재해석하다">2. Key-Value Memory 대응</SectionTitle>

      <P>
        Section 1에서 우리는 <Eq>{'W_1'}</Eq>의 각 행이 입력과 <strong style={{ color: C.accent }}>내적</strong>을
        수행하여 매칭 여부를 판단한다는 것을 확인했습니다. 이것은 무엇과 비슷할까요?
      </P>

      <P>
        데이터베이스에 query를 던져서 매칭되는 <strong style={{ color: C.accent }}>key</strong>를 찾고,
        대응하는 <strong style={{ color: C.green }}>value</strong>를 가져오는 구조 — 바로{" "}
        <strong style={{ color: C.accent }}>Key-Value Memory</strong>입니다.
      </P>

      <Box label="Key-Value 대응" color={C.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: C.textDim }}>
            <Eq>{'W_1'}</Eq>의 i번째 행 = <strong style={{ color: C.accent }}>key</strong> <Eq>{'k_i'}</Eq>
          </span>
          <span style={{ color: C.textDim }}>
            <Eq>{'k_i \\cdot x'}</Eq> = key와 입력의 매칭 점수
          </span>
          <span style={{ color: C.textDim }}>
            ReLU → 매칭 점수가 양수인 것만 활성화 → <Eq>{'m_i'}</Eq>
          </span>
          <span style={{ color: C.textDim }}>
            <Eq>{'W_2'}</Eq>의 i번째 열 = <strong style={{ color: C.green }}>value</strong> <Eq>{'v_i'}</Eq>
          </span>
          <span style={{ color: C.textDim }}>
            <Eq>{'W_2 m = \\sum_i m_i \\cdot v_i'}</Eq> = 활성화된 value의 가중합
          </span>
        </div>
      </Box>

      <MathBlock>{'\\text{FFN}(x) = \\sum_{i=1}^{d_{ff}} \\underbrace{\\text{ReLU}(k_i \\cdot x + b_i)}_{m_i \\text{ (활성화 강도)}} \\cdot \\underbrace{v_i}_{\\text{value 벡터}}'}</MathBlock>

      <Box label="핵심" color={C.green}>
        이 대응은 비유가 아니라 <strong style={{ color: C.accent }}>수식적으로 정확히 성립</strong>합니다.
        FFN의 각 뉴런(i)은 하나의 key-value 쌍이며, 입력과 매칭된 key에 대응하는 value를 가중합하여 출력합니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        <Eq>{'W_1'}</Eq>에 3072개의 행이 있다는 것은, 이 FFN 층에{" "}
        <strong style={{ color: C.accent }}>메모리 슬롯</strong>이 몇 개 있다는 뜻일까요?
      </Question>

      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>3072개</strong>입니다. 각 행이 하나의 key이고,
        대응하는 <Eq>{'W_2'}</Eq>의 열이 그 key의 value이므로,
        3072개의 key-value 쌍이 이 층 하나에 저장되어 있습니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            GPT-2 Small에는 12개 층이 있고 각 층에 FFN이 하나씩 있습니다.
            전체 모델의 key-value 메모리 용량은 대략 얼마일까요?
          </Question>

          <Answer visible={q2}>
            12 × 3072 = <strong style={{ color: C.accent }}>36,864개</strong>의 key-value 쌍입니다.
            GPT-2 XL(48층, <Eq>{'d_{ff}'}</Eq>=16384)이라면 48 × 16384 ={" "}
            <strong style={{ color: C.accent }}>786,432개</strong>로 늘어납니다.
            이것이 모델이 '알고 있는 사실'을 저장하는 용량의 대략적인 상한입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Key-Value Memory Lookup 시뮬레이터">
          <P>
            8개의 key-value 쌍을 가진 미니 FFN을 시뮬레이션합니다. 입력을 선택하면 각 key와의 매칭 점수가 계산됩니다.
          </P>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {KV_INPUTS.map((inp, i) => (
              <Btn key={i} active={selectedInput === i} onClick={() => setSelectedInput(i)}>
                {inp.emoji} {inp.label}
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 420" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Header */}
            <text x={60} y={20} fill={C.accent} fontSize={11} fontWeight={600}>Key 슬롯</text>
            <text x={250} y={20} fill={C.textMuted} fontSize={11}>매칭 점수</text>
            <text x={520} y={20} fill={C.green} fontSize={11} fontWeight={600}>Value 출력</text>

            {KV_LABELS.map((label, i) => {
              const y = 40 + i * 46;
              const score = scores[i];
              const active = score >= threshold;
              const barWidth = score * 200;

              return (
                <g key={i}>
                  {/* Key label */}
                  <rect x={10} y={y} width={120} height={32} rx={6}
                    fill={active ? `${C.accent}20` : `${C.textMuted}10`}
                    stroke={active ? C.accent : `${C.textMuted}40`} strokeWidth={1} />
                  <text x={70} y={y + 20} fill={active ? C.accent : C.textMuted}
                    fontSize={11} textAnchor="middle" fontWeight={active ? 600 : 400}>
                    {label}
                  </text>

                  {/* Score bar */}
                  <rect x={150} y={y + 6} width={barWidth} height={20} rx={4}
                    fill={active ? C.accent : C.textMuted} opacity={active ? 0.5 : 0.2}
                    style={{ transition: "width 0.5s ease, opacity 0.3s ease" }} />
                  <text x={150 + barWidth + 8} y={y + 20} fill={active ? C.accent : C.textMuted}
                    fontSize={10} style={{ transition: "all 0.3s ease" }}>
                    {score.toFixed(2)}
                  </text>

                  {/* Value output (only shown when active) */}
                  {active && (
                    <text x={420} y={y + 20} fill={C.green} fontSize={10}
                      style={{ transition: "opacity 0.3s ease" }}>
                      → {KV_VALUES[selectedInput][0]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Summary */}
            <text x={350} y={410} fill={C.textMuted} fontSize={10} textAnchor="middle">
              이 시뮬레이터는 교육용 목업입니다. 실제 FFN에는 수천 개의 key-value 쌍이 있습니다.
            </text>
          </svg>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 3 — Attention K-V vs FFN K-V 비교
   ══════════════════════════════════════════════════════ */

const SENTENCES = [
  { tokens: ["The", "Eiffel", "Tower", "is", "in"], label: "에펠탑 문장" },
  { tokens: ["A", "cat", "sat", "on", "the"], label: "고양이 문장" },
  { tokens: ["The", "CEO", "of", "Apple", "is"], label: "CEO 문장" },
];

function ComparisonSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [sentIdx, setSentIdx] = useState(0);

  const tokens = SENTENCES[sentIdx].tokens;

  return (
    <>
      <SectionTitle subtitle="같은 이름, 다른 메커니즘">3. Attention K-V vs FFN K-V</SectionTitle>

      <P>
        Attention에도 Key와 Value가 있고, FFN에도 Key와 Value가 있습니다. 이 둘은 같은 것일까요?
      </P>

      <P>
        핵심 차이는 <strong style={{ color: C.accent }}>동적(dynamic) vs 고정(static)</strong>입니다.
      </P>

      <Box label="Attention — 동적 Key-Value" color={C.accent}>
        K, V가 현재 입력 시퀀스의 토큰으로부터 <strong style={{ color: C.accent }}>매번 새로 계산</strong>됩니다.
        "지금 이 문장에서 어떤 단어의 정보를 가져올까" → <strong style={{ color: C.accent }}>문맥 의존적</strong>
      </Box>

      <Box label="FFN — 고정된 Key-Value" color={C.green}>
        K (<Eq>{'W_1'}</Eq> 행), V (<Eq>{'W_2'}</Eq> 열)가 훈련 후 <strong style={{ color: C.green }}>고정</strong>됩니다.
        문장이 바뀌어도 <Eq>{'W_1'}</Eq>, <Eq>{'W_2'}</Eq>는 동일 → <strong style={{ color: C.green }}>고정된 지식 저장소</strong>
      </Box>

      <P>
        비유하자면: Attention은 대화 중에 상대방이 <strong style={{ color: C.accent }}>방금 한 말</strong>을 참조하는 것이고,
        FFN은 학교에서 배워서 <strong style={{ color: C.green }}>머릿속에 저장해둔 지식</strong>을 꺼내 쓰는 것입니다.
      </P>

      <Box label="핵심 정리" color={C.purple}>
        <strong style={{ color: C.accent }}>Attention은 문맥을 읽고</strong>,{" "}
        <strong style={{ color: C.green }}>FFN은 지식을 꺼낸다.</strong>
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Attention과 FFN이 Transformer 블록 안에서 <strong style={{ color: C.accent }}>순서대로</strong> 실행된다는 것을
        떠올려보세요 (Attention → FFN). 이 순서가 의미적으로 자연스러운 이유는 무엇일까요?
      </Question>

      <Answer visible={q1}>
        먼저 Attention이 문맥 정보를 모아서 <strong style={{ color: C.accent }}>'지금 무엇에 대해 이야기하고 있는가'</strong>를 파악합니다.
        그 다음 FFN이 파악된 subject에 대한 <strong style={{ color: C.green }}>저장된 지식</strong>을 꺼냅니다.
        <br /><br />
        예를 들어 "The Eiffel Tower is in..."에서 Attention이 "Eiffel Tower"라는 subject를 모은 후,
        FFN이 <strong style={{ color: C.green }}>"Eiffel Tower → Paris"</strong>라는 사실을 recall하는 것입니다.
      </Answer>

      {q1 && (
        <Panel label="Attention vs FFN: 두 종류의 Key-Value">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {SENTENCES.map((s, i) => (
              <Btn key={i} active={sentIdx === i} onClick={() => setSentIdx(i)}>
                {s.label}
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 320" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Divider */}
            <line x1={350} y1={20} x2={350} y2={280} stroke={C.border} strokeWidth={1} strokeDasharray="4 4" />

            {/* Left: Attention */}
            <text x={175} y={20} fill={C.accent} fontSize={12} fontWeight={700} textAnchor="middle">
              Dynamic Key-Value (문맥 의존)
            </text>

            {/* Input tokens */}
            {tokens.map((tok, i) => {
              const x = 40 + i * 60;
              return (
                <g key={`attn-${i}-${sentIdx}`}>
                  <rect x={x} y={50} width={50} height={26} rx={6}
                    fill={`${C.accent}20`} stroke={`${C.accent}60`} strokeWidth={1}
                    style={{ transition: "all 0.4s ease" }} />
                  <text x={x + 25} y={67} fill={C.accent} fontSize={10} textAnchor="middle"
                    style={{ transition: "all 0.3s ease" }}>
                    {tok}
                  </text>
                </g>
              );
            })}

            {/* Arrows from tokens to K, V */}
            <text x={100} y={110} fill={C.accent} fontSize={10} fontWeight={600}>K = f(입력)</text>
            <text x={200} y={110} fill={C.accent} fontSize={10} fontWeight={600}>V = g(입력)</text>

            {/* K, V boxes that change */}
            <rect x={60} y={125} width={100} height={40} rx={8}
              fill={`${C.accent}15`} stroke={C.accent} strokeWidth={1}
              style={{ transition: "all 0.3s ease" }} />
            <text x={110} y={150} fill={C.accent} fontSize={10} textAnchor="middle">
              K: [{tokens[1]}, {tokens[2]}...]
            </text>

            <rect x={180} y={125} width={100} height={40} rx={8}
              fill={`${C.accent}15`} stroke={C.accent} strokeWidth={1}
              style={{ transition: "all 0.3s ease" }} />
            <text x={230} y={150} fill={C.accent} fontSize={10} textAnchor="middle">
              V: [{tokens[0]}, {tokens[1]}...]
            </text>

            <text x={175} y={200} fill={C.yellow} fontSize={10} textAnchor="middle" fontWeight={600}>
              ↑ 입력이 바뀌면 K, V도 바뀜
            </text>

            {/* Right: FFN */}
            <text x={525} y={20} fill={C.green} fontSize={12} fontWeight={700} textAnchor="middle">
              Static Key-Value (고정된 지식)
            </text>

            {/* Static W1, W2 blocks */}
            <rect x={400} y={50} width={120} height={50} rx={8}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1} />
            <text x={460} y={72} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={600}>W₁ (Keys)</text>
            <text x={460} y={88} fill={C.textMuted} fontSize={9} textAnchor="middle">3072 × 768</text>

            <rect x={550} y={50} width={120} height={50} rx={8}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1} />
            <text x={610} y={72} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={600}>W₂ (Values)</text>
            <text x={610} y={88} fill={C.textMuted} fontSize={9} textAnchor="middle">768 × 3072</text>

            {/* Arrow: input → W1 → W2 → output */}
            <text x={525} y={130} fill={C.textDim} fontSize={10} textAnchor="middle">
              입력 x → key 매칭 → value 출력
            </text>

            <text x={525} y={200} fill={C.yellow} fontSize={10} textAnchor="middle" fontWeight={600}>
              ↑ 입력이 바뀌어도 W₁, W₂는 고정
            </text>

            {/* Bottom summary */}
            <rect x={50} y={240} width={600} height={36} rx={8}
              fill={`${C.purple}10`} stroke={`${C.purple}40`} strokeWidth={1} />
            <text x={350} y={263} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>
              Attention = working memory (단기)  |  FFN = long-term memory (장기)
            </text>
          </svg>
        </Panel>
      )}

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            FFN의 지식이 고정되어 있다면, 모델이 <strong style={{ color: C.red }}>틀린 사실</strong>을
            알고 있을 때 어떻게 고칠 수 있을까요?
          </Question>

          <Answer visible={q2}>
            바로 이 질문이 다음 포스트에서 다룰 <strong style={{ color: C.orange }}>ROME (Rank-One Model Editing)</strong> 논문의 출발점입니다.
            FFN의 <Eq>{'W_2'}</Eq> (value 행렬)를 직접 수정하여 특정 사실을 편집할 수 있습니다.
            <br /><br />
            "Eiffel Tower → Paris"를 "Eiffel Tower → Rome"으로 바꾸려면,
            해당 FFN 층의 <strong style={{ color: C.green }}>value 벡터</strong>를 수정하면 되는 것입니다.
          </Answer>
        </>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 4 — FFN이 실제로 저장하는 것
   ══════════════════════════════════════════════════════ */

const NEURONS = [
  {
    id: "#1024", layer: "Layer 8", label: "지리/수도",
    triggers: [
      { text: "The capital of France is", score: 0.95 },
      { text: "Paris is known for its", score: 0.88 },
      { text: "the Eiffel Tower located in", score: 0.82 },
    ],
    values: [
      { token: "Paris", prob: 35 },
      { token: "France", prob: 20 },
      { token: "French", prob: 15 },
      { token: "Europe", prob: 10 },
      { token: "city", prob: 8 },
    ],
  },
  {
    id: "#2048", layer: "Layer 11", label: "연도/시대",
    triggers: [
      { text: "was born in the year", score: 0.91 },
      { text: "founded in 1", score: 0.87 },
      { text: "since the early 19", score: 0.80 },
    ],
    values: [
      { token: "19", prob: 25 },
      { token: "20", prob: 20 },
      { token: "18", prob: 15 },
      { token: "century", prob: 12 },
      { token: "year", prob: 8 },
    ],
  },
  {
    id: "#3001", layer: "Layer 10", label: "스포츠",
    triggers: [
      { text: "plays the sport of", score: 0.93 },
      { text: "is a professional", score: 0.85 },
      { text: "won the championship in", score: 0.79 },
    ],
    values: [
      { token: "football", prob: 18 },
      { token: "basketball", prob: 15 },
      { token: "baseball", prob: 12 },
      { token: "tennis", prob: 10 },
      { token: "soccer", prob: 9 },
    ],
  },
  {
    id: "#512", layer: "Layer 3", label: "색상/형용사",
    triggers: [
      { text: "The color of the sky is", score: 0.90 },
      { text: "painted in a bright", score: 0.84 },
      { text: "wearing a dark", score: 0.78 },
    ],
    values: [
      { token: "blue", prob: 30 },
      { token: "red", prob: 12 },
      { token: "green", prob: 10 },
      { token: "black", prob: 9 },
      { token: "white", prob: 8 },
    ],
  },
  {
    id: "#4000", layer: "Layer 11", label: "기업/CEO",
    triggers: [
      { text: "the CEO of", score: 0.92 },
      { text: "is the founder of", score: 0.86 },
      { text: "the company announced that", score: 0.75 },
    ],
    values: [
      { token: "Google", prob: 8 },
      { token: "Apple", prob: 7 },
      { token: "the", prob: 6 },
      { token: "Microsoft", prob: 5 },
      { token: "Amazon", prob: 5 },
    ],
  },
];

function MemoryPatternSection() {
  const [q1, setQ1] = useState(false);
  const [selNeuron, setSelNeuron] = useState(0);

  const neuron = NEURONS[selNeuron];

  return (
    <>
      <SectionTitle subtitle="Geva et al.의 실험적 발견">4. FFN이 실제로 저장하는 것</SectionTitle>

      <P>
        수학적으로 key-value memory 구조라는 건 알겠는데, 실제로 훈련된 모델의 FFN에서
        key와 value는 <strong style={{ color: C.accent }}>구체적으로 무엇을 저장</strong>하고 있을까요?
      </P>

      <P>
        Geva et al.은 실험을 통해 두 가지를 밝혔습니다:
      </P>

      <Box label="Key 측 분석" color={C.accent}>
        특정 key(뉴런)는 특정 <strong style={{ color: C.accent }}>입력 텍스트 패턴</strong>에 의해 활성화됩니다.
        예를 들어 어떤 key는 "수도 이름이 나오는 문맥"에서만 활성화되고,
        다른 key는 "연도가 나오는 문맥"에서 활성화됩니다.
        상위 layer로 갈수록 더 <strong style={{ color: C.purple }}>추상적/의미적</strong> 패턴에 반응합니다.
      </Box>

      <Box label="Value 측 분석" color={C.green}>
        활성화된 key에 대응하는 value를 unembedding으로 변환하면,
        특정 <strong style={{ color: C.green }}>출력 토큰 분포</strong>에 대응합니다.
        예를 들어 "수도" key에 대응하는 value는 도시 이름 토큰들
        ("Paris", "London", "Tokyo" 등)의 확률을 높입니다.
      </Box>

      <Box label="핵심 통찰" color={C.purple}>
        FFN의 각 뉴런은{" "}
        <strong style={{ color: C.accent }}>"이런 패턴이 나타나면 → 이런 토큰을 예측하라"</strong>는{" "}
        <strong style={{ color: C.purple }}>if-then 규칙</strong>으로 해석할 수 있습니다.
      </Box>

      <P>
        또한 층(layer)에 따라 패턴의 성격이 다릅니다:
      </P>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "1rem 0" }}>
        <div style={{
          flex: "1 1 200px", padding: "1rem", background: `${C.blue}10`,
          border: `1px solid ${C.blue}30`, borderRadius: 12,
        }}>
          <div style={{ color: C.blue, fontWeight: 700, fontSize: "0.85em", marginBottom: 4 }}>하위 층 (Layer 1-4)</div>
          <div style={{ color: C.textDim, fontSize: "0.9em" }}>
            구문적/표면적 패턴<br />
            예: "대문자 뒤에 대문자가 올 가능성"
          </div>
        </div>
        <div style={{
          flex: "1 1 200px", padding: "1rem", background: `${C.purple}10`,
          border: `1px solid ${C.purple}30`, borderRadius: 12,
        }}>
          <div style={{ color: C.purple, fontWeight: 700, fontSize: "0.85em", marginBottom: 4 }}>상위 층 (Layer 8-12)</div>
          <div style={{ color: C.textDim, fontSize: "0.9em" }}>
            의미적/사실적 패턴<br />
            예: "에펠탑에 대한 문맥 → Paris"
          </div>
        </div>
      </div>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        FFN의 value를 unembedding matrix로 변환하면 토큰 분포가 나온다고 했습니다.
        이것은 이전 포스트에서 배운 어떤 기법과 비슷할까요?
      </Question>

      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>Logit Lens</strong>입니다!
        Logit Lens는 residual stream의 중간 상태에 unembedding을 적용하여
        '현재 시점의 예측'을 관찰하는 기법이었습니다.
        FFN의 value에 같은 것을 적용하면, 각 메모리 슬롯이{" "}
        <strong style={{ color: C.green }}>어떤 토큰을 '기억하고 있는지'</strong> 엿볼 수 있는 것입니다.
      </Answer>

      {q1 && (
        <Panel label="FFN 뉴런 패턴 탐색기">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {NEURONS.map((n, i) => (
              <Btn key={i} active={selNeuron === i} onClick={() => setSelNeuron(i)}
                color={i === selNeuron ? C.accent : undefined}>
                뉴런 {n.id} ({n.label})
              </Btn>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <span style={{
              background: `${C.purple}20`, color: C.purple, padding: "3px 8px",
              borderRadius: 4, fontSize: "0.75em", fontWeight: 600,
            }}>
              {neuron.layer}
            </span>
            <span style={{ color: C.textMuted, fontSize: "0.85em" }}>
              {neuron.label} 패턴
            </span>
          </div>

          <svg viewBox="0 0 700 300" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Left: Key triggers */}
            <text x={10} y={20} fill={C.accent} fontSize={11} fontWeight={600}>
              이 뉴런을 활성화시키는 입력 패턴
            </text>

            {neuron.triggers.map((t, i) => {
              const y = 40 + i * 60;
              const barW = t.score * 150;
              return (
                <g key={`trigger-${selNeuron}-${i}`}>
                  <text x={10} y={y + 15} fill={C.textDim} fontSize={10}>
                    "{t.text}"
                  </text>
                  <rect x={10} y={y + 22} width={barW} height={14} rx={3}
                    fill={C.accent} opacity={0.4}
                    style={{ transition: "width 0.4s ease" }} />
                  <text x={barW + 16} y={y + 33} fill={C.accent} fontSize={9}>
                    {t.score.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Divider */}
            <line x1={350} y1={10} x2={350} y2={280} stroke={C.border} strokeWidth={1} strokeDasharray="4 4" />

            {/* Right: Value tokens */}
            <text x={370} y={20} fill={C.green} fontSize={11} fontWeight={600}>
              이 뉴런이 예측하는 토큰 Top-5
            </text>

            {neuron.values.map((v, i) => {
              const y = 40 + i * 48;
              const barW = (v.prob / 40) * 200;
              return (
                <g key={`value-${selNeuron}-${i}`}>
                  <text x={370} y={y + 18} fill={C.text} fontSize={12} fontWeight={600}>
                    {v.token}
                  </text>
                  <rect x={450} y={y + 6} width={barW} height={16} rx={3}
                    fill={C.green} opacity={0.5}
                    style={{ transition: "width 0.4s ease" }} />
                  <text x={450 + barW + 8} y={y + 18} fill={C.green} fontSize={10}>
                    {v.prob}%
                  </text>
                </g>
              );
            })}
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.8em", textAlign: "center", marginTop: 8 }}>
            실제 논문에서는 수천 개의 뉴런을 분석했으며, 여기서는 대표적 패턴만 보여줍니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 5 — 요약 + ROME으로의 다리
   ══════════════════════════════════════════════════════ */

function BridgeSection() {
  const summaryCards = [
    { title: "FFN 수식 구조", color: C.blue, text: "x → W₁(확장) → ReLU → W₂(축소) → 출력" },
    { title: "Key-Value 대응", color: C.accent, text: "W₁ 행 = key (패턴 매칭), W₂ 열 = value (정보 출력)" },
    { title: "Attention과의 차이", color: C.purple, text: "Attention은 동적 문맥, FFN은 고정된 지식" },
    { title: "계층적 패턴", color: C.green, text: "하위 층은 구문적, 상위 층은 의미적 패턴" },
  ];

  return (
    <>
      <SectionTitle subtitle="핵심 정리와 다음 여정">5. 요약 + ROME으로의 다리</SectionTitle>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 16,
        margin: "2rem 0",
      }}>
        {summaryCards.map((card, i) => (
          <div key={i} style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${card.color}`,
            borderRadius: 12,
            padding: "1.25rem",
          }}>
            <div style={{
              color: card.color,
              fontWeight: 700,
              fontSize: "0.85em",
              marginBottom: 8,
            }}>
              {card.title}
            </div>
            <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
              {card.text}
            </div>
          </div>
        ))}
      </div>

      <Box label="다음 포스트 예고" color={C.orange}>
        <P>
          FFN이 고정된 사실 저장소라면, 자연스럽게 두 가지 질문이 떠오릅니다:
        </P>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0 }}>어디에?</span>
            <span style={{ color: C.textDim }}>
              특정 사실이 수십 개의 FFN 층 중 정확히 어디에 저장되어 있는가? → <strong style={{ color: C.orange }}>Causal Tracing</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.orange, fontWeight: 700, flexShrink: 0 }}>편집?</span>
            <span style={{ color: C.textDim }}>
              찾은 위치의 가중치를 수정하여 사실을 바꿀 수 있는가? → <strong style={{ color: C.orange }}>ROME</strong>
            </span>
          </div>
        </div>
        <P>
          다음 포스트에서 Meng et al.의 ROME 논문을 따라가며, 이 두 질문에 답합니다.
        </P>
      </Box>
    </>
  );
}


/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */

export default function FFNKeyValueMemoryBlog() {
  return (
    <div style={{ color: C.text, fontFamily: "var(--font-sans)", lineHeight: 1.7 }}>
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: ${C.surface};
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${C.accent};
          cursor: pointer;
        }
      `}</style>
      <article>
        <section style={{ marginBottom: "5rem" }}><Introduction /></section>
        <section style={{ marginBottom: "5rem" }}><FFNStructureSection /></section>
        <section style={{ marginBottom: "5rem" }}><KeyValueSection /></section>
        <section style={{ marginBottom: "5rem" }}><ComparisonSection /></section>
        <section style={{ marginBottom: "5rem" }}><MemoryPatternSection /></section>
        <section style={{ marginBottom: "5rem" }}><BridgeSection /></section>
      </article>
    </div>
  );
}
