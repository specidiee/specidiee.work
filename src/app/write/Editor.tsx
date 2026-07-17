'use client'

import { useState, useEffect, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { getPost, savePost, deletePost } from './actions'
import styles from './page.module.css'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type PostSummary = {
    filename: string
    title: string
    date: string
}

type Frontmatter = {
    title: string
    date: string
    tags: string[]
    thumbnail: string
    description: string
}

const defaultFrontmatter: Frontmatter = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    thumbnail: '',
    description: ''
}

export default function Editor({ posts: initialPosts }: { posts: PostSummary[] }) {
    const [posts, setPosts] = useState(initialPosts)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [filename, setFilename] = useState('')
    const [content, setContent] = useState('')
    const [frontmatter, setFrontmatter] = useState<Frontmatter>(defaultFrontmatter)
    const [tagsInput, setTagsInput] = useState('')
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    // Synchronize posts when parent updates (due to revalidation)
    useEffect(() => {
        setPosts(initialPosts)
    }, [initialPosts])

    const handleSelectPost = async (file: string) => {
        startTransition(async () => {
            const data = await getPost(file)
            if (data) {
                setSelectedFile(file)
                setFilename(file)
                setContent(data.content)
                setFrontmatter({ ...defaultFrontmatter, ...data.frontmatter })
                setTagsInput(data.frontmatter.tags?.join(', ') || '')
                setMessage('')
            }
        })
    }

    const handleNewPost = () => {
        setSelectedFile(null)
        setFilename('new-post.mdx')
        setContent('')
        setFrontmatter(defaultFrontmatter)
        setTagsInput('')
        setMessage('')
    }

    const handleSave = async () => {
        if (!filename) return
        startTransition(async () => {
            // Sanitize thumbnail
            let thumbnail = frontmatter.thumbnail?.trim() || ''
            if (thumbnail && !thumbnail.startsWith('/') && !thumbnail.startsWith('http')) {
                thumbnail = `/images/${thumbnail}`
            }

            // Parse inputs
            const finalFrontmatter = {
                ...frontmatter,
                thumbnail,
                tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean)
            }

            const formData = new FormData()
            formData.append('filename', filename)
            formData.append('content', content || '')
            formData.append('frontmatter', JSON.stringify(finalFrontmatter))

            const result = await savePost(null, formData)
            setMessage(result.message)
            if (result.success) {
                let newFilename = filename
                if (!newFilename.endsWith('.mdx')) newFilename += '.mdx'
                setSelectedFile(newFilename)
                setFilename(newFilename)
                // Update frontmatter state to match saved data
                setFrontmatter(finalFrontmatter)
            }
        })
    }

    const handleDelete = async () => {
        if (!selectedFile || !confirm('Are you sure you want to delete this post?')) return
        startTransition(async () => {
            const result = await deletePost(selectedFile)
            if (result.success) {
                handleNewPost()
                setMessage('Post deleted')
            }
        })
    }

    const updateFrontmatter = (key: keyof Frontmatter, value: any) => {
        setFrontmatter(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span>Posts</span>
                    <button onClick={handleNewPost} className={styles.newButton}>New Post</button>
                </div>
                <div className={styles.postList}>
                    {posts.map(post => (
                        <div
                            key={post.filename}
                            className={`${styles.postItem} ${selectedFile === post.filename ? styles.active : ''}`}
                            onClick={() => handleSelectPost(post.filename)}
                        >
                            <div className={styles.postTitle} title={post.title}>{post.title}</div>
                            <div className={styles.postDate}>{post.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.main}>
                <div className={styles.toolbar}>
                    <input
                        className={styles.filenameInput}
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Filename (e.g. my-post.mdx)"
                    />
                    <div className={styles.actions}>
                        {message && <span style={{ marginRight: '1rem', color: '#888' }}>{message}</span>}
                        {selectedFile && (
                            <button onClick={handleDelete} disabled={isPending} className={`${styles.button} ${styles.dangerButton}`}>
                                Delete
                            </button>
                        )}
                        <button onClick={handleSave} disabled={isPending} className={`${styles.button} ${styles.primaryButton}`}>
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className={styles.editorArea}>
                    <div className={styles.metaGrid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={frontmatter.title}
                                onChange={e => updateFrontmatter('title', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Date</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={frontmatter.date}
                                onChange={e => updateFrontmatter('date', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Tags (comma separated)</label>
                            <input
                                className={styles.input}
                                value={tagsInput}
                                onChange={e => setTagsInput(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Thumbnail</label>
                            <input
                                className={styles.input}
                                value={frontmatter.thumbnail || ''}
                                onChange={e => updateFrontmatter('thumbnail', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={`${styles.input} ${styles.textarea}`}
                                value={frontmatter.description || ''}
                                onChange={e => updateFrontmatter('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.markdownEditor}>
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || '')}
                            height={500}
                            previewOptions={{
                                rehypePlugins: [[rehypeKatex]],
                                remarkPlugins: [[remarkMath]],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
