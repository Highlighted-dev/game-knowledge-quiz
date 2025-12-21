import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { categories } = await req.json();

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: 'Invalid categories data' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'categories.json');
    
    await fs.writeFile(filePath, JSON.stringify({ categories }, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Error:', error);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
