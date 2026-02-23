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
      maxHeight: visible ? 5000 : 0,
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

/* ─── Proof Block ─── */
const ProofBlock = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      margin: "1.5rem 0",
      border: `1px solid ${C.purple}40`,
      borderRadius: 12,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          background: `${C.purple}12`,
          border: "none",
          color: C.purple,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: "0.95rem",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <span style={{
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          fontSize: "0.8em",
        }}>▶</span>
        {title}
      </button>
      <div style={{
        maxHeight: open ? 5000 : 0,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          background: C.surface,
          color: C.textDim,
          lineHeight: 1.8,
          fontSize: "0.95rem",
          borderTop: `1px solid ${C.purple}20`,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════
   0. Introduction
   ═══════════════════════════════════════════════════════════════ */
function Introduction() {
  return (
    <div>
      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        <GradLink href="/blog/la-1-2">이전 글</GradLink>에서 우리는 벡터공간, 부분공간, 그리고 생성공간(span)의 개념을 배웠습니다.
        임의의 벡터 집합으로부터 <Eq>{'\\text{span}(S)'}</Eq>를 만들면 부분공간이 됩니다.
        이제 자연스러운 질문이 떠오릅니다: <strong style={{ color: C.accent }}>그 집합에 불필요한 벡터가 있지는 않은가?</strong>
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        <Eq>{'\\mathbb{R}^2'}</Eq>에서 <Eq>{'\\{(1,0),\\,(0,1),\\,(2,3)\\}'}</Eq>은 <Eq>{'\\mathbb{R}^2'}</Eq>를 생성하지만,
        세 번째 벡터 <Eq>{'(2,3) = 2(1,0) + 3(0,1)'}</Eq>은 나머지 둘의 선형결합입니다.
        이런 <strong style={{ color: C.text }}>여분 없이 딱 필요한 만큼의 벡터</strong>로 공간을 기술하는 것이
        <strong style={{ color: C.accent }}> 기저(basis)</strong>의 핵심 아이디어입니다.
      </p>

      <Box color={C.accent} label="이 글의 여정">
        "불필요한 벡터"의 직관에서 출발하여,
        <strong style={{ color: C.blue }}> 일차독립의 두 가지 동치 관점</strong>을 증명하고,
        <strong style={{ color: C.green }}> 기저 = 일차독립 + 생성</strong>을 정의한 뒤,
        <strong style={{ color: C.purple }}> 차원(dimension)</strong>의 불변성을 보이고,
        <strong style={{ color: C.orange }}> 동형사상(isomorphism)</strong>을 통해 벡터공간을 분류합니다.
        마지막으로 <strong style={{ color: C.yellow }}>부분공간의 차원 공식</strong>을 증명합니다.
      </Box>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   1. Redundant Vectors
   ═══════════════════════════════════════════════════════════════ */
function RedundantVectors() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="생성집합에서 불필요한 벡터 찾기">
        1. 출발점: 불필요한 벡터란?
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        <Eq>{'\\mathbb{R}^2'}</Eq>에서 세 벡터 <Eq>{'v_1 = (1,0)'}</Eq>, <Eq>{'v_2 = (0,1)'}</Eq>, <Eq>{'v_3 = (2,3)'}</Eq>을 생각합시다.
      </p>

      <Question number={1} revealed={revealed} onReveal={() => setRevealed(true)}>
        이 세 벡터의 span은 무엇일까요? 그리고 세 벡터가 <strong style={{ color: C.question }}>모두 필요한가요</strong>,
        아니면 일부를 빼도 같은 span을 유지할 수 있을까요?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'av_1 + bv_2 = (a, b)'}</Eq>이므로 <Eq>{'v_1, v_2'}</Eq>만으로 이미 임의의 <Eq>{'\\mathbb{R}^2'}</Eq> 벡터를 만들 수 있습니다.
          즉 <Eq>{'\\text{span}\\{v_1, v_2, v_3\\} = \\mathbb{R}^2'}</Eq>이고, <Eq>{'v_3'}</Eq>를 빼도 됩니다.
        </p>
        <p>
          더 나아가 <Eq>{'v_3 = 2v_1 + 3v_2'}</Eq>이므로, <Eq>{'v_1'}</Eq>이나 <Eq>{'v_2'}</Eq> 중 하나를 빼고 <Eq>{'v_3'}</Eq>을 남겨도
          같은 span을 만들 수 있습니다. 예를 들어 <Eq>{'\\{v_2, v_3\\} = \\{(0,1), (2,3)\\}'}</Eq>도 <Eq>{'\\mathbb{R}^2'}</Eq>를 생성합니다.
        </p>
      </Answer>

      {revealed && (
        <Box color={C.green} label="핵심 관찰">
          <Eq>{'v_3'}</Eq>은 나머지 벡터들의 선형결합으로 표현됩니다.
          이런 벡터는 span에 새로운 것을 보태지 못하므로 <strong style={{ color: C.text }}>"불필요"</strong>합니다.
          이 직관을 엄밀하게 정의한 것이 <strong style={{ color: C.accent }}>일차독립(linear independence)</strong>입니다.
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   2. Two Perspectives on Linear Independence
   ═══════════════════════════════════════════════════════════════ */
function TwoPerspectives() {
  const [revealedQ2, setRevealedQ2] = useState(false);
  const [revealedQ3, setRevealedQ3] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="직관적 관점과 공식 정의의 동치성">
        2. 일차독립의 두 얼굴
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        "불필요한 벡터가 없다"는 직관을 엄밀하게 만들 수 있는 두 가지 방법이 있습니다:
      </p>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{
            padding: 20,
            background: C.surface,
            borderRadius: 12,
            borderLeft: `4px solid ${C.blue}`,
          }}>
            <div style={{ color: C.blue, fontWeight: 700, marginBottom: 8, fontSize: "0.9em" }}>관점 (A) — 직관적</div>
            <div style={{ color: C.text, lineHeight: 1.7 }}>
              어떤 벡터도 <strong>나머지의 선형결합으로 표현되지 않는다</strong>.
            </div>
          </div>
          <div style={{
            padding: 20,
            background: C.surface,
            borderRadius: 12,
            borderLeft: `4px solid ${C.green}`,
          }}>
            <div style={{ color: C.green, fontWeight: 700, marginBottom: 8, fontSize: "0.9em" }}>관점 (B) — 공식 정의</div>
            <div style={{ color: C.text, lineHeight: 1.7 }}>
              <strong>영벡터를 만드는 선형결합은 자명한 것뿐이다.</strong>
            </div>
            <MathBlock>{'a_1 v_1 + a_2 v_2 + \\cdots + a_n v_n = \\mathbf{0} \\;\\Longrightarrow\\; a_1 = a_2 = \\cdots = a_n = 0'}</MathBlock>
          </div>
        </div>
      </div>

      <Question number={2} revealed={revealedQ2} onReveal={() => setRevealedQ2(true)}>
        이 두 관점이 왜 같은 말인지 증명해 봅시다. 먼저 <strong style={{ color: C.blue }}>(A)가 깨지면 (B)도 깨진다</strong>는 것을 보이세요.
        즉, 어떤 <Eq>{'v_k'}</Eq>가 나머지의 선형결합이면, 영벡터의 비자명한 표현을 찾을 수 있음을 보이세요.
      </Question>

      <Answer visible={revealedQ2}>
        <p style={{ marginBottom: "1rem" }}>
          어떤 <Eq>{'v_k'}</Eq>가 나머지의 선형결합으로 표현된다고 가정합시다:
        </p>
        <MathBlock>{'v_k = b_1 v_1 + \\cdots + b_{k-1} v_{k-1} + b_{k+1} v_{k+1} + \\cdots + b_n v_n'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'v_k'}</Eq>를 이항하면:
        </p>
        <MathBlock>{'b_1 v_1 + \\cdots + b_{k-1} v_{k-1} + (-1) v_k + b_{k+1} v_{k+1} + \\cdots + b_n v_n = \\mathbf{0}'}</MathBlock>
        <p>
          <Eq>{'v_k'}</Eq>의 계수가 <Eq>{'-1 \\neq 0'}</Eq>이므로, 이것은 <strong style={{ color: C.accent }}>비자명한 선형결합</strong>입니다. (B)가 깨집니다. ✓
        </p>
      </Answer>

      {revealedQ2 && (
        <Question number={3} revealed={revealedQ3} onReveal={() => setRevealedQ3(true)}>
          이번엔 반대 방향: <strong style={{ color: C.green }}>(B)가 깨지면 (A)도 깨진다</strong>.
          모두 0이 아닌 스칼라 조합으로 <Eq>{'a_1 v_1 + \\cdots + a_n v_n = \\mathbf{0}'}</Eq>이 성립하면,
          어떤 벡터를 나머지의 선형결합으로 표현할 수 있음을 보이세요.
        </Question>
      )}

      <Answer visible={revealedQ3}>
        <p style={{ marginBottom: "1rem" }}>
          적어도 하나의 <Eq>{'a_k \\neq 0'}</Eq>이 존재합니다. <Eq>{'a_k v_k'}</Eq>만 이항하고 양변을 <Eq>{'-a_k'}</Eq>로 나누면:
        </p>
        <MathBlock>{'v_k = -\\frac{a_1}{a_k} v_1 - \\cdots - \\frac{a_{k-1}}{a_k} v_{k-1} - \\frac{a_{k+1}}{a_k} v_{k+1} - \\cdots - \\frac{a_n}{a_k} v_n'}</MathBlock>
        <p>
          <Eq>{'a_k \\neq 0'}</Eq>이므로 나눗셈이 가능하고, <Eq>{'v_k'}</Eq>가 나머지의 선형결합으로 표현됩니다.
          (A)가 깨집니다. ✓
        </p>
      </Answer>

      {revealedQ3 && (
        <Box color={C.accent} label="정리 — (A) ⟺ (B)">
          <p style={{ marginBottom: "0.5rem" }}>
            (A)와 (B)는 동치입니다. 교재에서 일차독립의 정의를 (B)로 채택하는 이유는 <strong style={{ color: C.text }}>검증이 더 편리</strong>하기 때문입니다.
          </p>
          <p>
            "각 벡터가 나머지로 표현 불가"를 일일이 확인하는 대신,
            <strong style={{ color: C.accent }}> 방정식 하나</strong>를 풀면 됩니다.
          </p>
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   3. Zero Vector Property
   ═══════════════════════════════════════════════════════════════ */
function ZeroVectorProperty() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="일차독립을 즉시 깨뜨리는 벡터">
        3. 영벡터와 일차종속
      </SectionTitle>

      <Question number={4} revealed={revealed} onReveal={() => setRevealed(true)}>
        영벡터 <Eq>{'\\mathbf{0}'}</Eq>을 포함하는 집합, 예를 들어 <Eq>{'\\{(1,0),\\, \\mathbf{0},\\, (0,1)\\} \\subset \\mathbb{R}^2'}</Eq>은
        일차독립일 수 있을까요? 정의 (B)를 직접 적용해서 판단해 보세요.
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          아닙니다. 정의 (B)를 적용하면:
        </p>
        <MathBlock>{'a(1,0) + b \\cdot \\mathbf{0} + c(0,1) = (a, c) = \\mathbf{0}'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          이것은 <Eq>{'a = c = 0'}</Eq>일 때 성립하지만, <Eq>{'b'}</Eq>는 <strong style={{ color: C.yellow }}>어떤 값이든 상관없습니다</strong>.
          예를 들어 <Eq>{'a = 0,\\, b = 1,\\, c = 0'}</Eq>은 비자명한 선형결합입니다.
        </p>
      </Answer>

      {revealed && (
        <Box color={C.red} label="일반 원리">
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: C.text }}>영벡터를 포함하는 집합은 항상 일차종속(linearly dependent)입니다.</strong>
          </p>
          <p>
            영벡터의 계수를 아무 0이 아닌 값으로 놓고 나머지를 전부 0으로 놓으면 비자명한 선형결합이 됩니다.
            관점 (A)로 보면, <Eq>{'\\mathbf{0} = 0 \\cdot v_1 + \\cdots + 0 \\cdot v_n'}</Eq>이므로 영벡터는 항상 "불필요"합니다.
          </p>
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   4. Basis Definition
   ═══════════════════════════════════════════════════════════════ */
function BasisDefinition() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="과하지도, 부족하지도 않은 벡터 집합">
        4. 기저의 정의
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        처음 예시의 <Eq>{'\\{v_1, v_2, v_3\\}'}</Eq>는 <Eq>{'\\mathbb{R}^2'}</Eq>를 생성하지만 <Eq>{'v_3'}</Eq>이 불필요했습니다.
        반면 <Eq>{'\\{v_1, v_2\\}'}</Eq>는 <Eq>{'\\mathbb{R}^2'}</Eq>를 생성하면서 동시에 일차독립입니다.
      </p>

      <Box color={C.accent} label="정의 — 기저 (Basis)">
        벡터공간 <Eq>{'V'}</Eq>의 <strong style={{ color: C.text }}>기저</strong>란,
        <Eq>{'V'}</Eq>를 <strong style={{ color: C.green }}>생성(span)</strong>하면서 동시에
        <strong style={{ color: C.blue }}> 일차독립(linearly independent)</strong>인 부분집합이다.
      </Box>

      <Question number={5} revealed={revealed} onReveal={() => setRevealed(true)}>
        기저의 정의에서 두 조건이 각각 어떤 역할을 할까요?
        <strong style={{ color: C.green }}> 생성 조건만</strong> 있고 일차독립 조건이 없다면,
        또는 <strong style={{ color: C.blue }}>일차독립 조건만</strong> 있고 생성 조건이 없다면 어떤 문제가 생길까요?
      </Question>

      <Answer visible={revealed}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{
            padding: 16,
            background: `${C.green}10`,
            borderRadius: 8,
            borderLeft: `3px solid ${C.green}`,
          }}>
            <div style={{ color: C.green, fontWeight: 600, marginBottom: 4, fontSize: "0.85em" }}>생성 조건만 있다면</div>
            <div style={{ color: C.textDim }}>
              "불필요한 벡터"가 집합에 포함될 수 있습니다. <Eq>{'\\{(1,0), (0,1), (2,3)\\}'}</Eq>처럼요.
              공간을 기술하는 데 <strong style={{ color: C.text }}>과한</strong> 집합이 됩니다.
            </div>
          </div>
          <div style={{
            padding: 16,
            background: `${C.blue}10`,
            borderRadius: 8,
            borderLeft: `3px solid ${C.blue}`,
          }}>
            <div style={{ color: C.blue, fontWeight: 600, marginBottom: 4, fontSize: "0.85em" }}>일차독립 조건만 있다면</div>
            <div style={{ color: C.textDim }}>
              "필요한 벡터"가 집합에서 누락될 수 있습니다. <Eq>{'\\{(1,0)\\}'}</Eq>은 일차독립이지만 <Eq>{'\\mathbb{R}^2'}</Eq>를 생성하지 못합니다.
              공간을 기술하기에 <strong style={{ color: C.text }}>부족한</strong> 집합이 됩니다.
            </div>
          </div>
        </div>
      </Answer>

      {revealed && (
        <Box color={C.yellow} label="기저의 본질">
          기저란 결국 <strong style={{ color: C.text }}>공간을 표현하기 위한 딱 필요한 만큼의 벡터 집합</strong>입니다.
          생성 조건은 부족하지 않게, 일차독립 조건은 과하지 않게 보장합니다.
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   5. Replacement Theorem (Bonus)
   ═══════════════════════════════════════════════════════════════ */
function ReplacementTheorem() {
  const [revealedQ6, setRevealedQ6] = useState(false);
  const [revealedQ7, setRevealedQ7] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="일차독립 ≤ 생성: 차원의 이론적 기초">
        5. 대체 정리
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        <Eq>{'\\mathbb{R}^2'}</Eq>의 기저를 관찰하면,
        <Eq>{'\\{(1,0),(0,1)\\}'}</Eq>, <Eq>{'\\{(1,1),(1,-1)\\}'}</Eq>, <Eq>{'\\{(2,3),(1,0)\\}'}</Eq> 등
        어떤 기저를 골라도 벡터가 <strong style={{ color: C.accent }}>항상 2개</strong>입니다.
        이것이 우연이 아님을 보장하는 도구가 <strong style={{ color: C.purple }}>대체 정리</strong>입니다.
      </p>

      <Box color={C.purple} label="대체 정리 (Replacement Theorem)">
        <Eq>{'V'}</Eq>가 <Eq>{'n'}</Eq>개의 벡터로 이루어진 생성집합 <Eq>{'G = \\{u_1, \\ldots, u_n\\}'}</Eq>을 가지고,{" "}
        <Eq>{'S = \\{w_1, \\ldots, w_m\\}'}</Eq>이 <Eq>{'V'}</Eq>의 일차독립인 부분집합이면,{" "}
        <Eq>{'m \\leq n'}</Eq>이고, <Eq>{'G'}</Eq>의 벡터 중 일부를 <Eq>{'w_i'}</Eq>들로 대체하여
        여전히 <Eq>{'V'}</Eq>를 생성하는 <Eq>{'n'}</Eq>개짜리 집합을 만들 수 있다.
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1rem", marginTop: "1.5rem" }}>
        직관적 아이디어를 먼저 봅시다. <Eq>{'w = (3, 5)'}</Eq>로 기저 <Eq>{'\\{e_1, e_2\\}'}</Eq>의 벡터 하나를 대체하고 싶다면:
      </p>

      <Question number={6} revealed={revealedQ6} onReveal={() => setRevealedQ6(true)}>
        <Eq>{'w = 3e_1 + 5e_2'}</Eq>일 때, <Eq>{'\\{w, e_2\\}'}</Eq>는 <Eq>{'\\mathbb{R}^2'}</Eq>의 기저가 될까요?
        만약 <Eq>{'w = (0, 5) = 0 \\cdot e_1 + 5e_2'}</Eq>라면, <Eq>{'\\{w, e_2\\}'}</Eq>는요?
      </Question>

      <Answer visible={revealedQ6}>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.green }}><Eq>{'w = (3,5)'}</Eq>인 경우</strong>: <Eq>{'\\{w, e_2\\} = \\{(3,5), (0,1)\\}'}</Eq>.
          <Eq>{'aw + be_2 = (3a, 5a+b)'}</Eq>에서 <Eq>{'3a = x'}</Eq>, <Eq>{'5a + b = y'}</Eq>는 임의의 <Eq>{'(x,y)'}</Eq>에 대해 유일한 해를 가집니다. ✓
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.red }}><Eq>{'w = (0,5)'}</Eq>인 경우</strong>: <Eq>{'\\{w, e_2\\} = \\{(0,5), (0,1)\\}'}</Eq>.
          두 벡터가 같은 방향(y축)이므로 일차종속이고, 기저가 <strong>아닙니다</strong>. ✗
        </p>
        <p>
          핵심: <Eq>{'w = 3e_1 + 5e_2'}</Eq>에서 <Eq>{'e_1'}</Eq>을 대체할 수 있었던 이유는 <Eq>{'e_1'}</Eq>의 <strong style={{ color: C.accent }}>계수가 <Eq>{'3 \\neq 0'}</Eq></strong>이었기 때문입니다.
          <Eq>{'w = (0,5)'}</Eq>에서는 <Eq>{'e_1'}</Eq>의 계수가 0이라 대체 불가. 단, <Eq>{'e_2'}</Eq>의 계수는 <Eq>{'5 \\neq 0'}</Eq>이므로 <Eq>{'e_2'}</Eq>를 대체하면 <Eq>{'\\{e_1, w\\}'}</Eq>는 기저가 됩니다.
        </p>
      </Answer>

      {revealedQ6 && (
        <>
          <ProofBlock title="📐 대체 정리의 증명 (귀납법)">
            <p style={{ marginBottom: "1rem" }}>
              <Eq>{'m'}</Eq>에 대한 <strong style={{ color: C.text }}>수학적 귀납법</strong>으로 증명합니다.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.blue }}>기저 단계</strong>: <Eq>{'m = 0'}</Eq>이면 <Eq>{'0 \\leq n'}</Eq>이므로 자명합니다.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.green }}>귀납 단계</strong>: <Eq>{'\\{w_1, \\ldots, w_k\\}'}</Eq>까지 이미 대체되어
            </p>
            <MathBlock>{'G_k = \\{w_1, \\ldots, w_k, u_{k+1}, \\ldots, u_n\\}'}</MathBlock>
            <p style={{ marginBottom: "1rem" }}>
              이 <Eq>{'V'}</Eq>를 생성한다고 가정합니다. <Eq>{'w_{k+1}'}</Eq>은 <Eq>{'G_k'}</Eq>의 선형결합으로 표현 가능하므로:
            </p>
            <MathBlock>{'w_{k+1} = a_1 w_1 + \\cdots + a_k w_k + a_{k+1} u_{k+1} + \\cdots + a_n u_n'}</MathBlock>

            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.yellow }}>핵심 관찰</strong>: <Eq>{'a_{k+1}, \\ldots, a_n'}</Eq> 중 적어도 하나는 0이 아닙니다.
              만약 전부 0이라면 <Eq>{'w_{k+1} = a_1 w_1 + \\cdots + a_k w_k'}</Eq>가 되어
              <Eq>{'\\{w_1, \\ldots, w_{k+1}\\}'}</Eq>이 일차종속이 되는데, 이는 <Eq>{'S'}</Eq>가 일차독립이라는 가정에 모순입니다.
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <Eq>{'a_j \\neq 0'}</Eq>인 <Eq>{'j'}</Eq>를 잡으면, <Eq>{'u_j'}</Eq>를 나머지의 선형결합으로 표현할 수 있습니다.
              따라서 <Eq>{'G_k'}</Eq>에서 <Eq>{'u_j'}</Eq>를 빼고 <Eq>{'w_{k+1}'}</Eq>을 넣은 집합 <Eq>{'G_{k+1}'}</Eq>도 여전히 <Eq>{'V'}</Eq>를 생성합니다.
            </p>

            <p>
              이 과정을 <Eq>{'w_m'}</Eq>까지 반복합니다. 매번 <Eq>{'u_i'}</Eq> 하나를 빼고 <Eq>{'w_i'}</Eq> 하나를 넣으니,
              <Eq>{'u_i'}</Eq>가 바닥나기 전에 끝나야 합니다. 즉 <Eq>{'m \\leq n'}</Eq>. <strong style={{ color: C.accent }}>∎</strong>
            </p>
          </ProofBlock>

          <Question number={7} revealed={revealedQ7} onReveal={() => setRevealedQ7(true)}>
            대체 정리로부터 <strong style={{ color: C.question }}>같은 벡터공간의 두 기저는 항상 같은 크기를 가진다</strong>는 것을 증명할 수 있습니다. 어떻게 하면 될까요?
          </Question>
        </>
      )}

      <Answer visible={revealedQ7}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'V'}</Eq>의 두 기저 <Eq>{'\\{u_1, \\ldots, u_n\\}'}</Eq>과 <Eq>{'\\{w_1, \\ldots, w_m\\}'}</Eq>이 있다고 합시다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.blue }}>한 방향</strong>:
          <Eq>{'\\{u_1, \\ldots, u_n\\}'}</Eq>은 생성집합이고 <Eq>{'\\{w_1, \\ldots, w_m\\}'}</Eq>은 일차독립이므로,
          대체 정리에 의해 <Eq>{'m \\leq n'}</Eq>.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.green }}>반대 방향</strong>:
          <Eq>{'\\{w_1, \\ldots, w_m\\}'}</Eq>은 생성집합이고 <Eq>{'\\{u_1, \\ldots, u_n\\}'}</Eq>은 일차독립이므로,
          대체 정리에 의해 <Eq>{'n \\leq m'}</Eq>.
        </p>
        <p>
          따라서 <Eq>{'m = n'}</Eq>. 기저의 <strong style={{ color: C.text }}>이중적 성격</strong>(일차독립이면서 동시에 생성)을 양방향으로 활용한
          아름다운 대칭적 논증입니다. <strong style={{ color: C.accent }}>∎</strong>
        </p>
      </Answer>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   6. Dimension
   ═══════════════════════════════════════════════════════════════ */
