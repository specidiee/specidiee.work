'use client';

import { useState, useCallback, useEffect, useRef } from "react";
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
  return (
    <section>
      <SectionTitle subtitle="LLM Interpretability를 향한 첫 걸음">
        0. Introduction
      </SectionTitle>

      <P>
        이 글은 <strong style={{ color: C.accent }}>LLM Interpretability 스터디 Week 1</strong> 준비를 위해,
        Transformer의 내부 아키텍처를 수학적 직관과 함께 정리한 노트입니다.
      </P>
      <P>
        Transformer는 본질적으로 <strong style={{ color: C.accent }}>다음 토큰 예측기</strong>입니다.
        입력 공간 <Eq>{'X'}</Eq>는 토큰 시퀀스이고, 출력 공간 <Eq>{'Y'}</Eq>는 어휘(vocabulary) 위의 확률분포입니다.
        이 글에서는 입력부터 출력까지 데이터가 흐르는 과정을 하나하나 따라가 보겠습니다.
      </P>

      <Box label="이 글의 여정">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "토큰과 임베딩", color: C.blue, desc: "텍스트를 벡터로 변환하기" },
            { label: "Self-Attention", color: C.accent, desc: "토큰 간 정보 교환 메커니즘" },
            { label: "Multi-Head Attention", color: C.purple, desc: "여러 관점에서 동시에 바라보기" },
            { label: "Transformer 블록 구조", color: C.green, desc: "Residual stream과 정보 흐름" },
            { label: "최종 출력과 Logit Lens", color: C.orange, desc: "중간 layer의 예측 상태 관찰" },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: color, flexShrink: 0,
                boxShadow: `0 0 8px ${color}60`,
              }} />
              <span style={{ color, fontWeight: 600 }}>{label}</span>
              <span style={{ color: C.textMuted, fontSize: "0.9em" }}>— {desc}</span>
            </div>
          ))}
        </div>
      </Box>
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 1 — 토큰과 임베딩
   ══════════════════════════════════════════════════════ */

function TokenEmbeddingSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);

  const words = [
    { label: "king", x: 280, y: 80, cluster: "royalty" },
    { label: "queen", x: 320, y: 120, cluster: "royalty" },
    { label: "man", x: 200, y: 160, cluster: "human" },
    { label: "woman", x: 240, y: 200, cluster: "human" },
    { label: "cat", x: 100, y: 300, cluster: "animal" },
    { label: "dog", x: 160, y: 340, cluster: "animal" },
    { label: "puppy", x: 200, y: 370, cluster: "animal" },
    { label: "kitten", x: 60, y: 330, cluster: "animal" },
  ];

  const getNearest = (word) => {
    const dists = words
      .filter((w) => w.label !== word.label)
      .map((w) => ({ ...w, dist: Math.hypot(w.x - word.x, w.y - word.y) }))
      .sort((a, b) => a.dist - b.dist);
    return dists.slice(0, 3);
  };

  return (
    <section>
      <SectionTitle subtitle="텍스트에서 벡터로">1. 토큰과 임베딩</SectionTitle>

      <P>
        텍스트가 Transformer에 들어가려면 두 단계를 거칩니다:
        <strong style={{ color: C.blue }}> 토큰화</strong>와
        <strong style={{ color: C.blue }}> 임베딩</strong>.
      </P>
      <P>
        <strong style={{ color: C.blue }}>토큰화(Tokenization)</strong>는 텍스트를 단어 또는 부분 단어(subword) 단위로 쪼개어
        각각에 정수 ID를 부여하는 과정입니다. 예를 들어, "안녕하세요"는 ["안녕", "하세요"]처럼 분리될 수 있습니다.
      </P>
      <P>
        <strong style={{ color: C.blue }}>임베딩(Embedding)</strong>은 각 토큰 ID를 고차원 벡터로 변환합니다.
        핵심은 의미적으로 비슷한 단어들이 벡터 공간에서 <strong style={{ color: C.accent }}>가까이 위치</strong>한다는 것입니다.
      </P>
      <P>
        마지막으로 <strong style={{ color: C.blue }}>Positional Encoding</strong>이 필요합니다.
        Transformer의 attention은 본질적으로 순서를 모릅니다 — 내적은 순서와 무관하기 때문입니다.
        따라서 위치 정보 벡터를 임베딩에 더하여 순서를 부여합니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        만약 positional encoding 없이 &quot;A B C&quot;와 &quot;C B A&quot;를 모델에 넣으면, attention 연산 결과가 어떻게 될까요?
      </Question>
      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>동일한 attention score</strong>가 나옵니다.
        내적은 순서와 무관하기 때문입니다. 따라서 위치 정보를 별도로 주입해야 합니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            임베딩 차원이 512이고 문장에 토큰이 10개라면, Transformer에 들어가는 입력의 형태(shape)는?
          </Question>
          <Answer visible={q2}>
            <Eq>{'10 \\times 512'}</Eq> 행렬입니다. 각 행이 하나의 토큰 벡터입니다.
            임베딩 차원(512)은 각 토큰을 표현하는 벡터의 길이이고, 토큰 수(10)는 시퀀스의 길이입니다.
            이 둘은 완전히 독립적인 개념입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="임베딩 공간 탐색기">
          <P>마우스를 올려 가장 가까운 단어들의 연결을 확인해보세요.</P>
          <svg
            viewBox="0 0 420 430"
            style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}
          >
            {/* cluster backgrounds */}
            <ellipse cx="300" cy="110" rx="80" ry="60" fill={`${C.purple}10`} stroke={`${C.purple}30`} />
            <text x="360" y="65" fill={C.purple} fontSize="11" opacity={0.6}>royalty</text>
            <ellipse cx="220" cy="185" rx="60" ry="45" fill={`${C.blue}10`} stroke={`${C.blue}30`} />
            <text x="260" y="155" fill={C.blue} fontSize="11" opacity={0.6}>human</text>
            <ellipse cx="130" cy="335" rx="100" ry="65" fill={`${C.green}10`} stroke={`${C.green}30`} />
            <text x="30" y="275" fill={C.green} fontSize="11" opacity={0.6}>animal</text>

            {/* nearest connections on hover */}
            {hoveredWord && getNearest(hoveredWord).map((n) => (
              <line
                key={n.label}
                x1={hoveredWord.x} y1={hoveredWord.y}
                x2={n.x} y2={n.y}
                stroke={C.accent} strokeWidth={1} strokeDasharray="4,4" opacity={0.5}
              />
            ))}

            {/* word dots */}
            {words.map((w) => {
              const isHovered = hoveredWord?.label === w.label;
              const isNearest = hoveredWord && getNearest(hoveredWord).some((n) => n.label === w.label);
              return (
                <g
                  key={w.label}
                  onMouseEnter={() => setHoveredWord(w)}
                  onMouseLeave={() => setHoveredWord(null)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={w.x} cy={w.y} r={isHovered ? 8 : isNearest ? 6 : 5}
                    fill={isHovered ? C.accent : isNearest ? C.accentDim : C.textDim}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  {(isHovered || isNearest) && (
                    <circle cx={w.x} cy={w.y} r={12} fill="none" stroke={C.accent} strokeWidth={1} opacity={0.4} />
                  )}
                  <text
                    x={w.x} y={w.y - 14}
                    textAnchor="middle"
                    fill={isHovered ? C.accent : isNearest ? C.accentDim : C.textMuted}
                    fontSize={isHovered ? 14 : 12}
                    fontWeight={isHovered ? 700 : 400}
                    style={{ transition: "all 0.2s ease" }}
                  >
                    {w.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 12 }}>
            실제 Transformer 임베딩은 512~12,288차원이지만, 2D로 투영해도 의미적 유사성 구조가 보존됩니다.
          </p>
        </Panel>
      )}
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 2 — Self-Attention
   ══════════════════════════════════════════════════════ */

function SelfAttentionSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [causalMask, setCausalMask] = useState(false);
  const [temperature, setTemperature] = useState(1.0);

  const tokens = ["The", "cat", "sat", "down"];
  // Raw attention scores (pre-softmax)
  const rawScores = [
    [1.2, 0.8, 0.3, -0.1],
    [0.5, 2.1, 0.7, 0.2],
    [0.3, 1.4, 1.8, 0.6],
    [0.1, 0.6, 1.1, 2.3],
  ];

  const softmax = (arr) => {
    const max = Math.max(...arr.filter((v) => v !== -Infinity));
    const exps = arr.map((v) => (v === -Infinity ? 0 : Math.exp(v - max)));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => (sum === 0 ? 0 : e / sum));
  };

  const getScores = () => {
    return rawScores.map((row, i) =>
      row.map((s, j) => {
        if (causalMask && j > i) return -Infinity;
        return s * temperature;
      })
    );
  };

  const getProbs = () => getScores().map((row) => softmax(row));

  const probToColor = (p) => {
    const intensity = Math.round(p * 255);
    return `rgba(0, 243, 255, ${p * 0.8 + 0.05})`;
  };

  return (
    <section>
      <SectionTitle subtitle="토큰 간 선택적 정보 교환">2. Self-Attention</SectionTitle>

      <P>
        &quot;bank&quot;라는 단어를 생각해봅시다. 은행일까요, 강둑일까요?
        이를 파악하려면 <strong style={{ color: C.accent }}>주변 단어의 정보</strong>가 필요합니다.
        Attention은 각 토큰이 다른 토큰의 정보를 선택적으로 가져오는 메커니즘입니다.
      </P>

      <Box label="Q, K, V — 도서관 비유" color={C.accent}>
        <div style={{ color: C.textDim }}>
          <strong style={{ color: C.accent }}>Query(Q)</strong>는 &quot;나는 이런 정보가 필요해&quot;라는 검색 요청,{' '}
          <strong style={{ color: C.accent }}>Key(K)</strong>는 각 책의 색인 카드,{' '}
          <strong style={{ color: C.accent }}>Value(V)</strong>는 실제 책의 내용입니다.
          Q와 K의 유사도로 어떤 책을 읽을지 결정하고, 그 책의 V를 가져옵니다.
        </div>
      </Box>

      <P>Self-attention 연산은 다음 단계로 이루어집니다:</P>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "1rem 0 1.5rem", paddingLeft: "1rem" }}>
        {[
          { step: "1", desc: "Q, K, V 생성 — 각 토큰 벡터에 W_Q, W_K, W_V를 곱함" },
          { step: "2", desc: "Score 계산 — Q와 K의 내적" },
          { step: "3", desc: "Scaling — √d_k로 나눔" },
          { step: "4", desc: "Softmax — 확률분포로 변환" },
          { step: "5-6", desc: "Value의 가중 평균 계산" },
        ].map(({ step, desc }) => (
          <div key={step} style={{ display: "flex", gap: 10, color: C.textDim }}>
            <span style={{ color: C.accent, fontWeight: 700, fontFamily: "var(--font-mono)", minWidth: 30 }}>
              [{step}]
            </span>
            {desc}
          </div>
        ))}
      </div>

      <P>이 전체를 하나의 수식으로 표현하면:</P>
      <MathBlock>{'\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V'}</MathBlock>
      <MathBlock>{'Q = XW_Q, \\quad K = XW_K, \\quad V = XW_V'}</MathBlock>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Q와 K의 내적이 큰 양수라는 것은 직관적으로 무엇을 의미할까요? 반대로 큰 음수라면?
      </Question>
      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>큰 양수</strong> = 두 벡터가 비슷한 방향
        = &quot;이 토큰이 원하는 정보(Query)와 저 토큰이 갖고 있는 정보(Key)가 잘 맞는다&quot; → 높은 attention.
        <br /><br />
        <strong style={{ color: C.red }}>큰 음수</strong> = 반대 방향 = 관련 없음 → 낮은 attention.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            만약 <Eq>{'\\sqrt{d_k}'}</Eq>로 scaling하지 않고 바로 softmax에 넣으면 어떤 문제가 생길까요?
          </Question>
          <Answer visible={q2}>
            <Eq>{'d_k'}</Eq>차원 벡터의 내적은 분산이 대략 <Eq>{'d_k'}</Eq>에 비례합니다.
            값이 크면 softmax의 지수 함수가 극단적으로 작용하여,
            가장 큰 score 하나만 1에 가깝고 나머지는 거의 0이 됩니다.
            이렇게 되면 (1) 여러 토큰의 정보를 조합하는 attention의 장점이 사라지고
            (2) <strong style={{ color: C.red }}>gradient가 소실</strong>되어 학습이 어려워집니다.
          </Answer>
        </>
      )}

      {q2 && (
        <>
          <Question number={3} revealed={q3} onReveal={() => setQ3(true)}>
            Decoder에서는 미래 토큰의 정보를 볼 수 없어야 합니다.
            Attention score 행렬에서 이것을 어떻게 구현할까요?
            (힌트: softmax의 입력 관점에서)
          </Question>
          <Answer visible={q3}>
            미래 위치에 해당하는 score를 softmax 적용 전에 <Eq>{'-\\infty'}</Eq>로 설정합니다(masking).
            softmax를 통과하면 <Eq>{'e^{-\\infty} = 0'}</Eq>이 되어 해당 토큰의 Value 정보가 완전히 차단됩니다.
            이것이 GPT 계열 모델의 <strong style={{ color: C.accent }}>causal attention</strong>입니다.
          </Answer>
        </>
      )}

      {q3 && (
        <Panel label="Attention Score 계산기">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <Btn active={causalMask} onClick={() => setCausalMask(!causalMask)}>
              Causal Mask {causalMask ? "ON" : "OFF"}
            </Btn>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textMuted, fontSize: "0.85em" }}>Temperature (1/√d_k):</span>
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: 120 }}
              />
              <span style={{ color: C.accent, fontFamily: "var(--font-mono)", fontSize: "0.85em", minWidth: 30 }}>
                {temperature.toFixed(1)}
              </span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <svg viewBox="0 0 500 420" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
              {/* Header: Key labels */}
              <text x="190" y="20" fill={C.textMuted} fontSize="11" textAnchor="middle">Key →</text>
              {tokens.map((t, j) => (
                <text key={`kh-${j}`} x={160 + j * 80} y="45" fill={C.accent} fontSize="13" textAnchor="middle" fontWeight={600}>
                  {t}
                </text>
              ))}
              {/* Left: Query labels */}
              <text x="20" y="75" fill={C.textMuted} fontSize="11" transform="rotate(-90, 20, 120)">Query →</text>
              {tokens.map((t, i) => (
                <text key={`ql-${i}`} x="70" y={78 + i * 80} fill={C.accent} fontSize="13" textAnchor="end" fontWeight={600}>
                  {t}
                </text>
              ))}

              {/* Score heatmap */}
              {getProbs().map((row, i) =>
                row.map((p, j) => {
                  const score = getScores()[i][j];
                  const isMasked = score === -Infinity;
                  return (
                    <g key={`${i}-${j}`}>
                      <rect
                        x={120 + j * 80} y={55 + i * 80}
                        width={70} height={35}
                        rx={6}
                        fill={isMasked ? `${C.red}20` : probToColor(p)}
                        stroke={isMasked ? `${C.red}40` : `${C.accent}30`}
                        strokeWidth={1}
                      />
                      <text
                        x={155 + j * 80} y={78 + i * 80}
                        fill={isMasked ? C.red : p > 0.4 ? C.bg : C.text}
                        fontSize="12"
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                      >
                        {isMasked ? "-∞" : p.toFixed(3)}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Label */}
              <text x="250" y="400" fill={C.textMuted} fontSize="11" textAnchor="middle">
                softmax 적용 후 확률값 (각 행의 합 = 1)
              </text>
            </svg>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ color: C.textMuted, fontSize: "0.85em", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: `rgba(0,243,255,0.6)` }} />
              높은 attention
            </div>
            <div style={{ color: C.textMuted, fontSize: "0.85em", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: `rgba(0,243,255,0.1)` }} />
              낮은 attention
            </div>
            {causalMask && (
              <div style={{ color: C.textMuted, fontSize: "0.85em", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: `${C.red}30`, border: `1px solid ${C.red}60` }} />
                마스킹 (-∞)
              </div>
            )}
          </div>

          <p style={{ color: C.textMuted, fontSize: "0.85em", marginTop: 12 }}>
            Temperature를 높이면 분포가 sharp(one-hot에 가까움)해지고, 낮추면 uniform에 가까워집니다.
            Causal Mask를 켜면 각 토큰이 자신 이전의 토큰만 참조할 수 있습니다.
          </p>
        </Panel>
      )}
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 3 — Multi-Head Attention
   ══════════════════════════════════════════════════════ */

function MultiHeadAttentionSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [dModel, setDModel] = useState(512);
  const [numHeads, setNumHeads] = useState(8);

  const dModelOptions = [128, 256, 512, 768];
  const headOptions = [1, 2, 4, 8, 16];
  const dk = dModel / numHeads;
  const isValid = dModel % numHeads === 0;

  const headColors = [C.accent, C.blue, C.purple, C.green, C.orange, C.red, C.yellow, C.textDim,
    "#ff6b9d", "#c084fc", "#34d399", "#f472b6", "#a78bfa", "#67e8f9", "#fbbf24", "#fb923c"];

  return (
    <section>
      <SectionTitle subtitle="여러 관점에서 동시에 바라보기">3. Multi-Head Attention</SectionTitle>

      <P>
        하나의 attention head로는 한 종류의 관계만 포착할 수 있습니다.
        예를 들어, 어떤 head는 &quot;주어-동사&quot; 관계에 집중하고, 다른 head는 &quot;수식어-피수식어&quot; 관계에 집중할 수 있습니다.
      </P>
      <P>
        <strong style={{ color: C.purple }}>Multi-Head Attention</strong>은 여러 독립적 attention head를 병렬로 실행하여
        각 head가 서로 다른 관계 패턴을 학습하도록 합니다.
        임베딩 차원을 head 수로 나누어 각 head의 Q, K, V 차원을 결정합니다.
      </P>

      <MathBlock>{'\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h) W_O'}</MathBlock>
      <MathBlock>{'\\text{head}_i = \\text{Attention}(XW_Q^i, XW_K^i, XW_V^i)'}</MathBlock>

      <P>
        각 head의 출력을 <strong style={{ color: C.purple }}>concatenate</strong>한 후,
        <Eq>{'W_O'}</Eq>를 곱하여 원래 차원으로 복원합니다.
        <Eq>{'W_O'}</Eq>는 단순 차원 축소가 아닌, head 간 정보의 <strong style={{ color: C.purple }}>학습된 재조합</strong>입니다
        — 마치 여러 전문가의 의견을 종합하는 편집자와 같습니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        임베딩 차원이 512이고 head가 8개일 때, 각 head의 Q, K, V 차원과 출력 차원은?
        concat 후 차원은?
      </Question>
      <Answer visible={q1}>
        각 head의 Q, K, V 차원 = <Eq>{'512/8 = 64'}</Eq>.
        각 head 출력도 64차원. concat하면 <Eq>{'64 \\times 8 = 512'}</Eq>차원으로 원래 임베딩 차원과 동일.
        따라서 <Eq>{'W_O'}</Eq>는 <Eq>{'512 \\times 512'}</Eq> 행렬입니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            만약 각 head의 출력을 concat 대신 단순히 더하면(sum) 어떤 문제가 있을까요?
          </Question>
          <Answer visible={q2}>
            단순 덧셈은 {numHeads}개 head의 출력을 {isValid ? dk : "?"} 차원 공간에서 섞어버려,
            각 head가 독립적으로 포착한 서로 다른 관계 패턴이 뭉개집니다.
            <strong style={{ color: C.purple }}> concat + <Eq>{'W_O'}</Eq></strong>는
            각 head의 독립적 발견을 보존하면서도 학습된 방식으로 재조합할 수 있습니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Multi-Head 차원 분할 다이어그램">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textMuted, fontSize: "0.85em" }}>d_model:</span>
              <div style={{ display: "flex", gap: 4 }}>
                {dModelOptions.map((d) => (
                  <Btn key={d} active={dModel === d} onClick={() => setDModel(d)} color={C.purple}>
                    {d}
                  </Btn>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textMuted, fontSize: "0.85em" }}>heads (h):</span>
              <div style={{ display: "flex", gap: 4 }}>
                {headOptions.map((h) => (
                  <Btn key={h} active={numHeads === h} onClick={() => setNumHeads(h)} color={C.purple}>
                    {h}
                  </Btn>
                ))}
              </div>
            </div>
          </div>

          {!isValid && (
            <div style={{
              padding: "0.75rem 1rem",
              background: `${C.red}15`,
              border: `1px solid ${C.red}40`,
              borderRadius: 8,
              color: C.red,
              fontSize: "0.85em",
              marginBottom: 12,
            }}>
              ⚠ d_model({dModel})이 h({numHeads})로 나누어 떨어지지 않습니다!
            </div>
          )}

          {isValid && (
            <svg viewBox="0 0 600 280" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
              {/* Full embedding bar */}
              <text x="300" y="18" fill={C.textMuted} fontSize="11" textAnchor="middle">
                입력 임베딩 (d_model = {dModel})
              </text>
              <rect x="50" y="25" width="500" height="30" rx="6" fill={C.surface} stroke={C.border} />

              {/* Split into heads */}
              <text x="300" y="88" fill={C.textMuted} fontSize="11" textAnchor="middle">
                Head별 분할 (h = {numHeads}, d_k = {dk})
              </text>
              {Array.from({ length: numHeads }).map((_, i) => {
                const w = 500 / numHeads;
                const x = 50 + i * w;
                return (
                  <g key={i}>
                    <rect
                      x={x + 1} y="95" width={w - 2} height="30" rx={4}
                      fill={`${headColors[i % headColors.length]}25`}
                      stroke={headColors[i % headColors.length]}
                      strokeWidth={1}
                    />
                    {w > 25 && (
                      <text
                        x={x + w / 2} y="115"
                        fill={headColors[i % headColors.length]}
                        fontSize={numHeads > 8 ? 8 : 10}
                        textAnchor="middle"
                      >
                        H{i + 1}{w > 50 ? `: ${dk}` : ""}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Arrows down */}
              <text x="300" y="155" fill={C.textMuted} fontSize="10" textAnchor="middle">
                각 head: Attention(XW_Q^i, XW_K^i, XW_V^i)
              </text>

              {/* Concat bar */}
              <text x="300" y="185" fill={C.textMuted} fontSize="11" textAnchor="middle">
                Concat → (d_model = {dModel})
              </text>
              {Array.from({ length: numHeads }).map((_, i) => {
                const w = 500 / numHeads;
                return (
                  <rect
                    key={i}
                    x={50 + i * w + 1} y="192" width={w - 2} height="30" rx={4}
                    fill={`${headColors[i % headColors.length]}25`}
                    stroke={headColors[i % headColors.length]}
                    strokeWidth={1}
                  />
                );
              })}

              {/* W_O arrow */}
              <line x1="300" y1="228" x2="300" y2="245" stroke={C.accent} strokeWidth={2} markerEnd="url(#arrowhead-mha)" />
              <text x="320" y="240" fill={C.accent} fontSize="11">× W_O</text>

              {/* Output bar */}
              <rect x="50" y="250" width="500" height="30" rx="6" fill={`${C.accent}15`} stroke={C.accent} strokeWidth={1} />
              <text x="300" y="270" fill={C.accent} fontSize="11" textAnchor="middle" fontWeight={600}>
                출력 ({dModel}차원)
              </text>

              <defs>
                <marker id="arrowhead-mha" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={C.accent} />
                </marker>
              </defs>
            </svg>
          )}

          {isValid && (
            <div style={{
              marginTop: 12,
              padding: "0.75rem 1rem",
              background: C.surface,
              borderRadius: 8,
              fontSize: "0.85em",
              color: C.textDim,
              fontFamily: "var(--font-mono)",
            }}>
              W_Q, W_K, W_V: 각 {dModel}×{dk} × {numHeads}개 = {dModel * dk * numHeads * 3} params
              <br />
              W_O: {dModel}×{dModel} = {dModel * dModel} params
            </div>
          )}
        </Panel>
      )}
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 4 — Transformer 블록과 Residual Stream
   ══════════════════════════════════════════════════════ */

function TransformerBlockSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [numLayers, setNumLayers] = useState(2);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  const tooltips = {
    attn: "Attention: 다른 토큰의 정보를 읽어서 residual stream에 씁니다.",
    ffn: "FFN: 현재 토큰의 stream 상태를 읽어서 가공한 결과를 stream에 씁니다.",
    ln: "LayerNorm: 벡터의 크기를 정규화하여 학습 안정성을 높입니다.",
  };

  return (
    <section>
      <SectionTitle subtitle="Residual Stream과 정보의 흐름">4. Transformer 블록</SectionTitle>

      <P>
        Transformer 블록 하나의 구조는 다음과 같습니다:
        <strong style={{ color: C.green }}> Self-Attention → Add &amp; LayerNorm → FFN → Add &amp; LayerNorm</strong>.
      </P>
      <P>
        <strong style={{ color: C.green }}>FFN(Feed-Forward Network)</strong>은 2층 fully-connected network입니다.
        Attention이 &quot;토큰 간 정보 교환&quot;이라면, FFN은 &quot;각 토큰 내부에서의 정보 처리&quot;입니다.
      </P>

      <MathBlock>{'\\text{FFN}(x) = W_2 \\cdot \\text{ReLU}(W_1 x + b_1) + b_2'}</MathBlock>

      <P>
        <strong style={{ color: C.green }}>Residual connection</strong>: <Eq>{'x + \\text{sublayer}(x)'}</Eq>.
        &quot;기존 정보를 유지하면서 새로운 정보를 추가&quot;하는 구조입니다.
      </P>

      <Box label="핵심 관점 전환" color={C.green}>
        <div style={{ color: C.textDim }}>
          Residual connection을 단순한 gradient 흐름 개선 장치가 아닌,{' '}
          <strong style={{ color: C.green }}>정보가 흐르는 공유 통신 버스(residual stream)</strong>로 재해석할 수 있습니다.
          각 구성요소(attention head, FFN)는 이 stream에서 정보를 읽고 쓰는 것입니다.
        </div>
      </Box>

      <MathBlock>{'h_l = h_0 + \\sum_{i=1}^{l} \\text{attn}_i + \\sum_{i=1}^{l} \\text{ffn}_i'}</MathBlock>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Residual connection이 없다면(즉, 각 layer가 입력을 완전히 변환한다면),
        12개 layer를 쌓았을 때 초기 임베딩 정보는 어떻게 될까요?
      </Question>
      <Answer visible={q1}>
        각 layer가 입력을 완전히 변환하면, 초기 임베딩 정보는 12번의 변환을 거치며 원래 형태를 잃어버릴 수 있습니다.
        Residual connection은 원래 정보를 그대로 유지하면서 각 layer가{' '}
        <strong style={{ color: C.green }}>&quot;수정 사항&quot;만 더하도록</strong> 하여,
        깊은 네트워크에서도 초기 정보가 보존됩니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            Residual stream 관점에서 보면, attention head와 FFN 각각은 stream에 대해 어떤 연산을 하는 것일까요?
          </Question>
          <Answer visible={q2}>
            둘 다 residual stream에서 현재 상태를 <strong style={{ color: C.green }}>읽고</strong>,
            자신의 연산 결과를 stream에 <strong style={{ color: C.green }}>더하는(쓰는)</strong> 것입니다.
            Attention은 다른 토큰의 정보를 읽어서 stream에 쓰고,
            FFN은 현재 토큰의 stream 상태를 읽어서 가공한 결과를 stream에 씁니다.
            이 &quot;읽기-쓰기&quot; 관점이 Week 1 논문{' '}
            <em>A Mathematical Framework for Transformer Circuits</em>의 핵심 프레임워크입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Residual Stream 흐름도">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ color: C.textMuted, fontSize: "0.85em" }}>Layer 수:</span>
            <input
              type="range"
              min={1} max={4} step={1}
              value={numLayers}
              onChange={(e) => setNumLayers(parseInt(e.target.value))}
              style={{ width: 120 }}
            />
            <span style={{ color: C.accent, fontFamily: "var(--font-mono)", fontSize: "0.85em" }}>{numLayers}</span>
          </div>

          {hoveredComponent && (
            <div style={{
              padding: "0.5rem 0.75rem",
              background: `${C.green}15`,
              border: `1px solid ${C.green}40`,
              borderRadius: 8,
              color: C.green,
              fontSize: "0.85em",
              marginBottom: 12,
            }}>
              {tooltips[hoveredComponent]}
            </div>
          )}

          <svg
            viewBox={`0 0 300 ${130 + numLayers * 160}`}
            style={{ width: "100%", maxWidth: 350, display: "block", margin: "0 auto" }}
          >
            <defs>
              <marker id="arrowhead-rs" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.accent} />
              </marker>
            </defs>

            {/* Top: Token Embedding */}
            <rect x="60" y="10" width="180" height="35" rx="8"
              fill={`${C.blue}20`} stroke={C.blue} strokeWidth={1} />
            <text x="150" y="32" fill={C.blue} fontSize="11" textAnchor="middle" fontWeight={600}>
              Token Emb + Pos Enc
            </text>

            {/* Main residual stream line */}
            <line x1="150" y1="45" x2="150" y2={90 + numLayers * 160}
              stroke={C.accent} strokeWidth={3} opacity={0.6} />

            {/* Transformer blocks */}
            {Array.from({ length: numLayers }).map((_, i) => {
              const y = 65 + i * 160;
              return (
                <g key={i}>
                  {/* Block label */}
                  <text x="15" y={y + 55} fill={C.textMuted} fontSize="10" fontWeight={600}>
                    Block {i + 1}
                  </text>

                  {/* Attention branch */}
                  <line x1="150" y1={y + 10} x2="225" y2={y + 10} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />
                  <line x1="225" y1={y + 10} x2="225" y2={y + 40} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />
                  <rect x="185" y={y + 40} width="80" height="30" rx="6"
                    fill={hoveredComponent === "attn" ? `${C.accent}30` : `${C.accent}15`}
                    stroke={C.accent} strokeWidth={1}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredComponent("attn")}
                    onMouseLeave={() => setHoveredComponent(null)}
                  />
                  <text x="225" y={y + 60} fill={C.accent} fontSize="10" textAnchor="middle">Attention</text>
                  <line x1="225" y1={y + 70} x2="225" y2={y + 85} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />
                  <line x1="225" y1={y + 85} x2="150" y2={y + 85} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />

                  {/* Plus sign */}
                  <circle cx="150" cy={y + 85} r="8" fill={C.surface} stroke={C.accent} strokeWidth={1} />
                  <text x="150" y={y + 89} fill={C.accent} fontSize="12" textAnchor="middle">+</text>

                  {/* LayerNorm after attention */}
                  <rect x="125" y={y + 98} width="50" height="18" rx="4"
                    fill={hoveredComponent === "ln" ? `${C.yellow}25` : `${C.yellow}10`}
                    stroke={`${C.yellow}50`} strokeWidth={0.5}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredComponent("ln")}
                    onMouseLeave={() => setHoveredComponent(null)}
                  />
                  <text x="150" y={y + 111} fill={C.yellow} fontSize="8" textAnchor="middle">LN</text>

                  {/* FFN branch */}
                  <line x1="150" y1={y + 120} x2="225" y2={y + 120} stroke={C.green} strokeWidth={1} strokeDasharray="3,3" />
                  <line x1="225" y1={y + 120} x2="225" y2={y + 130} stroke={C.green} strokeWidth={1} strokeDasharray="3,3" />
                  <rect x="195" y={y + 130} width="60" height="30" rx="6"
                    fill={hoveredComponent === "ffn" ? `${C.green}30` : `${C.green}15`}
                    stroke={C.green} strokeWidth={1}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredComponent("ffn")}
                    onMouseLeave={() => setHoveredComponent(null)}
                  />
                  <text x="225" y={y + 150} fill={C.green} fontSize="10" textAnchor="middle">FFN</text>
                  <line x1="225" y1={y + 160} x2="225" y2={y + 170} stroke={C.green} strokeWidth={1} strokeDasharray="3,3" />
                  <line x1="225" y1={y + 170} x2="150" y2={y + 170} stroke={C.green} strokeWidth={1} strokeDasharray="3,3" />

                  {/* Plus sign */}
                  {i < numLayers && (
                    <>
                      <circle cx="150" cy={y + 170} r="8" fill={C.surface} stroke={C.green} strokeWidth={1} />
                      <text x="150" y={y + 174} fill={C.green} fontSize="12" textAnchor="middle">+</text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Bottom: Output */}
            <rect x="40" y={80 + numLayers * 160} width="220" height="35" rx="8"
              fill={`${C.orange}20`} stroke={C.orange} strokeWidth={1} />
            <text x="150" y={102 + numLayers * 160} fill={C.orange} fontSize="10" textAnchor="middle" fontWeight={600}>
              Unembedding → Logits → Softmax
            </text>
          </svg>
        </Panel>
      )}
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 5 — 최종 출력과 Logit Lens
   ══════════════════════════════════════════════════════ */

function OutputAndLogitLensSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(11);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(null);

  // Simulated Logit Lens data for "The Eiffel Tower is located in ___"
  const layerData = [
    { layer: 0, top5: [["the", 0.12], ["a", 0.10], ["and", 0.08], ["is", 0.07], ["of", 0.06]] },
    { layer: 1, top5: [["the", 0.14], ["a", 0.09], ["is", 0.07], ["France", 0.04], ["it", 0.04]] },
    { layer: 2, top5: [["the", 0.11], ["a", 0.08], ["France", 0.07], ["Europe", 0.05], ["is", 0.05]] },
    { layer: 3, top5: [["France", 0.13], ["the", 0.09], ["Europe", 0.08], ["a", 0.06], ["Paris", 0.05]] },
    { layer: 4, top5: [["France", 0.18], ["Europe", 0.10], ["Paris", 0.09], ["the", 0.07], ["a", 0.04]] },
    { layer: 5, top5: [["France", 0.22], ["Paris", 0.15], ["Europe", 0.08], ["the", 0.05], ["a", 0.03]] },
    { layer: 6, top5: [["Paris", 0.25], ["France", 0.20], ["Europe", 0.06], ["the", 0.04], ["a", 0.02]] },
    { layer: 7, top5: [["Paris", 0.32], ["France", 0.18], ["Europe", 0.05], ["the", 0.03], ["a", 0.02]] },
    { layer: 8, top5: [["Paris", 0.42], ["France", 0.15], ["Europe", 0.04], ["the", 0.02], ["Lyon", 0.02]] },
    { layer: 9, top5: [["Paris", 0.55], ["France", 0.12], ["Europe", 0.03], ["Lyon", 0.02], ["the", 0.01]] },
    { layer: 10, top5: [["Paris", 0.68], ["France", 0.08], ["Lyon", 0.02], ["Europe", 0.02], ["the", 0.01]] },
    { layer: 11, top5: [["Paris", 0.82], ["France", 0.05], ["Lyon", 0.02], ["Europe", 0.01], ["the", 0.01]] },
  ];

  useEffect(() => {
    if (isPlaying) {
      let layer = 0;
      setSelectedLayer(0);
      playRef.current = setInterval(() => {
        layer++;
        if (layer > 11) {
          clearInterval(playRef.current);
          setIsPlaying(false);
          return;
        }
        setSelectedLayer(layer);
      }, 600);
    }
    return () => clearInterval(playRef.current);
  }, [isPlaying]);

  const tokenColor = (token) => {
    if (token === "Paris") return C.accent;
    if (token === "France") return C.blue;
    if (token === "Europe") return C.purple;
    return C.textDim;
  };

  return (
    <section>
      <SectionTitle subtitle="중간 layer의 예측 상태 관찰">5. 최종 출력과 Logit Lens</SectionTitle>

      <P>
        마지막 layer의 출력 벡터에 <strong style={{ color: C.orange }}>Unembedding matrix <Eq>{'W_U'}</Eq></strong>를 곱하면
        logit 벡터가 되고, softmax를 적용하면 다음 토큰의 확률분포를 얻습니다.
      </P>

      <MathBlock>{'\\text{logits} = W_U \\cdot h_{\\text{final}}'}</MathBlock>
      <MathBlock>{'P(\\text{next token}) = \\text{softmax}(\\text{logits})'}</MathBlock>

      <P>
        <strong style={{ color: C.orange }}>Logit Lens</strong>의 아이디어:
        <Eq>{'W_U'}</Eq>를 마지막 layer뿐 아니라 <strong style={{ color: C.orange }}>중간 layer</strong>에도 적용하면,
        그 시점까지의 &quot;중간 예측 상태&quot;를 관찰할 수 있습니다.
        이것이 작동하는 이유는 residual stream 구조 덕분에 모든 layer가 같은 벡터 공간에서 정보를 누적하기 때문입니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        12개 layer를 가진 모델에서 Logit Lens로 관찰할 수 있는 &quot;중간 예측 상태&quot;는 최대 몇 개일까요? (초기 임베딩 포함, 최종 출력 제외)
      </Question>
      <Answer visible={q1}>
        초기 임베딩(layer 0 출력)부터 layer 11의 출력까지, 총 <strong style={{ color: C.orange }}>12개</strong>의 중간 예측 상태를
        관찰할 수 있습니다. 초기 임베딩에도 <Eq>{'W_U'}</Eq>를 적용할 수 있는데, 이 경우 모델이 아무런 처리도 하지 않은 상태에서
        &quot;토큰의 정체성만으로 예측한 결과&quot;를 보여줍니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            만약 residual connection이 없었다면, Logit Lens는 왜 작동하지 않을 수 있을까요?
          </Question>
          <Answer visible={q2}>
            Residual connection이 없으면 각 layer가 벡터를 완전히 다른 표현 공간으로 변환할 수 있습니다.
            중간 layer의 출력이 최종 layer의 출력과 전혀 다른 공간에 있다면,
            최종 layer용으로 학습된 <Eq>{'W_U'}</Eq>를 적용해도 해석 가능한 결과가 나온다는 보장이 없습니다.
            <strong style={{ color: C.green }}> Residual stream</strong>은 모든 layer가 같은 공간에서 정보를 누적하도록 강제하므로,
            <Eq>{'W_U'}</Eq>가 어느 지점에서든 의미 있게 작동합니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Logit Lens 시뮬레이터">
          <div style={{
            padding: "0.75rem 1rem",
            background: C.surface,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: "0.9em",
          }}>
            <span style={{ color: C.textMuted }}>입력: </span>
            <span style={{ color: C.text }}>&quot;The Eiffel Tower is located in</span>
            <span style={{
              color: C.accent,
              background: `${C.accent}20`,
              padding: "2px 6px",
              borderRadius: 4,
              marginLeft: 4,
            }}>___</span>
            <span style={{ color: C.text }}>&quot;</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
            <Btn
              onClick={() => { if (!isPlaying) setIsPlaying(true); }}
              active={isPlaying}
              color={C.orange}
            >
              {isPlaying ? "재생 중..." : "▶ 재생"}
            </Btn>
            <span style={{ color: C.textMuted, fontSize: "0.85em" }}>
              Layer: <span style={{ color: C.orange, fontWeight: 700 }}>{selectedLayer}</span> / 11
            </span>
          </div>

          {/* Layer selector */}
          <div style={{ overflowX: "auto" }}>
            <svg viewBox="0 0 600 340" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
              {/* Layer rows */}
              {layerData.map((ld, i) => {
                const y = 10 + i * 26;
                const isSelected = selectedLayer === i;
                return (
                  <g
                    key={i}
                    onClick={() => { setSelectedLayer(i); setIsPlaying(false); clearInterval(playRef.current); }}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Layer label */}
                    <text x="5" y={y + 16} fill={isSelected ? C.orange : C.textMuted} fontSize="11"
                      fontWeight={isSelected ? 700 : 400} fontFamily="var(--font-mono)">
                      L{String(i).padStart(2, "0")}
                    </text>

                    {/* Background */}
                    {isSelected && (
                      <rect x="35" y={y} width="555" height="24" rx="4" fill={`${C.orange}10`} />
                    )}

                    {/* Bars */}
                    {ld.top5.map(([token, prob], j) => {
                      const barX = 40 + j * 110;
                      const barWidth = prob * 200;
                      return (
                        <g key={j}>
                          <rect
                            x={barX} y={y + 3} width={barWidth} height={18} rx="3"
                            fill={isSelected ? `${tokenColor(token)}50` : `${tokenColor(token)}20`}
                          />
                          <text x={barX + 3} y={y + 16} fill={isSelected ? tokenColor(token) : C.textMuted}
                            fontSize="10" fontWeight={token === "Paris" ? 600 : 400}>
                            {token} {isSelected ? `(${(prob * 100).toFixed(0)}%)` : ""}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected layer detail */}
          <div style={{ marginTop: 12 }}>
            <div style={{ color: C.textMuted, fontSize: "0.85em", marginBottom: 8 }}>
              Layer {selectedLayer} — Top-5 확률분포:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {layerData[selectedLayer].top5.map(([token, prob]) => (
                <div key={token} style={{
                  padding: "6px 12px",
                  background: `${tokenColor(token)}15`,
                  border: `1px solid ${tokenColor(token)}40`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <span style={{ color: tokenColor(token), fontWeight: 600 }}>{token}</span>
                  <span style={{ color: C.textMuted, fontSize: "0.85em", fontFamily: "var(--font-mono)" }}>
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: C.textMuted, fontSize: "0.85em", marginTop: 16 }}>
            초기 layer에서는 고빈도 토큰이 상위에 위치하다가, 중간 layer부터 &quot;Paris&quot;가 등장하여 점점 지배적이 됩니다.
            이 시뮬레이션은 교육용 목업이며, 실제 모델의 Logit Lens 결과와 유사한 패턴을 보여줍니다.
          </p>
        </Panel>
      )}
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 6 — 요약: Week 1 논문으로의 다리
   ══════════════════════════════════════════════════════ */

function Summary() {
  const cards = [
    { label: "토큰과 임베딩", color: C.blue, desc: "텍스트 → 토큰 ID → 고차원 벡터 + 위치 정보" },
    { label: "Self-Attention", color: C.accent, desc: "softmax(QKᵀ/√d_k)V — 토큰 간 선택적 정보 교환" },
    { label: "Multi-Head Attention", color: C.purple, desc: "여러 head가 독립적 관계 패턴을 포착, concat + W_O로 재조합" },
    { label: "Residual Stream", color: C.green, desc: "x + sublayer(x) — 정보가 누적되는 공유 통신 버스" },
    { label: "Unembedding과 Logit Lens", color: C.orange, desc: "W_U를 중간 layer에 적용하여 예측 상태 관찰" },
  ];

  return (
    <section>
      <SectionTitle subtitle="Week 1 논문으로의 다리">6. 요약</SectionTitle>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 12,
        margin: "1.5rem 0",
      }}>
        {cards.map(({ label, color, desc }) => (
          <div key={label} style={{
            padding: "1rem 1.25rem",
            background: `${color}10`,
            border: `1px solid ${color}30`,
            borderRadius: 12,
            borderTop: `3px solid ${color}`,
          }}>
            <div style={{ color, fontWeight: 700, fontSize: "0.9em", marginBottom: 6 }}>{label}</div>
            <div style={{ color: C.textDim, fontSize: "0.85em", lineHeight: 1.7 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Box label="Week 1 논문 연결 포인트" color={C.accent}>
        <div style={{ color: C.textDim }}>
          <P>
            Elhage et al.의 <em style={{ color: C.accent }}>A Mathematical Framework for Transformer Circuits</em>는
            이 글에서 다룬 개념들을 토대로, residual stream을 중심축으로 삼아 개별 attention head의 기능을
            <strong style={{ color: C.accent }}> Q-K circuit</strong>(어디에 주목?)과{' '}
            <strong style={{ color: C.accent }}>O-V circuit</strong>(무슨 정보를 가져올?)으로 분해하여 분석합니다.
          </P>
          <P>
            Logit Lens는 이 프레임워크의 직접적 응용이며,
            이후 <strong style={{ color: C.purple }}>causal tracing</strong>,{' '}
            <strong style={{ color: C.purple }}>path patching</strong> 등
            더 정교한 분석 기법의 출발점이 됩니다.
          </P>
        </div>
      </Box>
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */

export default function TransformerArchitectureBlog() {
  return (
    <div style={{ color: C.text, fontFamily: "var(--font-sans)", lineHeight: 1.7 }}>
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
      `}</style>
      <article>
        <section style={{ marginBottom: "5rem" }}><Introduction /></section>
        <section style={{ marginBottom: "5rem" }}><TokenEmbeddingSection /></section>
        <section style={{ marginBottom: "5rem" }}><SelfAttentionSection /></section>
        <section style={{ marginBottom: "5rem" }}><MultiHeadAttentionSection /></section>
        <section style={{ marginBottom: "5rem" }}><TransformerBlockSection /></section>
        <section style={{ marginBottom: "5rem" }}><OutputAndLogitLensSection /></section>
        <section style={{ marginBottom: "5rem" }}><Summary /></section>
      </article>
    </div>
  );
}
