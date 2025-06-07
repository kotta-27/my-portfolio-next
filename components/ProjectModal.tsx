'use client';
import { FC } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import styles from './ProjectModal.module.css';

interface Project {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    image: string;
    technologies: string[];
    demoLink?: string;
    githubLink?: string;
}

interface ProjectModalProps {
    project: Project;
    closeModal: () => void;
}

const ProjectModal: FC<ProjectModalProps> = ({ project, closeModal }) => {
    const { lang } = useLanguage();

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={closeModal}>
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className={styles.modalImageContainer}>
                    <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={400}
                        className={styles.modalImage}
                    />
                </div>
                <div className={styles.modalBody}>
                    <h2 className={styles.modalTitle}>{project.title}</h2>
                    <p className={styles.modalDescription}>{project.fullDescription}</p>
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