import getDb from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = getDb();
  const project = db.prepare("SELECT * FROM projects WHERE slug = ? AND status = 'published'").get(slug);
  if (!project) return { title: 'Projet non trouvé' };
  return {
    title: `${project.title} — TAVLEN Solutions`,
    description: project.short_desc,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const db = getDb();
  const project = db.prepare("SELECT * FROM projects WHERE slug = ? AND status = 'published'").get(slug);
  if (!project) notFound();

  const similar = db.prepare("SELECT * FROM projects WHERE status = 'published' AND id != ? ORDER BY RANDOM() LIMIT 3").all(project.id);

  let gallery = [];
  try { gallery = JSON.parse(project.gallery || '[]'); } catch(e) {}

  return (
    <>
      {/* Banner */}
      <div className="page-banner">
        <div className="page-banner-bg">
          <img src={project.cover_image || '/images/demo/hero-bg.jpg'} alt={project.title} />
        </div>
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <div className="container">
            <h1>{project.title}</h1>
            <div className="page-banner-meta">
              {project.sector && <span><span className="meta-icon">📂</span> {project.sector}</span>}
              {project.client && <span><span className="meta-icon">🏢</span> {project.client}</span>}
              {project.date && <span><span className="meta-icon">📅</span> {project.date}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="detail-content">
        <div className="container">
          <Link href="/projets" className="back-link">
            ← Retour aux projets
          </Link>

          <div className="detail-grid">
            <div className="detail-main">
              <h2>Description du projet</h2>
              <div className="whitespace-pre-line">
                <p>{project.full_desc}</p>
              </div>

              {project.methodology && (
                <>
                  <h2>Méthodologie</h2>
                  <div className="whitespace-pre-line">
                    <p>{project.methodology}</p>
                  </div>
                </>
              )}

              {project.results && (
                <>
                  <h2>Résultats & Livrables</h2>
                  <div className="whitespace-pre-line">
                    <p>{project.results}</p>
                  </div>
                </>
              )}

              {project.testimonial && (
                <>
                  <h2>Témoignage</h2>
                  <blockquote style={{ borderLeft: '4px solid var(--cyan)', paddingLeft: '1.5rem', fontStyle: 'italic', color: 'var(--gray-600)' }}>
                    <p>{project.testimonial}</p>
                  </blockquote>
                </>
              )}

              {gallery.length > 0 && (
                <>
                  <h2>Galerie</h2>
                  <div className="detail-gallery">
                    {gallery.map((img, i) => (
                      <img key={i} src={img} alt={`${project.title} - Image ${i + 1}`} loading="lazy" />
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h4>Informations</h4>
                <ul>
                  {project.sector && <li><strong>Secteur :</strong> {project.sector}</li>}
                  {project.client && <li><strong>Client :</strong> {project.client}</li>}
                  {project.date && <li><strong>Date :</strong> {project.date}</li>}
                </ul>
              </div>
              <div className="sidebar-card">
                <h4>Vous avez un projet similaire ?</h4>
                <p>Contactez-nous pour discuter de vos besoins.</p>
                <Link href="/contact" className="btn btn-primary btn-sm mt-2" style={{ width: '100%' }}>
                  Nous contacter
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Similar Projects */}
      {similar.length > 0 && (
        <section className="similar-section">
          <div className="container">
            <div className="section-header">
              <h2>Projets similaires</h2>
            </div>
            <div className="card-grid">
              {similar.map(s => (
                <ContentCard key={s.id} item={s} basePath="/projets" badge={s.sector} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
