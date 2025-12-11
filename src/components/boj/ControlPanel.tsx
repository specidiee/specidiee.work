'use client';

import React, { useState } from 'react';
import styles from './ControlPanel.module.css';

// Icons are defined locally below to avoid dependencies

export type SortOption = 'latest' | 'problem_no' | 'title' | 'difficulty' | 'step' | 'recommendation';
export type SortOrder = 'asc' | 'desc';

type Props = {
    search: string;
    onSearchChange: (val: string) => void;
    sortBy: SortOption;
    onSortChange: (val: SortOption) => void;
    sortOrder: SortOrder;
    onSortOrderChange: (val: SortOrder) => void;

    selectedTiers: string[];
    onToggleTier: (tier: string) => void;
    selectedSources: string[];
    onToggleSource: (source: string) => void;
    stepRange: [number, number];
    onStepRangeChange: (range: [number, number]) => void;
};

const TIERS = [
    { id: 'b', label: 'Bronze', color: '#cd7f32' },
    { id: 's', label: 'Silver', color: '#435f7a' },
    { id: 'g', label: 'Gold', color: '#ec9a00' },
    { id: 'p', label: 'Platinum', color: '#27e2a4' },
    { id: 'd', label: 'Diamond', color: '#00b4fc' },
    { id: 'r', label: 'Ruby', color: '#ff0062' },
];

const SOURCES = [
    { id: 'c', label: 'CLASS' },
    { id: 's', label: 'BOJ Step' },
    { id: 'k', label: 'kks227' },
    { id: 'l', label: 'Lemonade255' },
    { id: 'b', label: 'BarkingDog' },
];

// Icons
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

const SortAscIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5h10M11 9h7M11 13h4" />
        <path d="M3 17l3 3 3-3M6 18V4" />
    </svg>
);

const SortDescIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5h4M11 9h7M11 13h10" />
        <path d="M3 17l3 3 3-3M6 18V4" />
    </svg>
)

// Use simpler arrow for order toggle
const ArrowUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>;
const ArrowDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>;


export default function ControlPanel({
    search,
    onSearchChange,
    sortBy,
    onSortChange,
    sortOrder,
    onSortOrderChange,
    selectedTiers,
    onToggleTier,
    selectedSources,
    onToggleSource,
    stepRange,
    onStepRangeChange
}: Props) {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const activeFilterCount = selectedTiers.length + selectedSources.length + (stepRange[0] > 1 || stepRange[1] < 35 ? 1 : 0);

    return (
        <div className={styles.panel}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchIcon}>
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search title, ID, or step..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.controls}>
                    <div className={styles.selectWrapper}>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className={styles.select}
                        >
                            <option value="latest">Latest</option>
                            <option value="problem_no">ID Number</option>
                            <option value="title">Title</option>
                            <option value="difficulty">Difficulty</option>
                            <option value="step">Step</option>
                            <option value="recommendation">Recommendations</option>
                        </select>
                    </div>

                    <button
                        className={styles.iconButton}
                        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    >
                        {sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </button>

                    <button
                        className={`${styles.iconButton} ${isFilterExpanded || activeFilterCount > 0 ? styles.active : ''}`}
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        title="Toggle Filters"
                    >
                        <div className={styles.filterBadge}>
                            <FilterIcon />
                            {activeFilterCount > 0 && (
                                <span className={styles.countBadge}>{activeFilterCount}</span>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterExpanded && (
                <div className={styles.filterPanel}>
                    {/* Tiers */}
                    <div className={styles.filterGroup}>
                        <h4>Difficulty Tier</h4>
                        <div className={styles.chipGrid}>
                            {TIERS.map(tier => {
                                const isActive = selectedTiers.includes(tier.id);
                                return (
                                    <button
                                        key={tier.id}
                                        className={`${styles.chip} ${isActive ? styles.active : ''}`}
                                        onClick={() => onToggleTier(tier.id)}
                                        style={isActive ? { borderColor: tier.color, color: tier.color, background: `rgba(${parseInt(tier.color.slice(1, 3), 16)}, ${parseInt(tier.color.slice(3, 5), 16)}, ${parseInt(tier.color.slice(5, 7), 16)}, 0.15)` } : {}}
                                    >
                                        {tier.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sources */}
                    <div className={styles.filterGroup}>
                        <h4>Source</h4>
                        <div className={styles.chipGrid}>
                            {SOURCES.map(source => (
                                <button
                                    key={source.id}
                                    className={`${styles.chip} ${selectedSources.includes(source.id) ? styles.active : ''}`}
                                    onClick={() => onToggleSource(source.id)}
                                >
                                    {source.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className={styles.filterGroup}>
                        <h4>Step Range</h4>
                        <div className={styles.rangeInputs}>
                            <input
                                type="number"
                                min="1"
                                max="35"
                                value={stepRange[0]}
                                onChange={(e) => onStepRangeChange([parseInt(e.target.value) || 1, stepRange[1]])}
                                className={styles.numberInput}
                            />
                            <span className={styles.rangeSeparator}>-</span>
                            <input
                                type="number"
                                min="1"
                                max="35"
                                value={stepRange[1]}
                                onChange={(e) => onStepRangeChange([stepRange[0], parseInt(e.target.value) || 35])}
                                className={styles.numberInput}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
