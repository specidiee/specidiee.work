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
};

/* ─── math helper (KaTeX rendering) ─── */
const M = ({ children, block }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && children) {
      try {
        // Remove $ delimiters if present
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

/* ─── 1. Learning Problem Structure ─── */
function LearningProblemStructure() {
  const [hoveredPart, setHoveredPart] = useState(null);

  const parts = [
    {
      id: "X",
      label: "입력 공간",
      color: C.blue,
      x: 19,
      y: 28,
      desc: "가능한 모든 입력의 집합. 스팸 필터에서는 세상의 모든 이메일이 이에 해당합니다.",
      example: '예: 이메일 = (발신자, 제목, 본문, 첨부파일, ...)',
    },
    {
      id: "Y",
      label: "출력 공간",
      color: C.green,
      x: 19,
      y: 72,
      desc: "가능한 모든 출력(레이블)의 집합입니다.",
      example: "예: Y = { 스팸, 정상 }",
    },
    {
      id: "f",
      label: "목표 함수",
      color: C.red,
      x: 50,
      y: 20,
      desc: "우리가 알고 싶지만 직접 관찰할 수 없는 미지의 함수. 이것이 '정답'입니다.",
      example: "f : X → Y (관측 불가, 미지)",
    },
    {
      id: "H",
      label: "가설 집합",
      color: C.purple,
      x: 50,
      y: 70,
      desc: "우리가 고려하는 함수들의 집합. 이 안에서 f에 가장 가까운 g를 찾습니다.",
      example: "예: 선형 함수, k-CNF 등 제한된 함수 클래스",
    },
  ];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "1rem", marginTop: 0, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        1. 학습 문제의 구조
      </h2>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>
        기계학습의 핵심 질문은 단순합니다: <strong style={{ color: C.text, fontWeight: 600 }}>"유한한 데이터로 미지의 규칙을 배울 수 있는가?"</strong>
        {' '}이 질문에 답하려면, 학습 문제를 구성하는 네 가지 요소를 이해해야 합니다.
      </p>

      {/* Interactive diagram */}
      <div
        style={{
          position: "relative",
          background: C.surfaceAlt,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          height: 320,
          marginBottom: "2rem",
          marginTop: "2rem",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Central arrow: data -> algorithm -> g */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill={C.accent} opacity="0.9" />
            </marker>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={C.accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={C.accent} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Ellipse around training data */}
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
          {/* Arrow line */}
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
          {/* Algorithm label with background */}
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
            opacity="1"
            fontWeight="700"
          >
            학습 알고리즘 A
          </text>
        </svg>

        {/* Parts */}
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
              padding: "12px 20px",
              background: hoveredPart === p.id ? `${p.color}30` : `${p.color}15`,
              border: `1.5px solid ${hoveredPart === p.id ? p.color : p.color + "50"}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: hoveredPart === p.id ? 10 : 1,
              boxShadow: hoveredPart === p.id ? `0 0 24px ${p.color}40, 0 4px 12px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ color: p.color, fontWeight: 700, fontSize: "0.9em", display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'KaTeX_Math', serif", fontStyle: "italic", fontSize: "1.15em" }}>
                {p.id}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: "0.8em", fontWeight: 600 }}>
                {p.label}
              </span>
            </div>
          </div>
        ))}

        {/* Output: g */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "12px 20px",
            background: `${C.accent}20`,
            border: `2px solid ${C.accent}80`,
            borderRadius: 10,
            boxShadow: `0 0 20px ${C.accent}30`,
          }}
        >
          <div style={{ color: C.accent, fontWeight: 700, fontSize: "1.1em", fontFamily: "'KaTeX_Math', serif", fontStyle: "italic" }}>
            g ≈ f
          </div>
          <div style={{ color: C.textDim, fontSize: "0.75em", marginTop: 4 }}>학습 결과</div>
        </div>

        {/* Data input label */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            textAlign: "center",
          }}
        >
          <div style={{ color: C.textDim, fontSize: "0.8em", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            훈련 데이터
          </div>
          <div style={{ color: C.textMuted, fontSize: "0.7em", marginTop: 4, fontStyle: "italic", fontFamily: "'KaTeX_Math', serif" }}>
            (x₁, y₁), ..., (xₙ, yₙ)
          </div>
        </div>
      </div>

      {/* Hover detail */}
      <div
        style={{
          minHeight: 100,
          background: hoveredPart ? C.surfaceAlt : C.surface,
          borderRadius: 12,
          padding: 20,
          border: `1px solid ${hoveredPart ? C.accent + "30" : C.border}`,
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
        }}
      >
        {hoveredPart ? (
          (() => {
            const p = parts.find((x) => x.id === hoveredPart);
            return (
              <div style={{ animation: "fadeInUp 0.3s ease" }}>
                <div style={{ color: p.color, fontWeight: 700, marginBottom: 8, fontFamily: "var(--font-mono)", fontSize: "0.95em" }}>
                  {p.label}
                </div>
                <p style={{ color: C.text, lineHeight: 1.7, margin: "0 0 12px 0", fontSize: "0.95rem" }}>{p.desc}</p>
                <div
                  style={{
                    padding: "10px 14px",
                    background: `${p.color}15`,
                    borderRadius: 8,
                    fontSize: "0.88em",
                    color: p.color,
                    fontFamily: "var(--font-mono)",
                    borderLeft: `3px solid ${p.color}`,
                  }}
                >
                  {p.example}
                </div>
              </div>
            );
          })()
        ) : (
          <p style={{ color: C.textMuted, margin: 0, textAlign: "center", paddingTop: 16, fontSize: "0.9em" }}>
            위 다이어그램의 요소에 마우스를 올려 상세 설명을 확인하세요
          </p>
        )}
      </div>

      <Box color={C.blue} label="핵심 통찰">
        학습이란 <M>f</M>를 직접 관찰할 수 없는 상황에서, 유한한 훈련 데이터 <M>(x_1, f(x_1)), \ldots, (x_n, f(x_n))</M>만을 가지고
        가설 집합 <M>H</M> 안에서 <M>f</M>에 가장 가까운 함수 <M>g</M>를 찾는 과정입니다.
      </Box>
    </div>
  );
}

