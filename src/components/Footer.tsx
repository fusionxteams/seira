import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../data/siteData';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-espresso)] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img
              src="/images/seira-gold-logo.png"
              alt="Seira Wellness Clinic"
              className="h-11 w-auto object-contain"
            />
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-cream)]/80">
              {CLINIC_INFO.tagline}. Personalized, ethical, and patient-focused aesthetic care
              designed to enhance your natural beauty and confidence.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-base text-[var(--color-gold-light)]">Explore</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link to="/" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-base text-[var(--color-gold-light)]">Treatments</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.id}`}
                    className="text-[var(--color-cream)]/85 transition-colors hover:text-[var(--color-gold-light)]"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-base text-[var(--color-gold-light)]">Clinic</h3>
            <ul className="mt-4 flex flex-col gap-4 text-sm text-[var(--color-cream)]/85">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} aria-hidden="true" />
                <a href="tel:+918452070757" className="transition-colors hover:text-[var(--color-gold-light)]">
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} aria-hidden="true" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="break-all transition-colors hover:text-[var(--color-gold-light)]">
                  {CLINIC_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} aria-hidden="true" />
                <span>{CLINIC_INFO.hours}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-light)]" strokeWidth={1.5} aria-hidden="true" />
                <span>{CLINIC_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-cream)]/15 pt-8 text-xs text-[var(--color-cream)]/65">
          {CLINIC_INFO.copyright}
        </div>
      </div>
    </footer>
  );
}
