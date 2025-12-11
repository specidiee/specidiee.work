export default function YouTube({ id }: { id: string }) {
    return (
        <div className="relative w-full aspect-video my-12 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_60px_rgba(0,100,255,0.2)] transition-shadow duration-500 border border-[var(--border-glass)]">
            <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
            />
        </div>
    );
}
