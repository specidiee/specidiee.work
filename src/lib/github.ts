import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
})

const OWNER = process.env.GITHUB_OWNER || ''
const REPO = process.env.GITHUB_REPO || ''

export async function uploadFileToGitHub(
    path: string,
    content: Buffer | string,
    message: string
) {
    if (!OWNER || !REPO || !process.env.GITHUB_TOKEN) {
        throw new Error('Missing GitHub configuration (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)')
    }

    try {
        // Check if file exists to get SHA
        let sha: string | undefined
        try {
            const { data } = await octokit.repos.getContent({
                owner: OWNER,
                repo: REPO,
                path,
            })
            if (!Array.isArray(data) && data.sha) {
                sha = data.sha
            }
        } catch (e: any) {
            if (e.status !== 404) {
                throw e
            }
            // File doesn't exist, which is fine
        }

        const contentBase64 = Buffer.isBuffer(content)
            ? content.toString('base64')
            : Buffer.from(content).toString('base64')

        await octokit.repos.createOrUpdateFileContents({
            owner: OWNER,
            repo: REPO,
            path,
            message,
            content: contentBase64,
            sha,
        })

        return { success: true }
    } catch (e: any) {
        console.error('GitHub Upload Error:', e)
        return { success: false, error: e.message }
    }
}

export async function deleteFileFromGitHub(path: string, message: string) {
    if (!OWNER || !REPO || !process.env.GITHUB_TOKEN) {
        throw new Error('Missing GitHub configuration')
    }

    try {
        const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path,
        })

        if (Array.isArray(data) || !data.sha) {
            throw new Error('Path is a directory or invalid')
        }

        await octokit.repos.deleteFile({
            owner: OWNER,
            repo: REPO,
            path,
            message,
            sha: data.sha,
        })

        return { success: true }
    } catch (e: any) {
        if (e.status === 404) {
            return { success: true } // Already deleted/doesn't exist
        }
        console.error('GitHub Delete Error:', e)
        return { success: false, error: e.message }
    }
}

export async function getFileFromGitHub(path: string) {
    if (!OWNER || !REPO || !process.env.GITHUB_TOKEN) {
        throw new Error('Missing GitHub configuration')
    }

    try {
        const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path,
        })

        if (!Array.isArray(data) && data.type === 'file' && data.content) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8')
            return { success: true, content, sha: data.sha }
        }
        throw new Error('Path is not a file or has no content')
    } catch (e: any) {
        console.error('GitHub Get Error:', e)
        return { success: false, error: e.message }
    }
}

export async function listDirectoryFromGitHub(path: string) {
    if (!OWNER || !REPO || !process.env.GITHUB_TOKEN) {
        throw new Error('Missing GitHub configuration')
    }

    try {
        const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path,
        })

        if (Array.isArray(data)) {
            return { success: true, files: data }
        }
        return { success: true, files: [] }
    } catch (e: any) {
        if (e.status === 404) return { success: true, files: [] }
        console.error('GitHub List Error:', e)
        return { success: false, error: e.message }
    }
}
