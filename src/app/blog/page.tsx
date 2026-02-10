import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import { Metadata } from 'next';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

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

            <div className={styles.grid}>
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className={`${styles.card} glass-card`}
                    >
                        <div className={styles.cardContentWrapper}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    {post.meta.title}
                                </h2>
                                <span className={styles.cardDate}>
                                    {new Date(post.meta.date).toLocaleDateString()}
                                </span>
                            </div>

                            <p className={styles.description}>
                                {post.meta.description}
                            </p>

                            <div className={styles.footer}>
                                <div className={styles.tags}>
                                    {post.meta.tags?.map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.badges}>
                                    {post.meta.type === 'interactive' && (
                                        <span className={styles.layoutBadge}>
                                            Interactive
                                        </span>
                                    )}
                                    <span className={styles.commentCount}>
                                        💬 {commentCounts[post.slug] || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {post.meta.thumbnail && (
                            <div className={styles.thumbnailWrapper}>
                                <Image
                                    src={post.meta.thumbnail}
                                    alt={post.meta.title}
                                    fill
                                    className={styles.thumbnail}
                                    unoptimized
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </main>
    );
}
