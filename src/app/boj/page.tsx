import React from 'react';
import { getAllBojPosts, getAlgorithmTags } from '@/lib/boj';
import BojList from '@/components/boj/BojList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BOJ Archive | specidiee.work',
    description: 'Archive of solved Baekjoon Online Judge problems.',
};

export default function BojPage() {
    const posts = getAllBojPosts();
    const algoTags = getAlgorithmTags();

    return (
        <main style={{ minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
            {/* Background Stars - reusing from home if GLOBAL css handles it, 
                 or replicate. If styles global has .stars, it works. 
                 Let's assume global stars for consistency or just strict layout.
             */}
            <BojList initialPosts={posts} algoTags={algoTags} />
        </main>
    );
}
