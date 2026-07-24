'use client';
import { useState } from 'react';
import ContentCard from '@/components/ContentCard';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function ListPageClient({ items, title, subtitle, basePath, badgeField, filterOptions, filterField }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' ? items : items.filter(item => item[filterField] === activeFilter);

  return (
    <>
      <div className="list-page-header">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <section className="list-page-content">
        <div className="container">
          {filterOptions && filterOptions.length > 0 && (
            <div className="filter-bar">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Tous
              </button>
              {filterOptions.map(opt => (
                <button
                  key={opt}
                  className={`filter-btn ${activeFilter === opt ? 'active' : ''}`}
                  onClick={() => setActiveFilter(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Aucun élément trouvé</h3>
              <p>Revenez bientôt pour découvrir nos nouveautés.</p>
            </div>
          ) : (
            <div className="card-grid">
              {filtered.map((item, i) => (
                <ScrollAnimation key={item.id} delay={i * 80}>
                  <ContentCard item={item} basePath={basePath} badge={badgeField ? item[badgeField] : null} />
                </ScrollAnimation>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
