import getDb from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = getDb();
  const event = db.prepare("SELECT * FROM events WHERE slug = ? AND status = 'published'").get(slug);
  if (!event) return { title: 'Événement non trouvé' };
  return { title: `${event.title} — TAVLEN Solutions`, description: event.short_desc };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const db = getDb();
  const event = db.prepare("SELECT * FROM events WHERE slug = ? AND status = 'published'").get(slug);
  if (!event) notFound();

  const similar = db.prepare("SELECT * FROM events WHERE status = 'published' AND id != ? ORDER BY RANDOM() LIMIT 2").all(event.id);

  let gallery = [];
  try { gallery = JSON.parse(event.gallery || '[]'); } catch(e) {}

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-bg">
          <img src={event.cover_image || '/images/demo/hero-bg.jpg'} alt={event.title} />
        </div>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <div className="container">
            <h1>{event.title}</h1>
            <div className="page-banner-meta">
              {event.event_date && <span><span className="meta-icon">📅</span> {event.event_date}</span>}
              {event.location && <span><span className="meta-icon">📍</span> {event.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <section className="detail-content">
        <div className="container">
          <Link href="/evenements" className="back-link">← Retour aux événements</Link>

          <div className="detail-grid">
            <div className="detail-main">
              <h2>Description</h2>
              <div className="whitespace-pre-line"><p>{event.full_desc}</p></div>

              {event.video_replay && (
                <>
                  <h2>Replay vidéo</h2>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', margin: '2rem 0' }}>
                    <iframe
                      src={event.video_replay}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allowFullScreen
                      title="Replay vidéo de l'événement"
                    />
                  </div>
                </>
              )}

              {gallery.length > 0 && (
                <>
                  <h2>Galerie photos</h2>
                  <div className="detail-gallery">
                    {gallery.map((img, i) => (
                      <img key={i} src={img} alt={`${event.title} - Image ${i + 1}`} loading="lazy" />
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h4>Détails de l&apos;événement</h4>
                <ul>
                  {event.event_date && <li><strong>Date :</strong> {event.event_date}</li>}
                  {event.location && <li><strong>Lieu :</strong> {event.location}</li>}
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>Participer / Se renseigner</h4>
                <p>Pour plus d&apos;informations ou pour vous inscrire à nos prochains workshops, contactez-nous.</p>
                <Link href="/contact" className="btn btn-primary btn-sm mt-2" style={{ width: '100%' }}>
                  Nous contacter
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar-section">
          <div className="container">
            <div className="section-header"><h2>Autres événements</h2></div>
            <div className="card-grid card-grid-2">
              {similar.map(s => <ContentCard key={s.id} item={s} basePath="/evenements" badge={s.location} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
