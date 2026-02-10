'use client';

import { useState, useEffect, useRef } from "react";
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

/* ═══════════════════════════════════════════════════════════════
   0. Introduction
   ═══════════════════════════════════════════════════════════════ */
function Introduction() {
  return (
    <div>
      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        기계학습의 핵심 질문은 이것입니다: <strong style={{ color: C.text }}>훈련 데이터에서 잘 작동하는 모델이 
        새로운 데이터에서도 잘 작동할 것이라고 어떻게 보장할 수 있는가?</strong>
      </p>

      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        우리는 훈련 오차 <Eq>{'E_{\\text{in}}'}</Eq>은 계산할 수 있지만, 진짜 알고 싶은 것은
        일반화 오차 <Eq>{'E_{\\text{out}}'}</Eq>입니다. 이 둘의 관계를 정량적으로 분석하는 것이
        이 글의 목표입니다.
      </p>

      <Box color={C.accent} label="이 글의 여정">
        <strong style={{ color: C.blue }}>확률 부등식</strong>에서 출발하여, 
        <strong style={{ color: C.green }}> 성장 함수</strong>와 
        <strong style={{ color: C.purple }}> VC 차원</strong>을 거쳐, 
        <strong style={{ color: C.orange }}> PAC 학습</strong>과 
        <strong style={{ color: C.yellow }}> 라데마허 복잡도</strong>까지 — 
        하나의 논리적 흐름으로 연결됩니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. Probability Inequalities
   ═══════════════════════════════════════════════════════════════ */
function ProbabilityInequalities() {
  const [step, setStep] = useState(0);
  const [mean, setMean] = useState(10);
  const [threshold, setThreshold] = useState(100);
  const [variance, setVariance] = useState(25);

  const markovBound = mean / threshold;
  const chebyshevBound = variance / (threshold * threshold);

  return (
    <div>
      <SectionTitle subtitle="마르코프에서 Hoeffding까지">
        1. 확률 부등식의 계층
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        우리가 하고 싶은 것은 "<Eq>{'E_{\\text{in}}'}</Eq>과 <Eq>{'E_{\\text{out}}'}</Eq>의 차이가 <Eq>{'\\epsilon'}</Eq>보다 클 <strong style={{ color: C.text }}>확률</strong>에
        상한을 두는 것"입니다. 이것이 확률 부등식의 역할입니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        확률변수 X가 <strong>항상 0 이상</strong>이고, <strong>기댓값이 10</strong>이라고 합시다. 
        그러면 X가 100 이상일 확률에 대해 뭔가 말할 수 있을까요?
      </Question>

      <Answer visible={step >= 1}>
        직관적으로 생각해 봅시다. <Eq>{'X \\geq 100'}</Eq>인 값이 자주 나온다면, 평균이 10이 될 수 있을까요?
        <br /><br />
        100 이상인 X가 1번 나올 때마다 0에 가까운 X가 9번은 나와야 평균이 10이 됩니다.
        따라서 <strong style={{ color: C.accent }}><Eq>{'P(X \\geq 100) \\leq 10/100 = 0.1'}</Eq></strong>, 즉 10% 이하입니다.
        <br /><br />
        이것이 바로 <strong style={{ color: C.blue }}>마르코프 부등식</strong>입니다:
      </Answer>

      {step >= 1 && (
        <MathBlock>
          {'P(X \\geq a) \\leq \\frac{E[X]}{a} \\quad \\text{(단, } X \\geq 0, a > 0\\text{)}'}
        </MathBlock>
      )}

      {step >= 1 && (
        <>
          <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
            마르코프 부등식은 <strong>기댓값</strong>만 사용합니다. 
            만약 <strong>분산</strong> 정보도 안다면, 더 정밀한 bound를 얻을 수 있지 않을까요?
          </Question>

          <Answer visible={step >= 2}>
            분산이 작다는 것은 값들이 평균 주위에 모여 있다는 뜻이므로,
            평균에서 멀리 벗어날 확률도 작아야 합니다.
            <br /><br />
            우아한 트릭: <Eq>{'|X - \\mu| \\geq k'}</Eq>를 <Eq>{'(X - \\mu)^2 \\geq k^2'}</Eq>로 바꾸고,
            마르코프 부등식을 <Eq>{'(X - \\mu)^2'}</Eq>에 적용합니다.
            <br /><br />
            <Eq>{'E[(X - \\mu)^2]'}</Eq>은 바로 <strong style={{ color: C.accent }}>분산 <Eq>{'\\sigma^2'}</Eq></strong>의 정의이므로:
          </Answer>
        </>
      )}

      {step >= 2 && (
        <>
          <MathBlock>
            {'P(|X - \\mu| \\geq k) \\leq \\frac{\\sigma^2}{k^2} \\quad \\text{(체비셰프 부등식)}'}
          </MathBlock>

          {/* Interactive Comparison */}
          <div style={{
            background: C.surfaceAlt,
            borderRadius: 16,
            padding: 28,
            marginTop: 24,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
              🎛️ 마르코프 vs 체비셰프 비교
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                  기댓값 E[X]: <strong style={{ color: C.accent }}>{mean}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={mean}
                  onChange={(e) => setMean(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                  분산 σ²: <strong style={{ color: C.purple }}>{variance}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={variance}
                  onChange={(e) => setVariance(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                Threshold (a 또는 k): <strong style={{ color: C.orange }}>{threshold}</strong>
              </label>
              <input
                type="range"
                min={10}
                max={200}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{
                padding: 16,
                background: C.surface,
                borderRadius: 12,
                borderTop: `3px solid ${C.blue}`,
              }}>
                <div style={{ color: C.blue, fontWeight: 600, marginBottom: 8 }}>마르코프 Bound</div>
                <div style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 8 }}>
                  P(X ≥ {threshold}) ≤ {mean}/{threshold}
                </div>
                <div style={{ 
                  color: markovBound > 1 ? C.red : C.accent, 
                  fontSize: "1.5em", 
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}>
                  {markovBound > 1 ? ">1 (무의미)" : markovBound.toFixed(4)}
                </div>
              </div>
              <div style={{
                padding: 16,
                background: C.surface,
                borderRadius: 12,
                borderTop: `3px solid ${C.purple}`,
              }}>
                <div style={{ color: C.purple, fontWeight: 600, marginBottom: 8 }}>체비셰프 Bound</div>
                <div style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 8 }}>
                  P(|X-μ| ≥ {threshold}) ≤ {variance}/{threshold}²
                </div>
                <div style={{ 
                  color: chebyshevBound > 1 ? C.red : C.accent, 
                  fontSize: "1.5em", 
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}>
                  {chebyshevBound > 1 ? ">1 (무의미)" : chebyshevBound.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          <Question number={3} revealed={step >= 3} onReveal={() => setStep(3)}>
            체비셰프 bound는 1/N에 비례해서 줄어듭니다. 
            만약 오차 e<sub>n</sub>이 <strong>유계(bounded)</strong>라는 추가 정보가 있다면 어떨까요? 
            예를 들어 분류 문제에서 e<sub>n</sub>은 0 또는 1입니다.
          </Question>

          <Answer visible={step >= 3}>
            유계 조건은 "분산에 상한이 있다"는 것 이상의 정보를 줍니다. 
            값이 특정 구간에 갇혀 있으면 극단적인 꼬리(tail)가 불가능합니다.
            <br /><br />
            이 추가 정보를 활용하면 <strong style={{ color: C.green }}>지수적으로 감소</strong>하는 
            훨씬 강력한 부등식을 얻습니다:
          </Answer>
        </>
      )}

      {step >= 3 && (
        <Box color={C.green} label="Hoeffding 부등식">
          e₁, ..., eₙ이 독립이고 [0, 1]에 유계일 때:
          <MathBlock>
            {'P\\left(|\\bar{e} - E[\\bar{e}]| \\geq \\epsilon\\right) \\leq 2e^{-2N\\epsilon^2}'}
          </MathBlock>
          체비셰프의 <strong>1/N</strong> 대신 <strong style={{ color: C.accent }}>e^(-N)</strong>으로 감소!
        </Box>
      )}

      {step >= 3 && <HoeffdingDemo />}
    </div>
  );
}

/* ─── Hoeffding vs Chebyshev Demo ─── */
function HoeffdingDemo() {
  const [N, setN] = useState(100);
  const [epsilon, setEpsilon] = useState(0.1);

  const variance = 0.25; // worst case for Bernoulli
  const chebyshev = variance / (N * epsilon * epsilon);
  const hoeffding = 2 * Math.exp(-2 * N * epsilon * epsilon);

  return (
    <div style={{
      background: C.surfaceAlt,
      borderRadius: 16,
      padding: 28,
      marginTop: 24,
      border: `1px solid ${C.green}30`,
    }}>
      <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
        📊 체비셰프 vs Hoeffding 수렴 속도 비교
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
            샘플 수 N: <strong style={{ color: C.accent }}>{N}</strong>
          </label>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={N}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
            허용 오차 ε: <strong style={{ color: C.orange }}>{epsilon.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            min={0.01}
            max={0.5}
            step={0.01}
            value={epsilon}
            onChange={(e) => setEpsilon(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{
          padding: 20,
          background: C.surface,
          borderRadius: 12,
          borderLeft: `4px solid ${C.purple}`,
        }}>
          <div style={{ color: C.purple, fontWeight: 600, marginBottom: 8 }}>체비셰프</div>
          <div style={{ color: C.textDim, fontSize: "0.85em", marginBottom: 8 }}>
            σ² / (N·ε²) = 0.25 / ({N}·{epsilon.toFixed(2)}²)
          </div>
          <div style={{ 
            color: chebyshev > 1 ? C.red : C.text, 
            fontSize: "1.8em", 
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}>
            {chebyshev > 1 ? `${chebyshev.toFixed(1)} (무의미)` : chebyshev.toExponential(2)}
          </div>
        </div>
        <div style={{
          padding: 20,
          background: C.surface,
          borderRadius: 12,
          borderLeft: `4px solid ${C.green}`,
        }}>
          <div style={{ color: C.green, fontWeight: 600, marginBottom: 8 }}>Hoeffding</div>
          <div style={{ color: C.textDim, fontSize: "0.85em", marginBottom: 8 }}>
            2·e^(-2·{N}·{epsilon.toFixed(2)}²)
          </div>
          <div style={{ 
            color: C.accent, 
            fontSize: "1.8em", 
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}>
            {hoeffding < 1e-10 ? hoeffding.toExponential(2) : hoeffding.toExponential(2)}
          </div>
        </div>
      </div>

      {chebyshev > 1 && hoeffding < 0.5 && (
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: `${C.green}15`, 
          borderRadius: 8,
          color: C.green,
          fontSize: "0.9em",
        }}>
          💡 체비셰프는 무의미하지만 Hoeffding은 유용한 bound를 제공합니다!
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Union Bound and Multiple Hypotheses
   ═══════════════════════════════════════════════════════════════ */
function UnionBoundSection() {
  const [step, setStep] = useState(0);
  const [M, setM] = useState(10);
  const [N, setN] = useState(100);
  const epsilon = 0.1;

  const singleBound = 2 * Math.exp(-2 * N * epsilon * epsilon);
  const unionBound = M * singleBound;

  return (
    <div>
      <SectionTitle subtitle="단일 가설에서 가설 공간으로">
        2. Union Bound와 다중 가설
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        Hoeffding 부등식은 <strong style={{ color: C.text }}>고정된 가설 h 하나</strong>에 대해 성립합니다.
        하지만 학습 알고리즘은 여러 가설 중에서 <Eq>{'E_{\\text{in}}'}</Eq>이 가장 작은 것을 <strong style={{ color: C.accent }}>선택</strong>합니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        동전을 한 번 던져서 앞면이 나올 확률은 50%입니다. 
        그런데 동전을 100번 던지고 그중 앞면이 나온 것만 보여준다면, 
        "이 동전은 항상 앞면이 나온다"고 착각할 수 있겠죠. 
        이 비유가 학습에서 어떻게 적용될까요?
      </Question>

      <Answer visible={step >= 1}>
        가설 공간에 가설이 M개 있다면, 각각에 대해 Hoeffding이 성립합니다.
        하지만 우리가 <Eq>{'E_{\\text{in}}'}</Eq>이 가장 작은 가설을 <strong style={{ color: C.text }}>선택</strong>하면,
        우연히 <Eq>{'E_{\\text{in}}'}</Eq>과 <Eq>{'E_{\\text{out}}'}</Eq>이 많이 다른 "운 좋은" 가설을 고를 수 있습니다.
        <br /><br />
        "M개 중 <strong style={{ color: C.red }}>하나라도</strong> 나쁜 가설이 있을 확률"을 bound해야 합니다.
      </Answer>

      {step >= 1 && (
        <>
          <Box color={C.orange} label="Union Bound (합집합 부등식)">
            사건들이 독립이 아니어도 항상 성립합니다:
            <MathBlock>
              {'P(A_1 \\cup A_2 \\cup \\cdots \\cup A_M) \\leq P(A_1) + P(A_2) + \\cdots + P(A_M)'}
            </MathBlock>
            따라서 M개의 가설에 대해:
            <MathBlock>
              {'P\\left(\\exists h : |E_{\\text{in}}(h) - E_{\\text{out}}(h)| \\geq \\epsilon\\right) \\leq 2M \\cdot e^{-2N\\epsilon^2}'}
            </MathBlock>
          </Box>

          {/* Interactive Demo */}
          <div style={{
            background: C.surfaceAlt,
            borderRadius: 16,
            padding: 28,
            marginTop: 24,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
              🎯 가설 수 M이 bound에 미치는 영향
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                  가설 수 M: <strong style={{ color: C.orange }}>{M}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={1000}
                  value={M}
                  onChange={(e) => setM(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                  샘플 수 N: <strong style={{ color: C.accent }}>{N}</strong>
                </label>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={N}
                  onChange={(e) => setN(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
              <div style={{ padding: 16, background: C.surface, borderRadius: 10 }}>
                <div style={{ color: C.textDim, fontSize: "0.8em", marginBottom: 4 }}>단일 가설 Bound</div>
                <div style={{ color: C.blue, fontSize: "1.2em", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                  {singleBound.toExponential(2)}
                </div>
              </div>
              <div style={{ padding: 16, background: C.surface, borderRadius: 10 }}>
                <div style={{ color: C.textDim, fontSize: "0.8em", marginBottom: 4 }}>× M</div>
                <div style={{ color: C.orange, fontSize: "1.2em", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                  × {M}
                </div>
              </div>
              <div style={{ padding: 16, background: C.surface, borderRadius: 10 }}>
                <div style={{ color: C.textDim, fontSize: "0.8em", marginBottom: 4 }}>Union Bound</div>
                <div style={{ 
                  color: unionBound > 1 ? C.red : C.green, 
                  fontSize: "1.2em", 
                  fontWeight: 600, 
                  fontFamily: "var(--font-mono)" 
                }}>
                  {unionBound > 1 ? ">1" : unionBound.toExponential(2)}
                </div>
              </div>
            </div>
          </div>

          <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
            2차원 평면에서 직선 분류기의 가설 수 M은 얼마일까요? 
            직선 하나를 정의하려면 기울기와 y절편이 필요한데...
          </Question>

          <Answer visible={step >= 2}>
            둘 다 실수이므로 M = <strong style={{ color: C.red }}>∞</strong>입니다!
            <br /><br />
            그러면 bound가 무한대가 되어 쓸모없어집니다. 
            여기서 중요한 통찰이 필요합니다: 가설이 무한히 많아도, 
            N개의 고정된 데이터에 대해 <strong style={{ color: C.accent }}>실제로 만들 수 있는 서로 다른 분류 패턴</strong>의 수는 유한합니다!
          </Answer>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Growth Function and Shattering
   ═══════════════════════════════════════════════════════════════ */
function GrowthFunctionSection() {
  const [step, setStep] = useState(0);
  const [numPoints, setNumPoints] = useState(3);

  // Points in general position
  const pointSets = {
    2: [{ x: 100, y: 120 }, { x: 200, y: 120 }],
    3: [{ x: 80, y: 160 }, { x: 220, y: 160 }, { x: 150, y: 60 }],
    4: [{ x: 80, y: 80 }, { x: 220, y: 80 }, { x: 80, y: 180 }, { x: 220, y: 180 }],
  };

  const growthFunctions = {
    2: { actual: 4, max: 4, canShatter: true },
    3: { actual: 8, max: 8, canShatter: true },
    4: { actual: 14, max: 16, canShatter: false },
  };

  const points = pointSets[numPoints];
  const gf = growthFunctions[numPoints];

  return (
    <div>
      <SectionTitle subtitle="가설 공간의 실효적 크기">
        3. 성장 함수와 Shattering
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        핵심 아이디어: 가설의 <strong style={{ color: C.text }}>개수</strong>가 아니라, 
        데이터에 대해 만들 수 있는 <strong style={{ color: C.accent }}>서로 다른 분류 패턴의 수</strong>로 
        복잡도를 측정합니다.
      </p>

      <Box color={C.purple} label="성장 함수 (Growth Function)">
        N개의 점에 대해 가설 공간 H가 만들 수 있는 서로 다른 분류의 최대 개수:
        <MathBlock>
          {'m_{\\mathcal{H}}(N) \\leq 2^N'}
        </MathBlock>
        m_H(N) = 2^N일 때, "H가 N개의 점을 <strong style={{ color: C.accent }}>shatter</strong>한다"고 합니다.
      </Box>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        2차원에서 직선 분류기를 생각해 보세요. 
        점이 2개일 때, 점이 3개일 때, 점이 4개일 때 각각 모든 분류(2^N가지)를 만들 수 있을까요?
      </Question>

      <Answer visible={step >= 1}>
        <strong style={{ color: C.blue }}>2개</strong>: 2² = 4가지 모두 가능 → shatter 가능 ✓
        <br />
        <strong style={{ color: C.green }}>3개</strong> (일반 위치): 2³ = 8가지 모두 가능 → shatter 가능 ✓
        <br />
        <strong style={{ color: C.red }}>4개</strong>: XOR 패턴(대각선 방향으로 같은 클래스)은 직선으로 분리 불가능 → shatter 불가능 ✗
      </Answer>

      {step >= 1 && (
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 28,
          marginTop: 24,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
            🔍 직선 분류기의 성장 함수 탐색
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNumPoints(n)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: numPoints === n ? `${C.accent}20` : C.surface,
                  border: `1.5px solid ${numPoints === n ? C.accent : C.border}`,
                  borderRadius: 10,
                  color: numPoints === n ? C.accent : C.textDim,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {n}개의 점
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Visualization */}
            <div style={{
              background: C.surface,
              borderRadius: 12,
              padding: 16,
              height: 220,
              position: "relative",
            }}>
              <svg width="100%" height="100%" viewBox="0 0 300 200">
                {/* Points */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill={C.accent}
                      opacity={0.8}
                    />
                    <text
                      x={p.x}
                      y={p.y + 5}
                      textAnchor="middle"
                      fill={C.bg}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {i + 1}
                    </text>
                  </g>
                ))}
                
                {/* XOR indicator for 4 points */}
                {numPoints === 4 && (
                  <>
                    <line x1={80} y1={80} x2={220} y2={180} stroke={C.red} strokeWidth={2} strokeDasharray="5,5" opacity={0.5} />
                    <line x1={220} y1={80} x2={80} y2={180} stroke={C.red} strokeWidth={2} strokeDasharray="5,5" opacity={0.5} />
                    <text x={150} y={195} textAnchor="middle" fill={C.red} fontSize="11">XOR 문제</text>
                  </>
                )}
              </svg>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{
                padding: 16,
                background: C.surface,
                borderRadius: 10,
                borderLeft: `3px solid ${C.blue}`,
              }}>
                <div style={{ color: C.textDim, fontSize: "0.85em" }}>최대 가능 (2^N)</div>
                <div style={{ color: C.blue, fontSize: "1.5em", fontWeight: 700 }}>
                  {gf.max}
                </div>
              </div>
              <div style={{
                padding: 16,
                background: C.surface,
                borderRadius: 10,
                borderLeft: `3px solid ${gf.canShatter ? C.green : C.orange}`,
              }}>
                <div style={{ color: C.textDim, fontSize: "0.85em" }}>직선으로 가능한 분류</div>
                <div style={{ color: gf.canShatter ? C.green : C.orange, fontSize: "1.5em", fontWeight: 700 }}>
                  {gf.actual}
                </div>
              </div>
              <div style={{
                padding: 12,
                background: gf.canShatter ? `${C.green}15` : `${C.red}15`,
                borderRadius: 10,
                color: gf.canShatter ? C.green : C.red,
                textAlign: "center",
                fontWeight: 600,
              }}>
                {gf.canShatter ? "✓ Shatter 가능" : "✗ Shatter 불가능"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. VC Dimension
   ═══════════════════════════════════════════════════════════════ */
function VCDimensionSection() {
  const [step, setStep] = useState(0);
  const [labels, setLabels] = useState([1, 1, -1, -1]); // XOR pattern

  const toggleLabel = (i) => {
    const newLabels = [...labels];
    newLabels[i] = newLabels[i] === 1 ? -1 : 1;
    setLabels(newLabels);
  };

  // Check if current labeling is linearly separable
  const isLinSep = () => {
    // XOR patterns are not linearly separable
    const isXOR = (labels[0] === labels[3] && labels[1] === labels[2] && labels[0] !== labels[1]);
    const isAntiXOR = (labels[0] === labels[2] && labels[1] === labels[3] && labels[0] !== labels[1]) && 
                      (labels[0] !== labels[3]);
    return !isXOR && !isAntiXOR;
  };

  const points = [
    { x: 80, y: 60, label: "A" },
    { x: 220, y: 60, label: "B" },
    { x: 80, y: 160, label: "C" },
    { x: 220, y: 160, label: "D" },
  ];

  return (
    <div>
      <SectionTitle subtitle="가설 공간 복잡도의 척도">
        4. VC 차원 (Vapnik-Chervonenkis Dimension)
      </SectionTitle>

      <Box color={C.accent} label="VC 차원의 정의">
        가설 공간 H의 VC 차원은 H가 shatter할 수 있는 <strong>최대</strong> 점의 개수입니다.
        <br /><br />
        2차원 직선 분류기: 3개까지 shatter 가능, 4개는 불가능 → <strong style={{ color: C.accent }}>d_VC = 3</strong>
      </Box>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        VC 차원이 유한하면 왜 학습이 가능해질까요?
      </Question>

      <Answer visible={step >= 1}>
        놀라운 정리가 있습니다 (<strong style={{ color: C.purple }}>Sauer의 보조정리</strong>):
        <br /><br />
        VC 차원이 d_VC로 유한하면, 성장 함수가 <strong style={{ color: C.green }}>다항식</strong>으로 bound됩니다:
        <MathBlock>
          {'m_{\\mathcal{H}}(N) \\leq \\sum_{i=0}^{d_{\\text{VC}}} \\binom{N}{i} = O(N^{d_{\\text{VC}}})'}
        </MathBlock>
        다항식은 지수함수 e^(-cN)보다 느리게 성장하므로, N이 커지면 bound가 줄어듭니다!
      </Answer>

      {step >= 1 && (
        <>
          {/* Interactive XOR Demo */}
          <div style={{
            background: C.surfaceAlt,
            borderRadius: 16,
            padding: 28,
            marginTop: 24,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 8 }}>
              🎮 4개의 점: 직선으로 분리해 보세요
            </div>
            <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 20 }}>
              점을 클릭하여 레이블(+/-)을 바꿔보세요. 직선 하나로 분리할 수 있을까요?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{
                background: C.surface,
                borderRadius: 12,
                padding: 16,
                height: 240,
              }}>
                <svg width="100%" height="100%" viewBox="0 0 300 220">
                  {/* Points */}
                  {points.map((p, i) => (
                    <g 
                      key={i} 
                      onClick={() => toggleLabel(i)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={24}
                        fill={labels[i] === 1 ? C.blue : C.red}
                        opacity={0.9}
                      />
                      <text
                        x={p.x}
                        y={p.y + 6}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        {labels[i] === 1 ? "+" : "−"}
                      </text>
                      <text
                        x={p.x}
                        y={p.y + 45}
                        textAnchor="middle"
                        fill={C.textMuted}
                        fontSize="12"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  padding: 16,
                  background: C.surface,
                  borderRadius: 10,
                }}>
                  <div style={{ color: C.textDim, fontSize: "0.85em", marginBottom: 8 }}>현재 레이블 패턴</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {points.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: labels[i] === 1 ? `${C.blue}30` : `${C.red}30`,
                          border: `2px solid ${labels[i] === 1 ? C.blue : C.red}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: labels[i] === 1 ? C.blue : C.red,
                          fontWeight: 700,
                        }}
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: 16,
                  background: isLinSep() ? `${C.green}15` : `${C.red}15`,
                  borderRadius: 10,
                  border: `1px solid ${isLinSep() ? C.green : C.red}40`,
                }}>
                  <div style={{ 
                    color: isLinSep() ? C.green : C.red, 
                    fontWeight: 600,
                    fontSize: "1.1em",
                    marginBottom: 4,
                  }}>
                    {isLinSep() ? "✓ 직선으로 분리 가능" : "✗ 직선으로 분리 불가능"}
                  </div>
                  <div style={{ color: C.textDim, fontSize: "0.85em" }}>
                    {isLinSep() 
                      ? "이 패턴은 직선 하나로 + 와 - 를 분리할 수 있습니다."
                      : "대각선 방향의 XOR 패턴입니다. 직선으로는 불가능합니다."}
                  </div>
                </div>

                <button
                  onClick={() => setLabels([1, 1, -1, -1])}
                  style={{
                    padding: "10px 16px",
                    background: `${C.orange}20`,
                    border: `1px solid ${C.orange}40`,
                    borderRadius: 8,
                    color: C.orange,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  XOR 패턴으로 리셋
                </button>
              </div>
            </div>
          </div>

          <Box color={C.green} label="핵심 결론">
            <strong style={{ color: C.text }}>VC 차원 유한 ↔ 성장 함수 다항식 ↔ 학습 가능</strong>
            <br /><br />
            가설이 무한히 많아도, VC 차원만 유한하면 충분한 데이터로 일반화가 보장됩니다.
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. VC Generalization Bound
   ═══════════════════════════════════════════════════════════════ */
function VCBoundSection() {
  const [dVC, setDVC] = useState(10);
  const [N, setN] = useState(1000);
  const [delta, setDelta] = useState(0.05);

  // Simplified VC bound approximation
  const genError = Math.sqrt((8 / N) * (dVC * Math.log(2 * N / dVC) + Math.log(4 / delta)));
  
  // Sample complexity
  const sampleComplexity = (eps) => Math.ceil((8 / (eps * eps)) * (dVC * Math.log(2 / eps) + Math.log(4 / delta)));

  return (
    <div>
      <SectionTitle subtitle="일반화 오차의 정량적 경계">
        5. VC 일반화 경계
      </SectionTitle>

      <Box color={C.accent} label="VC 일반화 경계">
        확률 1 - δ 이상으로 다음이 성립합니다:
        <MathBlock>
          {'E_{\\text{out}}(g) \\leq E_{\\text{in}}(g) + O\\left(\\sqrt{\\frac{d_{\\text{VC}}}{N} \\ln\\frac{N}{d_{\\text{VC}}}}\\right)'}
        </MathBlock>
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        이 bound가 말해주는 것:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{
          padding: 16,
          background: C.surface,
          borderRadius: 10,
          borderTop: `3px solid ${C.blue}`,
        }}>
          <div style={{ color: C.blue, fontWeight: 600, marginBottom: 8 }}>E_in 작아야</div>
          <div style={{ color: C.textDim, fontSize: "0.9em" }}>훈련 오차가 크면 일반화도 보장 못함</div>
        </div>
        <div style={{
          padding: 16,
          background: C.surface,
          borderRadius: 10,
          borderTop: `3px solid ${C.purple}`,
        }}>
          <div style={{ color: C.purple, fontWeight: 600, marginBottom: 8 }}>d_VC 작을수록</div>
          <div style={{ color: C.textDim, fontSize: "0.9em" }}>단순한 모델일수록 일반화 ↑</div>
        </div>
        <div style={{
          padding: 16,
          background: C.surface,
          borderRadius: 10,
          borderTop: `3px solid ${C.green}`,
        }}>
          <div style={{ color: C.green, fontWeight: 600, marginBottom: 8 }}>N 클수록</div>
          <div style={{ color: C.textDim, fontSize: "0.9em" }}>데이터 많을수록 gap ↓</div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
          📐 일반화 경계 계산기
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
              VC 차원 d_VC: <strong style={{ color: C.purple }}>{dVC}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={dVC}
              onChange={(e) => setDVC(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
              샘플 수 N: <strong style={{ color: C.green }}>{N}</strong>
            </label>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={N}
              onChange={(e) => setN(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
              신뢰도 1-δ: <strong style={{ color: C.orange }}>{((1 - delta) * 100).toFixed(0)}%</strong>
            </label>
            <input
              type="range"
              min={0.01}
              max={0.2}
              step={0.01}
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{
          padding: 24,
          background: C.surface,
          borderRadius: 12,
          textAlign: "center",
        }}>
          <div style={{ color: C.textDim, marginBottom: 8 }}>일반화 오차 상한</div>
          <div style={{ 
            color: genError > 1 ? C.red : C.accent, 
            fontSize: "2.5em", 
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}>
            {genError > 1 ? ">100%" : `± ${(genError * 100).toFixed(1)}%`}
          </div>
          <div style={{ color: C.textMuted, fontSize: "0.85em", marginTop: 8 }}>
            E_out ≤ E_in + {genError.toFixed(3)} (확률 {((1 - delta) * 100).toFixed(0)}%)
          </div>
        </div>

        {genError > 0.5 && (
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            background: `${C.orange}15`, 
            borderRadius: 8,
            color: C.orange,
            fontSize: "0.9em",
          }}>
            💡 Bound가 너무 느슨합니다. N을 늘리거나 d_VC를 줄여보세요. 
            N/d_VC 비율이 클수록 의미 있는 bound를 얻습니다.
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. PAC Learning
   ═══════════════════════════════════════════════════════════════ */
function PACLearningSection() {
  const [step, setStep] = useState(0);
  const [epsilon, setEpsilon] = useState(0.1);
  const [delta, setDelta] = useState(0.05);
  const [dVC, setDVC] = useState(10);

  // Sample complexity approximation
  const sampleComplexity = Math.ceil((dVC + Math.log(1 / delta)) / (epsilon * epsilon));

  return (
    <div>
      <SectionTitle subtitle="학습 가능성의 형식적 정의">
        6. PAC 학습 (Probably Approximately Correct)
      </SectionTitle>

      <Box color={C.purple} label="PAC 학습의 의미">
        <strong style={{ color: C.yellow }}>P</strong>robably (확률 1-δ 이상으로) 
        <strong style={{ color: C.yellow }}> A</strong>pproximately (오차 ε 이내로) 
        <strong style={{ color: C.yellow }}> C</strong>orrect (올바른 답)
      </Box>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        주어진 ε(허용 오차)과 δ(실패 확률)를 달성하려면 샘플이 <strong>최소 몇 개</strong> 필요할까요?
      </Question>

      <Answer visible={step >= 1}>
        이것이 <strong style={{ color: C.accent }}>샘플 복잡도(Sample Complexity)</strong>입니다:
        <MathBlock>
          {'N = O\\left(\\frac{d_{\\text{VC}} + \\ln(1/\\delta)}{\\epsilon^2}\\right)'}
        </MathBlock>
        이 식에서:
        <br />• ε을 절반으로 줄이면 → N은 <strong style={{ color: C.orange }}>4배</strong> 필요
        <br />• d_VC가 2배면 → N도 대략 <strong style={{ color: C.purple }}>2배</strong> 필요
      </Answer>

      {step >= 1 && (
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 28,
          marginTop: 24,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
            🧮 샘플 복잡도 계산기
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div>
              <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                허용 오차 ε: <strong style={{ color: C.orange }}>{(epsilon * 100).toFixed(0)}%</strong>
              </label>
              <input
                type="range"
                min={0.01}
                max={0.3}
                step={0.01}
                value={epsilon}
                onChange={(e) => setEpsilon(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                실패 확률 δ: <strong style={{ color: C.red }}>{(delta * 100).toFixed(0)}%</strong>
              </label>
              <input
                type="range"
                min={0.01}
                max={0.2}
                step={0.01}
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ color: C.textDim, fontSize: "0.85em", display: "block", marginBottom: 8 }}>
                VC 차원: <strong style={{ color: C.purple }}>{dVC}</strong>
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={dVC}
                onChange={(e) => setDVC(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{
            padding: 24,
            background: C.surface,
            borderRadius: 12,
            textAlign: "center",
          }}>
            <div style={{ color: C.textDim, marginBottom: 8 }}>필요한 최소 샘플 수</div>
            <div style={{ 
              color: C.accent, 
              fontSize: "2.5em", 
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
            }}>
              N ≥ {sampleComplexity.toLocaleString()}
            </div>
            <div style={{ color: C.textMuted, fontSize: "0.85em", marginTop: 8 }}>
              {((1 - delta) * 100).toFixed(0)}% 확률로 오차 {(epsilon * 100).toFixed(0)}% 이내 보장
            </div>
          </div>
        </div>
      )}

      {step >= 1 && (
        <Box color={C.green} label="PAC 학습의 핵심 정리">
          <strong style={{ color: C.text }}>VC 차원 유한 ↔ PAC 학습 가능</strong>
          <br /><br />
          VC 차원의 유한성은 PAC 학습 가능성의 <strong style={{ color: C.accent }}>필요충분조건</strong>입니다.
        </Box>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. Rademacher Complexity
   ═══════════════════════════════════════════════════════════════ */
function RademacherSection() {
  const [step, setStep] = useState(0);
  const [randomLabels, setRandomLabels] = useState([1, -1, 1, -1, 1, -1]);
  const [hypothesisType, setHypothesisType] = useState("constant"); // "constant", "linear", "all"

  const generateRandomLabels = () => {
    setRandomLabels(Array.from({ length: 6 }, () => Math.random() > 0.5 ? 1 : -1));
  };

  // Calculate correlation with random labels
  const getCorrelation = () => {
    if (hypothesisType === "constant") {
      // Constant function h(x) = 1
      const sum = randomLabels.reduce((a, b) => a + b, 0);
      return sum / randomLabels.length;
    } else if (hypothesisType === "all") {
      // Perfect match possible
      return 1;
    } else {
      // Linear: can partially fit
      return 0.5 + Math.random() * 0.3;
    }
  };

  const correlation = getCorrelation();

  return (
    <div>
      <SectionTitle subtitle="데이터 의존적 복잡도 측도">
        7. 라데마허 복잡도 (Rademacher Complexity)
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        VC 차원의 한계: 데이터 분포와 무관하게 <strong style={{ color: C.text }}>최악의 경우</strong>를 고려합니다.
        실제 데이터가 특정 구조를 가지고 있다면, 더 정밀한 bound를 얻을 수 있지 않을까요?
      </p>

      <Box color={C.orange} label="라데마허 복잡도의 핵심 질문">
        가설 공간이 <strong style={{ color: C.accent }}>무작위 레이블</strong>을 얼마나 잘 맞출 수 있는가?
        <br /><br />
        무작위 레이블을 잘 맞출 수 있다 = 노이즈를 외울 수 있다 = <strong style={{ color: C.red }}>과적합 위험</strong>
      </Box>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        만약 가설 공간이 상수 함수 하나만 포함한다면 (항상 +1 출력), 
        무작위 레이블과의 상관관계는 어떻게 될까요?
      </Question>

      <Answer visible={step >= 1}>
        각 레이블이 +1 또는 -1일 확률이 50%이므로, 상수 함수와의 상관관계 기댓값은 <strong style={{ color: C.accent }}>0</strong>입니다.
        <br /><br />
        반면, 모든 가능한 함수를 포함하는 가설 공간은 어떤 레이블 패턴이든 완벽히 맞출 수 있어서 상관관계가 <strong style={{ color: C.red }}>1</strong>이 됩니다.
      </Answer>

      {step >= 1 && (
        <>
          {/* Interactive Demo */}
          <div style={{
            background: C.surfaceAlt,
            borderRadius: 16,
            padding: 28,
            marginTop: 24,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
              🎲 무작위 레이블 맞추기 시뮬레이션
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 12 }}>가설 공간 선택:</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { id: "constant", label: "상수 함수", color: C.green },
                  { id: "linear", label: "선형 분류기", color: C.blue },
                  { id: "all", label: "모든 함수", color: C.red },
                ].map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHypothesisType(h.id)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: hypothesisType === h.id ? `${h.color}20` : C.surface,
                      border: `1.5px solid ${hypothesisType === h.id ? h.color : C.border}`,
                      borderRadius: 8,
                      color: hypothesisType === h.id ? h.color : C.textDim,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9em",
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 12 }}>무작위 레이블 (σ):</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {randomLabels.map((l, i) => (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: l === 1 ? `${C.blue}30` : `${C.red}30`,
                        border: `2px solid ${l === 1 ? C.blue : C.red}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: l === 1 ? C.blue : C.red,
                        fontWeight: 700,
                      }}
                    >
                      {l === 1 ? "+" : "−"}
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateRandomLabels}
                  style={{
                    padding: "10px 16px",
                    background: `${C.yellow}20`,
                    border: `1px solid ${C.yellow}40`,
                    borderRadius: 8,
                    color: C.yellow,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.9em",
                  }}
                >
                  🎲 새로운 무작위 레이블
                </button>
              </div>

              <div style={{
                padding: 20,
                background: C.surface,
                borderRadius: 12,
                textAlign: "center",
              }}>
                <div style={{ color: C.textDim, marginBottom: 8 }}>최대 상관관계</div>
                <div style={{ 
                  color: hypothesisType === "all" ? C.red : hypothesisType === "constant" ? C.green : C.blue, 
                  fontSize: "2em", 
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}>
                  {hypothesisType === "constant" ? "≈ 0" : hypothesisType === "all" ? "1.00" : "~0.5-0.8"}
                </div>
                <div style={{ color: C.textMuted, fontSize: "0.85em", marginTop: 8 }}>
                  {hypothesisType === "constant" && "노이즈를 맞출 수 없음 → 낮은 복잡도"}
                  {hypothesisType === "linear" && "부분적으로 맞춤 → 중간 복잡도"}
                  {hypothesisType === "all" && "완벽히 맞춤 → 높은 복잡도 (과적합 위험)"}
                </div>
              </div>
            </div>
          </div>

          <Box color={C.accent} label="라데마허 복잡도 기반 일반화 경계">
            <MathBlock>
              {'E_{\\text{out}}(g) \\leq E_{\\text{in}}(g) + 2\\hat{R}_S(\\mathcal{H}) + 3\\sqrt{\\frac{\\ln(2/\\delta)}{2N}}'}
            </MathBlock>
            핵심 차이: R̂_S(H)는 <strong style={{ color: C.green }}>실제 데이터 S에 의존</strong>합니다!
            <br /><br />
            데이터가 구조화되어 있으면 → 라데마허 복잡도 ↓ → 더 tight한 bound
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. Summary
   ═══════════════════════════════════════════════════════════════ */
function Summary() {
  return (
    <div>
      <SectionTitle subtitle="전체 흐름 정리">
        요약: 학습 가능성의 조건
      </SectionTitle>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            { title: "확률 부등식", desc: "마르코프 → 체비셰프 → Hoeffding", color: C.blue, detail: "기댓값 → 분산 → 유계 조건 활용" },
            { title: "Union Bound", desc: "단일 가설 → 다중 가설", color: C.orange, detail: "M개 가설에 대한 동시 보장" },
            { title: "성장 함수 & VC 차원", desc: "가설 공간의 실효적 크기", color: C.purple, detail: "Shatter 가능한 최대 점 수" },
            { title: "VC 일반화 경계", desc: "E_out ≤ E_in + O(√(d_VC/N))", color: C.green, detail: "복잡도-데이터 트레이드오프" },
            { title: "PAC 학습", desc: "VC 유한 ↔ 학습 가능", color: C.yellow, detail: "샘플 복잡도: O(d_VC/ε²)" },
            { title: "라데마허 복잡도", desc: "데이터 의존적 복잡도", color: C.accent, detail: "실제 분포의 구조를 반영" },
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
          VC 차원이 유한한 가설 공간은, 충분한 데이터가 있으면, 높은 확률로 좋은 일반화를 보장받습니다.
        </strong>
        <br /><br />
        이것이 기계학습의 이론적 토대입니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function FeasibilityOfLearningBlog() {
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
          <ProbabilityInequalities />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <UnionBoundSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <GrowthFunctionSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <VCDimensionSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <VCBoundSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <PACLearningSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <RademacherSection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <Summary />
        </section>
      </article>
    </div>
  );
}
