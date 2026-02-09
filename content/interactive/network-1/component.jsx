'use client';

import { useState, useEffect, useRef } from "react";

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

/* ═══════════════════════════════════════════════════════════════
   1. Network Classification (LAN, MAN, WAN)
   ═══════════════════════════════════════════════════════════════ */
function NetworkClassification() {
  const [step, setStep] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(0);

  const networks = [
    {
      id: "LAN",
      name: "LAN",
      fullName: "Local Area Network",
      color: C.blue,
      icon: "🏠",
      range: "건물 / 사무실",
      speed: "높음 (1Gbps+)",
      latency: "매우 낮음 (<1ms)",
      management: "자체 관리",
      example: "가정 Wi-Fi, 사무실 네트워크",
      desc: "이더넷 케이블이나 Wi-Fi로 직접 연결할 수 있는 가까운 범위의 네트워크입니다.",
    },
    {
      id: "MAN",
      name: "MAN",
      fullName: "Metropolitan Area Network",
      color: C.purple,
      icon: "🏙️",
      range: "도시",
      speed: "중간",
      latency: "낮음",
      management: "ISP 또는 기관",
      example: "대학 캠퍼스 네트워크, 도시 공공망",
      desc: "도시 규모에서 여러 LAN을 연결하는 중간 규모의 네트워크입니다.",
    },
    {
      id: "WAN",
      name: "WAN",
      fullName: "Wide Area Network",
      color: C.green,
      icon: "🌍",
      range: "국가 / 대륙",
      speed: "상대적으로 낮음",
      latency: "높음 (10ms+)",
      management: "통신사 (ISP)",
      example: "인터넷, 기업 전용선",
      desc: "해저 케이블, 위성 등을 통해 전 세계를 연결하는 광역 네트워크입니다.",
    },
  ];

  const sel = networks[selectedNetwork];

  return (
    <div>
      <SectionTitle subtitle="규모에 따른 네트워크 분류">
        1. 네트워크의 분류
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        네트워크는 연결 범위에 따라 LAN, MAN, WAN으로 분류됩니다. 
        하지만 이것은 단순히 "크기"만의 문제가 아닙니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        LAN과 WAN의 차이가 단순히 "범위의 크기"뿐일까요? 
        서울에 있는 컴퓨터와 부산에 있는 서버를 연결할 때, 
        같은 건물 내 연결과 무엇이 다를까요?
      </Question>

      <Answer visible={step >= 1}>
        크기만 다른 것이 아닙니다. <strong style={{ color: C.accent }}>물리적 연결 방식</strong>이 근본적으로 달라집니다.
        <br /><br />
        LAN에서는 이더넷 케이블을 직접 깔거나 Wi-Fi 공유기 하나로 연결할 수 있지만, 
        WAN에서는 통신사(ISP)가 구축한 <strong style={{ color: C.text }}>광케이블 백본망, 해저 케이블</strong> 같은 
        인프라를 빌려 써야 합니다.
        <br /><br />
        이 차이는 <strong style={{ color: C.green }}>관리 주체</strong>, <strong style={{ color: C.blue }}>비용</strong>, 
        그리고 <strong style={{ color: C.purple }}>성능 특성</strong>의 차이로 이어집니다.
      </Answer>

      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
            각 네트워크 유형을 선택하여 특성을 비교해 보세요:
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {networks.map((net, i) => (
              <button
                key={i}
                onClick={() => setSelectedNetwork(i)}
                style={{
                  flex: "1 1 120px",
                  padding: "18px 14px",
                  background: selectedNetwork === i ? `${net.color}20` : C.surface,
                  border: `1.5px solid ${selectedNetwork === i ? net.color : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "inherit",
                  textAlign: "center",
                  boxShadow: selectedNetwork === i ? `0 0 20px ${net.color}30` : "none",
                }}
              >
                <div style={{ fontSize: "1.8em", marginBottom: 6 }}>{net.icon}</div>
                <div style={{ 
                  color: selectedNetwork === i ? net.color : C.textDim, 
                  fontSize: "1.1em", 
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}>
                  {net.name}
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
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: "2em" }}>{sel.icon}</span>
              <div>
                <div style={{ color: sel.color, fontWeight: 700, fontSize: "1.2em" }}>{sel.fullName}</div>
                <div style={{ color: C.textMuted, fontSize: "0.85em" }}>{sel.range}</div>
              </div>
            </div>

            <p style={{ color: C.text, lineHeight: 1.8, marginBottom: "1.5rem" }}>{sel.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <div style={{ padding: "12px 14px", background: `${sel.color}08`, borderRadius: 8 }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>속도</div>
                <div style={{ color: sel.color, fontWeight: 600, fontSize: "0.9em" }}>{sel.speed}</div>
              </div>
              <div style={{ padding: "12px 14px", background: `${sel.color}08`, borderRadius: 8 }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>지연 시간</div>
                <div style={{ color: sel.color, fontWeight: 600, fontSize: "0.9em" }}>{sel.latency}</div>
              </div>
              <div style={{ padding: "12px 14px", background: `${sel.color}08`, borderRadius: 8 }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>관리 주체</div>
                <div style={{ color: sel.color, fontWeight: 600, fontSize: "0.9em" }}>{sel.management}</div>
              </div>
              <div style={{ padding: "12px 14px", background: `${sel.color}08`, borderRadius: 8 }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>예시</div>
                <div style={{ color: sel.color, fontWeight: 600, fontSize: "0.9em" }}>{sel.example}</div>
              </div>
            </div>
          </div>

          <Box color={C.blue} label="면접 포인트">
            네트워크 분류를 물어볼 때, 단순히 LAN·MAN·WAN을 나열하는 것보다 
            <strong> "왜 이렇게 나누는가"</strong>를 설명할 수 있으면 좋습니다.
            규모가 달라지면 사용하는 기술, 관리 주체, 비용 구조, 성능 특성이 모두 달라지기 때문입니다.
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Network Topology
   ═══════════════════════════════════════════════════════════════ */
function NetworkTopology() {
  const [step, setStep] = useState(0);
  const [selectedTopology, setSelectedTopology] = useState(0);

  const topologies = [
    {
      name: "버스",
      icon: "━━●━━●━━●━━",
      color: C.blue,
      reliability: "낮음",
      cost: "저렴",
      bottleneck: "버스 케이블",
      desc: "하나의 긴 케이블(버스)에 모든 장치가 연결됩니다. 버스가 끊어지면 전체 네트워크가 마비됩니다.",
      pros: "설치 간단, 케이블 적게 사용",
      cons: "케이블 장애 시 전체 마비, 충돌 발생",
    },
    {
      name: "스타",
      icon: "✦",
      color: C.green,
      reliability: "중간",
      cost: "중간",
      bottleneck: "중앙 장치 (스위치/허브)",
      desc: "모든 장치가 중앙 스위치에 연결됩니다. 가장 널리 쓰이는 형태이며, 가정의 공유기 구조가 이에 해당합니다.",
      pros: "한 장치 장애가 다른 장치에 영향 없음",
      cons: "중앙 장치 장애 시 전체 마비",
    },
    {
      name: "링",
      icon: "◯",
      color: C.purple,
      reliability: "낮음",
      cost: "중간",
      bottleneck: "어느 연결이든",
      desc: "장치들이 원형으로 연결되어 데이터가 한 방향으로 순환합니다. 하나라도 끊어지면 루프가 깨집니다.",
      pros: "데이터 충돌 적음, 구조 단순",
      cons: "한 지점 장애 시 전체 영향",
    },
    {
      name: "트리",
      icon: "🌲",
      color: C.orange,
      reliability: "중간",
      cost: "중간",
      bottleneck: "상위 계층 장치",
      desc: "스타 토폴로지를 계층적으로 연결한 형태입니다. 본사-지사 구조의 기업 네트워크에서 흔히 볼 수 있습니다.",
      pros: "확장성 좋음, 관리 용이",
      cons: "상위 노드 장애 시 하위 전체 영향",
    },
    {
      name: "메시",
      icon: "✳",
      color: C.red,
      reliability: "높음",
      cost: "비쌈",
      bottleneck: "거의 없음",
      desc: "모든 장치가 서로 직접 연결됩니다. 하나가 끊어져도 다른 경로로 통신 가능하여 안정성이 최고입니다.",
      pros: "매우 높은 안정성, 다중 경로",
      cons: "연결 수 폭발적 증가, 비용 높음",
    },
  ];

  const sel = topologies[selectedTopology];

  return (
    <div>
      <SectionTitle subtitle="장치들이 연결되는 형태">
        2. 네트워크 토폴로지
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        토폴로지는 네트워크에서 장치들이 서로 어떤 형태로 연결되어 있는지를 나타냅니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        컴퓨터 5대를 하나의 네트워크로 연결해야 한다면, 어떤 방식들이 가능할까요?
        "모두 하나의 중앙 장치에 연결"하는 것과 "원형으로 이어 붙이는 것" 중 
        어느 쪽이 더 안정적일까요?
      </Question>

      <Answer visible={step >= 1}>
        상황에 따라 다릅니다. 
        <br /><br />
        <strong style={{ color: C.green }}>스타 토폴로지</strong>(중앙 장치에 연결)는 한 컴퓨터의 케이블이 끊어져도 
        나머지에 영향이 없지만, 중앙 스위치가 고장 나면 전체가 멈춥니다.
        <br /><br />
        <strong style={{ color: C.purple }}>링 토폴로지</strong>(원형 연결)는 충돌이 적지만, 
        중간에 하나라도 끊어지면 전체 루프가 깨집니다.
        <br /><br />
        각 토폴로지마다 <strong style={{ color: C.accent }}>안정성, 비용, 성능 사이의 트레이드오프</strong>가 다릅니다.
      </Answer>

      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
            각 토폴로지를 선택하여 특성을 확인해 보세요:
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {topologies.map((topo, i) => (
              <button
                key={i}
                onClick={() => setSelectedTopology(i)}
                style={{
                  flex: "1 1 80px",
                  padding: "14px 10px",
                  background: selectedTopology === i ? `${topo.color}20` : C.surface,
                  border: `1.5px solid ${selectedTopology === i ? topo.color : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                <div style={{ 
                  fontSize: "1.2em", 
                  marginBottom: 4,
                  color: selectedTopology === i ? topo.color : C.textMuted,
                }}>
                  {topo.icon}
                </div>
                <div style={{ 
                  color: selectedTopology === i ? topo.color : C.textDim, 
                  fontSize: "0.85em", 
                  fontWeight: 600,
                }}>
                  {topo.name}
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
            }}
          >
            <div style={{ 
              color: sel.color, 
              fontWeight: 700, 
              fontSize: "1.3em", 
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span>{sel.icon}</span>
              {sel.name} 토폴로지
            </div>

            <p style={{ color: C.text, lineHeight: 1.8, marginBottom: "1.5rem" }}>{sel.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              <div style={{ padding: "12px", background: `${sel.color}08`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>안정성</div>
                <div style={{ color: sel.color, fontWeight: 700 }}>{sel.reliability}</div>
              </div>
              <div style={{ padding: "12px", background: `${sel.color}08`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>비용</div>
                <div style={{ color: sel.color, fontWeight: 700 }}>{sel.cost}</div>
              </div>
              <div style={{ padding: "12px", background: `${sel.color}08`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: "0.7em", color: C.textMuted, marginBottom: 4 }}>병목 지점</div>
                <div style={{ color: sel.color, fontWeight: 700, fontSize: "0.85em" }}>{sel.bottleneck}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "12px", background: `${C.green}10`, borderRadius: 8, borderLeft: `3px solid ${C.green}` }}>
                <div style={{ fontSize: "0.75em", color: C.green, fontWeight: 600, marginBottom: 4 }}>장점</div>
                <div style={{ color: C.textDim, fontSize: "0.9em" }}>{sel.pros}</div>
              </div>
              <div style={{ padding: "12px", background: `${C.red}10`, borderRadius: 8, borderLeft: `3px solid ${C.red}` }}>
                <div style={{ fontSize: "0.75em", color: C.red, fontWeight: 600, marginBottom: 4 }}>단점</div>
                <div style={{ color: C.textDim, fontSize: "0.9em" }}>{sel.cons}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {step >= 1 && (
        <Question number={2} revealed={step >= 2} onReveal={() => setStep(2)}>
          토폴로지를 알면 <strong>병목 현상</strong>이 어디서 발생할지 예측할 수 있다고 합니다.
          스타 토폴로지에서 30대의 컴퓨터가 동시에 대용량 파일을 전송하면 어디서 문제가 생길까요?
        </Question>
      )}

      <Answer visible={step >= 2}>
        <strong style={{ color: C.accent }}>중앙 스위치</strong>가 병목 지점이 됩니다.
        <br /><br />
        병목 현상은 전체 시스템의 성능이 특정 구성 요소로 인해 제한받는 현상입니다.
        스위치의 처리 용량이 1Gbps인데 30대가 동시에 전송하면 그 용량을 초과하게 됩니다.
        <br /><br />
        트리 토폴로지에서도 마찬가지로, 상위 계층의 장치에 하위 계층의 트래픽이 전부 몰리기 때문에
        <strong style={{ color: C.text }}> 상위로 올라갈수록 병목이 발생하기 쉽습니다</strong>.
      </Answer>

      {step >= 2 && (
        <Box color={C.purple} label="핵심 정리">
          토폴로지마다 <strong>병목 지점이 다릅니다</strong>. 
          병목을 해결하려면 먼저 네트워크가 어떤 토폴로지로 구성되어 있는지 파악해야 합니다.
          이것이 토폴로지 학습의 실질적인 이유입니다.
        </Box>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Throughput and Latency
   ═══════════════════════════════════════════════════════════════ */
function ThroughputAndLatency() {
  const [step, setStep] = useState(0);
  const [throughput, setThroughput] = useState(50);
  const [latency, setLatency] = useState(50);

  return (
    <div>
      <SectionTitle subtitle="네트워크 성능의 두 축">
        3. 처리량과 지연 시간
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        네트워크 성능을 측정하는 두 가지 기본 지표가 있습니다.
      </p>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 16, 
        marginBottom: "2rem" 
      }}>
        <div style={{ 
          padding: "1.5rem", 
          background: C.surface, 
          borderRadius: 12,
          borderTop: `4px solid ${C.blue}`,
        }}>
          <div style={{ color: C.blue, fontWeight: 700, fontSize: "1.1em", marginBottom: 8 }}>
            처리량 (Throughput)
          </div>
          <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.7 }}>
            단위 시간당 성공적으로 전달된 데이터의 양
          </div>
          <div style={{ 
            marginTop: 12, 
            padding: "8px 12px", 
            background: `${C.blue}15`, 
            borderRadius: 6,
            fontFamily: "var(--font-mono)",
            color: C.blue,
            fontSize: "0.85em",
          }}>
            단위: bps (bits per second)
          </div>
        </div>

        <div style={{ 
          padding: "1.5rem", 
          background: C.surface, 
          borderRadius: 12,
          borderTop: `4px solid ${C.green}`,
        }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: "1.1em", marginBottom: 8 }}>
            지연 시간 (Latency)
          </div>
          <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.7 }}>
            메시지가 두 장치 사이를 왕복하는 데 걸린 시간
          </div>
          <div style={{ 
            marginTop: 12, 
            padding: "8px 12px", 
            background: `${C.green}15`, 
            borderRadius: 6,
            fontFamily: "var(--font-mono)",
            color: C.green,
            fontSize: "0.85em",
          }}>
            단위: ms (milliseconds)
          </div>
        </div>
      </div>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        처리량이 높으면 지연 시간도 반드시 짧을까요?
      </Question>

      <Answer visible={step >= 1}>
        <strong style={{ color: C.red }}>아닙니다.</strong> 이 둘은 <strong style={{ color: C.accent }}>독립적인 지표</strong>입니다.
        <br /><br />
        도로에 비유하면 이렇습니다. 서울에서 부산으로 대형 화물트럭이 1시간에 100대씩 출발할 수 있다고 해봅시다. 
        <strong style={{ color: C.blue }}> 처리량</strong>은 엄청나죠 (시간당 100대). 
        하지만 각 트럭이 부산에 도착하기까지 5시간이 걸린다면, 
        <strong style={{ color: C.green }}> 지연 시간</strong>은 여전히 긴 겁니다.
        <br /><br />
        네트워크 성능을 제대로 평가하려면 <strong style={{ color: C.text }}>둘 다</strong> 봐야 합니다.
      </Answer>

      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
            슬라이더를 조절하여 처리량과 지연 시간의 조합을 확인해 보세요:
          </p>

          <div style={{ 
            background: C.surfaceAlt, 
            borderRadius: 16, 
            padding: 28,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.blue, fontWeight: 600 }}>처리량</span>
                <span style={{ color: C.blue, fontFamily: "var(--font-mono)" }}>{throughput * 10} Mbps</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={throughput}
                onChange={(e) => setThroughput(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.green, fontWeight: 600 }}>지연 시간</span>
                <span style={{ color: C.green, fontFamily: "var(--font-mono)" }}>{latency} ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={latency}
                onChange={(e) => setLatency(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.green }}
              />
            </div>

            <div style={{ 
              padding: 20, 
              background: C.surface, 
              borderRadius: 12,
              textAlign: "center",
            }}>
              <div style={{ color: C.textMuted, fontSize: "0.8em", marginBottom: 8 }}>이 네트워크는...</div>
              <div style={{ color: C.text, fontSize: "1.1em", lineHeight: 1.6 }}>
                {throughput > 70 && latency < 30 && "🚀 고속 + 저지연: 실시간 게임, 화상회의에 적합"}
                {throughput > 70 && latency >= 30 && "📦 대용량 전송에 적합 (파일 다운로드)"}
                {throughput <= 70 && latency < 30 && "⚡ 빠른 응답이 필요한 작업에 적합 (웹 브라우징)"}
                {throughput <= 70 && latency >= 30 && "🐢 대역폭과 응답 속도 모두 개선 필요"}
              </div>
            </div>
          </div>

          <Box color={C.accent} label="실제 예시">
            <strong>LAN</strong>: 처리량 높음, 지연 시간 낮음 (물리적 거리가 짧으므로)<br />
            <strong>WAN</strong>: 처리량은 인프라에 따라 다양, 지연 시간은 거리 때문에 높음<br /><br />
            앞서 배운 <strong>병목 현상</strong>이 바로 이 처리량을 깎아먹는 대표적인 원인입니다.
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. Network Performance Commands
   ═══════════════════════════════════════════════════════════════ */
function PerformanceCommands() {
  const [selectedCmd, setSelectedCmd] = useState(0);

  const commands = [
    {
      name: "ping",
      color: C.blue,
      purpose: "지연 시간 측정",
      desc: "특정 주소로 작은 패킷을 보내고, 응답이 돌아오기까지 걸린 시간을 측정합니다.",
      example: "ping google.com",
      output: "64 bytes from 142.250.196.110: time=12.3 ms",
      insight: "응답이 안 오면 해당 서버에 도달할 수 없다는 뜻입니다. 내부적으로 ICMP 프로토콜을 사용합니다.",
    },
    {
      name: "traceroute",
      color: C.green,
      purpose: "경로 추적 + 구간별 지연 시간",
      desc: "목적지까지 가는 길에 어떤 장치들을 거치는지 보여주고, 각 구간의 지연 시간을 표시합니다.",
      example: "traceroute google.com  (Windows: tracert)",
      output: "1  192.168.0.1  1.2ms\n2  10.0.0.1     5.3ms\n3  ...",
      insight: "어느 구간에서 시간이 오래 걸리는지 파악하여 병목 지점을 추적할 수 있습니다.",
    },
    {
      name: "netstat",
      color: C.purple,
      purpose: "현재 네트워크 연결 상태 확인",
      desc: "내 컴퓨터의 네트워크 상태를 보여줍니다. 열린 연결, 사용 중인 포트, 연결 상태 등을 확인합니다.",
      example: "netstat -an",
      output: "TCP  0.0.0.0:80   LISTENING\nTCP  127.0.0.1:3000  ESTABLISHED",
      insight: "비정상적인 네트워크 사용이나 의심스러운 연결을 찾아낼 수 있습니다.",
    },
    {
      name: "nslookup",
      color: C.orange,
      purpose: "DNS 조회",
      desc: "도메인 이름을 IP 주소로 변환해주는 DNS 서버에 질의합니다.",
      example: "nslookup google.com",
      output: "Name:    google.com\nAddress: 142.250.196.110",
      insight: "웹사이트 접속 불가 시, 문제가 DNS에 있는지 다른 곳에 있는지 구분하는 데 유용합니다.",
    },
  ];

  const sel = commands[selectedCmd];

  return (
    <div>
      <SectionTitle subtitle="실제로 측정하고 진단하기">
        4. 네트워크 성능 분석 명령어
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        처리량과 지연 시간을 이론으로만 알면 의미가 없습니다. 
        실제로 측정하고 문제를 진단할 수 있어야 합니다.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {commands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => setSelectedCmd(i)}
            style={{
              flex: "1 1 100px",
              padding: "12px 16px",
              background: selectedCmd === i ? `${cmd.color}20` : C.surface,
              border: `1.5px solid ${selectedCmd === i ? cmd.color : C.border}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "var(--font-mono)",
              fontSize: "0.95em",
              fontWeight: 600,
              color: selectedCmd === i ? cmd.color : C.textDim,
            }}
          >
            {cmd.name}
          </button>
        ))}
      </div>

      <div
        style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 28,
          border: `1px solid ${sel.color}30`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ 
            fontFamily: "var(--font-mono)", 
            fontSize: "1.4em", 
            fontWeight: 700,
            color: sel.color,
          }}>
            {sel.name}
          </span>
          <span style={{ 
            padding: "4px 10px", 
            background: `${sel.color}20`, 
            borderRadius: 6,
            fontSize: "0.8em",
            color: sel.color,
          }}>
            {sel.purpose}
          </span>
        </div>

        <p style={{ color: C.text, lineHeight: 1.8, marginBottom: "1.5rem" }}>{sel.desc}</p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 6 }}>사용 예시</div>
          <div style={{ 
            padding: "12px 16px", 
            background: "#0a0a1a", 
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            fontSize: "0.9em",
            color: C.accent,
          }}>
            $ {sel.example}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.textMuted, fontSize: "0.75em", marginBottom: 6 }}>출력 예시</div>
          <div style={{ 
            padding: "12px 16px", 
            background: "#0a0a1a", 
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            fontSize: "0.85em",
            color: C.textDim,
            whiteSpace: "pre-line",
          }}>
            {sel.output}
          </div>
        </div>

        <div style={{ 
          padding: "12px 16px", 
          background: `${sel.color}10`, 
          borderRadius: 8,
          borderLeft: `3px solid ${sel.color}`,
        }}>
          <div style={{ color: sel.color, fontSize: "0.75em", fontWeight: 600, marginBottom: 4 }}>💡 포인트</div>
          <div style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>{sel.insight}</div>
        </div>
      </div>

      <Box color={C.green} label="면접 포인트">
        단순히 "ping은 연결 확인하는 거예요"보다는 문제 해결 흐름 속에서 설명하세요:
        <br /><br />
        "먼저 <strong>ping</strong>으로 목적지에 도달 가능한지와 지연 시간을 확인하고, 
        문제가 있으면 <strong>traceroute</strong>로 어느 구간이 병목인지 추적합니다.
        DNS 문제가 의심되면 <strong>nslookup</strong>으로 확인하고,
        내 시스템의 연결 상태는 <strong>netstat</strong>으로 점검합니다."
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. TCP/IP 4-Layer Model
   ═══════════════════════════════════════════════════════════════ */
function TCPIPModel() {
  const [step, setStep] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  const layers = [
    {
      name: "애플리케이션 계층",
      color: C.blue,
      protocols: ["HTTP", "FTP", "SSH", "SMTP", "DNS"],
      pdu: "메시지",
      desc: "사용자가 실제로 접하는 서비스의 규칙을 정의합니다.",
      example: "웹 브라우저 → HTTP, 이메일 → SMTP",
    },
    {
      name: "전송 계층",
      color: C.green,
      protocols: ["TCP", "UDP"],
      pdu: "세그먼트 / 데이터그램",
      desc: "데이터가 어떤 애플리케이션에 전달될지 결정하고, 신뢰성을 담당합니다.",
      example: "TCP: 신뢰성 보장 / UDP: 빠른 전송",
    },
    {
      name: "인터넷 계층",
      color: C.purple,
      protocols: ["IP", "ARP", "ICMP"],
      pdu: "패킷",
      desc: "여러 네트워크를 거쳐 목적지까지 데이터를 전달하는 경로를 찾습니다.",
      example: "ping이 내부적으로 ICMP를 사용",
    },
    {
      name: "링크 계층",
      color: C.orange,
      protocols: ["이더넷", "Wi-Fi"],
      pdu: "프레임",
      desc: "물리적으로 연결된 장치 사이에서 데이터를 직접 전달합니다.",
      example: "LAN 내 이더넷 케이블 통신",
    },
  ];

  return (
    <div>
      <SectionTitle subtitle="프로토콜의 계층 구조">
        5. TCP/IP 4계층 모델
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        프로토콜이 수십, 수백 가지가 있다면 이것들을 체계적으로 정리할 방법이 필요합니다.
        TCP/IP 모델은 프로토콜들을 역할에 따라 4개의 계층으로 분류합니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        왜 프로토콜을 계층으로 나눌까요? 그냥 하나의 프로토콜로 모든 걸 처리하면 안 될까요?
      </Question>

      <Answer visible={step >= 1}>
        계층을 나누면 <strong style={{ color: C.accent }}>모듈화</strong>의 이점을 얻습니다.
        <br /><br />
        각 계층이 자기 역할에만 집중하면, 한 계층의 기술이 바뀌어도 다른 계층에 영향을 주지 않습니다.
        예를 들어 링크 계층에서 이더넷 대신 Wi-Fi를 써도, 그 위의 IP나 TCP는 그대로 동작합니다.
        <br /><br />
        또한 <strong style={{ color: C.text }}>문제 진단</strong>이 쉬워집니다. 
        "어느 계층에서 문제가 발생했는가"를 파악하면 해결 방향이 명확해지죠.
      </Answer>

      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
            각 계층을 클릭하여 역할과 프로토콜을 확인해 보세요:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "2rem" }}>
            {layers.map((layer, i) => (
              <div
                key={i}
                onClick={() => setHoveredLayer(hoveredLayer === i ? null : i)}
                style={{
                  padding: hoveredLayer === i ? "20px 24px" : "16px 24px",
                  background: hoveredLayer === i ? `${layer.color}15` : C.surface,
                  border: `1px solid ${hoveredLayer === i ? layer.color : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: "50%", 
                      background: `${layer.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: layer.color,
                      fontWeight: 700,
                      fontSize: "0.85em",
                    }}>
                      {4 - i}
                    </span>
                    <span style={{ color: layer.color, fontWeight: 600 }}>{layer.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {layer.protocols.slice(0, 3).map((p, j) => (
                      <span
                        key={j}
                        style={{
                          padding: "4px 8px",
                          background: `${layer.color}20`,
                          borderRadius: 4,
                          fontSize: "0.75em",
                          fontFamily: "var(--font-mono)",
                          color: layer.color,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                    {layer.protocols.length > 3 && (
                      <span style={{ color: C.textMuted, fontSize: "0.75em" }}>+{layer.protocols.length - 3}</span>
                    )}
                  </div>
                </div>

                {hoveredLayer === i && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <p style={{ color: C.textDim, lineHeight: 1.7, marginBottom: 12 }}>{layer.desc}</p>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div>
                        <span style={{ fontSize: "0.7em", color: C.textMuted }}>PDU</span>
                        <div style={{ color: layer.color, fontWeight: 600 }}>{layer.pdu}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.7em", color: C.textMuted }}>예시</span>
                        <div style={{ color: C.text, fontSize: "0.9em" }}>{layer.example}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Box color={C.accent} label="PDU (Protocol Data Unit)">
            각 계층에서 데이터를 부르는 이름이 다릅니다:
            <br /><br />
            <strong style={{ color: C.blue }}>애플리케이션</strong>: 메시지 → 
            <strong style={{ color: C.green }}> 전송</strong>: 세그먼트/데이터그램 → 
            <strong style={{ color: C.purple }}> 인터넷</strong>: 패킷 → 
            <strong style={{ color: C.orange }}> 링크</strong>: 프레임
            <br /><br />
            이 이름 변화가 바로 <strong>캡슐화</strong> 과정과 연결됩니다.
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. Encapsulation & PDU
   ═══════════════════════════════════════════════════════════════ */
function Encapsulation() {
  const [step, setStep] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  const encapSteps = [
    { layer: "애플리케이션", pdu: "메시지", header: null, color: C.blue },
    { layer: "전송", pdu: "세그먼트", header: "TCP 헤더", color: C.green },
    { layer: "인터넷", pdu: "패킷", header: "IP 헤더", color: C.purple },
    { layer: "링크", pdu: "프레임", header: "프레임 헤더", trailer: "트레일러", color: C.orange },
  ];

  return (
    <div>
      <SectionTitle subtitle="계층을 내려가며 헤더가 붙는 과정">
        6. 캡슐화와 PDU
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        데이터가 상위 계층에서 하위 계층으로 내려갈 때마다 해당 계층의 헤더가 추가됩니다.
        이 과정을 <strong style={{ color: C.accent }}>캡슐화(Encapsulation)</strong>라고 합니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        왜 각 계층에서 헤더를 붙일까요? 한 번에 모든 정보를 붙이면 안 될까요?
      </Question>

      <Answer visible={step >= 1}>
        각 계층은 <strong style={{ color: C.accent }}>자기 역할에 필요한 정보만</strong> 알면 됩니다.
        <br /><br />
        전송 계층은 "어떤 포트로 전달할지"만 알면 되고, 인터넷 계층은 "어떤 IP로 보낼지"만 알면 됩니다.
        이렇게 분리하면 각 계층이 독립적으로 동작할 수 있고, 한 계층의 변경이 다른 계층에 영향을 주지 않습니다.
        <br /><br />
        수신 측에서는 <strong style={{ color: C.text }}>비캡슐화</strong>로 헤더를 하나씩 벗겨내며 위로 올라갑니다.
      </Answer>

      {step >= 1 && (
        <>
          <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
            버튼을 눌러 캡슐화 과정을 단계별로 확인해 보세요:
          </p>

          <div style={{ 
            background: C.surfaceAlt, 
            borderRadius: 16, 
            padding: 28,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
              {encapSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAnimationStep(i)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: animationStep >= i ? encapSteps[i].color : C.surface,
                    border: `2px solid ${encapSteps[i].color}`,
                    color: animationStep >= i ? "#fff" : encapSteps[i].color,
                    fontWeight: 700,
                    fontSize: "0.9em",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              minHeight: 120,
              marginBottom: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {animationStep >= 3 && (
                  <div style={{ 
                    padding: "12px 14px", 
                    background: `${C.orange}30`, 
                    borderRadius: "8px 0 0 8px",
                    color: C.orange,
                    fontSize: "0.8em",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}>
                    프레임 헤더
                  </div>
                )}
                {animationStep >= 2 && (
                  <div style={{ 
                    padding: "12px 14px", 
                    background: `${C.purple}30`, 
                    color: C.purple,
                    fontSize: "0.8em",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}>
                    IP 헤더
                  </div>
                )}
                {animationStep >= 1 && (
                  <div style={{ 
                    padding: "12px 14px", 
                    background: `${C.green}30`, 
                    color: C.green,
                    fontSize: "0.8em",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}>
                    TCP 헤더
                  </div>
                )}
                <div style={{ 
                  padding: "16px 24px", 
                  background: `${C.blue}30`, 
                  color: C.blue,
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                }}>
                  DATA
                </div>
                {animationStep >= 3 && (
                  <div style={{ 
                    padding: "12px 14px", 
                    background: `${C.orange}30`, 
                    borderRadius: "0 8px 8px 0",
                    color: C.orange,
                    fontSize: "0.8em",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}>
                    CRC
                  </div>
                )}
              </div>
            </div>

            <div style={{ 
              textAlign: "center", 
              padding: "16px",
              background: `${encapSteps[animationStep].color}10`,
              borderRadius: 12,
              border: `1px solid ${encapSteps[animationStep].color}30`,
            }}>
              <div style={{ 
                color: encapSteps[animationStep].color, 
                fontWeight: 700, 
                fontSize: "1.1em",
                marginBottom: 4,
              }}>
                {encapSteps[animationStep].layer} 계층
              </div>
              <div style={{ color: C.textDim }}>
                PDU: <strong style={{ color: encapSteps[animationStep].color }}>{encapSteps[animationStep].pdu}</strong>
              </div>
            </div>
          </div>

          <Box color={C.purple} label="면접 포인트">
            "세그먼트와 패킷의 차이가 뭔가요?"라는 질문에는 캡슐화 과정과 함께 설명하세요:
            <br /><br />
            "세그먼트는 전송 계층에서 TCP 헤더가 붙은 상태이고, 
            이게 인터넷 계층으로 내려가서 IP 헤더까지 붙으면 패킷이 됩니다."
          </Box>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. TCP Connection (3-way & 4-way Handshake)
   ═══════════════════════════════════════════════════════════════ */
function TCPConnection() {
  const [step, setStep] = useState(0);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [mode, setMode] = useState("connect"); // "connect" or "disconnect"

  const connectSteps = [
    { from: "client", to: "server", label: "SYN", desc: "클라이언트가 연결 요청 (ISN 포함)" },
    { from: "server", to: "client", label: "SYN + ACK", desc: "서버가 요청 수락 및 자신의 ISN 전송" },
    { from: "client", to: "server", label: "ACK", desc: "클라이언트가 확인 응답" },
  ];

  const disconnectSteps = [
    { from: "client", to: "server", label: "FIN", desc: "클라이언트: 보낼 데이터 없음 (FIN_WAIT_1)" },
    { from: "server", to: "client", label: "ACK", desc: "서버: 확인 (CLOSE_WAIT) / 클라이언트: FIN_WAIT_2" },
    { from: "server", to: "client", label: "FIN", desc: "서버: 나도 보낼 데이터 없음" },
    { from: "client", to: "server", label: "ACK", desc: "클라이언트: TIME_WAIT 후 CLOSED" },
  ];

  const steps = mode === "connect" ? connectSteps : disconnectSteps;

  return (
    <div>
      <SectionTitle subtitle="TCP의 신뢰성 있는 연결">
        7. TCP 연결 수립과 해제
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        TCP가 UDP와 다르게 신뢰성을 확보하는 핵심은 연결의 수립과 해제 과정에 있습니다.
      </p>

      <Question number={1} revealed={step >= 1} onReveal={() => setStep(1)}>
        IP는 기본적으로 데이터그램 방식(패킷이 독립적으로 이동)인데, 
        TCP는 어떻게 "순서대로 도착"하는 것처럼 보이게 만들까요?
      </Question>

      <Answer visible={step >= 1}>
        TCP 패킷에는 <strong style={{ color: C.accent }}>순서 번호(sequence number)</strong>가 붙습니다.
        <br /><br />
        IP 수준에서는 패킷들이 여전히 독립적으로 이동하고 서로 다른 경로를 탈 수 있지만,
        TCP가 순서 번호를 보고 원래 순서대로 재조립합니다. 빠진 패킷이 있으면 재전송을 요청하고요.
        <br /><br />
        그래서 애플리케이션에서 보기에는 마치 <strong style={{ color: C.text }}>가상회선처럼</strong> 보이는 겁니다.
      </Answer>

      {step >= 1 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => { setMode("connect"); setHandshakeStep(0); }}
              style={{
                flex: 1,
                padding: "14px",
                background: mode === "connect" ? `${C.green}20` : C.surface,
                border: `1.5px solid ${mode === "connect" ? C.green : C.border}`,
                borderRadius: 10,
                color: mode === "connect" ? C.green : C.textDim,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              3-way Handshake (연결)
            </button>
            <button
              onClick={() => { setMode("disconnect"); setHandshakeStep(0); }}
              style={{
                flex: 1,
                padding: "14px",
                background: mode === "disconnect" ? `${C.red}20` : C.surface,
                border: `1.5px solid ${mode === "disconnect" ? C.red : C.border}`,
                borderRadius: 10,
                color: mode === "disconnect" ? C.red : C.textDim,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              4-way Handshake (해제)
            </button>
          </div>

          <div style={{ 
            background: C.surfaceAlt, 
            borderRadius: 16, 
            padding: 28,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 12, 
                  background: `${C.blue}20`,
                  border: `2px solid ${C.blue}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                  💻
                </div>
                <div style={{ color: C.blue, fontWeight: 600 }}>클라이언트</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: 12, 
                  background: `${C.green}20`,
                  border: `2px solid ${C.green}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                  🖥️
                </div>
                <div style={{ color: C.green, fontWeight: 600 }}>서버</div>
              </div>
            </div>

            <div style={{ position: "relative", minHeight: steps.length * 60 + 20 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: i * 60,
                    left: 0,
                    right: 0,
                    opacity: handshakeStep >= i ? 1 : 0.2,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: s.from === "client" ? "flex-start" : "flex-end",
                    gap: 8,
                  }}>
                    {s.from === "client" && <div style={{ width: 40 }} />}
                    <div style={{ 
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexDirection: s.from === "client" ? "row" : "row-reverse",
                      }}>
                        <span style={{ 
                          padding: "6px 12px",
                          background: mode === "connect" ? `${C.green}20` : `${C.red}20`,
                          border: `1px solid ${mode === "connect" ? C.green : C.red}`,
                          borderRadius: 6,
                          color: mode === "connect" ? C.green : C.red,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          fontSize: "0.85em",
                        }}>
                          {s.label}
                        </span>
                        <span style={{ color: C.textMuted, fontSize: "0.8em" }}>
                          {s.from === "client" ? "→" : "←"}
                        </span>
                      </div>
                    </div>
                    {s.from === "server" && <div style={{ width: 40 }} />}
                  </div>
                  <div style={{ 
                    textAlign: "center", 
                    color: C.textDim, 
                    fontSize: "0.8em",
                    marginTop: 4,
                  }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHandshakeStep(i)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: handshakeStep >= i ? (mode === "connect" ? C.green : C.red) : C.surface,
                    border: `2px solid ${mode === "connect" ? C.green : C.red}`,
                    color: handshakeStep >= i ? "#fff" : (mode === "connect" ? C.green : C.red),
                    fontWeight: 700,
                    fontSize: "0.85em",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {mode === "disconnect" && (
            <Box color={C.orange} label="TIME_WAIT이 존재하는 이유">
              <strong>1. 지연 패킷 대비</strong>: 네트워크에 아직 남아있는 패킷이 있을 수 있습니다. 
              바로 연결을 닫으면 데이터 무결성 문제가 발생할 수 있습니다.
              <br /><br />
              <strong>2. 연결 종료 확인</strong>: 마지막 ACK가 서버에 도달했는지 확인하기 위해 기다립니다.
              <br /><br />
              보통 <strong style={{ color: C.accent }}>2MSL</strong>(Maximum Segment Lifetime)만큼 기다립니다.
            </Box>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. LAN Technologies (Wired & Wireless)
   ═══════════════════════════════════════════════════════════════ */
function LANTechnologies() {
  const [mode, setMode] = useState("wired"); // "wired" or "wireless"

  return (
    <div>
      <SectionTitle subtitle="유선 LAN과 무선 LAN">
        8. LAN 기술
      </SectionTitle>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setMode("wired")}
          style={{
            flex: 1,
            padding: "14px",
            background: mode === "wired" ? `${C.blue}20` : C.surface,
            border: `1.5px solid ${mode === "wired" ? C.blue : C.border}`,
            borderRadius: 10,
            color: mode === "wired" ? C.blue : C.textDim,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          🔌 유선 LAN
        </button>
        <button
          onClick={() => setMode("wireless")}
          style={{
            flex: 1,
            padding: "14px",
            background: mode === "wireless" ? `${C.purple}20` : C.surface,
            border: `1.5px solid ${mode === "wireless" ? C.purple : C.border}`,
            borderRadius: 10,
            color: mode === "wireless" ? C.purple : C.textDim,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          📡 무선 LAN
        </button>
      </div>

      {mode === "wired" ? (
        <div style={{ 
          background: C.surfaceAlt, 
          borderRadius: 16, 
          padding: 28,
          border: `1px solid ${C.blue}30`,
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: C.blue, fontWeight: 700, fontSize: "1.1em", marginBottom: 12 }}>
              전이중화 통신 (Full Duplex)
            </div>
            <p style={{ color: C.textDim, lineHeight: 1.7 }}>
              양쪽 장치가 <strong style={{ color: C.text }}>동시에</strong> 송수신할 수 있는 방식입니다.
              송신로와 수신로가 분리되어 있어 동시 통신이 가능합니다.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ 
              padding: "16px",
              background: C.surface,
              borderRadius: 12,
              borderTop: `3px solid ${C.blue}`,
            }}>
              <div style={{ color: C.blue, fontWeight: 600, marginBottom: 8 }}>트위스트 페어 케이블 (TP)</div>
              <p style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
                8개의 구리선을 둘씩 꼬아서 묶은 케이블. 
                전자기 간섭을 줄이기 위해 꼬아놓았습니다.
              </p>
            </div>
            <div style={{ 
              padding: "16px",
              background: C.surface,
              borderRadius: 12,
              borderTop: `3px solid ${C.green}`,
            }}>
              <div style={{ color: C.green, fontWeight: 600, marginBottom: 8 }}>광섬유 케이블</div>
              <p style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
                레이저를 이용한 통신으로 장거리 및 고속 통신이 가능합니다.
                전자기 간섭에 영향받지 않습니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          background: C.surfaceAlt, 
          borderRadius: 16, 
          padding: 28,
          border: `1px solid ${C.purple}30`,
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: C.purple, fontWeight: 700, fontSize: "1.1em", marginBottom: 12 }}>
              반이중화 통신 (Half Duplex)
            </div>
            <p style={{ color: C.textDim, lineHeight: 1.7 }}>
              양쪽 장치가 <strong style={{ color: C.text }}>동시에는 통신 불가</strong>하며 한 번에 한 방향만 가능합니다.
              그래서 <strong style={{ color: C.accent }}>충돌 방지 시스템(CSMA/CA)</strong>이 필요합니다.
            </p>
          </div>

          <Box color={C.purple} label="CSMA/CA 과정">
            1. 사용 중인 채널이 있으면 유휴 상태인 채널 탐색<br />
            2. IFS(프레임 간 공간) 시간만큼 대기<br />
            3. 랜덤 백오프 시간만큼 대기 후 프레임 전송<br />
            4. ACK 수신 성공 → 완료 / 실패 → 백오프 범위 증가 후 재시도
          </Box>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div style={{ 
              padding: "16px",
              background: C.surface,
              borderRadius: 12,
              borderLeft: `3px solid ${C.green}`,
            }}>
              <div style={{ color: C.green, fontWeight: 600, marginBottom: 8 }}>BSS (Basic Service Set)</div>
              <p style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
                하나의 AP와 연결된 장치들의 기본 단위입니다.
              </p>
            </div>
            <div style={{ 
              padding: "16px",
              background: C.surface,
              borderRadius: 12,
              borderLeft: `3px solid ${C.orange}`,
            }}>
              <div style={{ color: C.orange, fontWeight: 600, marginBottom: 8 }}>ESS (Extended Service Set)</div>
              <p style={{ color: C.textDim, fontSize: "0.9em", lineHeight: 1.6 }}>
                여러 BSS를 연결한 확장 구조. 이동 중에도 끊김 없는 로밍이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      <Box color={C.accent} label="처리량과의 연결">
        <strong style={{ color: C.blue }}>전이중화</strong>는 송신과 수신이 동시에 일어나 대역폭을 온전히 활용합니다.
        <br />
        <strong style={{ color: C.purple }}>반이중화</strong>는 한 번에 한 방향만 가능해서 실질적인 처리량이 떨어집니다.
        <br /><br />
        무선 LAN이 유선보다 체감 속도가 느린 이유 중 하나가 바로 이 <strong>반이중화 특성</strong> 때문입니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */
export default function NetworkFundamentalsBlog() {
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
          <NetworkClassification />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <NetworkTopology />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ThroughputAndLatency />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <PerformanceCommands />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <TCPIPModel />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <Encapsulation />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <TCPConnection />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <LANTechnologies />
        </section>
      </article>
    </div>
  );
}
