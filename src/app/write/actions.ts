'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { revalidatePath } from 'next/cache'
import { gitCommitAndPush } from '@/lib/git'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export async function getPosts() {
    if (!fs.existsSync(POSTS_DIR)) return []
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    return files.map(file => {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
        const { data } = matter(content)
        return {
            filename: file,
            title: data.title || file,
            date: data.date
        }
    }).sort((a, b) => (new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()))
}

export async function getPost(filename: string) {
    const filePath = path.join(POSTS_DIR, filename)
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: markdownBody } = matter(content)
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
        const filePath = path.join(POSTS_DIR, safeFilename)

        const isNew = !fs.existsSync(filePath)

        fs.writeFileSync(filePath, fileContent)

        const gitMsg = isNew ? `ADD: Post ${safeFilename}` : `UPDATE: Post ${safeFilename}`
        const gitResult = await gitCommitAndPush(gitMsg, [`content/posts/${safeFilename}`])

        revalidatePath('/write')
        revalidatePath('/')

        if (!gitResult.success) {
            return { message: `Saved locally, but Git failed: ${gitResult.error}`, success: true }
        }

        return { message: 'Saved successfully', success: true }
    } catch (e: any) {
        console.error(e)
        return { message: e.message, success: false }
    }
}

export async function deletePost(filename: string) {
    try {
        const filePath = path.join(POSTS_DIR, filename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            await gitCommitAndPush(`DELETE: Post ${filename}`, [`content/posts/${filename}`])
            revalidatePath('/write')
            revalidatePath('/')
        }
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false }
    }
}
