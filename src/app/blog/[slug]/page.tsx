import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import CasualLayout from '@/components/layouts/CasualLayout';
import Comments from '@/components/comments/Giscus';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import YouTube from '@/components/mdx/YouTube';
import Callout from '@/components/mdx/Callout';

import type { Metadata } from 'next';

// Params type for Next.js 15
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

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
            images: [
                {
                    url: ogImage,
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
    const slugs = getPostSlugs();
    return slugs.map((file) => ({
        slug: file.replace(/\.mdx?$/, ''),
    }));
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const { meta, content } = post;

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
                        // pre: CustomPre, // For copy button
                        YouTube,
                        Callout,
                    }}
                />
                <Comments />
            </CasualLayout>
        </main>
    );
}
