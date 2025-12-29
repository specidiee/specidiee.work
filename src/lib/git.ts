import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function gitCommitAndPush(message: string, files: string[] = ['.']) {
    try {
        const quotedFiles = files.map(f => `"${f.replace(/"/g, '\\"')}"`).join(' ')
        console.log(`Git: Adding files: ${quotedFiles}`)
        await execAsync(`git add ${quotedFiles}`)

        const safeMessage = message.replace(/"/g, '\\"')
        console.log(`Git: Committing with message: "${safeMessage}"`)
        await execAsync(`git commit -m "${safeMessage}"`)

        console.log('Git: Pushing...')
        await execAsync('git push')

        console.log('Git operation successful')
        return { success: true }
    } catch (error: any) {
        console.error('Git operation failed:', error)
        return { success: false, error: error.message }
    }
}
