'use client';

import React, { useState, useMemo } from 'react';
import { BojPost } from '@/lib/boj';
import ProblemCard from '@/components/boj/ProblemCard';
import ControlPanel, { SortOption, SortOrder } from '@/components/boj/ControlPanel';
import styles from './page.module.css';

export default function BojList({ initialPosts }: { initialPosts: BojPost[] }) {
    // State
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Filters
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [stepRange, setStepRange] = useState<[number, number]>([1, 35]);

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

        // 2. Filter by Tiers (based on first letter, e.g. b for Bronze)
        if (selectedTiers.length > 0) {
            result = result.filter(p => {
                const tierChar = p.tier.charAt(0).toLowerCase();
                return selectedTiers.includes(tierChar);
            });
        }

        // 3. Filter by Sources
        if (selectedSources.length > 0) {
            result = result.filter(p =>
                // Check if post renders any of the selected sources
                // recommendations is array of strings like 'c', 's'
                p.recommendations.some(r => selectedSources.includes(r))
            );
        }

        // 4. Filter by Step Range
        // Use step 0 for unclassified? User might want to see them if range includes 0.
        result = result.filter(p => p.step >= stepRange[0] && p.step <= stepRange[1]);

        // 5. Sort
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

            // Apply Sort Order (Default Ascending for all except Latest/Rec?)
            // Usually "Latest" means Newest First (Desc). "Recommendation" means Most Rec First (Desc).
            // But here we have generic sortOrder toggle.
            // Let's assume standard comparison result is Ascending.
            // But wait, my previous logic for latest was `b - a` (desc).
            // Let's standardize to Ascending first, then flip if desc.

            // Latest (Asc) = Oldest first. 
            // Rec (Asc) = Least recommended first.

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        // Special handling for Default state if needed, but the toggle handles it.
        // NOTE: For 'latest', user expects Newest First by default.
        // My initial state is 'desc'. So 'latest' + 'desc' = Newest First.
        // 'problem_no' + 'desc' = Highest ID first. That works.

        return result;
    }, [initialPosts, search, sortBy, sortOrder, selectedTiers, selectedSources, stepRange]);

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
