import * as React from 'react';

export interface NumberRollProps {
  value: number;
  suffix?: string;
  prefix?: string;
  from?: number;
  duration?: number;
  className?: string;
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SETS = 5;
const MIDDLE = 20;
const STRIP = Array.from({ length: SETS * 10 }, (_, i) => i % 10).join('\n');

/**
 * Hairline-inspired odometer NumberRoll for clinic metrics.
 */
export function NumberRoll({
  value,
  suffix = '',
  prefix = '',
  from = 0,
  duration = 900,
  className = '',
}: NumberRollProps) {
  const [current, setCurrent] = React.useState(from);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCurrent(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCurrent(value);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const chars = [...String(current)];

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline tabular-nums leading-none ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {chars.map((char, idx) => {
        const digit = /\d/.test(char) ? Number(char) : null;
        if (digit === null) {
          return (
            <span key={`s-${idx}`} aria-hidden="true">
              {char}
            </span>
          );
        }
        const offset = MIDDLE + digit;
        return (
          <span
            key={`d-${chars.length - idx}`}
            aria-hidden="true"
            className="relative inline-block h-[1em] overflow-hidden align-top"
          >
            <span
              className="block whitespace-pre text-center"
              style={{
                lineHeight: '1em',
                transform: `translateY(-${offset}em)`,
                transition: `transform ${duration}ms ${EASE}`,
              }}
            >
              {STRIP}
            </span>
          </span>
        );
      })}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
