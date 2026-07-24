'use client';
import { useState, useEffect } from 'react';

export default function AdminContactInfo() {
  const [info, setInfo] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    linkedin: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/contact-info')
      .then((res) => res.json())
      .then((data) => {
        setInfo((prev) => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');

    try {
      const res = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }}></div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Gérer les coordonnées & réseaux</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {status === 'success' && (
          <div className="form-success mb-3">Les coordonnées ont été enregistrées et mises à jour partout sur le site.</div>
        )}
        {status === 'error' && (
          <div className="login-error mb-3">Une erreur est survenue lors de l&apos;enregistrement.</div>
        )}

        <div className="admin-form-card">
          <h3>Coordonnées de contact</h3>
          
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail professionnelle</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={info.email}
              onChange={handleChange}
              required
              placeholder="contact@tavlensolutions.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-input"
              value={info.phone}
              onChange={handleChange}
              required
              placeholder="+212 6 00 00 00 00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">Numéro WhatsApp (Format international sans + ni espaces)</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              className="form-input"
              value={info.whatsapp}
              onChange={handleChange}
              required
              placeholder="212600000000"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
              Sert à générer le lien de chat direct.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse physique / Bureau</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              value={info.address}
              onChange={handleChange}
              required
              placeholder="Rabat, Maroc"
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Réseaux Sociaux</h3>

          <div className="form-group">
            <label htmlFor="linkedin">Lien profil LinkedIn (URL complète)</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              className="form-input"
              value={info.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les coordonnées'}
          </button>
        </div>
      </form>
    </>
  );
}
