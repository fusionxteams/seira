"use client";

/* ─────────────────────────────────────────────────────────
 * IMAGE VIEWER: open any image in place, look closer, go back
 *
 * Wrap the grid you already have: <ImageViewer>{grid}</ImageViewer>.
 * Click an image and the thumbnail itself grows into the full
 * view (its crop opening out to the whole picture); close and it
 * shrinks back into the hole it left, the hole of whichever image
 * you ended on. Every image in the wrapper is a slide.
 *
 * Wheel, pinch or double-tap to zoom at the point you aim at, drag
 * to pan with momentum, swipe or arrow keys for the next image,
 * swipe down or Escape to close. All movement runs on springs, so
 * a gesture can take over from any motion mid-flight.
 * ───────────────────────────────────────────────────────── */

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { createSpring, projectInertia, rubberBand, type Spring } from "./ui-interaction-motion";

export interface ImageViewerProps {
  /** Your own grid, list or single image. Every matching image inside becomes a slide. */
  children: React.ReactNode;
  /** Which images open, a CSS selector for <img> elements. Put data-full="…" on an image for a larger file to load in the viewer. */
  selector?: string;
  /** Called with the open slide's index, and null when the viewer closes. */
  onIndexChange?: (index: number | null) => void;
  /** Most it zooms, as a multiple of the fitted size. */
  maxZoom?: number;
  labels?: { close?: string; next?: string; previous?: string; zoomIn?: string; zoomOut?: string; viewer?: string };
  className?: string;
}

type Item = { el: HTMLImageElement; src: string; full: string; alt: string; w: number; h: number };
type Box = { x: number; y: number; w: number; h: number };

const GAP = 24;
const SNAP = { stiffness: 420, damping: 40 };
const OPEN = 360;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia(reducedQuery).matches;

/** The image's place on screen, contained in the viewport with room for the toolbar, the caption and the arrows. */
function fit(item: Item, vw: number, vh: number): Box {
  const side = vw < 640 ? 12 : 72;
  const top = 60;
  const bottom = 56;
  const bw = vw - side * 2;
  const bh = vh - top - bottom;
  const s = Math.min(bw / item.w, bh / item.h);
  const w = item.w * s;
  const h = item.h * s;
  return { x: side + (bw - w) / 2, y: top + (bh - h) / 2, w, h };
}

/** The transform and clip that make a fitted image look exactly like its thumbnail (cover-cropped, rounded). */
function thumbPose(thumb: HTMLElement, box: Box) {
  const r = thumb.getBoundingClientRect();
  const s = Math.max(r.width / box.w, r.height / box.h);
  const dx = r.left + r.width / 2 - (box.x + box.w / 2);
  const dy = r.top + r.height / 2 - (box.y + box.h / 2);
  const ix = Math.max(0, (box.w - r.width / s) / 2);
  const iy = Math.max(0, (box.h - r.height / s) / 2);
  // Thumbnails usually take their rounded corners from a wrapper that clips them.
  const own = parseFloat(getComputedStyle(thumb).borderTopLeftRadius) || 0;
  const parent = thumb.parentElement ? parseFloat(getComputedStyle(thumb.parentElement).borderTopLeftRadius) || 0 : 0;
  const radius = Math.max(own, parent) / s;
  const visible = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  return { transform: `translate(${dx}px, ${dy}px) scale(${s})`, clip: `inset(${iy}px ${ix}px round ${radius}px)`, visible };
}

