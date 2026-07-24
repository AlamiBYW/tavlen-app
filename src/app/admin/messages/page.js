'use client';
import { useEffect, useState } from 'react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !currentStatus }),
      });
      if (res.ok) {
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, is_read: !currentStatus ? 1 : 0 } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }}></div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Messages Reçus</h2>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Sujet</th>
              <th>Message</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Aucun message reçu pour le moment.
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} style={{ fontWeight: !m.is_read ? '600' : 'normal', background: !m.is_read ? 'rgba(79, 209, 232, 0.02)' : 'none' }}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {new Date(m.created_at).toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>{m.name}</td>
                  <td>
                    <a href={`mailto:${m.email}`} style={{ color: 'var(--cyan-dark)', textDecoration: 'underline' }}>
                      {m.email}
                    </a>
                  </td>
                  <td>{m.subject || '—'}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
                    {m.message}
                  </td>
                  <td>
                    <button
                      onClick={() => handleMarkAsRead(m.id, m.is_read)}
                      className={`status-badge ${m.is_read ? 'status-published' : 'status-draft'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      title={m.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    >
                      <span className="status-dot"></span>
                      {m.is_read ? 'Lu' : 'Non lu'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleDelete(m.id)} className="table-action-btn table-action-delete">
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
