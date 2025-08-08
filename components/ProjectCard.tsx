'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import styles from './ProjectCard.module.css';
import {
    SiReact,
    SiVuedotjs,
    SiRubyonrails,
    SiPython,
    SiFirebase,
    SiDiscord,
    SiVercel,
    SiRemix,
    SiLatex,
    SiQiskit,
    SiPostgresql
} from 'react-icons/si';
import { RiGeminiFill } from "react-icons/ri";
import { FaAws } from 'react-icons/fa6';

interface Project {
    id: number;
    title: string;
    description: string;
    image_png: string;
    image_gif: string;
    data: {
        image: string;
        description: string;
    }[];
    technologies: string[];
    demoLink?: string;
    githubLink?: string;
    i18n?: boolean;
}

interface ProjectCardProps {
    project: Project;
    openModal: (id: number) => void;
}

const getTechnologyIcon = (tech: string) => {
    switch (tech.toLowerCase()) {
        case 'react':
            return <SiReact className={styles.techIcon} title="React" />;
        case 'vue.js':
            return <SiVuedotjs className={styles.techIcon} title="Vue.js" />;
        case 'ruby on rails':
            return <SiRubyonrails className={styles.techIcon} title="Ruby on Rails" />;
        case 'python':
            return <SiPython className={styles.techIcon} title="Python" />;
        case 'firebase':
            return <SiFirebase className={styles.techIcon} title="Firebase" />;
        case 'discord api':
            return <SiDiscord className={styles.techIcon} title="Discord API" />;
        case 'aws':
            return <FaAws className={styles.techIcon} title="AWS" />;
        case 'aws bedrock':
            return <FaAws className={styles.techIcon} title="AWS Bedrock" />;
        case 'aws cognito':
            return <FaAws className={styles.techIcon} title="AWS Cognito" />;
        case 'gemini':
            return <RiGeminiFill className={styles.techIcon} title="Gemini" />;
        case 'vercel':
            return <SiVercel className={styles.techIcon} title="Vercel" />;
        case 'remix':
            return <SiRemix className={styles.techIcon} title="Remix" />;
        case 'latex':
            return <SiLatex className={styles.techIcon} title="LaTeX" />;
        case 'quantum computing':
            return <SiQiskit className={styles.techIcon} title="Quantum Computing" />;
        case 'postgresql':
            return <SiPostgresql className={styles.techIcon} title="PostgreSQL" />;
        default:
            return null;
    }
};

const ProjectCard: FC<ProjectCardProps> = ({ project, openModal }) => {
    const { lang } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);

    // GIF画像のパスを生成
    const getImagePath = (isHovered: boolean) => {
        if (!isHovered) {
            return project.image_png;
        }
        return project.image_gif;
    };

    return (
        <div
            className={styles.projectCard}
            onClick={() => openModal(project.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.projectCardImageContainer}>
                <Image
                    src={getImagePath(isHovered)}
                    alt={project.title}
                    width={400}
                    height={200}
                    className={styles.projectThumb}
                    priority={true}
                />
            </div>
            <div className={styles.projectContent}>
                <div className={styles.projectTitleContainer}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    {project.i18n && (
                        <div className={styles.i18n}>i18n</div>
                    )}
                </div>
                <p className={styles.projectDesc}>{project.description}</p>
                <div className={styles.techStack}>
                    {project.technologies.map((tech, index) => (
                        <div key={index} className={styles.techIconWrapper}>
                            {getTechnologyIcon(tech)}
                        </div>
                    ))}
                </div>
                {project.demoLink && (
                    <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {lang === 'ja' ? 'プロジェクトを見る →' : 'View Project →'}
                    </a>
                )}
            </div>
        </div >
    );
};

export default ProjectCard; 