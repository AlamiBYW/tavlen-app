'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, services: 0, formations: 0, events: 0, messages: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projRes, servRes, formRes, evRes, msgRes] = await Promise.all([
          fetch('/api/projets?all=true'),
          fetch('/api/services?all=true'),
          fetch('/api/formations?all=true'),
          fetch('/api/evenements?all=true'),
          fetch('/api/contact'),
        ]);

        const [projs, servs, forms, evs, msgs] = await Promise.all([
          projRes.json(),
          servRes.json(),
          formRes.json(),
          evRes.json(),
          msgRes.json(),
        ]);

        setStats({
          projects: projs.length || 0,
          services: servs.length || 0,
          formations: forms.length || 0,
          events: evs.length || 0,
          messages: msgs.length || 0,
          unreadMessages: msgs.filter(m => !m.is_read).length || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard statistics', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="spinner" style={{ marginTop: '5rem' }}></div>;
  }

  return (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Projets</h3>
          <div className="stat-number">{stats.projects}</div>
          <Link href="/admin/projets" style={{ fontSize: '0.8rem', color: 'var(--cyan-dark)' }}>
            Gérer les projets →
          </Link>
        </div>

        <div className="admin-stat-card">
          <h3>Services</h3>
          <div className="stat-number">{stats.services}</div>
          <Link href="/admin/services" style={{ fontSize: '0.8rem', color: 'var(--cyan-dark)' }}>
            Gérer les services →
          </Link>
        </div>

        <div className="admin-stat-card">
          <h3>Formations</h3>
          <div className="stat-number">{stats.formations}</div>
          <Link href="/admin/formations" style={{ fontSize: '0.8rem', color: 'var(--cyan-dark)' }}>
            Gérer les formations →
          </Link>
        </div>

        <div className="admin-stat-card">
          <h3>Événements</h3>
          <div className="stat-number">{stats.events}</div>
          <Link href="/admin/evenements" style={{ fontSize: '0.8rem', color: 'var(--cyan-dark)' }}>
            Gérer les événements →
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="admin-table-wrapper" style={{ padding: '2rem' }}>
          <h3 className="mb-2">Bienvenue dans la console de gestion</h3>
          <p>
            Depuis cet espace, vous pouvez contrôler l&apos;ensemble du contenu de votre site vitrine :
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--gray-600)' }}>
            <li className="mb-1">Ajouter, modifier ou supprimer des réalisations dans <strong>Projets</strong>.</li>
            <li className="mb-1">Gérer vos offres de conseil et d&apos;accompagnement dans <strong>Services</strong>.</li>
            <li className="mb-1">Publier des programmes et détails d&apos;apprentissage dans <strong>Formations</strong>.</li>
            <li className="mb-1">Planifier et annoncer vos prochains workshops dans <strong>Événements</strong>.</li>
            <li className="mb-1">Changer les textes de la page d&apos;accueil, de la biographie et des coordonnées.</li>
          </ul>
        </div>

        <div className="admin-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', borderColor: stats.unreadMessages > 0 ? 'var(--cyan)' : 'var(--gray-200)' }}>
          <h3>Messages non lus</h3>
          <div className="stat-number" style={{ color: stats.unreadMessages > 0 ? 'var(--cyan-dark)' : 'inherit' }}>
            {stats.unreadMessages}
          </div>
          <Link href="/admin/messages" className="btn btn-primary btn-sm mt-2">
            Consulter les messages
          </Link>
        </div>
      </div>
    </>
  );
}
