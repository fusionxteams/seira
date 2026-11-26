import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, BookOpen, Check, Clock, X } from 'lucide-react';
import { LiquidTabs } from '@/components/liquid-tabs';
import { BLOG_ARTICLES, type BlogArticle } from '../data/siteData';

const CATEGORIES = ['All', 'Skin & Anti-Aging', 'Hair & Scalp Care', 'Laser & Aesthetics'] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function BlogsPage() {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(BLOG_ARTICLES[0]?.id ?? null);
  const [drawerArticle, setDrawerArticle] = useState<BlogArticle | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  const visibleArticles =
    category === 'All'
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((article) => article.category === category);

  useEffect(() => {
    if (!drawerArticle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerArticle(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerArticle]);

  return (
    <div className="bg-[var(--color-bg)]">
      {/* 1. Minimalist Editorial Masthead + @hairline/liquid-tabs */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-cream-soft)] py-14 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-end lg:px-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)]">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
              Clinical Journal
            </span>
            <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]">
              The Seira Aesthetic Journal
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Evidence-informed guides on skin health, hair restoration, laser precision, and
              balanced aesthetic care.
            </p>
          </div>

          <LiquidTabs
            label="Journal category filter"
            tabs={CATEGORIES.map((item) => ({ value: item, label: item }))}
            value={category}
            onValueChange={(val) => {
              const next = val as CategoryFilter;
              setCategory(next);
              const first =
                next === 'All'
                  ? BLOG_ARTICLES[0]
                  : BLOG_ARTICLES.find((article) => article.category === next);
              setHoveredId(first?.id ?? null);
            }}
          />
        </div>
      </section>

      {/* 2. 2026 Kinetic Full-Width Editorial Rows + Floating Cover Reveal */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <div className="group/journal divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {visibleArticles.map((article, index) => {
            const isHovered = hoveredId === article.id;
            const num = String(index + 1).padStart(2, '0');

            return (
              <div
                key={article.id}
                onMouseEnter={() => setHoveredId(article.id)}
                onClick={() => {
                  setReadProgress(0);
                  setDrawerArticle(article);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setReadProgress(0);
                    setDrawerArticle(article);
                  }
                }}
                className="group relative flex cursor-pointer flex-col gap-6 py-8 transition-opacity duration-300 group-hover/journal:opacity-30 hover:!opacity-100 md:flex-row md:items-center md:justify-between md:py-11"
              >
                {/* Mobile cover image */}
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] md:hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>

                {/* Left: Number + Meta + Kinetic Headline */}
                <div className="flex flex-1 items-start gap-5 md:gap-8">
                  <span className="mt-2 text-xs font-medium tabular-nums text-[var(--color-gold)]">
                    {num}
                  </span>

                  <div className="max-w-2xl transition-transform duration-300 md:group-hover:translate-x-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-ink-muted)]">
                      <span className="font-medium text-[var(--color-gold)]">
                        {article.category}
                      </span>
                      <span>·</span>
                      <span>{article.date}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="mt-2.5 text-[clamp(1.65rem,2.9vw,2.65rem)] leading-[1.14] tracking-[-0.015em] text-[var(--color-ink)]">
                      {article.title}
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Right: Inline Floating Editorial Cover Reveal (Desktop) + Action Pill */}
                <div className="flex items-center justify-between gap-6 md:justify-end">
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, x: 16 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.94, x: 16 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream-soft)] shadow-[0_20px_50px_rgba(24,21,18,0.12)] lg:block"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-36 w-60 object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink)] transition-all duration-300 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Distraction-Free Editorial Reader Drawer */}
      <AnimatePresence>
        {drawerArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerArticle(null)}
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-drawer-title"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => {
                const el = e.currentTarget;
                const max = el.scrollHeight - el.clientHeight;
                setReadProgress(
                  max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100
                );
              }}
              className="relative h-full w-full max-w-xl overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-bg)]"
            >
              <div className="sticky top-0 z-10 h-1 w-full bg-[var(--color-cream)]">
                <div
                  className="h-full bg-[var(--color-gold)] transition-[width] duration-150"
                  style={{ width: `${readProgress}%` }}
                />
              </div>

              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-medium text-[var(--color-gold)]">
                    {drawerArticle.category} · {drawerArticle.readTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerArticle(null)}
                    className="cursor-pointer rounded-full border border-[var(--color-border)] p-2 text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                    aria-label="Close article"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <h2
                  id="article-drawer-title"
                  className="mt-5 text-3xl leading-snug text-[var(--color-ink)]"
                >
                  {drawerArticle.title}
                </h2>
                <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                  Published {drawerArticle.date}
                </p>

                <img
                  src={drawerArticle.image}
                  alt={drawerArticle.title}
                  className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
                />

                <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream-soft)] p-5">
                  <p className="text-xs font-medium text-[var(--color-gold)]">Key Takeaways</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {drawerArticle.takeaways.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-[var(--color-ink)]"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]"
                          strokeWidth={1.75}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {drawerArticle.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
