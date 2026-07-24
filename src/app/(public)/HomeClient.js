'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollAnimation from '@/components/ScrollAnimation';
import StatsCounter from '@/components/StatsCounter';
import ContentCard from '@/components/ContentCard';

export default function HomeClient({ content, stats, projects, services, formations, events }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: content.hero_image_1 || '/images/demo/hero_bg_1.png',
      badge: content.hero_badge_1 || 'Ferroviaire',
      title: content.hero_title_1 || "Accélérer la décarbonation de l'industrie ferroviaire.",
      link: content.hero_link_1 || '/services/conseil-ia-industrielle',
    },
    {
      image: content.hero_image_2 || '/images/demo/hero_bg_2.png',
      badge: content.hero_badge_2 || 'Automobile',
      title: content.hero_title_2 || "Optimiser la production grâce aux jumeaux numériques.",
      link: content.hero_link_2 || '/projets/jumeaux-numeriques',
    },
    {
      image: content.hero_image_3 || '/images/demo/hero_bg_3.png',
      badge: content.hero_badge_3 || 'Aéronautique',
      title: content.hero_title_3 || "Prédire les défaillances des systèmes mécaniques complexes.",
      link: content.hero_link_3 || '/services/digitalisation-processus',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-slides">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="hero-slide-bg">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="hero-slide-overlay" />
              <div className="hero-container">
                <div className="hero-content-left">
                  <span className="hero-badge-box">{slide.badge}</span>
                  <h1 className="hero-title-giant">{slide.title}</h1>
                  <Link href={slide.link} className="hero-link-arrow">
                    En savoir plus
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="hero-controls">
          <div className="hero-controls-index">
            <span>0{currentSlide + 1}</span> / 0{slides.length}
          </div>
          <button className="hero-nav-arrow" onClick={handlePrev} aria-label="Slide précédent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button className="hero-nav-arrow" onClick={handleNext} aria-label="Slide suivant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator-slide">
          <span></span>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <ScrollAnimation animation="animate-slide-left">
              <div className="about-image">
                <img src={content.about_image || '/images/demo/founder.jpg'} alt={content.about_founder || 'Aymane El Alami'} />
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="animate-slide-right">
              <div className="about-text">
                <h2>{content.about_title || 'Qui sommes-nous'}</h2>
                <p className="about-text-p">{content.about_text || ''}</p>
                <div className="founder-info">
                  <img src={content.about_founder_image || '/images/demo/founder.jpg'} alt={content.about_founder || ''} className="founder-info-avatar" />
                  <div>
                    <h4>{content.about_founder || 'Aymane El Alami'}</h4>
                    <p>{content.about_founder_title || 'Fondateur & Consultant IA'}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      {stats.length > 0 && <StatsCounter stats={stats} />}

      {/* SERVICES SECTION */}
      {services.length > 0 && (
        <section className="section section-gray" id="services">
          <div className="container">
            <ScrollAnimation>
              <div className="section-header">
                <h2>{content.services_title || 'Nos Services'}</h2>
                <p>{content.services_subtitle || ''}</p>
              </div>
            </ScrollAnimation>
            <div className="card-grid">
              {services.map((service, i) => (
                <ScrollAnimation key={service.id} delay={i * 100}>
                  <ContentCard item={service} basePath="/services" badge={service.category} />
                </ScrollAnimation>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/services" className="btn btn-dark">
                Voir tous nos services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projects.length > 0 && (
        <section className="section" id="projects">
          <div className="container">
            <ScrollAnimation>
              <div className="section-header">
                <h2>{content.projects_title || 'Nos Projets'}</h2>
                <p>{content.projects_subtitle || ''}</p>
              </div>
            </ScrollAnimation>
            <div className="card-grid">
              {projects.map((project, i) => (
                <ScrollAnimation key={project.id} delay={i * 100}>
                  <ContentCard item={project} basePath="/projets" badge={project.sector} />
                </ScrollAnimation>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/projets" className="btn btn-dark">
                Voir tous nos projets
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FORMATIONS SECTION */}
      {formations.length > 0 && (
        <section className="section section-dark" id="formations">
          <div className="container">
            <ScrollAnimation>
              <div className="section-header">
                <h2>{content.formations_title || 'Nos Formations'}</h2>
                <p>{content.formations_subtitle || ''}</p>
              </div>
            </ScrollAnimation>
            <div className="card-grid card-grid-2">
              {formations.map((formation, i) => (
                <ScrollAnimation key={formation.id} delay={i * 100}>
                  <ContentCard item={formation} basePath="/formations" badge={formation.format} />
                </ScrollAnimation>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/formations" className="btn btn-outline">
                Voir toutes les formations
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* EVENTS SECTION */}
      {events.length > 0 && (
        <section className="section section-gray" id="events">
          <div className="container">
            <ScrollAnimation>
              <div className="section-header">
                <h2>{content.events_title || 'Événements & Workshops'}</h2>
                <p>{content.events_subtitle || ''}</p>
              </div>
            </ScrollAnimation>
            <div className="card-grid card-grid-2">
              {events.map((event, i) => (
                <ScrollAnimation key={event.id} delay={i * 100}>
                  <ContentCard item={event} basePath="/evenements" badge={event.location} />
                </ScrollAnimation>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/evenements" className="btn btn-dark">
                Voir tous les événements
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <ScrollAnimation>
            <h2 style={{ color: 'var(--white)', marginBottom: '1rem' }}>
              Prêt à transformer votre industrie avec l&apos;IA ?
            </h2>
            <p style={{ color: 'var(--gray-300)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Contactez-nous pour discuter de vos besoins et découvrir comment TAVLEN Solutions peut accélérer votre transformation digitale.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Demander un devis gratuit
            </Link>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
