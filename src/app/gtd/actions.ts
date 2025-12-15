'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password') as string
    const correctPassword = process.env.GTD_PASSWORD

    if (!correctPassword) {
        console.error('GTD_PASSWORD is not set in environment variables')
        return { message: 'System configuration error' }
    }

    if (password === correctPassword) {
        const cookieStore = await cookies()
        // Set cookie for 30 days
        cookieStore.set('gtd_auth', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        })
        redirect('/gtd')
    } else {
        return { message: 'Incorrect password' }
    }
}
