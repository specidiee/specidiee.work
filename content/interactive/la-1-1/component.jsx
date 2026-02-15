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

/* ─── Tab Component ─── */
const TabGroup = ({ tabs, activeTab, onTabChange }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
    {tabs.map((tab, i) => (
      <button
        key={i}
        onClick={() => onTabChange(i)}
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
);

/* ═══════════════════════════════════════════════════════════════
   Matrix Input Component
   ═══════════════════════════════════════════════════════════════ */
const MatrixInput = ({ matrix, setMatrix, rows, cols, label, color = C.accent }) => {
  const handleChange = (i, j, value) => {
    const newMatrix = matrix.map((row, ri) =>
      row.map((cell, ci) => (ri === i && ci === j ? value : cell))
    );
    setMatrix(newMatrix);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {label && (
        <div style={{ color, fontWeight: 600, marginBottom: 8, fontSize: "0.9em" }}>
          {label}
        </div>
      )}
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 4,
          padding: "8px 16px",
          background: `${color}10`,
          borderRadius: 8,
          border: `1px solid ${color}30`,
        }}
      >
        {matrix.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 4 }}>
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => handleChange(i, j, parseFloat(e.target.value) || 0)}
                style={{
                  width: 50,
                  height: 36,
                  textAlign: "center",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  color: C.text,
                  fontSize: "0.95em",
                  fontFamily: "var(--font-mono)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Matrix Display Component ─── */
const MatrixDisplay = ({ matrix, label, color = C.accent, highlight = null }) => (
  <div style={{ textAlign: "center" }}>
    {label && (
      <div style={{ color, fontWeight: 600, marginBottom: 8, fontSize: "0.9em" }}>
        {label}
      </div>
    )}
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        padding: "12px 20px",
        background: `${color}10`,
        borderRadius: 8,
        border: `1px solid ${color}30`,
      }}
    >
      {matrix.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          {row.map((cell, j) => (
            <span
              key={j}
              style={{
                width: 45,
                textAlign: "center",
                color: highlight && highlight(i, j) ? C.yellow : C.text,
                fontFamily: "var(--font-mono)",
                fontWeight: highlight && highlight(i, j) ? 700 : 400,
                fontSize: "0.95em",
              }}
            >
              {typeof cell === "number" ? (Number.isInteger(cell) ? cell : cell.toFixed(2)) : cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   0. Introduction
   ═══════════════════════════════════════════════════════════════ */
function Introduction() {
  return (
    <div>
      <p style={{ color: C.textDim, lineHeight: 1.9, marginBottom: "1.5rem" }}>
        선형대수학은 <strong style={{ color: C.text }}>연립일차방정식을 푸는 것</strong>에서 시작합니다.
        행렬은 단순히 숫자를 정리한 표가 아니라, <strong style={{ color: C.accent }}>변환(transformation)</strong>을 
        표현하는 도구입니다. 이 관점을 이해하면 행렬 곱셈이 왜 그렇게 정의되었는지, 
        역행렬이 언제 존재하는지가 자연스럽게 따라옵니다.
      </p>

      <Box color={C.accent} label="이 글의 여정">
        <strong style={{ color: C.blue }}>행렬 = 변환</strong>이라는 관점에서 출발하여,
        <strong style={{ color: C.green }}> 가우스 소거법</strong>과
        <strong style={{ color: C.purple }}> 기본행렬</strong>을 거쳐,
        <strong style={{ color: C.orange }}> 역행렬</strong>의 존재 조건과 계산법까지 —
        하나의 논리적 흐름으로 연결됩니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. Why Matrix Multiplication?
   ═══════════════════════════════════════════════════════════════ */
function WhyMatrixMultiplication() {
  const [revealed, setRevealed] = useState(false);
  const [matA, setMatA] = useState([[1, 2], [0, 1]]);
  const [matB, setMatB] = useState([[2, 0], [1, 1]]);
  const [inputVec, setInputVec] = useState([[3], [1]]);

  // 행렬 곱셈 함수
  const multiply = (A, B) => {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  const AB = multiply(matA, matB);
  const Bv = multiply(matB, inputVec);
  const ABv = multiply(matA, Bv);
  const ABv2 = multiply(AB, inputVec);

  return (
    <div>
      <SectionTitle subtitle="변환의 합성에서 유도되는 필연적 정의">
        1. 행렬 곱셈은 왜 이렇게 정의되었는가?
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        행렬의 덧셈은 직관적입니다. 같은 위치끼리 더하면 됩니다.
        그런데 곱셈은 왜 "행 × 열"로 복잡하게 정의되었을까요?
      </p>

      <MathBlock>
        {`\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}
        \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix}
        = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}`}
      </MathBlock>

      <Question number={1} revealed={revealed} onReveal={() => setRevealed(true)}>
        행렬 곱셈이 왜 이렇게 정의되었을까요? 왜 단순히 같은 위치끼리 곱하지 않았을까요?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          행렬을 <strong style={{ color: C.accent }}>변환</strong>으로 봅시다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          2×2 행렬 <Eq>{'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'}</Eq>는
          점 <Eq>{'(x, y)'}</Eq>를 <Eq>{'(ax+by, cx+dy)'}</Eq>로 보내는 변환입니다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          두 변환 <Eq>{'A'}</Eq>와 <Eq>{'B'}</Eq>를 <strong style={{ color: C.green }}>합성</strong>하면 어떻게 될까요?
        </p>
        <MathBlock>
          {'(x, y) \\xrightarrow{B} (ex+fy, gx+hy) \\xrightarrow{A} ((ae+bg)x+(af+bh)y, \\ldots)'}
        </MathBlock>
        <p>
          합성 결과의 계수가 정확히 <strong style={{ color: C.yellow }}>행렬 곱셈의 정의</strong>와 일치합니다!
          행렬 곱셈은 누군가 임의로 정한 것이 아니라, 변환의 합성에서 <strong style={{ color: C.accent }}>자연스럽게 유도된 것</strong>입니다.
        </p>
      </Answer>

      {revealed && (
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${C.border}`,
          marginTop: "2rem",
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
            🧪 변환의 합성 실험
          </div>

          <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 20 }}>
            벡터 <Eq>{'v'}</Eq>에 <Eq>{'B'}</Eq>를 먼저 적용하고 <Eq>{'A'}</Eq>를 적용한 결과와,
            <Eq>{'AB'}</Eq>를 한 번에 적용한 결과가 같은지 확인해보세요.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
            <MatrixInput matrix={matA} setMatrix={setMatA} rows={2} cols={2} label="행렬 A" color={C.blue} />
            <MatrixInput matrix={matB} setMatrix={setMatB} rows={2} cols={2} label="행렬 B" color={C.green} />
            <MatrixInput matrix={inputVec} setMatrix={setInputVec} rows={2} cols={1} label="벡터 v" color={C.purple} />
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr auto 1fr", 
            gap: 20, 
            alignItems: "center",
            background: C.surface,
            padding: 20,
            borderRadius: 12,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: C.textMuted, fontSize: "0.85em", marginBottom: 12 }}>
                <Eq>{'A(Bv)'}</Eq>: 순차 적용
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: C.green }}>Bv = </span>
                <span style={{ color: C.text, fontFamily: "var(--font-mono)" }}>
                  ({Bv[0][0]}, {Bv[1][0]})
                </span>
              </div>
              <div>
                <span style={{ color: C.blue }}>A(Bv) = </span>
                <span style={{ color: C.yellow, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  ({ABv[0][0]}, {ABv[1][0]})
                </span>
              </div>
            </div>

            <div style={{ color: C.accent, fontSize: "1.5rem", fontWeight: 700 }}>=</div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: C.textMuted, fontSize: "0.85em", marginBottom: 12 }}>
                <Eq>{'(AB)v'}</Eq>: 합성 후 적용
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: C.orange }}>AB = </span>
                <span style={{ color: C.text, fontFamily: "var(--font-mono)" }}>
                  [({AB[0][0]}, {AB[0][1]}), ({AB[1][0]}, {AB[1][1]})]
                </span>
              </div>
              <div>
                <span style={{ color: C.orange }}>(AB)v = </span>
                <span style={{ color: C.yellow, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  ({ABv2[0][0]}, {ABv2[1][0]})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Box color={C.green} label="핵심 통찰">
        <strong style={{ color: C.text }}>행렬 곱셈 = 변환의 합성</strong><br /><br />
        이 관점에서 보면, 행렬 곱셈이 <strong style={{ color: C.yellow }}>교환법칙을 만족하지 않는 이유</strong>도 자명합니다.
        회전 후 밀기와 밀기 후 회전은 다른 결과를 낳으니까요.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Linear Equations as Inverse Problem
   ═══════════════════════════════════════════════════════════════ */
function LinearEquationsAsInverse() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="변환을 되돌리는 문제">
        2. 연립방정식 Ax = b의 의미
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        연립방정식 <Eq>{'Ax = b'}</Eq>를 변환의 언어로 다시 써봅시다.
      </p>

      <Box color={C.blue} label="새로운 관점">
        <div style={{ fontSize: "1.1em", textAlign: "center" }}>
          "변환 <Eq>{'A'}</Eq>를 적용했더니 <Eq>{'b'}</Eq>가 나왔다. 원래 벡터 <Eq>{'x'}</Eq>는 무엇이었나?"
        </div>
      </Box>

      <p style={{ color: C.textDim, lineHeight: 1.8, margin: "1.5rem 0" }}>
        예를 들어:
      </p>

      <MathBlock>
        {`\\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}
        \\begin{pmatrix} x \\\\ y \\end{pmatrix}
        = \\begin{pmatrix} 5 \\\\ 8 \\end{pmatrix}`}
      </MathBlock>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        이건 "어떤 점 <Eq>{'(x, y)'}</Eq>에 변환 <Eq>{'A'}</Eq>를 적용했더니 <Eq>{'(5, 8)'}</Eq>이 되었다.
        원래 점은?"이라는 질문입니다.
      </p>

      <Question number={2} revealed={revealed} onReveal={() => setRevealed(true)}>
        변환을 "되돌리면" 되지 않을까요? 즉, <Eq>{'A'}</Eq>의 역변환 <Eq>{'A^{-1}'}</Eq>이 존재한다면?
      </Question>

      <Answer visible={revealed}>
        <p style={{ marginBottom: "1rem" }}>
          맞습니다! 역변환이 존재한다면 <Eq>{'x = A^{-1}b'}</Eq>로 간단하게 해결됩니다.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          그런데 <strong style={{ color: C.red }}>모든 변환이 되돌릴 수 있는 건 아닙니다.</strong>
        </p>
        <p style={{ marginBottom: "1rem" }}>
          예를 들어, 2차원 평면을 <strong style={{ color: C.yellow }}>직선 위로 찌그러뜨리는</strong> 변환을 생각해보세요:
        </p>
        <MathBlock>
          {`\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}
          \\begin{pmatrix} x \\\\ y \\end{pmatrix}
          = \\begin{pmatrix} x \\\\ 0 \\end{pmatrix}`}
        </MathBlock>
        <p>
          이 변환은 <Eq>{'(1, 3)'}</Eq>과 <Eq>{'(1, 7)'}</Eq>을 모두 <Eq>{'(1, 0)'}</Eq>으로 보냅니다.
          그렇다면 <Eq>{'(1, 0)'}</Eq>의 "원래 점"이 뭐였는지 어떻게 알 수 있을까요?
          <strong style={{ color: C.red }}> 알 수 없습니다!</strong>
        </p>
      </Answer>

      {revealed && (
        <Box color={C.purple} label="핵심 질문">
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: C.text }}>1. 어떤 변환이 되돌릴 수 있는지(역행렬이 존재하는지) 판정하는 기준은?</strong>
          </div>
          <div>
            <strong style={{ color: C.text }}>2. 되돌릴 수 없는 변환의 경우, 연립방정식의 해는 어떻게 되는가?</strong>
          </div>
        </Box>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Determinant Geometric Meaning
   ═══════════════════════════════════════════════════════════════ */
function DeterminantMeaning() {
  const [matA, setMatA] = useState([[2, 1], [1, 3]]);
  
  const det = matA[0][0] * matA[1][1] - matA[0][1] * matA[1][0];

  // 단위 정사각형의 꼭짓점
  const unitSquare = [[0, 0], [1, 0], [1, 1], [0, 1]];
  
  // 변환된 사각형
  const transformedSquare = unitSquare.map(([x, y]) => [
    matA[0][0] * x + matA[0][1] * y,
    matA[1][0] * x + matA[1][1] * y,
  ]);

  const svgSize = 200;
  const scale = 30;
  const offset = svgSize / 2;

  const toSvg = (x, y) => [offset + x * scale, offset - y * scale];

  return (
    <div>
      <SectionTitle subtitle="넓이 변환 비율로서의 행렬식">
        3. 행렬식의 기하학적 의미
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        2×2 행렬 <Eq>{'A'}</Eq>의 행렬식 <Eq>{'\\det(A)'}</Eq>는 변환 <Eq>{'A'}</Eq>가
        <strong style={{ color: C.accent }}> 넓이를 몇 배로 바꾸는가</strong>를 나타냅니다.
      </p>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
          🎨 행렬식 시각화
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
          <MatrixInput matrix={matA} setMatrix={setMatA} rows={2} cols={2} label="행렬 A" color={C.blue} />

          <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <svg width={svgSize} height={svgSize} style={{ background: `${C.surface}`, borderRadius: 8 }}>
                {/* Grid lines */}
                {[-3, -2, -1, 0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <line x1={toSvg(i, -4)[0]} y1={toSvg(i, -4)[1]} x2={toSvg(i, 4)[0]} y2={toSvg(i, 4)[1]} stroke={C.border} strokeWidth="0.5" />
                    <line x1={toSvg(-4, i)[0]} y1={toSvg(-4, i)[1]} x2={toSvg(4, i)[0]} y2={toSvg(4, i)[1]} stroke={C.border} strokeWidth="0.5" />
                  </g>
                ))}
                {/* Unit square */}
                <polygon
                  points={unitSquare.map(([x, y]) => toSvg(x, y).join(",")).join(" ")}
                  fill={`${C.green}30`}
                  stroke={C.green}
                  strokeWidth="2"
                />
                <text x={toSvg(0.5, 0.5)[0]} y={toSvg(0.5, 0.5)[1]} fill={C.green} fontSize="12" textAnchor="middle">넓이=1</text>
              </svg>
              <div style={{ color: C.textDim, fontSize: "0.85em", marginTop: 8 }}>원본 (단위 정사각형)</div>
            </div>

            <div style={{ color: C.accent, fontSize: "2rem" }}>→</div>

            <div style={{ textAlign: "center" }}>
              <svg width={svgSize} height={svgSize} style={{ background: `${C.surface}`, borderRadius: 8 }}>
                {/* Grid lines */}
                {[-3, -2, -1, 0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <line x1={toSvg(i, -4)[0]} y1={toSvg(i, -4)[1]} x2={toSvg(i, 4)[0]} y2={toSvg(i, 4)[1]} stroke={C.border} strokeWidth="0.5" />
                    <line x1={toSvg(-4, i)[0]} y1={toSvg(-4, i)[1]} x2={toSvg(4, i)[0]} y2={toSvg(4, i)[1]} stroke={C.border} strokeWidth="0.5" />
                  </g>
                ))}
                {/* Transformed parallelogram */}
                <polygon
                  points={transformedSquare.map(([x, y]) => toSvg(x, y).join(",")).join(" ")}
                  fill={det >= 0 ? `${C.blue}30` : `${C.red}30`}
                  stroke={det >= 0 ? C.blue : C.red}
                  strokeWidth="2"
                />
              </svg>
              <div style={{ color: C.textDim, fontSize: "0.85em", marginTop: 8 }}>변환 후</div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 20,
          padding: 16,
          background: C.surface,
          borderRadius: 12,
          textAlign: "center",
        }}>
          <span style={{ color: C.textDim }}>det(A) = </span>
          <span style={{ 
            color: det === 0 ? C.red : det > 0 ? C.green : C.orange,
            fontSize: "1.5em",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}>
            {det}
          </span>
          <span style={{ color: C.textMuted, marginLeft: 16 }}>
            {det === 0 && "→ 차원 붕괴! 역행렬 없음"}
            {det > 0 && `→ 넓이가 ${det}배 (방향 보존)`}
            {det < 0 && `→ 넓이가 ${Math.abs(det)}배 (방향 반전)`}
          </span>
        </div>
      </div>

      <Box color={C.red} label="핵심">
        <Eq>{'\\det(A) = 0'}</Eq>이면 변환이 <strong style={{ color: C.yellow }}>차원을 낮추므로</strong>,
        정보가 손실되어 되돌릴 수 없습니다. 이것이 역행렬이 존재하지 않는 이유입니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. Gaussian Elimination
   ═══════════════════════════════════════════════════════════════ */
function GaussianElimination() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      matrix: [[1, 2, 1, 5], [2, 5, 3, 13], [1, 3, 2, 8]],
      description: "원래 첨가행렬",
      operation: null,
    },
    {
      matrix: [[1, 2, 1, 5], [0, 1, 1, 3], [1, 3, 2, 8]],
      description: "1행의 -2배를 2행에 더함",
      operation: "R₂ ← R₂ - 2R₁",
      highlight: (i, j) => i === 1,
    },
    {
      matrix: [[1, 2, 1, 5], [0, 1, 1, 3], [0, 1, 1, 3]],
      description: "1행의 -1배를 3행에 더함",
      operation: "R₃ ← R₃ - R₁",
      highlight: (i, j) => i === 2,
    },
    {
      matrix: [[1, 2, 1, 5], [0, 1, 1, 3], [0, 0, 0, 0]],
      description: "2행의 -1배를 3행에 더함",
      operation: "R₃ ← R₃ - R₂",
      highlight: (i, j) => i === 2,
    },
  ];

  const currentStep = steps[step];

  return (
    <div>
      <SectionTitle subtitle="연립방정식 해의 존재와 유일성 판정">
        4. 가우스 소거법
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        가우스 소거법은 세 가지 행 연산을 사용해서 행렬을 사다리꼴로 만드는 과정입니다:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "2rem" }}>
        {[
          { op: "행 교환", desc: "두 행의 위치를 바꾸기", color: C.blue },
          { op: "스칼라배", desc: "행 전체에 0이 아닌 수를 곱하기", color: C.green },
          { op: "행 덧셈", desc: "한 행의 배수를 다른 행에 더하기", color: C.purple },
        ].map((item, i) => (
          <div key={i} style={{
            padding: 16,
            background: `${item.color}15`,
            border: `1px solid ${item.color}40`,
            borderRadius: 12,
            textAlign: "center",
          }}>
            <div style={{ color: item.color, fontWeight: 700, marginBottom: 6 }}>{item.op}</div>
            <div style={{ color: C.textDim, fontSize: "0.85em" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
          📊 가우스 소거법 단계별 시각화
        </div>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <MatrixDisplay
            matrix={currentStep.matrix}
            highlight={currentStep.highlight}
            color={C.accent}
          />
        </div>

        {currentStep.operation && (
          <div style={{
            textAlign: "center",
            padding: "12px 20px",
            background: C.surface,
            borderRadius: 8,
            marginBottom: 20,
            color: C.yellow,
            fontFamily: "var(--font-mono)",
          }}>
            {currentStep.operation}
          </div>
        )}

        <div style={{ textAlign: "center", color: C.textDim, marginBottom: 20 }}>
          {currentStep.description}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              padding: "10px 24px",
              background: step === 0 ? C.surface : `${C.blue}20`,
              border: `1px solid ${step === 0 ? C.border : C.blue}`,
              borderRadius: 8,
              color: step === 0 ? C.textMuted : C.blue,
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            ← 이전
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            style={{
              padding: "10px 24px",
              background: step === steps.length - 1 ? C.surface : `${C.green}20`,
              border: `1px solid ${step === steps.length - 1 ? C.border : C.green}`,
              borderRadius: 8,
              color: step === steps.length - 1 ? C.textMuted : C.green,
              cursor: step === steps.length - 1 ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            다음 →
          </button>
        </div>
      </div>

      <Box color={C.orange} label="Rank와 해의 판정">
        <p style={{ marginBottom: "1rem" }}>
          "최초의 1"(피벗)의 개수를 <strong style={{ color: C.yellow }}>rank(계수)</strong>라고 합니다.
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          <div>• rank = 미지수 개수 → <strong style={{ color: C.green }}>유일한 해</strong></div>
          <div>• rank {"<"} 미지수 개수, 모순 없음 → <strong style={{ color: C.blue }}>무한히 많은 해</strong></div>
          <div>• 모순 발생 (예: 0 = 3) → <strong style={{ color: C.red }}>해 없음</strong></div>
        </div>
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. Elementary Matrices
   ═══════════════════════════════════════════════════════════════ */
function ElementaryMatrices() {
  const [activeTab, setActiveTab] = useState(0);
  const [c, setC] = useState(-2);

  const tabs = [
    { label: "행 교환", color: C.blue },
    { label: "스칼라배", color: C.green },
    { label: "행 덧셈", color: C.purple },
  ];

  const identityMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const exampleMatrix = [[2, 1, 3], [4, 5, 6], [7, 8, 9]];

  // 각 기본행렬
  const elementaryMatrices = [
    [[0, 1, 0], [1, 0, 0], [0, 0, 1]], // 행 교환 (1↔2)
    [[1, 0, 0], [0, 3, 0], [0, 0, 1]], // 스칼라배 (2행 × 3)
    [[1, 0, 0], [c, 1, 0], [0, 0, 1]], // 행 덧셈 (1행의 c배를 2행에)
  ];

  const multiply = (A, B) => {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  const E = elementaryMatrices[activeTab];
  const EA = multiply(E, exampleMatrix);

  // 역행렬
  const inverseMatrices = [
    [[0, 1, 0], [1, 0, 0], [0, 0, 1]], // 교환의 역 = 교환
    [[1, 0, 0], [0, 1/3, 0], [0, 0, 1]], // 스칼라배의 역 = 역수배
    [[1, 0, 0], [-c, 1, 0], [0, 0, 1]], // 행 덧셈의 역 = 반대 부호
  ];

  const descriptions = [
    "1행과 2행을 교환합니다. 역연산도 같은 연산입니다.",
    "2행에 3을 곱합니다. 역연산은 1/3을 곱하는 것입니다.",
    `1행의 ${c}배를 2행에 더합니다. 역연산은 ${-c}배를 더하는 것입니다.`,
  ];

  return (
    <div>
      <SectionTitle subtitle="행 연산을 행렬로 표현하기">
        5. 기본행렬
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        행렬은 변환입니다. 그렇다면 행 연산도 <strong style={{ color: C.accent }}>어떤 행렬을 곱하는 것</strong>으로
        표현할 수 있지 않을까요?
      </p>

      <Box color={C.accent} label="핵심 원리">
        <strong style={{ color: C.text }}>항등행렬에 행 연산을 적용하면, 그 연산을 나타내는 행렬이 됩니다.</strong>
      </Box>

      <TabGroup tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
      }}>
        {activeTab === 2 && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: C.textDim, marginRight: 12 }}>c 값:</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={c}
              onChange={(e) => setC(parseInt(e.target.value))}
              style={{ width: 150, verticalAlign: "middle" }}
            />
            <span style={{ color: C.yellow, marginLeft: 12, fontFamily: "var(--font-mono)" }}>{c}</span>
          </div>
        )}

        <p style={{ color: C.textDim, fontSize: "0.9em", marginBottom: 20, textAlign: "center" }}>
          {descriptions[activeTab]}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <MatrixDisplay matrix={E} label="기본행렬 E" color={tabs[activeTab].color} />
          <span style={{ color: C.textMuted, fontSize: "1.5rem" }}>×</span>
          <MatrixDisplay matrix={exampleMatrix} label="행렬 A" color={C.textDim} />
          <span style={{ color: C.textMuted, fontSize: "1.5rem" }}>=</span>
          <MatrixDisplay matrix={EA} label="EA" color={C.yellow} highlight={(i) => activeTab === 0 ? i <= 1 : i === 1} />
        </div>

        <div style={{
          padding: 16,
          background: C.surface,
          borderRadius: 12,
          marginTop: 16,
        }}>
          <div style={{ color: C.text, fontWeight: 600, marginBottom: 12 }}>역행렬</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 16, alignItems: "center" }}>
            <MatrixDisplay matrix={E} label="E" color={tabs[activeTab].color} />
            <span style={{ color: C.textMuted, fontSize: "1.5rem" }}>×</span>
            <MatrixDisplay matrix={inverseMatrices[activeTab]} label="E⁻¹" color={C.orange} />
            <span style={{ color: C.textMuted, fontSize: "1.5rem" }}>=</span>
            <MatrixDisplay matrix={identityMatrix} label="I" color={C.green} />
          </div>
        </div>
      </div>

      <Box color={C.green} label="중요한 관찰">
        <strong style={{ color: C.text }}>기본행렬의 역행렬도 기본행렬입니다.</strong><br />
        • 교환의 역 → 교환 (같은 연산)<br />
        • 스칼라배의 역 → 역수배<br />
        • 행 덧셈의 역 → 반대 부호로 덧셈
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. Inverse Matrix Computation
   ═══════════════════════════════════════════════════════════════ */
function InverseMatrixComputation() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      left: [[2, 1], [5, 3]],
      right: [[1, 0], [0, 1]],
      operation: null,
      description: "첨가행렬 [A | I] 구성",
    },
    {
      left: [[1, 0.5], [5, 3]],
      right: [[0.5, 0], [0, 1]],
      operation: "R₁ ← R₁ × ½",
      description: "1행을 ½배",
    },
    {
      left: [[1, 0.5], [0, 0.5]],
      right: [[0.5, 0], [-2.5, 1]],
      operation: "R₂ ← R₂ - 5R₁",
      description: "1행의 -5배를 2행에 더함",
    },
    {
      left: [[1, 0.5], [0, 1]],
      right: [[0.5, 0], [-5, 2]],
      operation: "R₂ ← R₂ × 2",
      description: "2행을 2배",
    },
    {
      left: [[1, 0], [0, 1]],
      right: [[3, -1], [-5, 2]],
      operation: "R₁ ← R₁ - ½R₂",
      description: "2행의 -½배를 1행에 더함",
    },
  ];

  const currentStep = steps[step];

  return (
    <div>
      <SectionTitle subtitle="가우스 소거법으로 역행렬 구하기">
        6. 역행렬 계산
      </SectionTitle>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        가우스 소거법을 통해 <Eq>{'A'}</Eq>를 <Eq>{'I'}</Eq>로 만드는 과정은
        여러 기본행렬을 곱하는 것과 같습니다:
      </p>

      <MathBlock>
        {'E_k \\cdots E_2 E_1 A = I'}
      </MathBlock>

      <p style={{ color: C.textDim, lineHeight: 1.8, marginBottom: "1.5rem" }}>
        따라서 <Eq>{'E_k \\cdots E_1 = A^{-1}'}</Eq>입니다.
        이를 쉽게 구하는 방법: <Eq>{'A'}</Eq>와 <Eq>{'I'}</Eq>를 나란히 놓고 소거법을 적용합니다.
      </p>

      <MathBlock>
        {'[A \\mid I] \\xrightarrow{\\text{행 연산}} [I \\mid A^{-1}]'}
      </MathBlock>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 20 }}>
          🔢 역행렬 계산 과정
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <MatrixDisplay matrix={currentStep.left} label="왼쪽 (A → I)" color={C.blue} />
          <span style={{ color: C.textMuted, fontSize: "1.5rem" }}>|</span>
          <MatrixDisplay matrix={currentStep.right} label="오른쪽 (I → A⁻¹)" color={C.green} />
        </div>

        {currentStep.operation && (
          <div style={{
            textAlign: "center",
            padding: "12px 20px",
            background: C.surface,
            borderRadius: 8,
            marginBottom: 16,
            color: C.yellow,
            fontFamily: "var(--font-mono)",
          }}>
            {currentStep.operation}
          </div>
        )}

        <div style={{ textAlign: "center", color: C.textDim, marginBottom: 20 }}>
          {currentStep.description}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: step === i ? C.accent : C.surface,
                border: `1px solid ${step === i ? C.accent : C.border}`,
                color: step === i ? C.bg : C.textDim,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {step === steps.length - 1 && (
        <Box color={C.green} label="결과">
          <MathBlock>
            {`A^{-1} = \\begin{pmatrix} 3 & -1 \\\\ -5 & 2 \\end{pmatrix}`}
          </MathBlock>
        </Box>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. Proofs Section
   ═══════════════════════════════════════════════════════════════ */
function ProofsSection() {
  const [proof1Revealed, setProof1Revealed] = useState(false);
  const [proof2Revealed, setProof2Revealed] = useState(false);

  return (
    <div>
      <SectionTitle subtitle="기본행렬과 역행렬의 깊은 관계">
        7. 핵심 정리와 증명
      </SectionTitle>

      {/* 정리 1 */}
      <div style={{
        background: `${C.purple}10`,
        border: `1px solid ${C.purple}30`,
        borderRadius: 12,
        padding: 20,
        marginBottom: "2rem",
      }}>
        <div style={{ color: C.purple, fontWeight: 700, marginBottom: 12 }}>정리 1</div>
        <div style={{ color: C.text, lineHeight: 1.8 }}>
          가역행렬은 기본행렬들의 곱으로 표현된다.<br />
          즉, <Eq>{'A'}</Eq>가 가역이면 <Eq>{'A = E_1 E_2 \\cdots E_k'}</Eq>인 기본행렬들이 존재한다.
        </div>

        <button
          onClick={() => setProof1Revealed(!proof1Revealed)}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            background: `${C.purple}20`,
            border: `1px solid ${C.purple}50`,
            borderRadius: 8,
            color: C.purple,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {proof1Revealed ? "증명 숨기기 ▲" : "증명 보기 ▼"}
        </button>

        {proof1Revealed && (
          <div style={{
            marginTop: 16,
            padding: 20,
            background: C.surface,
            borderRadius: 12,
            color: C.textDim,
            lineHeight: 1.9,
          }}>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.text }}>증명:</strong>
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <Eq>{'A'}</Eq>가 가역이면 가우스 소거법을 통해 <Eq>{'A'}</Eq>를 항등행렬 <Eq>{'I'}</Eq>로 만들 수 있습니다:
            </p>
            <MathBlock>{'E_k \\cdots E_2 E_1 A = I'}</MathBlock>
            <p style={{ marginBottom: "1rem" }}>
              기본행렬의 역행렬도 기본행렬입니다. <Eq>{'E_1^{-1}, E_2^{-1}, \\ldots, E_k^{-1}'}</Eq>을 정의합니다.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              위 식의 양변에 <Eq>{'E_1^{-1} E_2^{-1} \\cdots E_k^{-1}'}</Eq>을 곱하면:
            </p>
            <MathBlock>{'A = E_1^{-1} E_2^{-1} \\cdots E_k^{-1}'}</MathBlock>
            <p>
              따라서 <Eq>{'A'}</Eq>는 기본행렬들의 곱으로 표현됩니다. ∎
            </p>
          </div>
        )}
      </div>

      {/* 정리 2 */}
      <div style={{
        background: `${C.orange}10`,
        border: `1px solid ${C.orange}30`,
        borderRadius: 12,
        padding: 20,
      }}>
        <div style={{ color: C.orange, fontWeight: 700, marginBottom: 12 }}>정리 2</div>
        <div style={{ color: C.text, lineHeight: 1.8 }}>
          <Eq>{'A'}</Eq>, <Eq>{'B'}</Eq>가 <Eq>{'n \\times n'}</Eq> 행렬일 때,
          <Eq>{'AB = I'}</Eq>이면 <Eq>{'BA = I'}</Eq>이다.
        </div>

        <button
          onClick={() => setProof2Revealed(!proof2Revealed)}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            background: `${C.orange}20`,
            border: `1px solid ${C.orange}50`,
            borderRadius: 8,
            color: C.orange,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {proof2Revealed ? "증명 숨기기 ▲" : "증명 보기 ▼"}
        </button>

        {proof2Revealed && (
          <div style={{
            marginTop: 16,
            padding: 20,
            background: C.surface,
            borderRadius: 12,
            color: C.textDim,
            lineHeight: 1.9,
          }}>
            <p style={{ marginBottom: "1rem" }}>
              <strong style={{ color: C.text }}>증명:</strong>
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <Eq>{'AB = I'}</Eq>가 주어졌을 때, <Eq>{'Bx = 0'}</Eq>인 연립방정식을 생각합니다.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              양변 왼쪽에 <Eq>{'A'}</Eq>를 곱하면: <Eq>{'ABx = Ix = x = 0'}</Eq>
            </p>
            <p style={{ marginBottom: "1rem" }}>
              즉, <Eq>{'Bx = 0'}</Eq>의 해는 <Eq>{'x = 0'}</Eq>뿐입니다.
              이는 <Eq>{'\\det(B) \\neq 0'}</Eq>을 의미하며, <Eq>{'B'}</Eq>가 가역입니다.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <Eq>{'AB = I'}</Eq>의 양변 오른쪽에 <Eq>{'B^{-1}'}</Eq>을 곱하면:
            </p>
            <MathBlock>{'A = IB^{-1} = B^{-1}'}</MathBlock>
            <p>
              따라서 <Eq>{'BA = BB^{-1} = I'}</Eq>입니다. ∎
            </p>
          </div>
        )}
      </div>

      <Box color={C.accent} label="의미">
        <strong style={{ color: C.text }}>유한 차원에서는 좌역원 = 우역원입니다.</strong><br /><br />
        <Eq>{'AB = I'}</Eq>만 확인하면 <Eq>{'BA = I'}</Eq>는 공짜로 따라옵니다.
        이는 무한 차원에서는 성립하지 않는 유한 차원만의 특별한 성질입니다.
      </Box>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. True/False Problems
   ═══════════════════════════════════════════════════════════════ */
function TrueFalseProblems() {
  const [answers, setAnswers] = useState({});
  const [showSolutions, setShowSolutions] = useState({});

  const problems = [
    {
      id: 1,
      statement: "A와 B가 가역행렬이면, AB도 가역행렬이다.",
      answer: true,
      explanation: "맞습니다. (AB)⁻¹ = B⁻¹A⁻¹이므로, AB의 역행렬이 존재합니다. 순서가 뒤집힌다는 점이 핵심입니다.",
    },
    {
      id: 2,
      statement: "A² = O (영행렬)이면, A = O이다.",
      answer: false,
      explanation: <>거짓입니다. 반례: <Eq>{'A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}'}</Eq>이면 <Eq>{'A^2 = O'}</Eq>이지만 <Eq>{'A \\neq O'}</Eq>입니다. 이런 행렬을 멱영행렬(nilpotent matrix)이라고 합니다.</>,
    },
    {
      id: 3,
      statement: "AB = AC이고 A ≠ O이면, B = C이다.",
      answer: false,
      explanation: <>거짓입니다. A가 가역이 아니면 B = C가 보장되지 않습니다. 반례: 위와 같은 멱영행렬을 사용하면 됩니다.</>,
    },
  ];

  return (
    <div>
      <SectionTitle subtitle="개념 확인 문제">
        8. 참/거짓 문제
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

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
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
   9. Summary
   ═══════════════════════════════════════════════════════════════ */
function Summary() {
  return (
    <div>
      <SectionTitle subtitle="1.1절 전체 정리">
        요약
      </SectionTitle>

      <div style={{
        background: C.surfaceAlt,
        borderRadius: 16,
        padding: 28,
        border: `1px solid ${C.border}`,
        marginBottom: "2rem",
      }}>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            { title: "행렬 = 변환", desc: "행렬 곱셈은 변환의 합성", color: C.blue, detail: "곱셈 정의가 필연적인 이유" },
            { title: "연립방정식 Ax = b", desc: "변환의 역추적 문제", color: C.green, detail: "역변환이 존재하면 x = A⁻¹b" },
            { title: "행렬식", desc: "넓이/부피 변환 비율", color: C.purple, detail: "det = 0 ↔ 차원 붕괴 ↔ 역행렬 없음" },
            { title: "가우스 소거법", desc: "행 연산으로 사다리꼴 만들기", color: C.orange, detail: "rank로 해의 존재/유일성 판정" },
            { title: "기본행렬", desc: "각 행 연산 = 특정 행렬 곱하기", color: C.yellow, detail: "기본행렬의 역행렬도 기본행렬" },
            { title: "역행렬 계산", desc: "[A | I] → [I | A⁻¹]", color: C.accent, detail: "가우스 소거법으로 직접 계산" },
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
export default function LinearAlgebra11Blog() {
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
        input[type="number"] {
          -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        ::selection { background: ${C.accent}40; }
      `}</style>

      <article>
        <section style={{ marginBottom: "5rem" }}>
          <Introduction />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <WhyMatrixMultiplication />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <LinearEquationsAsInverse />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <DeterminantMeaning />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <GaussianElimination />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ElementaryMatrices />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <InverseMatrixComputation />
        </section>

        <section style={{ marginBottom: "5rem" }}>
          <ProofsSection />
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
