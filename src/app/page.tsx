import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import FadeInSection from '@/components/FadeInSection';

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

      <FadeInSection delay="0.2s">
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Life Events</h2>
          <div className={styles.sectionContent}>
            <ul className={styles.eventList}>
              <li className={styles.eventItem}>
                <Link href="/blog/2025-12-26" className={styles.link}>Now...</Link>
              </li>
              <li className={styles.eventItem}>
                Worked as a software engineer in <a href="https://www.samsungsds.com/en/index.html" target="_blank" rel="noopener noreferrer" className={styles.link}>Samsung SDS</a>, from January 2025 to December 2025
              </li>
              <li className={styles.eventItem}>
                Studied as an undergraduate student in <a href="https://snu.ac.kr/index.html" target="_blank" rel="noopener noreferrer" className={styles.link}>Seoul National University</a> majoring in Electrical Computer Engineering, from March 2015 to August 2024
              </li>
              <li className={styles.eventItem}>
                30th Place at Union of Clubs for Programming Contests 2022 (<a href="https://www.acmicpc.net/contest/spotboard/828" target="_blank" rel="noopener noreferrer" className={styles.link}>UCPC 2022</a>), at July 2022
              </li>
              <li className={styles.eventItem}>
                16th Place at Pokémon World Championship 2018 Korean League (<a href="https://pokemoem.com/competition/korean/26" target="_blank" rel="noopener noreferrer" className={styles.link}>WCSK 2018</a>), at May 2018
              </li>
              <li className={styles.eventItem}>
                Bronze Prize at Korean Math Olympiad Preliminaries 2011 (<a href="https://www.kmo.or.kr/board/list.html?num=3555&start=15&sort=subject%20asc&code=kmo_notice01&tcode=&key=&keyword=&cate=51" target="_blank" rel="noopener noreferrer" className={styles.link}>KMO 2011</a>), at May 2011
              </li>
            </ul>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.projectGrid}>
            <a href="https://pokemoem.com" target="_blank" rel="noopener noreferrer" className={styles.projectCard}>
              <Image
                src="/images/pokemoem.jpeg"
                alt="Pokemoem Logo"
                width={64}
                height={64}
                className={styles.projectLogo}
              />
              <h3 className={styles.projectTitle}>Pokémoem</h3>
              <p className={styles.projectDesc}>An information hub for competitive Pokémon in Korea</p>
            </a>
            <a href="https://moon-chu.com" target="_blank" rel="noopener noreferrer" className={styles.projectCard}>
              <Image
                src="/images/moon-chu.jpeg"
                alt="moon-chu Logo"
                width={64}
                height={64}
                className={styles.projectLogo}
              />
              <h3 className={styles.projectTitle}>moon-chu</h3>
              <p className={styles.projectDesc}>An AI-powered web application aiming to guide people on how to solve competitive programming problems</p>
            </a>
          </div>
        </section>
      </FadeInSection>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          I mostly write in Korean language, but I can speak English too :)
        </p>
        <p className={styles.footerText}>
          So if there is anyone interested in myself or my work,<br />please refer to my personal Github: <a href="https://github.com/specidiee" target="_blank" rel="noopener noreferrer" className={styles.link}>specidiee</a>
        </p>
        <p className={styles.footerText} style={{ marginTop: '2rem' }}>
          Thank you for visiting this website today!
        </p>
      </div>
    </main>
  );
}
