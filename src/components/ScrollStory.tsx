import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, Check } from 'lucide-react';
import { NumberRoll } from './NumberRoll';
import { SERVICES } from '../data/siteData';

interface ScrollStoryProps {
  onOpenBooking: (treatment?: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hairline-inspired ScrollStory:
 * As the user scrolls, a vertical hairline rail fills continuously,
 * active steps illuminate, and the sticky glass stage morphs with NumberRoll.
 */
export function ScrollStory({ onOpenBooking }: ScrollStoryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight * 0.6);
      const passed = Math.min(total, Math.max(0, -rect.top + window.innerHeight * 0.35));
      setProgress(passed / total);

      const mid = window.innerHeight * 0.45;
      let bestIdx = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      setActiveIndex(bestIdx);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToStep = (idx: number) => {
    const el = stepRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activeService = SERVICES[activeIndex] ?? SERVICES[0];

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
      {/* Left: Scroll Steps with Filling Hairline Rail */}
      <div className="relative pl-8 md:col-span-5">
        <div
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-2.5 w-px bg-[var(--color-border)]"
        >
          <div
            className="w-full bg-[var(--color-gold)] transition-[height] duration-150 ease-out"
            style={{ height: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="flex flex-col gap-6">
          {SERVICES.map((service, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx <= activeIndex;
            return (
              <div
                key={service.id}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                onClick={() => scrollToStep(idx)}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  isActive
                    ? 'border-[var(--color-gold)]/50 bg-[var(--color-bg)]/90 shadow-[0_12px_36px_rgba(34,34,34,0.06)] backdrop-blur-xl'
                    : 'border-transparent bg-transparent opacity-55 hover:opacity-85'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-7 -left-[27px] h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                    isPassed
                      ? 'border-[var(--color-gold)] bg-[var(--color-gold)]'
                      : 'border-[var(--color-border)] bg-[var(--color-cream-soft)]'
                  }`}
                />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-medium text-[var(--color-gold)]">
                    {service.number}
                  </span>
                </div>
                <h3 className="mt-1 text-2xl text-[var(--color-ink)]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {service.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Sticky Glass Stage that Morphs with Scroll */}
      <div className="order-first md:order-last md:col-span-7">
        <div className="sticky top-24 rounded-3xl border border-white/60 bg-[var(--color-bg)]/80 p-5 shadow-[0_20px_60px_rgba(34,34,34,0.08)] backdrop-blur-2xl md:top-28 md:p-8">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div className="flex items-baseline gap-1.5 font-[var(--font-display)] text-lg text-[var(--color-espresso)]">
              <NumberRoll value={activeIndex + 1} prefix="0" />
              <span className="text-sm text-[var(--color-ink-muted)]">/ 0{SERVICES.length}</span>
            </div>
            <span className="rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-medium text-[var(--color-espresso)]">
              {activeService.title}
            </span>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-[var(--color-surface)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeService.id}
                src={activeService.image}
                alt={activeService.title}
                initial={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: EASE }}
                className="aspect-[16/10] w-full object-cover"
              />
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeService.id}-meta`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-6"
            >
              <p className="text-sm leading-relaxed text-[var(--color-ink-muted)] md:text-base">
                {activeService.details}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
                <ul className="flex flex-wrap gap-2">
                  {activeService.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-cream-soft)] px-3 py-1 text-xs text-[var(--color-espresso)]"
                    >
                      <Check className="h-3 w-3 text-[var(--color-gold)]" strokeWidth={1.75} />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onOpenBooking(activeService.title)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-espresso)] px-5 py-2.5 text-xs font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-gold)]"
                >
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Book {activeService.title}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
