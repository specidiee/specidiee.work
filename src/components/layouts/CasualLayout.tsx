import React from 'react';
import Image from 'next/image';
import styles from './CasualLayout.module.css';

type Props = {
    children: React.ReactNode;
    meta: {
        title: string;
        date: string;
        thumbnail?: string;
        tags?: string[];
    };
};

export default function CasualLayout({ children, meta }: Props) {
    return (
        <article className={styles.container}>
            {meta.thumbnail && (
                <div className={styles.heroImage}>
                    {/* Use next/image with logic for remote vs local if needed, 
                 assuming local for now or configured for remote */}
                    <Image src={meta.thumbnail} alt={meta.title} fill style={{ objectFit: 'cover' }} />
                </div>
            )}
            <header className={styles.header}>
                <div className={styles.tags}>
                    {meta.tags?.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                </div>
                <h1 className={styles.title}>{meta.title}</h1>
                <time className={styles.date}>{new Date(meta.date).toLocaleDateString()}</time>
            </header>
            <div className={styles.content}>
                {children}
            </div>
        </article>
    );
}
