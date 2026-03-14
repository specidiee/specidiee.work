'use client';

import { useState, useCallback } from "react";

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

/* ─── Code Block ─── */
const CodeBlock = ({ children }) => (
  <div
    style={{
      background: "#0a0a1a",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "1rem 1.25rem",
      margin: "1rem 0",
      fontFamily: "var(--font-mono)",
      fontSize: "0.85rem",
      color: C.accent,
      lineHeight: 1.6,
      overflowX: "auto",
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

/* ─── Interactive panel wrapper ─── */
const Panel = ({ children }) => (
  <div style={{
    background: C.surfaceAlt,
    borderRadius: 16,
    padding: "1.5rem",
    border: `1px solid ${C.border}`,
    margin: "2rem 0",
  }}>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION 1 — 운영체제가 없다면?
   ══════════════════════════════════════════════════════ */

function RolesSection() {
  const [q1, setQ1] = useState(false);

  return (
    <section>
      <SectionTitle subtitle="추상화 제공자와 자원 관리자">
        1. 운영체제가 없다면?
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        운영체제가 없는 세상을 상상해봅시다. 프로그래머가 파일 하나를 읽으려면
        디스크 컨트롤러의 <strong style={{ color: C.accent }}>레지스터 주소</strong>를 알아야 하고,
        정확한 <strong style={{ color: C.accent }}>프로토콜</strong>에 따라 명령을 보내야 하며,
        디스크 종류가 바뀌면 코드를 처음부터 다시 작성해야 합니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        여기에 여러 프로그램이 동시에 실행된다면 문제는 더 심각해집니다.
        프로그램 A가 쓴 메모리를 B가 덮어쓸 수 있고, 하나가 CPU를 독점하면
        나머지는 영원히 실행되지 못합니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        이로부터 운영체제의 두 가지 핵심 역할이 도출됩니다:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "1.5rem 0" }}>
        <div style={{
          padding: "1rem 1.25rem",
          background: `${C.blue}12`,
          border: `1px solid ${C.blue}30`,
          borderRadius: 10,
        }}>
          <strong style={{ color: C.blue }}>1. 확장된 기계 (Extended Machine)</strong>
          <p style={{ color: C.textDim, margin: "0.5rem 0 0", lineHeight: 1.7 }}>
            하드웨어의 복잡한 세부사항을 감추고, 깔끔하고 일관된 인터페이스를 제공합니다.
          </p>
        </div>
        <div style={{
          padding: "1rem 1.25rem",
          background: `${C.green}12`,
          border: `1px solid ${C.green}30`,
          borderRadius: 10,
        }}>
          <strong style={{ color: C.green }}>2. 자원 관리자 (Resource Manager)</strong>
          <p style={{ color: C.textDim, margin: "0.5rem 0 0", lineHeight: 1.7 }}>
            CPU, 메모리, 디스크 등을 여러 프로그램 사이에서 공정하고 효율적으로 분배합니다.
          </p>
        </div>
      </div>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        운영체제가 없이 여러 프로그램이 동시에 돌아간다면 어떤 문제가 생길까?
      </Question>
      <Answer visible={q1}>
        프로그램 A가 쓴 메모리를 B가 덮어쓸 수 있고, 하나가 CPU를 독점하면 나머지는 실행되지 못합니다.
        이 <strong style={{ color: C.accent }}>충돌과 경쟁을 중재할 자원 관리자</strong>가 필요합니다.
      </Answer>

      <Box color={C.accent} label="핵심 정리">
        <span style={{ color: C.textDim }}>
          운영체제의 두 가지 모자: (1) 하드웨어의 복잡한 디테일을 감추는{' '}
          <strong style={{ color: C.accent }}>추상화 제공자</strong>, (2) 여러 프로그램 사이에서
          자원을 나누는 <strong style={{ color: C.accent }}>자원 관리자</strong>.
        </span>
      </Box>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 2 — 세 가지 테마
   ══════════════════════════════════════════════════════ */

const themeCards = [
  {
    name: "가상화",
    nameEn: "Virtualization",
    color: C.blue,
    icon: "V",
    desc: "각 프로그램에게 \"자기만의 전용 자원이 있는 것 같은 환상\"을 제공합니다. CPU를 빠르게 번갈아 나눠주면서 각 프로그램은 혼자 CPU를 쓴다고 느끼고, 메모리도 마찬가지입니다.",
    roles: "추상화 + 자원 관리 둘 다",
    mechanisms: ["프로세스 스케줄링", "가상 메모리", "컨텍스트 스위칭"],
  },
  {
    name: "동시성",
    nameEn: "Concurrency",
    color: C.orange,
    icon: "C",
    desc: "여러 활동이 동시에 일어날 때의 고유한 문제들을 다룹니다. 두 프로그램이 같은 데이터를 동시에 수정하면 결과가 예측 불가능해지는 등의 이슈가 발생합니다.",
    roles: "주로 자원 관리",
    mechanisms: ["락 (Lock)", "세마포어 (Semaphore)", "조건 변수"],
  },
  {
    name: "영속성",
    nameEn: "Persistence",
    color: C.green,
    icon: "P",
    desc: "메모리는 휘발성 — 전원이 꺼지면 사라집니다. 사용자의 데이터가 살아남으려면 파일 시스템이 필요하고, 저장 도중 전원이 나가도 데이터가 망가지지 않도록 보호해야 합니다.",
    roles: "추상화 + 자원 관리 둘 다",
    mechanisms: ["파일 시스템", "저널링", "RAID"],
  },
];

function ThreeThemesSection() {
  const [q2, setQ2] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section>
      <SectionTitle subtitle="OSTEP의 프레임워크: 가상화, 동시성, 영속성">
        2. OS를 이해하는 세 가지 테마
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        운영체제는 방대한 소프트웨어이지만, OSTEP은 이를{' '}
        <strong style={{ color: C.accent }}>가상화(Virtualization)</strong>,{' '}
        <strong style={{ color: C.accent }}>동시성(Concurrency)</strong>,{' '}
        <strong style={{ color: C.accent }}>영속성(Persistence)</strong>이라는
        세 가지 테마로 조직합니다.
      </p>

      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          카드를 클릭하여 각 테마의 상세 내용을 확인하세요
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {themeCards.map((card, i) => (
            <button
              key={card.name}
              onClick={() => setActiveCard(activeCard === i ? null : i)}
              style={{
                flex: "1 1 140px",
                padding: "1.25rem 1rem",
                background: activeCard === i ? `${card.color}20` : C.surface,
                border: `1.5px solid ${activeCard === i ? card.color : C.border}`,
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `${card.color}20`,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.1rem",
                fontFamily: "var(--font-mono)",
                margin: "0 auto 8px",
              }}>
                {card.icon}
              </div>
              <div style={{ color: card.color, fontWeight: 700, fontSize: "0.95rem" }}>
                {card.name}
              </div>
              <div style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: 2 }}>
                {card.nameEn}
              </div>
            </button>
          ))}
        </div>

        {activeCard !== null && (
          <div style={{
            padding: "1.25rem",
            background: `${themeCards[activeCard].color}08`,
            border: `1px solid ${themeCards[activeCard].color}30`,
            borderRadius: 12,
            animation: "fadeIn 0.3s ease",
          }}>
            <p style={{ color: C.textDim, lineHeight: 1.8, margin: "0 0 1rem" }}>
              {themeCards[activeCard].desc}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: C.textMuted }}>관련 OS 역할: </span>
                <span style={{ color: themeCards[activeCard].color }}>{themeCards[activeCard].roles}</span>
              </div>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <span style={{ color: C.textMuted, fontSize: "0.85rem" }}>대표 메커니즘: </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {themeCards[activeCard].mechanisms.map((m) => (
                  <span key={m} style={{
                    padding: "4px 10px",
                    background: `${themeCards[activeCard].color}15`,
                    border: `1px solid ${themeCards[activeCard].color}30`,
                    borderRadius: 6,
                    color: themeCards[activeCard].color,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
        가상화는 단순히 복잡성을 감추는 것과 어떻게 다른가?
      </Question>
      <Answer visible={q2}>
        단순한 추상화는 인터페이스를 단순하게 만드는 것이고, 가상화는 거기에 더해{' '}
        <strong style={{ color: C.accent }}>&quot;전용 자원이 있는 것 같은 환상&quot;</strong>을
        만들어냅니다. 물리적으로 하나인 자원을 여러 개인 것처럼 보이게 하는 것이 핵심입니다.
      </Answer>

      <Box color={C.purple} label="주의 — 영속성은 OS 상태 복원이 아니다">
        <span style={{ color: C.textDim }}>
          영속성은 &quot;운영체제가 꺼졌다 켜져도 자기 상태를 복원한다&quot;는 뜻이 아닙니다.{' '}
          <strong style={{ color: C.purple }}>사용자의 데이터</strong>가 전원 차단 후에도 살아남도록
          파일 시스템을 통해 보장하는 것입니다.
        </span>
      </Box>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 3 — 인터럽트
   ══════════════════════════════════════════════════════ */

const interruptSteps = [
  { label: "프로그램 B 실행 중", mode: "사용자 모드", color: C.blue, desc: "CPU가 프로그램 B의 코드를 실행하고 있습니다." },
  { label: "디스크 완료 → 인터럽트 신호 발생", mode: "전환", color: C.yellow, desc: "디스크가 작업을 마치고 CPU에 전기 신호(인터럽트)를 보냅니다." },
  { label: "프로그램 B 상태 저장", mode: "커널 모드", color: C.red, desc: "CPU가 현재 실행 중이던 프로그램 B의 PC, 레지스터 등을 저장합니다." },
  { label: "인터럽트 종류 판별", mode: "커널 모드", color: C.red, desc: "어떤 장치가 인터럽트를 보냈는지(디스크? 키보드? 타이머?) 확인합니다." },
  { label: "ISR 실행 — 데이터 이동, 프로그램 A 준비 상태로", mode: "커널 모드", color: C.red, desc: "인터럽트 핸들러가 디스크 데이터를 메모리로 옮기고, 대기 중이던 프로그램 A를 준비 상태로 바꿉니다." },
  { label: "프로그램 B 상태 복원 → 실행 재개", mode: "사용자 모드", color: C.blue, desc: "저장했던 상태를 복원하고 프로그램 B가 중단된 지점부터 다시 실행됩니다." },
];

function InterruptSection() {
  const [q3, setQ3] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <section>
      <SectionTitle subtitle="CPU가 기다리지 않는 비결">
        3. 인터럽트
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        CPU와 디스크의 속도 차이는 <strong style={{ color: C.orange }}>수만~수십만 배</strong>에 달합니다.
        디스크가 데이터를 읽는 동안 CPU가 멈춰서 기다린다면 엄청난 낭비입니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.red }}>폴링(polling)</strong>은 CPU가 &quot;끝났어?&quot;를 반복적으로 확인하는
        방식입니다. 단순하지만 CPU를 낭비합니다.{' '}
        <strong style={{ color: C.green }}>인터럽트</strong>는 디스크가 작업을 마치면 CPU에게
        전기 신호를 보내는 방식입니다. CPU는 그때까지 다른 일을 할 수 있습니다.
      </p>

      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          인터럽트 처리 흐름 — 단계별 시각화
        </div>

        {/* CPU Status */}
        <div style={{
          padding: "1rem 1.25rem",
          background: `${interruptSteps[step].color}12`,
          border: `1px solid ${interruptSteps[step].color}40`,
          borderRadius: 10,
          marginBottom: "1rem",
          transition: "all 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: "0.7rem",
                fontWeight: 700,
                background: interruptSteps[step].color === C.blue ? `${C.blue}25` : interruptSteps[step].color === C.red ? `${C.red}25` : `${C.yellow}25`,
                color: interruptSteps[step].color,
                fontFamily: "var(--font-mono)",
              }}>
                {interruptSteps[step].mode}
              </span>
            </div>
            <span style={{ color: C.textMuted, fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
              단계 {step + 1} / {interruptSteps.length}
            </span>
          </div>
          <div style={{ color: C.text, fontWeight: 600, fontSize: "1.05rem", marginTop: 10 }}>
            {interruptSteps[step].label}
          </div>
          <p style={{ color: C.textDim, fontSize: "0.9rem", margin: "0.5rem 0 0", lineHeight: 1.7 }}>
            {interruptSteps[step].desc}
          </p>
        </div>

        {/* Timeline bar */}
        <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
          {interruptSteps.map((s, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                flex: 1,
                height: step === i ? 32 : 24,
                background: i <= step ? `${s.color}60` : `${s.color}15`,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: step === i ? `2px solid ${s.color}` : `1px solid transparent`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{
                fontSize: "0.6rem",
                color: i <= step ? C.text : C.textMuted,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: step === 0 ? C.surface : `${C.accent}15`,
              border: `1px solid ${step === 0 ? C.border : `${C.accent}40`}`,
              color: step === 0 ? C.textMuted : C.accent,
              cursor: step === 0 ? "default" : "pointer",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ← 이전
          </button>
          <button
            onClick={() => setStep(Math.min(interruptSteps.length - 1, step + 1))}
            disabled={step === interruptSteps.length - 1}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: step === interruptSteps.length - 1 ? C.surface : `${C.accent}15`,
              border: `1px solid ${step === interruptSteps.length - 1 ? C.border : `${C.accent}40`}`,
              color: step === interruptSteps.length - 1 ? C.textMuted : C.accent,
              cursor: step === interruptSteps.length - 1 ? "default" : "pointer",
              fontFamily: "inherit",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            다음 단계 →
          </button>
        </div>
      </Panel>

      <Question number={3} revealed={q3} onReveal={() => setQ3(true)}>
        CPU가 프로그램 B를 실행하고 있는데, 디스크 작업이 완료되었다는 것을 어떻게 알 수 있을까?
      </Question>
      <Answer visible={q3}>
        두 가지 방법이 있습니다.{' '}
        <strong style={{ color: C.red }}>폴링</strong>(CPU가 주기적으로 확인)과{' '}
        <strong style={{ color: C.green }}>인터럽트</strong>(디스크가 완료 시 CPU에 신호).
        폴링은 CPU 낭비가 심하고, 인터럽트는 추가 하드웨어가 필요하지만 CPU를 자유롭게 만듭니다.
      </Answer>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 4 — I/O 구조
   ══════════════════════════════════════════════════════ */

const ioModes = [
  {
    name: "폴링",
    cpuUtil: 15,
    cpuTimeline: [
      { type: "waste", label: "폴링 대기", width: 60 },
      { type: "work", label: "데이터 전송", width: 15 },
      { type: "work", label: "유용한 작업", width: 25 },
    ],
    diskTimeline: [
      { type: "disk", label: "디스크 작업", width: 60 },
      { type: "idle", label: "", width: 40 },
    ],
    desc: "CPU가 디스크 상태를 반복 확인합니다. 디스크 작업이 끝날 때까지 CPU는 다른 일을 할 수 없습니다.",
  },
  {
    name: "인터럽트",
    cpuUtil: 70,
    cpuTimeline: [
      { type: "work", label: "다른 작업 실행", width: 55 },
      { type: "waste", label: "데이터 전송", width: 15 },
      { type: "work", label: "유용한 작업", width: 30 },
    ],
    diskTimeline: [
      { type: "disk", label: "디스크 작업", width: 55 },
      { type: "idle", label: "인터럽트↑", width: 15 },
      { type: "idle", label: "", width: 30 },
    ],
    desc: "디스크 작업 중 CPU는 다른 프로그램을 실행합니다. 완료되면 인터럽트로 알림. 단, 데이터 전송은 CPU가 직접 수행합니다.",
  },
  {
    name: "DMA",
    cpuUtil: 92,
    cpuTimeline: [
      { type: "work", label: "다른 작업 실행", width: 55 },
      { type: "work", label: "계속 실행", width: 20 },
      { type: "work", label: "유용한 작업", width: 25 },
    ],
    diskTimeline: [
      { type: "disk", label: "디스크 작업", width: 55 },
      { type: "dma", label: "DMA 전송", width: 20 },
      { type: "idle", label: "인터럽트↑", width: 25 },
    ],
    desc: "데이터 전송까지 전용 하드웨어(DMA 컨트롤러)가 처리합니다. CPU는 지시와 완료 인터럽트 수신만 하면 됩니다.",
  },
];

const timelineTypeColors = {
  work: C.green,
  waste: C.red,
  disk: C.blue,
  dma: C.purple,
  idle: "transparent",
};

function IOSection() {
  const [q4, setQ4] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const mode = ioModes[activeTab];

  return (
    <section>
      <SectionTitle subtitle="CPU의 부담을 점진적으로 줄여나가는 세 가지 방식">
        4. I/O 구조
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.accent }}>동기 I/O</strong>는 프로그래머에게 예측 가능성을 제공합니다 —{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>read()</span> 다음 줄에서 데이터가 반드시 준비되어 있습니다.{' '}
        <strong style={{ color: C.accent }}>비동기 I/O</strong>는 CPU 효율적이지만 코드가 복잡해집니다.
        실제로는 절충안을 사용합니다 — 프로그램에겐 동기로 보이지만 OS 내부에서는 비동기로 처리합니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        I/O 방식은 <strong style={{ color: C.orange }}>폴링 → 인터럽트 → DMA</strong>로 발전해왔으며,
        반복되는 패턴은 하나입니다:{' '}
        <strong style={{ color: C.accent }}>CPU가 무언가를 기다리지 않고 다른 일을 계속 실행하도록 하는 구조</strong>.
      </p>

      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          I/O 방식 비교 시뮬레이터
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          {ioModes.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                background: activeTab === i ? `${C.accent}20` : C.surface,
                border: `1.5px solid ${activeTab === i ? C.accent : C.border}`,
                color: activeTab === i ? C.accent : C.textMuted,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.9rem",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <p style={{ color: C.textDim, fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>
          {mode.desc}
        </p>

        {/* CPU Timeline */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ color: C.textMuted, fontSize: "0.75rem", fontWeight: 600, marginBottom: 4 }}>CPU</div>
          <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 36 }}>
            {mode.cpuTimeline.map((seg, i) => (
              <div
                key={i}
                style={{
                  width: `${seg.width}%`,
                  background: `${timelineTypeColors[seg.type]}30`,
                  borderRight: i < mode.cpuTimeline.length - 1 ? `1px solid ${C.bg}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  transition: "all 0.3s ease",
                }}
              >
                <span style={{
                  fontSize: "0.65rem",
                  color: timelineTypeColors[seg.type],
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {seg.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disk Timeline */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ color: C.textMuted, fontSize: "0.75rem", fontWeight: 600, marginBottom: 4 }}>디스크 / DMA</div>
          <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 36 }}>
            {mode.diskTimeline.map((seg, i) => (
              <div
                key={i}
                style={{
                  width: `${seg.width}%`,
                  background: seg.type === "idle" ? `${C.textMuted}10` : `${timelineTypeColors[seg.type]}30`,
                  borderRight: i < mode.diskTimeline.length - 1 ? `1px solid ${C.bg}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                }}
              >
                <span style={{
                  fontSize: "0.65rem",
                  color: seg.type === "idle" ? C.textMuted : timelineTypeColors[seg.type],
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {seg.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend + CPU Util */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { color: C.green, label: "CPU 유용한 작업" },
              { color: C.red, label: "CPU 대기(낭비)" },
              { color: C.blue, label: "디스크 작업" },
              { color: C.purple, label: "DMA 전송" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: `${l.color}60` }} />
                <span style={{ fontSize: "0.7rem", color: C.textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{
            padding: "4px 12px",
            borderRadius: 6,
            background: `${C.green}15`,
            border: `1px solid ${C.green}30`,
          }}>
            <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>CPU 활용률: </span>
            <span style={{ color: C.green, fontWeight: 700, fontSize: "0.9rem", fontFamily: "var(--font-mono)" }}>
              {mode.cpuUtil}%
            </span>
          </div>
        </div>
      </Panel>

      <Question number={4} revealed={q4} onReveal={() => setQ4(true)}>
        동기 I/O가 비효율적인데 왜 존재하는가?
      </Question>
      <Answer visible={q4}>
        프로그래머 입장에서의 <strong style={{ color: C.accent }}>예측 가능성</strong>.{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>read()</span> 다음 줄에서 데이터가 반드시
        준비되어 있다고 확신할 수 있습니다. 비동기는 콜백, 상태 머신 등 코드 복잡도가 급증합니다.
      </Answer>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 5 — 이중 모드와 시스템 콜
   ══════════════════════════════════════════════════════ */

const execFlowSteps = [
  { label: "셸에서 명령 입력", mode: "user", detail: "사용자가 셸에 프로그램 실행 명령을 입력합니다.", transition: null },
  { label: "fork() 시스템 콜", mode: "kernel", detail: "트랩을 통해 커널 모드 진입 → 새 프로세스를 생성합니다.", transition: "trap" },
  { label: "사용자 모드 복귀", mode: "user", detail: "fork()가 완료되면 사용자 모드로 돌아옵니다.", transition: "return" },
  { label: "exec() 시스템 콜", mode: "kernel", detail: "트랩을 통해 커널 모드 진입 → 프로그램을 메모리에 로드합니다.", transition: "trap" },
  { label: "프로그램 실행", mode: "user", detail: "로드된 프로그램이 사용자 모드에서 실행됩니다.", transition: "return" },
  { label: "read() 시스템 콜 (트랩)", mode: "kernel", detail: "파일 읽기를 위해 트랩 → 커널 모드 진입 → 디스크 요청 → 프로세스 대기.", transition: "trap" },
  { label: "디스크 완료 인터럽트", mode: "kernel", detail: "디스크 작업 완료 후 하드웨어 인터럽트 발생 → 커널이 데이터를 전달합니다.", transition: "interrupt" },
  { label: "프로그램 계속 실행", mode: "user", detail: "데이터가 준비되어 프로그램이 사용자 모드에서 계속 실행됩니다.", transition: "return" },
  { label: "exit() 시스템 콜", mode: "kernel", detail: "트랩을 통해 커널 모드 진입 → 프로세스를 종료합니다.", transition: "trap" },
  { label: "부모 프로세스(셸) wait()로 회수", mode: "user", detail: "셸이 자식 프로세스의 종료를 확인하고 자원을 회수합니다.", transition: "return" },
];

function DualModeSection() {
  const [q5, setQ5] = useState(false);

  return (
    <section>
      <SectionTitle subtitle="왜 아무 프로그램이나 하드웨어를 만지면 안 되는가">
        5. 이중 모드와 시스템 콜
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        인터럽트 핸들러가 하는 일 — 상태 저장, 데이터 이동, 실행 상태 변경 — 은 모두{' '}
        <strong style={{ color: C.red }}>특권적 작업</strong>입니다. 일반 프로그램이 이런 작업을
        할 수 있다면 시스템 전체가 위험해집니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.accent }}>이중 모드</strong>: CPU 내부의 모드 비트가 해결책입니다.{' '}
        <strong style={{ color: C.red }}>커널 모드(0)</strong>에서는 모든 명령어와 하드웨어 접근이 가능하고,{' '}
        <strong style={{ color: C.blue }}>사용자 모드(1)</strong>에서는 제한된 명령어만 실행할 수 있습니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        프로그램이 커널 서비스를 요청하려면{' '}
        <strong style={{ color: C.accent }}>트랩(trap)</strong>이라는 특별한 CPU 명령어(
        <span style={{ fontFamily: "var(--font-mono)" }}>syscall</span>)를 실행합니다.
        이것이 <strong style={{ color: C.accent }}>시스템 콜</strong> — 사용자 프로그램이 커널 서비스를
        요청하는 <strong style={{ color: C.yellow }}>유일한 공식 통로</strong>입니다.
      </p>

      <div style={{
        display: "flex", gap: 12, margin: "1.5rem 0", flexWrap: "wrap",
      }}>
        <div style={{
          flex: "1 1 200px",
          padding: "1rem",
          background: `${C.accent}08`,
          border: `1px solid ${C.accent}25`,
          borderRadius: 10,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>공통점</div>
          <p style={{ color: C.textDim, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            트랩과 하드웨어 인터럽트 모두 커널 모드 전환을 유발하고,
            상태 저장 → 핸들러 → 복귀라는 동일한 처리 구조를 따릅니다.
          </p>
        </div>
        <div style={{
          flex: "1 1 200px",
          padding: "1rem",
          background: `${C.orange}08`,
          border: `1px solid ${C.orange}25`,
          borderRadius: 10,
        }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>차이점</div>
          <p style={{ color: C.textDim, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            트랩은 <strong style={{ color: C.blue }}>동기적</strong>(프로그래머가 의도적으로 발생),
            하드웨어 인터럽트는 <strong style={{ color: C.red }}>비동기적</strong>(예측 불가능한 시점에 발생).
          </p>
        </div>
      </div>

      {/* Program execution flow diagram */}
      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1.25rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          프로그램 실행 흐름 — 셸에서 실행 → 종료
        </div>

        <div style={{ position: "relative" }}>
          {execFlowSteps.map((s, i) => (
            <div key={i} style={{ display: "flex", marginBottom: i < execFlowSteps.length - 1 ? 0 : 0 }}>
              {/* Mode indicator (left) */}
              <div style={{
                width: 80,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 12,
              }}>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: s.mode === "kernel" ? C.red : C.blue,
                  fontFamily: "var(--font-mono)",
                  textAlign: "right",
                }}>
                  {s.mode === "kernel" ? "커널" : "사용자"}
                </span>
              </div>

              {/* Timeline line + dot */}
              <div style={{
                width: 24,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                {/* Transition arrow */}
                {s.transition && (
                  <div style={{
                    width: 2,
                    height: 20,
                    background: s.transition === "interrupt"
                      ? `repeating-linear-gradient(to bottom, ${C.yellow} 0px, ${C.yellow} 4px, transparent 4px, transparent 8px)`
                      : s.transition === "trap"
                        ? `${C.accent}`
                        : `${C.textMuted}40`,
                  }} />
                )}
                {!s.transition && i > 0 && (
                  <div style={{ width: 2, height: 20, background: `${C.textMuted}40` }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: s.mode === "kernel" ? `${C.red}40` : `${C.blue}40`,
                  border: `2px solid ${s.mode === "kernel" ? C.red : C.blue}`,
                  flexShrink: 0,
                }} />
                {/* Line below */}
                {i < execFlowSteps.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 8, background: `${C.textMuted}25` }} />
                )}
              </div>

              {/* Content (right) */}
              <div style={{
                flex: 1,
                padding: "4px 0 16px 12px",
              }}>
                <div style={{
                  padding: "8px 12px",
                  background: s.mode === "kernel" ? `${C.red}08` : `${C.blue}08`,
                  border: `1px solid ${s.mode === "kernel" ? `${C.red}20` : `${C.blue}20`}`,
                  borderRadius: 8,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}>
                    <span style={{
                      color: s.mode === "kernel" ? C.red : C.blue,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}>
                      {s.label}
                    </span>
                    {s.transition === "trap" && (
                      <span style={{
                        fontSize: "0.6rem",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${C.accent}15`,
                        color: C.accent,
                        fontWeight: 600,
                      }}>
                        TRAP
                      </span>
                    )}
                    {s.transition === "interrupt" && (
                      <span style={{
                        fontSize: "0.6rem",
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${C.yellow}15`,
                        color: C.yellow,
                        fontWeight: 600,
                      }}>
                        HW INTERRUPT
                      </span>
                    )}
                  </div>
                  <p style={{ color: C.textDim, fontSize: "0.8rem", margin: "4px 0 0", lineHeight: 1.6 }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 2, background: C.accent }} />
            <span style={{ fontSize: "0.7rem", color: C.textMuted }}>트랩 (시스템 콜, 동기)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 20, height: 2,
              background: `repeating-linear-gradient(to right, ${C.yellow} 0px, ${C.yellow} 4px, transparent 4px, transparent 8px)`,
            }} />
            <span style={{ fontSize: "0.7rem", color: C.textMuted }}>하드웨어 인터럽트 (비동기)</span>
          </div>
        </div>
      </Panel>

      <Question number={5} revealed={q5} onReveal={() => setQ5(true)}>
        프로그램은 사용자 모드에 있고 디스크에 직접 접근할 권한이 없는데, 어떻게 운영체제의 도움을 받을 수 있을까?
      </Question>
      <Answer visible={q5}>
        하드웨어가 인터럽트 신호를 전기적으로 보내는 것처럼, 소프트웨어도{' '}
        <strong style={{ color: C.accent }}>트랩</strong>이라는 신호를 발생시킬 수 있습니다. 특별한
        CPU 명령어(<span style={{ fontFamily: "var(--font-mono)" }}>syscall</span>)를 실행하면 자동으로
        커널 모드로 전환되어 운영체제 코드가 실행됩니다. 이것이{' '}
        <strong style={{ color: C.accent }}>시스템 콜</strong>입니다.
      </Answer>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 6 — 저장 장치 계층구조
   ══════════════════════════════════════════════════════ */

const storageLayers = [
  {
    name: "레지스터",
    capacity: "~1 KB",
    speed: "< 1 ns",
    cost: "가장 비쌈",
    color: C.red,
    widthPct: 30,
    desc: "CPU 칩 내부에 위치. 가장 빠르지만 용량이 극히 적습니다.",
  },
  {
    name: "캐시 (L1/L2/L3)",
    capacity: "수 MB",
    speed: "수 ns",
    cost: "매우 비쌈",
    color: C.orange,
    widthPct: 50,
    desc: "CPU 근처에 SRAM으로 구성. 자주 쓰는 데이터를 미리 복사해둡니다.",
  },
  {
    name: "RAM (주 메모리)",
    capacity: "수 GB ~ 수십 GB",
    speed: "~100 ns",
    cost: "중간",
    color: C.yellow,
    widthPct: 70,
    desc: "DRAM으로 구성. 실행 중인 프로그램의 코드와 데이터가 여기에 올라옵니다.",
  },
  {
    name: "SSD / HDD (디스크)",
    capacity: "수 TB",
    speed: "수십 μs (SSD) ~ 수 ms (HDD)",
    cost: "저렴",
    color: C.blue,
    widthPct: 90,
    desc: "영구 저장. 전원이 꺼져도 데이터가 유지됩니다.",
  },
];

function StorageSection() {
  const [q6, setQ6] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);

  return (
    <section>
      <SectionTitle subtitle="속도, 용량, 비용의 트레이드오프">
        6. 저장 장치 계층구조
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        빠르면서 큰 저장 장치를 만들 수 없는 이유는{' '}
        <strong style={{ color: C.orange }}>속도↑ 용량↓ 비용↑</strong>의 트레이드오프 때문입니다.
        그래서 컴퓨터는 여러 종류의 저장 장치를 계층적으로 조합합니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        이 계층이 효과적인 이유는 프로그램의 데이터 접근 패턴에{' '}
        <strong style={{ color: C.accent }}>지역성(locality)</strong>이 있기 때문입니다.{' '}
        <strong style={{ color: C.blue }}>시간적 지역성</strong>: 최근 접근한 데이터는 곧 다시 접근할 가능성이 높고 (예: for 루프),{' '}
        <strong style={{ color: C.green }}>공간적 지역성</strong>: 어떤 주소에 접근했으면 근처 주소도 곧 접근합니다 (예: 배열 순회).
      </p>

      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1.25rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          저장 장치 계층 피라미드 — 각 층을 클릭하세요
        </div>

        {/* Pyramid */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginBottom: "1.5rem",
        }}>
          {storageLayers.map((layer, i) => (
            <button
              key={layer.name}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
              style={{
                width: `${layer.widthPct}%`,
                minWidth: 120,
                padding: "12px 16px",
                background: activeLayer === i ? `${layer.color}25` : `${layer.color}10`,
                border: `1.5px solid ${activeLayer === i ? layer.color : `${layer.color}30`}`,
                borderRadius: i === 0 ? "12px 12px 4px 4px" : i === storageLayers.length - 1 ? "4px 4px 12px 12px" : 4,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "center",
                fontFamily: "inherit",
              }}
            >
              <span style={{ color: layer.color, fontWeight: 700, fontSize: "0.9rem" }}>
                {layer.name}
              </span>
            </button>
          ))}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            marginTop: 8,
          }}>
            <span style={{ fontSize: "0.7rem", color: C.textMuted }}>← 빠르고 비싸고 작음</span>
            <span style={{ fontSize: "0.7rem", color: C.textMuted }}>느리고 저렴하고 큼 →</span>
          </div>
        </div>

        {/* Detail */}
        {activeLayer !== null && (
          <div style={{
            padding: "1rem 1.25rem",
            background: `${storageLayers[activeLayer].color}08`,
            border: `1px solid ${storageLayers[activeLayer].color}30`,
            borderRadius: 10,
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ color: storageLayers[activeLayer].color, fontWeight: 700, marginBottom: 8 }}>
              {storageLayers[activeLayer].name}
            </div>
            <p style={{ color: C.textDim, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 10px" }}>
              {storageLayers[activeLayer].desc}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.8rem" }}>
              <div>
                <span style={{ color: C.textMuted }}>용량: </span>
                <span style={{ color: storageLayers[activeLayer].color, fontWeight: 600 }}>
                  {storageLayers[activeLayer].capacity}
                </span>
              </div>
              <div>
                <span style={{ color: C.textMuted }}>접근 시간: </span>
                <span style={{ color: storageLayers[activeLayer].color, fontWeight: 600 }}>
                  {storageLayers[activeLayer].speed}
                </span>
              </div>
              <div>
                <span style={{ color: C.textMuted }}>비용: </span>
                <span style={{ color: storageLayers[activeLayer].color, fontWeight: 600 }}>
                  {storageLayers[activeLayer].cost}
                </span>
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Question number={6} revealed={q6} onReveal={() => setQ6(true)}>
        레지스터만큼 빠르면서 디스크만큼 큰 저장 장치를 만들면 안 되나?
      </Question>
      <Answer visible={q6}>
        기술적으로 불가능합니다. 레지스터가 빠른 이유는 CPU 칩 안에{' '}
        <strong style={{ color: C.accent }}>트랜지스터 몇 개</strong>로 만들어졌기 때문이고,
        이 방식으로 용량을 늘리면 칩 면적과 비용이 급격히 상승합니다.
        속도, 용량, 비용을 동시에 만족시키는 장치는 현재 없습니다.
      </Answer>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 7 — 멀티프로그래밍과 멀티태스킹
   ══════════════════════════════════════════════════════ */

function MultiprogrammingSection() {
  const [q7, setQ7] = useState(false);

  return (
    <section>
      <SectionTitle subtitle="CPU를 놀리지 않고, 누구도 독점하지 못하게">
        7. 멀티프로그래밍과 멀티태스킹
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.blue }}>멀티프로그래밍</strong>: 여러 프로그램을 메모리에 동시에 올려놓고,
        하나가 I/O를 기다릴 때 다른 프로그램으로 전환합니다. 동기는{' '}
        <strong style={{ color: C.accent }}>CPU 활용률</strong>입니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        그러나 한계가 있습니다. 프로그램이 I/O 없이 계산만 하면 CPU를 독점할 수 있습니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.green }}>멀티태스킹(시분할)</strong>: 타이머 인터럽트로 강제 전환합니다.
        프로그램의 의지와 무관하게 일정 시간이 지나면 끊어줍니다. 동기는 CPU 활용률에 더해{' '}
        <strong style={{ color: C.accent }}>응답성</strong>과{' '}
        <strong style={{ color: C.accent }}>공정성</strong>입니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        타이머 인터럽트는 앞서 배운 하드웨어 인터럽트의 구체적인 예시입니다.
        충분히 빠른 전환(초당 수십~수백 번)으로 <strong style={{ color: C.orange }}>동시 실행의 환상</strong>을
        만들어내는 것이 CPU 가상화의 구체적 메커니즘입니다.
      </p>

      <Question number={7} revealed={q7} onReveal={() => setQ7(true)}>
        멀티프로그래밍만으로는 어떤 상황에서 문제가 생길까?
      </Question>
      <Answer visible={q7}>
        프로그램이 I/O 없이 <strong style={{ color: C.accent }}>순수 계산</strong>만 계속하면,
        자발적으로 CPU를 양보할 계기가 없어서 CPU를 독점합니다.
        다른 프로그램들은 영원히 실행되지 못할 수 있습니다.
      </Answer>

      <Box color={C.accent} label="멀티프로그래밍 vs 멀티태스킹">
        <span style={{ color: C.textDim }}>
          <strong style={{ color: C.blue }}>멀티프로그래밍</strong>: I/O 대기 시 전환 → CPU 활용률 향상.{' '}
          <strong style={{ color: C.green }}>멀티태스킹</strong>: 타이머 인터럽트로 강제 전환 → 활용률 +
          응답성 + 공정성 보장. 멀티태스킹은 멀티프로그래밍을 포함하는 더 발전된 형태.
        </span>
      </Box>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 8 — strace로 보는 시스템 콜
   ══════════════════════════════════════════════════════ */

const straceLines = [
  { text: 'execve("/usr/bin/echo", ["echo", "hello"], 0x7ffc...)', cat: "exec" },
  { text: 'brk(NULL)                                = 0x55a...', cat: "memory" },
  { text: 'arch_prctl(0x3001, 0x7fff...)             = -1 EINVAL', cat: "process" },
  { text: 'mmap(NULL, 8192, PROT_READ|PROT_WRITE, ...)  = 0x7f...', cat: "memory" },
  { text: 'access("/etc/ld.so.preload", R_OK)        = -1 ENOENT', cat: "library" },
  { text: 'openat(AT_FDCWD, "/etc/ld.so.cache", ...) = 3', cat: "library" },
  { text: 'fstat(3, {st_mode=S_IFREG|0644, ...})     = 0', cat: "library" },
  { text: 'mmap(NULL, 92599, PROT_READ, ...)          = 0x7f...', cat: "library" },
  { text: 'close(3)                                  = 0', cat: "library" },
  { text: 'openat(AT_FDCWD, "/lib/x86_64.../libc.so.6", ...) = 3', cat: "library" },
  { text: 'read(3, "\\177ELF\\2\\1\\1\\3...", 832)       = 832', cat: "library" },
  { text: 'pread64(3, "\\6\\0\\0\\0\\4\\0\\0\\0"..., 784, 64) = 784', cat: "library" },
  { text: 'pread64(3, "\\4\\0\\0\\0\\24\\0\\0\\0"..., 48, 848) = 48', cat: "library" },
  { text: 'pread64(3, "\\4\\0\\0\\0\\20\\0\\0\\0"..., 68, 896) = 68', cat: "library" },
  { text: 'fstat(3, {st_mode=S_IFREG|0755, ...})     = 0', cat: "library" },
  { text: 'mmap(NULL, 2228224, PROT_READ, ...)        = 0x7f...', cat: "library" },
  { text: 'mmap(0x7f..., 1540096, PROT_READ|PROT_EXEC, ...) = 0x7f...', cat: "library" },
  { text: 'mmap(0x7f..., 319488, PROT_READ, ...)      = 0x7f...', cat: "library" },
  { text: 'mmap(0x7f..., 24576, PROT_READ|PROT_WRITE, ...) = 0x7f...', cat: "library" },
  { text: 'mmap(0x7f..., 13316, PROT_READ|PROT_WRITE, ...) = 0x7f...', cat: "memory" },
  { text: 'close(3)                                  = 0', cat: "library" },
  { text: 'mprotect(0x7f..., 16384, PROT_READ)       = 0', cat: "memory" },
  { text: 'mprotect(0x55a..., 4096, PROT_READ)       = 0', cat: "memory" },
  { text: 'mprotect(0x7f..., 4096, PROT_READ)        = 0', cat: "memory" },
  { text: 'munmap(0x7f..., 92599)                     = 0', cat: "memory" },
  { text: 'getrandom("\\x1a\\xb4...", 8, GRND_NONBLOCK) = 8', cat: "process" },
  { text: 'brk(NULL)                                = 0x55a...', cat: "memory" },
  { text: 'brk(0x55a...)                             = 0x55a...', cat: "memory" },
  { text: 'set_tid_address(0x7f...)                  = 12345', cat: "process" },
  { text: 'set_robust_list(0x7f..., 24)              = 0', cat: "process" },
  { text: 'rseq(0x7f..., 0x20, 0, 0x53053053)       = 0', cat: "process" },
  { text: 'prlimit64(0, RLIMIT_STACK, NULL, ...)     = 0', cat: "process" },
  { text: 'fstat(1, {st_mode=S_IFCHR|0620, ...})     = 0', cat: "library" },
  { text: 'write(1, "hello\\n", 6)                    = 6', cat: "purpose" },
  { text: 'close(1)                                  = 0', cat: "library" },
  { text: 'close(2)                                  = 0', cat: "library" },
  { text: 'exit_group(0)                             = ?', cat: "exit" },
  { text: '+++ exited with 0 +++', cat: "exit" },
];

const categories = {
  exec: { label: "프로그램 실행", color: C.accent },
  library: { label: "라이브러리 로딩", color: C.blue },
  memory: { label: "메모리 관리", color: C.purple },
  process: { label: "프로세스/시스템", color: C.textDim },
  purpose: { label: "실제 목적", color: C.green },
  exit: { label: "종료", color: C.orange },
};

function StraceSection() {
  const [filters, setFilters] = useState({
    exec: true, library: true, memory: true, process: true, purpose: true, exit: true,
  });

  const toggleFilter = useCallback((cat) => {
    setFilters((f) => ({ ...f, [cat]: !f[cat] }));
  }, []);

  const visibleLines = straceLines.filter((l) => filters[l.cat]);
  const purposeCount = straceLines.filter((l) => l.cat === "purpose").length;
  const totalCount = straceLines.length;

  return (
    <section>
      <SectionTitle subtitle='echo hello 하나에 시스템 콜이 38개?'>
        8. strace로 보는 시스템 콜
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <span style={{ fontFamily: "var(--font-mono)" }}>strace echo hello</span>를 실행하면
        놀라운 결과를 볼 수 있습니다. 단순히 &quot;hello&quot;를 출력하는 프로그램인데,
        <strong style={{ color: C.accent }}> 38개의 시스템 콜</strong>이 발생합니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        크게 세 덩어리로 나뉩니다:{' '}
        <strong style={{ color: C.accent }}>execve</strong>(프로그램 실행 요청),{' '}
        <strong style={{ color: C.blue }}>라이브러리 로딩</strong>(openat, read, mmap, close 등으로 libc.so.6 로딩),{' '}
        그리고 <strong style={{ color: C.green }}>실제 목적</strong>(
        <span style={{ fontFamily: "var(--font-mono)" }}>write(1, &quot;hello\n&quot;, 6)</span> — 단 1개!).
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        운영체제가 &quot;프로그래머가{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>printf</span> 한 줄 쓰면 뒤에서
        수십 번의 시스템 콜을 처리한다&quot;는 추상화의 실체입니다.
      </p>

      <Panel>
        <div style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: C.textMuted,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          strace 출력 탐색기 — 카테고리별 필터링
        </div>

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                background: filters[key] ? `${cat.color}20` : C.surface,
                border: `1px solid ${filters[key] ? cat.color : C.border}`,
                color: filters[key] ? cat.color : C.textMuted,
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Strace output */}
        <div style={{
          background: "#0a0a1a",
          borderRadius: 8,
          padding: "0.75rem",
          maxHeight: 400,
          overflowY: "auto",
          border: `1px solid ${C.border}`,
        }}>
          {visibleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                lineHeight: 1.7,
                color: categories[line.cat].color,
                padding: "1px 6px",
                borderRadius: 3,
                background: line.cat === "purpose" ? `${C.green}12` : "transparent",
                fontWeight: line.cat === "purpose" ? 700 : 400,
                borderLeft: line.cat === "purpose" ? `3px solid ${C.green}` : "3px solid transparent",
              }}
            >
              {line.text}
            </div>
          ))}
          {visibleLines.length === 0 && (
            <div style={{ color: C.textMuted, fontSize: "0.8rem", textAlign: "center", padding: "2rem" }}>
              필터를 선택하여 시스템 콜을 확인하세요
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          padding: "8px 12px",
          background: C.surface,
          borderRadius: 8,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
            총 시스템 콜:{' '}
            <strong style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{totalCount}개</strong>
          </span>
          <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>
            실제 목적:{' '}
            <strong style={{ color: C.green, fontFamily: "var(--font-mono)" }}>
              {purposeCount}개 ({((purposeCount / totalCount) * 100).toFixed(1)}%)
            </strong>
          </span>
        </div>
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */

export default function OSIntroductionBlog() {
  return (
    <div
      style={{
        color: C.text,
        fontFamily: "var(--font-sans)",
        maxWidth: 900,
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      {/* Introduction */}
      <Box color={C.yellow} label="이 포스트의 핵심 메시지">
        <strong style={{ color: C.yellow, fontSize: "1.1rem" }}>
          운영체제는 하드웨어의 복잡성을 감추는 추상화 제공자이자,
          여러 프로그램 사이에서 자원을 나누는 자원 관리자이다.
        </strong>
        <br /><br />
        <span style={{ color: C.textDim }}>
          이 두 역할은 가상화, 동시성, 영속성이라는 세 테마로 조직됩니다.
          각 섹션에서 이 원리가 어떻게 구체적인 메커니즘으로 드러나는지 살펴보세요.
        </span>
      </Box>

      <RolesSection />
      <ThreeThemesSection />
      <InterruptSection />
      <IOSection />
      <DualModeSection />
      <StorageSection />
      <MultiprogrammingSection />
      <StraceSection />

      {/* Closing boxes */}
      <Box color={C.accent} label="마무리 — 전체 지도">
        <span style={{ color: C.textDim }}>
          운영체제는 <strong style={{ color: C.accent }}>추상화 제공자이자 자원 관리자</strong>이고,
          이를 <strong style={{ color: C.accent }}>가상화, 동시성, 영속성</strong>이라는 세 테마로 이해할 수 있습니다.
          컴퓨터는 <strong style={{ color: C.accent }}>인터럽트 기반 구조</strong>로 동작하며,
          트랩(동기)과 하드웨어 인터럽트(비동기)라는 두 경로로 커널에 진입합니다.
          I/O는 폴링 → 인터럽트 → DMA로 발전하면서 CPU 활용률을 높여왔고,
          저장 장치는 속도, 용량, 비용의 트레이드오프 때문에{' '}
          <strong style={{ color: C.accent }}>계층구조</strong>를 이루며{' '}
          <strong style={{ color: C.accent }}>지역성</strong> 덕분에 잘 작동합니다.{' '}
          <strong style={{ color: C.accent }}>이중 모드</strong>로 보호를 확보하고{' '}
          <strong style={{ color: C.accent }}>시스템 콜</strong>이 유일한 커널 진입 통로이며,{' '}
          <strong style={{ color: C.accent }}>멀티프로그래밍</strong>이 CPU 활용률을,{' '}
          <strong style={{ color: C.accent }}>멀티태스킹</strong>이 응답성과 공정성을 보장합니다.
        </span>
      </Box>
    </div>
  );
}
