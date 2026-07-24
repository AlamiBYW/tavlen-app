import HomeClient from './HomeClient';
import getDb from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  
  // Fetch all data server-side
  const contentRows = db.prepare('SELECT key, value FROM site_content').all();
  const content = {};
  contentRows.forEach(r => { content[r.key] = r.value; });

  const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
  const projects = db.prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC LIMIT 6").all();
  const services = db.prepare("SELECT * FROM services WHERE status = 'published' ORDER BY sort_order ASC LIMIT 6").all();
  const formations = db.prepare("SELECT * FROM formations WHERE status = 'published' ORDER BY sort_order ASC LIMIT 4").all();
  const events = db.prepare("SELECT * FROM events WHERE status = 'published' ORDER BY sort_order ASC LIMIT 4").all();

  return (
    <HomeClient
      content={content}
      stats={stats}
      projects={projects}
      services={services}
      formations={formations}
      events={events}
    />
  );
}
