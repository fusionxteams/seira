import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckCircle2, Clock, Download, MapPin, Sparkles, X } from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../data/siteData';

interface BookingSchedulerProps {
  initialTreatment?: string;
  onClose?: () => void;
}

const WEEK_DAYS = [
  { key: 'Mon', label: 'Mon', sub: '10AM–8PM' },
  { key: 'Tue', label: 'Tue', sub: '10AM–8PM' },
  { key: 'Wed', label: 'Wed', sub: '10AM–8PM' },
  { key: 'Thu', label: 'Thu', sub: '10AM–8PM' },
  { key: 'Fri', label: 'Fri', sub: '10AM–8PM' },
  { key: 'Sat', label: 'Sat', sub: '10AM–8PM' },
] as const;

const SLOTS = ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:00 PM', '06:30 PM'] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function BookingScheduler({ initialTreatment = '', onClose }: BookingSchedulerProps) {
  const [treatment, setTreatment] = useState(initialTreatment || SERVICES[0].title);
  const [selectedDay, setSelectedDay] = useState<string>('Wed');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false);

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  const downloadIcs = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Seira Wellness//Consultation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Seira Wellness — ${treatment}`,
      `DESCRIPTION:Consultation for ${treatment} (${selectedDay} at ${selectedSlot}). Phone: ${CLINIC_INFO.phone}`,
      `LOCATION:${CLINIC_INFO.address}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seira-wellness-consultation.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/50 bg-white/85 shadow-[0_24px_64px_rgba(24,21,18,0.1)] backdrop-blur-2xl">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Obsidian Host & Treatment Selector */}
        <div className="bg-[var(--color-ink)] p-6 text-white md:col-span-5 md:p-8">
          <img
            src="/images/seira-gold-logo.png"
            alt="Seira Wellness Clinic"
            className="h-9 w-auto object-contain"
          />

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-[var(--color-gold-light)]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              Private Assessment
            </span>
            <h3 className="mt-3 text-2xl text-white">Select Treatment Focus</h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const active = treatment === s.title;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setTreatment(s.title);
                    setBooked(false);
                  }}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[var(--color-gold)] text-white'
                      : 'border border-white/20 text-white/80 hover:border-[var(--color-gold-light)]'
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-2.5 border-t border-white/15 pt-6 text-xs text-white/75">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--color-gold-light)]" strokeWidth={1.5} />
              <span>{CLINIC_INFO.hours}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} />
              <span>{CLINIC_INFO.address}</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Week-View Slot Picker & Ticket Flip */}
        <div className="p-6 md:col-span-7 md:p-8">
          <AnimatePresence mode="wait">
            {booked && selectedSlot ? (
              <motion.div
                key="ticket"
                initial={{ opacity: 0, rotateX: -10, scale: 0.96 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-3xl border border-[var(--color-gold)]/40 bg-[var(--color-cream-soft)] p-6 md:p-8"
              >
                <div className="flex items-center justify-between border-b border-dashed border-[var(--color-gold)]/40 pb-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-7 w-7 text-[var(--color-gold)]" strokeWidth={1.5} />
                    <div>
                      <div className="text-xs font-medium text-[var(--color-gold)]">
                        BOOKING REQUESTED
                      </div>
                      <h3 className="text-xl text-[var(--color-ink)]">{treatment}</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-medium text-white">
                    {selectedDay} · {selectedSlot}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-[var(--color-ink-muted)]">Guest</div>
                    <div className="mt-0.5 font-medium text-[var(--color-ink)]">{name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--color-ink-muted)]">Phone</div>
                    <div className="mt-0.5 font-medium text-[var(--color-ink)]">{phone}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--color-gold)]/40 pt-5">
                  <button
                    type="button"
                    onClick={downloadIcs}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-gold)] px-4 py-2 text-xs font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Add to Calendar (.ics)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBooked(false);
                      setSelectedSlot(null);
                      onClose?.();
                    }}
                    className="cursor-pointer rounded-full bg-[var(--color-ink)] px-5 py-2 text-xs font-medium text-white hover:bg-[var(--color-gold)]"
                  >
                    {onClose ? 'Done' : 'Book Another Slot'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="scheduler" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl text-[var(--color-ink)]">Pick a Day &amp; Open Slot</h3>
                    <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                      Tap any available time to reserve your {treatment} consultation.
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-[var(--color-gold)]" strokeWidth={1.5} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {WEEK_DAYS.map((d) => {
                    const active = selectedDay === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setSelectedDay(d.key)}
                        className={`cursor-pointer rounded-2xl border p-2.5 text-center transition-colors ${
                          active
                            ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-white'
                            : 'border-[var(--color-border)] bg-[var(--color-cream-soft)] text-[var(--color-ink)] hover:border-[var(--color-gold)]'
                        }`}
                      >
                        <div className="text-sm font-medium">{d.label}</div>
                        <div className={`mt-0.5 text-[10px] ${active ? 'text-white/85' : 'text-[var(--color-ink-muted)]'}`}>
                          {d.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {SLOTS.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <motion.button
                        key={slot}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedSlot(active ? null : slot)}
                        className={`cursor-pointer rounded-xl border py-3 text-xs font-medium transition-colors ${
                          active
                            ? 'border-[var(--color-gold)] bg-[var(--color-cream)] text-[var(--color-gold)]'
                            : 'border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-gold)]'
                        }`}
                      >
                        {slot}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedSlot && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      onSubmit={handleConfirm}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-3 rounded-2xl border border-[var(--color-gold)]/35 bg-[var(--color-cream-soft)] p-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[var(--color-gold)]">
                            {treatment} · {selectedDay} at {selectedSlot}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedSlot(null)}
                            className="cursor-pointer text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                            aria-label="Clear selected slot"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                          />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                          />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full cursor-pointer rounded-full bg-[var(--color-gold)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-espresso)]"
                        >
                          Reserve {selectedDay} · {selectedSlot}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
