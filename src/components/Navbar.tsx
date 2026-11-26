import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Calendar, Menu, X } from 'lucide-react';
import { CLINIC_INFO } from '../data/siteData';

interface NavbarProps {
  onOpenBooking: (treatment?: string) => void;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
];

const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;

/**
 * 21st.dev Floating Glassmorphic Navbar with Morphing Pill Indicator (id: 45733)
 * Adapted to Seira Wellness router & palette.
 */
export function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion() ?? false;
  const layoutId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active =
    NAV_LINKS.find((item) =>
      item.to === '/' ? pathname === '/' : pathname.startsWith(item.to),
    )?.to ?? '/';
  const highlighted = hovered ?? active;

  return (
    <header className="pointer-events-none sticky top-3 z-50 flex justify-center px-3 sm:top-4">
      <motion.div
        initial={reduceMotion ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
        className="pointer-events-auto relative w-full max-w-6xl"
      >
        <div
          className={`flex h-16 items-center justify-between gap-4 rounded-full border border-[var(--color-gold-light)]/35 bg-white/85 px-4 backdrop-blur-xl transition-shadow duration-300 md:px-6 ${
            scrolled
              ? 'shadow-[0_12px_40px_rgba(24,21,18,0.12)]'
              : 'shadow-[0_8px_28px_rgba(24,21,18,0.06)]'
          }`}
        >
          <Link
            to="/"
            className="flex shrink-0 items-center pl-2 transition-opacity duration-200 hover:opacity-80"
            aria-label={CLINIC_INFO.name}
          >
            <img
              src="/images/seira-gold-logo.png"
              alt="Seira Wellness Clinic"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((item) => {
              const isActive = item.to === active;
              const isHighlighted = item.to === highlighted;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(item.to)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(item.to)}
                  onBlur={() => setHovered(null)}
                  className={`relative isolate flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    isHighlighted
                      ? 'text-[var(--color-cream)]'
                      : 'text-[var(--color-ink)] hover:text-[var(--color-espresso)]'
                  }`}
                >
                  {isHighlighted && (
                    <motion.span
                      layoutId={layoutId}
                      aria-hidden="true"
                      transition={reduceMotion ? { duration: 0 } : SPRING}
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--color-espresso)]"
                    />
                  )}
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="ml-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-gold-light)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center md:flex">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenBooking()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)] transition-colors duration-200 hover:bg-[var(--color-espresso)]"
            >
              <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden lg:inline">Book Appointment</span>
              <span className="lg:hidden">Book</span>
            </motion.button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-[var(--color-ink)] md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 rounded-3xl border border-[var(--color-gold-light)]/40 bg-[var(--color-cream-soft)]/95 p-6 shadow-[0_16px_40px_rgba(34,34,34,0.12)] backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-full px-4 py-2.5 text-base font-medium transition-colors ${
                      item.to === active
                        ? 'bg-[var(--color-espresso)] text-[var(--color-cream)]'
                        : 'text-[var(--color-ink)] hover:bg-[var(--color-cream)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenBooking();
                  }}
                  className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-cream)]"
                >
                  <Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Book An Appointment
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
