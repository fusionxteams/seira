import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../data/siteData';

interface BookingConciergeProps {
  initialTreatment?: string;
  compact?: boolean;
  onComplete?: () => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '03:00 PM',
  '05:00 PM',
  '06:30 PM',
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function BookingConcierge({
  initialTreatment = '',
  compact = false,
  onComplete,
}: BookingConciergeProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [treatment, setTreatment] = useState(initialTreatment || SERVICES[0].title);
  const [day, setDay] = useState<string>('Mon');
  const [timeSlot, setTimeSlot] = useState<string>('11:30 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedService = SERVICES.find((s) => s.title === treatment) ?? SERVICES[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="py-6 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-cream)] text-[var(--color-gold)]">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-2xl text-[var(--color-ink)] md:text-3xl">
          Consultation Reserved
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Thank you, {name || 'Guest'}. Our care coordinator will confirm your visit shortly.
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-gold-light)]/40 bg-[var(--color-cream-soft)] p-5 text-left text-sm">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <span className="text-[var(--color-ink-muted)]">Treatment</span>
            <span className="font-medium text-[var(--color-espresso)]">{treatment}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] py-3">
            <span className="text-[var(--color-ink-muted)]">Preferred Slot</span>
            <span className="font-medium text-[var(--color-ink)]">
              {day} · {timeSlot}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[var(--color-ink-muted)]">Contact</span>
            <span className="font-medium text-[var(--color-ink)]">{phone}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            onComplete?.();
          }}
          className="mt-6 cursor-pointer rounded-full bg-[var(--color-espresso)] px-7 py-3 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-gold)]"
        >
          {onComplete ? 'Done' : 'Book Another Slot'}
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((n) => {
            const active = step === n;
            const done = step > n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (n < step) setStep(n);
                }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[var(--color-espresso)] text-[var(--color-cream)]'
                    : done
                      ? 'cursor-pointer bg-[var(--color-cream)] text-[var(--color-gold)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-ink-muted)]'
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2} /> : <span>0{n}</span>}
                <span className="hidden sm:inline">
                  {n === 1 ? 'Treatment' : n === 2 ? 'Schedule' : 'Details'}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-xs text-[var(--color-ink-muted)]">{CLINIC_INFO.hours}</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-6"
          >
            <h3 className="text-xl text-[var(--color-ink)]">Select Your Treatment Focus</h3>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Choose the discipline you would like to discuss during your consultation.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const selected = treatment === s.title;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTreatment(s.title)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-[var(--color-espresso)] bg-[var(--color-espresso)] text-[var(--color-cream)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>

            {!compact && (
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[var(--color-gold-light)]/35 bg-[var(--color-cream-soft)] p-4">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="h-16 w-20 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)]">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span>{selectedService.title}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                    {selectedService.summary}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-espresso)]"
              >
                Choose Day &amp; Time
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-6"
          >
            <h3 className="text-xl text-[var(--color-ink)]">Preferred Day &amp; Time</h3>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Open Monday to Saturday, 10:00 AM to 8:00 PM.
            </p>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)]">
                <Calendar className="h-3.5 w-3.5 text-[var(--color-gold)]" strokeWidth={1.5} />
                <span>Preferred Day</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`cursor-pointer rounded-xl border py-2.5 text-xs font-medium transition-colors ${
                      day === d
                        ? 'border-[var(--color-espresso)] bg-[var(--color-espresso)] text-[var(--color-cream)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)]">
                <Clock className="h-3.5 w-3.5 text-[var(--color-gold)]" strokeWidth={1.5} />
                <span>Preferred Time Window</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`cursor-pointer rounded-xl border py-2.5 text-xs font-medium transition-colors ${
                      timeSlot === slot
                        ? 'border-[var(--color-gold)] bg-[var(--color-cream)] text-[var(--color-espresso)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] hover:border-[var(--color-gold)]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-espresso)]"
              >
                Your Details
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.form
            key="step-3"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between rounded-2xl bg-[var(--color-cream)]/70 px-4 py-3 text-xs">
              <span className="font-medium text-[var(--color-espresso)]">{treatment}</span>
              <span className="text-[var(--color-gold)]">
                {day} · {timeSlot}
              </span>
            </div>

            <div>
              <label htmlFor="concierge-name" className="block text-xs font-medium text-[var(--color-ink)]">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User
                  className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--color-ink-muted)]"
                  strokeWidth={1.5}
                />
                <input
                  id="concierge-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pr-4 pl-10 text-sm text-[var(--color-ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="concierge-phone" className="block text-xs font-medium text-[var(--color-ink)]">
                  Phone Number
                </label>
                <input
                  id="concierge-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                />
              </div>
              <div>
                <label htmlFor="concierge-email" className="block text-xs font-medium text-[var(--color-ink)]">
                  Email Address
                </label>
                <input
                  id="concierge-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="concierge-notes" className="block text-xs font-medium text-[var(--color-ink)]">
                Goals or Questions (Optional)
              </label>
              <textarea
                id="concierge-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any specific skin, hair, or aesthetic concerns..."
                className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back
              </button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer rounded-full bg-[var(--color-espresso)] px-7 py-3 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-gold)]"
              >
                Confirm Consultation
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
