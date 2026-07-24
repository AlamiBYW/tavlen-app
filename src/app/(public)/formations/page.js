import getDb from '@/lib/db';
import ListPageClient from '../projets/ListPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nos Formations — TAVLEN Solutions',
  description: "Formations en Machine Learning, Deep Learning et IA pour ingénieurs et techniciens industriels.",
};

export default function FormationsPage() {
  const db = getDb();
  const formations = db.prepare("SELECT * FROM formations WHERE status = 'published' ORDER BY sort_order ASC").all();
  const formats = [...new Set(formations.map(f => f.format).filter(Boolean))];

  return (
    <ListPageClient
      items={formations}
      title="Nos Formations"
      subtitle="Montez en compétences sur les technologies d'avenir"
      basePath="/formations"
      badgeField="format"
      filterOptions={formats}
      filterField="format"
    />
  );
}
