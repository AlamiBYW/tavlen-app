import getDb from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = getDb();
  const service = db.prepare("SELECT * FROM services WHERE slug = ? AND status = 'published'").get(slug);
  if (!service) return { title: 'Service non trouvé' };
  return { title: `${service.title} — TAVLEN Solutions`, description: service.short_desc };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const db = getDb();
  const service = db.prepare("SELECT * FROM services WHERE slug = ? AND status = 'published'").get(slug);
  if (!service) notFound();

  const similar = db.prepare("SELECT * FROM services WHERE status = 'published' AND id != ? ORDER BY RANDOM() LIMIT 3").all(service.id);

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-bg">
          <img src={service.cover_image || '/images/demo/hero-bg.jpg'} alt={service.title} />
        </div>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <div className="container">
            <h1>{service.title}</h1>
            <div className="page-banner-meta">
              {service.category && <span><span className="meta-icon">🏷️</span> {service.category}</span>}
            </div>
          </div>
        </div>
      </div>

      <section className="detail-content">
        <div className="container">
          <Link href="/services" className="back-link">← Retour aux services</Link>

          <div className="detail-grid">
            <div className="detail-main">
              <h2>Description</h2>
              <div className="whitespace-pre-line"><p>{service.full_desc}</p></div>

              {service.steps && (
                <>
                  <h2>Déroulé & Étapes</h2>
                  <div className="whitespace-pre-line"><p>{service.steps}</p></div>
                </>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h4>Détails</h4>
                <ul>
                  {service.category && <li><strong>Catégorie :</strong> {service.category}</li>}
                  {service.target_client && <li><strong>Pour qui :</strong> {service.target_client}</li>}
                  {service.pricing && <li><strong>Tarif :</strong> {service.pricing}</li>}
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>Intéressé par ce service ?</h4>
                <p>Demandez un devis personnalisé.</p>
                <Link href="/contact" className="btn btn-primary btn-sm mt-2" style={{ width: '100%' }}>
                  Demander ce service
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar-section">
          <div className="container">
            <div className="section-header"><h2>Autres services</h2></div>
            <div className="card-grid">
              {similar.map(s => <ContentCard key={s.id} item={s} basePath="/services" badge={s.category} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
