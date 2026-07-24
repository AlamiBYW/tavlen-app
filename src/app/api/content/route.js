import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_content').all();
    const content = {};
    rows.forEach(r => { content[r.key] = r.value; });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = getDb();
    const data = await request.json();
    const update = db.prepare('INSERT OR REPLACE INTO site_content (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    Object.entries(data).forEach(([key, value]) => update.run(key, value));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
