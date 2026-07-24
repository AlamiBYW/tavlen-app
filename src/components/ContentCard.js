import Link from 'next/link';

export default function ContentCard({ item, basePath, badge }) {
  return (
    <Link href={`${basePath}/${item.slug}`} className="content-card">
      <div className="card-image">
        <img src={item.cover_image || item.coverImage || '/images/demo/hero-bg.jpg'} alt={item.title} loading="lazy" />
        <div className="card-image-overlay" />
        {badge && <span className="card-badge">{badge}</span>}
      </div>
      <div className="card-body">
        <h3>{item.title}</h3>
        <p>{item.short_desc || item.shortDesc}</p>
      </div>
      <div className="card-footer">
        <span className="card-link">
          En savoir plus
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        {(item.date || item.event_date || item.eventDate) && (
          <span className="card-date">{item.date || item.event_date || item.eventDate}</span>
        )}
      </div>
    </Link>
  );
}
