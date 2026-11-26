import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Calendar, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { NumberRoll } from '@/components/number-roll';
import { ABOUT_CONTENT, SERVICES } from '../data/siteData';

interface HomePageProps {
  onOpenBooking: (treatment?: string) => void;
}

const EASE_FLUID = [0.16, 1, 0.3, 1] as const;

/* ─── Bento Grid: Modern Services Showcase ─── */
function ServicesBentoGrid({ onOpenBooking }: { onOpenBooking: (t?: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Layout: first card is big (col-span-2 row-span-2), rest alternate
  const cards = SERVICES.map((s, i) => ({
    ...s,
    big: i === 0,
    wide: i === 3 || i === 5,
  }));

  return (
    <section className="bg-[var(--color-bg)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-medium tracking-widest text-[var(--color-gold)] uppercase">
              Our Disciplines
            </span>
            <h2 className="mt-2 max-w-xl text-3xl leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)] md:text-[2.75rem]">
              Aesthetic Care,<br className="hidden md:block" /> Designed Around You
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-cream-soft)] md:self-auto"
          >
            All Services <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4 md:gap-4">
          {cards.map((service) => {
            const isHovered = hovered === service.id;
            const colSpan = service.big
              ? 'col-span-2 row-span-2'
              : service.wide
              ? 'col-span-2'
              : 'col-span-1';
            return (
              <motion.button
                key={service.id}
                type="button"
                onClick={() => onOpenBooking(service.title)}
                onHoverStart={() => setHovered(service.id)}
                onHoverEnd={() => setHovered(null)}
                className={`group relative overflow-hidden rounded-2xl bg-[var(--color-cream-soft)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] md:rounded-3xl ${colSpan}`}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background image */}
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{ scale: isHovered ? 1.06 : 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Gradient overlay — always dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/90 via-[#181512]/30 to-transparent" />

                {/* Number badge top-left */}
                <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-white/90 backdrop-blur-sm md:left-4 md:top-4">
                  {service.number}
                </span>

                {/* Book pill top-right — appears on hover */}
                <motion.span
                  className="absolute right-3 top-3 rounded-full bg-[var(--color-gold)] px-3 py-1 text-[11px] font-semibold text-[#181512] md:right-4 md:top-4"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -6 }}
                  transition={{ duration: 0.22 }}
                >
                  Book →
                </motion.span>

                {/* Text at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3
                    className={`font-medium leading-tight text-white ${
                      service.big ? 'text-xl md:text-2xl' : 'text-sm md:text-base'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <motion.p
                    className="mt-1 text-xs leading-relaxed text-white/70"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      height: isHovered ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.summary}
                  </motion.p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomePage({ onOpenBooking }: HomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  const headlineWords = 'Enhance Your Natural Beauty With Aesthetic Care'.split(' ');

  return (
    <div className="-mt-20">
      {/* 1. Scroll-Linked Parallax Poster Hero + Split-Text Choreography + Frosted Dock */}
      <section
        ref={heroRef}
        className="relative flex min-h-[94vh] flex-col justify-end overflow-hidden bg-[var(--color-ink)] pt-28 pb-12"
      >
        <motion.img
          src="/images/hero-clinic.png"
          alt="Seira Wellness personalized aesthetic consultation"
          style={{ scale: heroImgScale, y: heroImgY }}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55 will-change-transform"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[var(--color-ink)]/45"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[1.03] tracking-[-0.025em] text-[var(--color-cream)]">
              {headlineWords.map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: EASE_FLUID }}
                  className="mr-[0.26em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_FLUID }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-cream)]/85 md:text-lg"
            >
              Experience personalized aesthetic care that enhances your natural beauty, restores
              confidence, and brings out your best self.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE_FLUID }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenBooking()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-cream)] px-7 py-3.5 text-sm font-medium text-[var(--color-espresso)] transition-colors hover:bg-[var(--color-gold-light)]"
              >
                <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Book An Appointment
              </motion.button>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-cream)]/35 bg-[var(--color-ink)]/45 px-7 py-3.5 text-sm font-medium text-[var(--color-cream)] backdrop-blur-md transition-colors hover:border-[var(--color-cream)] hover:bg-[var(--color-ink)]/70"
              >
                Explore Treatments
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Floating Frosted-Glass Odometer Metrics Dock (Real @hairline/number-roll) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_FLUID }}
            className="mt-12 grid grid-cols-2 gap-6 rounded-3xl border border-white/40 bg-[var(--color-cream-soft)]/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl md:grid-cols-4 md:p-8"
          >
            <div>
              <NumberRoll
                value={10}
                from={0}
                suffix="+"
                className="font-[var(--font-display)] text-3xl text-[var(--color-espresso)] md:text-4xl"
              />
              <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)] md:text-sm">
                Years of Experience
              </p>
            </div>
            <div className="border-l border-[var(--color-border)] pl-6">
              <NumberRoll
                value={5}
                from={0}
                suffix="K+"
                className="font-[var(--font-display)] text-3xl text-[var(--color-espresso)] md:text-4xl"
              />
              <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)] md:text-sm">
                Patients Treated
              </p>
            </div>
            <div className="md:border-l md:border-[var(--color-border)] md:pl-6">
              <NumberRoll
                value={15}
                from={0}
                suffix="+"
                className="font-[var(--font-display)] text-3xl text-[var(--color-espresso)] md:text-4xl"
              />
              <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)] md:text-sm">
                Advanced Treatments
              </p>
            </div>
            <div className="border-l border-[var(--color-border)] pl-6">
              <NumberRoll
                value={96}
                from={0}
                suffix="%"
                className="font-[var(--font-display)] text-3xl text-[var(--color-espresso)] md:text-4xl"
              />
              <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)] md:text-sm">
                Patient Satisfaction
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Kinetic Infinite Ticker */}
      <div className="overflow-hidden border-y border-[var(--color-espresso)]/20 bg-[var(--color-ink)] py-4 text-[var(--color-gold-light)]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex w-max items-center gap-8 whitespace-nowrap text-sm"
        >
          {[...SERVICES, ...SERVICES].map((s, idx) => (
            <span key={`${s.id}-${idx}`} className="inline-flex items-center gap-8">
              <span className="font-[var(--font-display)] text-base">{s.title}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" aria-hidden="true" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. Modern Bento-Grid Treatment Showcase */}
      <ServicesBentoGrid onOpenBooking={onOpenBooking} />

      {/* 4. Dark Glass Full-Width Horizontal Band */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] py-16 md:py-24">
        <img
          src="/images/clinic-interior.jpeg"
          alt="Seira Wellness clinic reception"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        {/* Full-width horizontal glass rectangle */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <div className="rounded-3xl border border-white/15 bg-[var(--color-ink)]/75 px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:px-14 md:py-12">
            {/* Row layout: headline | divider | three pillars | divider | CTA */}
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-0">

              {/* Headline block */}
              <div className="shrink-0 md:w-72 md:pr-10">
                <h2 className="text-2xl leading-snug text-[var(--color-cream)] md:text-3xl">
                  {ABOUT_CONTENT.headline}
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-cream)]/65">
                  {ABOUT_CONTENT.intro}
                </p>
              </div>

              {/* Vertical divider */}
              <div className="hidden w-px self-stretch bg-white/15 md:block" />

              {/* Three pillars in a row */}
              <div className="flex flex-1 flex-col gap-6 md:flex-row md:gap-0 md:divide-x md:divide-white/15 md:px-6">
                {[
                  { Icon: UserCheck, label: 'Patient-Centred', sub: 'Listening carefully before recommending any procedure.' },
                  { Icon: Sparkles,  label: 'Natural Results',  sub: 'Balanced outcomes that enhance your natural features.' },
                  { Icon: ShieldCheck, label: 'Ethical Practice', sub: 'Modern clinical technology with transparent guidance.' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 md:flex-1 md:px-6">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-cream)]">{label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-cream)]/60">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vertical divider */}
              <div className="hidden w-px self-stretch bg-white/15 md:block" />

              {/* CTA */}
              <div className="shrink-0 md:pl-10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-6 py-3 text-sm font-medium text-[var(--color-espresso)] transition-colors hover:bg-[var(--color-gold-light)] whitespace-nowrap"
                >
                  Our Story
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
