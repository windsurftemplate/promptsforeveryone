import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

interface KeywordEntry {
  category: string;
  subcategory: string;
  keywords: string[];
}

async function readKeywordsFile() {
  const csvPath = path.join(process.cwd(), 'data', 'keywords.csv');
  const fileContent = await fs.readFile(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map((record: any) => ({
    category: record.category,
    subcategory: record.subcategory,
    keywords: record.keywords.split(',').map((k: string) => k.trim())
  }));
}

async function writeKeywordsFile(keywords: KeywordEntry[]) {
  const csvPath = path.join(process.cwd(), 'data', 'keywords.csv');
  const records = keywords.map(entry => ({
    category: entry.category,
    subcategory: entry.subcategory,
    keywords: entry.keywords.join(',')
  }));

  const csv = stringify(records, {
    header: true,
    columns: ['category', 'subcategory', 'keywords']
  });

  await fs.writeFile(csvPath, csv, 'utf-8');
}

export async function GET() {
  try {
    const keywords = await readKeywordsFile();
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Error reading keywords:', error);
    return NextResponse.json({ error: 'Failed to read keywords' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, subcategory, keywords } = await request.json();
    
    // Validate input
    if (!category || !subcategory || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existingKeywords = await readKeywordsFile();
    
    // Check if entry already exists
    const existingIndex = existingKeywords.findIndex(
      (k: KeywordEntry) => k.category === category && k.subcategory === subcategory
    );

    if (existingIndex !== -1) {
      // Update existing entry
      existingKeywords[existingIndex].keywords = keywords;
    } else {
      // Add new entry
      existingKeywords.push({ category, subcategory, keywords });
    }

    await writeKeywordsFile(existingKeywords);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding keywords:', error);
    return NextResponse.json({ error: 'Failed to add keywords' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { category, subcategory } = await request.json();
    
    // Validate input
    if (!category || !subcategory) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existingKeywords = await readKeywordsFile();
    
    // Filter out the entry to delete
    const updatedKeywords = existingKeywords.filter(
      (k: KeywordEntry) => !(k.category === category && k.subcategory === subcategory)
    );

    await writeKeywordsFile(updatedKeywords);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keywords:', error);
    return NextResponse.json({ error: 'Failed to delete keywords' }, { status: 500 });
  }
} 