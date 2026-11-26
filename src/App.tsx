import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppointmentModal } from './components/AppointmentModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { BlogsPage } from './pages/BlogsPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState('');

  const handleOpenBooking = (treatment = '') => {
    setSelectedTreatment(treatment);
    setBookingOpen(true);
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Navbar onOpenBooking={handleOpenBooking} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage onOpenBooking={handleOpenBooking} />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage onOpenBooking={handleOpenBooking} />} />
          </Routes>
        </main>
        <Footer />
        <AppointmentModal
          isOpen={bookingOpen}
          initialTreatment={selectedTreatment}
          onClose={() => setBookingOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
