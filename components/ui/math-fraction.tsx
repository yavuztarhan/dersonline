'use client';

import React from 'react';

export interface MathFractionProps {
  numerator?: string | number;
  denominator?: string | number;
  whole?: string | number;
  sign?: string;
  unit?: string;
  value?: string;
  isAbsolute?: boolean;
  className?: string;
}

/**
 * Parses strings like:
 * "-11/4", "+7/2", "3/4", "-2 tam 3/4", "+3 tam 1/4", "|-11/4|", "+1/2 m/s", "1/3 bar"
 */
function parseFractionString(val: string): {
  isAbsolute: boolean;
  sign?: string;
  whole?: string;
  num: string;
  den: string;
  unit?: string;
} | null {
  const trimmed = val.trim();
  let isAbsolute = false;
  let target = trimmed;

  // Check absolute value wraps: |...|
  if (target.startsWith('|') && target.endsWith('|')) {
    isAbsolute = true;
    target = target.slice(1, -1).trim();
  }

// Check parentheses wraps: (...)
  if (target.startsWith('(') && target.endsWith(')')) {
    target = target.slice(1, -1).trim();
  }

  // Check unit suffix like "ton", "bar", "m/s", "kWh"
  let unit: string | undefined;
  const unitMatch = target.match(/\s+(ton|bar|m\/s|Metre|metre|birim|kWh)$/i);
  if (unitMatch) {
    unit = unitMatch[1];
    target = target.slice(0, unitMatch.index).trim();
  }

  // Check for whole part, e.g. "-2 tam 3/4" or "+3 tam 1/4" or "2 3/4"
  const wholeMatch = target.match(/^([+-]?\d+)\s*(?:tam)?\s+(\d+)\/(\d+)$/i);
  if (wholeMatch) {
    const wholePrefix = target.includes('tam') ? `${wholeMatch[1]} tam` : wholeMatch[1];
    return {
      isAbsolute,
      whole: wholePrefix,
      num: wholeMatch[2],
      den: wholeMatch[3],
      unit
    };
  }

  // Check for simple signed or unsigned fraction: "-11/4", "+7/2", "3/4"
  const fracMatch = target.match(/^([+-])?(\d+)\/(\d+)$/);
  if (fracMatch) {
    return {
      isAbsolute,
      sign: fracMatch[1],
      num: fracMatch[2],
      den: fracMatch[3],
      unit
    };
  }

  return null;
}

/**
 * Standard Mathematical Fraction Component with Horizontal Fraction Bar.
 * Displays numerator on top, denominator on bottom, and a crisp horizontal fraction line between them.
 */
export function MathFraction({
  numerator,
  denominator,
  whole,
  sign,
  unit,
  value,
  isAbsolute,
  className = ''
}: MathFractionProps) {
  let displaySign = sign;
  let displayWhole = whole;
  let displayNum = numerator !== undefined ? String(numerator) : '';
  let displayDen = denominator !== undefined ? String(denominator) : '';
  let displayUnit = unit;
  let displayAbsolute = isAbsolute || false;

  if (value) {
    const parsed = parseFractionString(value);
    if (parsed) {
      displayAbsolute = parsed.isAbsolute || displayAbsolute;
      displaySign = parsed.sign || displaySign;
      displayWhole = parsed.whole || displayWhole;
      displayNum = parsed.num;
      displayDen = parsed.den;
      displayUnit = parsed.unit || displayUnit;
    } else if (value.includes('/')) {
      const parts = value.split('/');
      displayNum = parts[0];
      displayDen = parts[1];
    }
  }

  if (!displayNum || !displayDen) {
    return <span className={className}>{value || ''}</span>;
  }

  const fractionNode = (
    <span className={`inline-flex items-center align-middle font-sans leading-none select-none mx-0.5 ${className}`}>
      {displaySign && <span className="mr-0.5 font-bold">{displaySign}</span>}
      {displayWhole && <span className="mr-1 font-bold">{displayWhole}</span>}
      <span className="inline-flex flex-col items-center justify-center align-middle mx-0.5">
        <span className="text-[0.80em] font-black leading-none px-0.5 pb-[2px]">{displayNum}</span>
        <span className="w-full h-[1.5px] bg-current rounded-full" />
        <span className="text-[0.80em] font-black leading-none px-0.5 pt-[2px]">{displayDen}</span>
      </span>
      {displayUnit && <span className="ml-1 text-[0.9em] font-normal">{displayUnit}</span>}
    </span>
  );

  if (displayAbsolute) {
    return (
      <span className={`inline-flex items-center align-middle font-sans font-bold leading-none ${className}`}>
        <span className="text-[1.15em] leading-none px-0.5 opacity-80">|</span>
        {fractionNode}
        <span className="text-[1.15em] leading-none px-0.5 opacity-80">|</span>
      </span>
    );
  }

  return fractionNode;
}

