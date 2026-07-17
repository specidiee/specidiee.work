import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'yaml';
import { getAllPdfPosts } from './pdf';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');
const interactiveDirectory = path.join(process.cwd(), 'content/interactive');

export type SimpleMetadata = {
  title: string;
  date: string;
  description?: string;
  layout?: 'academic' | 'casual' | 'problem';
  tags?: string[];
  thumbnail?: string;
  type?: 'post' | 'page' | 'interactive' | 'pdf';
  slug: string;
}

export type InteractivePost = {
  slug: string;
  meta: SimpleMetadata;
  componentPath: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    // Fallback or error?
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: {
      ...data,
      slug: realSlug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
    } as SimpleMetadata,
    content
  };
}

export function getInteractivePostSlugs(): string[] {
  if (!fs.existsSync(interactiveDirectory)) return [];
  return fs.readdirSync(interactiveDirectory).filter((file) => {
    const fullPath = path.join(interactiveDirectory, file);
    return fs.statSync(fullPath).isDirectory();
  });
}

export function getInteractivePostBySlug(slug: string): InteractivePost | null {
  const postDir = path.join(interactiveDirectory, slug);
  const metadataPath = path.join(postDir, 'metadata.yaml');
  const componentTsxPath = path.join(postDir, 'component.tsx');
  const componentJsxPath = path.join(postDir, 'component.jsx');

  // Check for both .tsx and .jsx extensions
  const componentPath = fs.existsSync(componentTsxPath)
    ? componentTsxPath
    : componentJsxPath;

  if (!fs.existsSync(metadataPath) || !fs.existsSync(componentPath)) {
    return null;
  }

  const metadataContents = fs.readFileSync(metadataPath, 'utf8');
  const data = yaml.parse(metadataContents);

  return {
    slug,
    meta: {
      ...data,
      slug,
      type: 'interactive',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
    } as SimpleMetadata,
    componentPath: `/content/interactive/${slug}/component`
  };
}

export function getAllInteractivePosts(): InteractivePost[] {
  const slugs = getInteractivePostSlugs();
  return slugs
    .map((slug) => getInteractivePostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null);
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const mdxPosts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null);

  const interactivePosts = getAllInteractivePosts();
  const pdfPosts = getAllPdfPosts();

  // Merge and sort by date
  const allPosts = [
    ...mdxPosts,
    ...interactivePosts.map(post => ({
      slug: post.slug,
      meta: post.meta,
      content: '',
    })),
    ...pdfPosts.map(post => ({
      slug: post.slug,
      meta: post.meta,
      content: '',
    })),
  ].sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return allPosts;
}
