import { useCallback, useState } from 'react';
import { ArrowUpRight, CalendarCheck, Check, Clock, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { Booking } from '@/components/booking';
import { CLINIC_INFO, SERVICES } from '../data/siteData';

const DISCIPLINES = SERVICES.map((s) => ({
  number: s.number,
  value: s.title,
  label: s.title,
  summary: s.summary,
}));

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

export function ContactPage() {
  const [selectedTreatment, setSelectedTreatment] = useState<string>(DISCIPLINES[0].value);
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  const activeDiscipline =
    DISCIPLINES.find((d) => d.value === selectedTreatment) ?? DISCIPLINES[0];

  const handleCopy = (field: 'phone' | 'email', value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const getSlots = useCallback(async ({ from, to }: { from: Date; to: Date }) => {
    const slots: Date[] = [];
    const now = new Date();
    const cursor = new Date(from);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= to) {
      if (cursor.getDay() !== 0) {
        for (const { hour, minute } of CLINIC_SLOT_HOURS) {
          const slot = new Date(cursor);
          slot.setHours(hour, minute, 0, 0);
          if (slot > now) {
            slots.push(slot);
          }
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return slots;
  }, []);

  const onBook = useCallback(async () => {
    return {
      id: `SW-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }, []);

  const onCancel = useCallback(async () => {
    return true;
  }, []);

  return (
    <div className="bg-[var(--color-bg)]">
      {/* 1. Warm Ivory Editorial Masthead */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-cream-soft)] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)]">
            <CalendarCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
            Private Assessment
          </span>
          <h1 className="mt-2 max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]">
            Reserve Your Consultation
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
            Select a service from the sidebar, pick an open slot on our clinic calendar, and
            confirm your consultation immediately.
          </p>
        </div>
      </section>

      {/* 2. Left Service Sidebar + @hairline/booking Concierge Workspace */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Service Sidebar */}
          <aside
            aria-label="Consultation focus"
            className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-cream-soft)] p-4 lg:col-span-4"
          >
            <div className="mb-3 flex items-center justify-between border-b border-[var(--color-border)] px-2 pb-3">
              <span className="text-xs font-medium text-[var(--color-gold)]">
                Treatment Focus
              </span>
              <span className="text-xs text-[var(--color-ink-muted)]">
                {DISCIPLINES.length} Services
              </span>
            </div>

            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Select treatment focus"
              className="flex flex-col gap-1.5"
            >
              {DISCIPLINES.map((d) => {
                const active = selectedTreatment === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedTreatment(d.value)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors ${
                      active
                        ? 'bg-[#181512] text-[#FBF7EE]'
                        : 'text-[var(--color-ink)] hover:bg-white'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`text-xs font-medium tabular-nums ${
                          active ? 'text-[#D9A432]' : 'text-[var(--color-gold)]'
                        }`}
                      >
                        {d.number}
                      </span>
                      <span className="truncate text-sm font-medium">{d.label}</span>
                    </span>
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition-opacity ${
                        active ? 'text-[#D9A432] opacity-100' : 'opacity-30'
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Booking Workspace */}
          <div className="lg:col-span-8">
            <Booking
              host={{
                name: 'Seira Wellness Desk',
                role: 'Villivakkam Clinic · Chennai',
                src: '/images/seira-gold-logo.png',
              }}
              title={activeDiscipline.value}
              description={activeDiscipline.summary}
              duration={45}
              location={CLINIC_INFO.address}
              weekStartsOn={1}
              getSlots={getSlots}
              onBook={onBook}
              onCancel={onCancel}
            />
          </div>
        </div>
      </section>

      {/* 3. Architectural Clinic Coordinates Strip */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-cream-soft)] py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[var(--color-border)] px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-12">
          <div className="flex flex-col justify-between py-6 md:py-0 md:pr-8">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-gold)]">
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              <span>Direct Phone</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <a
                href="tel:+918452070757"
                className="text-xl font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-gold)]"
              >
                {CLINIC_INFO.phone}
              </a>
              <button
                type="button"
                onClick={() => handleCopy('phone', CLINIC_INFO.phone)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              >
                {copiedField === 'phone' ? (
                  <Check className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedField === 'phone' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between py-6 md:px-8 md:py-0">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-gold)]">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <span>Clinic Email</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <a
                href={`mailto:${CLINIC_INFO.email}`}
                className="truncate text-lg font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-gold)]"
              >
                {CLINIC_INFO.email}
              </a>
              <button
                type="button"
                onClick={() => handleCopy('email', CLINIC_INFO.email)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              >
                {copiedField === 'email' ? (
                  <Check className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedField === 'email' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between py-6 md:py-0 md:pl-8">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-[var(--color-gold)]">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                Villivakkam, Chennai
              </span>
              <span className="inline-flex items-center gap-1 text-[var(--color-ink-muted)]">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                10AM – 8PM
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {CLINIC_INFO.address}
            </p>
            <a
              href="https://maps.google.com/?q=A1+97,+4th+St,+Sidco+Nagar,+Villivakkam,+Chennai,+Tamil+Nadu+600049"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-gold)] hover:underline"
            >
              Open in Google Maps
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
