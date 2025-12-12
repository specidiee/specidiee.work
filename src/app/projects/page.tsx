import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Projects | specidiee.work',
    description: ' showcased projects and tools.',
};

export default function ProjectsPage() {
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">Projects</h1>
                <p className={styles.subtitle}>
                    A collection of tools, archives, and experiments.
                </p>
            </header>

            <div className={styles.grid}>
                <Link href="/boj" className={`${styles.card} glass-card`}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/images/boj-archive.jpeg"
                            alt="BOJ Archive"
                            fill
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>BOJ Archive</h2>
                        <p className={styles.description}>
                            A curated collection of Baekjoon Online Judge solutions.
                            Features step-by-step classification, tier breakdowns, and curated recommendations.
                        </p>
                        <div className={styles.tags}>
                            <span className={styles.tag}>Algorithm</span>
                            <span className={styles.tag}>Archive</span>
                            <span className={styles.tag}>Education</span>
                        </div>
                    </div>
                </Link>

                {/* Placeholder for future projects */}
                {/* 
                <div className={`${styles.card} ${styles.placeholder} glass-card`}>
                    <div className={styles.placeholderContent}>
                        <h3>Coming Soon...</h3>
                    </div>
                </div> 
                */}
            </div>
        </main>
    );
}
