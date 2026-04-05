"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Edges } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import careers from "../data/careers.json";
import terminal from "../data/terminal.json";
import achievements from "../data/achievements.json";
import styles from "./BrickCareer.module.css";

/* ==========================================
   Types
   ========================================== */
interface Interview {
  url: string;
  text: string;
}
interface Position {
  title: string;
  type: string;
  period: string;
  interview?: Interview;
}
interface WorkEntry {
  company: string;
  image?: string;
  positions: Position[];
}
interface ExperienceEntry {
  title: string;
  period: string;
  link?: string;
  interview?: Interview;
}
interface Achievement {
  period: string;
  title: string;
  award?: { title: string };
}

/* ==========================================
   Constants
   ========================================== */
const FACE_KEYS = ["profile", "work", "experience", "achievements"] as const;
type FaceKey = (typeof FACE_KEYS)[number];

const FACE_ROTATIONS: Record<FaceKey, number> = {
  profile: 0,
  work: -Math.PI / 2,
  experience: -Math.PI,
  achievements: -Math.PI * 1.5,
};

const FACE_COLORS: Record<FaceKey, string> = {
  profile: "#3b82f6",
  work: "#10b981",
  experience: "#a855f7",
  achievements: "#f59e0b",
};

const FACE_LABELS: Record<string, Record<FaceKey, string>> = {
  ja: {
    profile: "プロフィール",
    work: "職歴",
    experience: "経歴",
    achievements: "実績",
  },
  en: {
    profile: "Profile",
    work: "Work",
    experience: "Experience",
    achievements: "Achievements",
  },
};

const BRICK_W = 5.0;
const BRICK_H = 3.0;
const BRICK_D = 3.4;
const STUD_RADIUS = 0.35;
const STUD_HEIGHT = 0.18;

const CAM_FAR = 8;
const CAM_NEAR = 7.5;

/* ==========================================
   Face Content Panels
   ========================================== */

