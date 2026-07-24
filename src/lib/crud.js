import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function createCrudRoutes(tableName, fields) {
  return {
    async GET(request) {
      try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const all = searchParams.get('all');

        let query = `SELECT * FROM ${tableName}`;
        const params = [];

        if (status) {
          query += ' WHERE status = ?';
          params.push(status);
        } else if (!all) {
          query += " WHERE status = 'published'";
        }

        query += ' ORDER BY sort_order ASC, created_at DESC';
        const items = db.prepare(query).all(...params);
        return NextResponse.json(items);
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async POST(request) {
      try {
        const db = getDb();
        const data = await request.json();

        if (!data.slug && data.title) {
          data.slug = slugify(data.title);
          // Ensure unique slug
          const existing = db.prepare(`SELECT id FROM ${tableName} WHERE slug = ?`).get(data.slug);
          if (existing) data.slug += '-' + Date.now();
        }

        const columns = Object.keys(data).filter(k => fields.includes(k));
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map(c => data[c]);

        const result = db.prepare(
          `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`
        ).run(...values);

        const item = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(result.lastInsertRowid);
        return NextResponse.json(item, { status: 201 });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },
  };
}

export function createCrudByIdRoutes(tableName, fields) {
  return {
    async GET(request, { params }) {
      try {
        const db = getDb();
        const { id } = await params;
        // Try by id or slug
        let item = db.prepare(`SELECT * FROM ${tableName} WHERE id = ? OR slug = ?`).get(id, id);
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(item);
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async PUT(request, { params }) {
      try {
        const db = getDb();
        const { id } = await params;
        const data = await request.json();

        const columns = Object.keys(data).filter(k => fields.includes(k));
        const sets = columns.map(c => `${c} = ?`).join(', ');
        const values = columns.map(c => data[c]);

        db.prepare(`UPDATE ${tableName} SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
        const item = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
        return NextResponse.json(item);
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async DELETE(request, { params }) {
      try {
        const db = getDb();
        const { id } = await params;
        db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },
  };
}
