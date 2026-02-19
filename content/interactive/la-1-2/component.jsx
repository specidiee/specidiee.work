'use client';

import { useState, useRef } from "react";
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


/* ═══════════════════════════════════════════════════════════════
   0. Introduction
   ═══════════════════════════════════════════════════════════════ */
function Introduction() {
  return (
    <div>
      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        <GradLink href="/blog/la-1-1">이전 글</GradLink>에서 우리는 연립일차방정식의 해를 구하기 위해 행렬을 도입했습니다.
        그 과정에서 자연스럽게 다루었던 대상이 <Eq>{'\\mathbb{R}^n'}</Eq>의 벡터들이었죠.
        이제 한 가지 근본적인 질문을 던져봅시다: <strong style={{ color: C.accent }}>벡터란 무엇인가?</strong>
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        답은 의외로 단순합니다. 벡터는 <strong style={{ color: C.text }}>덧셈과 스칼라배가 잘 작동하는 대상</strong>이면
        무엇이든 될 수 있습니다. 열벡터뿐만 아니라, 행렬, 다항식, 연속함수까지도요.
        이 공통 구조를 포착하는 것이 <strong style={{ color: C.accent }}>벡터공간</strong>의 개념입니다.
      </p>

      <Box color={C.accent} label="이 글의 여정">
        동차 연립방정식 <Eq>{'Ax = 0'}</Eq>의 해집합에서 출발하여,
        <strong style={{ color: C.blue }}> 벡터공간의 8가지 공리</strong>를 동기부여하고,
        <strong style={{ color: C.green }}> 부분공간 판정법</strong>을 유도한 뒤,
        <strong style={{ color: C.purple }}> 생성공간(span)</strong>으로 마무리합니다.
        관통하는 핵심 원리: <strong style={{ color: C.yellow }}>"= 0" 조건이 부분공간을 만든다.</strong>
      </Box>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   1. Motivation: Null Space
   ═══════════════════════════════════════════════════════════════ */
function NullSpaceMotivation() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="동차 연립방정식의 해집합이 가진 특별한 성질">
        1. 출발점: Ax = 0의 해집합
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        <GradLink href="/blog/la-1-1">이전 글</GradLink>에서 가우스 소거법을 통해 연립방정식 <Eq>{'Ax = b'}</Eq>의 해를 구했습니다.
        이제 특별한 경우인 <strong style={{ color: C.accent }}>동차 연립방정식</strong> <Eq>{'Ax = \\mathbf{0}'}</Eq>에 주목합시다.
      </p>

      <Question number={1} revealed={revealed} onReveal={() => setRevealed(true)}>
        <Eq>{'Ax = \\mathbf{0}'}</Eq>의 해를 두 개 찾았다고 합시다: <Eq>{'x_1'}</Eq>과 <Eq>{'x_2'}</Eq>.
        그렇다면 <Eq>{'x_1 + x_2'}</Eq>도 해가 될까요?
        비동차 방정식 <Eq>{'Ax = b'}</Eq> <Eq>{'(b \\neq \\mathbf{0})'}</Eq>에서는 어떤가요?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.green }}>동차인 경우</strong>: <Eq>{'Ax_1 = \\mathbf{0}'}</Eq>, <Eq>{'Ax_2 = \\mathbf{0}'}</Eq>이면
        </p>
        <MathBlock>{'A(x_1 + x_2) = Ax_1 + Ax_2 = \\mathbf{0} + \\mathbf{0} = \\mathbf{0} \\quad \\checkmark'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          스칼라배도 마찬가지입니다. 임의의 <Eq>{'c \\in \\mathbb{R}'}</Eq>에 대해:
        </p>
        <MathBlock>{'A(cx_1) = c(Ax_1) = c \\cdot \\mathbf{0} = \\mathbf{0} \\quad \\checkmark'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.red }}>비동차인 경우</strong>: <Eq>{'Ax_1 = b'}</Eq>, <Eq>{'Ax_2 = b'}</Eq>이면
        </p>
        <MathBlock>{'A(x_1 + x_2) = Ax_1 + Ax_2 = b + b = 2b \\neq b \\quad \\times'}</MathBlock>
        <p>
          즉, <Eq>{'Ax = \\mathbf{0}'}</Eq>의 해집합은 <strong style={{ color: C.accent }}>덧셈과 스칼라배에 닫혀 있지만</strong>,
          <Eq>{'Ax = b'}</Eq>의 해집합은 그렇지 않습니다.
          이 "닫혀 있음"이라는 성질이 벡터공간 이론의 출발점입니다.
        </p>
      </Answer>

      {revealed && (
        <Box color={C.green} label="핵심 관찰">
          <Eq>{'Ax = \\mathbf{0}'}</Eq>의 해집합은
          <strong style={{ color: C.text }}> 덧셈에 닫혀 있고</strong>,
          <strong style={{ color: C.text }}> 스칼라배에 닫혀 있습니다</strong>.
          이 구조가 <Eq>{'\\mathbb{R}^n'}</Eq>뿐 아니라 다항식, 행렬, 함수 등 다양한 수학 대상에서 동일하게 나타납니다.
          이 공통 구조를 <strong style={{ color: C.accent }}>추상적으로 일반화</strong>한 것이 벡터공간입니다.
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   2. Vector Space Axioms
   ═══════════════════════════════════════════════════════════════ */
function VectorSpaceAxioms() {
  const [activeGroup, setActiveGroup] = useState(null);

  const additionAxioms = [
    { id: "A1", name: "교환법칙", formula: "x + y = y + x", desc: "덧셈 순서 무관", type: "equality" },
    { id: "A2", name: "결합법칙", formula: "(x + y) + z = x + (y + z)", desc: "괄호 위치 무관", type: "equality" },
    { id: "A3", name: "영벡터 존재", formula: "x + \\mathbf{0} = x", desc: "항등원 존재", type: "existence" },
    { id: "A4", name: "역원 존재", formula: "x + (-x) = \\mathbf{0}", desc: "역원 존재", type: "existence" },
  ];

  const scalarAxioms = [
    { id: "S1", name: "분배법칙 I", formula: "a(x + y) = ax + ay", desc: "벡터 덧셈에 대한 분배", type: "equality" },
    { id: "S2", name: "분배법칙 II", formula: "(a + b)x = ax + bx", desc: "스칼라 덧셈에 대한 분배", type: "equality" },
    { id: "S3", name: "결합법칙", formula: "(ab)x = a(bx)", desc: "스칼라 곱셈의 결합", type: "equality" },
    { id: "S4", name: "항등원", formula: "1x = x", desc: "스칼라 1은 항등", type: "equality" },
  ];

  return (
    <div>
      <SectionTitle subtitle="왜 하필 이 8가지 공리인가?">
        2. 벡터공간의 공리적 정의
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        체(field) <Eq>{'F'}</Eq> 위의 <strong style={{ color: C.accent }}>벡터공간</strong>이란,
        집합 <Eq>{'V'}</Eq>에 두 연산 — <strong style={{ color: C.blue }}>벡터 덧셈</strong> <Eq>{'+: V \\times V \\to V'}</Eq>와
        <strong style={{ color: C.green }}> 스칼라 곱셈</strong> <Eq>{'\\cdot: F \\times V \\to V'}</Eq> — 이
        주어지고, 다음 8가지 공리를 만족하는 구조입니다.
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        이 공리들은 누군가 임의로 정한 것이 아닙니다.{" "}
        <Eq>{'\\mathbb{R}^n'}</Eq>, 행렬 공간, 다항식 공간, 함수 공간 등을 관찰했더니
        <strong style={{ color: C.yellow }}> 이 8가지 성질이 공통적으로 성립</strong>했기에,
        이것들을 뽑아내어 정의로 삼은 것입니다.
      </p>

      {/* Axiom Explorer */}
      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
          📐 공리 목록
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => setActiveGroup(activeGroup === "add" ? null : "add")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: activeGroup === "add" ? `${C.blue}20` : C.surface,
              border: `1.5px solid ${activeGroup === "add" ? C.blue : C.border}`,
              borderRadius: 10,
              color: activeGroup === "add" ? C.blue : C.textDim,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9em",
              transition: "all 0.2s ease",
            }}
          >
            덧셈 공리 (A1–A4)
          </button>
          <button
            onClick={() => setActiveGroup(activeGroup === "scalar" ? null : "scalar")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: activeGroup === "scalar" ? `${C.green}20` : C.surface,
              border: `1.5px solid ${activeGroup === "scalar" ? C.green : C.border}`,
              borderRadius: 10,
              color: activeGroup === "scalar" ? C.green : C.textDim,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9em",
              transition: "all 0.2s ease",
            }}
          >
            스칼라배 공리 (S1–S4)
          </button>
        </div>

        {(activeGroup === "add" ? additionAxioms : activeGroup === "scalar" ? scalarAxioms : []).map((axiom) => (
          <div
            key={axiom.id}
            style={{
              padding: 16,
              background: C.surface,
              borderRadius: 12,
              marginBottom: 8,
              borderLeft: `4px solid ${axiom.type === "existence" ? C.orange : activeGroup === "add" ? C.blue : C.green}`,
              display: "grid",
              gridTemplateColumns: "60px 1fr 1fr",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span style={{
              color: activeGroup === "add" ? C.blue : C.green,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              fontSize: "0.9em",
            }}>
              ({axiom.id})
            </span>
            <div style={{ textAlign: "center" }}>
              <Eq>{axiom.formula}</Eq>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textDim, fontSize: "0.85em" }}>{axiom.name}</span>
              {axiom.type === "existence" && (
                <span style={{
                  background: `${C.orange}20`,
                  color: C.orange,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: "0.7em",
                  fontWeight: 600,
                }}>
                  존재 공리
                </span>
              )}
            </div>
          </div>
        ))}

        {activeGroup && (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: `${C.orange}10`,
            borderRadius: 8,
            border: `1px solid ${C.orange}30`,
          }}>
            <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.7 }}>
              {activeGroup === "add" ? (
                <>
                  (A1), (A2)는 <strong style={{ color: C.text }}>등식 관계</strong>이고,
                  (A3), (A4)는 <strong style={{ color: C.orange }}>원소의 존재</strong>를 요구합니다.
                  부분공간을 판정할 때 이 구분이 핵심이 됩니다.
                </>
              ) : (
                <>
                  네 공리 모두 <strong style={{ color: C.text }}>등식 관계</strong>입니다.
                  (S1), (S2)는 스칼라배와 덧셈 사이의 <strong style={{ color: C.green }}>호환성</strong>을 보장하고,
                  (S3), (S4)는 스칼라 곱셈이 자연스럽게 작동함을 보장합니다.
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   3. Closure is not enough
   ═══════════════════════════════════════════════════════════════ */
function ClosureNotEnough() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="닫힘과 공리의 차이">
        3. 닫혀 있다는 것만으로는 부족하다
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        "닫혀 있다"는 것은 연산이 <Eq>{'V \\times V \\to V'}</Eq>라는 <strong style={{ color: C.text }}>함수로서 잘 정의</strong>된다는 전제조건입니다.
        공리들은 그 너머에, 연산이 <strong style={{ color: C.accent }}>어떻게 행동해야 하는가</strong>를 규정합니다.
      </p>

      <Question number={1} revealed={revealed} onReveal={() => setRevealed(true)}>
        만약 연산이 닫혀 있지만 공리를 만족하지 않는 예시가 있을까요?{" "}
        <Eq>{'V = \\mathbb{R}^2'}</Eq>에서 덧셈은 보통의 벡터 덧셈으로, 스칼라배를 <Eq>{'c \\odot (x_1, x_2) = (cx_1, 0)'}</Eq>으로
        정의하면 어떤 공리가 깨질까요?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          이 연산은 <strong style={{ color: C.green }}>닫혀 있습니다</strong> — 결과가 항상 <Eq>{'\\mathbb{R}^2'}</Eq>에 속하죠.
          그런데 공리 (S4)를 확인해보면:
        </p>
        <MathBlock>{'1 \\odot (x_1, x_2) = (1 \\cdot x_1, 0) = (x_1, 0) \\neq (x_1, x_2)'}</MathBlock>
        <p>
          <Eq>{'x_2 \\neq 0'}</Eq>이면 <Eq>{'1 \\odot v \\neq v'}</Eq>입니다.
          스칼라배가 닫혀 있음에도 불구하고 <strong style={{ color: C.red }}>벡터공간이 아닙니다</strong>.
        </p>
      </Answer>

      {revealed && (
        <Box color={C.purple} label="닫힘 vs 공리">
          <strong style={{ color: C.text }}>닫힘</strong>은 연산의 결과가 집합 밖으로 빠져나가지 않는다는 것이고,{" "}
          <strong style={{ color: C.text }}>공리</strong>는 연산들 사이의 일관된 관계를 보장하는 것입니다.
          분배법칙 (S1), (S2)는 "스칼라배와 덧셈이 <strong style={{ color: C.accent }}>자연스럽게 호환</strong>된다"는 관계를 요구합니다.
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   4. Subspace Criterion
   ═══════════════════════════════════════════════════════════════ */
function SubspaceCriterion() {
  const [revealedQ3, setRevealedQ3] = useState(false);
  const [revealedQ4, setRevealedQ4] = useState(false);
  const [showInheritance, setShowInheritance] = useState(false);

  const axiomData = [
    { id: "A1", name: "교환법칙", inherited: true },
    { id: "A2", name: "결합법칙", inherited: true },
    { id: "A3", name: "영벡터 존재", inherited: false, fromClosure: true },
    { id: "A4", name: "역원 존재", inherited: false, fromClosure: true },
    { id: "S1", name: "분배법칙 I", inherited: true },
    { id: "S2", name: "분배법칙 II", inherited: true },
    { id: "S3", name: "결합법칙", inherited: true },
    { id: "S4", name: "항등원", inherited: true },
  ];

  return (
    <div>
      <SectionTitle subtitle="8가지 공리를 전부 확인해야 할까?">
        4. 부분공간 판정법
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        <Eq>{'Ax = \\mathbf{0}'}</Eq>의 해집합은 <Eq>{'\\mathbb{R}^n'}</Eq>의 <strong style={{ color: C.text }}>부분집합</strong>입니다.
        이것이 벡터공간이 되려면 8가지 공리를 전부 검증해야 할까요?
      </p>

      <Question number={1} revealed={revealedQ3} onReveal={() => setRevealedQ3(true)}>
        <Eq>{'W \\subseteq V'}</Eq>이고 <Eq>{'V'}</Eq>가 벡터공간일 때,
        8가지 공리 중 어떤 것이 <Eq>{'V'}</Eq>로부터 <strong style={{ color: C.yellow }}>자동으로 물려받아지고</strong>,
        어떤 것은 <strong style={{ color: C.orange }}>별도로 확인</strong>해야 할까요?
      </Question>

      <Answer visible={revealedQ3}>
        <p style={{ marginBottom: "1rem" }}>
          (A1) 교환법칙을 예로 들어봅시다. <Eq>{'V'}</Eq>에서 <strong>모든</strong> <Eq>{'x, y \\in V'}</Eq>에 대해
          <Eq>{'x + y = y + x'}</Eq>가 성립합니다. <Eq>{'W \\subseteq V'}</Eq>이면 <Eq>{'W'}</Eq>의 원소들도
          <Eq>{'V'}</Eq>의 원소이므로, 교환법칙은 <strong style={{ color: C.green }}>자동으로 성립</strong>합니다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          같은 논리로, <strong style={{ color: C.text }}>등식 관계를 말하는 공리</strong>는 전부 자동입니다:
          (A1), (A2), (S1), (S2), (S3), (S4) — 총 6개.
        </p>
        <p>
          별도 확인이 필요한 것은 <strong style={{ color: C.orange }}>존재 공리</strong>인
          (A3) 영벡터와 (A4) 역원뿐입니다. 그런데 이것들도 닫힘으로부터 유도할 수 있습니다!
        </p>
      </Answer>

      {revealedQ3 && (
        <>
          {/* Inheritance visualizer */}
          <div style={{
            background: C.surfaceAlt,
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${C.border}`,
            marginBottom: "2rem",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <div style={{ color: C.text, fontWeight: 600 }}>
                🔍 공리 상속 관계
              </div>
              <button
                onClick={() => setShowInheritance(!showInheritance)}
                style={{
                  padding: "8px 16px",
                  background: `${C.accent}15`,
                  border: `1px solid ${C.accent}40`,
                  borderRadius: 8,
                  color: C.accent,
                  cursor: "pointer",
                  fontSize: "0.85em",
                }}
              >
                {showInheritance ? "숨기기" : "상속 관계 보기"}
              </button>
            </div>

            {showInheritance && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {axiomData.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: 12,
                      background: a.inherited ? `${C.green}15` : `${C.orange}15`,
                      border: `1px solid ${a.inherited ? C.green : C.orange}40`,
                      borderRadius: 8,
                      textAlign: "center",
                    }}
                  >
                    <div style={{
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: a.inherited ? C.green : C.orange,
                      marginBottom: 4,
                      fontSize: "0.85em",
                    }}>
                      ({a.id})
                    </div>
                    <div style={{ color: C.textDim, fontSize: "0.75em", marginBottom: 4 }}>
                      {a.name}
                    </div>
                    <div style={{
                      fontSize: "0.7em",
                      color: a.inherited ? C.green : C.orange,
                      fontWeight: 600,
                    }}>
                      {a.inherited ? "V에서 상속" : "닫힘에서 유도"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Question number={2} revealed={revealedQ4} onReveal={() => setRevealedQ4(true)}>
            <Eq>{'W'}</Eq>가 스칼라배에 닫혀 있다고 합시다. 즉 <Eq>{'w \\in W'}</Eq>, <Eq>{'c \\in F'}</Eq>이면 <Eq>{'cw \\in W'}</Eq>.
            이 조건만으로 영벡터 <Eq>{'\\mathbf{0} \\in W'}</Eq>와 역원 <Eq>{'-w \\in W'}</Eq>를 얻을 수 있을까요?
            어떤 스칼라 <Eq>{'c'}</Eq>를 선택하면 될까요?
          </Question>

          <Answer visible={revealedQ4}>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.blue }}>영벡터</strong>: <Eq>{'c = 0'}</Eq>을 선택하면 <Eq>{'0w \\in W'}</Eq>입니다.
              <Eq>{'0w = \\mathbf{0}'}</Eq>임은 공리로부터 증명할 수 있습니다:
            </p>
            <MathBlock>{'0w = (0+0)w = 0w + 0w \\implies 0w = \\mathbf{0}'}</MathBlock>
            <p style={{ marginBottom: "0.5rem" }}>
              (양변에 <Eq>{'-0w'}</Eq>를 더해서 유도. 여기서 분배법칙 (S2)를 사용합니다.)
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.blue }}>역원</strong>: <Eq>{'c = -1'}</Eq>을 선택하면 <Eq>{'(-1)w \\in W'}</Eq>입니다.
              <Eq>{'(-1)w = -w'}</Eq>임도 증명 가능합니다:
            </p>
            <MathBlock>{'w + (-1)w = 1w + (-1)w = (1 + (-1))w = 0w = \\mathbf{0}'}</MathBlock>
            <p>
              따라서 <Eq>{'(-1)w'}</Eq>는 <Eq>{'w'}</Eq>의 덧셈 역원입니다.
              공리 (S2)와 (S4)가 핵심 역할을 했습니다.
            </p>
          </Answer>
        </>
      )}

      {revealedQ4 && (
        <Box color={C.accent} label="부분공간 판정법 — 정리">
          <p style={{ marginBottom: "1rem" }}>
            <Eq>{'V'}</Eq>가 <Eq>{'F'}</Eq>-벡터공간이고 <Eq>{'W \\subseteq V'}</Eq>가 공집합이 아닌 부분집합일 때, 다음은 동치이다:
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: C.text }}>(a)</strong> <Eq>{'W'}</Eq>는 <Eq>{'V'}</Eq>의 부분공간이다.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: C.text }}>(b)</strong>{" "}
            <Eq>{'w_1, w_2 \\in W \\Rightarrow w_1 + w_2 \\in W'}</Eq> 그리고{" "}
            <Eq>{'c \\in F,\\, w \\in W \\Rightarrow cw \\in W'}</Eq>
          </p>
          <p>
            <strong style={{ color: C.text }}>(c)</strong>{" "}
            <Eq>{'c \\in F,\\, w_1, w_2 \\in W \\Rightarrow cw_1 + w_2 \\in W'}</Eq> (한 조건으로 통합)
          </p>
        </Box>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   5. Subspace Examples and Exercises
   ═══════════════════════════════════════════════════════════════ */
function SubspaceExercises() {
  const [revealedQ5, setRevealedQ5] = useState(false);
  const [revealedQ6, setRevealedQ6] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="부분공간 판정 실전 연습">
        5. 유제: 부분공간인가?
      </SectionTitle>

      {/* Exercise: Null space proof */}
      <Box color={C.blue} label="유제 1 — 영공간 (Null Space)">
        <p style={{ marginBottom: "0.5rem" }}>
          <strong style={{ color: C.text }}>명제</strong>: <Eq>{'A'}</Eq>가 <Eq>{'m \\times n'}</Eq> 행렬일 때,
          <Eq>{'W = \\{x \\in \\mathbb{R}^n : Ax = \\mathbf{0}\\}'}</Eq>은 <Eq>{'\\mathbb{R}^n'}</Eq>의 부분공간이다.
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <strong style={{ color: C.green }}>증명</strong>: 부분공간 판정법 (b)를 적용합니다.
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <Eq>{'W \\neq \\emptyset'}</Eq>: <Eq>{'A\\mathbf{0} = \\mathbf{0}'}</Eq>이므로 <Eq>{'\\mathbf{0} \\in W'}</Eq>. ✓
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>덧셈 닫힘</strong>: <Eq>{'x_1, x_2 \\in W'}</Eq>이면 <Eq>{'A(x_1 + x_2) = Ax_1 + Ax_2 = \\mathbf{0}'}</Eq>. ✓
        </p>
        <p>
          <strong>스칼라배 닫힘</strong>: <Eq>{'c \\in \\mathbb{R}'}</Eq>, <Eq>{'x \\in W'}</Eq>이면
          <Eq>{'A(cx) = c(Ax) = c\\mathbf{0} = \\mathbf{0}'}</Eq>. ✓ ∎
        </p>
      </Box>

      {/* Exercise: p(1)=0 */}
      <Question number={1} revealed={revealedQ5} onReveal={() => setRevealedQ5(true)}>
        <Eq>{'V = P_2(\\mathbb{R})'}</Eq> (차수 2 이하의 실수 다항식 공간)에서
        <Eq>{'W = \\{p(t) \\in P_2(\\mathbb{R}) : p(1) = 0\\}'}</Eq>는 부분공간인가?
        부분공간 판정법을 적용해보세요.
      </Question>

      <Answer visible={revealedQ5}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'W \\neq \\emptyset'}</Eq>: 영다항식 <Eq>{'p(t) = 0'}</Eq>이 <Eq>{'p(1) = 0'}</Eq>을 만족하므로
          <Eq>{'\\mathbf{0} \\in W'}</Eq>. ✓
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>판정법 (c) 적용</strong>: <Eq>{'p, q \\in W'}</Eq>이면 <Eq>{'p(1) = 0'}</Eq>, <Eq>{'q(1) = 0'}</Eq>.
          임의의 <Eq>{'c \\in \\mathbb{R}'}</Eq>에 대해:
        </p>
        <MathBlock>{'(cp + q)(1) = cp(1) + q(1) = c \\cdot 0 + 0 = 0'}</MathBlock>
        <p style={{ marginBottom: "1rem" }}>
          따라서 <Eq>{'cp + q \\in W'}</Eq>. ✓ ∎
        </p>
        <p>
          핵심 관찰: <Eq>{'p(1) = 0'}</Eq>이라는 조건이 <strong style={{ color: C.accent }}>선형적</strong>입니다.
          함수값 구하기(evaluation)가 덧셈과 스칼라배를 보존하기 때문에, 이 증명은 계수를 풀어쓰지 않아도 성립합니다.
        </p>
      </Answer>

      {/* Counterexample */}
      <Question number={2} revealed={revealedQ6} onReveal={() => setRevealedQ6(true)}>
        <Eq>{'W = \\{(x_1, x_2) \\in \\mathbb{R}^2 : x_1 x_2 \\geq 0\\}'}</Eq>은
        <Eq>{'\\mathbb{R}^2'}</Eq>의 부분공간인가? (기하학적으로 제1사분면 ∪ 제3사분면)
      </Question>

      <Answer visible={revealedQ6}>
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.red }}>부분공간이 아닙니다.</strong> 반례:
        </p>
        <MathBlock>{'(1, 2) \\in W, \\quad (-2, -1) \\in W'}</MathBlock>
        <MathBlock>{'(1,2) + (-2,-1) = (-1, 1) \\quad \\Rightarrow \\quad (-1)(1) = -1 < 0'}</MathBlock>
        <p>
          따라서 <Eq>{'(-1, 1) \\notin W'}</Eq>이므로 덧셈에 닫혀 있지 않습니다.
          부분공간이 아님을 보일 때는 <strong style={{ color: C.yellow }}>반례 하나면 충분</strong>합니다.
        </p>
      </Answer>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   6. Examples of Vector Spaces
   ═══════════════════════════════════════════════════════════════ */
function VectorSpaceExamples() {
  const [activeTab, setActiveTab] = useState(0);

  const examples = [
    {
      label: "ℝⁿ",
      color: C.blue,
      title: "유클리드 공간",
      zero: "\\mathbf{0} = (0, 0, \\ldots, 0)",
      add: "(x_1, \\ldots, x_n) + (y_1, \\ldots, y_n) = (x_1+y_1, \\ldots, x_n+y_n)",
      scalar: "c(x_1, \\ldots, x_n) = (cx_1, \\ldots, cx_n)",
      note: "이전 글에서 이미 다룬 공간. 모든 구체적 계산의 출발점입니다.",
    },
    {
      label: "M_{m×n}(F)",
      color: C.green,
      title: "행렬 공간",
      zero: "O_{m \\times n} \\text{ (영행렬)}",
      add: "A + B \\text{ (같은 위치끼리 덧셈)}",
      scalar: "cA \\text{ (각 성분에 스칼라 곱셈)}",
      note: "행렬의 덧셈과 스칼라배. 행렬 곱셈은 벡터공간의 연산이 아닙니다!",
    },
    {
      label: "Pₙ(F)",
      color: C.purple,
      title: "다항식 공간",
      zero: "p(t) = 0 \\text{ (영다항식)}",
      add: "(a_0 + a_1t + \\cdots) + (b_0 + b_1t + \\cdots) = (a_0+b_0) + (a_1+b_1)t + \\cdots",
      scalar: "c(a_0 + a_1 t + \\cdots) = ca_0 + ca_1 t + \\cdots",
      note: "차수 n 이하의 다항식 전체. P₂(ℝ)의 원소 a₀ + a₁t + a₂t²는 계수 (a₀, a₁, a₂) ∈ ℝ³과 대응됩니다.",
    },
    {
      label: "F(S, F)",
      color: C.orange,
      title: "함수 공간",
      zero: "f(x) = 0 \\text{ (영함수)}",
      add: "(f+g)(x) = f(x) + g(x)",
      scalar: "(cf)(x) = c \\cdot f(x)",
      note: "집합 S에서 체 F로의 모든 함수의 집합. 가장 일반적인 벡터공간 예시입니다.",
    },
  ];

  const ex = examples[activeTab];

  return (
    <div>
      <SectionTitle subtitle="추상적 정의의 힘: 전혀 다른 대상들의 공통 구조">
        6. 다양한 벡터공간의 예시
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        벡터공간의 공리적 정의가 강력한 이유는, 전혀 다른 수학적 대상들이{" "}
        <strong style={{ color: C.accent }}>동일한 구조</strong>를 공유한다는 것을 포착하기 때문입니다.
      </p>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {examples.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: activeTab === i ? `${tab.color}20` : C.surface,
                border: `1.5px solid ${activeTab === i ? tab.color : C.border}`,
                borderRadius: 10,
                color: activeTab === i ? tab.color : C.textDim,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9em",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: 20,
          background: C.surface,
          borderRadius: 12,
          borderTop: `3px solid ${ex.color}`,
        }}>
          <div style={{ color: ex.color, fontWeight: 700, fontSize: "1.1em", marginBottom: 16 }}>
            {ex.title}
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={{
              padding: 12,
              background: `${ex.color}08`,
              borderRadius: 8,
              border: `1px solid ${ex.color}20`,
            }}>
              <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>영벡터</div>
              <div style={{ textAlign: "center" }}><Eq>{ex.zero}</Eq></div>
            </div>

            <div style={{
              padding: 12,
              background: `${ex.color}08`,
              borderRadius: 8,
              border: `1px solid ${ex.color}20`,
            }}>
              <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>덧셈</div>
              <div style={{ textAlign: "center", overflowX: "auto" }}><Eq>{ex.add}</Eq></div>
            </div>

            <div style={{
              padding: 12,
              background: `${ex.color}08`,
              borderRadius: 8,
              border: `1px solid ${ex.color}20`,
            }}>
              <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>스칼라배</div>
              <div style={{ textAlign: "center" }}><Eq>{ex.scalar}</Eq></div>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${C.yellow}08`,
            borderRadius: 8,
            border: `1px solid ${C.yellow}20`,
            color: C.textDim,
            fontSize: "0.9em",
            lineHeight: 1.7,
          }}>
            💡 {ex.note}
          </div>
        </div>
      </div>

      <Box color={C.yellow} label="통일적 관점">
        <Eq>{'P_2(\\mathbb{R})'}</Eq>의 원소 <Eq>{'a_0 + a_1 t + a_2 t^2'}</Eq>는
        계수 <Eq>{'(a_0, a_1, a_2) \\in \\mathbb{R}^3'}</Eq>과 대응됩니다.
        이런 <strong style={{ color: C.text }}>구조를 보존하는 대응</strong>을
        <strong style={{ color: C.accent }}> 동형사상(isomorphism)</strong>이라 하며,
        다음 글에서 본격적으로 다룹니다.
      </Box>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   7. Span
   ═══════════════════════════════════════════════════════════════ */
function SpanSection() {
  const [revealedQ7, setRevealedQ7] = useState(false);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0.5);

  const v1 = [1, 0, 1];
  const v2 = [0, 1, 1];
  const result = [a * v1[0] + b * v2[0], a * v1[1] + b * v2[1], a * v1[2] + b * v2[2]];

  return (
    <div>
      <SectionTitle subtitle="벡터로부터 부분공간 만들기">
        7. 선형결합과 생성공간 (Span)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        부분공간 판정법은 "주어진 집합이 부분공간인가?"를 판단하는 도구였습니다.
        이제 반대 방향의 질문: <strong style={{ color: C.accent }}>주어진 벡터들로부터 부분공간을 만들어낼 수 있는가?</strong>
      </p>

      <Box color={C.blue} label="정의">
        <p style={{ marginBottom: "1rem" }}>
          <strong style={{ color: C.text }}>선형결합</strong>: <Eq>{'v_1, \\ldots, v_k \\in V'}</Eq>의 선형결합이란{" "}
          <Eq>{'a_1 v_1 + a_2 v_2 + \\cdots + a_k v_k'}</Eq> (<Eq>{'a_i \\in F'}</Eq>) 꼴의 벡터.
        </p>
        <p>
          <strong style={{ color: C.text }}>생성공간</strong>:{" "}
          <Eq>{'\\text{span}(S) = \\{a_1 v_1 + \\cdots + a_k v_k : a_i \\in F\\}'}</Eq>{" "}
          — <Eq>{'S'}</Eq>의 모든 선형결합의 집합.
        </p>
      </Box>

      <Question number={1} revealed={revealedQ7} onReveal={() => setRevealedQ7(true)}>
        <Eq>{'\\text{span}(S)'}</Eq>가 항상 <Eq>{'V'}</Eq>의 부분공간임을 증명해보세요.
        부분공간 판정법 (b)를 적용하면 됩니다.
      </Question>

      <Answer visible={revealedQ7}>
        <p style={{ marginBottom: "1rem" }}>
          <Eq>{'\\text{span}(S) \\neq \\emptyset'}</Eq>: 모든 <Eq>{'a_i = 0'}</Eq>으로 놓으면{" "}
          <Eq>{'\\mathbf{0} \\in \\text{span}(S)'}</Eq>. ✓
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>덧셈 닫힘</strong>: <Eq>{'a_1v_1 + \\cdots + a_kv_k'}</Eq>와 <Eq>{'b_1v_1 + \\cdots + b_kv_k'}</Eq>의 합은{" "}
          <Eq>{'(a_1+b_1)v_1 + \\cdots + (a_k+b_k)v_k'}</Eq>. <Eq>{'a_i + b_i \\in F'}</Eq>이므로 이것도 <Eq>{'\\text{span}(S)'}</Eq>의 원소. ✓
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>스칼라배 닫힘</strong>: <Eq>{'c(a_1v_1 + \\cdots + a_kv_k) = ca_1v_1 + \\cdots + ca_kv_k'}</Eq>.{" "}
          <Eq>{'ca_i \\in F'}</Eq>이므로 <Eq>{'\\text{span}(S)'}</Eq>의 원소. ✓ ∎
        </p>
        <p>
          더 나아가, <Eq>{'\\text{span}(S)'}</Eq>는 <Eq>{'S'}</Eq>를 포함하는 부분공간 중 <strong style={{ color: C.accent }}>가장 작은 것</strong>입니다.{" "}
          <Eq>{'W'}</Eq>가 부분공간이고 <Eq>{'S \\subseteq W'}</Eq>이면, <Eq>{'W'}</Eq>는 닫힘에 의해{" "}
          <Eq>{'S'}</Eq>의 모든 선형결합을 포함하므로 <Eq>{'\\text{span}(S) \\subseteq W'}</Eq>.
        </p>
      </Answer>

      {/* Interactive Span Explorer */}
      {revealedQ7 && (
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${C.border}`,
          marginTop: "2rem",
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
            🧪 Span 탐색기: <Eq>{'\\text{span}\\{(1,0,1),\\,(0,1,1)\\}'}</Eq> in <Eq>{'\\mathbb{R}^3'}</Eq>
          </div>

          <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 20, lineHeight: 1.7 }}>
            스칼라 <Eq>{'a'}</Eq>와 <Eq>{'b'}</Eq>를 조절하여 선형결합{" "}
            <Eq>{'a(1,0,1) + b(0,1,1)'}</Eq>의 결과를 관찰해보세요.
            결과 벡터 <Eq>{'(a, b, a+b)'}</Eq>는 항상 <Eq>{'x_3 = x_1 + x_2'}</Eq>를 만족하는 평면 위에 있습니다.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.blue, fontWeight: 600, fontSize: "0.9em" }}>
                  <Eq>{'a'}</Eq> = {a.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.green, fontWeight: 600, fontSize: "0.9em" }}>
                  <Eq>{'b'}</Eq> = {b.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: C.green }}
              />
            </div>
          </div>

          <div style={{
            padding: 20,
            background: C.surface,
            borderRadius: 12,
            textAlign: "center",
          }}>
            <div style={{ marginBottom: 12, color: C.textDim, fontSize: "0.9em" }}>
              <Eq>{`${a.toFixed(1)}(1,0,1) + ${b.toFixed(1)}(0,1,1)`}</Eq>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
              <span style={{ color: C.accent, fontSize: "1.2em" }}>=</span>
              <span style={{
                color: C.yellow,
                fontWeight: 700,
                fontSize: "1.3em",
                fontFamily: "var(--font-mono)",
              }}>
                ({result[0].toFixed(1)}, {result[1].toFixed(1)}, {result[2].toFixed(1)})
              </span>
            </div>
            <div style={{ marginTop: 12, color: C.textMuted, fontSize: "0.85em" }}>
              확인: <Eq>{`x_3 = ${result[2].toFixed(1)} = ${result[0].toFixed(1)} + ${result[1].toFixed(1)} = x_1 + x_2`}</Eq> ✓
            </div>
          </div>

          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${C.purple}10`,
            borderRadius: 8,
            border: `1px solid ${C.purple}20`,
            color: C.textDim,
            fontSize: "0.9em",
            lineHeight: 1.7,
          }}>
            이 생성공간은 <Eq>{'x_1 + x_2 - x_3 = 0'}</Eq>이라는 동차 방정식의 해공간이기도 합니다.
            즉, <strong style={{ color: C.text }}>Span과 Null Space는 같은 부분공간을 서로 다른 관점에서 기술</strong>합니다.
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   8. The "= 0" Principle
   ═══════════════════════════════════════════════════════════════ */
function ZeroPrinciple() {
  return (
    <div>
      <SectionTitle subtitle="이번 글을 관통하는 핵심 원리">
        8. "= 0" 조건이 부분공간을 만든다
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        오늘 다룬 모든 예시에서 반복되는 패턴이 있습니다.
        어떤 <strong style={{ color: C.accent }}>선형적 조건이 0과 같다</strong>고 요구하면 부분공간이 되고,
        0이 아닌 값과 같다고 요구하면 부분공간이 되지 않습니다.
      </p>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            {
              set: "\\{x \\in \\mathbb{R}^n : Ax = \\mathbf{0}\\}",
              cond: "= \\mathbf{0}",
              sub: true,
              name: "영공간 Null(A)",
              color: C.green,
            },
            {
              set: "\\{p \\in P_2 : p(1) = 0\\}",
              cond: "= 0",
              sub: true,
              name: "t=1에서 근을 갖는 다항식",
              color: C.green,
            },
            {
              set: "\\{x \\in \\mathbb{R}^n : Ax = b\\},\\; b \\neq \\mathbf{0}",
              cond: "= b \\neq \\mathbf{0}",
              sub: false,
              name: "비동차 해집합",
              color: C.red,
            },
            {
              set: "\\{p \\in P_2 : p(1) = 1\\}",
              cond: "= 1 \\neq 0",
              sub: false,
              name: "p(1)=1인 다항식",
              color: C.red,
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
                gridTemplateColumns: "2fr 80px 1.5fr",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div style={{ overflowX: "auto" }}>
                <Eq>{item.set}</Eq>
              </div>
              <div style={{
                textAlign: "center",
                color: item.sub ? C.green : C.red,
                fontWeight: 700,
              }}>
                {item.sub ? "✓ 부분공간" : "✗"}
              </div>
              <div style={{ color: C.textDim, fontSize: "0.85em" }}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   9. True/False Problems
   ═══════════════════════════════════════════════════════════════ */
function TrueFalseProblems() {
  const [answers, setAnswers] = useState({});
  const [showSolutions, setShowSolutions] = useState({});

  const problems = [
    {
      id: 1,
      statement: <>모든 벡터공간은 적어도 하나의 원소를 포함한다.</>,
      answer: true,
      explanation: <>맞습니다. 벡터공간의 공리 (A3)에 의해 영벡터 <Eq>{'\\mathbf{0}'}</Eq>이 반드시 존재하므로, 모든 벡터공간은 적어도 하나의 원소를 포함합니다. 사실 <Eq>{'\\{\\mathbf{0}\\}'}</Eq>은 가장 작은 벡터공간입니다.</>,
    },
    {
      id: 2,
      statement: <>두 부분공간의 합집합은 항상 부분공간이다.</>,
      answer: false,
      explanation: <>거짓입니다. 반례: <Eq>{'\\mathbb{R}^2'}</Eq>에서 <Eq>{'W_1 = \\{(x, 0) : x \\in \\mathbb{R}\\}'}</Eq> (x축)과 <Eq>{'W_2 = \\{(0, y) : y \\in \\mathbb{R}\\}'}</Eq> (y축)은 각각 부분공간이지만, <Eq>{'(1, 0) \\in W_1'}</Eq>과 <Eq>{'(0, 1) \\in W_2'}</Eq>의 합 <Eq>{'(1, 1)'}</Eq>은 <Eq>{'W_1 \\cup W_2'}</Eq>에 속하지 않습니다. 반면, 두 부분공간의 <strong>교집합</strong>은 항상 부분공간입니다.</>,
    },
    {
      id: 3,
      statement: <><Eq>{'\\mathbb{R}^2'}</Eq>의 부분공간은 <Eq>{'\\{\\mathbf{0}\\}'}</Eq>, 원점을 지나는 직선, <Eq>{'\\mathbb{R}^2'}</Eq> 자체뿐이다.</>,
      answer: true,
      explanation: <>맞습니다. <Eq>{'\\{\\mathbf{0}\\}'}</Eq>이 아닌 부분공간 <Eq>{'W'}</Eq>에 영이 아닌 벡터 <Eq>{'v'}</Eq>가 있으면, 스칼라배 닫힘에 의해 <Eq>{'\\text{span}(v)'}</Eq> (원점 지나는 직선)가 <Eq>{'W'}</Eq>에 포함됩니다. <Eq>{'W'}</Eq>에 <Eq>{'v'}</Eq>와 일차독립인 벡터 <Eq>{'u'}</Eq>도 있으면, <Eq>{'\\text{span}(v, u) = \\mathbb{R}^2'}</Eq> 전체가 됩니다. (일차독립은 다음 글에서 배웁니다.)</>,
    },
    {
      id: 4,
      statement: <><Eq>{'W = \\{(x, y, z) \\in \\mathbb{R}^3 : x + 2y - z = 0\\}'}</Eq>은 <Eq>{'\\mathbb{R}^3'}</Eq>의 부분공간이다.</>,
      answer: true,
      explanation: <>맞습니다. 이는 행렬 <Eq>{'A = \\begin{pmatrix} 1 & 2 & -1 \\end{pmatrix}'}</Eq>에 대한 동차 방정식 <Eq>{'Ax = \\mathbf{0}'}</Eq>의 해공간입니다. "= 0" 원리에 의해 부분공간입니다.</>,
    },
  ];

  return (
    <div>
      <SectionTitle subtitle="개념 확인 문제">
        9. 참/거짓 문제
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
   10. Summary
   ═══════════════════════════════════════════════════════════════ */
function Summary() {
  return (
    <div>
      <SectionTitle subtitle="1.2절 전체 정리">
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
            { from: "Ax = 0의 해집합", to: "닫힘 성질 관찰", color: C.blue },
            { from: "닫힘 성질 관찰", to: "벡터공간의 8가지 공리", color: C.green },
            { from: "벡터공간의 8가지 공리", to: "부분공간 판정법 (닫힘 2개)", color: C.purple },
            { from: "부분공간 판정법", to: "Span (벡터로부터 부분공간 구성)", color: C.orange },
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
              title: "벡터공간",
              desc: "덧셈과 스칼라배가 8가지 공리를 만족하는 구조",
              color: C.blue,
              detail: "ℝⁿ, 행렬, 다항식, 함수 등의 공통 구조를 추상화",
            },
            {
              title: "부분공간 판정법",
              desc: "닫힘 두 가지만 확인하면 충분",
              color: C.green,
              detail: "등식 공리는 상속, 존재 공리는 닫힘에서 유도",
            },
            {
              title: "0v = 0, (-1)v = -v",
              desc: "공리로부터 증명되는 기본 성질",
              color: C.purple,
              detail: "분배법칙 (S2)가 핵심 역할",
            },
            {
              title: "Span",
              desc: "주어진 벡터들의 모든 선형결합의 집합",
              color: C.orange,
              detail: "S를 포함하는 가장 작은 부분공간",
            },
            {
              title: "\"= 0\" 원리",
              desc: "선형 조건 = 0이면 부분공간",
              color: C.yellow,
              detail: "Null(A), p(1)=0 등 — 선형대수 전반의 패턴",
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
export default function LinearAlgebra12Blog() {
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
          <NullSpaceMotivation />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <VectorSpaceAxioms />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ClosureNotEnough />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <SubspaceCriterion />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <SubspaceExercises />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <VectorSpaceExamples />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <SpanSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ZeroPrinciple />
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
