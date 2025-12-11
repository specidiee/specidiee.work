import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Background Stars */}
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              '--duration': `${2 + Math.random() * 3}s`
            } as any}
          />
        ))}
      </div>

      <div className={`${styles.hero} animate-float`}>
        <div className={styles.imageWrapper}>
          <div className={styles.glow}></div>
          <Image
            src="/images/space-rabbit.png"
            alt="Space Rabbit"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <h1 className={`${styles.title} text-gradient`}>
          specidiee.work
        </h1>

        <p className={styles.description}>
          Exploring the cosmos of <span className={styles.highlight}>Problem Solving</span>, <span className={styles.highlight2}>Music</span>, and <span className={styles.highlight3}>Mathematics</span>.
        </p>

        <div className={styles.actions}>
          <Link href="/blog" className={styles.button}>
            Read Blog
          </Link>
          <Link href="/projects" className={styles.button}>
            Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