/* ─── 2. PAC Learnability ─── */
function PACLearnability() {
  const [h, setH] = useState(10);
  const animH = useAnimatedValue(h, 0.12);
  const errorBound = 1 / animH;
  const confidence = 1 - 1 / animH;

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "1rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        2. 학습 가능성의 정의 — PAC 학습
      </h2>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>
        Valiant(1984)는 "학습 가능하다"를 엄밀하게 정의했습니다.
        핵심 아이디어는 <strong style={{ color: C.text, fontWeight: 600 }}>확률적 보장</strong>입니다:
        완벽한 학습은 불가능하지만, "높은 확률로, 근사적으로 정확한" 학습은 가능합니다.
      </p>

      <Box color={C.accent} label="PAC 정의 (비형식적)">
        클래스 <M>{`\\mathcal{X}`}</M>가 <strong>학습 가능(learnable)</strong>하다 ⟺ 알고리즘 <M>A</M>가 존재하여,
        <strong> 모든</strong> 목표 함수 <M>{`f \\in \\mathcal{X}`}</M>와 <strong>모든</strong> 분포 <M>D</M>에 대해:
        <br />
        <M block>
          {`P[E_{\\text{out}}(g) \\leq h^{-1}] \\geq 1 - h^{-1}`}
        </M>
        를 만족하는 <M>g</M>를 다항 시간 내에 출력한다.
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8, margin: "16px 0" }}>
        매개변수 <M>h</M>는 정확도 요구 수준을 제어합니다.
        아래 슬라이더로 <M>h</M>를 조절하며 확률과 오차 한계가 어떻게 변하는지 확인해 보세요.
      </p>

      {/* Interactive slider */}
      <div
        style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: "1.75rem",
          border: `1px solid ${C.border}`,
          marginBottom: "2rem",
          marginTop: "2rem",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: C.textDim, fontSize: "0.85em", fontFamily: "var(--font-mono)", display: "block", marginBottom: 10 }}>
            정확도 매개변수 <span style={{ color: C.accent, fontWeight: 700 }}>h = {h}</span>
          </label>
          <input
            type="range"
            min={2}
            max={100}
            value={h}
            onChange={(e) => setH(+e.target.value)}
            style={{ width: "100%", accentColor: C.accent }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Confidence */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7em", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 600 }}>
              성공 확률 (Probably)
            </div>
            <div style={{ position: "relative", height: 130, display: "flex", alignItems: "flex-end", justifyContent: "center", background: `${C.green}08`, borderRadius: 8, padding: "8px 0" }}>
              <div
                style={{
                  width: 70,
                  height: `${confidence * 100}%`,
                  background: `linear-gradient(to top, ${C.green}, ${C.green}dd)`,
                  borderRadius: "10px 10px 0 0",
                  transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  minHeight: 6,
                  boxShadow: `0 0 20px ${C.green}40`,
                }}
              />
            </div>
            <div style={{ color: C.green, fontFamily: "var(--font-mono)", fontSize: "1.4em", fontWeight: 700, marginTop: 10 }}>
              ≥ {(confidence * 100).toFixed(1)}%
            </div>
            <div style={{ color: C.textMuted, fontSize: "0.75em", marginTop: 4, fontFamily: "var(--font-mono)" }}>
              1 − 1/{h}
            </div>
          </div>

          {/* Error bound */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7em", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 600 }}>
              오차 한계 (Approximately)
            </div>
            <div style={{ position: "relative", height: 130, display: "flex", alignItems: "flex-end", justifyContent: "center", background: `${C.red}08`, borderRadius: 8, padding: "8px 0" }}>
              <div
                style={{
                  width: 70,
                  height: `${errorBound * 100}%`,
                  background: `linear-gradient(to top, ${C.red}, ${C.red}dd)`,
                  borderRadius: "10px 10px 0 0",
                  transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  minHeight: 6,
                  boxShadow: `0 0 20px ${C.red}40`,
                }}
              />
            </div>
            <div style={{ color: C.red, fontFamily: "var(--font-mono)", fontSize: "1.4em", fontWeight: 700, marginTop: 10 }}>
              ≤ {(errorBound * 100).toFixed(1)}%
            </div>
            <div style={{ color: C.textMuted, fontSize: "0.75em", marginTop: 4, fontFamily: "var(--font-mono)" }}>
              1/{h}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            background: `${C.accent}08`,
            borderRadius: 8,
            border: `1px solid ${C.accent}20`,
            fontSize: "0.85em",
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

      <Box color={C.purple} label="왜 '확률적'인가?">
        확률은 두 곳에서 발생합니다.<br />
        첫째, 훈련 데이터의 무작위 샘플링(운이 나쁘면 편향된 데이터를 받을 수 있음).<br />
        둘째, 근사의 불완전성(<M>g</M>가 <M>f</M>와 모든 곳에서 일치하지는 않음).<br />
        <M>h</M>가 두 가지를 동시에 제어합니다.
      </Box>
    </div>
  );
}

