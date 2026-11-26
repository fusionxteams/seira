import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Check, Sparkles } from 'lucide-react';
import { LiquidTabs } from '@/components/liquid-tabs';
import { SERVICES } from '../data/siteData';

interface ServicesPageProps {
  onOpenBooking: (treatment?: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ServicesPage({ onOpenBooking }: ServicesPageProps) {
  const [group, setGroup] = useState<'all' | 'face' | 'hair' | 'body'>('all');

  const visibleServices =
    group === 'all'
      ? SERVICES
      : group === 'face'
        ? SERVICES.filter((s) =>
            ['skin-treatments', 'anti-aging-solutions', 'semi-permanent-makeup'].includes(s.id),
          )
        : group === 'hair'
          ? SERVICES.filter((s) => ['hair-treatments'].includes(s.id))
          : SERVICES.filter((s) =>
              ['cosmetic-surgery', 'laser-treatments', 'obesity-treatment'].includes(s.id),
            );

  return (
    <div className="bg-[var(--color-cream-soft)]">
      {/* 1. Minimal Editorial Header + @hairline/liquid-tabs */}
      <section className="border-b border-[var(--color-border)] bg-white py-14 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-end md:px-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              07 Specialized Disciplines
            </span>
            <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]">
              Aesthetic Care, Designed Around You
            </h1>
          </div>

          <LiquidTabs
            label="Filter treatments by concern"
            value={group}
            onValueChange={(v) => setGroup(v as 'all' | 'face' | 'hair' | 'body')}
            tabs={[
              { value: 'all', label: 'All (07)' },
              { value: 'face', label: 'Skin & Face' },
              { value: 'hair', label: 'Hair & Scalp' },
              { value: 'body', label: 'Laser & Body' },
            ]}
          />
        </div>
      </section>

      {/* 2. 2026 Scroll-Pinned Stacking Panels */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-10 pb-16">
          {visibleServices.map((service, idx) => {
            const isTint = idx % 2 === 1;
            const stickyTop = 96 + Math.min(idx, 5) * 14;

            return (
              <motion.article
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ top: `${stickyTop}px` }}
                className={`sticky grid scroll-mt-28 grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border p-6 shadow-[0_20px_60px_rgba(24,21,18,0.08)] md:grid-cols-12 md:p-10 ${
                  isTint
                    ? 'border-[var(--color-gold)]/25 bg-[var(--color-cream)]'
                    : 'border-[var(--color-border)] bg-white'
                }`}
              >
                <div className={`overflow-hidden rounded-2xl md:col-span-6 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>

                <div className={`flex flex-col justify-between md:col-span-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[var(--color-gold)]/12 px-3 py-1 text-xs font-medium text-[var(--color-gold)]">
                        {service.number} / 0{SERVICES.length}
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl text-[var(--color-ink)] md:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)]">
                      {service.summary}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {service.details}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.focusAreas.map((area) => (
                        <li
                          key={area}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white/80 px-3 py-1.5 text-xs text-[var(--color-ink)]"
                        >
                          <Check className="h-3.5 w-3.5 text-[var(--color-gold)]" strokeWidth={1.75} />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(service.title)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-espresso)]"
                    >
                      <Calendar className="h-4 w-4" strokeWidth={1.5} />
                      Book {service.title}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
