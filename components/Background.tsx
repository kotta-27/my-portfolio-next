"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import styles from "./Background.module.css";

/* ==========================================
   LEGO Brick Component
   ========================================== */

const BRICK_UNIT = 0.4; // base unit size
const STUD_RADIUS = 0.12;
const STUD_HEIGHT = 0.08;

interface LegoBrickProps {
  cols?: number;
  rows?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  floatSpeed?: number;
  rotateSpeed?: number;
}

function LegoBrick({
  cols = 3,
  rows = 2,
  color = "#4ade80",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatSpeed = 1,
  rotateSpeed = 0.3,
}: LegoBrickProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const initialY = position[1];
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * floatSpeed + timeOffset;
      groupRef.current.position.y = initialY + Math.sin(t) * 0.3;
      groupRef.current.rotation.y += rotateSpeed * 0.005;
      groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.05;
    }
  });

  const bodyW = cols * BRICK_UNIT;
  const bodyD = rows * BRICK_UNIT;
  const bodyH = BRICK_UNIT * 0.6;

  // Generate stud positions
  const studs: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sx = -bodyW / 2 + BRICK_UNIT / 2 + c * BRICK_UNIT;
      const sz = -bodyD / 2 + BRICK_UNIT / 2 + r * BRICK_UNIT;
      studs.push([sx, sz]);
    }
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main body with edge lines */}
      <mesh castShadow>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
        <Edges threshold={1} color="#ffffff" />
      </mesh>

      {/* Studs with white outlines */}
      {studs.map(([sx, sz], i) => (
        <group key={i} position={[sx, bodyH / 2, sz]}>
          {/* Stud body */}
          <mesh position={[0, STUD_HEIGHT / 2, 0]} castShadow>
            <cylinderGeometry
              args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 12]}
            />
            <meshStandardMaterial
              color={color}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
          {/* White ring on top */}
          <mesh
            position={[0, STUD_HEIGHT + 0.001, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[STUD_RADIUS - 0.008, STUD_RADIUS + 0.008, 16]}
            />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
          {/* White ring at base */}
          <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[STUD_RADIUS - 0.005, STUD_RADIUS + 0.01, 16]}
            />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}

      {/* Bottom holes */}
      {studs.map(([sx, sz], i) => (
        <group key={`hole-${i}`} position={[sx, -bodyH / 2, sz]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry
              args={[STUD_RADIUS + 0.01, STUD_RADIUS + 0.01, 0.06, 12]}
            />
            <meshStandardMaterial
              color="#000000"
              roughness={0.8}
              transparent
              opacity={0.5}
            />
          </mesh>
          <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[STUD_RADIUS - 0.005, STUD_RADIUS + 0.015, 16]}
            />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[STUD_RADIUS + 0.01, STUD_RADIUS + 0.025, 16]}
            />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ==========================================
   Original Sphere Components
   ========================================== */

const RotatingSphere = ({
  size = 1,
  initialPosition = [0, 0, 0] as [number, number, number],
  rotationSpeed = 0.001,
  orbitRadius = 0,
  orbitSpeed = 0,
  mainSphereColor = "#ffffff",
  initialSphereColor = "#ffffff",
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const [isFastSpinning, setIsFastSpinning] = useState(false);
  const [sphereColor, setSphereColor] = useState(
    initialSphereColor || mainSphereColor,
  );
  useFrame(() => {
    if (meshRef.current) {
      const currentRotationSpeed = isFastSpinning ? 0.05 : rotationSpeed;
      meshRef.current.rotation.x += currentRotationSpeed;
      meshRef.current.rotation.y += currentRotationSpeed;

      if (orbitRadius > 0 && orbitSpeed > 0) {
        angleRef.current += orbitSpeed;
        const newX =
          initialPosition[0] + Math.cos(angleRef.current) * orbitRadius;
        const newZ =
          initialPosition[2] + Math.sin(angleRef.current) * orbitRadius;
        meshRef.current.position.set(newX, initialPosition[1], newZ);
      }
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[size, 16, 16]}
      position={initialPosition}
      onClick={() => {
        setIsFastSpinning(!isFastSpinning);
        setSphereColor(
          isFastSpinning ? initialSphereColor || mainSphereColor : "#FF0000",
        );
      }}
    >
      <meshStandardMaterial
        color={sphereColor}
        wireframe={true}
        transparent={true}
        opacity={0.52}
      />
    </Sphere>
  );
};

const MultipleSpheres = () => {
  const spheres = [];
  const sphereNum = 3;
  for (let i = 0; i < sphereNum; i++) {
    const size = Math.random() * 0.5 + 0.2;
    const x = (Math.random() - 0.5) * 6;
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 8;
    const rotationSpeed = Math.random() * 0.002 + 0.0005;
    const orbitRadius = Math.random() * 3 + 2;
    const orbitSpeed = Math.random() * 0.005 + 0.001;

    const r = 200;
    const g = 200;
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
        initialSphereColor={randomBlueColor}
      />,
    );
  }
  return <>{spheres}</>;
};

/* ==========================================
   LEGO Technic Gear
   ========================================== */

interface LegoGearProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  teeth?: number;
  floatSpeed?: number;
  spinSpeed?: number;
}

function LegoGear({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#6b7280",
  teeth = 24,
  floatSpeed = 0.7,
  spinSpeed = 0.3,
}: LegoGearProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const initialY = position[1];
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  const GEAR_RADIUS = 1.0;
  const GEAR_DEPTH = 0.2;
  const TOOTH_HEIGHT = 0.18;
  const TOOTH_WIDTH = 0.12;
  const PIN_HOLE_RADIUS = 0.28;
  const PIN_HOLE_DIST = 0.3;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * floatSpeed + timeOffset;
      groupRef.current.position.y = initialY + Math.sin(t) * 0.25;
      groupRef.current.rotation.z += spinSpeed * 0.003;
    }
  });

  // Generate teeth positions
  const teethData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      arr.push({
        x: Math.cos(angle) * GEAR_RADIUS,
        y: Math.sin(angle) * GEAR_RADIUS,
        angle,
      });
    }
    return arr;
  }, [teeth, GEAR_RADIUS]);

  // 4 pin hole positions (cross pattern)
  const pinHoles: [number, number][] = [
    [PIN_HOLE_DIST, PIN_HOLE_DIST],
    [-PIN_HOLE_DIST, PIN_HOLE_DIST],
    [-PIN_HOLE_DIST, -PIN_HOLE_DIST],
    [PIN_HOLE_DIST, -PIN_HOLE_DIST],
  ];

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main disc body (rotated so flat face is toward camera) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[GEAR_RADIUS - 0.02, GEAR_RADIUS - 0.02, GEAR_DEPTH, 32]}
        />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Outer rim ring (lies in XY plane) */}
      <mesh>
        <torusGeometry args={[GEAR_RADIUS - 0.02, 0.03, 8, 32]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Teeth (tapered trapezoid, in XY plane) */}
      {teethData.map((tooth, i) => (
        <mesh
          key={i}
          position={[
            tooth.x + Math.cos(tooth.angle) * (TOOTH_HEIGHT / 2),
            tooth.y + Math.sin(tooth.angle) * (TOOTH_HEIGHT / 2),
            0,
          ]}
          rotation={[0, 0, tooth.angle - Math.PI / 2]}
        >
          {/* topRadius(outer)=small, bottomRadius(inner)=wide → pointed outward */}
          <cylinderGeometry
            args={[TOOTH_WIDTH * 0.25, TOOTH_WIDTH * 0.9, TOOTH_HEIGHT, 4]}
          />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
      ))}

      {/* Pin holes (4 holes in cross pattern, in XY plane) */}
      {pinHoles.map(([px, py], i) => (
        <group key={`pin-${i}`} position={[px, py, 0]}>
          {/* Hole rim (torus in XY plane) */}
          <mesh>
            <torusGeometry args={[PIN_HOLE_RADIUS, 0.03, 8, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>
          {/* Dark hole interior (cylinder along Z axis) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[
                PIN_HOLE_RADIUS - 0.02,
                PIN_HOLE_RADIUS - 0.02,
                GEAR_DEPTH + 0.02,
                12,
              ]}
            />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Center axle hole (cylinder along Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, GEAR_DEPTH + 0.04, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Center cross bars (in XY plane, extruded along Z) */}
      <mesh>
        <boxGeometry args={[0.06, 0.22, GEAR_DEPTH + 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.22, 0.06, GEAR_DEPTH + 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ==========================================
   Floating LEGO Bricks
   ========================================== */

const brickConfigs: LegoBrickProps[] = [
  {
    cols: 3,
    rows: 2,
    color: "#4ade80",
    position: [3.5, 2, -2],
    rotation: [0.3, 0.5, 0.1],
    scale: 1.2,
    floatSpeed: 0.8,
    rotateSpeed: 0.25,
  },
  {
    cols: 2,
    rows: 2,
    color: "#60a5fa",
    position: [-3.5, -1.5, -1],
    rotation: [-0.2, 1.2, 0.15],
    scale: 1.0,
    floatSpeed: 1.1,
    rotateSpeed: -0.3,
  },
  {
    cols: 4,
    rows: 2,
    color: "#f472b6",
    position: [-2, 3, -3],
    rotation: [0.15, -0.8, -0.1],
    scale: 0.8,
    floatSpeed: 0.6,
    rotateSpeed: 0.2,
  },
  {
    cols: 2,
    rows: 1,
    color: "#facc15",
    position: [2.5, -2.5, -1.5],
    rotation: [-0.1, 2.0, 0.2],
    scale: 1.1,
    floatSpeed: 1.3,
    rotateSpeed: -0.35,
  },
  {
    cols: 3,
    rows: 2,
    color: "#a78bfa",
    position: [-4, 0.5, -2.5],
    rotation: [0.4, -0.3, 0.05],
    scale: 0.7,
    floatSpeed: 0.9,
    rotateSpeed: 0.15,
  },
  {
    cols: 2,
    rows: 2,
    color: "#fb923c",
    position: [4.5, -0.5, -3],
    rotation: [0.2, 1.5, -0.15],
    scale: 0.9,
    floatSpeed: 1.0,
    rotateSpeed: -0.2,
  },
];

/* ==========================================
   Background Component
   ========================================== */

const Background = () => {
  const [isMainSphereActive] = useState(false);
  const mainSphereColor = isMainSphereActive ? "#FFFF00" : "#0000FF";

  return (
    <div className={styles.canvas}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#60a5fa" />

        {/* Original spheres */}
        <RotatingSphere
          size={2.7}
          rotationSpeed={isMainSphereActive ? 0.005 : 0.001}
          mainSphereColor={mainSphereColor}
        />
        <MultipleSpheres />

        {/* Floating LEGO bricks */}
        {brickConfigs.map((cfg, i) => (
          <LegoBrick key={i} {...cfg} />
        ))}

        {/* Floating LEGO Technic gear */}
        <LegoGear
          position={[2, -1, -1.5]}
          rotation={[0.4, 0.3, 0]}
          scale={1.3}
          color="#6b7280"
          teeth={24}
          floatSpeed={0.5}
          spinSpeed={0.4}
        />
      </Canvas>
    </div>
  );
};

export default Background;
