'use server'

import { revalidatePath } from 'next/cache'
import { uploadFileToGitHub, deleteFileFromGitHub } from '@/lib/github'

export async function uploadImage(prevState: any, formData: FormData) {
    try {
        const file = formData.get('file') as File
        const filename = formData.get('filename') as string

        if (!file || file.size === 0) {
            return { message: 'No file selected' }
        }

        if (!filename) {
            return { message: 'Filename is required' }
        }

        // Validate filename (alphanumeric, -, _)
        if (!/^[a-zA-Z0-9-_.]+$/.test(filename)) {
            return { message: 'Invalid filename. Use only letters, numbers, -, _, .' }
        }

        const ext = file.name.split('.').pop()
        let finalFilename = filename
        if (ext && !filename.toLowerCase().endsWith(`.${ext.toLowerCase()}`)) {
            finalFilename = `${filename}.${ext}`
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const githubPath = `public/images/${finalFilename}`

        const result = await uploadFileToGitHub(
            githubPath,
            buffer,
            `ADD: Image ${finalFilename} via Image Manager`
        )

        revalidatePath('/image')

        if (!result.success) {
            return { message: `Upload failed: ${result.error}` }
        }

        return { message: 'Upload successful. It may take a minute to appear on the site.', success: true }
    } catch (e: any) {
        console.error(e)
        return { message: `Upload failed: ${e.message}` }
    }
}

export async function deleteImage(formData: FormData) {
    const filename = formData.get('filename') as string
    if (!filename) return

    try {
        const githubPath = `public/images/${filename}`
        const result = await deleteFileFromGitHub(
            githubPath,
            `DELETE: Image ${filename} via Image Manager`
        )

        if (result.success) {
            revalidatePath('/image')
        } else {
            console.error('Delete failed:', result.error)
        }
    } catch (e) {
        console.error('Delete failed:', e)
    }
}
