import Link from 'next/link';
import { Suspense } from 'react';
import SearchInput from './SearchInput';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.leftGroup}>
                <Link href="/" className={`${styles.logo} text-gradient`}>
                    specidiee
                </Link>
                <Suspense fallback={null}>
                    <SearchInput />
                </Suspense>
            </div>

            <div className={styles.links}>
                <Link href="/blog" className={styles.link}>
                    Blog
                </Link>
                <Link href="/projects" className={styles.link}>
                    Projects
                </Link>
            </div>
        </nav>
    );
}
