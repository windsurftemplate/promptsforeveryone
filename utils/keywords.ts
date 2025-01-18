import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface KeywordEntry {
  category: string;
  subcategory: string;
  keywords: string;
}

export function getKeywords(category: string, subcategory?: string): string[] {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'data', 'keywords.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as KeywordEntry[];

    // Get general keywords that apply to all categories
    const generalKeywords = records.find(r => r.category === 'all' && r.subcategory === 'all')?.keywords.split(',').map(k => k.trim()) || [];

    // Get category-specific keywords
    const categoryKeywords = records.find(r => 
      r.category === category && r.subcategory === 'all'
    )?.keywords.split(',').map(k => k.trim()) || [];

    // Get subcategory-specific keywords if subcategory is provided
    const subcategoryKeywords = subcategory ? records.find(r => 
      r.category === category && r.subcategory === subcategory
    )?.keywords.split(',').map(k => k.trim()) || [] : [];

    // Combine and deduplicate keywords
    return Array.from(new Set([
      ...generalKeywords,
      ...categoryKeywords,
      ...subcategoryKeywords
    ]));
  } catch (error) {
    console.error('Error reading keywords:', error);
    return [
      'AI prompts',
      'prompt engineering',
      'ChatGPT prompts',
      'prompt templates',
      'AI writing'
    ];
  }
} 