function DimensionSection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="기저의 크기는 항상 일정하다">
        6. 차원의 정의와 실용적 판정법
      </SectionTitle>

      <Box color={C.accent} label="정의 — 차원 (Dimension)">
        벡터공간 <Eq>{'V'}</Eq>의 <strong style={{ color: C.text }}>차원</strong> <Eq>{'\\dim(V)'}</Eq>는
        <Eq>{'V'}</Eq>의 임의의 기저에 포함된 벡터의 개수이다.
        기저마다 크기가 같다는 것을 이미 증명했으므로, 이 정의는 잘 정의됩니다(well-defined).
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        <Eq>{'\\mathbb{R}^2'}</Eq>가 2차원인 이유는 "변수가 2개라서"가 아니라,
        <strong style={{ color: C.text }}> 모든 기저의 크기가 2이기 때문</strong>입니다.
        이 사실에서 매우 실용적인 결과가 따라나옵니다:
      </p>

      <Question number={8} revealed={revealed} onReveal={() => setRevealed(true)}>
        <Eq>{'\\dim(V) = n'}</Eq>일 때, <Eq>{'n'}</Eq>개의 일차독립인 벡터가 있으면 이들이 자동으로 기저가 될까요?
        반대로, <Eq>{'n'}</Eq>개의 벡터가 <Eq>{'V'}</Eq>를 생성하면 자동으로 기저가 될까요?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.green }}>둘 다 "예"입니다!</strong> 대체 정리를 활용한 증명:
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.blue }}>일차독립 → 기저</strong>: <Eq>{'S = \\{v_1, \\ldots, v_n\\}'}</Eq>이 일차독립이고
          <Eq>{'V'}</Eq>의 기저 <Eq>{'G = \\{u_1, \\ldots, u_n\\}'}</Eq>이 있다면, <Eq>{'G'}</Eq>는 생성집합이므로
          대체 정리에 의해 <Eq>{'G'}</Eq>의 벡터 전부를 <Eq>{'S'}</Eq>로 대체할 수 있습니다 (<Eq>{'|S| = |G|'}</Eq>이므로).
          따라서 <Eq>{'S'}</Eq>가 <Eq>{'V'}</Eq>를 생성합니다.
        </p>
        <p>
          <strong style={{ color: C.green }}>생성 → 기저</strong>: 대칭적 논리로, <Eq>{'n'}</Eq>개의 벡터가 생성하면 자동으로 일차독립이 됩니다.
        </p>
      </Answer>

      {revealed && (
        <Box color={C.yellow} label="실용적 판정법">
          <p style={{ marginBottom: "0.5rem" }}>
            <Eq>{'\\dim(V) = n'}</Eq>일 때, <Eq>{'n'}</Eq>개의 벡터로 이루어진 집합은:
          </p>
          <p style={{ textAlign: "center", color: C.text, fontWeight: 600, fontSize: "1.05em" }}>
            일차독립 ⟺ 생성 ⟺ 기저
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <strong style={{ color: C.text }}>둘 중 하나만 확인하면 충분합니다!</strong> 차원을 미리 알고 있다면, 작업량이 절반으로 줄어듭니다.
          </p>
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   7. Basis Example: P₂(ℝ)
   ═══════════════════════════════════════════════════════════════ */
function BasisExample() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="차원 판정법 실전 적용">
        7. 유제: 기저 판정
      </SectionTitle>

      <Question number={9} revealed={revealed} onReveal={() => setRevealed(true)}>
        <Eq>{'P_2(\\mathbb{R})'}</Eq> (차수 2 이하의 실수 다항식)에서 다음 집합이 기저인지 판정하세요:
        <MathBlock>{'S = \\{1 + x,\\; x + x^2,\\; 1 + x^2\\}'}</MathBlock>
        방금 배운 실용적 판정법을 활용해 보세요.
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\dim(P_2(\\mathbb{R})) = 3'}</Eq>이고 <Eq>{'|S| = 3'}</Eq>이므로,
          <strong style={{ color: C.accent }}> 일차독립만 보이면 기저</strong>입니다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'a(1+x) + b(x+x^2) + c(1+x^2) = 0'}</Eq>을 전개하면:
        </p>
        <MathBlock>{'(a+c) + (a+b)x + (b+c)x^2 = 0'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\{1, x, x^2\\}'}</Eq>이 <Eq>{'P_2(\\mathbb{R})'}</Eq>의 기저이므로 각 계수가 0이어야 합니다:
        </p>
        <MathBlock>{'a + c = 0, \\quad a + b = 0, \\quad b + c = 0'}</MathBlock>
        <p>
          이 연립방정식의 유일한 해는 <Eq>{'a = b = c = 0'}</Eq>입니다.
          따라서 <Eq>{'S'}</Eq>는 일차독립이고, <strong style={{ color: C.green }}>기저입니다</strong>. ∎
        </p>
      </Answer>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   8. Isomorphism
   ═══════════════════════════════════════════════════════════════ */
function IsomorphismSection() {
  const [revealedQ10, setRevealedQ10] = useState(false);
  const [revealedQ11, setRevealedQ11] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="차원이 같으면 본질적으로 같은 공간">
        8. 동형사상과 벡터공간의 분류
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        방금 <Eq>{'P_2(\\mathbb{R})'}</Eq>의 문제를 풀면서,
        다항식 <Eq>{'a_0 + a_1 x + a_2 x^2'}</Eq>의 문제를 계수 벡터 <Eq>{'(a_0, a_1, a_2) \\in \\mathbb{R}^3'}</Eq>의 문제로
        <strong style={{ color: C.accent }}> 번역</strong>해서 풀었습니다.
      </p>

      <Question number={10} revealed={revealedQ10} onReveal={() => setRevealedQ10(true)}>
        이 "번역" <Eq>{'T: P_2(\\mathbb{R}) \\to \\mathbb{R}^3'}</Eq>에서 <Eq>{'T(a_0 + a_1 x + a_2 x^2) = (a_0, a_1, a_2)'}</Eq>로 정의합시다.
        이 대응이 <strong style={{ color: C.question }}>덧셈을 보존</strong>하는지 확인해 보세요.
      </Question>

      <Answer visible={revealedQ10}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'p = a_0 + a_1 x + a_2 x^2'}</Eq>, <Eq>{'q = b_0 + b_1 x + b_2 x^2'}</Eq>로 놓으면:
        </p>
        <MathBlock>{'T(p + q) = T\\big((a_0+b_0) + (a_1+b_1)x + (a_2+b_2)x^2\\big) = (a_0+b_0,\\, a_1+b_1,\\, a_2+b_2)'}</MathBlock>
        <MathBlock>{'= (a_0, a_1, a_2) + (b_0, b_1, b_2) = T(p) + T(q) \\quad \\checkmark'}</MathBlock>
        <p>
          스칼라배 보존 <Eq>{'T(cp) = cT(p)'}</Eq>와 전단사(bijection)도 마찬가지로 확인 가능합니다.
        </p>
      </Answer>

      {revealedQ10 && (
        <>
          <Box color={C.purple} label="정의 — 동형사상 (Isomorphism)">
            <p style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: C.text }}>선형 구조(덧셈, 스칼라배)를 보존하는 전단사 함수</strong>를 <strong style={{ color: C.accent }}>동형사상</strong>이라 합니다.
            </p>
            <p>
              동형사상이 존재하는 두 벡터공간을 <strong style={{ color: C.text }}>동형(isomorphic)</strong>이라 하며,
              <Eq>{'P_2(\\mathbb{R}) \\cong \\mathbb{R}^3'}</Eq>이라 씁니다.
              동형인 두 공간은 <strong style={{ color: C.accent }}>벡터공간으로서 본질적으로 같습니다</strong>.
            </p>
          </Box>

          <Question number={11} revealed={revealedQ11} onReveal={() => setRevealedQ11(true)}>
            어떤 벡터공간들이 서로 동형일까요? <Eq>{'P_2(\\mathbb{R}) \\cong \\mathbb{R}^3'}</Eq>이었고,
            이 둘의 공통점은 무엇인가요?
          </Question>
        </>
      )}

      <Answer visible={revealedQ11}>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.accent }}>차원이 같다</strong>는 것입니다.
          사실 이것이 유한차원 벡터공간의 아름다운 분류 정리입니다:
        </p>
        <MathBlock>{'V \\cong W \\;\\Longleftrightarrow\\; \\dim(V) = \\dim(W)'}</MathBlock>
      </Answer>

      {revealedQ11 && (
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${C.border}`,
          marginTop: "1.5rem",
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 16 }}>
            🔗 차원 3인 벡터공간들 — 전부 <Eq>{'\\mathbb{R}^3'}</Eq>과 동형
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { space: "\\mathbb{R}^3", desc: "3차원 유클리드 공간", color: C.blue },
              { space: "P_2(\\mathbb{R})", desc: "차수 ≤ 2인 다항식", color: C.green },
              { space: "M_{1 \\times 3}(\\mathbb{R})", desc: "1×3 행벡터 공간", color: C.purple },
              { space: "\\text{Sym}_2(\\mathbb{R})", desc: "2×2 대칭행렬 공간", color: C.orange },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  background: C.surface,
                  borderRadius: 10,
                  borderLeft: `4px solid ${item.color}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{ color: item.color, fontWeight: 600, minWidth: 130 }}>
                  <Eq>{item.space}</Eq>
                </span>
                <span style={{ color: C.textDim, fontSize: "0.9em" }}>{item.desc}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${C.yellow}10`,
            borderRadius: 8,
            border: `1px solid ${C.yellow}20`,
            color: C.textDim,
            fontSize: "0.9em",
            lineHeight: 1.7,
          }}>
            💡 겉모습이 아무리 달라도 차원이 같으면 선형대수적으로 "같은" 공간입니다.
            실용적으로, <strong style={{ color: C.text }}>어떤 <Eq>{'n'}</Eq>차원 벡터공간의 문제든 <Eq>{'F^n'}</Eq>으로 번역해서 풀 수 있습니다.</strong>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   9. Dimension of Subspaces
   ═══════════════════════════════════════════════════════════════ */
function DimensionOfSubspaces() {
  const [revealedQ12, setRevealedQ12] = useState(false);
  const [revealedQ13, setRevealedQ13] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="부분공간의 차원에 관한 두 가지 정리">
        9. 유제: 부분공간과 차원
      </SectionTitle>

      <Box color={C.blue} label="유제 1 — 부분공간의 차원 부등식">
        <p>
          <strong style={{ color: C.text }}>명제</strong>: <Eq>{'W'}</Eq>가 <Eq>{'n'}</Eq>차원 벡터공간 <Eq>{'V'}</Eq>의 부분공간이면,{" "}
          <Eq>{'\\dim(W) \\leq \\dim(V)'}</Eq>.
        </p>
      </Box>

      <Question number={12} revealed={revealedQ12} onReveal={() => setRevealedQ12(true)}>
        위 명제를 대체 정리를 이용해 증명해 보세요.
      </Question>

      <Answer visible={revealedQ12}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'W'}</Eq>의 기저 <Eq>{'\\{w_1, \\ldots, w_m\\}'}</Eq>과
          <Eq>{'V'}</Eq>의 기저 <Eq>{'\\{v_1, \\ldots, v_n\\}'}</Eq>이 있다고 합시다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\{v_1, \\ldots, v_n\\}'}</Eq>은 <Eq>{'V'}</Eq>를 생성합니다.{" "}
          <Eq>{'W \\subseteq V'}</Eq>이므로 <Eq>{'\\{w_1, \\ldots, w_m\\}'}</Eq>은 <Eq>{'V'}</Eq>의 일차독립인 부분집합입니다.
          대체 정리에 의해 <Eq>{'m \\leq n'}</Eq>, 즉 <Eq>{'\\dim(W) \\leq \\dim(V)'}</Eq>. <strong style={{ color: C.accent }}>∎</strong>
        </p>
      </Answer>

      <Box color={C.green} label="유제 2 — 차원이 같으면 전체 공간">
        <p>
          <strong style={{ color: C.text }}>명제</strong>: <Eq>{'W'}</Eq>가 <Eq>{'n'}</Eq>차원 벡터공간 <Eq>{'V'}</Eq>의 부분공간이고 <Eq>{'\\dim(W) = \\dim(V)'}</Eq>이면,{" "}
          <Eq>{'W = V'}</Eq>.
        </p>
      </Box>

      <Question number={13} revealed={revealedQ13} onReveal={() => setRevealedQ13(true)}>
        위 명제를 증명해 보세요. 유제 1의 결과와 실용적 판정법을 활용하면 됩니다.
      </Question>

      <Answer visible={revealedQ13}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\dim(W) = \\dim(V) = n'}</Eq>이라 합시다. <Eq>{'W'}</Eq>의 기저 <Eq>{'B'}</Eq>는{" "}
          <Eq>{'n'}</Eq>개의 벡터로 이루어져 있습니다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'B \\subseteq W \\subseteq V'}</Eq>이므로, <Eq>{'B'}</Eq>는 <Eq>{'V'}</Eq>의 일차독립인 <Eq>{'n'}</Eq>개 벡터입니다.
          실용적 판정법에 의해 <Eq>{'B'}</Eq>는 <Eq>{'V'}</Eq>의 기저이기도 합니다.
        </p>
        <p>
          따라서 <Eq>{'V = \\text{span}(B) = W'}</Eq>. <strong style={{ color: C.accent }}>∎</strong>
        </p>
        <p style={{ marginTop: "1rem", color: C.textMuted, fontSize: "0.9em" }}>
          <strong>의미</strong>: 부분공간이 "진짜로 작은" 부분공간이려면, 차원이 반드시 줄어들어야 합니다.
        </p>
      </Answer>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   10. Dimension Formula
   ═══════════════════════════════════════════════════════════════ */
function DimensionFormula() {
  const [revealedQ14, setRevealedQ14] = useState(false);
  const [revealedQ15, setRevealedQ15] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="집합의 |A ∪ B| = |A| + |B| − |A ∩ B|의 벡터공간 버전">
        10. 부분공간 합의 차원 공식
      </SectionTitle>

      <Box color={C.purple} label="정리 — 차원 공식">
        <Eq>{'V'}</Eq>가 유한차원 벡터공간이고 <Eq>{'W_1, W_2'}</Eq>가 <Eq>{'V'}</Eq>의 부분공간일 때:
        <MathBlock>{'\\dim(W_1 + W_2) = \\dim(W_1) + \\dim(W_2) - \\dim(W_1 \\cap W_2)'}</MathBlock>
        여기서 <Eq>{'W_1 + W_2 = \\{w_1 + w_2 : w_1 \\in W_1, w_2 \\in W_2\\}'}</Eq>이다.
      </Box>

      <Question number={14} revealed={revealedQ14} onReveal={() => setRevealedQ14(true)}>
        <strong>증명 전략</strong>: <Eq>{'W_1 \\cap W_2'}</Eq>의 기저에서 출발해서,
        이를 <Eq>{'W_1'}</Eq>의 기저와 <Eq>{'W_2'}</Eq>의 기저로 각각 확장한 뒤,
        합집합이 <Eq>{'W_1 + W_2'}</Eq>의 기저가 됨을 보이면 됩니다. 직접 시도해 보세요.
      </Question>

      <Answer visible={revealedQ14}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\dim(W_1) = q'}</Eq>, <Eq>{'\\dim(W_2) = r'}</Eq>, <Eq>{'\\dim(W_1 \\cap W_2) = s'}</Eq>라 합시다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.blue }}>1단계: 기저 확장</strong>.
          <Eq>{'W_1 \\cap W_2'}</Eq>의 기저 <Eq>{'\\{u_1, \\ldots, u_s\\}'}</Eq>를 각각 확장하여:
        </p>
        <MathBlock>{'W_1\\text{의 기저}: \\{u_1, \\ldots, u_s, v_{s+1}, \\ldots, v_q\\}'}</MathBlock>
        <MathBlock>{'W_2\\text{의 기저}: \\{u_1, \\ldots, u_s, w_{s+1}, \\ldots, w_r\\}'}</MathBlock>

        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.green }}>2단계: 생성 확인</strong>.
          합집합 <Eq>{'B = \\{u_1, \\ldots, u_s, v_{s+1}, \\ldots, v_q, w_{s+1}, \\ldots, w_r\\}'}</Eq>이
          <Eq>{'W_1 + W_2'}</Eq>를 생성함은 자명합니다 — <Eq>{'W_1'}</Eq>의 원소는 <Eq>{'u, v'}</Eq>들로,
          <Eq>{'W_2'}</Eq>의 원소는 <Eq>{'u, w'}</Eq>들로 표현 가능하니까요.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.purple }}>3단계: 일차독립 증명</strong>. 이것이 핵심입니다.
        </p>
        <MathBlock>{'a_1 u_1 + \\cdots + a_s u_s + b_{s+1} v_{s+1} + \\cdots + b_q v_q + c_{s+1} w_{s+1} + \\cdots + c_r w_r = \\mathbf{0}'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          에서 양변을 재배열합니다:
        </p>
        <MathBlock>{'\\underbrace{a_1 u_1 + \\cdots + a_s u_s + b_{s+1} v_{s+1} + \\cdots + b_q v_q}_{\\in W_1} = \\underbrace{-c_{s+1} w_{s+1} - \\cdots - c_r w_r}_{\\in W_2}'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          좌변은 <Eq>{'W_1'}</Eq>의 원소, 우변은 <Eq>{'W_2'}</Eq>의 원소이므로, 양변은 <Eq>{'W_1 \\cap W_2'}</Eq>에 속합니다.
          우변이 <Eq>{'W_1 \\cap W_2'}</Eq>의 원소이므로 <Eq>{'\\{u_1, \\ldots, u_s\\}'}</Eq>의 선형결합으로 표현됩니다:
        </p>
        <MathBlock>{'-c_{s+1} w_{s+1} - \\cdots - c_r w_r = d_1 u_1 + \\cdots + d_s u_s'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          정리하면 <Eq>{'d_1 u_1 + \\cdots + d_s u_s + c_{s+1} w_{s+1} + \\cdots + c_r w_r = \\mathbf{0}'}</Eq>.
          이것은 <Eq>{'W_2'}</Eq>의 기저의 선형결합이므로, 일차독립에 의해 모든 <Eq>{'c_i = 0'}</Eq>.
          대칭적 논리로 모든 <Eq>{'b_i = 0'}</Eq>이고, 남은 <Eq>{'a_i'}</Eq>들도 0입니다.
        </p>
        <p>
          따라서 <Eq>{'B'}</Eq>는 일차독립이고, <Eq>{'|B| = s + (q - s) + (r - s) = q + r - s'}</Eq>이므로:
        </p>
        <MathBlock>{'\\dim(W_1 + W_2) = q + r - s = \\dim(W_1) + \\dim(W_2) - \\dim(W_1 \\cap W_2) \\quad \\blacksquare'}</MathBlock>
      </Answer>

      {revealedQ14 && (
        <>
          <Box color={C.yellow} label="핵심 테크닉">
            등식의 양변이 <strong style={{ color: C.text }}>서로 다른 부분공간에 속하도록 분리</strong>해서,
            <strong style={{ color: C.accent }}> 교집합</strong>에 떨어뜨리는 기법은 선형대수에서 자주 등장합니다.
          </Box>

          <Question number={15} revealed={revealedQ15} onReveal={() => setRevealedQ15(true)}>
            <strong>예시 확인</strong>: <Eq>{'\\mathbb{R}^3'}</Eq>에서 <Eq>{'W_1 = \\text{span}\\{(1,0,0), (0,1,0)\\}'}</Eq> (xy-평면),
            <Eq>{'W_2 = \\text{span}\\{(0,1,0), (0,0,1)\\}'}</Eq> (yz-평면)일 때,
            차원 공식을 확인해 보세요.
          </Question>
        </>
      )}

      <Answer visible={revealedQ15}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'W_1 \\cap W_2'}</Eq>: xy-평면과 yz-평면의 교집합은 y축, 즉 <Eq>{'\\text{span}\\{(0,1,0)\\}'}</Eq>. <Eq>{'\\dim = 1'}</Eq>.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'W_1 + W_2'}</Eq>: <Eq>{'(1,0,0), (0,1,0), (0,0,1)'}</Eq> 모두 도달 가능하므로 <Eq>{'\\mathbb{R}^3'}</Eq> 전체. <Eq>{'\\dim = 3'}</Eq>.
        </p>
        <MathBlock>{'\\dim(W_1 + W_2) = 3 = 2 + 2 - 1 = \\dim(W_1) + \\dim(W_2) - \\dim(W_1 \\cap W_2) \\quad \\checkmark'}</MathBlock>
      </Answer>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   11. True/False Problems
   ═══════════════════════════════════════════════════════════════ */
function TrueFalseProblems() {
  const [answers, setAnswers] = useState({});
  const [showSolutions, setShowSolutions] = useState({});

  const problems = [
    {
      id: 1,
      statement: <><Eq>{'\\mathbb{R}^3'}</Eq>에서 4개의 벡터로 이루어진 집합은 항상 일차종속이다.</>,
      answer: true,
      explanation: <>맞습니다. 대체 정리에 의해, 일차독립인 집합의 크기는 생성집합의 크기를 넘을 수 없습니다. <Eq>{'\\mathbb{R}^3'}</Eq>의 기저는 3개 벡터로 이루어져 있으므로, 4개 이상의 벡터는 반드시 일차종속입니다.</>,
    },
    {
      id: 2,
      statement: <>일차독립인 집합의 모든 부분집합도 일차독립이다.</>,
      answer: true,
      explanation: <>맞습니다. <Eq>{'S \\subseteq T'}</Eq>이고 <Eq>{'T'}</Eq>가 일차독립이라 합시다. <Eq>{'S'}</Eq>의 원소들의 선형결합이 <Eq>{'\\mathbf{0}'}</Eq>이 되면, 나머지 원소들의 계수를 모두 0으로 놓으면 <Eq>{'T'}</Eq>의 선형결합이 됩니다. <Eq>{'T'}</Eq>가 일차독립이므로 모든 계수가 0이고, 특히 <Eq>{'S'}</Eq>의 원소들의 계수도 0입니다.</>,
    },
    {
      id: 3,
      statement: <>5차원 벡터공간의 부분공간은 0, 1, 2, 3, 4, 5차원 중 하나이다.</>,
      answer: true,
      explanation: <>맞습니다. 부분공간의 차원은 0 이상이고 (<Eq>{'\\{\\mathbf{0}\\}'}</Eq>이 0차원), <Eq>{'\\dim(W) \\leq \\dim(V) = 5'}</Eq>입니다. 그리고 0부터 5까지 각각에 해당하는 부분공간이 실제로 존재합니다.</>,
    },
    {
      id: 4,
      statement: <><Eq>{'P_3(\\mathbb{R})'}</Eq>과 <Eq>{'M_{2 \\times 2}(\\mathbb{R})'}</Eq>은 동형이다.</>,
      answer: true,
      explanation: <>맞습니다. <Eq>{'\\dim(P_3(\\mathbb{R})) = 4'}</Eq> (기저: <Eq>{'\\{1, x, x^2, x^3\\}'}</Eq>)이고 <Eq>{'\\dim(M_{2 \\times 2}(\\mathbb{R})) = 4'}</Eq> (기저: 표준행렬 4개)입니다. 차원이 같으므로 동형입니다.</>,
    },
    {
      id: 5,
      statement: <>두 부분공간의 합의 차원은 항상 각 부분공간의 차원의 합보다 작거나 같다.</>,
      answer: true,
      explanation: <>맞습니다. 차원 공식에 의해 <Eq>{'\\dim(W_1 + W_2) = \\dim(W_1) + \\dim(W_2) - \\dim(W_1 \\cap W_2)'}</Eq>이고, <Eq>{'\\dim(W_1 \\cap W_2) \\geq 0'}</Eq>이므로 <Eq>{'\\dim(W_1 + W_2) \\leq \\dim(W_1) + \\dim(W_2)'}</Eq>입니다. 등호는 <Eq>{'W_1 \\cap W_2 = \\{\\mathbf{0}\\}'}</Eq>일 때 (직합) 성립합니다.</>,
    },
  ];

  return (
    <div>
      <SectionTitle subtitle="개념 확인 문제">
        11. 참/거짓 문제
      </SectionTitle>

      <div style={{ display: "grid", gap: 20 }}>
        {problems.map((problem) => (
          <div
            key={problem.id}
            style={{
              background: C.surfaceAlt,
              borderRadius: 12,
              padding: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ color: C.text, marginBottom: 16, lineHeight: 1.7 }}>
              <span style={{ color: C.accent, fontWeight: 700, marginRight: 8 }}>문제 {problem.id}.</span>
              {problem.statement}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setAnswers({ ...answers, [problem.id]: true })}
                style={{
                  padding: "10px 24px",
                  background: answers[problem.id] === true ? `${C.green}30` : C.surface,
                  border: `1.5px solid ${answers[problem.id] === true ? C.green : C.border}`,
                  borderRadius: 8,
                  color: answers[problem.id] === true ? C.green : C.textDim,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                참
              </button>
              <button
                onClick={() => setAnswers({ ...answers, [problem.id]: false })}
                style={{
                  padding: "10px 24px",
                  background: answers[problem.id] === false ? `${C.red}30` : C.surface,
                  border: `1.5px solid ${answers[problem.id] === false ? C.red : C.border}`,
                  borderRadius: 8,
                  color: answers[problem.id] === false ? C.red : C.textDim,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                거짓
              </button>

              {answers[problem.id] !== undefined && (
                <button
                  onClick={() => setShowSolutions({ ...showSolutions, [problem.id]: !showSolutions[problem.id] })}
                  style={{
                    marginLeft: "auto",
                    padding: "10px 16px",
                    background: `${C.yellow}15`,
                    border: `1px solid ${C.yellow}40`,
                    borderRadius: 8,
                    color: C.yellow,
                    cursor: "pointer",
                    fontSize: "0.9em",
                  }}
                >
                  {showSolutions[problem.id] ? "해설 숨기기" : "해설 보기"}
                </button>
              )}
            </div>

            {answers[problem.id] !== undefined && showSolutions[problem.id] && (
              <div style={{
                padding: 16,
                background: C.surface,
                borderRadius: 8,
                borderLeft: `3px solid ${answers[problem.id] === problem.answer ? C.green : C.red}`,
              }}>
                <div style={{ marginBottom: 8 }}>
                  {answers[problem.id] === problem.answer ? (
                    <span style={{ color: C.green, fontWeight: 600 }}>✓ 정답입니다!</span>
                  ) : (
                    <span style={{ color: C.red, fontWeight: 600 }}>✗ 오답입니다. 정답: {problem.answer ? "참" : "거짓"}</span>
                  )}
                </div>
                <div style={{ color: C.textDim, lineHeight: 1.7 }}>
                  {problem.explanation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   12. Summary
   ═══════════════════════════════════════════════════════════════ */
function Summary() {
  return (
    <div>
      <SectionTitle subtitle="1.3절 전체 정리">
        요약
      </SectionTitle>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        {/* Logical flow */}
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>논리적 흐름</div>

        <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
          {[
            { from: "불필요한 벡터의 직관", to: "일차독립의 정의 (두 동치 관점)", color: C.blue },
            { from: "일차독립 + 생성", to: "기저 (Basis)", color: C.green },
            { from: "대체 정리", to: "모든 기저의 크기는 동일", color: C.purple },
            { from: "기저의 불변 크기", to: "차원 (Dimension) 정의", color: C.orange },
            { from: "차원의 일치", to: "동형사상에 의한 분류", color: C.yellow },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                background: C.surface,
                borderRadius: 8,
                borderLeft: `4px solid ${item.color}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ color: item.color, fontSize: "0.9em" }}>{item.from}</span>
              <span style={{ color: C.accent }}>→</span>
              <span style={{ color: C.text, fontWeight: 600, fontSize: "0.9em" }}>{item.to}</span>
            </div>
          ))}
        </div>

        {/* Key concepts */}
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 16 }}>핵심 개념</div>

        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              title: "일차독립",
              desc: "영벡터의 자명한 표현만 존재",
              color: C.blue,
              detail: "⟺ 어떤 벡터도 나머지의 선형결합으로 표현 불가",
            },
            {
              title: "기저",
              desc: "일차독립 + 생성",
              color: C.green,
              detail: "공간을 표현하기 위한 딱 필요한 만큼의 벡터 집합",
            },
            {
              title: "차원",
              desc: "기저의 크기 (기저에 무관하게 일정)",
              color: C.purple,
              detail: "대체 정리가 이 불변성을 보장",
            },
            {
              title: "실용적 판정법",
              desc: "n차원에서 n개 벡터",
              color: C.orange,
              detail: "일차독립 ⟺ 생성 ⟺ 기저 (하나만 확인)",
            },
            {
              title: "동형사상",
              desc: "구조를 보존하는 전단사",
              color: C.yellow,
              detail: "dim(V) = dim(W) ⟺ V ≅ W",
            },
            {
              title: "차원 공식",
              desc: "dim(W₁+W₂) = dim(W₁)+dim(W₂)−dim(W₁∩W₂)",
              color: C.red,
              detail: "핵심 테크닉: 양변을 서로 다른 부분공간으로 분리 → 교집합",
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
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function LinearAlgebra13Blog() {
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
          <RedundantVectors />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <TwoPerspectives />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ZeroVectorProperty />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <BasisDefinition />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ReplacementTheorem />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <DimensionSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <BasisExample />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <IsomorphismSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <DimensionOfSubspaces />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <DimensionFormula />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <TrueFalseProblems />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <Summary />
        </section>
      </article>
    </div>
  );
}
