'use client';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';
import styles from './MorphingAnimation.module.css';

export default function MorphingAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const initialBlocksRef = useRef<HTMLDivElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);
    const finalBlocksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeline = gsap.timeline({
            delay: 3, // タイピングアニメーション後に開始
        });

        // 初期ブロックを中央に集める
        timeline.to('.initialBlock', {
            duration: 1,
            y: '50%',
            x: '50%',
            scale: 0.8,
            opacity: 0.8,
            stagger: 0.2,
            ease: "power2.inOut",
        });

        // 球体を表示
        timeline.to(sphereRef.current, {
            duration: 0.5,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
        }, "-=0.3");

        // 初期ブロックを非表示
        timeline.to('.initialBlock', {
            duration: 0.3,
            opacity: 0,
            scale: 0,
        }, "-=0.2");

        // 球体を回転
        timeline.to(sphereRef.current, {
            duration: 1,
            rotate: 360,
            ease: "power2.inOut",
        });

        // 最終ブロックを表示
        timeline.to('.finalBlock', {
            duration: 0.8,
            scale: 1,
            opacity: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
        });

        // 球体を非表示
        timeline.to(sphereRef.current, {
            duration: 0.3,
            opacity: 0,
            scale: 0,
        }, "-=0.5");

    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <div ref={initialBlocksRef} className={styles.blocksContainer}>
                <div className={`${styles.block} ${styles.blockBlue} initialBlock`}>
                    Web Developer
                </div>
                <div className={`${styles.block} ${styles.blockGreen} initialBlock`}>
                    Quantum Computing
                </div>
            </div>

            <div ref={sphereRef} className={styles.sphere} />

            <div ref={finalBlocksRef} className={styles.blocksContainer}>
                <div className={`${styles.block} ${styles.blockPurple} finalBlock`}>
                    About
                </div>
                <div className={`${styles.block} ${styles.blockOrange} finalBlock`}>
                    Works
                </div>
                <div className={`${styles.block} ${styles.blockCyan} finalBlock`}>
                    Outputs
                </div>
            </div>
        </div>
    );
}
