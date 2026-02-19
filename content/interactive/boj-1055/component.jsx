// @ts-nocheck
'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ─── Color Palette (matches original blog style) ─── */
const C = {
  card: "#161b22",
  cardBorder: "#30363d",
  text: "#e6edf3",
  textDim: "#8b949e",
  textMuted: "#484f58",
  accent: "#58a6ff",
  accentGreen: "#56d364",
  accentRed: "#f97583",
  accentPurple: "#d2a8ff",
  accentOrange: "#f0883e",
  accentYellow: "#e3b341",
  border: "#30363d",
  codeBg: "#0d1117",
  btnBg: "#21262d",
  btnHover: "#30363d",
  success: "#238636",
  warning: "#9e6a03",
};

/* ─── Shared Components ─── */
const Badge = ({ children, color = C.accent }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 12,
    background: color + "22", color, fontSize: 12, fontWeight: 600,
    border: `1px solid ${color}44`, marginRight: 6,
  }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.card, borderRadius: 12, border: `1px solid ${C.cardBorder}`,
    padding: "24px", marginBottom: 20, ...style,
  }}>{children}</div>
);

const Btn = ({ children, onClick, active, disabled, small, color = C.accent }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: small ? "4px 12px" : "8px 20px",
      borderRadius: 8,
      border: active ? `2px solid ${color}` : `1px solid ${C.cardBorder}`,
      background: active ? color + "22" : C.btnBg,
      color: disabled ? C.textMuted : active ? color : C.text,
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: small ? 12 : 14,
      fontWeight: active ? 600 : 400,
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.15s",
    }}
  >{children}</button>
);

