'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projets?all=true');
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const res = await fetch(`/api/projets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/projets/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
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
        <h2>Gérer les Projets</h2>
        <Link href="/admin/projets/new" className="btn btn-primary btn-sm">
          ➕ Ajouter un projet
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Visuel</th>
              <th>Titre</th>
              <th>Secteur</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucun projet trouvé. Cliquez sur &quot;Ajouter un projet&quot; pour commencer.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: '80px' }}>
                    <img
                      src={p.cover_image || '/images/demo/hero-bg.jpg'}
                      alt={p.title}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  </td>
                  <td>
                    <strong>{p.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>/{p.slug}</div>
                  </td>
                  <td>{p.sector || '—'}</td>
                  <td>{p.client || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`status-badge ${p.status === 'published' ? 'status-published' : 'status-draft'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Cliquez pour changer le statut"
                    >
                      <span className="status-dot"></span>
                      {p.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/projets/${p.id}`} className="table-action-btn table-action-edit">
                        Éditer
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="table-action-btn table-action-delete">
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
