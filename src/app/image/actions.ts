'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { gitCommitAndPush } from '@/lib/git'

const IMAGE_DIR = path.join(process.cwd(), 'public/images')

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

        // Add extension if missing?
        // Actually, we should probably keep the original extension or require user to type it?
        // User said "uploading file name should be namable". Usually implies the base name.
        // I'll take the extension from the file.name and append it if the user didn't provide one matching the type.
        // Or just trust the user provided filename is the full name.
        // Let's assume user provides "my-image" and we append extension, or user provides "my-image.jpg".
        // Safer to use original extension.

        const ext = path.extname(file.name)
        let finalFilename = filename
        if (!filename.endsWith(ext)) {
            finalFilename = filename + ext
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filePath = path.join(IMAGE_DIR, finalFilename)

        fs.writeFileSync(filePath, buffer)

        // Git sync
        const gitResult = await gitCommitAndPush(`ADD: Image ${finalFilename}`, [`public/images/${finalFilename}`])

        revalidatePath('/image')

        if (!gitResult.success) {
            return { message: `Saved locally, but Git failed: ${gitResult.error}` }
        }

        return { message: 'Upload successful', success: true }
    } catch (e: any) {
        console.error(e)
        return { message: `Upload failed: ${e.message}` }
    }
}

export async function deleteImage(formData: FormData) {
    const filename = formData.get('filename') as string
    if (!filename) return

    try {
        const filePath = path.join(IMAGE_DIR, filename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            await gitCommitAndPush(`DELETE: Image ${filename}`, [`public/images/${filename}`])
            revalidatePath('/image')
        }
    } catch (e) {
        console.error('Delete failed:', e)
    }
}
