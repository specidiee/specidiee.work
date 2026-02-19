import { getAllPosts } from '@/lib/mdx';
import { Metadata } from 'next';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import BlogFilter from '@/components/blog/BlogFilter';

export const metadata: Metadata = {
    title: 'Blog | specidiee.work',
    description: 'Writings on Math, CS, and Life.',
};

async function getCommentCounts() {
    try {
        const comments = await prisma.comment.groupBy({
            by: ['postSlug'],
            _count: {
                id: true,
            },
        });

        return Object.fromEntries(
            comments.map((c: { postSlug: string; _count: { id: number } }) => [c.postSlug, c._count.id])
        );
    } catch (error) {
        console.error('Error fetching comment counts:', error);
        return {};
    }
}

export default async function BlogIndex() {
    const posts = getAllPosts();
    const commentCounts = await getCommentCounts();

    return (
        <main className={styles.main}>
            <h1 className={`${styles.heading} text-gradient`}>Latest Transmissions</h1>
            <BlogFilter posts={posts} commentCounts={commentCounts} />
        </main>
    );
}
