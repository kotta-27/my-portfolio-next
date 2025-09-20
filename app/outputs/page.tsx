'use client';
import ThreeScene from '../../components/ThreeScene';
import styles from './page.module.css';

export default function Outputs() {
    return (
        <div className={styles.container}>
            <div className={styles.threeContainer}>
                <ThreeScene />
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>Outputs</h1>
                {/* ここに他のコンテンツを追加 */}
            </div>
        </div>
    );
}