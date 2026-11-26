import { useEffect, useRef, useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import { ImageViewer } from '@/components/image-viewer';
import { LiquidTabs } from '@/components/liquid-tabs';
import { GALLERY_ITEMS, type GalleryItem } from '../data/siteData';

const CARD_W = 400;
const GAP = 24;
const STEP = CARD_W + GAP;

interface KineticFocusRibbonProps {
  items: GalleryItem[];
  direction: 1 | -1;
  speed?: number;
  label: string;
}

function KineticFocusRibbon({
  items,
  direction,
  speed = 0.55,
  label,
}: KineticFocusRibbonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ active: boolean; startX: number; startOffset: number; moved: boolean }>({
    active: false,
    startX: 0,
    startOffset: 0,
    moved: false,
  });

  const totalWidth = Math.max(1, items.length * STEP);
  const copies = Math.max(4, Math.ceil(2600 / totalWidth) + 2);
  const repeated = Array.from({ length: copies }, () => items).flat();

  const applyTransform = (rawOffset: number) => {
    const wrapped = ((rawOffset % totalWidth) + totalWidth) % totalWidth;
    offsetRef.current = wrapped;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-wrapped - totalWidth}px, 0, 0)`;
    }
  };

  useEffect(() => {
    offsetRef.current = 0;
    applyTransform(0);
    let raf = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, Math.max(0, now - lastTime));
      lastTime = now;
      if (!pausedRef.current && !dragRef.current.active) {
        applyTransform(offsetRef.current - direction * speed * (dt / 16.667));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, direction, speed]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startOffset: offsetRef.current,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    applyTransform(dragRef.current.startOffset - dx);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 0) {
      applyTransform(offsetRef.current + delta * 0.7);
    }
  };

  return (
    <div
      aria-label={label}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      className="relative cursor-grab select-none overflow-hidden py-4 active:cursor-grabbing touch-pan-y"
    >
      <div
        ref={trackRef}
        className="group/ribbon flex w-max items-center will-change-transform"
        style={{ gap: `${GAP}px` }}
      >
        {repeated.map((item, idx) => (
          <figure
            key={`${item.id}-${idx}`}
            style={{ width: `${CARD_W}px` }}
            onClickCapture={(e) => {
              if (dragRef.current.moved) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
            className="group relative shrink-0"
          >
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-cream-soft)]">
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="aspect-[16/10] w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div
                data-white-veil="true"
                className="pointer-events-none absolute inset-0 bg-white/75 opacity-0 transition-opacity duration-300 group-hover/ribbon:opacity-100 group-hover:!opacity-0"
              />
              <span className="pointer-events-none absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[var(--color-ink)] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-sm font-medium text-[var(--color-ink)]">{item.title}</h2>
                  <span className="text-[11px] font-medium text-[var(--color-gold)]">
                    {item.category}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-muted)]">
                  {item.caption}
                </p>
              </div>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function GalleryPage() {
  const [filter, setFilter] = useState<'All' | 'Clinic Space' | 'Treatments'>('All');

  const items =
    filter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="bg-[var(--color-bg)]">
      {/* 1. Editorial Header + @hairline/liquid-tabs */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-cream-soft)] py-14 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-end md:px-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              Interactive Lookbook
            </span>
            <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]">
              The Seira Lookbook
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Hover to pause, drag or scroll left and right, or click any image to zoom.
            </p>
          </div>

          <LiquidTabs
            label="Gallery filter"
            tabs={[
              { value: 'All', label: 'All' },
              { value: 'Clinic Space', label: 'Clinic Space' },
              { value: 'Treatments', label: 'Treatments' },
            ]}
            value={filter}
            onValueChange={(val) => setFilter(val as 'All' | 'Clinic Space' | 'Treatments')}
          />
        </div>
      </section>

      {/* 2. Dual Interactive Focus-Frame Ribbons wrapped in @hairline/image-viewer */}
      <section className="py-12 md:py-16">
        <ImageViewer key={filter}>
          <div className="flex flex-col gap-8">
            <KineticFocusRibbon
              items={rowA.length ? rowA : items}
              direction={-1}
              speed={0.55}
              label="Clinic & treatment gallery row 1"
            />
            <KineticFocusRibbon
              items={rowB.length ? rowB : items}
              direction={1}
              speed={0.5}
              label="Clinic & treatment gallery row 2"
            />
          </div>
        </ImageViewer>
      </section>
    </div>
  );
}
