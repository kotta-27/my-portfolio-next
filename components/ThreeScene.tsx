'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RotatingCube from './RotatingCube';
import styles from './ThreeScene.module.css';

export default function ThreeScene() {
    return (
        <div className={styles.canvasContainer}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <RotatingCube />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                />
            </Canvas>
        </div>
    );
}
