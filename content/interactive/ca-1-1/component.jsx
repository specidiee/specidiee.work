'use client';

import { useState, useMemo, useCallback } from "react";

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

/* ─── Bit Cell (toggle button) ─── */
const BitCell = ({ value, onClick, color = C.accent, size = 38 }) => (
  <button
    onClick={onClick}
    style={{
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: value ? `${color}25` : C.surface,
      border: `1.5px solid ${value ? color : C.border}`,
      borderRadius: 6,
      color: value ? color : C.textMuted,
      fontFamily: "var(--font-mono)",
      fontSize: "0.95rem",
      fontWeight: 700,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.15s ease",
      padding: 0,
    }}
  >
    {value}
  </button>
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
   UTILITY FUNCTIONS
   ══════════════════════════════════════════════════════ */

const HEX_TO_BIN = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011',
  '4': '0100', '5': '0101', '6': '0110', '7': '0111',
  '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
  'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111',
};

const BIN_TO_HEX = {};
Object.entries(HEX_TO_BIN).forEach(([h, b]) => { BIN_TO_HEX[b] = h; });

const isValidHex = (s) => /^[0-9a-fA-F]*$/.test(s);
const isValidBin = (s) => /^[01]*$/.test(s);

const toTwosComp = (value, bits) => {
  const mod = Math.pow(2, bits);
  const v = ((value % mod) + mod) % mod;
  return v.toString(2).padStart(bits, '0');
};

const fromSigned = (binStr) => {
  const bits = binStr.length;
  const unsigned = parseInt(binStr, 2);
  if (binStr[0] === '1') return unsigned - Math.pow(2, bits);
  return unsigned;
};

const fromUnsigned = (binStr) => parseInt(binStr, 2);

/* ══════════════════════════════════════════════════════
   SECTION 1 — 수 체계: 16진수가 존재하는 이유
   ══════════════════════════════════════════════════════ */

