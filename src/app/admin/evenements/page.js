'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/evenements?all=true');
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      const res = await fetch(`/api/evenements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (event) => {
    const newStatus = event.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/evenements/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents(
          events.map((e) => (e.id === event.id ? { ...e, status: newStatus } : e))
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
        <h2>Gérer les Événements</h2>
        <Link href="/admin/evenements/new" className="btn btn-primary btn-sm">
          ➕ Ajouter un événement
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Visuel</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucun événement trouvé. Cliquez sur &quot;Ajouter un événement&quot; pour commencer.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id}>
                  <td style={{ width: '80px' }}>
                    <img
                      src={e.cover_image || '/images/demo/hero-bg.jpg'}
                      alt={e.title}
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  </td>
                  <td>
                    <strong>{e.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>/{e.slug}</div>
                  </td>
                  <td>{e.event_date || '—'}</td>
                  <td>{e.location || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(e)}
                      className={`status-badge ${e.status === 'published' ? 'status-published' : 'status-draft'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title="Cliquez pour changer le statut"
                    >
                      <span className="status-dot"></span>
                      {e.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/evenements/${e.id}`} className="table-action-btn table-action-edit">
                        Éditer
                      </Link>
                      <button onClick={() => handleDelete(e.id)} className="table-action-btn table-action-delete">
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
