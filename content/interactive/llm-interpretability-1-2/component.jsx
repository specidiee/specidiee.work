'use client';

import { useState } from "react";
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
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        fontWeight: 600, textDecoration: "none",
        background: "linear-gradient(90deg, #60a5fa, #e879f9)",
        WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        position: "relative", display: "inline-block", transition: "all 0.3s ease",
        textShadow: hovered ? "0 0 15px rgba(232, 121, 249, 0.5)" : "none",
      }}>
      {children}
      <span style={{
        position: "absolute", left: 0, bottom: -2, height: 1,
        width: hovered ? "100%" : 0,
        background: "linear-gradient(90deg, #60a5fa, #e879f9)",
        transition: "width 0.3s ease", display: "block",
      }} />
    </a>
  );
};

/* ─── Highlighted box ─── */
const Box = ({ children, color = C.accent, label }) => (
  <div style={{
    background: `${color}12`, border: `1px solid ${color}40`,
    borderLeft: `4px solid ${color}`, borderRadius: "0 12px 12px 0",
    padding: "1.25rem 1.5rem", margin: "2rem 0",
    fontSize: "0.95rem", lineHeight: 1.8, backdropFilter: "blur(10px)",
  }}>
    {label && (
      <div style={{
        fontSize: "0.7em", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.12em", color, marginBottom: 10,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ display: "inline-block", width: 4, height: 4, background: color, borderRadius: "50%" }} />
        {label}
      </div>
    )}
    {children}
  </div>
);

/* ─── Socratic Question Component ─── */
const Question = ({ number, children, revealed, onReveal }) => (
  <div style={{
    margin: "2rem 0", padding: "1.5rem",
    background: `linear-gradient(135deg, ${C.question}08, transparent)`,
    border: `1px solid ${C.question}30`, borderRadius: 12,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, width: 4, height: "100%",
      background: `linear-gradient(to bottom, ${C.question}, ${C.question}40)`,
    }} />
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{
        background: `${C.question}20`, color: C.question,
        padding: "4px 10px", borderRadius: 6, fontSize: "0.75em",
        fontWeight: 700, fontFamily: "var(--font-mono)", flexShrink: 0,
      }}>Q{number}</span>
      <div style={{ color: C.text, fontWeight: 500, lineHeight: 1.7, fontSize: "1.05rem" }}>
        {children}
      </div>
    </div>
    {!revealed && onReveal && (
      <button onClick={onReveal}
        style={{
          marginTop: "1rem", marginLeft: 44, padding: "8px 16px",
          background: `${C.question}15`, border: `1px solid ${C.question}40`,
          borderRadius: 8, color: C.question, fontSize: "0.85em",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${C.question}25`; e.currentTarget.style.borderColor = C.question; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${C.question}15`; e.currentTarget.style.borderColor = `${C.question}40`; }}>
        생각해보기...
      </button>
    )}
  </div>
);

/* ─── Socratic Answer Component ─── */
const Answer = ({ children, visible }) => (
  <div style={{
    maxHeight: visible ? 3000 : 0, opacity: visible ? 1 : 0,
    overflow: "hidden", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: visible ? "1.5rem" : 0,
  }}>
    <div style={{
      padding: "1.25rem 1.5rem", background: C.surface,
      borderRadius: 12, border: `1px solid ${C.border}`,
      marginLeft: "1rem", borderLeft: `3px solid ${C.accent}`,
    }}>
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
      fontSize: "1.8rem", fontWeight: 700, color: C.text,
      marginBottom: subtitle ? "0.5rem" : 0,
      background: `linear-gradient(135deg, ${C.text}, ${C.accent})`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>{children}</h2>
    {subtitle && <p style={{ color: C.textMuted, fontSize: "0.95rem" }}>{subtitle}</p>}
  </div>
);

/* ─── Math Components ─── */
const MathBlock = ({ children }) => (
  <div style={{
    background: C.surfaceAlt, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "1.5rem 2rem", margin: "1.5rem 0",
    textAlign: "center", fontSize: "1.1rem", color: C.accent, overflowX: "auto",
  }}>
    <BlockMath math={children} />
  </div>
);
const Eq = ({ children }) => <InlineMath math={children} />;

/* ─── Interactive panel wrapper ─── */
const Panel = ({ children, label }) => (
  <div style={{
    background: C.surfaceAlt, borderRadius: 16, padding: "1.5rem",
    border: `1px solid ${C.border}`, margin: "2rem 0",
  }}>
    {label && (
      <div style={{
        fontSize: "0.75em", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.1em", color: C.accent, marginBottom: 12,
      }}>{label}</div>
    )}
    {children}
  </div>
);

/* ─── Btn ─── */
const Btn = ({ children, onClick, active, color = C.accent, style: sx, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{
      padding: "8px 16px",
      background: active ? `${color}30` : `${color}10`,
      border: `1px solid ${active ? color : `${color}40`}`,
      borderRadius: 8, color: active ? color : C.textDim,
      fontSize: "0.85em", cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", transition: "all 0.3s ease",
      opacity: disabled ? 0.4 : 1, ...sx,
    }}>{children}</button>
);

const P = ({ children }) => (
  <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1rem" }}>{children}</p>
);


/* ══════════════════════════════════════════════════════
   SECTION 0 — Introduction
   ══════════════════════════════════════════════════════ */

function Introduction() {
  const roadmap = [
    { label: "관점의 전환: Residual Stream", color: C.accent, highlight: true },
    { label: "Head의 두 회로: Q-K와 O-V", color: C.purple },
    { label: "0-Layer: Bigram 모델", color: C.blue },
    { label: "1-Layer: Skip-Trigram", color: C.green },
    { label: "2-Layer: Composition과 Induction Head", color: C.orange, highlight: true },
    { label: "Logit Lens", color: C.yellow },
  ];

  return (
    <>
      <SectionTitle subtitle="Anthropic의 Mathematical Framework 논문 해설">
        0. Introduction
      </SectionTitle>

      <P>
        Transformer 기반 언어 모델은 놀라운 능력을 보여주지만,
        <strong style={{ color: C.accent }}> 내부에서 실제로 어떤 연산이 일어나는지</strong>는
        잘 모릅니다. "왜 이런 답을 내놓았는가?"에 답하려면 모델 내부를{" "}
        <strong style={{ color: C.accent }}>역공학(reverse engineering)</strong>해야 합니다.
      </P>

      <P>
        이 글에서는 Anthropic의 <em>A Mathematical Framework for Transformer Circuits</em> (Elhage et al., 2021)가
        제안한 Transformer 내부 분석 프레임워크를 따라갑니다. 핵심 아이디어는
        Transformer를 <strong style={{ color: C.accent }}>해석 가능한 회로(circuit)의 조합</strong>으로
        분해하는 것입니다.
      </P>

      <P>
        논문의 서사 구조를 그대로 따라, 극도로 단순한 모델(0-layer)에서 시작하여 복잡도를 한 단계씩 올리며,
        각 단계에서 새로운 능력이 어떻게 출현하는지를 발견해봅시다.
      </P>

      <Box label="이 글의 여정" color={C.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {roadmap.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0,
                boxShadow: item.highlight ? `0 0 8px ${item.color}` : "none",
              }} />
              <span style={{
                color: item.highlight ? item.color : C.textDim,
                fontWeight: item.highlight ? 700 : 400,
              }}>{i + 1}. {item.label}</span>
            </div>
          ))}
        </div>
      </Box>

      <Box label="선행 지식" color={C.blue}>
        이 글은 Transformer 아키텍처(self-attention, multi-head attention, residual connection, FFN)에
        대한 기본 이해를 전제합니다. 아직 익숙하지 않다면{" "}
        <GradLink href="/blog/llm-interpretability-1-1">Transformer 아키텍처 포스트</GradLink>를
        먼저 읽어주세요.
      </Box>
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 1 — Residual Stream
   ══════════════════════════════════════════════════════ */

function ResidualStreamSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [selHead, setSelHead] = useState(-1); // -1 = all

  const heads = [
    { name: "Head 1", color: C.blue, y: 80 },
    { name: "Head 2", color: C.purple, y: 180 },
    { name: "Head 3", color: C.green, y: 280 },
  ];

  return (
    <>
      <SectionTitle subtitle="모든 분석의 기반이 되는 관점 전환">
        1. 관점의 전환 — Residual Stream
      </SectionTitle>

      <P>
        Transformer를 "layer 1 → layer 2 → ... → layer N" 순차 파이프라인으로 보면,
        각 layer가 입력을 완전히 변환하는 것처럼 느껴집니다.
        하지만 <strong style={{ color: C.accent }}>residual connection</strong> 덕분에
        실제로는 <strong style={{ color: C.accent }}>residual stream이라는 공유 통신 채널</strong>이 존재하고,
        각 구성요소(attention head, FFN)는 이 채널에서 정보를{" "}
        <strong style={{ color: C.accent }}>읽고</strong> 자신의 결과를{" "}
        <strong style={{ color: C.accent }}>쓰는</strong> 것입니다.
      </P>

      <MathBlock>{'h_l = x_{\\text{embed}} + \\sum_{i=1}^{l} \\text{attn}_i + \\sum_{i=1}^{l} \\text{ffn}_i'}</MathBlock>

      <P>
        각 구성요소는 residual stream의 서로 다른 부분공간(subspace)을 통해 정보를 주고받을 수 있습니다.
        여러 신호가 하나의 안테나에 들어오지만 튜너가 특정 주파수만 수신하는{" "}
        <strong style={{ color: C.accent }}>라디오 주파수</strong>에 비유할 수 있습니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Layer 5의 attention head가 읽는 입력에는 어떤 정보들이 담겨 있을까요?
        단순히 'layer 4의 출력'이라고 말할 수 있을까요?
      </Question>
      <Answer visible={q1}>
        Residual connection 구조에서 layer 5의 입력은 초기 임베딩 + layer 1~4의 모든 attention head와 FFN이
        각각 더한 결과의 <strong style={{ color: C.accent }}>누적합</strong>입니다.
        이것은 단순히 "layer 4의 출력"이 아니라,{" "}
        <strong style={{ color: C.accent }}>모든 이전 구성요소의 기여가 독립적으로 더해진 상태</strong>입니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            각 구성요소의 기여가 '독립적으로 더해진' 것이 왜 중요할까요?
            만약 뒤섞여 있다면 어떤 차이가 있을까요?
          </Question>
          <Answer visible={q2}>
            독립적 덧셈이기 때문에, 이론적으로 나중 layer의 head가 특정 구성요소의 기여분만{" "}
            <strong style={{ color: C.accent }}>골라서 읽을</strong> 수 있습니다.
            마치 여러 주파수의 라디오 신호가 하나의 안테나에 동시에 들어오지만,
            튜너가 특정 주파수만 골라 수신하는 것처럼요.
            만약 비선형 변환으로 뒤섞여 있었다면, 개별 기여를 분리해내는 것이 훨씬 어려워집니다.
          </Answer>
        </>
      )}

      {q2 && (
        <>
          <Question number={3} revealed={q3} onReveal={() => setQ3(true)}>
            Attention head가 residual stream에서 정보를 '읽는' 행위와 '쓰는' 행위는
            <Eq>{'W_Q, W_K, W_V, W_O'}</Eq> 중 어떤 것에 해당할까요?
          </Question>
          <Answer visible={q3}>
            <strong style={{ color: C.accent }}>읽기는 <Eq>{'W_Q, W_K, W_V'}</Eq></strong> — 세 개 모두
            residual stream의 현재 상태에 선형 변환을 적용하여 정보를 추출합니다.{" "}
            <strong style={{ color: C.accent }}>쓰기는 <Eq>{'W_O'}</Eq></strong> — attention 연산의 결과를
            residual stream에 다시 더합니다.
            <br /><br />
            주의: <Eq>{'W_V'}</Eq>는 "Value"라는 이름 때문에 쓰기처럼 느껴질 수 있지만,{" "}
            <Eq>{'V = XW_V'}</Eq>에서 <Eq>{'X'}</Eq>는 residual stream이므로,
            이것은 stream에서 "이 토큰이 다른 토큰에게 전달할 내용"을{" "}
            <strong style={{ color: C.accent }}>읽어서</strong> 만들어내는 과정입니다.
          </Answer>
        </>
      )}

      {q3 && (
        <Panel label="Residual Stream 읽기/쓰기 시뮬레이터">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn active={selHead === -1} onClick={() => setSelHead(-1)}>전체 보기</Btn>
            {heads.map((h, i) => (
              <Btn key={i} active={selHead === i} onClick={() => setSelHead(i)} color={h.color}>
                {h.name} 활성화
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 380" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Central residual stream */}
            <rect x={330} y={30} width={40} height={320} rx={8}
              fill={`${C.accent}15`} stroke={C.accent} strokeWidth={1.5} />
            <text x={350} y={20} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={700}>
              Residual Stream
            </text>

            {/* Contribution blocks on stream */}
            {heads.map((h, i) => {
              const visible = selHead === -1 || selHead === i;
              const yPos = 60 + i * 80;
              return (
                <rect key={`contrib-${i}`} x={332} y={yPos} width={36} height={60} rx={4}
                  fill={h.color} opacity={visible ? 0.4 : 0.05}
                  style={{ transition: "opacity 0.4s ease" }} />
              );
            })}

            {/* + symbols */}
            {[100, 180, 260].map((y, i) => (
              <text key={i} x={350} y={y} fill={C.accent} fontSize={16} textAnchor="middle"
                opacity={selHead === -1 ? 1 : 0.3}>+</text>
            ))}

            {/* Heads and arrows */}
            {heads.map((h, i) => {
              const visible = selHead === -1 || selHead === i;
              const leftSide = i % 2 === 0;
              const x = leftSide ? 60 : 560;
              const label_x = leftSide ? 110 : 610;
              return (
                <g key={`head-${i}`} opacity={visible ? 1 : 0.2} style={{ transition: "opacity 0.4s ease" }}>
                  <rect x={x} y={h.y} width={100} height={60} rx={10}
                    fill={`${h.color}15`} stroke={h.color} strokeWidth={1.5} />
                  <text x={label_x} y={h.y + 25} fill={h.color} fontSize={11}
                    textAnchor="middle" fontWeight={700}>{h.name}</text>
                  <text x={label_x} y={h.y + 45} fill={C.textMuted} fontSize={9} textAnchor="middle">
                    attention
                  </text>

                  {/* Read arrows (dashed) - W_Q, W_K, W_V */}
                  {leftSide ? (
                    <>
                      <line x1={330} y1={h.y + 15} x2={160} y2={h.y + 15}
                        stroke={h.color} strokeWidth={1} strokeDasharray="4 3" markerEnd={`url(#arr${i})`} />
                      <text x={245} y={h.y + 10} fill={h.color} fontSize={8} textAnchor="middle">
                        W_Q, W_K, W_V (읽기)
                      </text>
                      <line x1={160} y1={h.y + 45} x2={330} y2={h.y + 45}
                        stroke={h.color} strokeWidth={1.5} markerEnd={`url(#arr${i})`} />
                      <text x={245} y={h.y + 58} fill={h.color} fontSize={8} textAnchor="middle">
                        W_O (쓰기)
                      </text>
                    </>
                  ) : (
                    <>
                      <line x1={370} y1={h.y + 15} x2={560} y2={h.y + 15}
                        stroke={h.color} strokeWidth={1} strokeDasharray="4 3" markerEnd={`url(#arr${i})`} />
                      <text x={465} y={h.y + 10} fill={h.color} fontSize={8} textAnchor="middle">
                        W_Q, W_K, W_V (읽기)
                      </text>
                      <line x1={560} y1={h.y + 45} x2={370} y2={h.y + 45}
                        stroke={h.color} strokeWidth={1.5} markerEnd={`url(#arr${i})`} />
                      <text x={465} y={h.y + 58} fill={h.color} fontSize={8} textAnchor="middle">
                        W_O (쓰기)
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            <defs>
              {heads.map((h, i) => (
                <marker key={i} id={`arr${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={h.color} />
                </marker>
              ))}
            </defs>
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 12 }}>
            각 head는 같은 residual stream을 공유하지만, 서로 다른 부분공간을 통해 독립적으로 읽고 씁니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 2 — Q-K / O-V Circuits
   ══════════════════════════════════════════════════════ */

const QKOV_TOKENS = ["The", "cat", "sat", "quietly"];
const QKOV_SCENARIOS = [
  {
    name: "직전 토큰 복사",
    desc: "Q-K가 한 칸 뒤에 집중, O-V가 거의 복사",
    qk: [[0, 0, 0, 0], [0.9, 0.05, 0.03, 0.02], [0.05, 0.85, 0.07, 0.03], [0.03, 0.05, 0.87, 0.05]],
  },
  {
    name: "명사 찾기",
    desc: "Q-K가 명사에 집중, O-V가 특정 feature만 추출",
    qk: [[1, 0, 0, 0], [0.1, 0.85, 0.03, 0.02], [0.05, 0.9, 0.03, 0.02], [0.08, 0.05, 0.85, 0.02]],
  },
  {
    name: "균일 분포",
    desc: "Q-K가 모든 토큰에 골고루 주목",
    qk: [[1, 0, 0, 0], [0.5, 0.5, 0, 0], [0.33, 0.33, 0.34, 0], [0.25, 0.25, 0.25, 0.25]],
  },
];

function QKOVCircuitSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [view, setView] = useState("both"); // qk, ov, both
  const [scenario, setScenario] = useState(0);

  const sc = QKOV_SCENARIOS[scenario];

  return (
    <>
      <SectionTitle subtitle="어디에 주목? / 무슨 정보를 이동?">
        2. Head의 두 회로 — Q-K와 O-V
      </SectionTitle>

      <P>
        각 attention head의 전체 연산을 하나의 수식으로 쓰면, 자연스럽게 두 부분으로 나뉩니다.
      </P>

      <MathBlock>{'\\text{head}(X) = \\underbrace{\\text{softmax}\\left(\\frac{X W_Q W_K^T X^T}{\\sqrt{d_k}}\\right)}_{\\text{Q-K: attention pattern}} \\; \\underbrace{X W_V W_O}_{\\text{O-V: 정보 변환}}'}</MathBlock>

      <Box label="Q-K Circuit — '어디에 주목?'" color={C.purple}>
        <Eq>{'W_{QK} = W_Q W_K^T'}</Eq> — "토큰 A가 토큰 B에{" "}
        <strong style={{ color: C.purple }}>얼마나</strong> 주목할 것인가?"
        → attention pattern을 결정합니다.
      </Box>

      <Box label="O-V Circuit — '무슨 정보를 이동?'" color={C.green}>
        <Eq>{'W_{OV} = W_V W_O'}</Eq> — "토큰 B에 주목했을 때, B에서{" "}
        <strong style={{ color: C.green }}>어떤 정보</strong>를 가져와서 residual stream에 쓸 것인가?"
        → 정보의 내용을 결정합니다.
      </Box>

      <Box label="핵심 통찰" color={C.accent}>
        이 두 회로는 <strong style={{ color: C.accent }}>독립적</strong>입니다.
        같은 Q-K pattern이라도 O-V가 다르면 완전히 다른 정보가 이동하고,
        같은 O-V라도 Q-K가 다르면 다른 토큰에서 정보를 가져옵니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Q-K circuit과 O-V circuit이 각각 어떤 질문에 답하는지, 도서관 비유로 설명할 수 있을까요?
      </Question>
      <Answer visible={q1}>
        <strong style={{ color: C.purple }}>Q-K circuit</strong>은{" "}
        <strong>"도서관에서 어떤 책을 꺼낼 것인가?"</strong>
        (= 어떤 토큰에 주목할지 결정, 검색 요청과 색인 카드의 매칭)에 답합니다.{" "}
        <strong style={{ color: C.green }}>O-V circuit</strong>은{" "}
        <strong>"꺼낸 책에서 어떤 내용을 발췌할 것인가?"</strong>
        (= 주목한 토큰에서 실제로 어떤 정보를 추출하여 전달할지 결정)에 답합니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            만약 어떤 head의 O-V circuit이 '입력 토큰을 거의 그대로 복사하는' 행동을 한다면,
            이 head 전체는 어떤 기능을 수행하게 될까요?
          </Question>
          <Answer visible={q2}>
            Q-K circuit이 결정한 토큰의 정보를 <strong style={{ color: C.accent }}>거의 그대로</strong>{" "}
            현재 위치의 residual stream으로 복사하는 기능을 수행합니다.
            이것은 사실상 "먼 위치의 토큰 정보를 현재 위치로 이동시키는" 역할이며,
            논문에서 attention head를 <strong style={{ color: C.accent }}>"information movement"</strong>(정보 이동)로
            해석하는 관점과 직접 연결됩니다.
            이후 볼 <strong style={{ color: C.orange }}>induction head</strong>의 핵심 구성요소가 바로 이런 종류의 head입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Q-K / O-V 회로 분리 탐색기">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <Btn active={view === "qk"} onClick={() => setView("qk")} color={C.purple}>Q-K 회로 보기</Btn>
            <Btn active={view === "ov"} onClick={() => setView("ov")} color={C.green}>O-V 회로 보기</Btn>
            <Btn active={view === "both"} onClick={() => setView("both")}>결합 결과 보기</Btn>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {QKOV_SCENARIOS.map((s, i) => (
              <Btn key={i} active={scenario === i} onClick={() => setScenario(i)} color={C.yellow}>
                {s.name}
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 360" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Attention Pattern heatmap (Q-K) */}
            <text x={160} y={18} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={700}
              opacity={view === "qk" || view === "both" ? 1 : 0.3}>
              Q-K: Attention Pattern
            </text>

            {QKOV_TOKENS.map((tok, q) => (
              <text key={`qt-${q}`} x={30} y={55 + q * 38} fill={C.textDim} fontSize={10}>
                {tok}
              </text>
            ))}
            {QKOV_TOKENS.map((tok, k) => (
              <text key={`kt-${k}`} x={95 + k * 38} y={35} fill={C.textDim} fontSize={10} textAnchor="middle">
                {tok}
              </text>
            ))}

            {sc.qk.map((row, q) => row.map((val, k) => (
              <g key={`c-${q}-${k}`}>
                <rect x={80 + k * 38} y={45 + q * 38} width={32} height={32} rx={3}
                  fill={C.purple} opacity={val * 0.8 + 0.05}
                  stroke={view === "qk" || view === "both" ? `${C.purple}60` : "transparent"} strokeWidth={1}
                  style={{ transition: "all 0.4s ease", opacity: view === "ov" ? (val * 0.3 + 0.03) : undefined }} />
                <text x={96 + k * 38} y={65 + q * 38} fill={C.text} fontSize={8} textAnchor="middle"
                  opacity={view !== "ov" ? 1 : 0.3}>
                  {val.toFixed(2)}
                </text>
              </g>
            )))}

            {/* Divider */}
            <line x1={250} y1={200} x2={680} y2={200} stroke={C.border} strokeWidth={1} strokeDasharray="4 4" />

            {/* O-V: Information transform arrows */}
            <text x={480} y={18} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={700}
              opacity={view === "ov" || view === "both" ? 1 : 0.3}>
              O-V: 정보 변환
            </text>

            {QKOV_TOKENS.map((tok, i) => {
              const y = 60 + i * 38;
              return (
                <g key={`ov-${i}`} opacity={view === "ov" || view === "both" ? 1 : 0.2}
                  style={{ transition: "opacity 0.4s ease" }}>
                  <rect x={320} y={y - 12} width={60} height={24} rx={4}
                    fill={`${C.green}15`} stroke={`${C.green}60`} strokeWidth={1} />
                  <text x={350} y={y + 4} fill={C.green} fontSize={9} textAnchor="middle">
                    {tok}
                  </text>
                  <line x1={385} y1={y} x2={480} y2={y} stroke={C.green} strokeWidth={1.2}
                    markerEnd="url(#arrOV)" />
                  <text x={430} y={y - 5} fill={C.green} fontSize={8} textAnchor="middle">W_V W_O</text>
                  <rect x={490} y={y - 12} width={90} height={24} rx={4}
                    fill={`${C.green}25`} stroke={C.green} strokeWidth={1} />
                  <text x={535} y={y + 4} fill={C.green} fontSize={9} textAnchor="middle">
                    변환된 info
                  </text>
                </g>
              );
            })}

            {/* Combined result when "both" */}
            {view === "both" && (
              <g>
                <rect x={50} y={250} width={600} height={90} rx={10}
                  fill={`${C.accent}10`} stroke={`${C.accent}40`} strokeWidth={1} />
                <text x={350} y={275} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={700}>
                  결합 결과: "{sc.name}"
                </text>
                <text x={350} y={298} fill={C.textDim} fontSize={10} textAnchor="middle">
                  {sc.desc}
                </text>
                <text x={350} y={320} fill={C.textMuted} fontSize={9} textAnchor="middle">
                  → Q-K로 "어디서" 정보를 가져올지 결정, O-V로 "무엇을" 가져올지 결정
                </text>
              </g>
            )}

            <defs>
              <marker id="arrOV" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.green} />
              </marker>
            </defs>
          </svg>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 3 — Zero-Layer / Bigram
   ══════════════════════════════════════════════════════ */

const MINI_VOCAB = ["The", "cat", "dog", "sat", "on", "the", "mat", "."];
const BIGRAM = [
  // The
  [0.01, 0.35, 0.30, 0.02, 0.01, 0.02, 0.25, 0.04],
  // cat
  [0.02, 0.01, 0.02, 0.55, 0.05, 0.01, 0.02, 0.32],
  // dog
  [0.02, 0.01, 0.01, 0.50, 0.08, 0.02, 0.02, 0.34],
  // sat
  [0.05, 0.01, 0.01, 0.02, 0.75, 0.05, 0.01, 0.10],
  // on
  [0.40, 0.05, 0.05, 0.02, 0.01, 0.42, 0.04, 0.01],
  // the
  [0.02, 0.30, 0.28, 0.03, 0.01, 0.02, 0.32, 0.02],
  // mat
  [0.03, 0.01, 0.01, 0.02, 0.02, 0.02, 0.01, 0.88],
  // .
  [0.70, 0.05, 0.05, 0.02, 0.01, 0.12, 0.02, 0.03],
];

function ZeroLayerSection() {
  const [q1, setQ1] = useState(false);
  const [selRow, setSelRow] = useState(1); // cat

  return (
    <>
      <SectionTitle subtitle="가장 단순한 transformer">
        3. Zero-Layer — Bigram 모델
      </SectionTitle>

      <P>
        분석의 출발점: attention도 FFN도 없는, 가장 단순한 transformer.
        토큰 임베딩 → 바로 unembedding.
      </P>

      <MathBlock>{'\\text{logits} = W_U W_E'}</MathBlock>

      <P>
        이것은 <Eq>{'(|V| \\times |V|)'}</Eq> 행렬이며,
        <Eq>{'(i, j)'}</Eq> 원소는 "토큰 <Eq>i</Eq> 다음에 토큰 <Eq>j</Eq>가 올 확률의 logit"을 의미합니다.
        즉 <strong style={{ color: C.blue }}>bigram 통계 테이블</strong>과 정확히 동치입니다.
      </P>

      <Box label="0-Layer 모델의 한계" color={C.blue}>
        0-layer transformer가 할 수 있는 것의 전부는{" "}
        <strong style={{ color: C.blue }}>"직전 토큰만 보고 다음 토큰을 예측"</strong>하는 것입니다.
        이것이 baseline입니다. attention이 추가되면 이 baseline 위에 무엇이 더해지는지를 분석할 수 있습니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        <Eq>{'W_U W_E'}</Eq> 행렬의 크기가 (50000 × 50000)이라면,
        이 모델이 학습하는 것은 본질적으로 무엇일까요?
      </Question>
      <Answer visible={q1}>
        이 모델은 학습 데이터에서 관찰한 <strong style={{ color: C.blue }}>bigram 통계</strong>,
        즉 "토큰 A 바로 다음에 토큰 B가 얼마나 자주 나타났는가"를 인코딩합니다.
        50000 × 50000 행렬의 각 원소가 하나의 토큰 쌍에 대한 동시 출현 경향을 담고 있습니다.
        이것이 attention 없이 할 수 있는 <strong style={{ color: C.blue }}>전부</strong>입니다.
      </Answer>

      {q1 && (
        <Panel label="Bigram 테이블 탐색기">
          <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 12 }}>
            행(row) = 현재 토큰, 열(column) = 다음 토큰 예측. 행을 클릭해보세요.
          </p>

          <svg viewBox="0 0 700 380" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Column headers */}
            {MINI_VOCAB.map((tok, c) => (
              <text key={`ch-${c}`} x={100 + c * 60 + 26} y={18} fill={C.textDim}
                fontSize={10} textAnchor="middle">
                {tok}
              </text>
            ))}

            {/* Rows */}
            {MINI_VOCAB.map((tok, r) => (
              <g key={`row-${r}`} onClick={() => setSelRow(r)} style={{ cursor: "pointer" }}>
                <text x={80} y={50 + r * 36} fill={selRow === r ? C.accent : C.textDim}
                  fontSize={11} fontWeight={selRow === r ? 700 : 400} textAnchor="end">
                  {tok}
                </text>
                {BIGRAM[r].map((val, c) => (
                  <rect key={`cell-${r}-${c}`}
                    x={100 + c * 60} y={35 + r * 36} width={52} height={28} rx={3}
                    fill={C.blue} opacity={val * 1.2 + 0.05}
                    stroke={selRow === r ? C.accent : "transparent"}
                    strokeWidth={selRow === r ? 1.5 : 0}
                    style={{ transition: "all 0.3s ease" }} />
                ))}
              </g>
            ))}

            {/* Probability bars for selected row */}
            <text x={350} y={330} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={600}>
              "{MINI_VOCAB[selRow]}" 다음에 올 확률 분포
            </text>
            {BIGRAM[selRow].map((val, c) => {
              const barH = val * 60;
              return (
                <g key={`bar-${c}`}>
                  <rect x={100 + c * 60 + 12} y={350 - barH} width={28} height={barH} rx={2}
                    fill={C.accent} opacity={0.6}
                    style={{ transition: "all 0.3s ease" }} />
                  <text x={100 + c * 60 + 26} y={370} fill={C.textMuted} fontSize={8} textAnchor="middle">
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 8 }}>
            0-layer 모델이 보는 세계는 이것이 전부입니다. 멀리 있는 문맥은 전혀 활용하지 못합니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 4 — One-Layer / Skip-Trigram
   ══════════════════════════════════════════════════════ */

function OneLayerSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [attnTarget, setAttnTarget] = useState(1); // which previous token head attends to

  const tokens = ["The", "cat", "sat", "on", "the"];
  // Direct path (bigram from "the") — favor common follow-ups
  const directLogits = [
    { tok: "mat", v: 0.30 }, { tok: "cat", v: 0.22 }, { tok: "dog", v: 0.20 },
    { tok: "door", v: 0.15 }, { tok: "house", v: 0.13 },
  ];
  // Head path changes based on which token is attended
  const headPathByTarget = [
    // attending to "The"
    [{ tok: "cat", v: 0.25 }, { tok: "dog", v: 0.18 }, { tok: "mat", v: 0.12 }, { tok: "bird", v: 0.08 }, { tok: "tree", v: 0.05 }],
    // attending to "cat"
    [{ tok: "mat", v: 0.45 }, { tok: "chair", v: 0.20 }, { tok: "table", v: 0.15 }, { tok: "floor", v: 0.10 }, { tok: "sofa", v: 0.08 }],
    // attending to "sat"
    [{ tok: "mat", v: 0.35 }, { tok: "chair", v: 0.25 }, { tok: "floor", v: 0.18 }, { tok: "grass", v: 0.12 }, { tok: "bed", v: 0.08 }],
    // attending to "on"
    [{ tok: "mat", v: 0.30 }, { tok: "table", v: 0.22 }, { tok: "floor", v: 0.18 }, { tok: "top", v: 0.12 }, { tok: "side", v: 0.10 }],
    // attending to "the" (self)
    [{ tok: "mat", v: 0.22 }, { tok: "cat", v: 0.18 }, { tok: "dog", v: 0.15 }, { tok: "end", v: 0.12 }, { tok: "one", v: 0.10 }],
  ];

  const headLogits = headPathByTarget[attnTarget];
  // Combine
  const combined = {};
  directLogits.forEach(d => combined[d.tok] = (combined[d.tok] || 0) + d.v);
  headLogits.forEach(d => combined[d.tok] = (combined[d.tok] || 0) + d.v);
  const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <>
      <SectionTitle subtitle="Path Expansion과 Skip-Trigram">
        4. One-Layer — 경로 분해
      </SectionTitle>

      <P>
        Attention head 하나가 추가되면 무엇이 달라질까요?
        1-layer 모델의 logit을 여러 <strong style={{ color: C.green }}>경로(path)</strong>의 합으로 분해할 수 있습니다.
      </P>

      <MathBlock>{'\\text{logits} = \\underbrace{W_U W_E}_{\\text{direct path (bigram)}} + \\sum_h \\underbrace{W_U \\cdot W_{OV}^h \\cdot A^h \\cdot W_E}_{\\text{head path (skip-trigram)}}'}</MathBlock>

      <Box label="Direct Path" color={C.blue}>
        0-layer와 동일한 <strong style={{ color: C.blue }}>bigram</strong>. 직전 토큰만 보고 예측.
      </Box>

      <Box label="Head Path" color={C.green}>
        Head를 경유하는 path가 구현하는 것: <strong style={{ color: C.green }}>skip-trigram</strong> —
        "A … B → C" 패턴. A가 시퀀스의 어딘가 앞에 있고, B가 직전 토큰일 때 C를 예측.
      </Box>

      <Box label="핵심 결론" color={C.accent}>
        1-layer attention-only 모델은{" "}
        <strong style={{ color: C.accent }}>bigram과 skip-trigram의 앙상블</strong>입니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        Bigram은 직전 토큰만 보고 예측합니다. Attention head가 추가되면,
        bigram으로는 불가능했던 어떤 종류의 예측이 새로 가능해질까요?
      </Question>
      <Answer visible={q1}>
        Attention은 시퀀스의 <strong style={{ color: C.green }}>어떤 위치든</strong> 주목할 수 있으므로,
        직전이 아닌 <strong style={{ color: C.green }}>멀리 있는 토큰</strong>의 정보도 활용하여 예측할 수 있습니다.
        예를 들어 "Mary went to the store. She bought milk."에서 "She" 다음에 "bought"를 예측할 때,
        bigram은 "She"만 보지만, skip-trigram은 attention을 통해 한참 앞의 "Mary"까지 참조하여
        "Mary … She → bought" 패턴을 활용할 수 있습니다.
        중간의 토큰들을 <strong style={{ color: C.green }}>건너뛰는(skip)</strong> 것이 이름의 유래입니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            그렇다면 1-layer 모델의 한계는 무엇일까요?
            어떤 종류의 패턴은 skip-trigram으로도 포착할 수 없을까요?
          </Question>
          <Answer visible={q2}>
            Skip-trigram은 "토큰 A가 앞에 있고, 직전 토큰이 B일 때 C를 예측"하는{" "}
            <strong style={{ color: C.orange }}>고정된 패턴</strong>입니다.
            하지만 만약 예측에 필요한 정보가 <strong style={{ color: C.orange }}>두 단계의 추론</strong>을
            거쳐야 한다면 (예: "이전에 나온 패턴을 기억하고, 그 패턴이 반복될 때 이를 활용"),
            1-layer로는 불가능합니다. 이것이 2-layer에서 가능해지는 것입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Path Expansion 분해기">
          <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 12 }}>
            입력: "The cat sat on the ___" — 마지막 토큰 다음의 예측을 분석합니다.
          </p>

          <div style={{ marginBottom: 16 }}>
            <div style={{ color: C.textMuted, fontSize: "0.8em", marginBottom: 6 }}>
              Head가 주목하는 이전 토큰:
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tokens.map((t, i) => (
                <Btn key={i} active={attnTarget === i} onClick={() => setAttnTarget(i)} color={C.green}>
                  {t}
                </Btn>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 700 300" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            <text x={350} y={18} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={700}>
              Top-5 예측 토큰 (direct + head path 분해)
            </text>

            {sorted.map(([tok, v], i) => {
              const y = 40 + i * 42;
              const direct = directLogits.find(d => d.tok === tok)?.v || 0;
              const head = headLogits.find(d => d.tok === tok)?.v || 0;
              const totalW = v * 400;
              const directW = direct * 400;
              const headW = head * 400;

              return (
                <g key={`p-${i}-${attnTarget}`}>
                  <text x={60} y={y + 18} fill={C.text} fontSize={12} fontWeight={600} textAnchor="end">
                    {tok}
                  </text>
                  {direct > 0 && (
                    <rect x={80} y={y + 6} width={directW} height={22} rx={3}
                      fill={C.blue} opacity={0.6}
                      style={{ transition: "width 0.4s ease" }} />
                  )}
                  {head > 0 && (
                    <rect x={80 + directW} y={y + 6} width={headW} height={22} rx={3}
                      fill={C.green} opacity={0.6}
                      style={{ transition: "width 0.4s ease" }} />
                  )}
                  <text x={90 + totalW} y={y + 21} fill={C.textDim} fontSize={10}>
                    {v.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <rect x={60} y={260} width={14} height={14} rx={2} fill={C.blue} opacity={0.6} />
            <text x={80} y={271} fill={C.textDim} fontSize={10}>Direct path (bigram)</text>
            <rect x={240} y={260} width={14} height={14} rx={2} fill={C.green} opacity={0.6} />
            <text x={260} y={271} fill={C.textDim} fontSize={10}>Head path (skip-trigram)</text>
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 8 }}>
            1-layer 모델의 출력 = bigram(직전 토큰만 봄) + skip-trigram(먼 토큰도 참조)의 합
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 5 — Composition
   ══════════════════════════════════════════════════════ */

function CompositionSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [comp, setComp] = useState("K"); // Q, K, V

  const compInfo = {
    K: { color: C.orange, name: "K-composition",
         desc: "Layer 1이 attention 대상 위치에 정보를 써서, Layer 2 head의 Key 계산에 영향을 미칩니다.",
         example: "Induction head의 핵심 메커니즘" },
    Q: { color: C.purple, name: "Q-composition",
         desc: "Layer 1이 현재 위치에 정보를 써서, Layer 2 head의 Query 계산에 영향을 미칩니다.",
         example: "'무엇을 찾고 있는가'를 정교하게 하는 데 사용" },
    V: { color: C.green, name: "V-composition",
         desc: "Layer 1이 쓴 정보가, Layer 2 head의 Value를 통해 전달됩니다.",
         example: "복잡한 정보 변환을 구현하는 데 사용" },
  };

  const info = compInfo[comp];

  return (
    <>
      <SectionTitle subtitle="Head 간의 협력">
        5. Two-Layer — Composition
      </SectionTitle>

      <P>
        2-layer 모델에서 질적으로 새로운 현상이 나타납니다 — head 간의{" "}
        <strong style={{ color: C.orange }}>composition(합성)</strong>.
      </P>

      <P>
        1-layer에서는 각 head가 원본 임베딩만 읽을 수 있었지만, 2-layer에서는
        layer 2의 head가 <strong style={{ color: C.orange }}>layer 1의 head가 residual stream에 쓴 결과</strong>까지
        읽을 수 있습니다.
      </P>

      <Box label="세 가지 Composition" color={C.orange}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: C.textDim }}>
            <strong style={{ color: C.purple }}>Q-composition</strong>: layer 1의 출력이 layer 2 head의 Query에 영향
          </span>
          <span style={{ color: C.textDim }}>
            <strong style={{ color: C.orange }}>K-composition</strong>: layer 1의 출력이 layer 2 head의 Key에 영향
          </span>
          <span style={{ color: C.textDim }}>
            <strong style={{ color: C.green }}>V-composition</strong>: layer 1의 출력이 layer 2 head의 Value에 영향
          </span>
        </div>
      </Box>

      <P>
        이것이 가능해지면 <strong style={{ color: C.orange }}>2단계 알고리즘</strong>을 구현할 수 있습니다.
      </P>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        1-layer 모델에서 각 attention head는 residual stream에서 무엇을 읽을 수 있었나요?
        2-layer 모델의 layer 2 head는 어떤 점이 다를까요?
      </Question>
      <Answer visible={q1}>
        1-layer 모델에서 head는 오직 <strong style={{ color: C.accent }}>원본 토큰 임베딩</strong>만
        읽을 수 있습니다.
        하지만 2-layer 모델의 layer 2 head는 residual stream에{" "}
        <strong style={{ color: C.orange }}>layer 1의 모든 head가 쓴 결과가 이미 더해져 있으므로</strong>,
        원본 임베딩뿐 아니라 layer 1 head가 추가한 정보까지 읽을 수 있습니다.
        이것이 <strong style={{ color: C.orange }}>head 간 협력</strong>을 가능하게 합니다.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            Layer 1의 head가 각 토큰에 '직전 토큰의 정보'를 써넣었다고 합시다.
            이 추가된 정보는 layer 2 head의 Q, K, V 중 어디에 영향을 미치는 것일까요?
          </Question>
          <Answer visible={q2}>
            Layer 1의 head가 "Potter" 위치의 residual stream에 "직전에 Harry가 있었다"는 정보를 썼습니다.
            Layer 2의 head 입장에서, "Potter"는 <strong style={{ color: C.orange }}>후보 위치</strong>(=attention 대상)이고,
            후보 위치에서 만들어지는 것은 <strong style={{ color: C.orange }}>Key</strong>입니다.
            따라서 이 정보는 "Potter"의 <strong style={{ color: C.orange }}>Key 계산</strong>에 영향을 미칩니다.
            이것이 <strong style={{ color: C.orange }}>K-composition</strong>입니다.
            <br /><br />
            직관적으로, Query는 "직전에 Harry가 있었던 토큰은?"이라고 질문하고,
            "Potter"의 Key가 layer 1 덕분에 "네, 제 직전이 Harry였습니다"라고 답할 수 있게 된 것입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Composition 시각화">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn active={comp === "K"} onClick={() => setComp("K")} color={C.orange}>K-composition</Btn>
            <Btn active={comp === "Q"} onClick={() => setComp("Q")} color={C.purple}>Q-composition</Btn>
            <Btn active={comp === "V"} onClick={() => setComp("V")} color={C.green}>V-composition</Btn>
          </div>

          <svg viewBox="0 0 700 360" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Tokens at bottom */}
            {["[A]", "[B]", "...", "[A]"].map((tok, i) => (
              <g key={`tok-${i}`}>
                <rect x={80 + i * 140} y={310} width={60} height={30} rx={6}
                  fill={`${C.accent}20`} stroke={`${C.accent}60`} strokeWidth={1} />
                <text x={110 + i * 140} y={330} fill={C.accent} fontSize={12} textAnchor="middle" fontWeight={600}>
                  {tok}
                </text>
              </g>
            ))}

            {/* Layer 1 */}
            <text x={350} y={245} fill={C.textMuted} fontSize={10} textAnchor="middle">
              Layer 1 (previous token head)
            </text>
            <rect x={40} y={200} width={620} height={40} rx={8}
              fill={`${C.blue}10`} stroke={`${C.blue}50`} strokeWidth={1} strokeDasharray="4 4" />

            {/* Layer 1 head — writes to [B] position */}
            <g>
              <rect x={220} y={205} width={60} height={30} rx={6}
                fill={`${C.blue}30`} stroke={C.blue} strokeWidth={1.5} />
              <text x={250} y={225} fill={C.blue} fontSize={10} textAnchor="middle" fontWeight={600}>
                L1 head
              </text>
              {/* Arrow from [A] to L1 head */}
              <line x1={110} y1={310} x2={240} y2={240} stroke={`${C.blue}80`} strokeWidth={1}
                strokeDasharray="3 3" />
              {/* Arrow from L1 head to [B] residual */}
              <line x1={250} y1={235} x2={250} y2={310} stroke={C.blue} strokeWidth={1.5}
                markerEnd="url(#arrCompB)" />
              <text x={290} y={275} fill={C.blue} fontSize={9}>직전 토큰 정보 씀</text>
            </g>

            {/* Layer 2 */}
            <text x={350} y={115} fill={C.textMuted} fontSize={10} textAnchor="middle">
              Layer 2 (induction head)
            </text>
            <rect x={40} y={70} width={620} height={40} rx={8}
              fill={`${info.color}10`} stroke={`${info.color}50`} strokeWidth={1} strokeDasharray="4 4" />

            {/* Layer 2 head — reads from current position [A] (last) */}
            <g>
              <rect x={500} y={75} width={60} height={30} rx={6}
                fill={`${info.color}30`} stroke={info.color} strokeWidth={1.5} />
              <text x={530} y={95} fill={info.color} fontSize={10} textAnchor="middle" fontWeight={600}>
                L2 head
              </text>

              {/* Composition arrow based on selection */}
              {comp === "K" && (
                <>
                  {/* Flow: L1 writes to [B] → L2 reads [B] as Key */}
                  <path d={`M 250 205 Q 250 150 250 110`} fill="none"
                    stroke={C.orange} strokeWidth={2} markerEnd="url(#arrCompK)" />
                  <text x={140} y={160} fill={C.orange} fontSize={10} fontWeight={600}>
                    → [B]의 Key 계산에 반영
                  </text>
                </>
              )}
              {comp === "Q" && (
                <>
                  <path d={`M 530 205 Q 530 150 530 110`} fill="none"
                    stroke={C.purple} strokeWidth={2} markerEnd="url(#arrCompQ)" />
                  <text x={370} y={160} fill={C.purple} fontSize={10} fontWeight={600}>
                    → 현재 위치 Query 계산에 반영
                  </text>
                </>
              )}
              {comp === "V" && (
                <>
                  <path d={`M 250 205 Q 250 150 250 110`} fill="none"
                    stroke={C.green} strokeWidth={2} markerEnd="url(#arrCompV)" />
                  <text x={140} y={160} fill={C.green} fontSize={10} fontWeight={600}>
                    → [B]의 Value 계산에 반영
                  </text>
                </>
              )}

              {/* L2 attention from [A] last → [B] */}
              <path d="M 530 75 Q 380 40 250 70" fill="none"
                stroke={info.color} strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arrCompMain)" />
              <text x={390} y={35} fill={info.color} fontSize={10} fontWeight={600}>
                Layer 2 attention: "[A]"가 "[B]"에 주목
              </text>
            </g>

            <defs>
              <marker id="arrCompB" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.blue} />
              </marker>
              <marker id="arrCompK" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.orange} />
              </marker>
              <marker id="arrCompQ" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.purple} />
              </marker>
              <marker id="arrCompV" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.green} />
              </marker>
              <marker id="arrCompMain" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={info.color} />
              </marker>
            </defs>
          </svg>

          <div style={{
            marginTop: 12, padding: "0.75rem 1rem",
            background: `${info.color}10`, borderLeft: `3px solid ${info.color}`,
            borderRadius: 6,
          }}>
            <div style={{ color: info.color, fontWeight: 600, fontSize: "0.9em", marginBottom: 4 }}>
              {info.name}
            </div>
            <div style={{ color: C.textDim, fontSize: "0.85em" }}>
              {info.desc} <span style={{ color: C.textMuted }}>({info.example})</span>
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 6 — Induction Head
   ══════════════════════════════════════════════════════ */

const INDUCTION_A_OPTIONS = ["Harry", "The", "Dr.", "My"];
const INDUCTION_B_OPTIONS = ["Potter", "cat", "Smith", "friend"];

function InductionHeadSection() {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [aIdx, setAIdx] = useState(0);
  const [bIdx, setBIdx] = useState(0);
  const [step, setStep] = useState(0); // 0, 1, 2

  const a = INDUCTION_A_OPTIONS[aIdx];
  const b = INDUCTION_B_OPTIONS[bIdx];

  return (
    <>
      <SectionTitle subtitle="In-Context Learning의 시작">
        6. Induction Head
      </SectionTitle>

      <P>
        Induction head가 수행하는 패턴: 시퀀스에서{" "}
        <strong style={{ color: C.orange }}>[A][B] ... [A]</strong>가 나타났을 때,
        다음 토큰으로 <strong style={{ color: C.orange }}>[B]</strong>를 예측.
      </P>

      <Box label="구체적 예" color={C.orange}>
        "Harry Potter is ... Harry" → <strong style={{ color: C.orange }}>"Potter" 예측</strong>.
        이전에 "Harry Potter"라는 패턴을 보았으니, "Harry"가 다시 나오면 "Potter"가 올 것이라고 예측합니다.
      </Box>

      <P>
        이것이 왜 강력한가? 학습 데이터에 "Harry Potter"가 없었더라도,
        현재 입력 문맥(context) 안에서 패턴을 발견하여 예측에 활용합니다.
        이것이 <strong style={{ color: C.orange }}>in-context learning</strong>의 가장 기초적 형태입니다.
      </P>

      <Box label="왜 2-layer가 필요한가?" color={C.accent}>
        두 단계의 작업이 필요합니다:
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          <span style={{ color: C.textDim }}>
            <strong style={{ color: C.blue }}>Step 1 (Layer 1, previous token head)</strong>:
            각 토큰에 "내 직전 토큰은 ○○였다"는 정보를 씀.
          </span>
          <span style={{ color: C.textDim }}>
            <strong style={{ color: C.orange }}>Step 2 (Layer 2, induction head)</strong>:
            현재 위치의 [A]에서, "직전에 [A]가 있었다"는 정보가 Key에 담긴 토큰([B])을 찾아
            주목하고, [B]의 정보를 복사.
          </span>
        </div>
        이 두 head의 협력이 <strong style={{ color: C.orange }}>K-composition</strong>의 실제 사례입니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        다음 시퀀스를 보세요: "The quick brown fox jumps over the lazy dog. The quick brown fox".
        이 시퀀스의 마지막에서, induction head는 무엇을 예측할까요?
        그리고 그 예측을 위해 어떤 두 단계가 필요할까요?
      </Question>
      <Answer visible={q1}>
        Induction head는 <strong style={{ color: C.orange }}>"jumps"</strong>를 예측합니다.
        이전에 "fox" 다음에 "jumps"가 왔으므로, "fox"가 다시 나오면 "jumps"를 예측합니다.
        <br /><br />
        두 단계: (1) Layer 1의 previous token head가 "jumps" 위치에 "직전에 fox가 있었다"는 정보를 씀.
        (2) Layer 2의 induction head가 현재 "fox" 위치에서, "직전이 fox였다"는 Key를 가진
        "jumps"를 찾아 주목하고, "jumps"의 정보를 복사.
      </Answer>

      {q1 && (
        <>
          <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
            Induction head의 메커니즘은 특정 단어(예: 'Harry', 'Potter')에 의존하나요,
            아니면 임의의 토큰 쌍에 대해 작동하나요?
            이것이 in-context learning과 어떻게 연결되나요?
          </Question>
          <Answer visible={q2}>
            Induction head는 <strong style={{ color: C.accent }}>특정 단어에 의존하지 않습니다</strong>.
            [A][B] 패턴에서 A와 B가 어떤 토큰이든 상관없이 작동합니다.
            학습 데이터에 한 번도 나오지 않은 완전히 새로운 토큰 조합이라도,
            현재 문맥 안에서 패턴이 관찰되면 그것을 활용할 수 있습니다.
            <br /><br />
            이것이 바로 <strong style={{ color: C.orange }}>in-context learning</strong>의 핵심입니다 —
            모델의 가중치에 저장된 지식이 아니라, 현재 입력 문맥에서 패턴을 발견하여
            실시간으로 활용하는 능력입니다.
          </Answer>
        </>
      )}

      {q2 && (
        <Panel label="Induction Head 시뮬레이터">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 4 }}>[A] 선택</div>
              <div style={{ display: "flex", gap: 6 }}>
                {INDUCTION_A_OPTIONS.map((t, i) => (
                  <Btn key={i} active={aIdx === i} onClick={() => { setAIdx(i); setStep(0); }} color={C.blue}>
                    {t}
                  </Btn>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 4 }}>[B] 선택</div>
              <div style={{ display: "flex", gap: 6 }}>
                {INDUCTION_B_OPTIONS.map((t, i) => (
                  <Btn key={i} active={bIdx === i} onClick={() => { setBIdx(i); setStep(0); }} color={C.orange}>
                    {t}
                  </Btn>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Btn active={step >= 1} onClick={() => setStep(1)} color={C.blue}>
              Step 1 실행: Layer 1
            </Btn>
            <Btn active={step >= 2} onClick={() => step >= 1 && setStep(2)}
              color={C.orange} disabled={step < 1}>
              Step 2 실행: Layer 2
            </Btn>
            <Btn onClick={() => setStep(0)} color={C.textMuted}>리셋</Btn>
          </div>

          <svg viewBox="0 0 750 340" style={{ width: "100%", maxWidth: 750, display: "block", margin: "0 auto" }}>
            {/* Sequence at bottom */}
            {[a, b, "is", "very", "interesting.", a, "___"].map((tok, i) => {
              const isA = i === 0 || i === 5;
              const isB = i === 1;
              const isPred = i === 6;
              const color = isA ? C.blue : isB ? C.orange : isPred ? C.green : C.textMuted;
              return (
                <g key={`seq-${i}`}>
                  <rect x={20 + i * 105} y={280} width={90} height={32} rx={6}
                    fill={`${color}20`} stroke={color} strokeWidth={isA || isB ? 1.5 : 1}
                    strokeDasharray={isPred ? "4 3" : "none"} />
                  <text x={65 + i * 105} y={300} fill={color}
                    fontSize={11} textAnchor="middle" fontWeight={isA || isB || isPred ? 700 : 400}>
                    {tok}
                  </text>
                </g>
              );
            })}

            {/* Step 1: Layer 1 annotation on [B] */}
            {step >= 1 && (
              <g style={{ transition: "opacity 0.5s ease" }}>
                <rect x={125} y={220} width={90} height={44} rx={6}
                  fill={`${C.blue}20`} stroke={C.blue} strokeWidth={1.5} strokeDasharray="3 3" />
                <text x={170} y={238} fill={C.blue} fontSize={9} textAnchor="middle" fontWeight={600}>
                  Layer 1 씀:
                </text>
                <text x={170} y={254} fill={C.blue} fontSize={10} textAnchor="middle" fontWeight={700}>
                  "직전 = {a}"
                </text>
                <line x1={170} y1={264} x2={170} y2={280} stroke={C.blue} strokeWidth={1.5}
                  markerEnd="url(#arrInd1)" />
              </g>
            )}

            {/* Step 2: Layer 2 - Query from current [A], matches [B]'s Key, copies B */}
            {step >= 2 && (
              <g style={{ transition: "opacity 0.5s ease" }}>
                {/* Query from last [A] */}
                <rect x={545} y={150} width={80} height={36} rx={6}
                  fill={`${C.orange}20`} stroke={C.orange} strokeWidth={1.5} />
                <text x={585} y={167} fill={C.orange} fontSize={9} textAnchor="middle" fontWeight={600}>
                  Query:
                </text>
                <text x={585} y={180} fill={C.orange} fontSize={9} textAnchor="middle">
                  "직전이 {a}인 토큰은?"
                </text>
                {/* Arrow from last A to Query box */}
                <line x1={585} y1={280} x2={585} y2={188} stroke={C.orange} strokeWidth={1.5}
                  strokeDasharray="3 3" markerEnd="url(#arrInd2)" />

                {/* Match arrow from Query to [B]'s K-composed key */}
                <path d="M 545 168 Q 360 130 225 220" fill="none"
                  stroke={C.orange} strokeWidth={2} markerEnd="url(#arrInd2)" />
                <text x={390} y={135} fill={C.orange} fontSize={9} fontWeight={600}>
                  매칭!
                </text>

                {/* Copy arrow: B → prediction */}
                <path d="M 110 280 Q 400 60 670 280" fill="none"
                  stroke={C.green} strokeWidth={2} strokeDasharray="5 3" markerEnd="url(#arrInd3)" />
                <text x={390} y={55} fill={C.green} fontSize={10} fontWeight={700}>
                  "{b}" 정보 복사 → 예측
                </text>

                {/* Final prediction */}
                <rect x={625} y={235} width={80} height={30} rx={6}
                  fill={`${C.green}30`} stroke={C.green} strokeWidth={2} />
                <text x={665} y={255} fill={C.green} fontSize={12} textAnchor="middle" fontWeight={700}>
                  예측: {b}
                </text>
              </g>
            )}

            <defs>
              <marker id="arrInd1" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.blue} />
              </marker>
              <marker id="arrInd2" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.orange} />
              </marker>
              <marker id="arrInd3" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                <polygon points="0 0, 6 2.5, 0 5" fill={C.green} />
              </marker>
            </defs>
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 12 }}>
            이 2단계 협력이 가능한 이유는 <strong style={{ color: C.orange }}>K-composition</strong> 때문입니다.
            Layer 1이 [B]의 Key에 새로운 정보를 추가해주었기 때문에, Layer 2가 [B]를 찾을 수 있게 되었습니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 7 — Logit Lens
   ══════════════════════════════════════════════════════ */

const LOGIT_LENS_DATA = [
  { layer: 0, top: [{ t: "the", p: 0.15 }, { t: "a", p: 0.12 }, { t: "and", p: 0.08 }, { t: "of", p: 0.06 }, { t: "to", p: 0.05 }] },
  { layer: 1, top: [{ t: "the", p: 0.14 }, { t: "a", p: 0.11 }, { t: "of", p: 0.09 }, { t: "and", p: 0.07 }, { t: "to", p: 0.05 }] },
  { layer: 2, top: [{ t: "the", p: 0.13 }, { t: "France", p: 0.09 }, { t: "a", p: 0.08 }, { t: "Europe", p: 0.06 }, { t: "of", p: 0.05 }] },
  { layer: 3, top: [{ t: "France", p: 0.18 }, { t: "Europe", p: 0.12 }, { t: "Paris", p: 0.10 }, { t: "the", p: 0.08 }, { t: "Italy", p: 0.05 }] },
  { layer: 4, top: [{ t: "France", p: 0.22 }, { t: "Paris", p: 0.18 }, { t: "Europe", p: 0.11 }, { t: "Italy", p: 0.06 }, { t: "the", p: 0.05 }] },
  { layer: 5, top: [{ t: "Paris", p: 0.28 }, { t: "France", p: 0.20 }, { t: "Europe", p: 0.10 }, { t: "Italy", p: 0.05 }, { t: "Lyon", p: 0.04 }] },
  { layer: 6, top: [{ t: "Paris", p: 0.42 }, { t: "France", p: 0.15 }, { t: "Europe", p: 0.08 }, { t: "Lyon", p: 0.04 }, { t: "Italy", p: 0.03 }] },
  { layer: 7, top: [{ t: "Paris", p: 0.55 }, { t: "France", p: 0.12 }, { t: "Europe", p: 0.06 }, { t: "Lyon", p: 0.03 }, { t: "the", p: 0.02 }] },
  { layer: 8, top: [{ t: "Paris", p: 0.68 }, { t: "France", p: 0.08 }, { t: "Europe", p: 0.04 }, { t: "Lyon", p: 0.02 }, { t: "Italy", p: 0.02 }] },
  { layer: 9, top: [{ t: "Paris", p: 0.75 }, { t: "France", p: 0.06 }, { t: "Europe", p: 0.03 }, { t: "Lyon", p: 0.02 }, { t: "the", p: 0.01 }] },
  { layer: 10, top: [{ t: "Paris", p: 0.82 }, { t: "France", p: 0.04 }, { t: "Europe", p: 0.02 }, { t: "Lyon", p: 0.01 }, { t: "Italy", p: 0.01 }] },
  { layer: 11, top: [{ t: "Paris", p: 0.88 }, { t: "France", p: 0.03 }, { t: "Europe", p: 0.01 }, { t: "Lyon", p: 0.01 }, { t: "Italy", p: 0.01 }] },
];

function LogitLensSection() {
  const [q1, setQ1] = useState(false);
  const [selLayer, setSelLayer] = useState(6);

  return (
    <>
      <SectionTitle subtitle="Residual Stream을 들여다보는 도구">
        7. Logit Lens
      </SectionTitle>

      <P>
        지금까지 배운 residual stream 관점의 실용적 응용입니다.
        Unembedding matrix <Eq>{'W_U'}</Eq>는 원래 마지막 layer의 출력에만 적용하지만,
        같은 <Eq>{'W_U'}</Eq>를 <strong style={{ color: C.yellow }}>중간 layer</strong>에 적용하면
        그 시점까지의 "중간 예측 상태"를 엿볼 수 있습니다.
      </P>

      <MathBlock>{'\\text{logits}_l = W_U \\cdot h_l, \\quad P_l(\\text{next}) = \\text{softmax}(W_U \\cdot h_l)'}</MathBlock>

      <Box label="왜 작동하는가?" color={C.yellow}>
        residual stream 구조에서 모든 layer가 <strong style={{ color: C.yellow }}>같은 벡터 공간</strong>에서
        정보를 누적하므로, 어느 지점에서든 <Eq>{'W_U'}</Eq>를 적용하면 해석 가능한 결과를 얻습니다.
      </Box>

      <Box label="전형적 패턴" color={C.yellow}>
        초기 layer에서는 평탄한 분포 → 중간 layer에서 정답 토큰 등장 → 후반 layer에서 확신 강화.
        특정 layer에서 예측이 급변하면, 그 layer의 특정 head나 FFN이 결정적 정보를 추가했다는 뜻입니다.
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        만약 residual connection이 없었다면 (즉, 각 layer가 입력을 완전히 다른 공간으로 변환한다면),
        Logit Lens는 왜 작동하지 않을 수 있을까요?
      </Question>
      <Answer visible={q1}>
        Residual connection이 없으면 중간 layer의 출력이 최종 layer의 출력과{" "}
        <strong style={{ color: C.accent }}>전혀 다른 벡터 공간</strong>에 있을 수 있습니다.
        최종 layer용으로 학습된 <Eq>{'W_U'}</Eq>를 중간 layer에 적용해도 해석 가능한 결과가
        나온다는 보장이 없습니다.
        <br /><br />
        Residual stream은 모든 layer가 <strong style={{ color: C.accent }}>같은 공간에서 정보를 누적</strong>하도록
        강제하므로, <Eq>{'W_U'}</Eq>가 어느 지점에서든 의미 있는 결과를 산출합니다.
        이것이 섹션 1의 residual stream 관점이 단순한 해석의 편의가 아니라,
        실제로 강력한 분석 도구를 가능케 하는 핵심이라는 것을 보여줍니다.
      </Answer>

      {q1 && (
        <Panel label="Logit Lens 시뮬레이터">
          <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 12 }}>
            입력: "The Eiffel Tower is located in ___". 각 layer에서의 top-5 예측을 관찰합니다.
          </p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {LOGIT_LENS_DATA.map((d) => (
              <Btn key={d.layer} active={selLayer === d.layer} onClick={() => setSelLayer(d.layer)}
                color={C.yellow}>
                L{d.layer}
              </Btn>
            ))}
          </div>

          <svg viewBox="0 0 700 420" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
            {/* Heatmap grid — layer vs top-token */}
            <text x={350} y={16} fill={C.yellow} fontSize={11} textAnchor="middle" fontWeight={700}>
              Layer별 Top-5 예측 변화
            </text>

            {LOGIT_LENS_DATA.map((d, li) => {
              const y = 30 + li * 22;
              const isSelected = selLayer === d.layer;
              return (
                <g key={`lrow-${li}`}>
                  <text x={30} y={y + 14} fill={isSelected ? C.yellow : C.textMuted}
                    fontSize={9} fontWeight={isSelected ? 700 : 400}>
                    L{d.layer}
                  </text>
                  {d.top.map((item, i) => {
                    const x = 70 + i * 120;
                    const isParis = item.t === "Paris";
                    return (
                      <g key={`lc-${li}-${i}`}>
                        <rect x={x} y={y + 2} width={110} height={18} rx={3}
                          fill={isParis ? C.green : C.yellow}
                          opacity={item.p * 1.5 + 0.05} />
                        <text x={x + 6} y={y + 15} fill={C.text} fontSize={9}>
                          {item.t}
                        </text>
                        <text x={x + 100} y={y + 15} fill={C.textDim} fontSize={8} textAnchor="end">
                          {(item.p * 100).toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Selected layer detail bar chart */}
            <text x={350} y={328} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={600}>
              Layer {selLayer} 상세
            </text>
            {LOGIT_LENS_DATA[selLayer].top.map((item, i) => {
              const barW = item.p * 400;
              const y = 340 + i * 16;
              return (
                <g key={`d-${i}`}>
                  <text x={80} y={y + 11} fill={C.text} fontSize={10} textAnchor="end" fontWeight={600}>
                    {item.t}
                  </text>
                  <rect x={90} y={y + 2} width={barW} height={12} rx={2}
                    fill={item.t === "Paris" ? C.green : C.yellow} opacity={0.6}
                    style={{ transition: "width 0.4s ease" }} />
                  <text x={100 + barW} y={y + 11} fill={C.textDim} fontSize={9}>
                    {(item.p * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}
          </svg>

          <p style={{ color: C.textMuted, fontSize: "0.85em", textAlign: "center", marginTop: 8 }}>
            Layer 3~6 사이에서 "Paris"가 상위권에 진입 — 이 구간에서 결정적 정보가 추가되었습니다.
          </p>
        </Panel>
      )}
    </>
  );
}


/* ══════════════════════════════════════════════════════
   SECTION 8 — Summary
   ══════════════════════════════════════════════════════ */

function Summary() {
  const cards = [
    { title: "Residual Stream", color: C.accent, text: "공유 통신 채널 — 각 구성요소가 독립적으로 읽고 씀" },
    { title: "Q-K / O-V 분리", color: C.purple, text: "어디에 주목? / 무슨 정보를 이동? — 두 독립적 회로" },
    { title: "0-Layer: Bigram", color: C.blue, text: "W_U W_E — 직전 토큰만 보고 예측" },
    { title: "1-Layer: Skip-Trigram", color: C.green, text: "bigram + 먼 토큰 참조 — path expansion으로 분해" },
    { title: "2-Layer: Induction Head", color: C.orange, text: "head 간 composition → [A][B]...[A]→[B] — in-context learning" },
    { title: "Logit Lens", color: C.yellow, text: "중간 layer에 W_U 적용 → 예측 상태의 점진적 형성 관찰" },
  ];

  return (
    <>
      <SectionTitle subtitle="전체 그림">8. 요약</SectionTitle>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 16, margin: "2rem 0",
      }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderTop: `3px solid ${c.color}`, borderRadius: 12, padding: "1.25rem",
          }}>
            <div style={{ color: c.color, fontWeight: 700, fontSize: "0.85em", marginBottom: 8 }}>
              {c.title}
            </div>
            <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
              {c.text}
            </div>
          </div>
        ))}
      </div>

      <Box label="이후 학습 연결" color={C.purple}>
        <P>
          Week 2에서는 FFN이 추가된 완전한 Transformer에서{" "}
          <strong style={{ color: C.green }}>사실적 지식이 어디에 저장되는지</strong> (Geva et al.)와
          그것을 <strong style={{ color: C.orange }}>찾아서 편집하는 방법</strong> (ROME)을 다룹니다.
          Residual stream 관점과 Logit Lens가 이 분석의 핵심 도구로 활용됩니다.
        </P>
        <P>
          Week 3에서는 induction head를 더 깊이 다루는 후속 논문{" "}
          <em>In-context Learning and Induction Heads</em>와, 이런 회로를{" "}
          <strong style={{ color: C.purple }}>자동으로 발견</strong>하는 ACDC 기법을 학습합니다.
        </P>
      </Box>
    </>
  );
}


/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */

export default function TransformerCircuitsBlog() {
  return (
    <div style={{ color: C.text, fontFamily: "var(--font-sans)", lineHeight: 1.7 }}>
      <style>{`
        input[type="range"] {
          -webkit-appearance: none; appearance: none;
          height: 6px; border-radius: 3px; background: ${C.surface}; outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%; background: ${C.accent}; cursor: pointer;
        }
      `}</style>
      <article>
        <section style={{ marginBottom: "5rem" }}><Introduction /></section>
        <section style={{ marginBottom: "5rem" }}><ResidualStreamSection /></section>
        <section style={{ marginBottom: "5rem" }}><QKOVCircuitSection /></section>
        <section style={{ marginBottom: "5rem" }}><ZeroLayerSection /></section>
        <section style={{ marginBottom: "5rem" }}><OneLayerSection /></section>
        <section style={{ marginBottom: "5rem" }}><CompositionSection /></section>
        <section style={{ marginBottom: "5rem" }}><InductionHeadSection /></section>
        <section style={{ marginBottom: "5rem" }}><LogitLensSection /></section>
        <section style={{ marginBottom: "5rem" }}><Summary /></section>
      </article>
    </div>
  );
}
