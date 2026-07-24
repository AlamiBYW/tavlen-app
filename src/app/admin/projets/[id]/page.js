'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProjectForm() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const id = params.id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_desc: '',
    full_desc: '',
    cover_image: '',
    gallery: '[]',
    sector: '',
    client: '',
    date: '',
    methodology: '',
    results: '',
    testimonial: '',
    status: 'draft',
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/projets/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => {
          setFormData(data);
          setFetching(false);
        })
        .catch(() => {
          router.push('/admin/projets');
        });
    }
  }, [id, isNew, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, cover_image: result.url }));
      } else {
        alert(result.error || "Erreur d'upload");
      }
    } catch (err) {
      alert("Une erreur s'est produite lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isNew ? '/api/projets' : `/api/projets/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/projets');
      } else {
        const error = await res.json();
        alert(error.error || "Une erreur s'est produite");
      }
    } catch (err) {
      alert("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner" style={{ marginTop: '5rem' }}></div>;

  return (
    <>
      <div className="mb-2">
        <Link href="/admin/projets" className="back-link">
          ← Retour aux projets
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{isNew ? 'Créer un nouveau projet' : `Modifier : ${formData.title}`}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <h3>Informations Générales</h3>
          
          <div className="form-group">
            <label htmlFor="title">Titre du projet</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Optimisation IA des lignes de production"
            />
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="slug">Lien d&apos;URL personnalisée (Slug - optionnel)</label>
              <input
                type="text"
                id="slug"
                name="slug"
                className="form-input"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Ex: optimisation-ia-production"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Statut de publication</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="sector">Secteur d&apos;activité</label>
              <input
                type="text"
                id="sector"
                name="sector"
                className="form-input"
                value={formData.sector}
                onChange={handleChange}
                placeholder="Ex: Automobile, Aéronautique, Énergie"
              />
            </div>
            <div className="form-group">
              <label htmlFor="client">Client</label>
              <input
                type="text"
                id="client"
                name="client"
                className="form-input"
                value={formData.client}
                onChange={handleChange}
                placeholder="Ex: Confidentiel, Renault, OCP"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="date">Date / Année</label>
              <input
                type="text"
                id="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                placeholder="Ex: 2024"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sort_order">Ordre d&apos;affichage (Plus bas = en premier)</label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                className="form-input"
                value={formData.sort_order}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="short_desc">Description courte (pour les cartes de listes - 2 lignes max)</label>
            <textarea
              id="short_desc"
              name="short_desc"
              className="form-textarea"
              value={formData.short_desc}
              onChange={handleChange}
              required
              placeholder="Courte phrase résumant l'impact du projet..."
              style={{ minHeight: '60px' }}
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Contenu de la page de détail</h3>

          <div className="form-group">
            <label htmlFor="full_desc">Description complète et détaillée</label>
            <textarea
              id="full_desc"
              name="full_desc"
              className="form-textarea"
              value={formData.full_desc}
              onChange={handleChange}
              placeholder="Détaillez le contexte du projet, les défis rencontrés..."
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="methodology">Méthodologie d&apos;intégration</label>
            <textarea
              id="methodology"
              name="methodology"
              className="form-textarea"
              value={formData.methodology}
              onChange={handleChange}
              placeholder="Étapes suivies, technologies utilisées..."
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="results">Résultats et Livrables</label>
            <textarea
              id="results"
              name="results"
              className="form-textarea"
              value={formData.results}
              onChange={handleChange}
              placeholder="Chiffres clés, gains de productivité, livrables..."
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="testimonial">Témoignage client (optionnel)</label>
            <textarea
              id="testimonial"
              name="testimonial"
              className="form-textarea"
              value={formData.testimonial}
              onChange={handleChange}
              placeholder="Citation ou feedback de votre client..."
              style={{ minHeight: '80px' }}
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Médias</h3>

          <div className="form-group">
            <label>Image de couverture principale</label>
            <div className="image-upload-area" style={{ position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                disabled={uploading}
              />
              {uploading ? (
                <div className="spinner"></div>
              ) : (
                <div>
                  <p>Glissez-déposez ou cliquez pour sélectionner une image de couverture</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Format recommandé: JPG/PNG, 1200x800px</span>
                </div>
              )}
            </div>

            {formData.cover_image && (
              <div className="image-upload-preview">
                <img src={formData.cover_image} alt="Prévisualisation" />
                <button
                  type="button"
                  className="image-upload-remove"
                  onClick={() => setFormData((prev) => ({ ...prev, cover_image: '' }))}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/admin/projets')}
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder et publier'}
          </button>
        </div>
      </form>
    </>
  );
}
