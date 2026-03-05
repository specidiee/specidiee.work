import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPostSlugs, getInteractivePostBySlug, getInteractivePostSlugs } from '@/lib/mdx';
import { getPdfPostBySlug, getPdfSlugs } from '@/lib/pdf';
import CasualLayout from '@/components/layouts/CasualLayout';
import CommentSystem from '@/components/comments/CommentSystem';
import PDFViewer from '@/components/pdf/PDFViewerDynamic';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import YouTube from '@/components/mdx/YouTube';
import Callout from '@/components/mdx/Callout';
import CodeBlock from '@/components/mdx/CodeBlock';
import { interactiveComponents } from '@content/interactive/index';

import type { Metadata } from 'next';

// Params type for Next.js 15
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    let post = getPostBySlug(slug);

    // Try interactive post if MDX not found
    if (!post) {
        const interactivePost = getInteractivePostBySlug(slug);
        if (interactivePost) {
            post = { slug: interactivePost.slug, meta: interactivePost.meta, content: '' };
        }
    }

    // Try PDF post
    if (!post) {
        const pdfPost = getPdfPostBySlug(slug);
        if (pdfPost) {
            post = { slug: pdfPost.slug, meta: pdfPost.meta, content: '' };
        }
    }

    if (!post) {
        return {};
    }

    const { title, description, thumbnail, date } = post.meta;
    const ogImage = thumbnail || '/og-image.jpg';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: date,
            url: `https://specidiee.work/blog/${slug}`,
            siteName: 'specidiee.work',
            locale: 'ko_KR',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export async function generateStaticParams() {
    const mdxSlugs = getPostSlugs();
    const interactiveSlugs = getInteractivePostSlugs();
    const pdfSlugs = getPdfSlugs();

    const allParams = [
        ...mdxSlugs.map((file) => ({
            slug: file.replace(/\.mdx?$/, ''),
        })),
        ...interactiveSlugs.map((slug) => ({ slug })),
        ...pdfSlugs.map((slug) => ({ slug })),
    ];

    return allParams;
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const mdxPost = getPostBySlug(slug);

    // Try MDX post first
    if (mdxPost) {
        const { meta, content } = mdxPost;

        const mdxOptions = {
            remarkPlugins: [remarkMath, remarkGfm],
            rehypePlugins: [
                rehypeKatex,
                [rehypePrettyCode, {
                    theme: 'github-dark',
                    keepBackground: true,
                }]
            ],
        };

        return (
            <main className="min-h-screen bg-[var(--bg-space)]">
                <CasualLayout meta={meta}>
                    <MDXRemote
                        source={content}
                        options={{ parseFrontmatter: true, mdxOptions: mdxOptions as any }}
                        components={{
                            // Custom components can be added here
                            pre: CodeBlock, // For copy button
                            YouTube,
                            Youtube: YouTube,
                            Callout,
                        }}
                    />
                    <CommentSystem postSlug={slug} postTitle={meta.title} />
                </CasualLayout>
            </main>
        );
    }

    // Try interactive component
    const interactivePost = getInteractivePostBySlug(slug);
    if (interactivePost) {
        // Get component from registry
        const Component = interactiveComponents[slug];

        return (
            <main className="min-h-screen bg-[var(--bg-space)]">
                <CasualLayout meta={interactivePost.meta}>
                    <Component />
                    <CommentSystem postSlug={slug} postTitle={interactivePost.meta.title} />
                </CasualLayout>
            </main>
        );
    }

    // Try PDF post
    const pdfPost = getPdfPostBySlug(slug);
    if (pdfPost) {
        return (
            <main className="min-h-screen bg-[var(--bg-space)]">
                <CasualLayout meta={pdfPost.meta}>
                    <PDFViewer pdfUrl={pdfPost.pdfUrl} />
                    <CommentSystem postSlug={slug} postTitle={pdfPost.meta.title} />
                </CasualLayout>
            </main>
        );
    }

    notFound();
}
