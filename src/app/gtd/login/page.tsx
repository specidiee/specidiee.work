'use client'

import { useActionState } from 'react'
import { login } from '../actions'
import styles from './page.module.css'

const initialState = {
    message: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>GTD Login</h1>
                <p className={styles.description}>Please enter the password to access GTD.</p>

                <form action={formAction} className={styles.form}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" disabled={isPending} className={styles.button}>
                        {isPending ? 'Verifying...' : 'Access'}
                    </button>

                    {state?.message && (
                        <p className={styles.error}>{state.message}</p>
                    )}
                </form>
            </div>
        </div>
    )
}
