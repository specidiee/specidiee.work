import fs from 'fs'
import path from 'path'
import UploadForm from './UploadForm'
import { deleteImage } from './actions'
import styles from './page.module.css'

export const metadata = {
    title: 'Image Manager',
}

export default async function ImagePage() {
    const imageDir = path.join(process.cwd(), 'public/images')

    // Ensure directory exists
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true })
    }

    // Get images and sort by modification time (newest first)
    const images = fs.readdirSync(imageDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(imageDir, file)).mtimeMs
        }))
        .sort((a, b) => b.time - a.time)

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Image Manager</h1>

            <UploadForm />

            <div className={styles.grid}>
                {images.map(({ name }) => (
                    <div key={name} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`/images/${name}`}
                                alt={name}
                                className={styles.image}
                                loading="lazy"
                            />
                        </div>
                        <div className={styles.meta}>
                            <span className={styles.filename} title={name}>{name}</span>
                            <form action={deleteImage}>
                                <input type="hidden" name="filename" value={name} />
                                <button
                                    type="submit"
                                    className={styles.deleteButton}
                                // Use client-side confirm? Can't easily in server action form without client component
                                // But typically okay for admin tool.
                                >
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