/* ─── 3. Three Paradigms ─── */
function ThreeParadigms() {
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
      dataFlow: ["입력 x", "정답 y = f(x)", " 함수 g 학습"],
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
      dataFlow: ["입력 x만 제공", "(레이블 없음)", " 구조/패턴 발견"],
      key: "숨겨진 구조를 스스로 찾아낸다",
    },
    {
      name: "강화 학습",
      nameEn: "Reinforcement Learning",
      color: C.accent,
      icon: "🎮",
      info: "행동의 결과(보상)를 통해 학습합니다.",
      detail:
        "에이전트가 환경과 상호작용하며, 각 행동에 대한 보상 신호를 받습니다. 정답을 직접 알려주지 않지만, '얼마나 잘했는지'를 알려줍니다. 게임 AI, 로봇 제어, 자율 주행 등에 쓰입니다. 순차적 의사결정 문제입니다.",
      dataFlow: ["상태 s", "행동 a → 보상 r", " 최적 정책 π 학습"],
      key: "시행착오를 통해 최선의 전략을 찾는다",
    },
  ];

  const p = paradigms[active];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "1rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        3. 세 가지 학습 패러다임
      </h2>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>
        학습 문제는 알고리즘에 <strong style={{ color: C.text, fontWeight: 600 }}>어떤 정보가 주어지는가</strong>에 따라 세 가지로 나뉩니다.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", marginTop: "1.5rem" }}>
        {paradigms.map((par, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              flex: 1,
              padding: "16px 12px",
              background: active === i ? `${par.color}20` : C.surface,
              border: `1.5px solid ${active === i ? par.color : C.border}`,
              borderRadius: 12,
              cursor: "pointer",
              color: active === i ? par.color : C.textDim,
              fontWeight: active === i ? 700 : 500,
              fontSize: "0.88em",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "inherit",
              boxShadow: active === i ? `0 0 20px ${par.color}30` : "none",
            }}
            onMouseEnter={(e) => {
              if (active !== i) {
                e.currentTarget.style.background = C.surfaceAlt;
                e.currentTarget.style.borderColor = par.color + "60";
              }
            }}
            onMouseLeave={(e) => {
              if (active !== i) {
                e.currentTarget.style.background = C.surface;
                e.currentTarget.style.borderColor = C.border;
              }
            }}
          >
            <span style={{ fontSize: "1.4em", display: "block", marginBottom: 6 }}>{par.icon}</span>
            {par.name}
          </button>
        ))}
      </div>

      {/* Detail */}
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
          <span style={{ fontSize: "1.5em" }}>{p.icon}</span>
          <div>
            <h3 style={{ color: p.color, margin: 0, fontSize: "1.2em" }}>{p.name}</h3>
            <span style={{ color: C.textMuted, fontSize: "0.82em" }}>{p.nameEn}</span>
          </div>
        </div>

        <p style={{ color: C.text, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>{p.detail}</p>

        {/* Data flow visualization */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "20px 16px",
            background: `${p.color}12`,
            borderRadius: 12,
            marginBottom: 16,
            border: `1px solid ${p.color}30`,
          }}
        >
          {p.dataFlow.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  padding: "8px 16px",
                  background: `${p.color}20`,
                  borderRadius: 8,
                  fontSize: "0.82em",
                  color: p.color,
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  border: `1px solid ${p.color}40`,
                }}
              >
                {step}
              </span>
              {i < p.dataFlow.length - 1 && (
                <svg width="20" height="12" viewBox="0 0 20 12" style={{ flexShrink: 0 }}>
                  <defs>
                    <marker id={`arrow-${i}`} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill={p.color} opacity="0.7" />
                    </marker>
                  </defs>
                  <line x1="0" y1="6" x2="18" y2="6" stroke={p.color} strokeWidth="2" markerEnd={`url(#arrow-${i})`} opacity="0.6" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 16px",
            background: `${p.color}10`,
            borderRadius: 8,
            color: p.color,
            fontSize: "0.88em",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          핵심: {p.key}
        </div>
      </div>
    </div>
  );
}

