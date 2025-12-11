import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getAllPosts, SimpleMetadata } from './mdx';

// Type definitions
export type BojStepData = {
    step: Record<string, Record<string, string>[]>[];
};

export type BojPost = SimpleMetadata & {
    problemId: number;
    step: number; // 0 if unclassified
    stepName: string;
    recommendations: string[];
    recommendationScore: number;
    tier: string;
    tierSort: number; // For sorting
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Lazy load data
let tagToStepMap: Map<string, number> | null = null;
let stepNames: string[] = []; // 0-indexed, but steps are 1-based.

function loadStepData() {
    if (tagToStepMap) return;

    try {
        const fileContents = fs.readFileSync(path.join(CONTENT_DIR, 'boj-step.yaml'), 'utf8');
        const doc = yaml.load(fileContents) as BojStepData;

        tagToStepMap = new Map<string, number>();
        stepNames = ['Unclassified'];

        if (doc.step && Array.isArray(doc.step)) {
            doc.step.forEach((stepObj, index) => {
                const stepNum = index + 1;
                // stepObj is { "Display Name": [ { tag: kor_name }, ... ] }
                const stepName = Object.keys(stepObj)[0];
                stepNames[stepNum] = stepName;

                const tagsList = stepObj[stepName];
                if (Array.isArray(tagsList)) {
                    tagsList.forEach(tagEntry => {
                        const tagName = Object.keys(tagEntry)[0];
                        // Map tag to step number
                        tagToStepMap!.set(tagName, stepNum);
                    });
                }
            });
        }
    } catch (e) {
        console.error("Failed to load boj-step.yaml", e);
        tagToStepMap = new Map();
    }
}

function getProblemId(title: string): number {
    // Expected format: "[백준] 10250 (ACM 호텔)" or "[BOJ] 1234 ..."
    // Match number after [names] 
    const match = title.match(/\[.*?\]\s*(\d+)/);
    if (match) return parseInt(match[1]);

    // Fallback: search for first number in title
    const match2 = title.match(/(\d+)/);
    if (match2) return parseInt(match2[1]);

    return 0;
}

function getTierSort(tags: string[] = []): { tier: string, sort: number } {
    const tiers = ['b', 's', 'g', 'p', 'd', 'r'];
    let foundTier = 'Unrated';
    let sortVal = 0;

    for (const tag of tags) {
        if (tag.startsWith('tier:')) {
            const val = tag.split(':')[1];
            if (val.length >= 2) {
                const char = val[0].toLowerCase();
                const num = parseInt(val.slice(1));

                const tierIdx = tiers.indexOf(char);
                if (tierIdx !== -1 && !isNaN(num)) {
                    foundTier = val;
                    // Formula: idx * 5 + (6 - num)
                    // b5 -> 0*5 + 1 = 1
                    // b1 -> 0*5 + 5 = 5
                    // s5 -> 1*5 + 1 = 6
                    sortVal = (tierIdx * 5) + (6 - num);
                    break;
                }
            }
        }
    }
    return { tier: foundTier, sort: sortVal };
}

export function getAllBojPosts(): BojPost[] {
    const allPosts = getAllPosts();
    // Filter for BOJ tag. Case sensitive? Usually "BOJ".
    const bojPosts = allPosts.filter(p => p.meta.tags?.includes('BOJ'));

    loadStepData();

    return bojPosts.map(post => {
        const problemId = getProblemId(post.meta.title);
        const tags = post.meta.tags || [];

        // Calculate Step
        let maxStep = 0;
        tags.forEach(t => {
            const s = tagToStepMap?.get(t);
            if (s && s > maxStep) {
                maxStep = s;
            }
        });

        // Recommendations from metadata
        const recs = post.meta.recommendations || [];

        // Tier
        const { tier, sort } = getTierSort(tags);

        return {
            ...post.meta,
            slug: post.slug,
            problemId,
            step: maxStep,
            stepName: stepNames[maxStep] || 'Unclassified',
            recommendations: recs,
            recommendationScore: recs.length,
            tier,
            tierSort: sort
        };
    });
}
