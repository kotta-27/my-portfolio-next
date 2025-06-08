'use client';
import { FC, useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import projectsData from '../data/projects.json';
import { useLanguage } from '../context/LanguageContext';
import styles from './Projects.module.css';

const Projects: FC = () => {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const { lang } = useLanguage();

    const openModal = (projectId: number) => {
        setSelectedProject(projectId);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <section id="projects" className={styles.projects}>
            <div className={styles.sectionTitleContainer}>
                <h2 className={styles.sectionTitle}>My Works</h2>
            </div>
            <div className={styles.grid}>
                {projectsData[lang].map((project) => (
                    <ProjectCard key={project.id} project={project} openModal={openModal} />
                ))}
            </div>
            {selectedProject !== null && (
                <ProjectModal
                    project={projectsData[lang].find(p => p.id === selectedProject)!}
                    closeModal={closeModal}
                />
            )}
        </section>
    );
};

export default Projects; 