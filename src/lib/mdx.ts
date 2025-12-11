import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

export type SimpleMetadata = {
  title: string;
  date: string;
  description?: string;
  layout?: 'academic' | 'casual' | 'problem';
  tags?: string[];
  recommendations?: string[];
  thumbnail?: string;
  type?: 'post' | 'page';
  slug: string;
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

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}