/* ─── 4. Generalization ─── */
function Generalization() {
  const [numSamples, setNumSamples] = useState(5);
  const [hypSize, setHypSize] = useState(3);
  const [seed, setSeed] = useState(1);

  // Deterministic pseudo-random
  const rng = (s) => {
    let x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Generate "training points" and simulate E_in / E_out
  const eIn = Math.max(0, 0.3 - numSamples * 0.02 - hypSize * 0.01 + rng(seed + numSamples) * 0.05);
  const selectionBias = Math.max(0, (hypSize - 2) * 0.06 * Math.max(0.2, 1 - numSamples * 0.015));
  const eOut = Math.min(1, eIn + selectionBias + 0.02 + rng(seed + hypSize) * 0.03);
  const gap = eOut - eIn;

  const animEin = useAnimatedValue(eIn);
  const animEout = useAnimatedValue(eOut);

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "1rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        4. 일반화의 문제
      </h2>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>
        학습의 진짜 목표는 훈련 데이터에서 잘 하는 것이 아니라, <strong style={{ color: C.text, fontWeight: 600 }}>본 적 없는 데이터에서도 잘 하는 것</strong>입니다.
        이것이 일반화(generalization) 문제이며, <M>{`E_{\\text{in}}`}</M>과 <M>{`E_{\\text{out}}`}</M>의 차이로 측정됩니다.
      </p>

      <div
        style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: "1.75rem",
          border: `1px solid ${C.border}`,
          marginBottom: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ color: C.textDim, fontSize: "0.8em", display: "block", marginBottom: 10, fontFamily: "var(--font-mono)" }}>
              훈련 샘플 수 <span style={{ color: C.blue, fontWeight: 700 }}>N = {numSamples}</span>
            </label>
            <input
              type="range"
              min={2}
              max={30}
              value={numSamples}
              onChange={(e) => setNumSamples(+e.target.value)}
              style={{ width: "100%", accentColor: C.blue }}
            />
          </div>
          <div>
            <label style={{ color: C.textDim, fontSize: "0.8em", display: "block", marginBottom: 10, fontFamily: "var(--font-mono)" }}>
              가설 공간 크기 |H| <span style={{ color: C.purple, fontWeight: 700 }}>{["작음", "보통", "큼", "매우 큼", "무제한"][hypSize - 1]}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={hypSize}
              onChange={(e) => setHypSize(+e.target.value)}
              style={{ width: "100%", accentColor: C.purple }}
            />
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 50, height: 200, marginBottom: 20, padding: "20px 0", background: C.surface, borderRadius: 12 }}>
          {[
            { label: "E_in", value: animEin, color: C.green, desc: "훈련 오차" },
            { label: "E_out", value: animEout, color: C.red, desc: "일반화 오차" },
          ].map((bar) => (
            <div key={bar.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: `${Math.max(6, bar.value * 170)}px`,
                  background: `linear-gradient(to top, ${bar.color}, ${bar.color}cc)`,
                  borderRadius: "10px 10px 0 0",
                  transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 8,
                  boxShadow: `0 0 20px ${bar.color}40`,
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.8em", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {(bar.value * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ color: bar.color, fontSize: "0.9em", fontFamily: "var(--font-mono)", marginTop: 10, fontWeight: 700 }}>
                {bar.label}
              </div>
              <div style={{ color: C.textMuted, fontSize: "0.72em", marginTop: 3 }}>{bar.desc}</div>
            </div>
          ))}
        </div>

        {/* Gap indicator */}
        <div
          style={{
            textAlign: "center",
            padding: "12px",
            background: gap > 0.15 ? `${C.red}12` : `${C.green}12`,
            borderRadius: 8,
            border: `1px solid ${gap > 0.15 ? C.red : C.green}30`,
          }}
        >
          <span style={{ color: gap > 0.15 ? C.red : C.green, fontWeight: 600, fontSize: "0.9em" }}>
            일반화 격차: {(gap * 100).toFixed(1)}%
            {gap > 0.25 ? " — ⚠️ 과적합 위험!" : gap > 0.15 ? " — 주의 필요" : " — ✓ 양호"}
          </span>
        </div>
      </div>

      <Box color={C.red} label="선택 편향 (Selection Bias)">
        <M>H</M>에서 <M>{`E_{\\text{in}}`}</M>을 최소화하는 <M>g</M>를 <strong>선택</strong>하면, 그 <M>g</M>의 <M>{`E_{\\text{in}}`}</M>은 <M>{`E_{\\text{out}}`}</M>을 과소추정합니다.<br />
        100명이 동전을 10번 던져서 앞면이 가장 많은 사람을 뽑는 것과 같습니다 — 뽑힌 사람의 결과는 동전의 실제 확률을 반영하지 않습니다.<br />
        <M>|H|</M>가 클수록 이 편향이 심해집니다.
      </Box>

      <Box color={C.green} label="일반화의 두 가지 조건">
        ① <M>N</M>이 충분히 크면 큰 수의 법칙에 의해 <M>{`E_{\\text{in}} \\approx E_{\\text{out}}`}</M> (고정된 <M>g</M>에 대해).<br />
        ② <M>|H|</M>가 충분히 작으면 선택 편향이 제한되어, 선택된 <M>g</M>에 대해서도 <M>{`E_{\\text{in}} \\approx E_{\\text{out}}`}</M>.
      </Box>
    </div>
  );
}

