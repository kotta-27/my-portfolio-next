'use client';
import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../context/LanguageContext';
import styles from './ProjectModal.module.css';
import { FaGithub } from 'react-icons/fa';

interface Project {
    id: number;
    title: string;
    description: string;
    image_gif: string;
    image_png: string;
    data: {
        image: string;
        description: string;
    }[];
    technologies: string[];
    demoLink?: string;
    githubLink?: string;
    i18n?: boolean;
}

interface ProjectModalProps {
    project: Project;
    closeModal: () => void;
}

const ProjectModal: FC<ProjectModalProps> = ({ project, closeModal }) => {
    const { lang } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 改行を処理する関数
    const formatDescription = (text: string) => {
        // <br>と\nの両方で分割
        return text.replace(/<br>/g, '\n');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === (project.data.length - 1) ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? project.data.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
            if (event.key === 'ArrowLeft') {
                prevImage();
            }
            if (event.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [closeModal, nextImage, prevImage]);

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button
                    className={styles.modalClose}
                    onClick={closeModal}
                    aria-label="Close modal"
                >
                    <XMarkIcon />
                </button>
                <div className={styles.modalImageContainer}>
                    {project.data.length > 1 && (
                        <button
                            className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    <Image
                        src={project.data[currentImageIndex].image}
                        alt={`${project.title} - Image ${currentImageIndex + 1}`}
                        width={800}
                        height={400}
                        className={styles.modalImage}
                        priority
                    />
                    {project.data.length > 1 && (
                        <button
                            className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <div className={styles.modalImagePaginationContainer}>
                    {project.data.length > 1 && (
                        <div className={styles.imagePagination}>
                            {project.data.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.paginationDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalTitleContainer}>
                        <h2 className={styles.modalTitle}>{project.title}</h2>
                        {project.i18n && (
                            <div className={styles.i18n}>i18n</div>
                        )}
                    </div>
                    <div className={styles.modalDescription}>
                        {formatDescription(project.data[currentImageIndex].description)}
                    </div>
                    <div className={styles.modalTech}>
                        {project.technologies.map((tech, index) => (
                            <span key={index} className={styles.techTag}>
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className={styles.modalLinks}>
                        {project.demoLink && (
                            <a
                                href={project.demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.modalLink}
                            >
                                {lang === 'ja' ? 'デモを見る' : 'Live Demo'}
                            </a>
                        )}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.modalLink} ${styles.modalLinkSecondary}`}
                            >
                                <FaGithub className="w-8 h-8" />
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;