import { ReactNode } from 'react';
import styles from './Callout.module.css';

type Props = {
    type?: 'info' | 'warning' | 'danger';
    title?: string;
    children: ReactNode;
};

export default function Callout({ type = 'info', title, children }: Props) {
    return (
        <div className={`${styles.container} ${styles[type]}`}>
            <div className={styles.icon}>
                {type === 'info' && 'ⓘ'}
                {type === 'warning' && '⚠'}
                {type === 'danger' && '☠'}
            </div>
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    );
}
