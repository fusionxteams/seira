import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { CardDeck } from '@/components/card-deck';
import { ImageViewer } from '@/components/image-viewer';
import { LiquidTabs } from '@/components/liquid-tabs';
import { NumberRoll } from '@/components/number-roll';
import { ABOUT_CONTENT, CLINIC_INFO, WHY_CHOOSE_ITEMS } from '../data/siteData';

const EASE = [0.16, 1, 0.3, 1] as const;

const FILMSTRIP_IMAGES = [
  { src: '/images/clinic-interior.jpeg', alt: 'Seira Wellness reception' },
  { src: '/images/hero-clinic.png', alt: 'Aesthetic consultation' },
  { src: '/images/about-care.jpg', alt: 'Clinical skin care' },
  { src: '/images/service-skin.webp', alt: 'Anti-aging care' },
  { src: '/images/service-antiaging.webp', alt: 'Hair & scalp care' },
];

const DECK_IMAGES = [
  '/images/hero-clinic.png',
  '/images/service-skin.webp',
  '/images/about-care.jpg',
  '/images/service-antiaging.webp',
  '/images/clinic-interior.jpeg',
  '/images/service-makeup.webp',
] as const;

export function AboutPage() {
  const [storyTab, setStoryTab] = useState<'story' | 'mission' | 'vision'>('story');
  const [activeStandardIdx, setActiveStandardIdx] = useState(0);
  const stripRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      const overflow = Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth);
      setMaxScroll(overflow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: stripRef,
    offset: ['start start', 'end end'],
  });
  const stripX = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  return (
    <div className="bg-[var(--color-bg)]">
      {/* 1. Sticky Scroll-Driven Horizontal Filmstrip Banner */}
      <section
        ref={stripRef}
        className="relative h-[200vh] bg-[var(--color-cream-soft)]"
      >
        <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col justify-center overflow-x-clip py-6">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-[clamp(2.25rem,5.2vw,4.75rem)] leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)]"
            >
              About Seira Wellness
            </motion.h1>
          </div>

          {/* Horizontal Filmstrip that stops flush with the right edge of the viewport */}
          <div ref={viewportRef} className="mt-8 overflow-x-clip">
            <ImageViewer>
              <motion.div
                ref={trackRef}
                style={{ x: stripX }}
                className="flex w-max gap-5 px-6 will-change-transform md:px-12"
              >
                {FILMSTRIP_IMAGES.map((img) => (
                  <div
                    key={img.src}
                    className="w-72 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white sm:w-80 md:w-[420px]"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="aspect-[16/10] w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </motion.div>
            </ImageViewer>
          </div>

          {/* Subtitle & Details Below */}
          <div className="mx-auto mt-8 w-full max-w-7xl px-6 md:px-12">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
              <h2 className="text-2xl text-[var(--color-ink)] md:col-span-7 md:text-3xl">
                {ABOUT_CONTENT.headline}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-5 md:justify-end">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-espresso)]"
                >
                  Explore Treatments
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--color-gold)]" strokeWidth={1.5} />
                  Villivakkam · {CLINIC_INFO.hours}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Visual-Paired Philosophy & Story (@hairline/liquid-tabs + Morphing Visual, zero black) */}
      <section className="border-y border-[var(--color-border)] bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-medium text-[var(--color-gold)]">
                Clinic Philosophy
              </span>
              <h2 className="mt-2 text-3xl text-[var(--color-ink)] md:text-4xl">
                Our Story, Mission &amp; Vision
              </h2>
            </div>

            <LiquidTabs
              label="Clinic philosophy"
              value={storyTab}
              onValueChange={(v) => setStoryTab(v as 'story' | 'mission' | 'vision')}
              tabs={[
                { value: 'story', label: 'Who We Are' },
                { value: 'mission', label: 'Our Mission' },
                { value: 'vision', label: 'Our Vision' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-cream-soft)] p-6 md:grid-cols-12 md:p-8">
            <div className="relative overflow-hidden rounded-2xl md:col-span-5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={storyTab}
                  src={
                    storyTab === 'story'
                      ? '/images/clinic-interior.jpeg'
                      : storyTab === 'mission'
                        ? '/images/about-care.jpg'
                        : '/images/hero-clinic.png'
                  }
                  alt={
                    storyTab === 'story'
                      ? 'Seira Wellness Clinic interior'
                      : storyTab === 'mission'
                        ? 'Personalized aesthetic care'
                        : 'Advanced aesthetic consultation'
                  }
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="aspect-[4/3] w-full object-cover"
                />
              </AnimatePresence>
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--color-gold)] backdrop-blur-md">
                {storyTab === 'story' ? '01 / 03' : storyTab === 'mission' ? '02 / 03' : '03 / 03'}
              </span>
            </div>

            <div className="md:col-span-7 md:pl-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={storyTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className="text-xs font-medium text-[var(--color-gold)]">
                    {storyTab === 'story'
                      ? '01 · Who We Are'
                      : storyTab === 'mission'
                        ? '02 · Purpose'
                        : '03 · Direction'}
                  </span>
                  <h3 className="mt-2 text-3xl text-[var(--color-ink)]">
                    {storyTab === 'story'
                      ? 'Personalized Care'
                      : storyTab === 'mission'
                        ? ABOUT_CONTENT.missionTitle
                        : ABOUT_CONTENT.visionTitle}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)] md:text-lg">
                    {storyTab === 'story'
                      ? ABOUT_CONTENT.intro
                      : storyTab === 'mission'
                        ? ABOUT_CONTENT.mission
                        : ABOUT_CONTENT.vision}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Seira Wellness — @hairline/card-deck on Mobile, Wide Editorial Showcase on Desktop */}
      <section className="bg-[var(--color-cream-soft)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Mobile: Interactive @hairline/card-deck */}
          <div className="md:hidden">
            <span className="text-xs font-medium text-[var(--color-gold)]">
              06 Clinical Standards
            </span>
            <h2 className="mt-2 text-3xl text-[var(--color-ink)]">
              {ABOUT_CONTENT.whyTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {ABOUT_CONTENT.whySubtitle}
            </p>
            <p className="mt-4 mb-6 text-xs text-[var(--color-gold)]">
              Drag, flick, or use the arrows to explore each standard.
            </p>

            <CardDeck
              label="Why choose Seira Wellness"
              height={420}
              items={WHY_CHOOSE_ITEMS.map((item, idx) => ({
                id: item.number,
                number: item.number,
                title: item.title,
                description: item.description,
                image: DECK_IMAGES[idx % DECK_IMAGES.length],
              }))}
              getLabel={(item) => `${item.number} ${item.title}`}
              renderCard={(item) => (
                <div className="flex h-full flex-col overflow-hidden bg-white">
                  <div className="h-48 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-2xl text-[var(--color-ink)]">{item.title}</h3>
                        <span className="font-[var(--font-display)] text-lg text-[var(--color-gold)]">
                          {item.number}
                        </span>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Desktop: Interactive 6-Blade Expanding Showcase (Fluid Awwwards-style horizontal blades) */}
          <div className="hidden md:block">
            <div className="flex flex-col justify-between gap-4 pb-10 lg:flex-row lg:items-end">
              <div>
                <span className="text-xs font-medium text-[var(--color-gold)]">
                  06 Clinical Standards
                </span>
                <h2 className="mt-2 text-4xl text-[var(--color-ink)]">
                  {ABOUT_CONTENT.whyTitle}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {ABOUT_CONTENT.whySubtitle}
              </p>
            </div>

            <div className="flex h-[460px] w-full gap-3">
              {WHY_CHOOSE_ITEMS.map((item, idx) => {
                const active = idx === activeStandardIdx;
                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => setActiveStandardIdx(idx)}
                    onMouseEnter={() => setActiveStandardIdx(idx)}
                    aria-expanded={active}
                    className={`group relative cursor-pointer overflow-hidden rounded-3xl border text-left transition-[flex-grow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active
                        ? 'flex-[4] border-[var(--color-gold)] bg-white shadow-[0_20px_60px_rgba(24,21,18,0.08)]'
                        : 'flex-[0.7] border-[var(--color-border)] bg-[var(--color-cream)]/60 hover:border-[var(--color-gold)]/50'
                    }`}
                  >
                    <img
                      src={DECK_IMAGES[idx % DECK_IMAGES.length]}
                      alt={item.title}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                        active ? 'opacity-100' : 'opacity-20 group-hover:opacity-35'
                      }`}
                    />

                    {/* Collapsed vertical strip label */}
                    {!active && (
                      <div className="relative z-10 flex h-full flex-col items-center justify-between py-6">
                        <span className="font-[var(--font-display)] text-lg text-[var(--color-gold)]">
                          {item.number}
                        </span>
                        <span
                          className="font-[var(--font-display)] text-sm whitespace-nowrap text-[var(--color-ink)]"
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          {item.title}
                        </span>
                      </div>
                    )}

                    {/* Expanded blade frosted-glass panel */}
                    {active && (
                      <div className="relative z-10 flex h-full flex-col justify-end p-6">
                        <div className="rounded-2xl border border-white/60 bg-white/88 p-6 backdrop-blur-xl">
                          <div className="flex items-baseline justify-between gap-4">
                            <h3 className="text-2xl text-[var(--color-ink)]">{item.title}</h3>
                            <span className="font-[var(--font-display)] text-xl text-[var(--color-gold)]">
                              {item.number} / 06
                            </span>
                          </div>
                          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Warm Ivory Track Record Strip (@hairline/number-roll, zero black) */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-cream)] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
          <div>
            <NumberRoll
              value={10}
              from={0}
              suffix="+"
              className="font-[var(--font-display)] text-3xl text-[var(--color-gold)] md:text-4xl"
            />
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Years of Experience</p>
          </div>
          <div className="border-l border-[var(--color-border)] pl-6">
            <NumberRoll
              value={5}
              from={0}
              suffix="K+"
              className="font-[var(--font-display)] text-3xl text-[var(--color-gold)] md:text-4xl"
            />
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Patients Treated</p>
          </div>
          <div className="md:border-l md:border-[var(--color-border)] md:pl-6">
            <NumberRoll
              value={15}
              from={0}
              suffix="+"
              className="font-[var(--font-display)] text-3xl text-[var(--color-gold)] md:text-4xl"
            />
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Advanced Treatments</p>
          </div>
          <div className="border-l border-[var(--color-border)] pl-6">
            <NumberRoll
              value={96}
              from={0}
              suffix="%"
              className="font-[var(--font-display)] text-3xl text-[var(--color-gold)] md:text-4xl"
            />
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">Patient Satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
}
