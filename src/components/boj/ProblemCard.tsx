'use client';

import React from 'react';
import Link from 'next/link';
import { BojPost } from '@/lib/boj';
import styles from './ProblemCard.module.css';

type Props = {
    post: BojPost;
};

const REC_SOURCES: Record<string, string> = {
    'c': 'CLASS',
    's': 'BOJ Step',
    'k': 'kks227',
    'l': 'Lemonade255',
    'b': 'BarkingDog'
};

const REC_COLORS: Record<string, string> = {
    'c': '#2ecc71', // Green
    's': '#3498db', // Blue
    'k': '#e67e22', // Orange
    'l': '#f1c40f', // Yellow
    'b': '#9b59b6'  // Purple
};

export default function ProblemCard({ post }: Props) {
    const {
        title,
        problemId,
        step,
        stepName,
        tier,
        recommendations
    } = post;

    // Format tier for display (e.g., 's3' -> 'Silver 3', 'g1' -> 'Gold 1')
    // Actually, typically in BOJ community 's3' is just shown as an icon or colored text.
    // I'll implement a simple color mapping for the border or badge.
    const tierColor = getTierColor(tier);

    return (
        <div className={`${styles.card} glass-card`} style={{ borderLeft: `4px solid ${tierColor}` }}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <span className={styles.tierBadge} style={{ backgroundColor: tierColor }}>
                        {tier.toUpperCase()}
                    </span>
                    {step > 0 && (
                        <span className={styles.stepBadge}>
                            Step {step}: {stepName}
                        </span>
                    )}
                </div>
                <h3 className={styles.title}>
                    <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
                        {title}
                    </Link>
                </h3>
            </div>

            <div className={styles.footer}>
                <div className={styles.recommendations}>
                    {recommendations.map(r => (
                        <span
                            key={r}
                            className={styles.recBadge}
                            style={{ borderColor: REC_COLORS[r] || '#fff', color: REC_COLORS[r] || '#fff' }}
                            title={REC_SOURCES[r] || r}
                        >
                            {REC_SOURCES[r] || r}
                        </span>
                    ))}
                </div>

                <div className={styles.actions}>
                    <a
                        href={`https://www.acmicpc.net/problem/${problemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                    >
                        BOJ
                    </a>
                    <a
                        href={`https://moon-chu.com/problem/${problemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton}
                    >
                        Moon-Chu
                    </a>
                    <Link href={`/blog/${post.slug}`} className={`${styles.actionButton} ${styles.solutionButton}`}>
                        View Solution
                    </Link>
                </div>
            </div>
        </div>
    );
}

function getTierColor(tier: string): string {
    const t = tier.toLowerCase();
    if (t.startsWith('b')) return '#cd7f32'; // Bronze
    if (t.startsWith('s')) return '#435f7a'; // Silver
    if (t.startsWith('g')) return '#ec9a00'; // Gold
    if (t.startsWith('p')) return '#27e2a4'; // Platinum
    if (t.startsWith('d')) return '#00b4fc'; // Diamond
    if (t.startsWith('r')) return '#ff0062'; // Ruby
    return '#666'; // Unrated
}
