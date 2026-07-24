import getDb from '@/lib/db';
import ListPageClient from './ListPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nos Projets — TAVLEN Solutions',
  description: "Découvrez les projets réalisés par TAVLEN Solutions : optimisation IA, jumeaux numériques, maintenance prédictive et plus encore.",
};

export default function ProjetsPage() {
  const db = getDb();
  const projects = db.prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC").all();
  const sectors = [...new Set(projects.map(p => p.sector).filter(Boolean))];

  return (
    <ListPageClient
      items={projects}
      title="Nos Projets"
      subtitle="Des réalisations concrètes au service de la performance industrielle"
      basePath="/projets"
      badgeField="sector"
      filterOptions={sectors}
      filterField="sector"
    />
  );
}
