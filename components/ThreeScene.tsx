import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const WindowModel: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { scene } = useGLTF('/models/window.glb');
  const windowRef = useRef<THREE.Object3D>();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: isDarkMode ? 'white' : 'black',
          transparent: true,
          opacity: isDarkMode ? 0.3 : 0.9
        });
      }
    });
  }, [isDarkMode, scene]);

  return (
    <primitive object={scene} ref={windowRef} scale={[0.0111, 0.007, 0.01]} position={[0, 2, -0.06]} />
  );
};

const PyramidModel: React.FC<{ positionAngle: number; isDarkMode: boolean }> = ({ positionAngle, isDarkMode }) => {
  const radius = 6;
  const angleInRadians = THREE.MathUtils.degToRad(positionAngle);
  const x = radius * Math.sin(angleInRadians);
  const z = radius * -Math.cos(angleInRadians);
  const tip = [x, 0.9, z + 0.001];

  const pyramidVertices = React.useMemo(() => {
    const baseVertices = [
      new THREE.Vector3(-1.03, 2.77, -0.15),
      new THREE.Vector3(1.03, 2.77, -0.15),
      new THREE.Vector3(1.03, 1.23, -0.15),
      new THREE.Vector3(-1.03, 1.23, -0.15)
    ];
    return [...baseVertices, new THREE.Vector3(...tip)];
  }, [tip]);

  const pyramidGeometry = React.useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(pyramidVertices);
    geom.setIndex([
      0, 1, 4, 
      1, 2, 4, 
      2, 3, 4, 
      3, 0, 4 
    ]);
    geom.computeVertexNormals();
    return geom;
  }, [pyramidVertices]);

  const { opacity } = useSpring({
    reset: true,
    from: { opacity: 0 },
    config: { duration: 1000 },
    to: async (next) => {
      await next({ opacity: 0.0009, config: { duration: 200 } });
      await next({ opacity: 0.4, config: { duration: 500 } });
    }
  });

  return (
    <animated.mesh geometry={pyramidGeometry} material-opacity={opacity}>
      <meshBasicMaterial color={isDarkMode ? 'red' : '#00FFFB'} transparent side={THREE.DoubleSide} />
    </animated.mesh>
  );
};

const SpotModel: React.FC<{ positionAngle: number }> = ({ positionAngle }) => {
  const { scene } = useGLTF('/models/spot.glb');
  const spotRef = useRef<THREE.Object3D>();
  const radius = 6;
  const initialZRotation = Math.PI / 4;
  const angleInRadians = THREE.MathUtils.degToRad(positionAngle);
  const x = radius * Math.sin(angleInRadians);
  const z = radius * -Math.cos(angleInRadians);

  const { position, rotation } = useSpring({
    to: {
      position: [x, 0, z],
      rotation: [0, -angleInRadians + Math.PI, initialZRotation]
    },
    from: {
      position: [0, 0, 0],
      rotation: [0, Math.PI, initialZRotation]
    },
    config: { mass: 1, tension: 150, friction: 30 }
  });

  return (
    // @ts-ignore
    <animated.primitive<object, any> object={scene} ref={spotRef} scale={4} position={position} rotation={rotation} />
  );
};

const Ground: React.FC<{ width: number; length: number; opacity: number }> = ({ width, length, opacity }) => {
  const { scene } = useThree();
  const textureRef = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>();

  if (!textureRef.current) {
    const loader = new THREE.TextureLoader();
    textureRef.current = loader.load('/images/setupSpot.png');
    textureRef.current.wrapS = THREE.ClampToEdgeWrapping;
    textureRef.current.wrapT = THREE.ClampToEdgeWrapping;
    textureRef.current.repeat.set(1, 1);
  }

  if (!materialRef.current) {
    materialRef.current = new THREE.MeshBasicMaterial({
      map: textureRef.current,
      side: THREE.DoubleSide,
      transparent: true, 
      opacity: opacity
    });
  }

  const geometry = new THREE.PlaneGeometry(width, length);
  const ground = new THREE.Mesh(geometry, materialRef.current);
  ground.position.set(0, 0, -3.6);
  ground.rotation.x = -Math.PI / 2;

  useEffect(() => {
    scene.add(ground);
    return () => {
      scene.remove(ground);
    };
  }, [scene, ground]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
      materialRef.current.needsUpdate = true;
    }
  }, [opacity]);

  return null;
};

const ThreeScene: React.FC<{ onAngleSelect: (angle: number) => void }> = ({ onAngleSelect }) => {
  const [positionAngle, setPositionAngle] = useState<number>(0);
  const [displayAngle, setDisplayAngle] = useState<number>(0);
  const [groundVisible, setGroundVisible] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleClick = (angle: number) => {
    setPositionAngle(-angle);
    setDisplayAngle(angle);
    onAngleSelect(angle);
  };

  const toggleGroundVisibility = () => {
    setGroundVisible(!groundVisible);
  };

  const angleOptions = [-45, -30, -15, 0, 15, 30, 45];

  return (
    <main className=''>
      <div className='w-full h-[100dvh] hover:cursor-grab rounded-[12px] overflow-hidden'>
        <Canvas shadows camera={{ position: [0, 5, -10], fov: 60 }} >
          <ambientLight intensity={1.3} />
          <spotLight position={[0, 0, 0]} angle={1} penumbra={1} intensity={1} castShadow />
          <directionalLight position={[-10, 20, 10]} intensity={3} castShadow />
          <pointLight position={[0, 10, 0]} intensity={1} />
          <Suspense fallback={null}>
            <SpotModel positionAngle={positionAngle} />
            <PyramidModel positionAngle={positionAngle} isDarkMode={isDarkMode} />
            {groundVisible && <Ground width={10} length={7} opacity={0.9} />}
            <WindowModel isDarkMode={isDarkMode} />
            <EffectComposer>
              <Bloom luminanceThreshold={1} luminanceSmoothing={1} height={0} />
              <Noise opacity={0.06} />
              <Vignette eskil={false} offset={0.001} darkness={1.1} />
            </EffectComposer>
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={15} />
        </Canvas>
      </div>

      <section className='absolute flex flex-col bottom-4 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-md p-3 rounded-2xl '>
        <div className='flex justify-between gap-3'>
          {angleOptions.map((angle) => (
            <motion.button
              key={angle}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1 }}
              onClick={() => handleClick(angle)}
              className={`${displayAngle === angle ? 'bg-yellow-500' : 'bg-black/30'} shadow-md w-10 h-10 rounded-full  flex items-center justify-center text-white hover:cursor-pointer transition-colors duration-500`}
            >
              {`${angle}°`}
            </motion.button>
          ))}
        </div>
        <button onClick={toggleGroundVisibility} className='bg-black/20 border border-white/20 p-px text-white rounded-full px-2 py-2 shadow-md mt-4 transition-colors duration-500'>
          {groundVisible ? 'Hide Ground' : 'Show Ground'}
        </button>
      </section>
    </main>
  );
};

export default ThreeScene;
