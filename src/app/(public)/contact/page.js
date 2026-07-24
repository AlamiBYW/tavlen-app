'use client';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/contact-info')
      .then((res) => res.json())
      .then((data) => setContactInfo(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', text: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.error || "Une erreur s'est produite lors de l'envoi." });
      }
    } catch (err) {
      setStatus({ type: 'error', text: "Impossible de contacter le serveur. Veuillez réessayer plus tard." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="list-page-header">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Une question ? Un projet ? Nous sommes à votre écoute pour vous accompagner.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2 className="mb-3">Nos Coordonnées</h2>
              <p className="mb-4">
                N&apos;hésitez pas à nous contacter directement par téléphone, e-mail ou via nos réseaux sociaux.
                Nous nous ferons un plaisir de répondre à vos demandes de conseils, de services ou de formations.
              </p>

              {contactInfo.address && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">📍</div>
                  <div>
                    <h4>Adresse</h4>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
              )}

              {contactInfo.phone && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">📞</div>
                  <div>
                    <h4>Téléphone</h4>
                    <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                  </div>
                </div>
              )}

              {contactInfo.whatsapp && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">💬</div>
                  <div>
                    <h4>WhatsApp (Direct)</h4>
                    <p>
                      <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                        Discuter sur WhatsApp
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {contactInfo.email && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">✉️</div>
                  <div>
                    <h4>Email</h4>
                    <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                  </div>
                </div>
              )}

              <div className="contact-socials">
                {contactInfo.linkedin && (
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social-link" aria-label="LinkedIn">
                    in
                  </a>
                )}
              </div>
            </div>

            <div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Envoyez-nous un message</h3>
                
                {status.text && (
                  <div className={status.type === 'success' ? 'form-success mb-3' : 'login-error mb-3'}>
                    {status.text}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Adresse e-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nom@entreprise.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Ex: Demande de devis conseil, Inscription formation"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Dites-nous en plus sur vos besoins..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
