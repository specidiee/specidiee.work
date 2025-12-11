import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Blog | specidiee.work',
    description: 'Writings on Math, CS, and Life.',
};

export default function BlogIndex() {
    const posts = getAllPosts();

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
                                {post.meta.tags?.map(tag => (
                                    <span key={tag} className={styles.tag}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {post.meta.thumbnail && (
                            <div className={styles.thumbnailWrapper}>
                                <Image
                                    src={post.meta.thumbnail}
                                    alt={post.meta.title}
                                    fill
                                    className={styles.thumbnail}
                                />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </main>
    );
}
