'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const res = await fetch('/api/services?all=true');
      const data = await res.json();
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (service) => {
    const newStatus = service.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setServices(
          services.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }}></div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Gérer les Services</h2>
        <Link href="/admin/services/new" className="btn btn-primary btn-sm">
          ➕ Ajouter un service
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Visuel</th>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Tarif indicatif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucun service trouvé. Cliquez sur &quot;Ajouter un service&quot; pour commencer.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td style={{ width: '80px' }}>
                    <img
                      src={s.cover_image || '/images/demo/hero-bg.jpg'}
                      alt={s.title}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  </td>
                  <td>
                    <strong>{s.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>/{s.slug}</div>
                  </td>
                  <td>{s.category || '—'}</td>
                  <td>{s.pricing || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(s)}
                      className={`status-badge ${s.status === 'published' ? 'status-published' : 'status-draft'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Cliquez pour changer le statut"
                    >
                      <span className="status-dot"></span>
                      {s.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/services/${s.id}`} className="table-action-btn table-action-edit">
                        Éditer
                      </Link>
                      <button onClick={() => handleDelete(s.id)} className="table-action-btn table-action-delete">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
