import Link from 'next/link';
import SearchInput from './SearchInput';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.leftGroup}>
                <Link href="/" className={`${styles.logo} text-gradient`}>
                    specidiee
                </Link>
                <SearchInput />
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
