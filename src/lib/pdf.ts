import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import type { SimpleMetadata } from './mdx';

const pdfsDirectory = path.join(process.cwd(), 'content/pdfs');

export type PdfPost = {
  slug: string;
  meta: SimpleMetadata;
  pdfUrl: string;
};

export function getPdfSlugs(): string[] {
  if (!fs.existsSync(pdfsDirectory)) return [];
  return fs.readdirSync(pdfsDirectory).filter((file) => {
    const fullPath = path.join(pdfsDirectory, file);
    return fs.statSync(fullPath).isDirectory();
  });
}

export function getPdfPostBySlug(slug: string): PdfPost | null {
  const postDir = path.join(pdfsDirectory, slug);
  const metadataPath = path.join(postDir, 'metadata.yaml');

  if (!fs.existsSync(metadataPath)) return null;

  const metadataContents = fs.readFileSync(metadataPath, 'utf8');
  const data = yaml.load(metadataContents) as Record<string, unknown>;

  return {
    slug,
    meta: {
      ...data,
      slug,
      type: 'pdf',
      date: data.date ? new Date(data.date as string).toISOString() : new Date().toISOString(),
    } as SimpleMetadata,
    pdfUrl: `/pdfs/${slug}.pdf`,
  };
}

export function getAllPdfPosts(): PdfPost[] {
  const slugs = getPdfSlugs();
  return slugs
    .map((slug) => getPdfPostBySlug(slug))
    .filter((post): post is PdfPost => post !== null);
}