function HexBinarySection() {
  const [mode, setMode] = useState('hex');
  const [input, setInput] = useState('A3');
  const [q1, setQ1] = useState(false);

  const handleInput = (e) => {
    const val = e.target.value.toUpperCase();
    if (mode === 'hex') {
      if (val.length <= 8 && (val === '' || isValidHex(val))) setInput(val);
    } else {
      if (val.length <= 32 && (val === '' || isValidBin(val))) setInput(val);
    }
  };

  const converted = useMemo(() => {
    if (!input) return { hex: [], bin: [] };
    if (mode === 'hex') {
      const hexDigits = input.toUpperCase().split('');
      const binGroups = hexDigits.map(h => HEX_TO_BIN[h] || '????');
      return { hex: hexDigits, bin: binGroups };
    } else {
      let padded = input;
      while (padded.length % 4 !== 0) padded = '0' + padded;
      const binGroups = [];
      for (let i = 0; i < padded.length; i += 4) {
        binGroups.push(padded.substring(i, i + 4));
      }
      const hexDigits = binGroups.map(g => BIN_TO_HEX[g] || '?');
      return { hex: hexDigits, bin: binGroups };
    }
  }, [input, mode]);

  const switchMode = () => {
    setMode(m => m === 'hex' ? 'bin' : 'hex');
    setInput('');
  };

  const groupColors = [C.accent, C.blue, C.green, C.purple, C.orange, C.red, C.yellow, C.accentDim];

  return (
    <section>
      <SectionTitle subtitle="16 = 2⁴, 그래서 한 자리가 정확히 4비트">
        1. 수 체계 — 16진수가 존재하는 이유
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        컴퓨터는 전압의 두 상태(높음/낮음)를 이용하여 모든 데이터를{' '}
        <strong style={{ color: C.accent }}>이진수(binary)</strong>로 처리합니다.
        하지만 <span style={{ fontFamily: "var(--font-mono)" }}>10100011</span>처럼 긴 비트열을 사람이 읽기는 어렵습니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        이 문제를 해결하는 것이 <strong style={{ color: C.accent }}>16진수(hexadecimal)</strong>입니다.
        핵심 원리는 단순합니다: <strong style={{ color: C.orange }}>16 = 2⁴</strong>이기 때문에,
        16진수 한 자리는 정확히 4비트와 1:1 대응됩니다.
        거듭제곱 계산 없이, 각 자리를 독립적으로 변환하면 됩니다.
        반대로 이진수를 오른쪽부터 4비트씩 끊으면 바로 16진수가 됩니다.
      </p>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        0xA3을 이진수로 변환하려면 어떻게 해야 할까요?
      </Question>
      <Answer visible={q1}>
        각 자리를 독립적으로 변환합니다.{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>A→1010</span>,{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>3→0011</span>,{' '}
        이어 붙이면{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>10100011</span>.
        <br /><br />
        <strong style={{ color: C.orange }}>16 = 2⁴</strong>이기 때문에 이 단순한 방법이 작동합니다.
        자릿값 계산(A × 2⁴ + 3)이 내부적으로 하는 일이 결국 &quot;4비트 그룹을 이어 붙이는 것&quot;과 동일하기 때문입니다.
      </Answer>

      <Panel>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ color: C.textDim, fontSize: "0.85rem", fontWeight: 600 }}>변환 방향:</span>
          <button onClick={switchMode} style={{
            padding: "8px 16px", borderRadius: 8,
            background: `${C.accent}15`, border: `1px solid ${C.accent}40`,
            color: C.accent, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
            fontFamily: "inherit",
          }}>
            {mode === 'hex' ? 'Hex → Binary' : 'Binary → Hex'} ⇄
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: C.textMuted, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
            {mode === 'hex' ? '16진수 입력 (최대 8자리)' : '이진수 입력 (최대 32비트)'}
          </label>
          <input
            value={input}
            onChange={handleInput}
            placeholder={mode === 'hex' ? 'A3' : '10100011'}
            style={{
              width: "100%", padding: "12px 16px",
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 10, color: C.text, fontSize: "1.1rem",
              fontFamily: "var(--font-mono)", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {converted.hex.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "inline-flex", flexDirection: "column", gap: 0, minWidth: "fit-content" }}>
              {/* Hex digits row */}
              <div style={{ display: "flex", gap: 4 }}>
                {converted.hex.map((h, i) => (
                  <div key={i} style={{
                    width: 80, textAlign: "center", padding: "10px 0",
                    color: groupColors[i % groupColors.length],
                    fontFamily: "var(--font-mono)", fontSize: "1.5rem", fontWeight: 700,
                    background: `${groupColors[i % groupColors.length]}10`,
                    borderRadius: "8px 8px 0 0",
                    border: `1px solid ${groupColors[i % groupColors.length]}30`,
                    borderBottom: "none",
                  }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Connector lines */}
              <div style={{ display: "flex", gap: 4 }}>
                {converted.bin.map((_, i) => (
                  <div key={i} style={{
                    width: 80, height: 3,
                    background: `linear-gradient(90deg, transparent 20%, ${groupColors[i % groupColors.length]}80 50%, transparent 80%)`,
                  }} />
                ))}
              </div>

              {/* Binary groups row */}
              <div style={{ display: "flex", gap: 4 }}>
                {converted.bin.map((group, i) => (
                  <div key={i} style={{
                    width: 80, textAlign: "center", padding: "10px 0",
                    color: groupColors[i % groupColors.length],
                    fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 600,
                    background: `${groupColors[i % groupColors.length]}10`,
                    borderRadius: "0 0 8px 8px",
                    border: `1px solid ${groupColors[i % groupColors.length]}30`,
                    borderTop: "none",
                    letterSpacing: "2px",
                  }}>
                    {group}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem", color: C.textMuted, fontSize: "0.85rem" }}>
              16진수 한 자리 = 정확히 4비트 (16 = 2⁴)
            </div>
          </div>
        )}
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 2 — 비트 연산의 직관
   ══════════════════════════════════════════════════════ */

function BitwiseOpsSection() {
  const [x, setX] = useState([0, 1, 1, 0, 0, 1, 1, 0]);
  const [y, setY] = useState([1, 0, 0, 1, 0, 0, 1, 1]);
  const [op, setOp] = useState('AND');
  const [showLogical, setShowLogical] = useState(false);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);

  const toggleBit = useCallback((arr, setArr, i) => {
    const next = [...arr];
    next[i] = next[i] ? 0 : 1;
    setArr(next);
  }, []);

  const result = useMemo(() => {
    switch (op) {
      case 'AND': return x.map((b, i) => b & y[i]);
      case 'OR': return x.map((b, i) => b | y[i]);
      case 'XOR': return x.map((b, i) => b ^ y[i]);
      case 'NOT': return x.map(b => b ? 0 : 1);
      default: return x.map(() => 0);
    }
  }, [x, y, op]);

  const xVal = parseInt(x.join(''), 2);
  const yVal = parseInt(y.join(''), 2);
  const rVal = parseInt(result.join(''), 2);

  const logicalResult = useMemo(() => {
    switch (op) {
      case 'AND': return (xVal !== 0 && yVal !== 0) ? 1 : 0;
      case 'OR': return (xVal !== 0 || yVal !== 0) ? 1 : 0;
      case 'NOT': return xVal === 0 ? 1 : 0;
      default: return 0;
    }
  }, [xVal, yVal, op]);

  const opSymbol = { AND: '&', OR: '|', XOR: '^', NOT: '~' };
  const logicalSymbol = { AND: '&&', OR: '||', NOT: '!', XOR: '—' };

  const toolDesc = {
    AND: { label: "마스킹", desc: "1인 위치만 원래 값이 통과합니다" },
    OR: { label: "합치기", desc: "1인 위치의 비트를 켭니다" },
    XOR: { label: "토글", desc: "1인 위치의 비트가 뒤집힙니다" },
    NOT: { label: "전체 반전", desc: "모든 비트가 뒤집힙니다" },
  };

  const getBitColor = (i) => {
    switch (op) {
      case 'AND': return (x[i] && y[i]) ? C.green : C.red;
      case 'OR': return (x[i] || y[i]) ? C.green : C.textMuted;
      case 'XOR': return (x[i] !== y[i]) ? C.green : C.textMuted;
      case 'NOT': return x[i] ? C.textMuted : C.green;
      default: return C.textMuted;
    }
  };

  const hex = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');

  return (
    <section style={{ marginTop: "4rem" }}>
      <SectionTitle subtitle="AND, OR, XOR, NOT — 비트를 다루는 네 가지 도구">
        2. 비트 연산의 직관
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        비트 연산은 각 비트 위치에서 <strong style={{ color: C.accent }}>독립적으로</strong> 작동하는 도구입니다.
        각각의 역할을 &quot;도구&quot;로 이해하면 직관적입니다:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "1.5rem 0" }}>
        {[
          { op: 'AND', color: C.blue, desc: '마스킹 — 특정 비트만 추출' },
          { op: 'OR', color: C.green, desc: '합치기 — 특정 비트를 켬' },
          { op: 'XOR', color: C.purple, desc: '토글 — 특정 비트를 뒤집음' },
          { op: 'NOT', color: C.red, desc: '전체 반전' },
        ].map(item => (
          <div key={item.op} style={{
            flex: "1 1 180px", padding: "0.75rem 1rem",
            background: `${item.color}10`, border: `1px solid ${item.color}30`,
            borderRadius: 10,
          }}>
            <strong style={{ color: item.color, fontFamily: "var(--font-mono)" }}>{item.op}</strong>
            <span style={{ color: C.textDim, fontSize: "0.85rem" }}> = {item.desc}</span>
          </div>
        ))}
      </div>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.purple }}>XOR</strong>의 특별한 성질:{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>x ^ x = 0</span>,{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>x ^ 0 = x</span>.
        자기 자신에 대한 역원이 존재하기 때문에, XOR swap이나 암호화에 활용됩니다.
      </p>

      <Box color={C.red} label="주의">
        <strong style={{ color: C.red }}>비트 연산 vs 논리 연산</strong>:{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>&amp;</span>와{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>&amp;&amp;</span>는 근본적으로 다릅니다.
        비트 연산은 <strong style={{ color: C.accent }}>각 비트 위치에서 독립적으로</strong> 연산하고,
        논리 연산은 피연산자 전체를 <strong style={{ color: C.accent }}>&quot;0이냐 아니냐&quot;</strong>로만 판단합니다.
        <br /><br />
        위험한 예:{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.orange }}>x = 0x01, y = 0x02</span>일 때{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>x &amp; y = 0</span>(거짓!), 하지만{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>x &amp;&amp; y = 1</span>(참).
      </Box>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        8비트 값에서 하위 4비트만 추출하려면 어떤 비트 연산을 사용해야 할까요?
      </Question>
      <Answer visible={q1}>
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>x &amp; 0x0F</span>로 마스킹합니다.
        0x0F(= 00001111)에서 1인 위치의 비트만 통과하고, 0인 위치는 무조건 0이 됩니다.
        이것이 AND의 <strong style={{ color: C.blue }}>&quot;마스킹&quot;</strong> 역할입니다.
      </Answer>

      <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
        0x66 &amp; 0x93과 0x66 &amp;&amp; 0x93의 결과가 왜 다를까요?
      </Question>
      <Answer visible={q2}>
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>&amp;</span>는 비트 단위로 연산합니다:{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>0110 0110 &amp; 1001 0011 = 0000 0010</span> (= 2).
        <br /><br />
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>&amp;&amp;</span>는
        &quot;0x66은 0이 아니니 참, 0x93도 0이 아니니 참, 참 &amp;&amp; 참 = 1&quot;로 판단합니다.
        비트 패턴을 전혀 보지 않고 0인지 아닌지만 봅니다.
      </Answer>

      <Panel>
        {/* Operation buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {['AND', 'OR', 'XOR', 'NOT'].map(o => (
            <button key={o} onClick={() => setOp(o)} style={{
              flex: "1 1 60px", padding: "10px 16px", borderRadius: 8,
              background: op === o ? `${C.accent}20` : C.surface,
              border: `1.5px solid ${op === o ? C.accent : C.border}`,
              color: op === o ? C.accent : C.textDim,
              fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
            }}>{o}</button>
          ))}
        </div>

        {/* x input */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: C.blue, fontWeight: 700, fontFamily: "var(--font-mono)", width: 20 }}>x</span>
            <div style={{ display: "flex", gap: 3 }}>
              {x.map((b, i) => (
                <BitCell key={i} value={b} onClick={() => toggleBit(x, setX, i)} color={C.blue} />
              ))}
            </div>
            <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              = {hex(xVal)}
            </span>
          </div>
        </div>

        {/* y input (hidden for NOT) */}
        {op !== 'NOT' && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.green, fontWeight: 700, fontFamily: "var(--font-mono)", width: 20 }}>y</span>
              <div style={{ display: "flex", gap: 3 }}>
                {y.map((b, i) => (
                  <BitCell key={i} value={b} onClick={() => toggleBit(y, setY, i)} color={C.green} />
                ))}
              </div>
              <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                = {hex(yVal)}
              </span>
            </div>
          </div>
        )}

        {/* Operation symbol */}
        <div style={{
          textAlign: "center", color: C.accent, fontFamily: "var(--font-mono)",
          fontSize: "1.2rem", fontWeight: 700, margin: "8px 0", paddingLeft: 28,
        }}>
          {opSymbol[op]}
        </div>

        <div style={{ borderTop: `1px dashed ${C.border}`, margin: "8px 0 12px 28px" }} />

        {/* Result */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: C.accent, fontWeight: 700, fontFamily: "var(--font-mono)", width: 20 }}>r</span>
          <div style={{ display: "flex", gap: 3 }}>
            {result.map((b, i) => (
              <BitCell key={i} value={b} color={getBitColor(i)} />
            ))}
          </div>
          <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            = {hex(rVal)}
          </span>
        </div>

        {/* Tool description */}
        <div style={{
          marginTop: "1.5rem", padding: "0.75rem 1rem",
          background: `${C.accent}08`, borderRadius: 8, border: `1px solid ${C.accent}20`,
        }}>
          <span style={{ color: C.accent, fontWeight: 700 }}>{toolDesc[op].label}</span>
          <span style={{ color: C.textDim }}> — {toolDesc[op].desc}</span>
        </div>

        {/* Bitwise vs Logical comparison */}
        {op !== 'XOR' && (
          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => setShowLogical(!showLogical)} style={{
              padding: "8px 16px", borderRadius: 8,
              background: showLogical ? `${C.orange}15` : C.surface,
              border: `1px solid ${showLogical ? C.orange : C.border}`,
              color: showLogical ? C.orange : C.textDim,
              cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, fontFamily: "inherit",
            }}>
              {showLogical ? '비교 숨기기' : '비트 연산 vs 논리 연산 비교 보기'}
            </button>

            {showLogical && (
              <div style={{
                marginTop: 12, padding: "1rem",
                background: C.surface, borderRadius: 10,
                border: `1px solid ${C.border}`,
                display: "flex", gap: 24, flexWrap: "wrap",
              }}>
                <div>
                  <div style={{ color: C.textMuted, fontSize: "0.75rem", marginBottom: 4 }}>비트 연산</div>
                  <span style={{ fontFamily: "var(--font-mono)", color: C.accent, fontSize: "1.1rem" }}>
                    {hex(xVal)} {opSymbol[op]}{' '}
                    {op !== 'NOT' ? hex(yVal) + ' ' : ''}
                    = <strong>{rVal}</strong>
                  </span>
                </div>
                <div>
                  <div style={{ color: C.textMuted, fontSize: "0.75rem", marginBottom: 4 }}>논리 연산</div>
                  <span style={{ fontFamily: "var(--font-mono)", color: C.orange, fontSize: "1.1rem" }}>
                    {hex(xVal)} {logicalSymbol[op]}{' '}
                    {op !== 'NOT' ? hex(yVal) + ' ' : ''}
                    = <strong>{logicalResult}</strong>
                  </span>
                </div>
                {rVal !== logicalResult && (
                  <div style={{
                    width: "100%", padding: "8px 12px",
                    background: `${C.red}15`, borderRadius: 8, border: `1px solid ${C.red}30`,
                    color: C.red, fontSize: "0.85rem",
                  }}>
                    ⚠ 결과가 다릅니다! 비트 연산은 각 비트를 개별 처리하고, 논리 연산은 0인지 아닌지만 판단합니다.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 3 — 2의 보수
   ══════════════════════════════════════════════════════ */

function TwosComplementSection() {
  const [bits, setBits] = useState(4);
  const [inputMode, setInputMode] = useState('decimal');
  const [decInput, setDecInput] = useState('-5');
  const [bitArray, setBitArray] = useState([1, 0, 1, 1]);
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [negateResult, setNegateResult] = useState(null);

  const tmin = -Math.pow(2, bits - 1);
  const tmax = Math.pow(2, bits - 1) - 1;

  const currentBits = useMemo(() => {
    if (inputMode === 'decimal') {
      const val = parseInt(decInput);
      if (isNaN(val)) return Array(bits).fill(0);
      const clamped = Math.max(tmin, Math.min(tmax, val));
      return toTwosComp(clamped, bits).split('').map(Number);
    }
    return bitArray.length === bits ? bitArray : Array(bits).fill(0);
  }, [inputMode, decInput, bitArray, bits, tmin, tmax]);

  const signedVal = fromSigned(currentBits.join(''));
  const unsignedVal = fromUnsigned(currentBits.join(''));

  const weights = useMemo(() => {
    const w = [];
    for (let i = 0; i < bits; i++) {
      if (i === 0) w.push(-Math.pow(2, bits - 1));
      else w.push(Math.pow(2, bits - 1 - i));
    }
    return w;
  }, [bits]);

  const handleBitsChange = (newBits) => {
    setBits(newBits);
    setInputMode('decimal');
    setDecInput('0');
    setBitArray(Array(newBits).fill(0));
    setNegateResult(null);
  };

  const toggleBitAt = (i) => {
    const base = inputMode === 'bits' ? bitArray : currentBits;
    const next = [...base];
    next[i] = next[i] ? 0 : 1;
    setBitArray(next);
    setInputMode('bits');
    setNegateResult(null);
  };

  const handleDecInput = (e) => {
    setInputMode('decimal');
    setDecInput(e.target.value);
    setNegateResult(null);
  };

  const doNegate = () => {
    const original = currentBits.join('');
    const flipped = original.split('').map(b => b === '0' ? '1' : '0').join('');
    const flippedVal = parseInt(flipped, 2);
    const plusOne = ((flippedVal + 1) % Math.pow(2, bits)).toString(2).padStart(bits, '0');
    const resultSigned = fromSigned(plusOne);
    const isTMin = signedVal === tmin;
    setNegateResult({ original, flipped, plusOne, resultSigned, isTMin });
  };

  return (
    <section style={{ marginTop: "4rem" }}>
      <SectionTitle subtitle="하드웨어를 단순하게 만드는 가장 영리한 선택">
        3. 2의 보수 — 음수를 표현하는 가장 영리한 방법
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        이진수로 음수를 어떻게 표현할까요?{' '}
        <strong style={{ color: C.accent }}>부호-크기(sign-magnitude)</strong> 방식은
        MSB를 부호 비트로 사용하지만, 덧셈 시 부호 비교, 절댓값 비교, 뺄셈 로직이 필요하고,
        0이 두 개(+0, -0) 존재하는 문제가 있습니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.accent }}>2의 보수(two&#39;s complement)</strong>는 이 모든 문제를 해결합니다.
        동일한 덧셈 회로 하나로 모든 부호 조합의 연산을 처리하며, 0의 표현이 하나뿐입니다.
      </p>

      <Box color={C.orange} label="핵심 원리">
        4비트에서{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>-2 + 2 = 1110 + 0010 = <strong style={{ color: C.accent }}>1</strong>0000</span>.
        캐리(넘침)가 자연스럽게 버려져{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>0000</span>이 됩니다.
        별도의 뺄셈 회로가 필요 없습니다!
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.red }}>비대칭 구조</strong>: n비트 2의 보수의 범위는{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>-2^(n-1)</span> ~{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>2^(n-1)-1</span>.
        음수가 하나 더 많습니다 (<span style={{ fontFamily: "var(--font-mono)" }}>TMin = -TMax - 1</span>).
        -0이 없으므로 그 자리에 음수를 하나 더 표현하기 때문입니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.red }}>TMin의 특수성</strong>:{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>-TMin = TMin</span>.
        부정해도 자기 자신이 됩니다. 이것이{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>abs(INT_MIN)</span>이 음수를 반환하는 실제 버그의 원인입니다.
      </p>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        부호-크기 방식 대신 2의 보수가 채택된 근본적인 이유는 무엇일까요?
      </Question>
      <Answer visible={q1}>
        <strong style={{ color: C.accent }}>하드웨어 단순성</strong>입니다.
        부호-크기에서는 부호 비교 → 절댓값 비교 → 뺄셈 or 덧셈 → 결과 부호 결정이라는 복잡한 과정이 필요합니다.
        2의 보수에서는 부호에 관계없이 <strong style={{ color: C.green }}>동일한 덧셈기 하나</strong>로 모든 연산을 처리합니다.
      </Answer>

      <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
        4비트에서 TMin(1000)을 부정(비트 반전 + 1)하면 어떤 일이 일어날까요?
      </Question>
      <Answer visible={q2}>
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>1000 → 0111 → 1000</span>.
        자기 자신으로 돌아옵니다. +8은 4비트 2의 보수(범위 -8~+7)로 표현 불가능하기 때문입니다.
        이것은 실제로 <span style={{ fontFamily: "var(--font-mono)" }}>abs(INT_MIN)</span>이
        여전히 음수를 반환하는 버그의 원인이 됩니다.
      </Answer>

      <Panel>
        {/* Bit width selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          {[4, 8, 16].map(b => (
            <button key={b} onClick={() => handleBitsChange(b)} style={{
              padding: "8px 20px", borderRadius: 8,
              background: bits === b ? `${C.accent}20` : C.surface,
              border: `1.5px solid ${bits === b ? C.accent : C.border}`,
              color: bits === b ? C.accent : C.textDim,
              fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
            }}>{b}비트</button>
          ))}
        </div>

        {/* Decimal input */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: C.textMuted, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
            10진수 입력 (범위: {tmin} ~ {tmax})
          </label>
          <input
            value={inputMode === 'decimal' ? decInput : signedVal.toString()}
            onChange={handleDecInput}
            type="number"
            min={tmin} max={tmax}
            style={{
              width: 200, padding: "10px 14px",
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 10, color: C.text, fontSize: "1rem",
              fontFamily: "var(--font-mono)", outline: "none",
            }}
          />
        </div>

        {/* Weights + bit cells */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
            {/* Weight labels */}
            <div style={{ display: "flex", gap: 3 }}>
              {weights.map((w, i) => (
                <div key={i} style={{
                  width: 38, textAlign: "center",
                  fontSize: bits <= 8 ? "0.65rem" : "0.55rem",
                  fontFamily: "var(--font-mono)",
                  color: i === 0 ? C.red : C.green,
                }}>
                  {w > 0 ? `+${w}` : w}
                </div>
              ))}
            </div>

            {/* Bit cells */}
            <div style={{ display: "flex", gap: 3 }}>
              {currentBits.map((b, i) => (
                <BitCell key={i} value={b} onClick={() => toggleBitAt(i)} color={i === 0 ? C.red : C.accent} />
              ))}
            </div>

            {/* MSB label */}
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 38, textAlign: "center", fontSize: "0.6rem", color: C.red }}>MSB</div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div style={{
          marginTop: "1rem", padding: "1rem",
          background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
          overflowX: "auto",
        }}>
          <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: 8 }}>가중치 계산:</div>
          <div style={{ fontFamily: "var(--font-mono)", color: C.textDim, fontSize: "0.85rem", lineHeight: 2, whiteSpace: "nowrap" }}>
            {currentBits.map((b, i) => (
              <span key={i}>
                {i > 0 && ' + '}
                <span style={{ color: b ? (i === 0 ? C.red : C.green) : C.textMuted }}>
                  ({b} × {weights[i]})
                </span>
              </span>
            ))}
            {' = '}
            <strong style={{ color: C.accent, fontSize: "1.1rem" }}>{signedVal}</strong>
          </div>
        </div>

        {/* Signed vs Unsigned */}
        <div style={{ display: "flex", gap: 16, marginTop: "1rem", flexWrap: "wrap" }}>
          <div style={{
            flex: "1 1 180px", padding: "1rem",
            background: C.surface, borderRadius: 10, border: `1px solid ${C.accent}30`,
          }}>
            <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 4 }}>Signed (2의 보수)</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", color: C.accent, fontWeight: 700 }}>
              {signedVal}
            </div>
          </div>
          <div style={{
            flex: "1 1 180px", padding: "1rem",
            background: C.surface, borderRadius: 10, border: `1px solid ${C.orange}30`,
          }}>
            <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 4 }}>Unsigned</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", color: C.orange, fontWeight: 700 }}>
              {unsignedVal}
            </div>
          </div>
        </div>

        {signedVal !== unsignedVal && (
          <Box color={C.yellow} label="핵심 통찰">
            동일한 비트 패턴{' '}
            <span style={{ fontFamily: "var(--font-mono)" }}>{currentBits.join('')}</span>이{' '}
            signed로는 <strong style={{ color: C.accent }}>{signedVal}</strong>,{' '}
            unsigned로는 <strong style={{ color: C.orange }}>{unsignedVal}</strong>로 해석됩니다.
            비트는 같지만 해석이 다릅니다!
          </Box>
        )}

        {/* Negate */}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={doNegate} style={{
            padding: "10px 24px", borderRadius: 10,
            background: `${C.purple}15`, border: `1.5px solid ${C.purple}50`,
            color: C.purple, cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
            fontFamily: "inherit",
          }}>
            부정(Negate): 비트 반전 + 1
          </button>

          {negateResult && (
            <div style={{
              marginTop: 12, padding: "1rem",
              background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", lineHeight: 2.2 }}>
                <div>
                  <span style={{ color: C.textMuted, display: "inline-block", minWidth: 60 }}>원래:</span>
                  <span style={{ color: C.text }}>{negateResult.original}</span>
                  <span style={{ color: C.textMuted }}> ({signedVal})</span>
                </div>
                <div>
                  <span style={{ color: C.textMuted, display: "inline-block", minWidth: 60 }}>반전:</span>
                  <span style={{ color: C.purple }}>{negateResult.flipped}</span>
                </div>
                <div>
                  <span style={{ color: C.textMuted, display: "inline-block", minWidth: 60 }}>+1:</span>
                  <span style={{ color: C.accent }}>{negateResult.plusOne}</span>
                  <span style={{ color: C.textMuted }}> ({negateResult.resultSigned})</span>
                </div>
              </div>
              {negateResult.isTMin && (
                <div style={{
                  marginTop: 8, padding: "8px 12px",
                  background: `${C.red}15`, borderRadius: 8, border: `1px solid ${C.red}30`,
                  color: C.red, fontSize: "0.85rem",
                }}>
                  ⚠ TMin을 부정하면 자기 자신이 됩니다! {signedVal}의 양수 대응값은 {bits}비트로 표현할 수 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* TMin/TMax */}
        <div style={{ marginTop: "1rem", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{
            flex: "1 1 140px", padding: "0.75rem 1rem",
            background: `${C.red}08`, borderRadius: 8, border: `1px solid ${C.red}20`, textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: C.red, marginBottom: 2 }}>TMin</div>
            <div style={{ fontFamily: "var(--font-mono)", color: C.red, fontWeight: 700, fontSize: "1.1rem" }}>{tmin}</div>
            <div style={{ fontFamily: "var(--font-mono)", color: C.textMuted, fontSize: "0.7rem" }}>{toTwosComp(tmin, bits)}</div>
          </div>
          <div style={{
            flex: "1 1 140px", padding: "0.75rem 1rem",
            background: `${C.green}08`, borderRadius: 8, border: `1px solid ${C.green}20`, textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: C.green, marginBottom: 2 }}>TMax</div>
            <div style={{ fontFamily: "var(--font-mono)", color: C.green, fontWeight: 700, fontSize: "1.1rem" }}>{tmax}</div>
            <div style={{ fontFamily: "var(--font-mono)", color: C.textMuted, fontSize: "0.7rem" }}>{toTwosComp(tmax, bits)}</div>
          </div>
        </div>
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 4 — Signed ↔ Unsigned, 보이지 않는 함정
   ══════════════════════════════════════════════════════ */

function SignedUnsignedSection() {
  const [inputVal, setInputVal] = useState('-1');
  const [q1, setQ1] = useState(false);

  // Comparison simulator
  const [compA, setCompA] = useState('-1');
  const [compB, setCompB] = useState('0');
  const [typeA, setTypeA] = useState('signed');
  const [typeB, setTypeB] = useState('unsigned');

  const parsedVal = parseInt(inputVal);
  const isValid = !isNaN(parsedVal) && parsedVal >= -2147483648 && parsedVal <= 2147483647;

  const bits32 = useMemo(() => {
    if (!isValid) return null;
    const mod = 4294967296;
    const v = ((parsedVal % mod) + mod) % mod;
    return v.toString(2).padStart(32, '0');
  }, [parsedVal, isValid]);

  const signedInterp = useMemo(() => {
    if (!bits32) return null;
    const u = parseInt(bits32, 2);
    if (bits32[0] === '1') return u - 4294967296;
    return u;
  }, [bits32]);

  const unsignedInterp = useMemo(() => {
    if (!bits32) return null;
    return parseInt(bits32, 2);
  }, [bits32]);

  const formatBits = (bitStr) => {
    if (!bitStr) return [];
    const groups = [];
    for (let i = 0; i < bitStr.length; i += 4) {
      groups.push(bitStr.substring(i, i + 4));
    }
    return groups;
  };

  // Comparison logic
  const compResult = useMemo(() => {
    const a = parseInt(compA);
    const b = parseInt(compB);
    if (isNaN(a) || isNaN(b)) return null;

    const mod = 4294967296;
    const aU = ((a % mod) + mod) % mod;
    const bU = ((b % mod) + mod) % mod;
    const aS = aU > 2147483647 ? aU - mod : aU;
    const bS = bU > 2147483647 ? bU - mod : bU;

    let converted = false;
    let explanation = '';
    let result;

    if (typeA === 'unsigned' || typeB === 'unsigned') {
      result = aU < bU;
      const parts = [];
      if (typeA === 'signed' && aS < 0) {
        converted = true;
        parts.push(`${aS}(signed)가 unsigned로 변환 → ${aU.toLocaleString()}`);
      }
      if (typeB === 'signed' && bS < 0) {
        converted = true;
        parts.push(`${bS}(signed)가 unsigned로 변환 → ${bU.toLocaleString()}`);
      }
      if (parts.length) explanation = parts.join('. ') + '. ';
      explanation += `unsigned 비교: ${aU.toLocaleString()} < ${bU.toLocaleString()} → ${result ? '참(true)' : '거짓(false)'}`;
    } else {
      result = aS < bS;
      explanation = `signed 비교: ${aS.toLocaleString()} < ${bS.toLocaleString()} → ${result ? '참(true)' : '거짓(false)'}`;
    }

    return { result, converted, explanation };
  }, [compA, compB, typeA, typeB]);

  return (
    <section style={{ marginTop: "4rem" }}>
      <SectionTitle subtitle="비트 패턴은 그대로, 해석 방식만 변경">
        4. Signed ↔ Unsigned, 보이지 않는 함정
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        C에서 signed와 unsigned를 같은 표현식에 섞으면,{' '}
        <strong style={{ color: C.red }}>signed가 unsigned로 암묵적 변환</strong>됩니다.
        규칙은 단순합니다: <strong style={{ color: C.accent }}>비트 패턴은 그대로, 해석 방식만 변경</strong>.
      </p>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        -1 &lt; 0u의 결과가 참일까요, 거짓일까요? 왜 그런지 비트 패턴을 추적해 보세요.
      </Question>
      <Answer visible={q1}>
        <strong style={{ color: C.red }}>거짓</strong>입니다.{' '}
        -1은 모든 비트가 1인 패턴(0xFFFFFFFF)이고, unsigned로 재해석되면 그 타입의 최댓값이 됩니다.
        비교가 4294967295 &lt; 0이 되어 거짓이 되죠.{' '}
        <strong style={{ color: C.yellow }}>비트 패턴은 그대로인데 해석만 바뀌어 전혀 다른 값이 된 것</strong>입니다.
      </Answer>

      <Box color={C.orange} label="실전 함정">
        <CodeBlock>{`unsigned int len = strlen(input);  // len = 5
int diff = len - 10;               // unsigned 연산! → 매우 큰 양수
if (diff < 0) { ... }              // 의도대로 동작하지 않음`}</CodeBlock>
        안전한 수정: <span style={{ fontFamily: "var(--font-mono)", color: C.green }}>if (len &lt; 10)</span> — unsigned 도메인에서 직접 비교
      </Box>

      {/* Interactive: Signed ↔ Unsigned */}
      <Panel>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ color: C.textMuted, fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
            32비트 signed 정수 입력 (-2147483648 ~ 2147483647)
          </label>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            type="number"
            style={{
              width: "100%", maxWidth: 300, padding: "10px 14px",
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 10, color: C.text, fontSize: "1rem",
              fontFamily: "var(--font-mono)", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {bits32 && (
          <>
            {/* Bit pattern */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 6 }}>비트 패턴 (32비트)</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                {formatBits(bits32).map((g, i) => (
                  <span key={i} style={{
                    color: i === 0 && bits32[0] === '1' ? C.red : C.accent,
                    background: `${i === 0 && bits32[0] === '1' ? C.red : C.accent}10`,
                    padding: "4px 6px", borderRadius: 4, letterSpacing: "1px",
                  }}>{g}</span>
                ))}
              </div>
            </div>

            {/* Interpretations */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{
                flex: "1 1 200px", padding: "1rem",
                background: C.surface, borderRadius: 10, border: `1px solid ${C.accent}30`,
              }}>
                <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 4 }}>Signed 해석</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: C.accent, fontWeight: 700 }}>
                  {signedInterp?.toLocaleString()}
                </div>
              </div>
              <div style={{
                flex: "1 1 200px", padding: "1rem",
                background: C.surface, borderRadius: 10, border: `1px solid ${C.orange}30`,
              }}>
                <div style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 4 }}>Unsigned 해석</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: C.orange, fontWeight: 700 }}>
                  {unsignedInterp?.toLocaleString()}
                </div>
              </div>
            </div>

            {signedInterp !== unsignedInterp && (
              <div style={{
                marginTop: 12, padding: "10px 14px",
                background: `${C.red}10`, borderRadius: 8, border: `1px solid ${C.red}30`,
                color: C.red, fontSize: "0.85rem",
              }}>
                ⚠ C에서 이 값이 unsigned와 비교되면{' '}
                <strong>{unsignedInterp?.toLocaleString()}</strong>로 취급됩니다.
              </div>
            )}
          </>
        )}

        {/* Comparison simulator */}
        <div style={{ marginTop: "2rem", borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
          <div style={{ fontSize: "0.9rem", color: C.text, fontWeight: 700, marginBottom: "1rem" }}>
            비교 시뮬레이터: a &lt; b
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: "1rem" }}>
            <div>
              <label style={{ color: C.textMuted, fontSize: "0.75rem", display: "block", marginBottom: 4 }}>a</label>
              <input value={compA} onChange={(e) => setCompA(e.target.value)} type="number" style={{
                width: 120, padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none",
              }} />
            </div>
            <div>
              <select value={typeA} onChange={(e) => setTypeA(e.target.value)} style={{
                padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 8, color: C.accent, fontSize: "0.85rem", outline: "none", cursor: "pointer",
              }}>
                <option value="signed">signed</option>
                <option value="unsigned">unsigned</option>
              </select>
            </div>
            <div style={{ color: C.textMuted, fontSize: "1.2rem", fontFamily: "var(--font-mono)", paddingBottom: 4 }}>&lt;</div>
            <div>
              <label style={{ color: C.textMuted, fontSize: "0.75rem", display: "block", marginBottom: 4 }}>b</label>
              <input value={compB} onChange={(e) => setCompB(e.target.value)} type="number" style={{
                width: 120, padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none",
              }} />
            </div>
            <div>
              <select value={typeB} onChange={(e) => setTypeB(e.target.value)} style={{
                padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 8, color: C.accent, fontSize: "0.85rem", outline: "none", cursor: "pointer",
              }}>
                <option value="signed">signed</option>
                <option value="unsigned">unsigned</option>
              </select>
            </div>
          </div>

          {compResult && (
            <div style={{
              padding: "1rem", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
            }}>
              <div style={{
                fontSize: "1.3rem", fontWeight: 700, marginBottom: 8,
                fontFamily: "var(--font-mono)",
                color: compResult.result ? C.green : C.red,
              }}>
                {compResult.result ? 'TRUE (참)' : 'FALSE (거짓)'}
              </div>
              <div style={{ color: C.textDim, fontSize: "0.85rem", lineHeight: 1.7 }}>
                {compResult.explanation}
              </div>
              {compResult.converted && (
                <div style={{
                  marginTop: 8, padding: "6px 10px",
                  background: `${C.yellow}10`, borderRadius: 6, border: `1px solid ${C.yellow}30`,
                  color: C.yellow, fontSize: "0.8rem",
                }}>
                  ⚠ 암묵적 타입 변환이 발생했습니다!
                </div>
              )}
            </div>
          )}
        </div>
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 5 — 확장, 절삭, 오버플로우
   ══════════════════════════════════════════════════════ */

function ExtTruncOverflowSection() {
  // Extension / Truncation
  const [extMode, setExtMode] = useState('ext');
  const [extBits, setExtBits] = useState([1, 0, 1, 1]); // 4-bit for extension
  const [truncBits, setTruncBits] = useState([0, 0, 0, 1, 0, 0, 1, 1]); // 8-bit for truncation
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);

  // Overflow calculator
  const [ovType, setOvType] = useState('unsigned');
  const [ovA, setOvA] = useState('12');
  const [ovB, setOvB] = useState('6');

  // Extension: 4→8
  const extResult = useMemo(() => {
    const signBit = extBits[0];
    const extended = [...Array(4).fill(signBit), ...extBits];
    const origSigned = fromSigned(extBits.join(''));
    const extSigned = fromSigned(extended.join(''));
    return { extended, origSigned, extSigned, signBit };
  }, [extBits]);

  // Truncation: 8→4
  const truncResult = useMemo(() => {
    const lower = truncBits.slice(4);
    const origSigned = fromSigned(truncBits.join(''));
    const origUnsigned = fromUnsigned(truncBits.join(''));
    const truncSigned = fromSigned(lower.join(''));
    const truncUnsigned = fromUnsigned(lower.join(''));
    return { lower, origSigned, origUnsigned, truncSigned, truncUnsigned };
  }, [truncBits]);

  // Overflow
  const ovResult = useMemo(() => {
    const a = parseInt(ovA);
    const b = parseInt(ovB);
    if (isNaN(a) || isNaN(b)) return null;

    const mod = 16; // 4-bit
    const mathResult = a + b;

    if (ovType === 'unsigned') {
      const actual = ((mathResult % mod) + mod) % mod;
      const overflow = mathResult >= mod || mathResult < 0;
      return {
        mathResult,
        actual,
        overflow,
        mathBits: mathResult >= 0 ? mathResult.toString(2) : 'N/A',
        actualBits: actual.toString(2).padStart(4, '0'),
        warning: overflow ? `${mathResult}은 4비트 unsigned 범위(0~15)를 벗어남` : null,
      };
    } else {
      const raw = ((mathResult % mod) + mod) % mod;
      const actual = raw > 7 ? raw - 16 : raw;
      const posOverflow = a > 0 && b > 0 && actual < 0;
      const negOverflow = a < 0 && b < 0 && actual >= 0;
      const overflow = posOverflow || negOverflow;
      return {
        mathResult,
        actual,
        overflow,
        mathBits: mathResult >= 0 ? mathResult.toString(2) : '(' + toTwosComp(mathResult, 5) + ')',
        actualBits: toTwosComp(actual, 4),
        warning: posOverflow ? '양수 + 양수 → 음수! (positive overflow)' :
                 negOverflow ? '음수 + 음수 → 양수! (negative overflow)' : null,
      };
    }
  }, [ovA, ovB, ovType]);

  const toggleExtBit = (i) => {
    const next = [...extBits];
    next[i] = next[i] ? 0 : 1;
    setExtBits(next);
  };

  const toggleTruncBit = (i) => {
    const next = [...truncBits];
    next[i] = next[i] ? 0 : 1;
    setTruncBits(next);
  };

  return (
    <section style={{ marginTop: "4rem" }}>
      <SectionTitle subtitle="모듈러 산술이라는 하나의 원리">
        5. 확장, 절삭, 오버플로우
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.accent }}>부호 확장(Sign Extension)</strong>: 작은 타입 → 큰 타입으로 변환할 때,
        부호 비트와 같은 값으로 상위 비트를 채웁니다. 새로 추가된 비트들의 가중치 합이 원래 MSB의 가중치와 동일해지기 때문에 값이 보존됩니다.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.accent }}>절삭(Truncation)</strong>: 큰 타입 → 작은 타입. 상위 비트를 잘라냅니다.
        본질은 <strong style={{ color: C.orange }}>모듈러 연산</strong>:{' '}
        <span style={{ fontFamily: "var(--font-mono)" }}>결과 = 원래값 mod 2^n</span>.
      </p>
      <p style={{ color: C.textDim, lineHeight: 1.8 }}>
        <strong style={{ color: C.red }}>오버플로우(Overflow)</strong>도 같은 원리입니다.
        Unsigned 오버플로우는 예측 가능하지만(C 표준 정의),
        signed 오버플로우는 <strong style={{ color: C.red }}>부호가 뒤집힐 수 있고</strong>,
        C에서 <strong style={{ color: C.red }}>undefined behavior</strong>입니다.
        컴파일러가 signed 오버플로우가 없다고 가정하고 최적화하여 보안 검사를 무력화하는 사례도 있습니다.
      </p>

      <Question number={1} revealed={q1} onReveal={() => setQ1(true)}>
        4비트 2의 보수 값 1011(-5)을 8비트로 확장하려면 상위 비트를 무엇으로 채워야 할까요? 왜?
      </Question>
      <Answer visible={q1}>
        부호 비트인 <strong style={{ color: C.red }}>1</strong>로 채웁니다. 결과{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>11111011</span>을
        부정하면 00000100 + 1 = 00000101 = 5이므로, 원래 값 -5가 보존됩니다.
        <br /><br />
        원리적으로는 새로 추가된 1들의 가중치 합(-128+64+32+16+8 = -8)이
        원래 4비트 MSB의 가중치(-8)와 정확히 같아지기 때문입니다.
      </Answer>

      <Question number={2} revealed={q2} onReveal={() => setQ2(true)}>
        4비트 signed에서 5 + 4를 계산하면 어떤 일이 일어날까요?
      </Question>
      <Answer visible={q2}>
        <span style={{ fontFamily: "var(--font-mono)", color: C.accent }}>0101 + 0100 = 1001</span>이고,
        이를 signed로 해석하면 <strong style={{ color: C.red }}>-7</strong>입니다.
        양수 + 양수가 음수가 되어버렸습니다.
        결과가 범위(-8~+7)를 넘어서 9 - 16 = -7로 감싸진 것이며,
        이것이 <strong style={{ color: C.red }}>signed 오버플로우</strong>의 위험성입니다.
      </Answer>

      {/* Extension / Truncation Visualizer */}
      <Panel>
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          <button onClick={() => setExtMode('ext')} style={{
            flex: 1, padding: "10px 16px", borderRadius: 8,
            background: extMode === 'ext' ? `${C.accent}20` : C.surface,
            border: `1.5px solid ${extMode === 'ext' ? C.accent : C.border}`,
            color: extMode === 'ext' ? C.accent : C.textDim,
            fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
          }}>확장(Extension) 4→8비트</button>
          <button onClick={() => setExtMode('trunc')} style={{
            flex: 1, padding: "10px 16px", borderRadius: 8,
            background: extMode === 'trunc' ? `${C.accent}20` : C.surface,
            border: `1.5px solid ${extMode === 'trunc' ? C.accent : C.border}`,
            color: extMode === 'trunc' ? C.accent : C.textDim,
            fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
          }}>절삭(Truncation) 8→4비트</button>
        </div>

        {extMode === 'ext' ? (
          <div>
            <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: 8 }}>4비트 입력 (클릭하여 토글):</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {extBits.map((b, i) => (
                <BitCell key={i} value={b} onClick={() => toggleExtBit(i)} color={i === 0 ? C.red : C.accent} />
              ))}
              <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center", marginLeft: 8 }}>
                = {extResult.origSigned} (signed)
              </span>
            </div>

            <div style={{ textAlign: "center", color: C.textMuted, margin: "8px 0", fontSize: "1.2rem" }}>↓ 부호 확장 ↓</div>

            <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: 8 }}>8비트 결과:</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
              {extResult.extended.map((b, i) => (
                <BitCell key={i} value={b} color={
                  i < 4 ? (extResult.signBit ? C.purple : C.green) : (i === 4 ? C.red : C.accent)
                } />
              ))}
              <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center", marginLeft: 8 }}>
                = {extResult.extSigned} (signed)
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.8rem" }}>
              <span style={{ color: extResult.signBit ? C.purple : C.green }}>
                ■ 부호 확장 비트 (부호 비트 {extResult.signBit}로 채움)
              </span>
              <span style={{ color: C.accent }}>■ 원래 비트</span>
            </div>

            {extResult.origSigned === extResult.extSigned && (
              <div style={{
                marginTop: 12, padding: "8px 12px",
                background: `${C.green}10`, borderRadius: 8, border: `1px solid ${C.green}30`,
                color: C.green, fontSize: "0.85rem",
              }}>
                ✓ 값이 보존됨: {extResult.origSigned} → {extResult.extSigned}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: 8 }}>8비트 입력 (클릭하여 토글):</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {truncBits.map((b, i) => (
                <BitCell key={i} value={b} onClick={() => toggleTruncBit(i)}
                  color={i < 4 ? C.textMuted : (i === 4 ? C.red : C.accent)}
                />
              ))}
              <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center", marginLeft: 8 }}>
                = {truncResult.origUnsigned} (unsigned)
              </span>
            </div>

            <div style={{ textAlign: "center", color: C.textMuted, margin: "8px 0", fontSize: "1.2rem" }}>↓ 상위 4비트 절삭 ↓</div>

            <div style={{ fontSize: "0.8rem", color: C.textMuted, marginBottom: 8 }}>4비트 결과:</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
              {/* Faded upper bits */}
              {truncBits.slice(0, 4).map((b, i) => (
                <BitCell key={i} value={b} color={C.textMuted} size={38} />
              ))}
              <span style={{ color: C.red, fontSize: "1.2rem", alignSelf: "center" }}>|</span>
              {truncResult.lower.map((b, i) => (
                <BitCell key={i + 4} value={b} color={C.accent} />
              ))}
              <span style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center", marginLeft: 8 }}>
                = {truncResult.truncUnsigned} (unsigned)
              </span>
            </div>

            <div style={{
              padding: "0.75rem 1rem", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`,
              fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: C.textDim,
            }}>
              {truncResult.origUnsigned} mod 16 = <strong style={{ color: C.accent }}>{truncResult.truncUnsigned}</strong>
            </div>
          </div>
        )}
      </Panel>

      {/* Overflow Calculator */}
      <Panel>
        <div style={{ fontSize: "0.95rem", color: C.text, fontWeight: 700, marginBottom: "1rem" }}>
          오버플로우 계산기 (4비트)
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
          <button onClick={() => setOvType('unsigned')} style={{
            padding: "8px 20px", borderRadius: 8,
            background: ovType === 'unsigned' ? `${C.orange}20` : C.surface,
            border: `1.5px solid ${ovType === 'unsigned' ? C.orange : C.border}`,
            color: ovType === 'unsigned' ? C.orange : C.textDim,
            fontWeight: 700, cursor: "pointer", fontSize: "0.85rem",
          }}>Unsigned (0~15)</button>
          <button onClick={() => setOvType('signed')} style={{
            padding: "8px 20px", borderRadius: 8,
            background: ovType === 'signed' ? `${C.accent}20` : C.surface,
            border: `1.5px solid ${ovType === 'signed' ? C.accent : C.border}`,
            color: ovType === 'signed' ? C.accent : C.textDim,
            fontWeight: 700, cursor: "pointer", fontSize: "0.85rem",
          }}>Signed (-8~7)</button>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
          <input value={ovA} onChange={(e) => setOvA(e.target.value)} type="number" style={{
            width: 80, padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 8, color: C.text, fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none",
          }} />
          <span style={{ color: C.accent, fontFamily: "var(--font-mono)", fontSize: "1.2rem" }}>+</span>
          <input value={ovB} onChange={(e) => setOvB(e.target.value)} type="number" style={{
            width: 80, padding: "8px 10px", background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 8, color: C.text, fontFamily: "var(--font-mono)", fontSize: "0.9rem", outline: "none",
          }} />
        </div>

        {ovResult && (
          <div style={{
            padding: "1rem", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: C.textMuted }}>수학적 정확 결과</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", color: C.text }}>
                    {ovResult.mathResult}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: C.textMuted }}>실제 저장값 (4비트)</div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "1.2rem",
                    color: ovResult.overflow ? C.red : C.green, fontWeight: 700,
                  }}>
                    {ovResult.actual}
                    <span style={{ fontSize: "0.8rem", color: C.textMuted, marginLeft: 8 }}>
                      ({ovResult.actualBits})
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: C.textDim,
                padding: "6px 10px", background: `${C.surface}`, borderRadius: 6,
              }}>
                결과 = {ovResult.mathResult} mod 16 = {((ovResult.mathResult % 16) + 16) % 16}
                {ovType === 'signed' && ovResult.actual < 0 && ` → signed 해석: ${ovResult.actual}`}
              </div>

              {ovResult.overflow && (
                <div style={{
                  padding: "8px 12px",
                  background: `${C.red}15`, borderRadius: 8, border: `1px solid ${C.red}30`,
                  color: C.red, fontSize: "0.85rem", fontWeight: 600,
                }}>
                  ⚠ 오버플로우! {ovResult.warning}
                </div>
              )}

              {!ovResult.overflow && (
                <div style={{
                  padding: "8px 12px",
                  background: `${C.green}10`, borderRadius: 8, border: `1px solid ${C.green}30`,
                  color: C.green, fontSize: "0.85rem",
                }}>
                  ✓ 오버플로우 없음
                </div>
              )}
            </div>
          </div>
        )}
      </Panel>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 6 — Data Lab: 이론에서 실전으로
   ══════════════════════════════════════════════════════ */

const DATA_LAB_TECHNIQUES = [
  {
    id: 'demorgan',
    title: '드모르간 법칙',
    color: C.blue,
    principle: '|가 없을 때 ~(~a & ~b)로 OR을 구현합니다. a | b ≡ ~(~a & ~b).',
    code: '// OR 없이 OR 구현\nint bitOr(int x, int y) {\n  return ~(~x & ~y);\n}',
    problem: 'bitOr — | 연산자 없이 OR 구현',
    section: '섹션 2: 비트 연산의 직관 (NOT + AND = OR)',
  },
  {
    id: 'xor-equal',
    title: '!(a ^ b)로 동치 검사',
    color: C.purple,
    principle: 'XOR은 두 값이 다를 때 1을 반환합니다. 따라서 a ^ b가 0이면 두 값은 같습니다.',
    code: '// == 없이 동치 검사\nint isEqual(int x, int y) {\n  return !(x ^ y);\n}',
    problem: 'isEqual — == 연산자 없이 동치 판별',
    section: '섹션 2: XOR의 성질 (x ^ x = 0)',
  },
  {
    id: 'bitmask-gen',
    title: '비트마스크 생성',
    color: C.green,
    principle: '!!x는 0→0, 비-0→1. ~1+1 = -1 = 0xFFFFFFFF, ~0+1 = 0.',
    code: '// 0 → 0x00000000\n// 비-0 → 0xFFFFFFFF\nint mask = ~(!!x) + 1;',
    problem: 'conditional, isNonZero 등',
    section: '섹션 3: 2의 보수 (부정 = ~x + 1)',
  },
  {
    id: 'branchless-select',
    title: '비트마스크 기반 선택',
    color: C.orange,
    principle: 'mask가 0xFFFFFFFF면 y가, 0x00000000이면 z가 선택됩니다. 조건문 없이 값 선택!',
    code: '// if-else 없이 조건 선택\n// mask = 0xFFFFFFFF or 0x00000000\nint result = (mask & y) | (~mask & z);',
    problem: 'conditional — 조건문 없이 x ? y : z 구현',
    section: '섹션 2: AND 마스킹 + OR 합치기',
  },
  {
    id: 'arith-shift',
    title: '산술 시프트 활용',
    color: C.red,
    principle: '음수 >> 31은 0xFFFFFFFF, 양수/0 >> 31은 0x00000000. 부호에 따라 전체 마스크 생성.',
    code: '// 부호 비트로 전체 마스크 생성\nint sign_mask = x >> 31;\n// 음수: 0xFFFFFFFF\n// 양수/0: 0x00000000',
    problem: 'isPositive, sign 판별 관련 문제들',
    section: '섹션 3: MSB(부호 비트)의 역할',
  },
  {
    id: 'sub-compare',
    title: '뺄셈 부호 비트로 대소 비교',
    color: C.yellow,
    principle: 'a - b = a + (~b + 1). 결과의 부호 비트로 대소를 판단합니다. 단, 오버플로우에 주의!',
    code: '// 뺄셈의 부호 비트 검사\nint diff = x + ~y; // x - y - 1\nint sign = (diff >> 31) & 1;',
    problem: 'isLessOrEqual, isGreater 등',
    section: '섹션 5: 오버플로우와 모듈러 산술',
  },
  {
    id: 'binary-search-bits',
    title: '이진 탐색으로 최상위 1 찾기',
    color: C.accent,
    principle: '32비트를 16→8→4→2→1로 범위를 반씩 줄여가며 최상위 1비트의 위치를 찾습니다.',
    code: '// 16비트씩 확인\nint b16 = !!(x >> 16) << 4; // 상위 16비트에 1이 있으면 16\nx >>= b16;\nint b8 = !!(x >> 8) << 3;   // 다음 8비트\nx >>= b8;\n// ... b4, b2, b1\nreturn b16 + b8 + b4 + b2 + b1 + 1;',
    problem: 'howManyBits — 표현에 필요한 최소 비트 수',
    section: '섹션 1: 이진수의 자릿값 구조',
  },
];

function DataLabSection() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section style={{ marginTop: "4rem" }}>
      <SectionTitle subtitle="제한된 연산자로 함수를 구현하는 퍼즐">
        6. Data Lab — 이론에서 실전으로
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8 }}><strong style={{ color: C.accent }}>Data Lab</strong>은{' '}
        <GradLink href="https://csapp.cs.cmu.edu/3e/labs.html">CS:APP의 과제</GradLink>로,{' '}
        <span style={{ fontFamily: "var(--font-mono)", color: C.orange }}>! ~ &amp; ^ | + &lt;&lt; &gt;&gt;</span>{' '}
        만으로 함수를 구현하는 퍼즐입니다. 이 포스트에서 다룬 개념들이 어떻게 실전 테크닉으로 연결되는지 살펴봅시다.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DATA_LAB_TECHNIQUES.map((tech) => (
          <div key={tech.id}>
            <button
              onClick={() => setExpanded(expanded === tech.id ? null : tech.id)}
              style={{
                width: "100%", textAlign: "left",
                padding: "1rem 1.25rem", borderRadius: expanded === tech.id ? "12px 12px 0 0" : 12,
                background: expanded === tech.id ? `${tech.color}15` : C.surface,
                border: `1.5px solid ${expanded === tech.id ? tech.color : C.border}`,
                borderBottom: expanded === tech.id ? 'none' : undefined,
                color: C.text, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s ease",
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: tech.color, flexShrink: 0,
              }} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{tech.title}</span>
              <span style={{
                marginLeft: "auto", color: C.textMuted, fontSize: "0.85rem",
                transform: expanded === tech.id ? 'rotate(180deg)' : 'none',
                transition: "transform 0.2s",
              }}>▼</span>
            </button>

            {expanded === tech.id && (
              <div style={{
                padding: "1.25rem",
                background: `${tech.color}08`,
                border: `1.5px solid ${tech.color}`,
                borderTop: 'none',
                borderRadius: "0 0 12px 12px",
              }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: "0.7rem", color: tech.color, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                    원리
                  </div>
                  <div style={{ color: C.textDim, fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {tech.principle}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: "0.7rem", color: tech.color, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                    패턴
                  </div>
                  <CodeBlock>{tech.code}</CodeBlock>
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: C.textMuted }}>사용 문제: </span>
                    <span style={{ color: tech.color }}>{tech.problem}</span>
                  </div>
                  <div>
                    <span style={{ color: C.textMuted }}>연결 개념: </span>
                    <span style={{ color: C.accent }}>{tech.section}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Box color={C.question} label="면접 포인트">
        <strong style={{ color: C.question }}>&quot;비트 연산만으로 조건문을 구현하는 방법을 설명해 보세요.&quot;</strong>
        <br /><br />
        <span style={{ color: C.textDim }}>
          핵심은 <strong style={{ color: C.accent }}>비트마스크 생성 + 선택</strong>입니다.
          먼저 <span style={{ fontFamily: "var(--font-mono)" }}>~(!!x) + 1</span>로 조건에 따른 전체 비트마스크(0x00000000 또는 0xFFFFFFFF)를 만들고,
          <span style={{ fontFamily: "var(--font-mono)" }}>(mask &amp; a) | (~mask &amp; b)</span>로 값을 선택합니다.
          이것은 조건문 없이도 branchless하게 동작하며, 파이프라인 예측 실패를 방지하여 성능에도 유리합니다.
        </span>
      </Box>

      <Box color={C.accent} label="마무리">
        <strong style={{ color: C.accent }}>동일한 비트 패턴이라도 해석 방식에 따라 전혀 다른 값이 됩니다.</strong>
        <br /><br />
        <span style={{ color: C.textDim }}>
          16진수와 이진수의 1:1 대응, 비트 연산의 독립적 처리, 2의 보수에서의 signed/unsigned 해석 차이,
          그리고 확장/절삭/오버플로우의 모듈러 산술까지 — 이 모든 것의 근본에는
          &quot;비트 패턴은 하나지만 해석은 여러 가지&quot;라는 통찰이 있습니다.
          Data Lab은 이 통찰을 제한된 도구만으로 실전에 적용하는 훈련입니다.
        </span>
      </Box>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */

export default function BitsAndIntegersBlog() {
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
          동일한 비트 패턴이라도 해석 방식에 따라 전혀 다른 값이 된다.
        </strong>
        <br /><br />
        <span style={{ color: C.textDim }}>
          이 통찰은 16진수 변환, 비트 연산, 2의 보수, signed/unsigned 변환,
          그리고 오버플로우까지 — 이 포스트의 모든 주제를 관통합니다.
          각 섹션에서 이 원리가 어떻게 드러나는지 주의 깊게 살펴보세요.
        </span>
      </Box>

      <HexBinarySection />
      <BitwiseOpsSection />
      <TwosComplementSection />
      <SignedUnsignedSection />
      <ExtTruncOverflowSection />
      <DataLabSection />
    </div>
  );
}
