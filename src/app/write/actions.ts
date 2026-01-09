'use server'

import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { uploadFileToGitHub, deleteFileFromGitHub, getFileFromGitHub, listDirectoryFromGitHub } from '@/lib/github'

const POSTS_PATH = 'content/posts'

export async function getPosts() {
    const result = await listDirectoryFromGitHub(POSTS_PATH)
    if (!result.success || !result.files) return []

    const posts = await Promise.all(result.files.map(async (file: any) => {
        if (!file.name.endsWith('.mdx') && !file.name.endsWith('.md')) return null

        try {
            const fileResult = await getFileFromGitHub(file.path)
            if (!fileResult.success || !fileResult.content) return null

            const { data } = matter(fileResult.content)
            return {
                filename: file.name,
                title: data.title || file.name,
                date: data.date
            }
        } catch (e) {
            console.error(`Error reading post ${file.name}:`, e)
            return null
        }
    }))

    return posts
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .sort((a, b) => (new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()))
}

export async function getPost(filename: string) {
    const filePath = `${POSTS_PATH}/${filename}`
    const result = await getFileFromGitHub(filePath)

    if (!result.success || !result.content) return null

    const { data, content: markdownBody } = matter(result.content)
    return {
        frontmatter: data,
        content: markdownBody
    }
}

export async function savePost(prevState: any, formData: FormData) {
    try {
        const filename = formData.get('filename') as string
        const content = formData.get('content') as string
        const frontmatterJson = formData.get('frontmatter') as string

        if (!filename) return { message: 'Filename required', success: false }

        let frontmatter = {}
        try {
            frontmatter = JSON.parse(frontmatterJson)
        } catch {
            return { message: 'Invalid frontmatter data', success: false }
        }

        // Ensure filename ends with .mdx
        let safeFilename = filename
        if (!safeFilename.endsWith('.mdx')) safeFilename += '.mdx'

        const fileContent = matter.stringify(content, frontmatter)
        const filePath = `${POSTS_PATH}/${safeFilename}`

        const isNewResult = await getFileFromGitHub(filePath)
        const isNew = !isNewResult.success

        const gitMsg = isNew ? `ADD: Post ${safeFilename} via Blog Editor` : `UPDATE: Post ${safeFilename} via Blog Editor`
        const result = await uploadFileToGitHub(filePath, fileContent, gitMsg)

        revalidatePath('/write')
        revalidatePath('/')

        if (!result.success) {
            return { message: `Save failed: ${result.error}`, success: false }
        }

        return { message: 'Saved successfully', success: true }
    } catch (e: any) {
        console.error(e)
        return { message: e.message, success: false }
    }
}

export async function deletePost(filename: string) {
    try {
        const filePath = `${POSTS_PATH}/${filename}`
        const result = await deleteFileFromGitHub(filePath, `DELETE: Post ${filename} via Blog Editor`)

        if (result.success) {
            revalidatePath('/write')
            revalidatePath('/')
        }
        return { success: result.success }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}
