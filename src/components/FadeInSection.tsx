"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';
import styles from './FadeInSection.module.css';

interface FadeInSectionProps {
    children: ReactNode;
    delay?: string;
}

export default function FadeInSection({ children, delay = '0s' }: FadeInSectionProps) {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            });
        });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            className={`${styles.fadeInSection} ${isVisible ? styles.isVisible : ''}`}
            style={{ transitionDelay: delay }}
            ref={domRef}
        >
            {children}
        </div>
    );
}
