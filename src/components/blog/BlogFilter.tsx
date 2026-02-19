'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/blog/page.module.css';
import filterStyles from './BlogFilter.module.css';
import type { SimpleMetadata } from '@/lib/mdx';

type Post = {
    slug: string;
    meta: SimpleMetadata;
    content: string;
};

type Props = {
    posts: Post[];
    commentCounts: Record<string, number>;
};

export default function BlogFilter({ posts, commentCounts }: Props) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [interactiveOnly, setInteractiveOnly] = useState(false);

    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        posts.forEach(post => post.meta.tags?.forEach(t => tagSet.add(t)));
        return Array.from(tagSet).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            if (interactiveOnly && post.meta.type !== 'interactive') return false;
            if (selectedTags.length > 0) {
                const postTags = post.meta.tags ?? [];
                if (!selectedTags.every(t => postTags.includes(t))) return false;
            }
            return true;
        });
    }, [posts, selectedTags, interactiveOnly]);

    function toggleTag(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    return (
        <>
            <div className={filterStyles.filterBar}>
                <button
                    className={`${filterStyles.filterChip} ${interactiveOnly ? filterStyles.active : ''}`}
                    onClick={() => setInteractiveOnly(v => !v)}
                >
                    ✦ Interactive
                </button>

                {allTags.map(tag => (
                    <button
                        key={tag}
                        className={`${filterStyles.filterChip} ${selectedTags.includes(tag) ? filterStyles.active : ''}`}
                        onClick={() => toggleTag(tag)}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {(selectedTags.length > 0 || interactiveOnly) && (
                <div className={filterStyles.filterStatus}>
                    <span className={filterStyles.resultCount}>{filteredPosts.length}개의 글</span>
                    <button
                        className={filterStyles.clearButton}
                        onClick={() => { setSelectedTags([]); setInteractiveOnly(false); }}
                    >
                        필터 초기화
                    </button>
                </div>
            )}

            <div className={styles.grid}>
                {filteredPosts.map((post) => (
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
                                        <span key={tag} className={`${styles.tag} ${selectedTags.includes(tag) ? filterStyles.tagHighlight : ''}`}>
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

                {filteredPosts.length === 0 && (
                    <p className={filterStyles.emptyMessage}>
                        선택한 필터에 해당하는 글이 없습니다.
                    </p>
                )}
            </div>
        </>
    );
}
