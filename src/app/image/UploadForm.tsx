'use client'

import { useActionState, useEffect, useRef } from 'react'
import { uploadImage } from './actions'
import styles from './page.module.css'

const initialState = {
    message: '',
    success: false
}

export default function UploadForm() {
    const [state, formAction, isPending] = useActionState(uploadImage, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success && formRef.current) {
            formRef.current.reset()
        }
    }, [state?.success])

    return (
        <div className={styles.uploadSection}>
            <form ref={formRef} action={formAction} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Image File</label>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Filename (without extension)</label>
                    <input
                        type="text"
                        name="filename"
                        placeholder="e.g. my-post-thumbnail"
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" disabled={isPending} className={styles.button}>
                    {isPending ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {state?.message && (
                <p style={{ color: state.success ? '#4caf50' : '#ff4444', marginTop: '1rem' }}>
                    {state.message}
                </p>
            )}
        </div>
    )
}
