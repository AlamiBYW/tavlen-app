import getDb from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = getDb();
  const formation = db.prepare("SELECT * FROM formations WHERE slug = ? AND status = 'published'").get(slug);
  if (!formation) return { title: 'Formation non trouvée' };
  return { title: `${formation.title} — TAVLEN Solutions`, description: formation.short_desc };
}

export default async function FormationDetailPage({ params }) {
  const { slug } = await params;
  const db = getDb();
  const formation = db.prepare("SELECT * FROM formations WHERE slug = ? AND status = 'published'").get(slug);
  if (!formation) notFound();

  const similar = db.prepare("SELECT * FROM formations WHERE status = 'published' AND id != ? ORDER BY RANDOM() LIMIT 2").all(formation.id);

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-bg">
          <img src={formation.cover_image || '/images/demo/hero-bg.jpg'} alt={formation.title} />
        </div>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <div className="container">
            <h1>{formation.title}</h1>
            <div className="page-banner-meta">
              {formation.duration && <span><span className="meta-icon">⏱️</span> {formation.duration}</span>}
              {formation.format && <span><span className="meta-icon">📍</span> {formation.format}</span>}
              {formation.price && <span><span className="meta-icon">💰</span> {formation.price}</span>}
            </div>
          </div>
        </div>
      </div>

      <section className="detail-content">
        <div className="container">
          <Link href="/formations" className="back-link">← Retour aux formations</Link>

          <div className="detail-grid">
            <div className="detail-main">
              <h2>Description</h2>
              <div className="whitespace-pre-line"><p>{formation.full_desc}</p></div>

              {formation.program && (
                <>
                  <h2>Programme détaillé</h2>
                  <div className="whitespace-pre-line"><p>{formation.program}</p></div>
                </>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h4>Informations pratiques</h4>
                <ul>
                  {formation.duration && <li><strong>Durée :</strong> {formation.duration}</li>}
                  {formation.format && <li><strong>Format :</strong> {formation.format}</li>}
                  {formation.target_audience && <li><strong>Public cible :</strong> {formation.target_audience}</li>}
                  {formation.price && <li><strong>Tarif :</strong> {formation.price}</li>}
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>S&apos;inscrire à cette formation</h4>
                <p>Places limitées. Contactez-nous pour réserver.</p>
                <Link href="/contact" className="btn btn-primary btn-sm mt-2" style={{ width: '100%' }}>
                  S&apos;inscrire / Nous contacter
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar-section">
          <div className="container">
            <div className="section-header"><h2>Autres formations</h2></div>
            <div className="card-grid card-grid-2">
              {similar.map(s => <ContentCard key={s.id} item={s} basePath="/formations" badge={s.format} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