/* ─── 5. Inductive Bias ─── */
function InductiveBias() {
  const [selectedH, setSelectedH] = useState(1);

  const hypotheses = [
    {
      name: "H = 모든 함수",
      risk: "높음",
      generalize: "불가능",
      color: C.red,
      icon: "∞",
      desc: "아무런 제한 없이 모든 가능한 함수를 고려합니다. 어떤 훈련 데이터든 완벽히 맞출 수 있지만, 일반화 보장은 전혀 없습니다. No Free Lunch 정리가 적용됩니다.",
      circles: [100],
    },
    {
      name: "H = 다항식 (차수 ≤ d)",
      risk: "중간",
      generalize: "가능 (조건부)",
      color: C.accent,
      icon: "xᵈ",
      desc: "다항식의 차수를 제한합니다. d가 작으면 표현력이 부족하고(과소적합), d가 크면 과적합 위험이 있습니다. 적절한 d를 선택하는 것이 핵심입니다.",
      circles: [60],
    },
    {
      name: "H = 선형 함수",
      risk: "낮음",
      generalize: "가능",
      color: C.green,
      icon: "ax+b",
      desc: "매우 제한된 가설 공간입니다. 선택 편향이 작아 일반화가 잘 되지만, 목표 함수 f가 비선형이면 근사 자체가 불가능합니다(높은 편향). 이것이 편향-분산 트레이드오프입니다.",
      circles: [25],
    },
  ];

  const sel = hypotheses[selectedH];

  return (
    <div>
      <h2 style={{ color: C.accent, fontSize: "2em", marginBottom: "1rem", marginTop: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        5. 귀납적 편향
      </h2>
      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "1rem" }}>
        학습이 가능하려면 <M>H</M>를 제한해야 합니다. 이 제한을 <strong style={{ color: C.text, fontWeight: 600 }}>귀납적 편향(inductive bias)</strong>이라 부릅니다.
        "어떤 종류의 함수가 답일 것이다"라는 사전 가정이며, 이것 없이는 일반화가 불가능합니다.
      </p>

      {/* H selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {hypotheses.map((hyp, i) => (
          <button
            key={i}
            onClick={() => setSelectedH(i)}
            style={{
              flex: "1 1 200px",
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
            onMouseEnter={(e) => {
              if (selectedH !== i) {
                e.currentTarget.style.background = C.surfaceAlt;
                e.currentTarget.style.borderColor = hyp.color + "60";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedH !== i) {
                e.currentTarget.style.background = C.surface;
                e.currentTarget.style.borderColor = C.border;
              }
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
        {/* Visual: nested circles showing H size */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, padding: "20px 0" }}>
          <div style={{ position: "relative", width: 220, height: 220 }}>
            {/* All functions */}
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
            {/* H */}
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
            {/* f dot */}
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
                animation: "pulse 2s ease-in-out infinite",
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

      <Box color={C.accent} label="No Free Lunch 정리">
        모든 가능한 목표 함수 <M>f</M>에 대해 평균적으로 잘 작동하는 학습 알고리즘은 존재하지 않습니다.<br />
        어떤 <M>f</M>에서 잘 하려면, 다른 <M>f</M>에서 성능을 포기해야 합니다.<br />
        <M>H</M>를 제한하는 것은 "이 종류의 <M>f</M>에 집중하겠다"는 명시적 선택입니다.
      </Box>

      <Box color={C.blue} label="오컴의 면도날">
        동일한 <M>{`E_{\\text{in}}`}</M>을 달성하는 여러 가설이 있을 때, <strong>더 단순한 가설을 선택하라</strong>.<br />
        단순한 <M>H</M>에서 찾은 <M>g</M>가 더 잘 일반화될 가능성이 높기 때문입니다.<br />
        이것은 MDL(최소 기술 길이) 원리와 깊이 연결됩니다.
      </Box>
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

      {/* Sections rendered as normal content */}
      <article>
        <section style={{ marginBottom: "4rem" }}>
          <LearningProblemStructure />
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <PACLearnability />
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <ThreeParadigms />
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <Generalization />
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <InductiveBias />
        </section>
      </article>
    </div>
  );
}
