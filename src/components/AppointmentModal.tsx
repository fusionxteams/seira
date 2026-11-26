import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Booking } from '@/components/booking';
import { CLINIC_INFO, SERVICES } from '../data/siteData';

interface AppointmentModalProps {
  isOpen: boolean;
  initialTreatment?: string;
  onClose: () => void;
}

const CLINIC_SLOT_HOURS = [
  { hour: 10, minute: 0 },
  { hour: 11, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 13, minute: 0 },
  { hour: 14, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 16, minute: 0 },
  { hour: 17, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 21, minute: 0 },
];

export function AppointmentModal({
  isOpen,
  initialTreatment = '',
  onClose,
}: AppointmentModalProps) {
  const [treatment, setTreatment] = useState(initialTreatment || SERVICES[0].title);

  useEffect(() => {
    if (initialTreatment) setTreatment(initialTreatment);
  }, [initialTreatment]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeService = SERVICES.find((s) => s.title === treatment) ?? SERVICES[0];

  const getSlots = useCallback(async ({ from, to }: { from: Date; to: Date }) => {
    const slots: Date[] = [];
    const now = Date.now();
    const cursor = new Date(from);
    cursor.setUTCHours(0, 0, 0, 0);

    while (cursor.getTime() < to.getTime()) {
      const dow = cursor.getUTCDay();
      if (dow !== 0) {
        for (const { hour, minute } of CLINIC_SLOT_HOURS) {
          const slot = new Date(cursor);
          slot.setHours(hour, minute, 0, 0);
          if (slot.getTime() > now && slot.getTime() >= from.getTime() && slot.getTime() < to.getTime()) {
            slots.push(slot);
          }
        }
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return slots;
  }, []);

  const onBook = useCallback(async () => {
    return { id: `SW-${Math.floor(1000 + Math.random() * 9000)}` };
  }, []);

  const onCancel = useCallback(async () => true, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Seira Wellness Consultation Scheduler"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-[var(--color-cream-soft)] p-3 shadow-[0_24px_64px_rgba(24,21,18,0.2)] md:p-4"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-20 cursor-pointer rounded-full border border-[var(--color-border)] bg-white p-1.5 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-cream)]"
              aria-label="Close scheduler"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              {/* Left Service Sidebar */}
              <aside
                aria-label="Modal treatment focus"
                className="w-full shrink-0 rounded-[22px] border border-[var(--color-border)] bg-white p-3 md:w-[230px]"
              >
                <div className="mb-2 border-b border-[var(--color-border)] px-2 pb-2 text-xs font-medium text-[var(--color-gold)]">
                  Select Service ({SERVICES.length})
                </div>
                <div className="flex flex-col gap-1">
                  {SERVICES.map((s) => {
                    const active = treatment === s.title;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTreatment(s.title)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          active
                            ? 'bg-[#181512] text-[#FBF7EE]'
                            : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-cream-soft)] hover:text-[var(--color-ink)]'
                        }`}
                      >
                        <span className={active ? 'text-[#D9A432]' : 'text-[var(--color-gold)]'}>
                          {s.number}
                        </span>
                        <span className="truncate">{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Right Booking Workspace */}
              <div className="min-w-0 flex-1">
                <Booking
                  host={{
                    name: 'Seira Wellness Desk',
                    role: 'Villivakkam Clinic · Chennai',
                    src: '/images/seira-gold-logo.png',
                  }}
                  title={activeService.title}
                  description={activeService.summary}
                  duration={45}
                  location={CLINIC_INFO.address}
                  weekStartsOn={1}
                  getSlots={getSlots}
                  onBook={onBook}
                  onCancel={onCancel}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
