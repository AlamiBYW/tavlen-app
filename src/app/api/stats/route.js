import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = getDb();
    const data = await request.json();
    db.prepare('DELETE FROM stats').run();
    const insert = db.prepare('INSERT INTO stats (label, value, suffix, sort_order) VALUES (?, ?, ?, ?)');
    data.forEach((s, i) => insert.run(s.label, s.value, s.suffix || '', i));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
