'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/logos/logo-blanc.png');
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        if (data.logo_white) setLogoSrc(data.logo_white);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/projets', label: 'Projets' },
    { href: '/services', label: 'Services' },
    { href: '/formations', label: 'Formations' },
    { href: '/evenements', label: 'Événements' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`header ${scrolled || !isHome ? 'header-solid' : 'header-transparent'}`}>
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <img src={logoSrc} alt="TAVLEN Solutions" />
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-cta">
          <Link href="/contact" className="btn btn-primary btn-sm">
            Nous Contacter
          </Link>
        </div>

        <button
          className={`mobile-menu-btn ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
