import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM contact_info').all();
    const info = {};
    rows.forEach(r => { info[r.key] = r.value; });
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = getDb();
    const data = await request.json();
    const update = db.prepare('INSERT OR REPLACE INTO contact_info (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    Object.entries(data).forEach(([key, value]) => update.run(key, value));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
