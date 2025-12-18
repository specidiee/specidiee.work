'use client';

import ExcludedTimeManager from './ExcludedTimeManager';
import styles from './Dashboard.module.css'; // Reusing Dashboard styles for convenience or defining new ones

interface ExcludedTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExcludedTimeModal({ isOpen, onClose }: ExcludedTimeModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className={styles.subtitle} style={{ marginBottom: 0 }}>Configure Breaks & Sleep</h2>
                    <button onClick={onClose} className={styles.navButton}>Close</button>
                </div>
                <ExcludedTimeManager />
            </div>
        </div>
    );
}
