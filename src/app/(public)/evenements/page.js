import getDb from '@/lib/db';
import ListPageClient from '../projets/ListPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Événements & Workshops — TAVLEN Solutions',
  description: "Découvrez nos événements, workshops et conférences sur l'IA appliquée à l'industrie.",
};

export default function EvenementsPage() {
  const db = getDb();
  const events = db.prepare("SELECT * FROM events WHERE status = 'published' ORDER BY sort_order ASC, event_date DESC").all();

  return (
    <ListPageClient
      items={events}
      title="Événements & Workshops"
      subtitle="Rencontrez-nous lors de nos prochains événements"
      basePath="/evenements"
      badgeField="location"
      filterOptions={[]}
      filterField=""
    />
  );
}
