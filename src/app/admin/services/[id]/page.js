'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ServiceForm() {
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
    category: '',
    target_client: '',
    steps: '',
    pricing: '',
    status: 'draft',
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/services/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then((data) => {
          setFormData(data);
          setFetching(false);
        })
        .catch(() => {
          router.push('/admin/services');
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

    const url = isNew ? '/api/services' : `/api/services/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/services');
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
        <Link href="/admin/services" className="back-link">
          ← Retour aux services
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{isNew ? 'Créer un nouveau service' : `Modifier : ${formData.title}`}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <h3>Informations Générales</h3>
          
          <div className="form-group">
            <label htmlFor="title">Titre du service</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Conseil en IA Industrielle"
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
                placeholder="Ex: conseil-ia-industrielle"
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
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: AI x Industrie, Transformation Digitale"
              />
            </div>
            <div className="form-group">
              <label htmlFor="target_client">Public cible / Type de client</label>
              <input
                type="text"
                id="target_client"
                name="target_client"
                className="form-input"
                value={formData.target_client}
                onChange={handleChange}
                placeholder="Ex: PME et ETI industrielles"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="form-group">
              <label htmlFor="pricing">Tarif indicatif</label>
              <input
                type="text"
                id="pricing"
                name="pricing"
                className="form-input"
                value={formData.pricing}
                onChange={handleChange}
                placeholder="Ex: À partir de 5 000 MAD / Sur devis"
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
              placeholder="Courte phrase résumant l'offre de service..."
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
              placeholder="Présentez en détail les enjeux de cette offre, les bénéfices pour le client..."
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="steps">Déroulé & Étapes de la mission</label>
            <textarea
              id="steps"
              name="steps"
              className="form-textarea"
              value={formData.steps}
              onChange={handleChange}
              placeholder="1. Audit initial, 2. Définition des besoins..."
              style={{ minHeight: '120px' }}
            />
          </div>
        </div>

        <div className="admin-form-card">
          <h3>Médias</h3>

          <div className="form-group">
            <label>Image principale du service</label>
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
            onClick={() => router.push('/admin/services')}
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