/**
 * MathText Component:
 * Automatically parses any Turkish/mathematical text containing fractions (e.g. "-11/4", "3/4", "-2 tam 3/4", "|-11/4|")
 * and converts them into standard horizontal fraction bar components (<MathFraction />).
 */
export function MathText({
  text,
  className = ''
}: {
  text?: string | null;
  className?: string;
}) {
  if (!text) return null;
  if (typeof text !== 'string') return <span className={className}>{text}</span>;

  // Matches:
  // 1. Absolute fractions: |[-+]?\d{1,3}/\d{1,3}| or |[-+]?\d{1,2} tam \d{1,3}/\d{1,3}|
  // 2. Whole fractions: [-+]?\d{1,2} tam \d{1,3}/\d{1,3}
  // 3. Signed / unsigned fractions: [-+]?\d{1,3}/\d{1,3}
  const FRACTION_REGEX = /(\|[-+]?\d{1,3}\/\d{1,3}\||\|[-+]?\d{1,2}\s+tam\s+\d{1,3}\/\d{1,3}\||[-+]?\d{1,2}\s+tam\s+\d{1,3}\/\d{1,3}|[-+]?\d{1,3}\/\d{1,3})/g;
  const parts = text.split(FRACTION_REGEX);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (part.includes('/') && /[-+]?\d+\/\d+/.test(part)) {
          return <MathFraction key={idx} value={part} />;
        }
        return part;
      })}
    </span>
  );
}

/**
 * Returns HTML string representation of a vertical fraction with horizontal bar
 * for use in printable/whiteboard HTML documents.
 */
export function formatFractionHtml(
  num: string | number,
  den: string | number,
  options?: {
    whole?: string | number;
    sign?: string;
    unit?: string;
    isAbsolute?: boolean;
  }
): string {
  const { whole, sign, unit, isAbsolute } = options || {};
  let content = '';

  if (sign) {
    content += `<span style="margin-right:2px; font-weight:800;">${sign}</span>`;
  }
  if (whole) {
    content += `<span style="margin-right:4px; font-weight:800;">${whole}</span>`;
  }

  content += `
    <span style="display:inline-flex; flex-direction:column; vertical-align:middle; text-align:center; font-size:0.85em; line-height:1; margin:0 2px;">
      <span style="border-bottom:1.5px solid currentColor; padding-bottom:1px; font-weight:800;">${num}</span>
      <span style="padding-top:1px; font-weight:800;">${den}</span>
    </span>
  `.trim();

  if (unit) {
    content += `<span style="margin-left:3px; font-size:0.9em;">${unit}</span>`;
  }

  if (isAbsolute) {
    return `<span style="display:inline-flex; align-items:center; vertical-align:middle;"><span style="font-size:1.15em; opacity:0.8;">|</span>${content}<span style="font-size:1.15em; opacity:0.8;">|</span></span>`;
  }

  return `<span style="display:inline-flex; align-items:center; vertical-align:middle;">${content}</span>`;
}
