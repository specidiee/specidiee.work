'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import styles from './Settings.module.css';

export default function SettingsPage() {
    const [syncing, setSyncing] = useState(false);
    const { showToast } = useToast();

    const handleSync = async () => {
        try {
            setSyncing(true);
            const res = await fetch('/api/gtd/settings/sync', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Sync failed');

            showToast(`Synced! Inserted: ${data.inserted}, Updated: ${data.updated}`, 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>GTD Settings</h1>
                <Link href="/gtd" className={styles.backLink}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className={styles.card}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Google Calendar Sync</h2>
                    <p className={styles.description}>
                        Connect your Google Calendar to automatically import events as Fixed Tasks.
                        Make sure you have configured your `.env.local` credentials.
                    </p>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className={styles.syncButton}
                        >
                            {syncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Other Settings</h2>
                    <p className={styles.placeholderText}>More settings coming soon...</p>
                </div>
            </div>
        </div>
    );
}
