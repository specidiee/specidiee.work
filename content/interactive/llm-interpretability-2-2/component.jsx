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
const Btn = ({ children, onClick, active, color = C.accent, style: sx, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "8px 16px",
      background: active ? `${color}30` : `${color}10`,
      border: `1px solid ${active ? color : `${color}40`}`,
      borderRadius: 8,
      color: active ? color : C.textDim,
      fontSize: "0.85em",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      opacity: disabled ? 0.4 : 1,
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
    { label: "Causal Tracing: 사실의 위치 찾기", color: C.blue },
    { label: "Tracing 결과: 두 개의 결정적 site", color: C.accent, highlight: true },
    { label: "ROME: 사실 편집하기", color: C.green, highlight: true },
    { label: "편집 결과 평가", color: C.orange },
    { label: "정리 + 다음 단계", color: C.purple },
  ];

  return (
    <>
      <SectionTitle subtitle="고정된 메모리를 편집할 수 있을까?">0. Introduction</SectionTitle>

      <P>
        <GradLink href="/blog/llm-interpretability-2-1">이전 글</GradLink>에서 FFN이{" "}
        <strong style={{ color: C.accent }}>key-value memory</strong>로 기능한다는 것을 확인했습니다.{" "}
        <Eq>{'W_1'}</Eq>의 행이 key, <Eq>{'W_2'}</Eq>의 열이 value로, 훈련 후 고정된 사실 저장소 역할을 합니다.
      </P>

      <P>
        이전 글의 마지막에 두 가지 질문을 남겼습니다:
      </P>

      <Box label="핵심 질문" color={C.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.blue, fontWeight: 700, flexShrink: 0 }}>어디에?</span>
            <span style={{ color: C.textDim }}>
              "에펠탑은 파리에 있다"라는 사실이 48개 층의 FFN 중 <strong style={{ color: C.blue }}>어느 층</strong>에 저장되어 있는가?
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>편집?</span>
            <span style={{ color: C.textDim }}>
              찾은 위치의 가중치를 수정하여, 모델이 "에펠탑은 로마에 있다"고 <strong style={{ color: C.green }}>믿게 만들 수</strong> 있는가?
            </span>
          </div>
        </div>
      </Box>

      <P>
        Meng et al.의 논문 <em>"Locating and Editing Factual Associations in GPT"</em> (NeurIPS 2022)은
        이 두 질문에 각각 <strong style={{ color: C.blue }}>Causal Tracing</strong>과{" "}
        <strong style={{ color: C.green }}>Rank-One Model Editing (ROME)</strong>으로 답합니다.
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
   SECTION 1 — Causal Tracing 방법론
   ══════════════════════════════════════════════════════ */

const TOKENS = ["The", "Space", "Needle", "is", "in", "downtown"];
const LAYERS = 12;

// IE[token][layer] — mock indirect effect values
// High at mid-layers for "Needle" (early site), moderate at high layers for "downtown" (late site)
const IE_MAP = (() => {
  const map = [];
  for (let t = 0; t < TOKENS.length; t++) {
    map[t] = [];
    for (let l = 0; l < LAYERS; l++) {
      let v = 0.02 + Math.random() * 0.03; // baseline noise
      if (t === 2) { // "Needle" - early site
        if (l >= 4 && l <= 8) v = 0.3 + (l === 6 ? 0.55 : l === 5 || l === 7 ? 0.4 : 0.25);
        if (l >= 9 && l <= 10) v = 0.1;
      }
      if (t === 1) { // "Space" - weaker early site
        if (l >= 4 && l <= 8) v = 0.08 + (l === 6 ? 0.2 : 0.05);
      }
      if (t === 5) { // "downtown" - late site
        if (l >= 9 && l <= 11) v = 0.15 + (l === 10 ? 0.25 : l === 11 ? 0.2 : 0.1);
      }
      map[t][l] = Math.min(v, 0.95);
    }
  }
  return map;
})();

function CausalTracingSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [tab, setTab] = useState(0); // 0=clean, 1=corrupt, 2=restore
  const [restored, setRestored] = useState(null); // {token, layer}

  const getOutputForTab = () => {
    if (tab === 0) return { token: "Seattle", prob: 72 };
    if (tab === 1) return { token: "the", prob: 8 };
    if (tab === 2 && restored) {
      const ie = IE_MAP[restored.token][restored.layer];
      const recoveredProb = Math.round(8 + ie * 80);
      if (ie > 0.5) return { token: "Seattle", prob: recoveredProb };
      if (ie > 0.2) return { token: "Seattle", prob: recoveredProb };
      return { token: "the", prob: Math.round(8 + ie * 15) };
    }
    return { token: "???", prob: 0 };
  };

  const output = getOutputForTab();

  const getCellColor = (t, l) => {
    if (tab === 0) return `${C.accent}25`;
    if (tab === 1) {
      if ((t === 1 || t === 2) && l === 0) return `${C.red}60`;
      if (t === 1 || t === 2) return `${C.red}${Math.max(10, 40 - l * 3).toString(16).padStart(2, "0")}`;
      return `${C.textMuted}15`;
    }
    if (tab === 2) {
      if (restored && restored.token === t && restored.layer === l) {
        const ie = IE_MAP[t][l];
        const intensity = Math.round(20 + ie * 60);
        return `${C.green}${intensity.toString(16).padStart(2, "0")}`;
      }
      if ((t === 1 || t === 2) && l === 0) return `${C.red}50`;
      if (t === 1 || t === 2) return `${C.red}${Math.max(10, 30 - l * 2).toString(16).padStart(2, "0")}`;
      return `${C.textMuted}15`;
    }
    return `${C.textMuted}10`;
  };

  return (
    <>
      <SectionTitle subtitle="인과적 개입으로 사실의 위치를 찾다">1. Causal Tracing 방법론</SectionTitle>

      <P>
        사실을 knowledge tuple <Eq>{'t = (s, r, o)'}</Eq>로 표현합니다:
        subject, relation, object.
        예: <strong style={{ color: C.accent }}>(Space Needle, located in, Seattle)</strong>.
      </P>

      <P>
        프롬프트 "The Space Needle is in downtown ___"을 넣으면 모델이 "Seattle"을 예측합니다.
        모델 내부의 어떤 구성요소가 이 사실을 '기억'하는 데 결정적인 역할을 하는지 찾고 싶습니다.
        이를 위해 <strong style={{ color: C.blue }}>세 번</strong> 모델을 실행합니다.
      </P>

      <Box label="Step 1: Clean Run" color={C.accent}>
        프롬프트를 정상적으로 넣고, 모든 층의 모든 hidden state를 기록합니다: <Eq>{'\\{h_i^{(l)}\\}'}</Eq>.
        이것이 <strong style={{ color: C.accent }}>정답을 알고 있는 상태</strong>의 스냅샷입니다.
      </Box>

      <Box label="Step 2: Corrupted Run" color={C.red}>
        Subject 토큰("Space", "Needle")의 임베딩에 가우시안 노이즈를 추가합니다.
        모델이 subject를 제대로 인식하지 못해 <strong style={{ color: C.red }}>오답을 출력</strong>합니다.
        <MathBlock>{'h_i^{(0)} := h_i^{(0)} + \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, \\nu)'}</MathBlock>
      </Box>

      <Box label="Step 3: Corrupted-with-Restoration" color={C.green}>
        Corrupted 상태에서 모델을 돌리되, <strong style={{ color: C.green }}>특정 층, 특정 토큰 위치</strong>의
        hidden state만 Clean Run의 값으로 교체합니다. 이 하나의 복원만으로 정답이 돌아오면 →{" "}
        <strong style={{ color: C.green }}>그 위치가 인과적으로 결정적</strong>입니다.
      </Box>

      <Box label="왜 '인과적'인가?" color={C.blue}>
        단순히 gradient가 크다거나 activation이 크다는 것으로는 해당 구성요소가 정말로 결과에 영향을 미치는지
        알 수 없습니다 (상관관계 ≠ 인과관계). Causal Tracing은{" "}
        <strong style={{ color: C.blue }}>직접 개입(intervention)</strong>하여 결과가 바뀌는지를 확인하므로,
        인과적 결론을 내릴 수 있습니다.
      </Box>

      <MathBlock>{'\\text{IE}(h_i^{(l)}) = \\mathbb{P}_{*, \\text{clean } h_i^{(l)}}[o] - \\mathbb{P}_*[o]'}</MathBlock>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Corrupted Run에서 subject 토큰에만 노이즈를 추가하고, 나머지 토큰('is', 'in', 'downtown')은
        그대로 둡니다. 왜 subject만 오염시킬까요?
      </Question>

      <Answer visible={q1}>
        우리가 찾고 싶은 것은 <strong style={{ color: C.accent }}>subject에 대한 사실 지식</strong>이 어디에
        저장되어 있는가입니다. 'is in downtown'은 relation을 나타내는 부분으로, 어떤 종류의 사실을 물어보는지를
        알려줍니다. Subject만 오염시키면, 모델이 "something is in downtown ___"이라는 구조는 이해하되{" "}
        <strong style={{ color: C.accent }}>무엇에 대한</strong> 사실인지를 모르는 상태가 됩니다.
        이 상태에서 특정 위치를 복원했을 때 정답이 돌아오면, 그 위치에 subject의 정체성과 관련된 사실이
        저장되어 있다는 것입니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            모든 층의 모든 토큰 위치에 대해 restoration을 시도하면, 결과는 어떤 형태로 시각화할 수 있을까요?
          </Question>

          <Answer visible={q2}>
            각 (층, 토큰 위치) 조합의 Indirect Effect 값을{" "}
            <strong style={{ color: C.accent }}>히트맵</strong>으로 그릴 수 있습니다.
            X축이 층 번호, Y축이 토큰 위치이고, 색상 강도가 IE의 크기를 나타냅니다.
            아래 시뮬레이터에서 직접 확인해보세요.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Causal Tracing 시뮬레이터">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn active={tab === 0} onClick={() => { setTab(0); setRestored(null); }} color={C.accent}>
              ① Clean Run
            </Btn>
            <Btn active={tab === 1} onClick={() => { setTab(1); setRestored(null); }} color={C.red}>
              ② Corrupted Run
            </Btn>
            <Btn active={tab === 2} onClick={() => { setTab(2); setRestored(null); }} color={C.green}>
              ③ Restore & Observe
            </Btn>
          </div>

          <svg viewBox="0 0 750 420" style={{ width: "100%", maxWidth: 750, display: "block", margin: "0 auto" }}>
            {/* Layer labels (X axis) */}
            {Array.from({ length: LAYERS }, (_, l) => (
              <text key={`ll-${l}`} x={120 + l * 42 + 16} y={16} fill={C.textMuted}
                fontSize={9} textAnchor="middle">
                L{l}
              </text>
            ))}

            {/* Token labels (Y axis) + Grid */}
            {TOKENS.map((tok, t) => {
              const y = 28 + t * 48;
              const isSubject = t === 1 || t === 2;
              return (
                <g key={`row-${t}`}>
                  <text x={10} y={y + 24} fill={isSubject && tab >= 1 ? C.red : C.textDim}
                    fontSize={11} fontWeight={isSubject ? 600 : 400}>
                    {tok}
                  </text>

                  {Array.from({ length: LAYERS }, (_, l) => {
                    const cx = 120 + l * 42;
                    const isRestored = restored && restored.token === t && restored.layer === l;
                    return (
                      <rect key={`cell-${t}-${l}`}
                        x={cx} y={y} width={36} height={38} rx={4}
                        fill={getCellColor(t, l)}
                        stroke={isRestored ? C.green : "transparent"}
                        strokeWidth={isRestored ? 2 : 0}
                        style={{ cursor: tab === 2 ? "pointer" : "default", transition: "fill 0.3s ease" }}
                        onClick={() => {
                          if (tab === 2) setRestored({ token: t, layer: l });
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Output area */}
            <rect x={640} y={28} width={100} height={260} rx={10}
              fill={C.surface} stroke={C.border} strokeWidth={1} />
            <text x={690} y={20} fill={C.textMuted} fontSize={10} textAnchor="middle">출력</text>

            <text x={690} y={130} fill={output.token === "Seattle" ? C.green : C.textMuted}
              fontSize={18} fontWeight={700} textAnchor="middle"
              style={{ transition: "all 0.3s ease" }}>
              {output.token}
            </text>
            <text x={690} y={155} fill={C.textDim} fontSize={12} textAnchor="middle">
              {output.prob}%
            </text>

            {/* Probability bar */}
            <rect x={660} y={170} width={60} height={8} rx={4} fill={`${C.textMuted}20`} />
            <rect x={660} y={170}
              width={Math.round(output.prob * 0.6)} height={8} rx={4}
              fill={output.token === "Seattle" ? C.green : C.textMuted}
              style={{ transition: "width 0.4s ease" }} />

            {/* Caption */}
            <text x={375} y={345} fill={C.textMuted} fontSize={9} textAnchor="middle">
              {tab === 0 && "정상 실행 — 모든 hidden state가 깨끗한 상태"}
              {tab === 1 && "Subject 토큰에 노이즈 추가 — 모델이 subject를 인식하지 못함"}
              {tab === 2 && !restored && "셀을 클릭하여 해당 위치를 복원하고 인과 효과를 확인하세요"}
              {tab === 2 && restored && `Layer ${restored.layer}, "${TOKENS[restored.token]}" 위치 복원 — IE = ${IE_MAP[restored.token][restored.layer].toFixed(2)}`}
            </text>

            {/* Legend */}
            {tab === 2 && restored && (
              <>
                <rect x={200} y={370} width={12} height={12} rx={2} fill={`${C.green}60`} />
                <text x={218} y={380} fill={C.textDim} fontSize={9}>높은 인과 효과</text>
                <rect x={340} y={370} width={12} height={12} rx={2} fill={`${C.green}20`} />
                <text x={358} y={380} fill={C.textDim} fontSize={9}>낮은 인과 효과</text>
              </>
            )}
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.8em", textAlign: "center", marginTop: 8 }}>
            클릭하여 각 위치의 인과적 중요도를 확인하세요. 이 시뮬레이터는 교육용 목업입니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 2 — Causal Tracing 결과 해석
   ══════════════════════════════════════════════════════ */

function TracingResultsSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [hoveredArea, setHoveredArea] = useState(null);

  return (
    <>
      <SectionTitle subtitle="두 개의 결정적 site">2. Causal Tracing 결과 해석</SectionTitle>

      <P>
        Meng et al.은 이 실험을 1000개의 사실 진술에 대해 수행하고,
        결과를 평균하여 Average Indirect Effect (AIE) 히트맵을 만들었습니다.
      </P>

      <Box label="핵심 발견 #1 — Early Site" color={C.green}>
        <strong style={{ color: C.green }}>중간 층</strong>(GPT-2 XL에서 약 15~18번째 층)에서,{" "}
        <strong style={{ color: C.accent }}>subject의 마지막 토큰</strong> 위치에서 강한 인과 효과가 나타납니다.
        이 효과를 MLP 기여분과 Attention 기여분으로 분리하면,{" "}
        <strong style={{ color: C.green }}>MLP가 지배적</strong>입니다.
        <br /><br />
        의미: 중간 층의 MLP가 subject를 처리하면서 해당 subject에 대한{" "}
        <strong style={{ color: C.green }}>저장된 사실을 recall</strong>하고 있습니다.
        이것은 FFN이 key-value memory로 기능한다는 Geva et al.의 해석과 정확히 부합합니다.
      </Box>

      <Box label="핵심 발견 #2 — Late Site" color={C.purple}>
        <strong style={{ color: C.purple }}>마지막 토큰</strong> 위치의 높은 층에서도 강한 인과 효과가 나타나는데,
        여기서는 <strong style={{ color: C.purple }}>Attention이 지배적</strong>입니다.
        <br /><br />
        의미: 높은 층의 Attention이 MLP가 recall한 사실 정보를 마지막 토큰 위치로{" "}
        <strong style={{ color: C.purple }}>복사</strong>하여 출력에 사용합니다.
      </Box>

      <Box label="전체 메커니즘 가설" color={C.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: C.textDim }}>
            ① 중간 층 <strong style={{ color: C.green }}>MLP</strong>가 subject 토큰을 처리하며 사실을 recall → residual stream에 쓰기
          </span>
          <span style={{ color: C.textDim }}>
            ② 높은 층 <strong style={{ color: C.purple }}>Attention</strong>이 이 정보를 마지막 토큰으로 복사 → 출력에 반영
          </span>
          <span style={{ color: C.accent, fontWeight: 600, marginTop: 4 }}>
            이것이 Meng et al.이 제안하는 Localized Factual Association Hypothesis입니다.
          </span>
        </div>
      </Box>

      <P>
        autoregressive 모델에서 정보는 왼쪽에서 오른쪽으로만 흐르기 때문에,
        subject의 <strong style={{ color: C.accent }}>마지막 토큰</strong>이 subject 전체의 정보를 집약하는 위치가 됩니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Early site에서 MLP가 지배적이고, late site에서 Attention이 지배적이라는 것은,
        Transformer 블록의 <strong style={{ color: C.accent }}>Attention → FFN 순서</strong>와 어떤 관련이 있을까요?
      </Question>

      <Answer visible={q1}>
        각 층에서 Attention이 먼저 문맥 정보를 모으고, 그 다음 FFN이 모인 정보를 바탕으로 지식을 recall합니다.
        중간 층에서 이 recall이 일어나고, 높은 층에서는 recall된 정보가 이미 residual stream에 있으므로,
        Attention이 그것을 <strong style={{ color: C.purple }}>최종 출력 위치로 운반</strong>하는 역할에 집중하는 것입니다.
      </Answer>

      {q1 && (
        <Panel label="정보 흐름 다이어그램: Recall → Copy → Output">
          <svg viewBox="0 0 700 340" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Input tokens at bottom */}
            {["The", "Space", "Needle", "is", "in", "downtown", "___"].map((tok, i) => (
              <g key={`input-${i}`}>
                <rect x={30 + i * 90} y={290} width={70} height={28} rx={6}
                  fill={i === 2 ? `${C.accent}25` : i === 6 ? `${C.purple}20` : `${C.textMuted}10`}
                  stroke={i === 2 ? `${C.accent}60` : i === 6 ? `${C.purple}40` : `${C.textMuted}20`}
                  strokeWidth={1} />
                <text x={65 + i * 90} y={308} fill={i === 2 ? C.accent : i === 6 ? C.purple : C.textDim}
                  fontSize={10} textAnchor="middle" fontWeight={i === 2 || i === 6 ? 600 : 400}>
                  {tok}
                </text>
              </g>
            ))}

            {/* Early Site (mid layers, "Needle" position) */}
            <rect x={180} y={160} width={140} height={60} rx={10}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1.5}
              onMouseEnter={() => setHoveredArea("early")}
              onMouseLeave={() => setHoveredArea(null)}
              style={{ cursor: "default" }} />
            <text x={250} y={182} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={700}>
              MLP (중간 층)
            </text>
            <text x={250} y={198} fill={C.textMuted} fontSize={9} textAnchor="middle">
              Key-Value Lookup
            </text>
            <text x={250} y={212} fill={C.green} fontSize={9} textAnchor="middle">
              ① 사실 Recall
            </text>

            {/* Arrow from "Needle" up to MLP */}
            <line x1={250} y1={290} x2={250} y2={225} stroke={C.green} strokeWidth={1.5}
              strokeDasharray="4 4" markerEnd="url(#arrowG)" />

            {/* Late Site (high layers, last token) */}
            <rect x={430} y={70} width={160} height={60} rx={10}
              fill={`${C.purple}15`} stroke={C.purple} strokeWidth={1.5}
              onMouseEnter={() => setHoveredArea("late")}
              onMouseLeave={() => setHoveredArea(null)}
              style={{ cursor: "default" }} />
            <text x={510} y={92} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={700}>
              Attention (높은 층)
            </text>
            <text x={510} y={108} fill={C.textMuted} fontSize={9} textAnchor="middle">
              정보를 마지막 토큰으로 복사
            </text>
            <text x={510} y={122} fill={C.purple} fontSize={9} textAnchor="middle">
              ② 정보 복사
            </text>

            {/* Arrow from MLP to Attention */}
            <path d="M 320 190 Q 400 130 430 100" fill="none"
              stroke={C.accent} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#arrowA)" />
            <text x={390} y={140} fill={C.textDim} fontSize={8}>residual stream</text>

            {/* Output */}
            <rect x={480} y={10} width={100} height={36} rx={8}
              fill={`${C.accent}20`} stroke={C.accent} strokeWidth={1} />
            <text x={530} y={33} fill={C.accent} fontSize={13} textAnchor="middle" fontWeight={700}>
              Seattle
            </text>
            <text x={530} y={8} fill={C.accent} fontSize={9} textAnchor="middle">③ 출력</text>

            <line x1={510} y1={70} x2={530} y2={50} stroke={C.purple} strokeWidth={1.5}
              strokeDasharray="4 4" markerEnd="url(#arrowP)" />

            {/* Tooltip */}
            {hoveredArea === "early" && (
              <g>
                <rect x={100} y={130} width={240} height={24} rx={4} fill={C.surface} stroke={C.green} strokeWidth={1} />
                <text x={220} y={146} fill={C.green} fontSize={9} textAnchor="middle">
                  FFN이 "Needle → Seattle" 사실을 recall
                </text>
              </g>
            )}
            {hoveredArea === "late" && (
              <g>
                <rect x={380} y={40} width={260} height={24} rx={4} fill={C.surface} stroke={C.purple} strokeWidth={1} />
                <text x={510} y={56} fill={C.purple} fontSize={9} textAnchor="middle">
                  Attention이 recall된 정보를 출력 위치로 운반
                </text>
              </g>
            )}

            {/* Arrow markers */}
            <defs>
              <marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.green} />
              </marker>
              <marker id="arrowA" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.accent} />
              </marker>
              <marker id="arrowP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.purple} />
              </marker>
            </defs>
          </svg>
        </Panel>
      )}

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            이 가설이 맞다면, <strong style={{ color: C.green }}>중간 층 FFN의 가중치를 직접 수정</strong>하면
            모델이 '알고 있는 사실'을 바꿀 수 있을까요?
          </Question>

          <Answer visible={q2}>
            바로 그것이 <strong style={{ color: C.green }}>ROME</strong>의 핵심 아이디어입니다.
            Causal Tracing으로 '여기에 사실이 있다'는 것을 확인했으니,
            이제 그 위치의 가중치를 편집하는 것이 다음 단계입니다.
          </Answer>
        </>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 3 — ROME의 개념적 원리
   ══════════════════════════════════════════════════════ */

function ROMEConceptSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [step, setStep] = useState(0); // 0=initial, 1=key, 2=value, 3=update

  return (
    <>
      <SectionTitle subtitle="Rank-One Model Editing">3. ROME의 개념적 원리</SectionTitle>

      <P>
        Causal Tracing으로 중간 층 MLP가 사실 recall의 핵심이라는 것을 확인했습니다.
        이제 그 MLP의 가중치를 직접 수정하여 새로운 사실을 삽입해봅시다.
      </P>

      <P>
        이전 포스트를 복기하면: <Eq>{'W_2'}</Eq> (논문에서는 <Eq>{'W_{proj}'}</Eq>)가 value 행렬입니다.
        임의의 선형 변환 <Eq>{'W'}</Eq>는 key 집합과 value 집합에 대해{" "}
        <Eq>{'WK \\approx V'}</Eq>를 만족하는{" "}
        <strong style={{ color: C.accent }}>연관 메모리(associative memory)</strong>로 볼 수 있습니다.
        여기에 새로운 key-value 쌍 <Eq>{'(k^*, v^*)'}</Eq>를 하나 추가하고 싶습니다.
      </P>

      <Box label="Step 1: Key 선택 (k*)" color={C.blue}>
        <strong style={{ color: C.blue }}>"무엇에 대한 사실인가?"</strong><br />
        Subject("Space Needle")를 나타내는 벡터를 key로 사용합니다.
        구체적으로: subject를 포함하는 여러 문장을 모델에 넣고,
        중간 층 MLP 입력에서의 activation을 평균합니다.
        <br /><br />
        직관: "다양한 문맥에서 'Space Needle'이 나타날 때의 공통적인 내부 표현"
      </Box>

      <Box label="Step 2: Value 최적화 (v*)" color={C.orange}>
        <strong style={{ color: C.orange }}>"어떤 사실로 바꿀 것인가?"</strong><br />
        새로운 object("Paris")를 예측하게 만드는 벡터 <Eq>{'v^*'}</Eq>를 최적화로 찾습니다.
        이 벡터를 MLP 출력으로 삽입했을 때, 모델이 'Paris'를 높은 확률로 예측하도록 합니다.
        <br /><br />
        추가 제약: subject의 본질(essence)이 변하지 않도록 KL divergence 항을 추가합니다.
        예: "Space Needle은 건축물이다"라는 속성은 유지하면서 위치만 바꿉니다.
      </Box>

      <Box label="Step 3: Rank-One Update" color={C.green}>
        <strong style={{ color: C.green }}>새로운 사실을 삽입합니다.</strong>
        <MathBlock>{'\\hat{W} = W + \\Lambda (C^{-1} k^*)^T'}</MathBlock>
        여기서 <Eq>{'\\Lambda = (v^* - W k^*)'}</Eq>, <Eq>{'C = KK^T'}</Eq>는 기존 key들의 공분산입니다.
        <br /><br />
        핵심: <strong style={{ color: C.green }}>rank-one update</strong> = 행렬 전체를 바꾸는 것이 아니라,
        한 쌍의 벡터 외적(outer product)을 더하는 것입니다.
        비유하자면 "백과사전에서 한 항목만 수정하는 것이지, 책 전체를 다시 쓰는 것이 아닙니다."
      </Box>

      <Box label="왜 'Rank-One'인가?" color={C.green}>
        행렬에 rank-1 행렬(<Eq>{'\\Lambda u^T'}</Eq>, 두 벡터의 외적)을 더하면,
        행렬의 <strong style={{ color: C.green }}>한 방향</strong>만 변경됩니다.{" "}
        <Eq>{'k^*'}</Eq> 방향으로 들어오는 입력에 대해서만 출력이 바뀌고,
        다른 방향의 입력에 대해서는 원래 행렬과 거의 동일하게 동작합니다.
        이것이 specificity(다른 사실은 건드리지 않음)를 보장하는 수학적 원리입니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        ROME은 48층 중 하나의 층만 수정합니다.
        논문에서는 몇 번째 층을 선택했을까요? 그리고 그 근거는 무엇일까요?
      </Question>

      <Answer visible={q1}>
        GPT-2 XL에서 <strong style={{ color: C.accent }}>18번째 층</strong>을 선택했습니다.
        이것은 Causal Tracing에서 MLP의 인과 효과가 가장 강했던 early site의 중심 층입니다.
        즉, <strong style={{ color: C.blue }}>Causal Tracing의 결과가 ROME의 편집 위치를 직접적으로 결정</strong>합니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            만약 18번째 층 대신 1번째 층이나 47번째 층을 수정하면 어떻게 될까요?
          </Question>

          <Answer visible={q2}>
            편집 성능(generalization + specificity)은{" "}
            <strong style={{ color: C.green }}>중간 층에서 최고</strong>이고,
            초기 층이나 후반 층에서는 급격히 떨어집니다.
            특히 후반 층의 Attention을 수정하면, 사실이 일반화되지 못하고
            특정 프롬프트에서만 정답을 <strong style={{ color: C.red }}>'앵무새처럼' 반복</strong>하는
            현상(regurgitation)이 나타납니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="ROME 편집 시뮬레이터">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn active={step >= 1} onClick={() => setStep(1)} color={C.blue}>
              Step 1: Key 선택
            </Btn>
            <Btn active={step >= 2} onClick={() => step >= 1 && setStep(2)} color={C.orange}
              disabled={step < 1}>
              Step 2: Value 최적화
            </Btn>
            <Btn active={step >= 3} onClick={() => step >= 2 && setStep(3)} color={C.green}
              disabled={step < 2}>
              Step 3: Rank-One Update
            </Btn>
          </div>

          <svg viewBox="0 0 750 380" style={{ width: "100%", maxWidth: 750, display: "block", margin: "0 auto" }}>
            {/* FFN Layer diagram */}
            <text x={375} y={20} fill={C.textMuted} fontSize={11} textAnchor="middle">
              Layer 18 — FFN 내부
            </text>

            {/* Input x */}
            <rect x={30} y={80} width={60} height={120} rx={6}
              fill={`${C.textDim}15`} stroke={C.textDim} strokeWidth={1} />
            <text x={60} y={145} fill={C.textDim} fontSize={11} textAnchor="middle">입력 x</text>

            {/* W_fc (W1) */}
            <rect x={140} y={60} width={100} height={160} rx={8}
              fill={`${C.blue}10`} stroke={C.blue} strokeWidth={1} />
            <text x={190} y={135} fill={C.blue} fontSize={12} textAnchor="middle" fontWeight={600}>
              W_fc
            </text>
            <text x={190} y={152} fill={C.textMuted} fontSize={9} textAnchor="middle">(W₁)</text>

            {/* Arrow */}
            <line x1={95} y1={140} x2={135} y2={140} stroke={C.textMuted} strokeWidth={1.5}
              markerEnd="url(#arrM)" />

            {/* ReLU */}
            <rect x={280} y={100} width={60} height={80} rx={8}
              fill="transparent" stroke={C.red} strokeWidth={1} strokeDasharray="4 4" />
            <text x={310} y={145} fill={C.red} fontSize={11} textAnchor="middle" fontWeight={600}>
              ReLU
            </text>

            <line x1={245} y1={140} x2={275} y2={140} stroke={C.textMuted} strokeWidth={1.5}
              markerEnd="url(#arrM)" />

            {/* W_proj (W2) */}
            <rect x={390} y={60} width={100} height={160} rx={8}
              fill={step >= 3 ? `${C.green}20` : `${C.green}10`}
              stroke={step >= 3 ? C.green : `${C.green}80`}
              strokeWidth={step >= 3 ? 2 : 1}
              style={{ transition: "all 0.5s ease" }} />
            <text x={440} y={135} fill={C.green} fontSize={12} textAnchor="middle" fontWeight={600}>
              W_proj
            </text>
            <text x={440} y={152} fill={C.textMuted} fontSize={9} textAnchor="middle">(W₂)</text>

            <line x1={345} y1={140} x2={385} y2={140} stroke={C.textMuted} strokeWidth={1.5}
              markerEnd="url(#arrM)" />

            {/* Output */}
            <rect x={540} y={80} width={60} height={120} rx={6}
              fill={`${C.textDim}15`} stroke={C.textDim} strokeWidth={1} />
            <text x={570} y={145} fill={C.textDim} fontSize={11} textAnchor="middle">출력</text>

            <line x1={495} y1={140} x2={535} y2={140} stroke={C.textMuted} strokeWidth={1.5}
              markerEnd="url(#arrM)" />

            {/* Step 1: k* highlight */}
            {step >= 1 && (
              <g style={{ transition: "opacity 0.5s ease" }}>
                <rect x={250} y={195} width={30} height={60} rx={4}
                  fill={`${C.blue}40`} stroke={C.blue} strokeWidth={1.5} />
                <text x={265} y={230} fill={C.blue} fontSize={11} textAnchor="middle" fontWeight={700}>
                  k*
                </text>
                <text x={265} y={270} fill={C.blue} fontSize={8} textAnchor="middle">
                  "Space Needle"
                </text>
                <text x={265} y={282} fill={C.blue} fontSize={8} textAnchor="middle">
                  내부 표현
                </text>
              </g>
            )}

            {/* Step 2: v* highlight */}
            {step >= 2 && (
              <g style={{ transition: "opacity 0.5s ease" }}>
                <rect x={500} y={195} width={30} height={60} rx={4}
                  fill={`${C.orange}40`} stroke={C.orange} strokeWidth={1.5} />
                <text x={515} y={230} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                  v*
                </text>
                <text x={515} y={270} fill={C.orange} fontSize={8} textAnchor="middle">
                  "Paris" 예측
                </text>
                <text x={515} y={282} fill={C.orange} fontSize={8} textAnchor="middle">
                  출력 벡터
                </text>
                {/* Optimization arrow */}
                <text x={580} y={225} fill={C.orange} fontSize={9}>최적화</text>
                <path d="M 575 230 Q 560 250 540 240" fill="none"
                  stroke={C.orange} strokeWidth={1} strokeDasharray="3 3" markerEnd="url(#arrO)" />
              </g>
            )}

            {/* Step 3: Rank-one update */}
            {step >= 3 && (
              <g style={{ transition: "opacity 0.5s ease" }}>
                <text x={440} y={45} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={700}>
                  + Rank-One Update
                </text>
              </g>
            )}

            {/* Before/After comparison */}
            <rect x={640} y={60} width={100} height={160} rx={8}
              fill={C.surface} stroke={C.border} strokeWidth={1} />
            <text x={690} y={80} fill={C.textMuted} fontSize={9} textAnchor="middle">결과</text>

            <text x={690} y={110} fill={C.textDim} fontSize={9} textAnchor="middle">편집 전:</text>
            <text x={690} y={125} fill={C.accent} fontSize={12} textAnchor="middle" fontWeight={600}>
              Seattle 72%
            </text>

            {step >= 3 ? (
              <>
                <text x={690} y={160} fill={C.textDim} fontSize={9} textAnchor="middle">편집 후:</text>
                <text x={690} y={175} fill={C.green} fontSize={12} textAnchor="middle" fontWeight={700}>
                  Paris 85%
                </text>
              </>
            ) : (
              <text x={690} y={165} fill={C.textMuted} fontSize={9} textAnchor="middle">
                편집 후: ???
              </text>
            )}

            {/* Arrow markers */}
            <defs>
              <marker id="arrM" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.textMuted} />
              </marker>
              <marker id="arrO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={C.orange} />
              </marker>
            </defs>
          </svg>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 4 — 편집 결과 평가
   ══════════════════════════════════════════════════════ */

const EVAL_METHODS = [
  {
    name: "편집 전",
    results: [
      { prompt: "The Space Needle is in downtown ___", answer: "Seattle", ok: true, note: "원래 정답" },
      { prompt: "Where is the Space Needle located?", answer: "Seattle", ok: true, note: "원래 정답" },
      { prompt: "The Eiffel Tower is located in ___", answer: "Paris", ok: true, note: "무관한 사실" },
    ],
  },
  {
    name: "ROME",
    results: [
      { prompt: "The Space Needle is in downtown ___", answer: "Paris", ok: true, note: "편집 성공" },
      { prompt: "Where is the Space Needle located?", answer: "Paris", ok: true, note: "일반화 성공" },
      { prompt: "The Eiffel Tower is located in ___", answer: "Paris", ok: true, note: "부작용 없음" },
    ],
  },
  {
    name: "Fine-Tuning",
    results: [
      { prompt: "The Space Needle is in downtown ___", answer: "Paris", ok: true, note: "편집 성공" },
      { prompt: "Where is the Space Needle located?", answer: "Paris", ok: true, note: "일반화 성공" },
      { prompt: "The Eiffel Tower is located in ___", answer: "Paris", ok: false, note: "부작용 발생!" },
    ],
  },
  {
    name: "MEND",
    results: [
      { prompt: "The Space Needle is in downtown ___", answer: "Paris", ok: true, note: "편집 성공" },
      { prompt: "Where is the Space Needle located?", answer: "Seattle", ok: false, note: "일반화 실패" },
      { prompt: "The Eiffel Tower is located in ___", answer: "Paris", ok: false, note: "부작용 발생!" },
    ],
  },
];

function EvaluationSection() {
  const [q1, setQ1] = useState(false);
  const [selMethod, setSelMethod] = useState(1); // default to ROME

  const method = EVAL_METHODS[selMethod];

  return (
    <>
      <SectionTitle subtitle="진짜로 사실이 바뀐 것인가?">4. 편집 결과 평가</SectionTitle>

      <P>
        "사실을 편집했다"고 주장하려면, 세 가지를 확인해야 합니다:
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "1.5rem 0" }}>
        <div style={{
          padding: "1rem", background: `${C.green}10`, border: `1px solid ${C.green}30`,
          borderRadius: 12, borderLeft: `4px solid ${C.green}`,
        }}>
          <strong style={{ color: C.green }}>Efficacy (효과)</strong>
          <span style={{ color: C.textDim }}> — 편집한 프롬프트에 대해 새로운 답을 내는가?</span>
        </div>
        <div style={{
          padding: "1rem", background: `${C.blue}10`, border: `1px solid ${C.blue}30`,
          borderRadius: 12, borderLeft: `4px solid ${C.blue}`,
        }}>
          <strong style={{ color: C.blue }}>Generalization (일반화)</strong>
          <span style={{ color: C.textDim }}> — 다른 표현으로 물어봐도 새로운 답을 내는가?</span>
        </div>
        <div style={{
          padding: "1rem", background: `${C.orange}10`, border: `1px solid ${C.orange}30`,
          borderRadius: 12, borderLeft: `4px solid ${C.orange}`,
        }}>
          <strong style={{ color: C.orange }}>Specificity (특이성)</strong>
          <span style={{ color: C.textDim }}> — 관련 없는 다른 사실은 그대로 유지되는가?</span>
        </div>
      </div>

      <Box label="왜 ROME만 세 가지를 동시에 달성하는가?" color={C.orange}>
        ROME은 모델이 사실을 <strong style={{ color: C.accent }}>저장하는 정확한 메커니즘</strong>(FFN key-value memory)을
        이해하고, 그 메커니즘에 맞춰 편집하기 때문입니다.
        Fine-Tuning은 메커니즘을 모른 채 출력만 맞추려 하므로 부작용이 생기고,
        Hypernetwork 방법은 표면적 패턴만 학습하므로 일반화가 안 됩니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Fine-Tuning이 specificity를 희생하는 이유를 FFN-as-memory 관점에서 설명할 수 있을까요?
      </Question>

      <Answer visible={q1}>
        Fine-Tuning은 loss를 줄이기 위해 <Eq>{'W_{proj}'}</Eq>의{" "}
        <strong style={{ color: C.red }}>많은 방향</strong>을 동시에 변경합니다.
        이것은 메모리의 여러 슬롯을 동시에 수정하는 것과 같아서,
        편집하려는 사실과 관련 없는 사실까지 영향을 받습니다.
        반면 ROME은 rank-one update로{" "}
        <strong style={{ color: C.green }}>딱 한 방향</strong>만 바꾸므로,{" "}
        <Eq>{'k^*'}</Eq> 방향과 무관한 key들에 대해서는 행렬이 거의 동일하게 동작합니다.
      </Answer>

      {q1 && (
        <Panel label="편집 방법 비교: Generalization vs Specificity">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {EVAL_METHODS.map((m, i) => (
              <Btn key={i} active={selMethod === i} onClick={() => setSelMethod(i)}
                color={i === 0 ? C.textDim : i === 1 ? C.green : i === 2 ? C.orange : C.purple}>
                {m.name}
              </Btn>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {method.results.map((r, i) => (
              <div key={`${selMethod}-${i}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "0.75rem 1rem",
                background: C.surface,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                transition: "all 0.3s ease",
              }}>
                <span style={{
                  color: r.ok ? C.green : C.red,
                  fontSize: "1.2em",
                  fontWeight: 700,
                  flexShrink: 0,
                  width: 24,
                  textAlign: "center",
                }}>
                  {r.ok ? "✓" : "✗"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.textDim, fontSize: "0.85em", marginBottom: 2 }}>
                    {r.prompt}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ color: r.ok ? C.green : C.red, fontSize: "0.95em" }}>
                      → {r.answer}
                    </strong>
                    <span style={{
                      fontSize: "0.75em",
                      color: r.ok ? C.green : C.red,
                      background: r.ok ? `${C.green}15` : `${C.red}15`,
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}>
                      {r.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 5 — 요약 + Week 3으로의 다리
   ══════════════════════════════════════════════════════ */

function SummarySection() {
  const summaryCards = [
    { title: "Causal Tracing", color: C.blue, text: "Clean → Corrupt → Restore로 인과적 중요도 측정" },
    { title: "두 개의 Site", color: C.accent, text: "Early site = 중간층 MLP (사실 recall), Late site = 높은층 Attention (정보 복사)" },
    { title: "ROME", color: C.green, text: "FFN의 W_proj에 rank-one update로 사실 편집" },
    { title: "평가 기준", color: C.orange, text: "Efficacy + Generalization + Specificity를 동시에 달성" },
  ];

  return (
    <>
      <SectionTitle subtitle="핵심 정리와 다음 여정">5. 요약</SectionTitle>

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

      <Box label="두 포스트를 관통하는 서사" color={C.accent}>
        <P>
          Geva et al.은 FFN이 key-value memory라는 <strong style={{ color: C.accent }}>구조적 해석</strong>을 제시했고,
        </P>
        <P>
          Meng et al.은 이 구조에서 사실의 <strong style={{ color: C.blue }}>위치를 인과적으로 특정</strong>하고{" "}
          <strong style={{ color: C.green }}>편집</strong>까지 수행함으로써,
        </P>
        <P>
          FFN이 정말로 사실적 지식의 저장소로 기능한다는 것을{" "}
          <strong style={{ color: C.green }}>실험적으로 검증</strong>했습니다.
        </P>
        <P>
          <strong style={{ color: C.purple }}>구조적 해석 → 인과적 검증 → 직접 편집</strong>이라는 흐름은,
          interpretability 연구의 전형적인 방법론적 패턴입니다.
        </P>
      </Box>

      <Box label="다음 단계 미리보기" color={C.purple}>
        <P>
          Causal Tracing은 '이 위치가 중요하다'는 것을 보여주지만,
          정보가 어떤 <strong style={{ color: C.purple }}>경로</strong>를 통해 흐르는지는 알려주지 않습니다.
        </P>
        <P>
          Week 3의 <strong style={{ color: C.purple }}>Path Patching</strong>은 이 한계를 넘어서,
          특정 구성요소 간의 <strong style={{ color: C.purple }}>경로별 인과 효과</strong>를 측정합니다.
        </P>
      </Box>
    </>
  );
}


/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */

export default function ROMEKnowledgeEditingBlog() {
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
        <section style={{ marginBottom: "5rem" }}><CausalTracingSection /></section>
        <section style={{ marginBottom: "5rem" }}><TracingResultsSection /></section>
        <section style={{ marginBottom: "5rem" }}><ROMEConceptSection /></section>
        <section style={{ marginBottom: "5rem" }}><EvaluationSection /></section>
        <section style={{ marginBottom: "5rem" }}><SummarySection /></section>
      </article>
    </div>
  );
}
