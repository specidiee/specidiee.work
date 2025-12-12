import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import SearchFilters from '@/components/SearchFilters';
import styles from './page.module.css';

export const metadata = {
    title: 'Search | specidiee.work',
    description: 'Search results',
};

type Props = {
    searchParams: Promise<{
        q?: string;
        from?: string;
        to?: string;
    }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const { q, from, to } = await searchParams;
    const query = q || "";
    const posts = getAllPosts();

    const results = posts.filter((post) => {
        // Text Match
        let matchText = true;
        if (query) {
            const lowerQ = query.toLowerCase();
            const inTitle = post.meta.title.toLowerCase().includes(lowerQ);
            const inDesc = post.meta.description?.toLowerCase().includes(lowerQ);
            const inContent = post.content.toLowerCase().includes(lowerQ);
            const inTags = post.meta.tags?.some((tag) => tag.toLowerCase().includes(lowerQ)) ?? false;
            matchText = inTitle || (inDesc ?? false) || inContent || inTags;
        }

        // Date Match
        let matchDate = true;
        const postDate = new Date(post.meta.date);

        if (from) {
            const fromDate = new Date(from);
            // Reset time part for accurate comparison (start of day)
            fromDate.setHours(0, 0, 0, 0);
            if (postDate < fromDate) matchDate = false;
        }

        if (to && matchDate) {
            const toDate = new Date(to);
            // Set time to end of day
            toDate.setHours(23, 59, 59, 999);
            if (postDate > toDate) matchDate = false;
        }

        return matchText && matchDate;
    });

    return (
        <main className={styles.main}>
            <h1 className={`${styles.heading} text-gradient`}>
                {query ? `Search: "${query}"` : "Search"}
            </h1>

            <SearchFilters />

            <div className={styles.bojLink}>
                Thinking about BOJ problems?{' '}
                <Link href="/boj">Visit BOJ Archive</Link> for detailed problem search.
            </div>

            {results.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No matching posts found.
                    {(from || to) && " Try adjusting the date range."}
                </div>
            ) : (
                <div className={styles.grid}>
                    {results.map((post) => (
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
                                    {post.meta.tags?.map((tag) => (
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
            )}
        </main>
    );
}
