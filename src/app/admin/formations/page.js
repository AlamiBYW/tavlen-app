'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminFormations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFormations = async () => {
    try {
      const res = await fetch('/api/formations?all=true');
      const data = await res.json();
      setFormations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormations();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      const res = await fetch(`/api/formations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFormations(formations.filter((f) => f.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (formation) => {
    const newStatus = formation.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/formations/${formation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setFormations(
          formations.map((f) => (f.id === formation.id ? { ...f, status: newStatus } : f))
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
        <h2>Gérer les Formations</h2>
        <Link href="/admin/formations/new" className="btn btn-primary btn-sm">
          ➕ Ajouter une formation
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Visuel</th>
              <th>Titre</th>
              <th>Format</th>
              <th>Durée</th>
              <th>Tarif indicatif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucune formation trouvée. Cliquez sur &quot;Ajouter une formation&quot; pour commencer.
                </td>
              </tr>
            ) : (
              formations.map((f) => (
                <tr key={f.id}>
                  <td style={{ width: '80px' }}>
                    <img
                      src={f.cover_image || '/images/demo/hero-bg.jpg'}
                      alt={f.title}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  </td>
                  <td>
                    <strong>{f.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>/{f.slug}</div>
                  </td>
                  <td>{f.format || '—'}</td>
                  <td>{f.duration || '—'}</td>
                  <td>{f.price || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(f)}
                      className={`status-badge ${f.status === 'published' ? 'status-published' : 'status-draft'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Cliquez pour changer le statut"
                    >
                      <span className="status-dot"></span>
                      {f.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/formations/${f.id}`} className="table-action-btn table-action-edit">
                        Éditer
                      </Link>
                      <button onClick={() => handleDelete(f.id)} className="table-action-btn table-action-delete">
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
