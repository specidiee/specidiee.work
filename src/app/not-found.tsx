import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className="stars"></div>

            <h1 className={styles.code}>404</h1>

            <div className={`${styles.content} animate-float`}>
                <h2 className={`${styles.title} text-gradient`}>Lost in the Void?</h2>
                <p className={styles.description}>
                    The transmission you are looking for does not exist in this sector.
                </p>

                <Link href="/" className={styles.button}>
                    Return to Base
                </Link>
            </div>
        </div>
    );
}