export function ImageViewer({ children, selector = "img", onIndexChange, maxZoom = 4, labels, className = "" }: ImageViewerProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const [view, setView] = React.useState<{ items: Item[]; index: number; vw: number; vh: number } | null>(null);
  const [closing, setClosing] = React.useState(false);

  const dialog = React.useRef<HTMLDivElement>(null);
  const backdrop = React.useRef<HTMLDivElement>(null);
  const shade = React.useRef<HTMLDivElement>(null);
  const strip = React.useRef<HTMLDivElement>(null);
  const zoomText = React.useRef<HTMLSpanElement>(null);
  const plates = React.useRef(new Map<number, HTMLDivElement>());
  const springs = React.useRef<{ strip: Spring; zoom: Spring; x: Spring; y: Spring; drop: Spring } | null>(null);
  const live = React.useRef({ index: 0, vw: 0, vh: 0, items: [] as Item[], hidden: null as HTMLImageElement | null, opener: null as HTMLElement | null });

  const report = React.useRef(onIndexChange);
  React.useLayoutEffect(() => {
    report.current = onIndexChange;
  });

  // Images in the wrapper show they open, and can be reached by keyboard when nothing around them can.
  React.useEffect(() => {
    const box = root.current;
    if (!box) return;
    const mark = () =>
      box.querySelectorAll<HTMLImageElement>(selector).forEach((img) => {
        img.style.cursor = "zoom-in";
        if (!img.closest("a, button") && img.tabIndex < 0) {
          img.tabIndex = 0;
          img.setAttribute("role", "button");
        }
      });
    mark();
    const watch = new MutationObserver(mark);
    watch.observe(box, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [selector]);

  const open = (img: HTMLImageElement, opener: HTMLElement) => {
    const box = root.current;
    if (!box || view) return;
    const items = [...box.querySelectorAll<HTMLImageElement>(selector)].map((el) => {
      const src = el.currentSrc || el.src;
      return { el, src, full: el.dataset.full || src, alt: el.alt, w: el.naturalWidth || el.width || 1, h: el.naturalHeight || el.height || 1 };
    });
    const index = items.findIndex((i) => i.el === img);
    if (index < 0) return;
    live.current = { ...live.current, items, index, vw: window.innerWidth, vh: window.innerHeight, opener };
    setClosing(false);
    setView({ items, index, vw: window.innerWidth, vh: window.innerHeight });
    report.current?.(index);
  };

  const onClickCapture = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    let img = target.closest<HTMLImageElement>(selector);
    if (!img || !root.current?.contains(img)) {
      const inside = target.querySelectorAll<HTMLImageElement>(selector);
      img = inside.length === 1 ? inside[0] : null;
    }
    if (!img || !(img instanceof HTMLImageElement)) return;
    event.preventDefault();
    event.stopPropagation();
    // Focus returns to what opened it: the link or button around the image, else the image itself.
    open(img, (img.closest("a, button") as HTMLElement | null) ?? (img.tabIndex >= 0 ? img : ((img.closest("[tabindex]") as HTMLElement | null) ?? img)));
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if ((event.key === "Enter" || event.key === " ") && target instanceof HTMLImageElement && target.matches(selector)) {
      event.preventDefault();
      open(target, target);
    }
  };

  /** Writes every spring's value to the page: the strip, the current image's zoom and pan, the drag to close. */
  const paint = React.useCallback(() => {
    const sp = springs.current;
    const { index, vh } = live.current;
    if (!sp) return;
    if (strip.current) strip.current.style.transform = `translate3d(${sp.strip.get()}px, 0, 0)`;
    const drop = sp.drop.get();
    const lift = Math.min(1, Math.abs(drop) / (vh * 0.45));
    plates.current.forEach((plate, i) => {
      const inner = plate.firstElementChild as HTMLElement | null;
      if (!inner) return;
      inner.style.transform =
        i === index ? `translate3d(${sp.x.get()}px, ${sp.y.get() + drop}px, 0) scale(${sp.zoom.get() * (1 - lift * 0.18)})` : "";
    });
    if (shade.current) shade.current.style.opacity = String(1 - lift);
    if (zoomText.current) zoomText.current.textContent = `${Math.round(sp.zoom.get() * 100)}%`;
  }, []);

  const hideThumb = (el: HTMLImageElement | null) => {
    const l = live.current;
    if (l.hidden && l.hidden !== el) l.hidden.style.visibility = "";
    l.hidden = el;
    if (el) el.style.visibility = "hidden";
  };

  // Opening: springs at rest, the thumbnail's hole, and the flight out of it.
  React.useLayoutEffect(() => {
    if (!view) return;
    const l = live.current;
    springs.current ??= {
      strip: createSpring(0, SNAP, paint, 0.1),
      zoom: createSpring(1, SNAP, paint, 0.001),
      x: createSpring(0, SNAP, paint, 0.1),
      y: createSpring(0, SNAP, paint, 0.1),
      drop: createSpring(0, SNAP, paint, 0.1),
    };
    const sp = springs.current;
    sp.strip.jump(-l.index * (l.vw + GAP));
    sp.zoom.jump(1);
    sp.x.jump(0);
    sp.y.jump(0);
    sp.drop.jump(0);
    const item = l.items[l.index];
    const inner = plates.current.get(l.index)?.firstElementChild as HTMLElement | null;
    hideThumb(item.el);
    dialog.current?.focus({ preventScroll: true });
    if (reducedMotion() || !inner) {
      backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
      return;
    }
    const pose = thumbPose(item.el, fit(item, l.vw, l.vh));
    inner.animate([{ transform: pose.transform, clipPath: pose.clip }, { transform: "none", clipPath: "inset(0px round 0px)" }], { duration: OPEN, easing: EASE });
    backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: OPEN * 0.8, easing: "ease-out" });
    // Only the open itself depends on this; later index changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view !== null]);

  // A new slide: the strip glides to it, zoom resets, and the hole under it moves to that image's thumbnail.
  React.useEffect(() => {
    if (!view) return;
    const l = live.current;
    const sp = springs.current;
    if (!sp || l.index === view.index) return;
    l.index = view.index;
    sp.strip.set(-view.index * (view.vw + GAP));
    sp.zoom.jump(1);
    sp.x.jump(0);
    sp.y.jump(0);
    hideThumb(view.items[view.index].el);
    report.current?.(view.index);
  }, [view]);

  const go = React.useCallback((dir: 1 | -1) => {
    setView((v) => {
      if (!v) return v;
      const next = Math.max(0, Math.min(v.items.length - 1, v.index + dir));
      if (next === v.index) {
        springs.current?.strip.push(dir * -900);
        return v;
      }
      return { ...v, index: next };
    });
  }, []);

  const close = React.useCallback(() => {
    if (closing || !view) return;
    setClosing(true);
    const l = live.current;
    const sp = springs.current;
    const item = l.items[l.index];
    const inner = plates.current.get(l.index)?.firstElementChild as HTMLElement | null;
    const done = () => {
      hideThumb(null);
      sp?.zoom.jump(1);
      sp?.drop.jump(0);
      setView(null);
      setClosing(false);
      report.current?.(null);
      (l.opener?.isConnected ? l.opener : item.el)?.focus?.({ preventScroll: true });
    };
    if (reducedMotion() || !inner || !sp) {
      backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).finished.then(done);
      return;
    }
    const pose = thumbPose(item.el, fit(item, l.vw, l.vh));
    const from = inner.style.transform || "none";
    sp.zoom.stop();
    sp.x.stop();
    sp.y.stop();
    sp.drop.stop();
    const to = pose.visible ? { transform: pose.transform, clipPath: pose.clip } : { transform: "scale(0.92)", clipPath: "inset(0px round 0px)", opacity: 0 };
    inner.animate([{ transform: from, clipPath: "inset(0px round 0px)" }, to], { duration: OPEN, easing: EASE, fill: "forwards" }).finished.then(done);
    backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: OPEN * 0.8, easing: "ease-in", fill: "forwards" });
  }, [closing, view]);

  // Keep the layout right when the window changes size.
  React.useEffect(() => {
    if (!view) return;
    const resize = () => {
      live.current.vw = window.innerWidth;
      live.current.vh = window.innerHeight;
      springs.current?.strip.jump(-live.current.index * (window.innerWidth + GAP));
      setView((v) => (v ? { ...v, vw: window.innerWidth, vh: window.innerHeight } : v));
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [view]);

  /* ── zoom and pan ─────────────────────────────────────── */

  /** How far the image may be pushed at zoom z before its edge comes inside the screen. */
  const bounds = (z: number) => {
    const l = live.current;
    const box = fit(l.items[l.index], l.vw, l.vh);
    return { x: Math.max(0, (box.w * z - l.vw) / 2), y: Math.max(0, (box.h * z - l.vh) / 2), box };
  };
  /** Zoom to z keeping the screen point px, py where it is. */
  const zoomAt = (z: number, px: number, py: number, animate = true) => {
    const sp = springs.current;
    if (!sp) return;
    const z0 = sp.zoom.getTarget();
    const z1 = Math.max(1, Math.min(maxZoom, z));
    const { box } = bounds(z1);
    const cx = box.x + box.w / 2 + sp.x.getTarget();
    const cy = box.y + box.h / 2 + sp.y.getTarget();
    const b = bounds(z1);
    const nx = Math.max(-b.x, Math.min(b.x, sp.x.getTarget() + (px - cx) * (1 - z1 / z0)));
    const ny = Math.max(-b.y, Math.min(b.y, sp.y.getTarget() + (py - cy) * (1 - z1 / z0)));
    if (animate) {
      sp.zoom.set(z1);
      sp.x.set(nx);
      sp.y.set(ny);
    } else {
      sp.zoom.jump(z1);
      sp.x.jump(nx);
      sp.y.jump(ny);
    }
  };
  const zoomBy = (factor: number) => {
    const l = live.current;
    zoomAt((springs.current?.zoom.getTarget() ?? 1) * factor, l.vw / 2, l.vh / 2);
  };

  // Wheel zooms at the pointer; the page behind never scrolls.
  React.useEffect(() => {
    const el = dialog.current;
    if (!view || !el) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const z = springs.current?.zoom.getTarget() ?? 1;
      zoomAt(z * Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0022)), event.clientX, event.clientY);
    };
    const stop = (event: TouchEvent) => event.preventDefault();
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("touchmove", stop);
    };
    // zoomAt reads live refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view !== null]);

  /* ── pointers: pan, swipe, pinch, drag to close, double-tap ── */

  const gesture = React.useRef({
    points: new Map<number, { x: number; y: number }>(),
    mode: "" as "" | "pending" | "pan" | "swipe" | "drop" | "pinch",
    x0: 0,
    y0: 0,
    t0: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    dist: 0,
    midX: 0,
    midY: 0,
    strip: 0,
    samples: [] as { x: number; y: number; t: number }[],
    lastTap: 0,
  });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button") || closing) return;
    const g = gesture.current;
    const sp = springs.current;
    if (!sp) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    g.points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (g.points.size === 2) {
      const [a, b] = [...g.points.values()];
      g.mode = "pinch";
      g.dist = Math.hypot(a.x - b.x, a.y - b.y);
      g.zoom = sp.zoom.get();
      g.midX = (a.x + b.x) / 2;
      g.midY = (a.y + b.y) / 2;
      g.panX = sp.x.get();
      g.panY = sp.y.get();
      return;
    }
    g.mode = "pending";
    g.x0 = event.clientX;
    g.y0 = event.clientY;
    g.t0 = event.timeStamp;
    g.panX = sp.x.get();
    g.panY = sp.y.get();
    g.strip = sp.strip.get();
    g.samples = [{ x: event.clientX, y: event.clientY, t: event.timeStamp }];
    // Taking hold stops whatever was moving, right where it is.
    sp.x.jump(g.panX);
    sp.y.jump(g.panY);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const sp = springs.current;
    if (!sp || !g.points.has(event.pointerId)) return;
    g.points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const l = live.current;
    if (g.mode === "pinch" && g.points.size >= 2) {
      const [a, b] = [...g.points.values()];
      const z = Math.max(0.85, Math.min(maxZoom * 1.15, (g.zoom * Math.hypot(a.x - b.x, a.y - b.y)) / Math.max(1, g.dist)));
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const box = fit(l.items[l.index], l.vw, l.vh);
      const cx = box.x + box.w / 2 + g.panX;
      const cy = box.y + box.h / 2 + g.panY;
      sp.zoom.jump(z);
      sp.x.jump(g.panX + (g.midX - cx) * (1 - z / g.zoom) + (midX - g.midX));
      sp.y.jump(g.panY + (g.midY - cy) * (1 - z / g.zoom) + (midY - g.midY));
      return;
    }
    const dx = event.clientX - g.x0;
    const dy = event.clientY - g.y0;
    g.samples.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
    while (g.samples.length > 2 && event.timeStamp - g.samples[0].t > 100) g.samples.shift();
    if (g.mode === "pending") {
      if (Math.hypot(dx, dy) < 7) return;
      const zoomed = sp.zoom.get() > 1.01;
      g.mode = zoomed ? "pan" : Math.abs(dx) > Math.abs(dy) ? "swipe" : "drop";
      // Movement starts from here, so nothing jumps by the slop.
      g.x0 = event.clientX;
      g.y0 = event.clientY;
      return;
    }
    if (g.mode === "pan") {
      const b = bounds(sp.zoom.get());
      const over = (v: number, m: number, d: number) => (v > m ? m + rubberBand(v - m, d) : v < -m ? -m + rubberBand(v + m, d) : v);
      sp.x.jump(over(g.panX + dx, b.x, l.vw));
      sp.y.jump(over(g.panY + dy, b.y, l.vh));
    } else if (g.mode === "swipe") {
      const first = l.index === 0 && dx > 0;
      const last = l.index === l.items.length - 1 && dx < 0;
      sp.strip.jump(g.strip + (first || last ? rubberBand(dx, l.vw) : dx));
    } else if (g.mode === "drop") {
      sp.drop.jump(dy);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const sp = springs.current;
    if (!sp || !g.points.has(event.pointerId)) return;
    g.points.delete(event.pointerId);
    const l = live.current;
    if (g.mode === "pinch") {
      if (g.points.size) {
        // One finger stays down: carry on as a pan from here.
        const [p] = [...g.points.values()];
        g.mode = "pan";
        g.x0 = p.x;
        g.y0 = p.y;
        g.panX = sp.x.get();
        g.panY = sp.y.get();
        return;
      }
      g.mode = "";
      const z = Math.max(1, Math.min(maxZoom, sp.zoom.get()));
      const b = bounds(z);
      sp.zoom.set(z);
      sp.x.set(Math.max(-b.x, Math.min(b.x, sp.x.get())));
      sp.y.set(Math.max(-b.y, Math.min(b.y, sp.y.get())));
      return;
    }
    const first = g.samples[0];
    const end = g.samples[g.samples.length - 1];
    const span = Math.max(1, end.t - first.t);
    const vx = event.timeStamp - end.t > 100 ? 0 : (end.x - first.x) / span;
    const vy = event.timeStamp - end.t > 100 ? 0 : (end.y - first.y) / span;
    const mode = g.mode;
    g.mode = "";
    if (mode === "pending") {
      // A tap: twice on the image zooms there; once on the backdrop closes.
      const onImage = !!(event.target as HTMLElement).closest("[data-viewer-image]");
      if (onImage && event.timeStamp - g.lastTap < 300) {
        g.lastTap = 0;
        const z = sp.zoom.getTarget();
        zoomAt(z > 1.01 ? 1 : Math.min(maxZoom, 2.5), event.clientX, event.clientY);
      } else if (onImage) g.lastTap = event.timeStamp;
      else close();
      return;
    }
    if (mode === "pan") {
      const b = bounds(sp.zoom.get());
      sp.x.set(Math.max(-b.x, Math.min(b.x, projectInertia(sp.x.get(), vx, 0.25))));
      sp.y.set(Math.max(-b.y, Math.min(b.y, projectInertia(sp.y.get(), vy, 0.25))));
    } else if (mode === "swipe") {
      const moved = projectInertia(sp.strip.get() - g.strip, vx);
      const dir = moved < -l.vw * 0.25 ? 1 : moved > l.vw * 0.25 ? -1 : 0;
      const next = Math.max(0, Math.min(l.items.length - 1, l.index + dir));
      if (next !== l.index) setView((v) => (v ? { ...v, index: next } : v));
      else sp.strip.set(-l.index * (l.vw + GAP));
      sp.strip.push(vx * 1000 * 0.4);
    } else if (mode === "drop") {
      if (Math.abs(projectInertia(sp.drop.get(), vy)) > l.vh * 0.22) close();
      else sp.drop.set(0);
    }
  };

  const onDialogKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "+" || event.key === "=") zoomBy(1.5);
    else if (event.key === "-") zoomBy(1 / 1.5);
    else if (event.key === "0") zoomAt(1, live.current.vw / 2, live.current.vh / 2);
    else if (event.key === "Tab") {
      // Focus stays inside the viewer.
      const nodes = [...(dialog.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [])];
      if (!nodes.length) return;
      const at = nodes.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && at <= 0) {
        event.preventDefault();
        nodes[nodes.length - 1].focus();
      } else if (!event.shiftKey && at === nodes.length - 1) {
        event.preventDefault();
        nodes[0].focus();
      }
    }
  };

  const round = "grid size-10 cursor-pointer place-items-center rounded-full bg-background text-foreground ring-1 ring-border transition-[background-color,scale,opacity] duration-150 hover:bg-accent active:scale-95 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";
  const current = view?.items[view.index];

  return (
    <div ref={root} onClickCapture={onClickCapture} onKeyDown={onKeyDown} className={className}>
      {children}
      {view &&
        current &&
        createPortal(
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={labels?.viewer ?? "Image viewer"}
            tabIndex={-1}
            onKeyDown={onDialogKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="fixed inset-0 z-[2147482000] touch-none overflow-clip text-foreground outline-none select-none"
          >
            <div ref={backdrop} className="absolute inset-0">
              <div ref={shade} className="absolute inset-0 bg-background" />
            </div>
            <div ref={strip} className="absolute inset-0 will-change-transform">
              {view.items.map((item, i) => {
                if (Math.abs(i - view.index) > 1) return null;
                const box = fit(item, view.vw, view.vh);
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      if (el) plates.current.set(i, el);
                      else plates.current.delete(i);
                    }}
                    className="absolute"
                    style={{ left: i * (view.vw + GAP) + box.x, top: box.y, width: box.w, height: box.h }}
                    aria-hidden={i !== view.index}
                  >
                    <div data-viewer-image="" className="relative size-full will-change-transform" style={{ cursor: "zoom-in" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={i === view.index ? item.alt : ""} draggable={false} className="absolute inset-0 size-full" />
                      {item.full !== item.src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.full}
                          alt=""
                          draggable={false}
                          className="absolute inset-0 size-full opacity-0 transition-opacity duration-300"
                          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-x-0 top-0 flex h-[60px] items-center justify-between gap-3 px-3 sm:px-4">
              <span className="rounded-full bg-background px-2.5 py-1 text-[13px] font-medium tabular-nums text-muted-foreground ring-1 ring-border" aria-live="polite">
                {view.index + 1} / {view.items.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button type="button" className={round} aria-label={labels?.zoomOut ?? "Zoom out"} onClick={() => zoomBy(1 / 1.5)}>
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span ref={zoomText} aria-hidden="true" className="w-12 rounded-full bg-background py-1 text-center text-[12.5px] tabular-nums text-muted-foreground ring-1 ring-border">
                  100%
                </span>
                <button type="button" className={round} aria-label={labels?.zoomIn ?? "Zoom in"} onClick={() => zoomBy(1.5)}>
                  <Plus className="size-4" aria-hidden="true" />
                </button>
                <button type="button" className={`${round} ml-2`} aria-label={labels?.close ?? "Close"} onClick={close}>
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <button
              type="button"
              className={`${round} absolute top-1/2 left-4 -translate-y-1/2 max-sm:hidden`}
              aria-label={labels?.previous ?? "Previous image"}
              disabled={view.index === 0}
              onClick={() => go(-1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${round} absolute top-1/2 right-4 -translate-y-1/2 max-sm:hidden`}
              aria-label={labels?.next ?? "Next image"}
              disabled={view.index === view.items.length - 1}
              onClick={() => go(1)}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            {current.alt && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-14 items-center justify-center px-6">
                <p className="max-w-full truncate rounded-full bg-background px-3 py-1 text-center text-[13px] text-muted-foreground ring-1 ring-border">{current.alt}</p>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
