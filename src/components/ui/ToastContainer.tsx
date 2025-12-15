'use client';

import React from 'react';
import { Toast } from '@/contexts/ToastContext';
import styles from './ToastContainer.module.css';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.container}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.type]}`}
                    onClick={() => onRemove(toast.id)}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
