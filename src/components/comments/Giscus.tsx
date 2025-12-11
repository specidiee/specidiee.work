'use client';

import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';

export default function Comments() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full mt-10">
            <Giscus
                id="comments"
                repo="specidiee/specidiee.work" // Placeholder
                repoId="R_kgDOL..." // Placeholder
                category="Announcements"
                categoryId="DIC_kwDOL..." // Placeholder
                mapping="pathname"
                term="Welcome to my blog!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme="dark_dimmed" // Matches our cosmic theme well
                lang="en"
                loading="lazy"
            />
        </div>
    );
}