function ProfileFaceContent({ lang }: { lang: string }) {
  const t = terminal[lang as keyof typeof terminal];
  return (
    <div className={styles.faceScroll}>
      {t.commands.map((cmd, i) => (
        <div key={i}>
          {cmd.output.split("\n").map((line, j) => {
            const m = line.match(/\[(.*?)\]\((.*?)\)/);
            if (m) {
              const parts = line.split(m[0]);
              const ci = parts[0].indexOf(": ");
              return (
                <div key={j} className={styles.pItem}>
                  <span className={styles.pLabel}>{parts[0].slice(0, ci)}</span>
                  <span className={styles.pVal}>
                    {parts[0].slice(ci + 2)}
                    <a
                      href={m[2]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pLink}
                    >
                      {m[1]}
                    </a>
                  </span>
                </div>
              );
            }
            const ci = line.indexOf(": ");
            if (ci !== -1)
              return (
                <div key={j} className={styles.pItem}>
                  <span className={styles.pLabel}>{line.slice(0, ci)}</span>
                  <span className={styles.pVal}>{line.slice(ci + 2)}</span>
                </div>
              );
            return (
              <div key={j} className={styles.pVal}>
                {line}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function WorkFaceContent({ lang }: { lang: string }) {
  const d = careers[lang as keyof typeof careers];
  return (
    <div className={styles.faceScroll}>
      {(d.work as WorkEntry[]).map((e, i) => (
        <div key={i} className={styles.wBlock}>
          <div className={styles.wHead}>
            {e.image && (
              <div className={styles.wIcon}>
                <Image
                  src={e.image}
                  alt={e.company}
                  width={18}
                  height={18}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
            <span className={styles.wName}>{e.company}</span>
          </div>
          {e.positions.map((p, j) => (
            <div key={j} className={styles.wPos}>
              <div className={styles.wDot} />
              <div>
                <span className={styles.wTitle}>{p.title}</span>
                <span
                  className={`${styles.wBadge} ${
                    p.type === "正社員" || p.type === "Full-time"
                      ? styles.wBadgeFt
                      : styles.wBadgeIn
                  }`}
                >
                  {p.type}
                </span>
                <div className={styles.wPeriod}>{p.period}</div>
                {p.interview && (
                  <a
                    href={p.interview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pLink}
                  >
                    {p.interview.text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExperienceFaceContent({ lang }: { lang: string }) {
  const d = careers[lang as keyof typeof careers];
  return (
    <div className={styles.faceScroll}>
      {(d.experience as ExperienceEntry[]).map((e, i) => (
        <div key={i} className={styles.eRow}>
          <div className={styles.eDot} />
          <div>
            <span className={styles.eTitle}>
              {e.link ? (
                <a
                  href={e.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pLink}
                >
                  {e.title}
                </a>
              ) : (
                e.title
              )}
            </span>
            <div className={styles.wPeriod}>{e.period}</div>
            {e.interview && (
              <a
                href={e.interview.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pLink}
              >
                {e.interview.text}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AchievementFaceContent({ lang }: { lang: string }) {
  const data = achievements[lang as keyof typeof achievements] as Achievement[];
  return (
    <div className={styles.faceScroll}>
      {data.map((a, i) => (
        <div key={i} className={styles.eRow}>
          <div className={`${styles.eDot} ${a.award ? styles.eDotGold : ""}`} />
          <div>
            <span className={styles.eTitle}>{a.title}</span>
            {a.award && <div className={styles.aAward}>{a.award.title}</div>}
            <div className={styles.wPeriod}>{a.period}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const FACE_CONTENT: Record<FaceKey, React.FC<{ lang: string }>> = {
  profile: ProfileFaceContent,
  work: WorkFaceContent,
  experience: ExperienceFaceContent,
  achievements: AchievementFaceContent,
};

/* ==========================================
   Single Face (label or expanded content)
   ========================================== */

interface FaceProps {
  faceKey: FaceKey;
  activeFace: FaceKey;
  lang: string;
  zoomed: boolean;
  zoomedFace: FaceKey | null;
  onLabelClick: (face: FaceKey) => void;
  position: [number, number, number];
  rotation: [number, number, number];
}

function BrickFace({
  faceKey,
  activeFace,
  lang,
  zoomed,
  zoomedFace,
  onLabelClick,
  position,
  rotation,
}: FaceProps) {
  const isThisFace = zoomedFace === faceKey;
  const isFront = activeFace === faceKey;
  const showContent = zoomed && isThisFace;
  const color = FACE_COLORS[faceKey];
  const label = FACE_LABELS[lang]?.[faceKey] ?? FACE_LABELS.en[faceKey];
  const Content = FACE_CONTENT[faceKey];

  // 左右面(work/achievements)はブリック面が狭いので distanceFactor を小さくして同じ見た目サイズに
  const isSideFace = faceKey === "work" || faceKey === "achievements";
  const dfZoomed = isSideFace ? 2.2 : 3.2;
  const dfLabel = 5.5;

  return (
    <Html
      position={position}
      rotation={rotation}
      transform
      distanceFactor={showContent ? dfZoomed : dfLabel}
      style={{ pointerEvents: "auto" }}
    >
      {showContent ? (
        <div
          className={styles.faceExpanded}
          style={{ "--face-color": color } as React.CSSProperties}
        >
          <div className={styles.faceHeader}>
            <span className={styles.faceHeaderTitle}>{label}</span>
          </div>
          <Content lang={lang} />
        </div>
      ) : (
        <div
          className={styles.faceLabel}
          style={{ borderColor: color, color: "#fff", opacity: isFront ? 1 : 0.3 }}
          onClick={(e) => {
            e.stopPropagation();
            onLabelClick(faceKey);
          }}
        >
          {label}
        </div>
      )}
    </Html>
  );
}

/* ==========================================
   3D Scene
   ========================================== */

interface SceneProps {
  activeFace: FaceKey;
  zoomed: boolean;
  zoomedFace: FaceKey | null;
  onFaceClick: (face: FaceKey) => void;
  onBgClick: () => void;
  onSnapFace: (face: FaceKey) => void;
  lang: string;
}

function BrickScene({
  activeFace,
  zoomed,
  zoomedFace,
  onFaceClick,
  onBgClick,
  onSnapFace,
  lang,
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotY = useRef(FACE_ROTATIONS[activeFace]);
  const targetCamZ = useRef(CAM_FAR);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);
  const rotOnDrag = useRef({ x: 0, y: 0 });

  const { gl, camera } = useThree();

  useEffect(() => {
    targetRotY.current = FACE_ROTATIONS[activeFace];
  }, [activeFace]);
  useEffect(() => {
    targetCamZ.current = zoomed ? CAM_NEAR : CAM_FAR;
  }, [zoomed]);

  useFrame(() => {
    if (!groupRef.current) return;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z += (targetCamZ.current - cam.position.z) * 0.07;

    if (!isDragging.current) {
      let diff = targetRotY.current - groupRef.current.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.07;
      const targetX = zoomed ? 0.02 : 0.12;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.05;
    }
  });

  const onPointerDown = useCallback(
    (e: THREE.Event) => {
      isDragging.current = true;
      dragMoved.current = false;
      const ev = e as unknown as PointerEvent;
      dragStart.current = { x: ev.clientX, y: ev.clientY };
      if (groupRef.current)
        rotOnDrag.current = {
          x: groupRef.current.rotation.x,
          y: groupRef.current.rotation.y,
        };
      gl.domElement.style.cursor = "grabbing";
    },
    [gl],
  );

  const onPointerMove = useCallback((e: THREE.Event) => {
    if (!isDragging.current || !groupRef.current) return;
    const ev = e as unknown as PointerEvent;
    const dx = ev.clientX - dragStart.current.x;
    const dy = ev.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;
    groupRef.current.rotation.y = rotOnDrag.current.y + dx * 0.008;
    groupRef.current.rotation.x = THREE.MathUtils.clamp(
      rotOnDrag.current.x + dy * 0.004,
      -0.4,
      0.4,
    );
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    gl.domElement.style.cursor = "grab";
    if (groupRef.current && !dragMoved.current) {
      // tap on brick body but not on label → do nothing special
    }
    // Always snap
    if (groupRef.current) {
      const y = groupRef.current.rotation.y;
      let ny = ((y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (ny > Math.PI) ny -= Math.PI * 2;
      let best: FaceKey = "profile";
      let bd = Infinity;
      for (const k of FACE_KEYS) {
        const d = Math.min(
          Math.abs(ny - FACE_ROTATIONS[k]),
          Math.abs(ny - FACE_ROTATIONS[k] + Math.PI * 2),
          Math.abs(ny - FACE_ROTATIONS[k] - Math.PI * 2),
        );
        if (d < bd) {
          bd = d;
          best = k;
        }
      }
      targetRotY.current = FACE_ROTATIONS[best];
      onSnapFace(best);
    }
  }, [gl, onSnapFace]);

  const brickColor = FACE_COLORS[activeFace];

  const studs = useMemo(() => {
    const arr: [number, number][] = [];
    const sx = BRICK_W / 3,
      sz = BRICK_D / 2;
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++)
        arr.push([
          -BRICK_W / 2 + sx / 2 + c * sx,
          -BRICK_D / 2 + sz / 2 + r * sz,
        ]);
    return arr;
  }, []);

  const faces: {
    key: FaceKey;
    pos: [number, number, number];
    rot: [number, number, number];
  }[] = [
    { key: "profile", pos: [0, 0, BRICK_D / 2 + 0.02], rot: [0, 0, 0] },
    { key: "work", pos: [BRICK_W / 2 + 0.02, 0, 0], rot: [0, Math.PI / 2, 0] },
    {
      key: "experience",
      pos: [0, 0, -BRICK_D / 2 - 0.02],
      rot: [0, Math.PI, 0],
    },
    {
      key: "achievements",
      pos: [-BRICK_W / 2 - 0.02, 0, 0],
      rot: [0, -Math.PI / 2, 0],
    },
  ];

  return (
    <>
      {/* Background click catcher */}
      <mesh position={[0, 0, -8]} onClick={onBgClick}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <group
        ref={groupRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        rotation={[0.12, 0, 0]}
      >
        {/* Brick body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[BRICK_W, BRICK_H, BRICK_D]} />
          <meshStandardMaterial
            color={brickColor}
            roughness={0.35}
            metalness={0.08}
          />
          <Edges threshold={1} color="#ffffff" />
        </mesh>

        {/* Shadow receiving ground plane */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -BRICK_H / 2 - 0.5, 0]}
        >
          <planeGeometry args={[12, 12]} />
          <shadowMaterial transparent opacity={0.35} />
        </mesh>

        {/* Bottom holes (stud receivers) */}
        {studs.map(([sx, sz], i) => (
          <group key={`hole-${i}`} position={[sx, -BRICK_H / 2, sz]}>
            {/* Dark hole cylinder (recessed into brick) */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[STUD_RADIUS + 0.02, STUD_RADIUS + 0.02, 0.1, 32]} />
              <meshStandardMaterial color="#000000" roughness={0.8} metalness={0} transparent opacity={0.6} />
            </mesh>
            {/* Inner ring edge (facing down) */}
            <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[STUD_RADIUS - 0.01, STUD_RADIUS + 0.03, 32]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.4} />
            </mesh>
            {/* White rim outline (facing down) */}
            <mesh position={[0, -0.003, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[STUD_RADIUS + 0.02, STUD_RADIUS + 0.04, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
            </mesh>
          </group>
        ))}

        {/* Studs */}
        {studs.map(([sx, sz], i) => (
          <group key={i} position={[sx, BRICK_H / 2, sz]}>
            {/* Stud body */}
            <mesh position={[0, STUD_HEIGHT / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry
                args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 32]}
              />
              <meshStandardMaterial
                color={brickColor}
                roughness={0.25}
                metalness={0.05}
              />
            </mesh>
            {/* White edge ring on top */}
            <mesh
              position={[0, STUD_HEIGHT + 0.002, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry
                args={[STUD_RADIUS - 0.012, STUD_RADIUS + 0.012, 32]}
              />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
            </mesh>
            {/* White edge ring on bottom (where stud meets brick) */}
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[STUD_RADIUS - 0.008, STUD_RADIUS + 0.015, 32]}
              />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
          </group>
        ))}

        {/* Faces */}
        {faces.map(({ key, pos, rot }) => (
          <BrickFace
            key={key}
            faceKey={key}
            activeFace={activeFace}
            lang={lang}
            zoomed={zoomed}
            zoomedFace={zoomedFace}
            onLabelClick={onFaceClick}
            position={pos}
            rotation={rot}
          />
        ))}
      </group>
    </>
  );
}

/* ==========================================
   Main Component
   ========================================== */

export default function BrickCareer() {
  const { lang } = useLanguage();
  const [activeFace, setActiveFace] = useState<FaceKey>("profile");
  const [zoomed, setZoomed] = useState(false);
  const [zoomedFace, setZoomedFace] = useState<FaceKey | null>(null);

  const handleFaceClick = useCallback((face: FaceKey) => {
    setActiveFace(face);
    setZoomedFace(face);
    setZoomed(true);
  }, []);

  const handleBgClick = useCallback(() => {
    setZoomed(false);
    setZoomedFace(null);
  }, []);

  const handleSnapFace = useCallback((face: FaceKey) => {
    setActiveFace(face);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Nav tabs */}
      <div className={styles.nav}>
        {FACE_KEYS.map((key) => (
          <button
            key={key}
            className={`${styles.navBtn} ${
              zoomedFace === key ? styles.navBtnActive : ""
            }`}
            onClick={() => handleFaceClick(key)}
            style={{ "--btn-color": FACE_COLORS[key] } as React.CSSProperties}
          >
            {FACE_LABELS[lang]?.[key] ?? FACE_LABELS.en[key]}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className={styles.canvasWrap}>
        <Canvas
          camera={{ position: [0, 0.5, CAM_FAR], fov: 45 }}
          shadows
          style={{ cursor: "grab" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 8, 6]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.002}
          />
          <pointLight position={[-4, 3, 4]} intensity={0.25} color="#60a5fa" />
          <pointLight position={[3, -2, 3]} intensity={0.15} color="#f59e0b" />
          <BrickScene
            activeFace={activeFace}
            zoomed={zoomed}
            zoomedFace={zoomedFace}
            onFaceClick={handleFaceClick}
            onBgClick={handleBgClick}
            onSnapFace={handleSnapFace}
            lang={lang}
          />
        </Canvas>
      </div>

      <p className={styles.hint}>
        {zoomed
          ? lang === "ja"
            ? "外側をクリックで戻る"
            : "Click outside to zoom out"
          : lang === "ja"
          ? "面のラベルをタップ / ドラッグで回転"
          : "Tap a label / drag to rotate"}
      </p>
    </div>
  );
}
