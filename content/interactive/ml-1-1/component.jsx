'use client';

import { useState, useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/* ─── tiny spring-like animation hook ─── */
function useAnimatedValue(target, speed = 0.08) {
  const [v, setV] = useState(target);
  const ref = useRef(target);
  ref.current = target;
  useEffect(() => {
    let raf;
    const tick = () => {
      setV((prev) => {
        const diff = ref.current - prev;
        if (Math.abs(diff) < 0.001) return ref.current;
        raf = requestAnimationFrame(tick);
        return prev + diff * speed;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return v;
}

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
  question: "#ffd700",
};

/* ─── math helper (KaTeX rendering) ─── */
const M = ({ children, block }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && children) {
      try {
        const latex = typeof children === 'string'
          ? children.replace(/^\$+|\$+$/g, '')
          : String(children);

        katex.render(latex, ref.current, {
          displayMode: block,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }
  }, [children, block]);

  return (
    <span
      ref={ref}
      style={{
        color: C.accent,
        fontSize: block ? "1.1em" : "inherit",
        display: block ? "block" : "inline",
        textAlign: block ? "center" : undefined,
        margin: block ? "1.5em 0" : undefined,
      }}
    />
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
      maxHeight: visible ? 2000 : 0,
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

/* ─── 1. Learning Problem Structure (Socratic) ─── */
function LearningProblemStructure() {
  const [step, setStep] = useState(0);
  const [hoveredPart, setHoveredPart] = useState(null);

  const parts = [
    {
      id: "X",
      label: "입력 공간",
      symbol: "\\mathcal{X}",
      color: C.blue,
      x: 19,
      y: 28,
      desc: "가능한 모든 입력의 집합입니다.",
      example: '스팸 필터: 세상의 모든 이메일',
    },
    {
      id: "Y",
      label: "출력 공간",
      symbol: "\\mathcal{Y}",
      color: C.green,
      x: 19,
      y: 72,
      desc: "가능한 모든 출력(레이블)의 집합입니다.",
      example: "스팸 필터: { 스팸, 정상 }",
    },
    {
      id: "f",
      label: "목표 함수",
      symbol: "f",
      color: C.red,
      x: 50,
      y: 20,
      desc: "우리가 학습하고자 하는 이상적인 함수. 알려지지 않았습니다.",
      example: "f : X → Y (관측 불가, 미지)",
    },
    {
      id: "H",
      label: "가설 집합",
      symbol: "\\mathcal{H}",
      color: C.purple,
      x: 50,
      y: 70,
      desc: "우리가 고려하는 함수들의 범위를 제한합니다.",
      example: "예: 선형 함수, k-CNF 등",
    },
  ];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "0.5rem", marginTop: 0, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        1. 학습 문제의 구조
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        소크라테스식 대화로 학습의 본질을 파헤쳐 봅시다.
      </p>

      {/* Q1 */}
      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        "기계가 학습한다"는 것은 정확히 무엇을 의미할까요?
      </Question>
      <Answer visible={step >= 1}>
        <strong style={{ color: C.text }}>"규칙을 명시적으로 프로그래밍하는 대신, 예제로부터 패턴을 추출한다"</strong>
        <br /><br />
        Valiant의 "A Theory of the Learnable" (1984) 논문 첫 문단에서 학습의 본질을 이렇게 정의합니다.
        전통적인 프로그래밍은 규칙을 직접 코드로 작성하지만, 학습은 데이터에서 규칙을 발견합니다.
      </Answer>

      {/* Q2 */}
      {step >= 1 && (
        <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
          그러면 학습이 끝난 후 기계 내부에 남아있는 "결과물"은 어떤 형태일까요?
          새로운 데이터가 들어왔을 때 이 결과물이 어떻게 사용될까요?
        </Question>
      )}
      <Answer visible={step >= 2}>
        학습의 결과물은 <strong style={{ color: C.text }}>입력을 받아서 출력을 내놓는 함수</strong>입니다.
        <br /><br />
        예를 들어 스팸 필터가 수천 개의 이메일 예제를 보고 학습한 후, 새로운 이메일이 들어왔을 때 
        이 함수를 통해 "스팸" 또는 "정상"이라는 출력을 내놓습니다.
        이 함수를 <M>g</M>라고 부릅니다.
      </Answer>

      {/* Q3 */}
      {step >= 2 && (
        <Question number={3} revealed={step >= 3} onReveal={() => setStep(3)}>
          <M>g</M>는 무엇을 목표로 만들어진 걸까요? 세상 어딘가에 "이 이메일은 스팸이다/아니다"를 
          완벽히 판정하는 이상적인 정답 함수 <M>f</M>가 존재한다고 가정하면, 
          <M>g</M>와 <M>f</M>의 관계는 어떠해야 할까요? 
          그리고 <M>f</M>는 우리가 직접 볼 수 있을까요?
        </Question>
      )}
      <Answer visible={step >= 3}>
        <M>g</M>는 <M>f</M>를 <strong style={{ color: C.text }}>적절하게 근사</strong>해야 합니다.
        <br /><br />
        그리고 <M>f</M>는 존재하지만, <strong style={{ color: C.red }}>우리에게는 보이지 않습니다</strong>.
        만약 <M>f</M>를 직접 볼 수 있었다면 그냥 구현하면 됩니다 — 그건 프로그래밍이지 학습이 아닙니다.
      </Answer>

      {/* Q4 */}
      {step >= 3 && (
        <Question number={4} revealed={step >= 4} onReveal={() => setStep(4)}>
          <M>f</M>를 직접 볼 수 없다면, 우리는 <M>f</M>에 대해 어떤 정보를 가지고 있는 걸까요?
          학습 알고리즘은 무엇을 보고 <M>g</M>를 만들어낼까요?
        </Question>
      )}
      <Answer visible={step >= 4}>
        우리는 <strong style={{ color: C.text }}>훈련 데이터(training data)</strong>를 가지고 있습니다.
        <br /><br />
        <M>f</M>를 직접 볼 수는 없지만, <M>f</M>가 특정 입력에 대해 어떤 값을 내놓았는지는 관찰할 수 있습니다.
        스팸 필터의 경우, 과거에 사람이 "이건 스팸", "이건 정상"이라고 라벨을 붙인 이메일들이 바로 이런 관찰값입니다.
        <M block>{"\\mathcal{D} = \\{(x_1, f(x_1)), (x_2, f(x_2)), \\ldots, (x_n, f(x_n))\\}"}</M>
      </Answer>

      {/* Formal structure diagram - shown after Q4 */}
      {step >= 4 && (
        <>
          <Box color={C.accent} label="학습 문제의 네 가지 요소">
            지금까지의 논의를 정리하면, 학습 문제는 네 가지 요소로 구성됩니다.
            아래 다이어그램에서 각 요소를 호버해 보세요.
          </Box>

          {/* Interactive diagram */}
          <div
            style={{
              position: "relative",
              background: C.surfaceAlt,
              borderRadius: 16,
              border: `1px solid ${C.border}`,
              height: 320,
              marginBottom: "2rem",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}
          >
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
                  <polygon points="0 0, 10 4, 0 8" fill={C.accent} opacity="0.9" />
                </marker>
              </defs>
              <ellipse
                cx="19%"
                cy="50%"
                rx="12%"
                ry="16%"
                fill={`${C.blue}08`}
                stroke={C.blue}
                strokeWidth="2"
                strokeDasharray="5 3"
                opacity="0.6"
              />
              <line
                x1="32%"
                y1="50%"
                x2="68%"
                y2="50%"
                stroke={C.accent}
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                opacity="0.8"
              />
              <rect
                x="39%"
                y="39%"
                width="22%"
                height="10%"
                fill={C.surfaceAlt}
                stroke={C.accent}
                strokeWidth="1"
                strokeOpacity="0.3"
                rx="6"
              />
              <text
                x="50%"
                y="45.5%"
                textAnchor="middle"
                fill={C.accent}
                fontSize={12}
                fontFamily="monospace"
                fontWeight="700"
              >
                학습 알고리즘 A
              </text>
            </svg>

            {parts.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredPart(p.id)}
                onMouseLeave={() => setHoveredPart(null)}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%,-50%)",
                  padding: "10px 16px",
                  background: hoveredPart === p.id ? `${p.color}25` : `${p.color}12`,
                  border: `2px solid ${hoveredPart === p.id ? p.color : p.color + "50"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: hoveredPart === p.id ? 10 : 1,
                  boxShadow: hoveredPart === p.id ? `0 0 25px ${p.color}40` : "none",
                }}
              >
                <div style={{ color: p.color, fontWeight: 700, fontSize: "0.9em", fontFamily: "var(--font-mono)" }}>
                  <M>{p.symbol}</M> {p.label}
                </div>
              </div>
            ))}

            <div
              style={{
                position: "absolute",
                right: "8%",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "14px 20px",
                background: `${C.accent}18`,
                border: `2px solid ${C.accent}70`,
                borderRadius: 12,
                boxShadow: `0 0 20px ${C.accent}25`,
              }}
            >
              <div style={{ color: C.accent, fontWeight: 700, fontSize: "1.1em", fontFamily: "var(--font-mono)" }}>
                g ≈ f
              </div>
              <div style={{ color: C.textDim, fontSize: "0.75em", marginTop: 4 }}>학습 결과</div>
            </div>

            <div
              style={{
                position: "absolute",
                left: "13%",
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: "center",
              }}
            >
              <div style={{ color: C.textDim, fontSize: "0.82em", fontFamily: "var(--font-mono)" }}>
                훈련 데이터
              </div>
              <div style={{ color: C.textMuted, fontSize: "0.72em", marginTop: 4 }}>
                (x₁,y₁)…(xₙ,yₙ)
              </div>
            </div>
          </div>

          {/* Hover detail */}
          <div
            style={{
              minHeight: 90,
              background: C.surface,
              borderRadius: 12,
              padding: "1.25rem",
              border: `1px solid ${C.border}`,
              transition: "all 0.3s ease",
              marginBottom: "2rem",
            }}
          >
            {hoveredPart ? (
              (() => {
                const p = parts.find((x) => x.id === hoveredPart);
                return (
                  <div>
                    <div style={{ color: p.color, fontWeight: 700, marginBottom: 8, fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 8 }}>
                      <M>{p.symbol}</M> <span>{p.label}</span>
                    </div>
                    <p style={{ color: C.text, lineHeight: 1.7, margin: 0, marginBottom: 8 }}>{p.desc}</p>
                    <div
                      style={{
                        padding: "8px 12px",
                        background: `${p.color}12`,
                        borderRadius: 6,
                        fontSize: "0.85em",
                        color: p.color,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {p.example}
                    </div>
                  </div>
                );
              })()
            ) : (
              <p style={{ color: C.textMuted, margin: 0, textAlign: "center", paddingTop: 12 }}>
                ↑ 위 다이어그램의 요소를 호버하면 상세 설명이 표시됩니다
              </p>
            )}
          </div>
        </>
      )}

      {/* Progress indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: step >= i ? C.accent : C.border,
              transition: "all 0.3s ease",
              boxShadow: step >= i ? `0 0 8px ${C.accent}80` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 2. PAC Learnability (Socratic) ─── */
function PACLearnability() {
  const [step, setStep] = useState(0);
  const [h, setH] = useState(10);
  const animH = useAnimatedValue(h, 0.12);
  const errorBound = 1 / animH;
  const confidence = 1 - 1 / animH;

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "0.5rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        2. 학습 가능성의 정의 — PAC 학습
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        "학습 가능하다"는 것을 어떻게 엄밀하게 정의할 수 있을까요?
      </p>

      {/* Q1 */}
      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        훈련 데이터는 유한합니다. 그런데 입력 공간 <M>{`\\mathcal{X}`}</M>는 보통 매우 크거나 무한합니다.
        훈련 데이터를 통해 만든 <M>g</M>가 한 번도 본 적 없는 새로운 입력에 대해서도 
        <M>f</M>와 일치할 거라고 어떻게 확신할 수 있을까요?
      </Question>
      <Answer visible={step >= 1}>
        사실, <strong style={{ color: C.red }}>논리적으로 확신할 수 없습니다</strong>.
        <br /><br />
        <M>n</M>개의 점 <M>{`(x_1, f(x_1)), \\ldots, (x_n, f(x_n))`}</M>과 정확히 일치하는 함수는 무한히 많습니다.
        이 중에서 어떤 것이 진짜 <M>f</M>인지 확정할 방법이 없습니다.
        이것이 전통적인 <strong style={{ color: C.text }}>귀납 추론(inductive inference)의 근본적인 문제</strong>입니다.
      </Answer>

      {/* Q2 */}
      {step >= 1 && (
        <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
          그렇다면 학습은 불가능한 걸까요? Valiant는 이 문제를 어떻게 해결했을까요?
        </Question>
      )}
      <Answer visible={step >= 2}>
        Valiant의 핵심 통찰은 <strong style={{ color: C.accent }}>요구사항을 완화</strong>하는 것입니다.
        <br /><br />
        "<M>g</M>가 모든 입력에서 <M>f</M>와 일치해야 한다"는 요구를 포기합니다.
        대신 "<M>g</M>가 <strong style={{ color: C.text }}>자연에서 자주 등장하는 입력의 대부분</strong>에서 
        <M>f</M>와 일치하면 충분하다"고 정의합니다.
        <br /><br />
        이것이 <strong style={{ color: C.accent }}>PAC (Probably Approximately Correct)</strong> 학습의 핵심 아이디어입니다:
        <M block>{`P[E_{\\text{out}}(g) \\leq \\epsilon] \\geq 1 - \\delta`}</M>
        "높은 확률(Probably)로, 근사적으로 정확한(Approximately Correct)" 학습.
      </Answer>

      {/* Q3 */}
      {step >= 2 && (
        <Question number={3} revealed={step >= 3} onReveal={() => setStep(3)}>
          "높은 확률"과 "근사적으로 정확"에서 확률은 어디서 오는 걸까요?
          왜 확정적인 보장 대신 확률적인 보장만 가능할까요?
        </Question>
      )}
      <Answer visible={step >= 3}>
        확률은 <strong style={{ color: C.text }}>두 곳</strong>에서 발생합니다:
        <br /><br />
        <strong style={{ color: C.blue }}>1. 훈련 데이터의 무작위 샘플링</strong><br />
        운이 나쁘면 편향된 데이터를 받을 수 있습니다. 예를 들어, 스팸 이메일만 가득한 훈련 세트를 받을 수 있습니다.
        <br /><br />
        <strong style={{ color: C.green }}>2. 근사의 불완전성</strong><br />
        <M>g</M>가 <M>f</M>와 모든 곳에서 일치할 필요는 없습니다. 
        드물게 나타나는 입력에서 틀려도 실용적으로는 문제없습니다.
      </Answer>

      {/* Interactive visualization - shown after Q3 */}
      {step >= 3 && (
        <>
          <Box color={C.accent} label="PAC 정의 (Valiant, 1984)">
            클래스 <M>X</M>가 <strong>학습 가능(learnable)</strong>하다 ⟺ 알고리즘 <M>A</M>가 존재하여,
            <strong> 모든</strong> 목표 함수 <M>{`f \\in X`}</M>와 <strong>모든</strong> 분포 <M>D</M>에 대해:
            <M block>{`P[E_{\\text{out}}(g) \\leq h^{-1}] \\geq 1 - h^{-1}`}</M>
            를 만족하는 <M>g</M>를 다항 시간 내에 출력한다.
          </Box>

          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0", fontSize: "1rem" }}>
            매개변수 <M>h</M>를 조절하며 확률과 오차 한계가 어떻게 변하는지 확인해 보세요:
          </p>

          <div
            style={{
              background: C.surfaceAlt,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${C.border}`,
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <label style={{ color: C.textDim, fontSize: "0.9em", fontFamily: "var(--font-mono)", minWidth: 60 }}>
                h = {h}
              </label>
              <input
                type="range"
                min={2}
                max={100}
                value={h}
                onChange={(e) => setH(+e.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.72em", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  성공 확률 (Probably)
                </div>
                <div style={{ position: "relative", height: 140, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div
                    style={{
                      width: 70,
                      height: `${confidence * 120}px`,
                      background: `linear-gradient(to top, ${C.green}, ${C.green}80)`,
                      borderRadius: "10px 10px 0 0",
                      transition: "height 0.15s ease",
                      minHeight: 4,
                      boxShadow: `0 0 20px ${C.green}40`,
                    }}
                  />
                </div>
                <div style={{ color: C.green, fontFamily: "var(--font-mono)", fontSize: "1.4em", fontWeight: 700, marginTop: 10 }}>
                  ≥ {(confidence * 100).toFixed(1)}%
                </div>
                <div style={{ color: C.textMuted, fontSize: "0.75em", marginTop: 4 }}>
                  1 − h⁻¹
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.72em", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  오차 한계 (Approximately)
                </div>
                <div style={{ position: "relative", height: 140, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div
                    style={{
                      width: 70,
                      height: `${errorBound * 120}px`,
                      background: `linear-gradient(to top, ${C.red}, ${C.red}80)`,
                      borderRadius: "10px 10px 0 0",
                      transition: "height 0.15s ease",
                      minHeight: 4,
                      boxShadow: `0 0 20px ${C.red}40`,
                    }}
                  />
                </div>
                <div style={{ color: C.red, fontFamily: "var(--font-mono)", fontSize: "1.4em", fontWeight: 700, marginTop: 10 }}>
                  ≤ {(errorBound * 100).toFixed(1)}%
                </div>
                <div style={{ color: C.textMuted, fontSize: "0.75em", marginTop: 4 }}>
                  h⁻¹
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: "14px 18px",
                background: `${C.accent}10`,
                borderRadius: 10,
                border: `1px solid ${C.accent}25`,
                fontSize: "0.88em",
                color: C.textDim,
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              {h < 10
                ? "⚠️ h가 작으면 보장이 약합니다. 오차도 크고 실패 확률도 높습니다."
                : h < 50
                ? `h = ${h}: 성공 확률 ${(confidence*100).toFixed(0)}%, 오차 ${(errorBound*100).toFixed(1)}% 이하. 합리적인 수준입니다.`
                : `h = ${h}: 매우 강한 보장! 하지만 더 많은 샘플과 계산 시간이 필요합니다.`}
            </div>
          </div>
        </>
      )}

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: step >= i ? C.accent : C.border,
              transition: "all 0.3s ease",
              boxShadow: step >= i ? `0 0 8px ${C.accent}80` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 3. Three Paradigms (Socratic) ─── */
function ThreeParadigms() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(0);

  const paradigms = [
    {
      name: "지도 학습",
      nameEn: "Supervised Learning",
      color: C.blue,
      icon: "📋",
      info: "입력과 정답 레이블이 쌍으로 주어집니다.",
      detail:
        "Valiant의 PAC 프레임워크가 바로 이 패러다임을 형식화한 것입니다. 학습 알고리즘은 (x, f(x)) 쌍을 받아 미지의 f를 근사합니다. 스팸 필터, 의료 진단, 이미지 분류 등이 대표적 응용입니다.",
      dataFlow: ["입력 x", "정답 y = f(x)", "함수 g 학습"],
      key: "무엇이 정답인지 직접 알려준다",
    },
    {
      name: "비지도 학습",
      nameEn: "Unsupervised Learning",
      color: C.green,
      icon: "🔍",
      info: "입력만 주어지고 레이블은 없습니다.",
      detail:
        "정답 없이 데이터의 구조나 패턴을 발견합니다. 클러스터링(비슷한 데이터 묶기), 차원 축소(핵심 특징 추출), 밀도 추정 등이 있습니다. '목표 함수'라는 개념 자체가 달라집니다.",
      dataFlow: ["입력 x만 제공", "(레이블 없음)", "구조/패턴 발견"],
      key: "숨겨진 구조를 스스로 찾아낸다",
    },
    {
      name: "강화 학습",
      nameEn: "Reinforcement Learning",
      color: C.accent,
      icon: "🎮",
      info: "행동의 결과(보상)를 통해 학습합니다.",
      detail:
        "에이전트가 환경과 상호작용하며, 각 행동에 대한 보상 신호를 받습니다. 정답을 직접 알려주지 않지만, '얼마나 잘했는지'를 알려줍니다. 게임 AI, 로봇 제어, 자율 주행 등에 쓰입니다.",
      dataFlow: ["상태 s", "행동 a → 보상 r", "최적 정책 π 학습"],
      key: "시행착오를 통해 최선의 전략을 찾는다",
    },
  ];

  const p = paradigms[active];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "0.5rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        3. 세 가지 학습 패러다임
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        학습 문제는 알고리즘에 어떤 정보가 주어지는가에 따라 구분됩니다.
      </p>

      {/* Q1 */}
      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        지금까지 우리는 훈련 데이터로 <M>{`(x, f(x))`}</M> 쌍을 받는다고 가정했습니다.
        하지만 항상 "정답"을 알 수 있는 걸까요? 정답을 모르는 상황에서도 학습이 가능할까요?
      </Question>
      <Answer visible={step >= 1}>
        정답(레이블)의 유무에 따라 학습 패러다임이 나뉩니다:
        <br /><br />
        • <strong style={{ color: C.blue }}>지도 학습</strong>: 정답이 주어짐 — 우리가 지금까지 논의한 방식<br />
        • <strong style={{ color: C.green }}>비지도 학습</strong>: 정답 없이 구조만 발견<br />
        • <strong style={{ color: C.accent }}>강화 학습</strong>: 정답 대신 "얼마나 잘했는지" 피드백
      </Answer>

      {/* Paradigm selector - shown after Q1 */}
      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0", fontSize: "1rem" }}>
            각 패러다임을 클릭하여 자세히 살펴보세요:
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {paradigms.map((par, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flex: "1 1 150px",
                  padding: "16px 14px",
                  background: active === i ? `${par.color}20` : C.surface,
                  border: `1.5px solid ${active === i ? par.color : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  color: active === i ? par.color : C.textDim,
                  fontWeight: active === i ? 700 : 400,
                  fontSize: "0.9em",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: active === i ? `0 0 20px ${par.color}30` : "none",
                }}
              >
                <span style={{ fontSize: "1.4em", display: "block", marginBottom: 6 }}>{par.icon}</span>
                {par.name}
              </button>
            ))}
          </div>

          <div
            style={{
              background: C.surfaceAlt,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${p.color}30`,
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: "1.6em" }}>{p.icon}</span>
              <div>
                <h3 style={{ color: p.color, margin: 0, fontSize: "1.25em", fontWeight: 700 }}>{p.name}</h3>
                <span style={{ color: C.textMuted, fontSize: "0.8em" }}>{p.nameEn}</span>
              </div>
            </div>

            <p style={{ color: C.text, lineHeight: 1.8, marginBottom: 20, fontSize: "1rem" }}>{p.detail}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "18px",
                background: `${p.color}10`,
                borderRadius: 12,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              {p.dataFlow.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      padding: "8px 16px",
                      background: `${p.color}20`,
                      borderRadius: 8,
                      fontSize: "0.85em",
                      color: p.color,
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                  {i < p.dataFlow.length - 1 && <span style={{ color: C.textMuted, fontSize: "1.2em" }}>→</span>}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "12px 18px",
                background: `${p.color}15`,
                borderRadius: 10,
                color: p.color,
                fontSize: "0.92em",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              핵심: {p.key}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── 4. Generalization (Socratic) ─── */
function Generalization() {
  const [step, setStep] = useState(0);
  const [numSamples, setNumSamples] = useState(5);
  const [hypSize, setHypSize] = useState(3);

  const rng = (s) => {
    let x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const eIn = Math.max(0, 0.3 - numSamples * 0.02 - hypSize * 0.01 + rng(1 + numSamples) * 0.05);
  const selectionBias = Math.max(0, (hypSize - 2) * 0.06 * Math.max(0.2, 1 - numSamples * 0.015));
  const eOut = Math.min(1, eIn + selectionBias + 0.02 + rng(1 + hypSize) * 0.03);
  const gap = eOut - eIn;

  const animEin = useAnimatedValue(eIn);
  const animEout = useAnimatedValue(eOut);

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "0.5rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        4. 일반화의 문제
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        훈련 데이터에서 잘 하는 것과 새로운 데이터에서 잘 하는 것은 다릅니다.
      </p>

      {/* Q1 */}
      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        극단적인 상황을 상상해 봅시다. 훈련 데이터로 1000개의 이메일이 주어졌고, 
        우리가 선택할 수 있는 함수 <M>g</M>에 아무런 제약이 없다고 합시다.
        다음과 같은 함수 <M>{`g^*`}</M>를 만들면 어떻게 될까요?
        <br /><br />
        <span style={{ color: C.textMuted, fontSize: "0.9em" }}>
          • 훈련 데이터의 1000개 이메일: 정답을 그대로 외워서 출력<br />
          • 그 외 모든 이메일: 무조건 "스팸"이라고 출력
        </span>
      </Question>
      <Answer visible={step >= 1}>
        이 함수 <M>{`g^*`}</M>는 훈련 데이터에서 <strong style={{ color: C.green }}>완벽</strong>합니다 — 
        <M>{`E_{\\text{in}} = 0`}</M>.
        <br /><br />
        하지만 새로운 이메일에서는 <strong style={{ color: C.red }}>재앙적</strong>입니다.
        정상 이메일의 대부분을 스팸이라고 분류할 것이므로 <M>{`E_{\\text{out}}`}</M>이 매우 큽니다.
        <br /><br />
        이것이 <strong style={{ color: C.red }}>과적합(overfitting)</strong>의 극단적인 예입니다.
        훈련 데이터를 "외워버리면" 일반화에 실패합니다.
      </Answer>

      {/* Q2 */}
      {step >= 1 && (
        <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
          그렇다면 왜 이런 일이 발생하는 걸까요? 
          <M>{`E_{\\text{in}}`}</M>이 작으면 <M>{`E_{\\text{out}}`}</M>도 작을 거라고 기대할 수 없는 이유는 무엇일까요?
        </Question>
      )}
      <Answer visible={step >= 2}>
        핵심 원인은 <strong style={{ color: C.accent }}>선택 편향(selection bias)</strong>입니다.
        <br /><br />
        비유를 들어보겠습니다: 100명이 동전을 각각 10번씩 던집니다. 
        그 중 앞면이 가장 많이 나온 사람을 뽑으면, 그 사람의 결과는 동전의 실제 확률(50%)을 반영하지 않습니다.
        <br /><br />
        마찬가지로, <M>{`\\mathcal{H}`}</M>에서 <M>{`E_{\\text{in}}`}</M>을 최소화하는 <M>g</M>를 
        <em>선택</em>하면, 그 <M>g</M>의 <M>{`E_{\\text{in}}`}</M>은 <M>{`E_{\\text{out}}`}</M>을 
        <strong style={{ color: C.red }}> 과소추정</strong>합니다.
        <M>{`|\\mathcal{H}|`}</M>가 클수록 이 편향이 심해집니다.
      </Answer>

      {/* Interactive visualization - shown after Q2 */}
      {step >= 2 && (
        <>
          <Box color={C.green} label="일반화의 두 가지 조건">
            ① <M>N</M>이 충분히 크면 큰 수의 법칙에 의해 <M>{`E_{\\text{in}} \\approx E_{\\text{out}}`}</M> (고정된 <M>g</M>에 대해)
            <br />
            ② <M>{`|\\mathcal{H}|`}</M>가 충분히 작으면 선택 편향이 제한되어, 선택된 <M>g</M>에 대해서도 <M>{`E_{\\text{in}} \\approx E_{\\text{out}}`}</M>
          </Box>

          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0", fontSize: "1rem" }}>
            아래에서 샘플 수와 가설 공간 크기를 조절하며 <M>{`E_{\\text{in}}`}</M>과 <M>{`E_{\\text{out}}`}</M>의 
            관계를 확인해 보세요:
          </p>

          <div
            style={{
              background: C.surfaceAlt,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${C.border}`,
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 10 }}>
                  훈련 샘플 수 <M>N</M> = {numSamples}
                </label>
                <input
                  type="range"
                  min={2}
                  max={30}
                  value={numSamples}
                  onChange={(e) => setNumSamples(+e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 10 }}>
                  가설 공간 |<M>{`\\mathcal{H}`}</M>|: {["작음", "보통", "큼", "매우 큼", "무제한"][hypSize - 1]}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={hypSize}
                  onChange={(e) => setHypSize(+e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 50, height: 180, marginBottom: 20 }}>
              {[
                { label: "E_{\\text{in}}", value: animEin, color: C.green, desc: "훈련 오차" },
                { label: "E_{\\text{out}}", value: animEout, color: C.red, desc: "일반화 오차" },
              ].map((bar) => (
                <div key={bar.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 70,
                      height: `${Math.max(4, bar.value * 160)}px`,
                      background: `linear-gradient(to top, ${bar.color}, ${bar.color}80)`,
                      borderRadius: "10px 10px 0 0",
                      transition: "height 0.15s ease",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 8,
                      boxShadow: `0 0 15px ${bar.color}40`,
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "0.8em", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {(bar.value * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ color: bar.color, fontSize: "0.9em", fontFamily: "var(--font-mono)", marginTop: 10, fontWeight: 700 }}>
                    <M>{bar.label}</M>
                  </div>
                  <div style={{ color: C.textMuted, fontSize: "0.72em", marginTop: 4 }}>{bar.desc}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "14px",
                background: gap > 0.15 ? `${C.red}15` : `${C.green}15`,
                borderRadius: 10,
                border: `1px solid ${gap > 0.15 ? C.red : C.green}40`,
              }}
            >
              <span style={{ color: gap > 0.15 ? C.red : C.green, fontWeight: 700, fontSize: "0.95em" }}>
                일반화 격차: {(gap * 100).toFixed(1)}%
                {gap > 0.25 ? " — ⚠️ 과적합 위험!" : gap > 0.15 ? " — 주의 필요" : " — ✓ 양호"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: step >= i ? C.accent : C.border,
              transition: "all 0.3s ease",
              boxShadow: step >= i ? `0 0 8px ${C.accent}80` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 5. Inductive Bias (Socratic) ─── */
function InductiveBias() {
  const [step, setStep] = useState(0);
  const [selectedH, setSelectedH] = useState(1);

  const hypotheses = [
    {
      name: "H = 모든 함수",
      risk: "높음",
      generalize: "불가능",
      color: C.red,
      icon: "∞",
      desc: "아무런 제한 없이 모든 가능한 함수를 고려합니다. 어떤 훈련 데이터든 완벽히 맞출 수 있지만, 일반화 보장은 전혀 없습니다.",
      circles: [100],
    },
    {
      name: "H = 다항식 (차수 ≤ d)",
      risk: "중간",
      generalize: "가능 (조건부)",
      color: C.accent,
      icon: "xᵈ",
      desc: "다항식의 차수를 제한합니다. d가 작으면 표현력이 부족하고(과소적합), d가 크면 과적합 위험이 있습니다.",
      circles: [60],
    },
    {
      name: "H = 선형 함수",
      risk: "낮음",
      generalize: "가능",
      color: C.green,
      icon: "ax+b",
      desc: "매우 제한된 가설 공간입니다. 선택 편향이 작아 일반화가 잘 되지만, 목표 함수 f가 비선형이면 근사 자체가 불가능합니다.",
      circles: [25],
    },
  ];

  const sel = hypotheses[selectedH];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "0.5rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        5. 귀납적 편향
      </h2>
      <p style={{ color: C.textMuted, fontSize: "0.9rem", marginBottom: "2rem" }}>
        학습이 가능하려면 무엇을 포기해야 할까요?
      </p>

      {/* Q1 */}
      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        앞서 <M>{`|\\mathcal{H}|`}</M>가 크면 선택 편향으로 인해 일반화가 어렵다는 것을 보았습니다.
        그렇다면 <M>{`\\mathcal{H}`}</M>를 제한하지 않고 학습하는 것은 가능할까요?
      </Question>
      <Answer visible={step >= 1}>
        <strong style={{ color: C.red }}>불가능합니다.</strong> 이것은 단순한 직관이 아니라 수학적으로 증명된 결과입니다.
        <br /><br />
        <strong style={{ color: C.accent }}>No Free Lunch 정리</strong>: 
        모든 가능한 목표 함수 <M>f</M>에 대해 평균적으로 잘 작동하는 학습 알고리즘은 존재하지 않습니다.
        어떤 <M>f</M>에서 잘 하려면, 다른 <M>f</M>에서 성능을 포기해야 합니다.
      </Answer>

      {/* Q2 */}
      {step >= 1 && (
        <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
          그렇다면 <M>{`\\mathcal{H}`}</M>를 제한한다는 것은 정확히 무엇을 의미할까요?
          이런 제한을 어떻게 정당화할 수 있을까요?
        </Question>
      )}
      <Answer visible={step >= 2}>
        <M>{`\\mathcal{H}`}</M>를 제한하는 것을 <strong style={{ color: C.accent }}>귀납적 편향(inductive bias)</strong>이라고 합니다.
        <br /><br />
        이것은 "어떤 종류의 함수가 답일 것이다"라는 <strong style={{ color: C.text }}>사전 가정</strong>입니다.
        예를 들어 <M>{`\\mathcal{H}`}</M> = 선형 함수라고 하면, "정답은 선형일 것이다"라고 가정하는 것입니다.
        <br /><br />
        이 가정이 맞으면 학습이 잘 되고, 틀리면 실패합니다. 
        하지만 <strong style={{ color: C.text }}>아무런 가정 없이는 학습 자체가 불가능</strong>합니다.
        이것이 귀납적 편향의 본질입니다.
      </Answer>

      {/* Interactive visualization - shown after Q2 */}
      {step >= 2 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0", fontSize: "1rem" }}>
            서로 다른 가설 공간을 선택하여 트레이드오프를 확인해 보세요:
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {hypotheses.map((hyp, i) => (
              <button
                key={i}
                onClick={() => setSelectedH(i)}
                style={{
                  flex: "1 1 180px",
                  padding: "18px 14px",
                  background: selectedH === i ? `${hyp.color}20` : C.surface,
                  border: `1.5px solid ${selectedH === i ? hyp.color : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit",
                  textAlign: "center",
                  boxShadow: selectedH === i ? `0 0 20px ${hyp.color}30` : "none",
                }}
              >
                <div style={{ fontSize: "1.4em", fontFamily: "var(--font-mono)", color: hyp.color, fontWeight: 700, marginBottom: 6 }}>
                  {hyp.icon}
                </div>
                <div style={{ color: selectedH === i ? hyp.color : C.textDim, fontSize: "0.8em", fontWeight: selectedH === i ? 600 : 400, lineHeight: 1.4 }}>
                  {hyp.name}
                </div>
              </button>
            ))}
          </div>

          <div
            style={{
              background: C.surfaceAlt,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${sel.color}30`,
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, padding: "20px 0" }}>
              <div style={{ position: "relative", width: 220, height: 220 }}>
                <div
                  style={{
                    position: "absolute",
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    border: `2px dashed ${C.textMuted}60`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 10,
                    background: `${C.textMuted}05`,
                  }}
                >
                  <span style={{ fontSize: "0.7em", color: C.textMuted, fontWeight: 600 }}>모든 함수</span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: `${sel.circles[0]}%`,
                    height: `${sel.circles[0]}%`,
                    borderRadius: "50%",
                    border: `3px solid ${sel.color}`,
                    background: `${sel.color}20`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                    boxShadow: `0 0 30px ${sel.color}30, inset 0 0 30px ${sel.color}10`,
                  }}
                >
                  <span style={{ fontSize: "1em", color: sel.color, fontWeight: 700, fontFamily: "var(--font-mono)" }}>H</span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.accent,
                    top: "42%",
                    left: "58%",
                    boxShadow: `0 0 15px ${C.accent}cc, 0 0 30px ${C.accent}60`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "34%",
                    left: "63%",
                    fontSize: "0.75em",
                    color: C.accent,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    textShadow: `0 0 10px ${C.accent}80`,
                  }}
                >
                  f (목표)
                </div>
              </div>
            </div>

            <p style={{ color: C.text, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>{sel.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "10px 14px", background: `${sel.color}08`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>과적합 위험</div>
                <div style={{ color: sel.color, fontWeight: 700 }}>{sel.risk}</div>
              </div>
              <div style={{ padding: "10px 14px", background: `${sel.color}08`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>일반화 가능성</div>
                <div style={{ color: sel.color, fontWeight: 700 }}>{sel.generalize}</div>
              </div>
            </div>
          </div>

          <Box color={C.blue} label="오컴의 면도날 (Occam's Razor)">
            동일한 <M>{`E_{\\text{in}}`}</M>을 달성하는 여러 가설이 있을 때, <strong>더 단순한 가설을 선택하라</strong>.
            <br />
            단순한 <M>{`\\mathcal{H}`}</M>에서 찾은 <M>g</M>가 더 잘 일반화될 가능성이 높습니다.
          </Box>
        </>
      )}

      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "2rem" }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: step >= i ? C.accent : C.border,
              transition: "all 0.3s ease",
              boxShadow: step >= i ? `0 0 8px ${C.accent}80` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function LearningProblemBlog() {
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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>

      <article>
        <section style={{ marginBottom: "5rem" }}>
          <LearningProblemStructure />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <PACLearnability />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ThreeParadigms />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <Generalization />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <InductiveBias />
        </section>
      </article>
    </div>
  );
}
