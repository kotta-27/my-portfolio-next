'use client';
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import terminal from '../data/terminal.json';
import styles from './About.module.css';

export default function About() {
    const { lang } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);

    // 初期化時のみコマンドを設定
    const commands = useMemo(() => terminal.en.commands, []);

    // 現在の言語に応じたコマンド出力を取得
    const getCommandOutput = useCallback((index: number) => {
        return terminal[lang].commands[index].output;
    }, [lang]);

    const [displayedCommands, setDisplayedCommands] = useState<string[]>(() => new Array(commands.length).fill(""));
    const [showOutputs, setShowOutputs] = useState<boolean[]>(() => new Array(commands.length).fill(false));
    const [showCareerAndAchievements, setShowCareerAndAchievements] = useState(false);
    const [loadingStates, setLoadingStates] = useState<{ loading: boolean; done: boolean }>({ loading: false, done: false });

    const startCommandTyping = useCallback((commandIndex: number) => {
        let i = 0;
        const command = `$ ${commands[commandIndex].cmd}`;
        const commandTimer = setInterval(() => {
            setDisplayedCommands(prev => {
                const newCommands = [...prev];
                newCommands[commandIndex] = command.slice(0, i + 1);
                return newCommands;
            });
            i++;
            if (i === command.length) {
                clearInterval(commandTimer);
                setTimeout(() => {
                    setShowOutputs(prev => {
                        const newOutputs = [...prev];
                        newOutputs[commandIndex] = true;
                        return newOutputs;
                    });
                    if (commands[commandIndex].cmd === "show career and achievements") {
                        setLoadingStates({ loading: true, done: false });
                        setShowOutputs(prev => {
                            const newOutputs = [...prev];
                            newOutputs[commandIndex] = true;
                            return newOutputs;
                        });

                        // 1秒後に完了メッセージを表示
                        setTimeout(() => {
                            setLoadingStates({ loading: true, done: true });
                            // さらに0.5秒後にセクションを表示
                            setTimeout(() => {
                                setShowCareerAndAchievements(true);
                            }, 500);
                        }, 1000);
                    } else if (commandIndex < commands.length - 1) {
                        setTimeout(() => startCommandTyping(commandIndex + 1), 800);
                    }
                }, 300);
            }
        }, 100);
    }, [commands]);

    useEffect(() => {
        startCommandTyping(0);
    }, [startCommandTyping]);

    return (
        <section ref={sectionRef} className={styles.aboutSection} id="about">
            <div className={styles.sectionTitleContainer}>
                <h2 className={styles.sectionTitle}>About</h2>
            </div>
            <div className={styles.aboutContainer}>
                <div className={styles.terminalContent}>
                    <div className={styles.terminalHeader}>
                        <div className={styles.terminalButtons}>
                            <div className={`${styles.terminalButton} ${styles.terminalButtonClose}`} />
                            <div className={`${styles.terminalButton} ${styles.terminalButtonMinimize}`} />
                            <div className={`${styles.terminalButton} ${styles.terminalButtonZoom}`} />
                        </div>
                        <div className={styles.terminalTitle}>my-portfolio</div>
                    </div>
                    <div className={styles.terminalBody}>
                        {commands.map((command, index) => (
                            <div key={index} className={styles.commandBlock}>
                                <div className={styles.commandLine}>
                                    <span className={styles.commandText}>
                                        {displayedCommands[index]}
                                        {displayedCommands[index].length > 0 &&
                                            displayedCommands[index].length < `$ ${command.cmd}`.length && (
                                                <span className={styles.cursor} />
                                            )}
                                    </span>
                                </div>
                                {showOutputs[index] && (
                                    <div className={styles.commandOutput}>
                                        {command.cmd === "show career and achievements" ? (
                                            <>
                                                <div>{getCommandOutput(index).split('\n')[0]}</div>
                                                {loadingStates.done && <div>{getCommandOutput(index).split('\n')[1]}</div>}
                                            </>
                                        ) : (
                                            getCommandOutput(index).split('\n').map((line, i) => {
                                                const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                                                if (linkMatch) {
                                                    const [fullMatch, text, url] = linkMatch;
                                                    const parts = line.split(fullMatch);
                                                    return (
                                                        <div key={i}>
                                                            {parts[0]}
                                                            <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
                                                            {parts[1]}
                                                        </div>
                                                    );
                                                }
                                                return <div key={i}>{line}</div>;
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {showCareerAndAchievements && (
                    <>
                        <div className={`${styles.careerSection} ${styles.fadeIn}`}>
                            <div className={styles.subSectionTitleContainer}>
                                <h3 className={styles.subSectionTitle}>{lang === 'ja' ? '経歴' : 'Career'}</h3>
                            </div>
                            <div className={styles.timelineWrapper}>
                                <div className={styles.timelineList}>
                                    {careers[lang].map((career, idx) => (
                                        career['period-bar'] ? (
                                            <div key={idx} className={styles.timelinePeriodBar}>
                                                <div className={styles.timelineBarContainer}>
                                                    <div className={styles.timelineLine} />
                                                    <div className={styles.timelinePeriodContainer}>
                                                        <div className={styles.timelinePeriodText}>{career['period-bar']}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <React.Fragment key={idx}>
                                                <li
                                                    className={styles.timelineItem}
                                                >
                                                    <div className={styles.timelineDotContainer}>
                                                        <div className={styles.timelineLine} />
                                                        <div className={styles.timelineDot} />
                                                    </div>
                                                    <div className={styles.timelineContent}>
                                                        <div className={styles.timelineContentLeft}>
                                                            <div className={styles.timelinePeriod}>{career.period}</div>
                                                            <div className={styles.timelineTitle}>{career.title}</div>
                                                        </div>
                                                        {career.image && <Image src={career.image} alt={career.title}
                                                            width={100} height={100} className={styles.timelineImage} />}
                                                    </div>
                                                </li>
                                            </React.Fragment>
                                        )))}
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.achievementsSection} ${styles.fadeIn}`}>
                            <div className={styles.subSectionTitleContainer}>
                                <h3 className={styles.subSectionTitle}>{lang === 'ja' ? '実績' : 'Achievements'}</h3>
                            </div>
                            <div className={styles.list}>
                                {achievements[lang].map((ach, idx) => (
                                    <div key={idx} className={`${styles.listItem} ${styles.achievementCard}`}>
                                        <span style={{ fontStyle: 'italic' }}>{ach.period}：</span> {ach.title}
                                        {ach.award && (
                                            <>
                                                <br />
                                                <span style={{ color: '#facc15', fontWeight: 'bold' }}>{ach.award.title}</span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}