import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Calendar, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { NumberRoll } from '@/components/number-roll';
import { ScrollStory } from '@/components/scroll-story';
import { ABOUT_CONTENT, SERVICES } from '../data/siteData';

interface HomePageProps {
  onOpenBooking: (treatment?: string) => void;
}

const EASE_FLUID = [0.16, 1, 0.3, 1] as const;

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

      {/* 3. Real @hairline/scroll-story Treatment Showcase */}
      <section className="bg-[var(--color-cream-soft)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl leading-tight text-[var(--color-ink)] md:text-5xl">
              Aesthetic Care, Designed Around You
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Scroll through our seven specialized disciplines — or click any step to inspect how
              we tailor each protocol.
            </p>
          </div>

          <ScrollStory
            steps={SERVICES.map((service) => ({
              title: service.title,
              body: <p>{service.summary}</p>,
              visual: (
                <div className="w-full max-w-[340px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] sm:max-w-[420px] lg:max-w-[520px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="text-sm font-medium text-[var(--color-espresso)]">
                      {service.title}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                      {service.details}
                    </p>
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      {/* 4. Dark Glass Atelier Philosophy Over Full-Bleed Clinic Reception */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 md:py-28">
        <img
          src="/images/clinic-interior.jpeg"
          alt="Seira Wellness clinic reception"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <div className="max-w-3xl rounded-3xl border border-white/15 bg-[var(--color-ink)]/75 p-8 text-[var(--color-cream)] shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:p-12">
            <h2 className="text-3xl leading-tight text-[var(--color-cream)] md:text-5xl">
              {ABOUT_CONTENT.headline}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-cream)]/80">
              {ABOUT_CONTENT.intro}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
              <div>
                <UserCheck className="h-5 w-5 text-[var(--color-gold-light)]" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg text-[var(--color-cream)]">Patient-Centred</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-cream)]/70">
                  Listening carefully before recommending any procedure.
                </p>
              </div>
              <div>
                <Sparkles className="h-5 w-5 text-[var(--color-gold-light)]" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg text-[var(--color-cream)]">Natural Results</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-cream)]/70">
                  Balanced outcomes that enhance your natural features.
                </p>
              </div>
              <div>
                <ShieldCheck className="h-5 w-5 text-[var(--color-gold-light)]" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg text-[var(--color-cream)]">Ethical Practice</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-cream)]/70">
                  Modern clinical technology with transparent guidance.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-6 py-3 text-sm font-medium text-[var(--color-espresso)] transition-colors hover:bg-[var(--color-gold-light)]"
              >
                Our Story &amp; Values
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
