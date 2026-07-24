'use client';
import { useState, useEffect } from 'react';

function ImageUploadField({ label, contentKey, value, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        onUpdate(contentKey, result.url);
      } else {
        alert(result.error || "Erreur d'upload");
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onUpdate(contentKey, '');
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="image-upload-area" style={{ position: 'relative' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          disabled={uploading}
        />
        {uploading ? (
          <div className="spinner"></div>
        ) : (
          <div>
            <p>Glissez-déposez ou cliquez pour sélectionner une image</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Format recommandé: JPG/PNG</span>
          </div>
        )}
      </div>

      {value && (
        <div className="image-upload-preview">
          <img src={value} alt="Prévisualisation" />
          <button
            type="button"
            className="image-upload-remove"
            onClick={handleRemove}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminContent() {
  const [content, setContent] = useState({
    hero_image_1: '',
    hero_badge_1: '',
    hero_title_1: '',
    hero_link_1: '',
    hero_image_2: '',
    hero_badge_2: '',
    hero_title_2: '',
    hero_link_2: '',
    hero_image_3: '',
    hero_badge_3: '',
    hero_title_3: '',
    hero_link_3: '',
    about_title: '',
    about_text: '',
    about_founder: '',
    about_founder_title: '',
    about_founder_bio: '',
    about_founder_image: '',
    about_image: '',
    services_title: '',
    services_subtitle: '',
    projects_title: '',
    projects_subtitle: '',
    formations_title: '',
    formations_subtitle: '',
    events_title: '',
    events_subtitle: '',
    logo_white: '',
    logo_dark: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setContent((prev) => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleImageUpdate = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
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
        <h2>Éditer le contenu et les images du site</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {status === 'success' && (
          <div className="form-success mb-3">Toutes les modifications ont été enregistrées et publiées.</div>
        )}
        {status === 'error' && (
          <div className="login-error mb-3">Une erreur est survenue lors de l&apos;enregistrement.</div>
        )}

        {/* LOGOS */}
        <div className="admin-form-card">
          <h3>🖼️ Logos du site</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Ces logos apparaissent dans l&apos;en-tête et le pied de page de toutes les pages du site.
          </p>

          <div className="admin-form-row">
            <ImageUploadField
              label="Logo blanc (pour header / fond sombre)"
              contentKey="logo_white"
              value={content.logo_white}
              onUpdate={handleImageUpdate}
            />
            <ImageUploadField
              label="Logo sombre (pour la page de connexion admin)"
              contentKey="logo_dark"
              value={content.logo_dark}
              onUpdate={handleImageUpdate}
            />
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="admin-form-card">
          <h3>🎬 Carrousel de l&apos;en-tête (3 Slides Hero)</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Configurez les 3 images de fond défilantes et leurs légendes textuelles associées pour la page d&apos;accueil.
          </p>
          
          {/* SLIDE 1 */}
          <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--cyan-dark)', marginBottom: '1rem' }}>Slide #1 (Principal)</h4>
            <ImageUploadField
              label="Image de fond #1"
              contentKey="hero_image_1"
              value={content.hero_image_1}
              onUpdate={handleImageUpdate}
            />
            <div className="admin-form-row">
              <div className="form-group">
                <label htmlFor="hero_badge_1">Badge / Tag (ex: Ferroviaire)</label>
                <input
                  type="text"
                  id="hero_badge_1"
                  name="hero_badge_1"
                  className="form-input"
                  value={content.hero_badge_1}
                  onChange={handleChange}
                  placeholder="Ex: Ferroviaire"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero_link_1">Lien de redirection (slug ou URL externe)</label>
                <input
                  type="text"
                  id="hero_link_1"
                  name="hero_link_1"
                  className="form-input"
                  value={content.hero_link_1}
                  onChange={handleChange}
                  placeholder="Ex: /services/conseil-ia-industrielle"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="hero_title_1">Titre du Slide #1</label>
              <input
                type="text"
                id="hero_title_1"
                name="hero_title_1"
                className="form-input"
                value={content.hero_title_1}
                onChange={handleChange}
                placeholder="Ex: Accélérer la décarbonation de l'industrie ferroviaire."
              />
            </div>
          </div>

          {/* SLIDE 2 */}
          <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--cyan-dark)', marginBottom: '1rem' }}>Slide #2</h4>
            <ImageUploadField
              label="Image de fond #2"
              contentKey="hero_image_2"
              value={content.hero_image_2}
              onUpdate={handleImageUpdate}
            />
            <div className="admin-form-row">
              <div className="form-group">
                <label htmlFor="hero_badge_2">Badge / Tag (ex: Automobile)</label>
                <input
                  type="text"
                  id="hero_badge_2"
                  name="hero_badge_2"
                  className="form-input"
                  value={content.hero_badge_2}
                  onChange={handleChange}
                  placeholder="Ex: Automobile"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero_link_2">Lien de redirection</label>
                <input
                  type="text"
                  id="hero_link_2"
                  name="hero_link_2"
                  className="form-input"
                  value={content.hero_link_2}
                  onChange={handleChange}
                  placeholder="Ex: /projets/jumeaux-numeriques"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="hero_title_2">Titre du Slide #2</label>
              <input
                type="text"
                id="hero_title_2"
                name="hero_title_2"
                className="form-input"
                value={content.hero_title_2}
                onChange={handleChange}
                placeholder="Ex: Optimiser la production grâce aux jumeaux numériques."
              />
            </div>
          </div>

          {/* SLIDE 3 */}
          <div>
            <h4 style={{ color: 'var(--cyan-dark)', marginBottom: '1rem' }}>Slide #3</h4>
            <ImageUploadField
              label="Image de fond #3"
              contentKey="hero_image_3"
              value={content.hero_image_3}
              onUpdate={handleImageUpdate}
            />
            <div className="admin-form-row">
              <div className="form-group">
                <label htmlFor="hero_badge_3">Badge / Tag (ex: Aéronautique)</label>
                <input
                  type="text"
                  id="hero_badge_3"
                  name="hero_badge_3"
                  className="form-input"
                  value={content.hero_badge_3}
                  onChange={handleChange}
                  placeholder="Ex: Aéronautique"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hero_link_3">Lien de redirection</label>
                <input
                  type="text"
                  id="hero_link_3"
                  name="hero_link_3"
                  className="form-input"
                  value={content.hero_link_3}
                  onChange={handleChange}
                  placeholder="Ex: /services/digitalisation-processus"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="hero_title_3">Titre du Slide #3</label>
              <input
                type="text"
                id="hero_title_3"
                name="hero_title_3"
                className="form-input"
                value={content.hero_title_3}
                onChange={handleChange}
                placeholder="Ex: Prédire les défaillances des systèmes mécaniques complexes."
              />
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="admin-form-card">
          <h3>👤 Section &quot;Qui sommes-nous&quot;</h3>

          <div className="admin-form-row">
            <ImageUploadField
              label="Photo principale de la section About"
              contentKey="about_image"
              value={content.about_image}
              onUpdate={handleImageUpdate}
            />
            <ImageUploadField
              label="Photo portrait du fondateur (mini-avatar)"
              contentKey="about_founder_image"
              value={content.about_founder_image}
              onUpdate={handleImageUpdate}
            />
          </div>

          <div className="form-group">
            <label htmlFor="about_title">Titre de la section</label>
            <input
              type="text"
              id="about_title"
              name="about_title"
              className="form-input"
              value={content.about_title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="about_text">Texte de présentation générale</label>
            <textarea
              id="about_text"
              name="about_text"
              className="form-textarea"
              value={content.about_text}
              onChange={handleChange}
              required
              style={{ minHeight: '180px' }}
            />
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="about_founder">Nom du fondateur</label>
              <input
                type="text"
                id="about_founder"
                name="about_founder"
                className="form-input"
                value={content.about_founder}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="about_founder_title">Titre du fondateur</label>
              <input
                type="text"
                id="about_founder_title"
                name="about_founder_title"
                className="form-input"
                value={content.about_founder_title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="about_founder_bio">Courte biographie du fondateur</label>
            <textarea
              id="about_founder_bio"
              name="about_founder_bio"
              className="form-textarea"
              value={content.about_founder_bio}
              onChange={handleChange}
              required
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>

        {/* SECTION TITLES */}
        <div className="admin-form-card">
          <h3>📝 Titres des sections du site</h3>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="services_title">Titre section Services</label>
              <input
                type="text"
                id="services_title"
                name="services_title"
                className="form-input"
                value={content.services_title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="services_subtitle">Sous-titre section Services</label>
              <input
                type="text"
                id="services_subtitle"
                name="services_subtitle"
                className="form-input"
                value={content.services_subtitle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="projects_title">Titre section Projets</label>
              <input
                type="text"
                id="projects_title"
                name="projects_title"
                className="form-input"
                value={content.projects_title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="projects_subtitle">Sous-titre section Projets</label>
              <input
                type="text"
                id="projects_subtitle"
                name="projects_subtitle"
                className="form-input"
                value={content.projects_subtitle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="formations_title">Titre section Formations</label>
              <input
                type="text"
                id="formations_title"
                name="formations_title"
                className="form-input"
                value={content.formations_title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="formations_subtitle">Sous-titre section Formations</label>
              <input
                type="text"
                id="formations_subtitle"
                name="formations_subtitle"
                className="form-input"
                value={content.formations_subtitle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="events_title">Titre section Événements</label>
              <input
                type="text"
                id="events_title"
                name="events_title"
                className="form-input"
                value={content.events_title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="events_subtitle">Sous-titre section Événements</label>
              <input
                type="text"
                id="events_subtitle"
                name="events_subtitle"
                className="form-input"
                value={content.events_subtitle}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer et publier'}
          </button>
        </div>
      </form>
    </>
  );
}
