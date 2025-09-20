'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

export default function RotatingCube() {
    const meshRef = useRef<THREE.Mesh>(null);
    const edgesRef = useRef<THREE.LineSegments>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} scale={2}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial
                color="#1587fa"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
            />
            <Edges
                ref={edgesRef}
                scale={1.01}
                threshold={15}
                color="#1587fa"
            />
        </mesh>
    );
}
