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
                repo="specidiee/specidiee.work"
                repoId="R_kgDOQm21uw"
                category="Announcements"
                categoryId="DIC_kwDOQm21u84CzqXp"
                mapping="pathname"
                term="Welcome to my blog!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="dark_dimmed"
                lang="ko"
                loading="lazy"
            />
        </div>
    );
}
