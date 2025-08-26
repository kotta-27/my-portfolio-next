'use client';

export default function BlogPage() {
    return (
        <section className="blog-section">
            <h1>Blog</h1>
            <p>Coming soon...</p>
            <style jsx>{`
                .blog-section {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    color: #ffffff;
                }
                p {
                    font-size: 1.2rem;
                    color: #e0e0e0;
                }
            `}</style>
        </section>
    );
}
