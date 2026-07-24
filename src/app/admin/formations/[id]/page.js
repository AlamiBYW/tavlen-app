'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function FormationForm() {
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
    program: '',
    duration: '',
    format: '',
    target_audience: '',
    price: '',
    status: 'draft',
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/formations/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => {
          setFormData(data);
          setFetching(false);
        })
        .catch(() => {
          router.push('/admin/formations');
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

    const url = isNew ? '/api/formations' : `/api/formations/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/formations');
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
        <Link href="/admin/formations" className="back-link">
          ← Retour aux formations
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{isNew ? 'Créer une nouvelle formation' : `Modifier : ${formData.title}`}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <h3>Informations Générales</h3>
          
          <div className="form-group">
            <label htmlFor="title">Titre de la formation</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Introduction au Machine Learning pour l'Industrie"
            />
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="slug">Slug (optionnel)</label>
              <input
                type="text"
                id="slug"
                name="slug"
                className="form-input"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Ex: introduction-machine-learning-industrie"
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
              <label htmlFor="format">Format (Présentiel, En ligne, Hybride)</label>
              <input
                type="text"
                id="format"
                name="format"
                className="form-input"
                value={formData.format}
                onChange={handleChange}
                placeholder="Ex: Présentiel ou en ligne"
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Durée</label>
              <input
                type="text"
                id="duration"
                name="duration"
                className="form-input"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Ex: 3 jours (21 heures)"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="price">Prix / Tarif indicatif</label>
              <input
                type="text"
                id="price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 3 500 MAD / participant"
              />
            </div>
            <div className="form-group">
              <label htmlFor="target_audience">Public cible</label>
              <input
                type="text"
                id="target_audience"
                name="target_audience"
                className="form-input"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="Ex: Ingénieurs, techniciens, responsables production"
              />
            </div>
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
              style={{ maxWidth: '200px' }}
            />
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
              placeholder="Courte phrase résumant la formation..."
              style={{ minHeight: '60px' }}
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Contenu de la formation</h3>

          <div className="form-group">
            <label htmlFor="full_desc">Description complète</label>
            <textarea
              id="full_desc"
              name="full_desc"
              className="form-textarea"
              value={formData.full_desc}
              onChange={handleChange}
              placeholder="Présentez en détail les enjeux, objectifs de la formation..."
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="program">Programme détaillé par jour</label>
            <textarea
              id="program"
              name="program"
              className="form-textarea"
              value={formData.program}
              onChange={handleChange}
              placeholder="Jour 1 : Introduction..., Jour 2 : Approfondissement..."
              style={{ minHeight: '150px' }}
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Médias</h3>

          <div className="form-group">
            <label>Image de présentation</label>
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
            onClick={() => router.push('/admin/formations')}
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
