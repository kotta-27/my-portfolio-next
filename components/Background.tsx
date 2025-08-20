"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from 'three';
import { useRef, useState } from "react";
import styles from "./Background.module.css";

const RotatingSphere = ({ size = 1, initialPosition = [0, 0, 0] as [number, number, number], rotationSpeed = 0.001, orbitRadius = 0, orbitSpeed = 0, mainSphereColor = "#0000FF", initialSphereColor = "#0000FF" }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2); // Initial random angle for orbit
  const [isFastSpinning, setIsFastSpinning] = useState(false); // New state for fast spin
  const [sphereColor, setSphereColor] = useState(initialSphereColor || mainSphereColor); // State for individual sphere color
  useFrame(() => {
    if (meshRef.current) {
      // Self-rotation
      const currentRotationSpeed = isFastSpinning ? 0.05 : rotationSpeed; // Faster spin when active
      meshRef.current.rotation.x += currentRotationSpeed;
      meshRef.current.rotation.y += currentRotationSpeed;

      // Orbit around the center
      if (orbitRadius > 0 && orbitSpeed > 0) {
        setAngle(prevAngle => prevAngle + orbitSpeed);
        const newX = initialPosition[0] + Math.cos(angle) * orbitRadius;
        const newZ = initialPosition[2] + Math.sin(angle) * orbitRadius;
        const newY = initialPosition[1];
        meshRef.current.position.set(newX, newY, newZ); // Update mesh position

      }
    }
  });

  return (
    <>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        position={initialPosition}
        onClick={() => {
          setIsFastSpinning(!isFastSpinning);
          setSphereColor(isFastSpinning ? (initialSphereColor || mainSphereColor) : "#FF0000"); // Toggle color to red when fast spinning
        }}
      >
        <meshStandardMaterial color={sphereColor} wireframe={true} transparent={true} opacity={0.5} />
      </Sphere>
      {/* Draw a line from the sphere to the center */}
      {/* <Line
        points={[currentPosition, [0, 0, 0]]}
        color={sphereColor}
        lineWidth={1}
        transparent={true}
        opacity={0.3}
      /> */}
    </>
  );
};

const MultipleSpheres = () => {
  const spheres = [];
  for (let i = 0; i < 5; i++) {
    const size = Math.random() * 0.5 + 0.2; // Random size between 0.2 and 0.7
    const x = (Math.random() - 0.5) * 6; // Random x position between -3 and 3
    const y = (Math.random() - 0.5) * 6; // Random y position between -3 and 3
    const z = (Math.random() - 0.5) * 8; // Random z position between -4 and 4
    const rotationSpeed = Math.random() * 0.002 + 0.0005; // Random self-rotation speed
    const orbitRadius = Math.random() * 3 + 2; // Random orbit radius between 2 and 5
    const orbitSpeed = Math.random() * 0.005 + 0.001; // Random orbit speed

    // Generate a random shade of blue
    const r = Math.floor(Math.random() * 50); // 0-49
    const g = Math.floor(Math.random() * 50); // 0-49
    const b = 255;
    const randomBlueColor = `rgb(${r}, ${g}, ${b})`;

    spheres.push(
      <RotatingSphere
        key={i}
        size={size}
        initialPosition={[x, y, z]}
        rotationSpeed={rotationSpeed}
        orbitRadius={orbitRadius}
        orbitSpeed={orbitSpeed}
        initialSphereColor={randomBlueColor} // Pass the random blue color
      />
    );
  }
  return <>{spheres}</>;
};

const Background = () => {
  const [isMainSphereActive] = useState(false);
  const mainSphereColor = isMainSphereActive ? "#FFFF00" : "#0000FF"; // Yellow when active, blue otherwise

  return (
    <div className={styles.canvas}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingSphere size={2.7} rotationSpeed={isMainSphereActive ? 0.005 : 0.001} mainSphereColor={mainSphereColor} /> {/* Main sphere */}
        <MultipleSpheres />
      </Canvas>
    </div>
  );
};

export default Background;