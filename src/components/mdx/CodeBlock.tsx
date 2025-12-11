'use client';

import React, { useState, useRef } from 'react';

import styles from './CodeBlock.module.css';

type Props = React.ComponentPropsWithoutRef<'pre'>;

export default function CodeBlock({ children, ...props }: Props) {
    const [isCopied, setIsCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const onCopy = async () => {
        if (!preRef.current) return;

        // Extract text content from the code element
        const codeElement = preRef.current.querySelector('code');
        const text = codeElement?.innerText || preRef.current.innerText;

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy logic', err);
        }
    };

    return (
        <div className={styles.container}>
            <button
                onClick={onCopy}
                className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
                aria-label="Copy code"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <pre
                ref={preRef}
                {...props}
                className={styles.pre}
            >
                {children}
            </pre>
        </div>
    );
}
