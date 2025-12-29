import { getPosts } from './actions'
import Editor from './Editor'

export const metadata = {
    title: 'Blog Editor',
}

export default async function WritePage() {
    const posts = await getPosts()
    return <Editor posts={posts} />
}
