'use client';

import React, { useState, useMemo } from 'react';
import { BojPost, AlgoTag } from '@/lib/boj';
import ProblemCard from '@/components/boj/ProblemCard';
import ControlPanel, { SortOption, SortOrder } from '@/components/boj/ControlPanel';
import styles from './page.module.css';

export default function BojList({ initialPosts, algoTags = [] }: { initialPosts: BojPost[], algoTags?: AlgoTag[] }) {
    // State
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Filters
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [stepRange, setStepRange] = useState<[number, number]>([1, 35]);
    const [selectedAlgoTags, setSelectedAlgoTags] = useState<string[]>([]);

    // Handlers
    const handleToggleTier = (tier: string) => {
        setSelectedTiers(prev =>
            prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
        );
    };

    const handleToggleSource = (source: string) => {
        setSelectedSources(prev =>
            prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
        );
    };

    const handleToggleAlgoTag = (tagId: string) => {
        setSelectedAlgoTags(prev =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    };

    const filteredAndSortedPosts = useMemo(() => {
        let result = [...initialPosts];

        // 1. Filter by Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.problemId.toString().includes(q) ||
                p.stepName.toLowerCase().includes(q)
            );
        }

        // 2. Filter by Tiers
        if (selectedTiers.length > 0) {
            result = result.filter(p => {
                const tierChar = p.tier.charAt(0).toLowerCase();
                return selectedTiers.includes(tierChar);
            });
        }

        // 3. Filter by Sources
        if (selectedSources.length > 0) {
            result = result.filter(p =>
                p.recommendations.some(r => selectedSources.includes(r))
            );
        }

        // 4. Filter by Step Range
        result = result.filter(p => p.step >= stepRange[0] && p.step <= stepRange[1]);

        // 5. Filter by Algorithm Tags
        if (selectedAlgoTags.length > 0) {
            result = result.filter(p => {
                const postTags = p.tags || [];
                return selectedAlgoTags.some(selectedTag => postTags.includes(selectedTag));
            });
        }

        // 6. Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'latest':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'problem_no':
                    comparison = a.problemId - b.problemId;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'difficulty':
                    comparison = a.tierSort - b.tierSort;
                    if (comparison === 0) comparison = a.problemId - b.problemId;
                    break;
                case 'step':
                    comparison = a.step - b.step;
                    if (comparison === 0) comparison = a.problemId - b.problemId;
                    break;
                case 'recommendation':
                    comparison = a.recommendationScore - b.recommendationScore;
                    if (comparison === 0) comparison = a.problemId - b.problemId;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [initialPosts, search, sortBy, sortOrder, selectedTiers, selectedSources, stepRange, selectedAlgoTags]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-gradient">BOJ Archive</h1>
                <p className={styles.subtitle}>
                    Curated list of Baekjoon Online Judge problems with solutions and analysis.
                </p>
            </header>

            <ControlPanel
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                selectedTiers={selectedTiers}
                onToggleTier={handleToggleTier}
                selectedSources={selectedSources}
                onToggleSource={handleToggleSource}
                stepRange={stepRange}
                onStepRangeChange={setStepRange}
                algoTags={algoTags}
                selectedAlgoTags={selectedAlgoTags}
                onToggleAlgoTag={handleToggleAlgoTag}
            />

            <div className={styles.grid}>
                {filteredAndSortedPosts.map(post => (
                    <ProblemCard key={post.slug} post={post} />
                ))}

                {filteredAndSortedPosts.length === 0 && (
                    <div className={styles.empty}>
                        No problems found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
