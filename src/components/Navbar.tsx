import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={`${styles.logo} text-gradient`}>
                specidiee
            </Link>

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