const CodeBlock = ({ children }) => (
  <div style={{ padding: "14px 18px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.cardBorder}` }}>
    <pre style={{
      color: C.text, fontSize: 13, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      margin: 0, overflow: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap",
    }}>{children}</pre>
  </div>
);

const MathBlock = ({ children }) => (
  <div style={{
    padding: "14px 18px", borderRadius: 8, background: C.accentPurple + "08",
    border: `1px solid ${C.accentPurple}33`, margin: "12px 0",
    fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: 14,
    color: C.accentPurple, textAlign: "center", lineHeight: 1.8,
  }}>{children}</div>
);

/* ═══════════════════════════════════════════════════
   UTILITY: Endless Simulation
   ═══════════════════════════════════════════════════ */

/** Apply one round of Endless: replace every '$' in S with input string */
const applyEndless = (input, S) => {
  let result = "";
  for (const ch of S) {
    result += ch === "$" ? input : ch;
  }
  return result;
};

/** Compute string length after `rounds` applications without building the string */
const computeLength = (inputLen, S, rounds) => {
  const dollarCount = [...S].filter(c => c === "$").length;
  const fixedChars = S.length - dollarCount;
  let len = inputLen;
  for (let i = 0; i < rounds; i++) {
    len = len * dollarCount + fixedChars;
    if (len > 1e12) return len; // cap to avoid overflow issues
  }
  return len;
};

/* ═══════════════════════════════════════════════════
   COMPONENT 1: Exponential Growth Simulator
   ═══════════════════════════════════════════════════ */
const GrowthSimulator = () => {
  const [input, setInput] = useState("a");
  const [pattern, setPattern] = useState("$meric$");
  const [maxRounds, setMaxRounds] = useState(6);

  const dollarCount = useMemo(() => [...pattern].filter(c => c === "$").length, [pattern]);

  const steps = useMemo(() => {
    const result = [];
    let current = input;
    result.push({ round: 0, str: current, len: current.length });
    for (let i = 1; i <= maxRounds; i++) {
      current = applyEndless(current, pattern);
      // Cap display string at 200 chars
      const display = current.length > 200 ? current.slice(0, 200) + "…" : current;
      result.push({ round: i, str: display, len: current.length });
      if (current.length > 5000) {
        // For subsequent rounds, only compute length
        for (let j = i + 1; j <= maxRounds; j++) {
          const nextLen = computeLength(current.length, pattern, j - i);
          result.push({ round: j, str: "(너무 김 — 길이만 표시)", len: nextLen });
        }
        break;
      }
    }
    return result;
  }, [input, pattern, maxRounds]);

  const [selectedRound, setSelectedRound] = useState(0);

  useEffect(() => { setSelectedRound(0); }, [input, pattern, maxRounds]);

  const cur = steps[Math.min(selectedRound, steps.length - 1)];

  // Bar chart data
  const maxLen = Math.max(...steps.map(s => s.len));
  const barMax = Math.min(maxLen, 1e6);

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>
        문자열 팽창 시뮬레이터
      </h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        초기 입력과 패턴 S를 설정하고, 매 라운드마다 문자열이 어떻게 팽창하는지 관찰하세요.
      </p>

      {/* Input controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 13 }}>입력:</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value || "a")}
            style={{
              background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.accent, padding: "6px 12px", fontSize: 14, fontFamily: "monospace", width: 100,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 13 }}>S:</span>
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value || "$")}
            style={{
              background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.accentPurple, padding: "6px 12px", fontSize: 14, fontFamily: "monospace", width: 140,
            }}
          />
        </div>
        <Badge color={dollarCount >= 2 ? C.accentRed : C.accentGreen}>
          $ × {dollarCount}
        </Badge>
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ color: C.textDim, fontSize: 12, alignSelf: "center" }}>프리셋:</span>
        {[
          { i: "a", s: "$meric$", label: "america" },
          { i: "abc", s: "$x$y$z$", label: "4개 $" },
          { i: "top", s: "$coder", label: "1개 $" },
          { i: "a", s: "$$", label: "순수 2배" },
        ].map(({ i, s, label }) => (
          <Btn key={label} small active={input === i && pattern === s}
            onClick={() => { setInput(i); setPattern(s); }}>
            {label}
          </Btn>
        ))}
      </div>

      {/* Growth bar chart */}
      <div style={{ marginBottom: 16 }}>
        {steps.map((s, idx) => {
          const barWidth = Math.max(2, Math.min(100, (Math.log(s.len + 1) / Math.log(barMax + 1)) * 100));
          const isSelected = idx === selectedRound;
          return (
            <div
              key={idx}
              onClick={() => setSelectedRound(idx)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "4px 8px",
                cursor: "pointer", borderRadius: 6, marginBottom: 2,
                background: isSelected ? C.accent + "15" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <span style={{
                color: isSelected ? C.accent : C.textMuted, fontSize: 12,
                fontFamily: "monospace", minWidth: 20, textAlign: "right",
              }}>
                {s.round}
              </span>
              <div style={{
                height: 18, borderRadius: 4, transition: "width 0.3s ease",
                width: `${barWidth}%`, minWidth: 4,
                background: s.len > 1e9
                  ? `linear-gradient(90deg, ${C.accentRed}88, ${C.accentOrange}88)`
                  : s.len > 1e5
                  ? `linear-gradient(90deg, ${C.accentOrange}88, ${C.accentYellow}88)`
                  : `linear-gradient(90deg, ${C.accent}88, ${C.accentGreen}88)`,
              }} />
              <span style={{
                color: isSelected ? C.text : C.textDim, fontSize: 11,
                fontFamily: "monospace", whiteSpace: "nowrap",
              }}>
                {s.len > 1e9 ? `${(s.len / 1e9).toFixed(1)}B` :
                 s.len > 1e6 ? `${(s.len / 1e6).toFixed(1)}M` :
                 s.len > 1e3 ? `${(s.len / 1e3).toFixed(1)}K` :
                 s.len} 글자
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected round detail */}
      <div style={{
        background: C.codeBg, borderRadius: 8, padding: "12px 16px",
        border: `1px solid ${C.cardBorder}`,
        fontFamily: "monospace", fontSize: 13, color: C.textDim,
        wordBreak: "break-all", maxHeight: 120, overflowY: "auto",
      }}>
        <span style={{ color: C.accent }}>Round {cur.round}</span>
        {" → "}
        <span style={{ color: C.text }}>{cur.str}</span>
      </div>

      {/* Growth rate callout */}
      {dollarCount >= 2 && (
        <div style={{
          marginTop: 12, padding: "12px 16px", borderRadius: 8,
          background: C.accentRed + "12", border: `1px solid ${C.accentRed}33`,
        }}>
          <p style={{ color: C.accentRed, fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
            지수적 팽창!
          </p>
          <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
            <code style={{ color: C.accent }}>$</code>가 <strong style={{ color: C.text }}>{dollarCount}개</strong>이므로,
            매 라운드마다 길이가 약 <strong style={{ color: C.text }}>{dollarCount}배</strong>로 증가합니다.
            {" "}{steps.length > 2 && <>
              {steps.length - 1}회만에 이미 <strong style={{ color: C.accentOrange }}>
                {steps[steps.length - 1].len > 1e9 ? "10억을 초과" : `${steps[steps.length - 1].len.toLocaleString()}자`}
              </strong>입니다.
            </>}
          </p>
        </div>
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 2: Why We Can Cap Iterations
   ═══════════════════════════════════════════════════ */
const MathJustification = () => {
  const [d, setD] = useState(2);

  // Compute minimum rounds to exceed 10^9
  const minRounds = useMemo(() => {
    // len(n) >= d^n * len(I) (simplified; actually len grows as d^n when fixed chars are small)
    // We need d^n > 10^9
    // n > log_d(10^9) = 9 / log10(d) * log10(e)... simplify: log2(10^9) ≈ 30
    if (d <= 1) return Infinity;
    let n = 0, len = 1;
    while (len <= 1e9 + 100 && n < 100) {
      len = len * d + (d - 1); // simplified model: S has d '$'s and (d-1) fixed chars
      n++;
    }
    return n;
  }, [d]);

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        반복 횟수 상한의 수학적 정당성
      </h3>

      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        <code style={{ color: C.accent }}>$</code>의 개수를 <strong style={{ color: C.text }}>d</strong>,
        S에서 <code style={{ color: C.accent }}>$</code>가 아닌 문자 수를 <strong style={{ color: C.text }}>f</strong>라 하면,
        k번 반복 후 문자열의 길이 L(k)는 다음 점화식을 따릅니다.
      </p>

      <MathBlock>
        L(0) = |I|,  L(k) = d · L(k−1) + f
      </MathBlock>

      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 12px 0" }}>
        d ≥ 2일 때, 이 점화식은 <strong style={{ color: C.text }}>지수적으로</strong> 증가합니다.
        일반항을 풀면:
      </p>

      <MathBlock>
        L(k) = dᵏ · (|I| + f/(d−1)) − f/(d−1)
      </MathBlock>

      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        문제에서 min, max ≤ 10⁹이므로, L(k) &gt; 10⁹ + 100이 되는 순간부터는
        더 반복해도 해당 인덱스의 문자가 바뀌지 않습니다.
        따라서 <strong style={{ color: C.accentGreen }}>C를 ⌈log₂(10⁹ + 100)⌉ ≈ 30 이하로 잘라도</strong> 정답입니다.
      </p>

      {/* Interactive: $ count → min rounds */}
      <div style={{
        padding: "16px", borderRadius: 10, background: C.accent + "08",
        border: `1px solid ${C.accent}33`, marginBottom: 16,
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ color: C.textDim, fontSize: 13 }}>d ($ 개수):</span>
          {[2, 3, 4, 5, 10].map(v => (
            <Btn key={v} small active={d === v} onClick={() => setD(v)}>{v}</Btn>
          ))}
        </div>
        <p style={{ color: C.text, fontSize: 14, margin: 0 }}>
          d = {d}일 때, 길이가 10⁹를 넘기 위해 필요한 최소 반복 횟수:
          <strong style={{ color: C.accentGreen, fontSize: 18, marginLeft: 8 }}>{minRounds}회</strong>
        </p>
        <p style={{ color: C.textDim, fontSize: 12, margin: "4px 0 0 0" }}>
          → 10억 회 반복할 필요 없이, 최대 {minRounds}회만 시뮬레이션하면 충분합니다.
        </p>
      </div>

      <CodeBlock>{`from math import ceil, log2

if S.count('$') > 1:
    # d ≥ 2: 길이가 지수적 증가 → 반복 횟수를 상한으로 제한
    C = min(C, ceil(log2(10**9 + 100)))  # ≈ 30
    # 이후 재귀로 각 인덱스의 문자를 O(C × |S|)에 계산`}</CodeBlock>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 3: Recursive Character Lookup Visualizer
   ═══════════════════════════════════════════════════ */
const RecursionVisualizer = () => {
  const [input, setInput] = useState("abc");
  const [pattern, setPattern] = useState("$x$y$z$");
  const [targetIdx, setTargetIdx] = useState(10);
  const [rounds, setRounds] = useState(3);

  const dollarCount = useMemo(() => [...pattern].filter(c => c === "$").length, [pattern]);
  const fixedChars = pattern.length - dollarCount;

  // Compute sizes for each round
  const sizes = useMemo(() => {
    const sz = [input.length];
    for (let i = 1; i <= rounds; i++) {
      sz.push(Math.min(sz[i - 1] * dollarCount + fixedChars, 1e9 + 100));
    }
    return sz;
  }, [input, pattern, rounds, dollarCount, fixedChars]);

  // Trace the recursion
  const trace = useMemo(() => {
    const steps = [];
    let idx = targetIdx;
    for (let cnt = rounds; cnt >= 0; cnt--) {
      if (cnt === 0) {
        if (idx < input.length) {
          steps.push({ cnt, idx, action: "base", char: input[idx] });
        } else {
          steps.push({ cnt, idx, action: "oob", char: "-" });
        }
        break;
      }
      if (idx >= sizes[cnt]) {
        steps.push({ cnt, idx, action: "oob", char: "-" });
        break;
      }
      // Walk through pattern
      let cur = 0;
      let found = false;
      for (let ci = 0; ci < pattern.length; ci++) {
        const c = pattern[ci];
        if (c === "$") {
          if (cur <= idx && idx < cur + sizes[cnt - 1]) {
            steps.push({
              cnt, idx, action: "recurse",
              patternIdx: ci, segStart: cur, segEnd: cur + sizes[cnt - 1],
              newIdx: idx - cur,
            });
            idx = idx - cur;
            found = true;
            break;
          }
          cur += sizes[cnt - 1];
        } else {
          if (cur === idx) {
            steps.push({ cnt, idx, action: "fixed", patternIdx: ci, char: c });
            found = true;
            break;
          }
          cur += 1;
        }
      }
      if (!found) {
        steps.push({ cnt, idx, action: "oob", char: "-" });
        break;
      }
      if (steps[steps.length - 1].action !== "recurse") break;
    }
    return steps;
  }, [input, pattern, targetIdx, rounds, sizes]);

  const finalChar = trace[trace.length - 1]?.char || "-";

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 6px 0" }}>
        재귀 문자 탐색 시각화
      </h3>
      <p style={{ color: C.textDim, fontSize: 13, margin: "0 0 16px 0" }}>
        특정 인덱스의 문자를 찾기 위해, S의 구조를 따라 재귀적으로 내려가는 과정을 추적합니다.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>반복:</span>
          <input
            type="number" min={1} max={6} value={rounds}
            onChange={e => setRounds(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
            style={{
              background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.text, padding: "4px 8px", fontSize: 13, fontFamily: "monospace", width: 50,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>인덱스 (0-based):</span>
          <input
            type="number" min={0} max={999} value={targetIdx}
            onChange={e => setTargetIdx(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.accent, padding: "4px 8px", fontSize: 13, fontFamily: "monospace", width: 60,
            }}
          />
        </div>
        <span style={{ color: C.textMuted, fontSize: 12 }}>
          총 길이: {sizes[rounds] > 1e6 ? `${(sizes[rounds] / 1e6).toFixed(1)}M` : sizes[rounds]}
        </span>
      </div>

      {/* Trace visualization */}
      <div style={{ marginBottom: 16 }}>
        {trace.map((step, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
            marginBottom: 4, borderRadius: 8, marginLeft: i * 16,
            background: step.action === "recurse" ? C.accent + "10" :
                        step.action === "fixed" ? C.accentGreen + "15" :
                        step.action === "base" ? C.accentPurple + "15" :
                        C.accentRed + "15",
            border: `1px solid ${
              step.action === "recurse" ? C.accent + "33" :
              step.action === "fixed" ? C.accentGreen + "33" :
              step.action === "base" ? C.accentPurple + "33" :
              C.accentRed + "33"
            }`,
          }}>
            <Badge color={
              step.action === "recurse" ? C.accent :
              step.action === "fixed" ? C.accentGreen :
              step.action === "base" ? C.accentPurple : C.accentRed
            }>
              cnt={step.cnt}
            </Badge>
            <span style={{ color: C.text, fontSize: 13, fontFamily: "monospace" }}>
              idx={step.idx}
            </span>
            <span style={{ color: C.textDim, fontSize: 12 }}>→</span>
            <span style={{
              color: step.action === "recurse" ? C.accent :
                     step.action === "fixed" ? C.accentGreen :
                     step.action === "base" ? C.accentPurple : C.accentRed,
              fontSize: 13, fontWeight: 600,
            }}>
              {step.action === "recurse"
                ? `S[${step.patternIdx}]='$' 영역에 포함 → idx=${step.newIdx}로 재귀`
                : step.action === "fixed"
                ? `S[${step.patternIdx}]='${step.char}' — 고정 문자 발견!`
                : step.action === "base"
                ? `기저 조건: I[${step.idx}]='${step.char}'`
                : `범위 밖 → '-'`
              }
            </span>
          </div>
        ))}
      </div>

      {/* Result */}
      <div style={{
        padding: "12px 20px", borderRadius: 8, textAlign: "center",
        background: C.success + "15", border: `1px solid ${C.success}44`,
      }}>
        <span style={{ color: C.textDim, fontSize: 14 }}>결과: 인덱스 </span>
        <strong style={{ color: C.accent, fontSize: 16 }}>{targetIdx}</strong>
        <span style={{ color: C.textDim, fontSize: 14 }}> 의 문자 = </span>
        <strong style={{ color: C.accentGreen, fontSize: 20, fontFamily: "monospace" }}>
          '{finalChar}'
        </strong>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 4: Single-$ Case — O(1) Modular
   ═══════════════════════════════════════════════════ */
const SingleDollarExplainer = () => {
  const [input, setInput] = useState("top");
  const [pattern, setPattern] = useState("$coder");
  const [queryIdx, setQueryIdx] = useState(7);

  const dollarCount = [...pattern].filter(c => c === "$").length;
  const dollarPos = pattern.indexOf("$");
  const tail = pattern.slice(dollarPos + 1);
  const tailLen = tail.length;
  const inputLen = input.length;

  // After many rounds, the string stabilizes to: I + tail repeated
  // Total length after C rounds: |I| + tailLen * C
  // For large C, the structure is:  I + tail + tail + tail + ...
  const totalLen30 = inputLen + tailLen * 30;

  // Compute the character at queryIdx
  const charAtIdx = (idx) => {
    if (idx < inputLen) return input[idx];
    // Since $ is always at position 0 and there's exactly one $,
    // after C rounds (C large), the string is: I + (tail * C)
    // So for idx >= |I|: the character is tail[(idx - |I|) % tailLen]
    if (tailLen === 0) return "-";
    return tail[(idx - inputLen) % tailLen];
  };

  // Build display string for first 40 chars
  const displayStr = useMemo(() => {
    let s = "";
    for (let i = 0; i < 50; i++) {
      if (i < inputLen) s += input[i];
      else if (tailLen > 0) s += tail[(i - inputLen) % tailLen];
      else s += "-";
    }
    return s;
  }, [input, tail, inputLen, tailLen]);

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>
        $ 1개: O(1) 모듈러 풀이
      </h3>

      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        S에 <code style={{ color: C.accent }}>$</code>가 정확히 1개이고, 항상 맨 앞에 오므로
        S = <code style={{ color: C.accent }}>$</code> + tail 형태입니다.
        매 라운드마다 앞부분은 그대로 유지되고 뒤에 tail이 덧붙여지는 구조가 됩니다.
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16,
      }}>
        <div style={{ padding: "16px", borderRadius: 10, background: C.accent + "08", border: `1px solid ${C.accent}33` }}>
          <h4 style={{ color: C.accent, fontSize: 14, margin: "0 0 8px 0" }}>구조 관찰</h4>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Round 0: <code style={{ color: C.text }}>I</code><br/>
            Round 1: <code style={{ color: C.text }}>I</code><code style={{ color: C.accentOrange }}> + tail</code><br/>
            Round 2: <code style={{ color: C.text }}>I</code><code style={{ color: C.accentOrange }}> + tail + tail</code><br/>
            Round k: <code style={{ color: C.text }}>I</code><code style={{ color: C.accentOrange }}> + tail × k</code>
          </p>
        </div>
        <div style={{ padding: "16px", borderRadius: 10, background: C.accentGreen + "08", border: `1px solid ${C.accentGreen}33` }}>
          <h4 style={{ color: C.accentGreen, fontSize: 14, margin: "0 0 8px 0" }}>O(1) 인덱싱</h4>
          <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            idx &lt; |I| → <code style={{ color: C.text }}>I[idx]</code><br/>
            idx &lt; |I| + |tail| × C → <code style={{ color: C.text }}>tail[(idx − |I|) % |tail|]</code><br/>
            그 외 → <code style={{ color: C.accentRed }}>'-'</code>
          </p>
        </div>
      </div>

      {/* Interactive demo */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>I:</span>
          <input value={input} onChange={e => setInput(e.target.value || "a")}
            style={{ background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.accent, padding: "4px 8px", fontSize: 13, fontFamily: "monospace", width: 80 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>S:</span>
          <input value={pattern} onChange={e => setPattern(e.target.value || "$")}
            style={{ background: C.codeBg, border: `1px solid ${C.cardBorder}`, borderRadius: 6,
              color: C.accentPurple, padding: "4px 8px", fontSize: 13, fontFamily: "monospace", width: 100 }} />
        </div>
      </div>

      {/* Character strip visualization */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 16,
        padding: "10px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.cardBorder}`,
      }}>
        {displayStr.split("").map((ch, i) => {
          const isInput = i < inputLen;
          const isSelected = i === queryIdx;
          const cyclePos = isInput ? -1 : (i - inputLen) % tailLen;
          return (
            <div
              key={i}
              onClick={() => setQueryIdx(i)}
              style={{
                width: 22, height: 28, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
                background: isSelected ? C.accent + "44" : isInput ? C.accentPurple + "18" : C.accentOrange + "12",
                border: isSelected ? `2px solid ${C.accent}` : `1px solid transparent`,
              }}
            >
              <span style={{
                fontSize: 12, fontFamily: "monospace", fontWeight: isSelected ? 700 : 400,
                color: isInput ? C.accentPurple : C.accentOrange,
              }}>{ch}</span>
              <span style={{ fontSize: 7, color: C.textMuted }}>{i}</span>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: "10px 16px", borderRadius: 8, textAlign: "center",
        background: C.success + "15", border: `1px solid ${C.success}44`,
        fontFamily: "monospace", fontSize: 14,
      }}>
        <span style={{ color: C.textDim }}>idx = </span>
        <strong style={{ color: C.accent }}>{queryIdx}</strong>
        {queryIdx < inputLen ? (
          <span style={{ color: C.textDim }}> → I[{queryIdx}] = </span>
        ) : (
          <span style={{ color: C.textDim }}> → tail[({queryIdx} − {inputLen}) % {tailLen}] = tail[{(queryIdx - inputLen) % tailLen}] = </span>
        )}
        <strong style={{ color: C.accentGreen, fontSize: 18 }}>'{charAtIdx(queryIdx)}'</strong>
      </div>

      <div style={{ marginTop: 12 }}>
        <CodeBlock>{`def char(idx):
    if idx < len(I):
        return I[idx]
    if idx < len(I) + (len(S) - 1) * C:  # S의 첫 글자 $를 제외한 길이
        return S[(idx - len(I)) % (len(S) - 1) + 1]
    return '-'`}</CodeBlock>
      </div>

      <div style={{
        marginTop: 12, padding: "12px 16px", borderRadius: 8,
        background: C.warning + "15", border: `1px solid ${C.warning}44`,
      }}>
        <p style={{ color: C.accentYellow, fontSize: 13, fontWeight: 600, margin: "0 0 4px 0" }}>
          왜 재귀가 안 되는가?
        </p>
        <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          $ = 1이면 문자열 길이가 <strong style={{ color: C.text }}>선형으로</strong> 증가하므로,
          10⁹번 반복하면 실제로 깊이 10⁹의 재귀가 필요합니다.
          이는 어떤 언어에서도 스택 오버플로를 일으킵니다.
          하지만 구조가 단순하므로 <strong style={{ color: C.accentGreen }}>O(1) 모듈러 연산</strong>으로 해결됩니다.
        </p>
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   COMPONENT 5: Solution Summary
   ═══════════════════════════════════════════════════ */
const SolutionSummary = () => (
  <Card>
    <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 20px 0" }}>풀이 전략 요약</h3>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[
        {
          label: "$ ≥ 2개",
          method: "재귀 탐색",
          complexity: "O(C × |S|)",
          color: C.accent,
          detail: "C를 ~30으로 제한, 재귀로 문자 탐색",
        },
        {
          label: "$ = 1개",
          method: "O(1) 모듈러",
          complexity: "O(1) per query",
          color: C.accentGreen,
          detail: "I + tail×C 구조를 이용한 직접 계산",
        },
      ].map(({ label, method, complexity, color, detail }) => (
        <div key={label} style={{
          padding: "18px", borderRadius: 10, textAlign: "center",
          background: color + "08", border: `1px solid ${color}33`,
        }}>
          <Badge color={color}>{label}</Badge>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 600, margin: "12px 0 4px 0" }}>{method}</p>
          <p style={{ color, fontSize: 13, fontWeight: 600, margin: "0 0 8px 0" }}>{complexity}</p>
          <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>{detail}</p>
        </div>
      ))}
    </div>

    <div style={{
      marginTop: 20, padding: "16px 20px", borderRadius: 8,
      background: C.success + "15", border: `1px solid ${C.success}44`,
    }}>
      <p style={{ color: C.accentGreen, fontSize: 14, fontWeight: 600, margin: "0 0 4px 0" }}>핵심 인사이트</p>
      <p style={{ color: C.textDim, fontSize: 13, margin: 0, lineHeight: 1.8 }}>
        <code style={{ color: C.accent }}>$</code>의 개수에 따라 문자열 길이의 성장률이 근본적으로 다릅니다.
        <strong style={{ color: C.text }}> d ≥ 2이면 지수적</strong> (→ 반복 횟수 제한 + 재귀),
        <strong style={{ color: C.text }}> d = 1이면 선형</strong> (→ 모듈러 직접 계산).
        이 분기가 이 문제의 핵심입니다.
      </p>
    </div>
  </Card>
);

/* ═══════════════════════════════════════════════════
   COMPONENT 6: Code Walkthrough
   ═══════════════════════════════════════════════════ */
const CodeWalkthrough = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    {
      title: "$ ≥ 2: 반복 제한",
      code: `from math import ceil, log2

if S.count('$') > 1:
    C = min(C, ceil(log2(10**9 + 100)))
    # 이제 C ≤ 30`,
      desc: "d ≥ 2일 때, 길이가 지수적으로 증가하므로 약 30회면 10⁹을 넘깁니다. 반복 횟수를 상한으로 잘라냅니다.",
    },
    {
      title: "$ ≥ 2: 크기 메모이제이션",
      code: `sz = [len(I)] + [0] * C

def size(cnt):
    if sz[cnt] != 0:
        return sz[cnt]
    sign = S.count('$')
    sz[cnt] = min(
        size(cnt - 1) * sign + len(S) - sign,
        10**9 + 100
    )
    return sz[cnt]`,
      desc: "각 재귀 레벨에서의 문자열 길이를 미리 계산합니다. 10⁹+100으로 상한을 두어 오버플로를 방지합니다.",
    },
    {
      title: "$ ≥ 2: 재귀 탐색",
      code: `def char_recursion(idx, cnt):
    if cnt == 0:
        return I[idx]
    cur = 0
    for c in S:
        if c == '$':
            if cur <= idx < cur + size(cnt - 1):
                return char_recursion(idx - cur, cnt - 1)
            cur += size(cnt - 1)
        else:
            if cur == idx:
                return c
            cur += 1
    return '-'`,
      desc: "S의 구조를 따라가며, '$' 영역이면 재귀로 들어가고, 고정 문자면 바로 반환합니다. 깊이는 최대 ~30입니다.",
    },
    {
      title: "$ = 1: 모듈러 계산",
      code: `def char(idx):
    if idx < len(I):
        return I[idx]
    if idx < len(I) + (len(S) - 1) * C:
        return S[(idx - len(I)) % (len(S) - 1) + 1]
    return '-'`,
      desc: "$ = 1이고 맨 앞에 위치하므로, 구조가 I + tail × C로 단순합니다. 모듈러 연산 한 번으로 O(1)에 해결됩니다.",
    },
  ];

  return (
    <Card>
      <h3 style={{ color: C.text, fontSize: 18, margin: "0 0 16px 0" }}>코드 구조</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {sections.map((s, i) => (
          <Btn key={i} small active={i === activeSection} onClick={() => setActiveSection(i)}>
            {s.title}
          </Btn>
        ))}
      </div>
      <CodeBlock>{sections[activeSection].code}</CodeBlock>
      <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.7, margin: "12px 0 0 0" }}>
        {sections[activeSection].desc}
      </p>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN: Blog Article
   ═══════════════════════════════════════════════════ */
export default function EndlessArticle() {
  return (
    <div style={{
      minHeight: "100vh", padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 840, margin: "0 auto",
    }}>
      {/* Intro */}
      <Card>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: "0 0 12px 0" }}>
          <strong style={{ color: C.text }}>Endless</strong> 프로그램은 문자열 S 안의 모든
          <code style={{ color: C.accent, background: C.codeBg, padding: "2px 6px", borderRadius: 4 }}>$</code>를
          입력 문자열로 치환하는 연산을 반복합니다.
          반복 횟수가 <strong style={{ color: C.accentRed }}>최대 10⁹</strong>이고,
          결과 문자열에서 특정 구간 [min, max]을 출력해야 하므로,
          실제 문자열을 구성하지 않고 각 인덱스의 문자를 효율적으로 결정해야 합니다.
        </p>
        <p style={{ color: C.textDim, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          핵심은 S 안의 <code style={{ color: C.accent }}>$</code>의 개수에 따라 전략을 나누는 것입니다:
          {" "}<Badge color={C.accent}>$ ≥ 2: 지수적 팽창 → 재귀</Badge>
          <Badge color={C.accentGreen}>$ = 1: 선형 팽창 → 모듈러</Badge>
        </p>
      </Card>

      {/* ── Section 1: Exponential Growth ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accentRed }}>①</span> 지수적 팽창 관찰
      </h2>
      <GrowthSimulator />

      {/* ── Section 2: Math Justification ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accent }}>②</span> $ ≥ 2: 반복 횟수 상한
      </h2>
      <MathJustification />

      {/* ── Section 3: Recursive Lookup ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accentPurple }}>③</span> 재귀 문자 탐색
      </h2>
      <RecursionVisualizer />

      {/* ── Section 4: Single $ ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
        <span style={{ color: C.accentGreen }}>④</span> $ = 1: O(1) 풀이
      </h2>
      <SingleDollarExplainer />

      {/* ── Summary ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>정리</h2>
      <SolutionSummary />

      {/* ── Code ── */}
      <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginTop: 48, marginBottom: 16 }}>구현</h2>
      <CodeWalkthrough />
    </div>
  );
}
