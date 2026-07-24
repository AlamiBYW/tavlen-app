import getDb from '@/lib/db';
import ListPageClient from '../projets/ListPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nos Services — TAVLEN Solutions',
  description: "Découvrez nos services de conseil en IA industrielle, digitalisation des processus et formation pour ingénieurs.",
};

export default function ServicesPage() {
  const db = getDb();
  const services = db.prepare("SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC").all();
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <ListPageClient
      items={services}
      title="Nos Services"
      subtitle="Des solutions d'IA sur mesure pour chaque défi industriel"
      basePath="/services"
      badgeField="category"
      filterOptions={categories}
      filterField="category"
    />
  );
}
