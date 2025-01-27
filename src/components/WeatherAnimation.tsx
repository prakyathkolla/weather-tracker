import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WeatherAnimationProps {
  condition: string;
}

export const WeatherAnimation = ({ condition }: WeatherAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    sceneRef.current = new THREE.Scene();
    
    // Setup camera
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current.position.z = 5;

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0x000000, 0);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create particles based on weather condition
    const createParticles = () => {
      if (particlesRef.current) {
        sceneRef.current?.remove(particlesRef.current);
      }

      const geometry = new THREE.BufferGeometry();
      const particles = 1000;
      const positions = new Float32Array(particles * 3);

      for (let i = 0; i < particles * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      let material;
      switch (condition.toLowerCase()) {
        case 'sunny':
        case 'clear':
          material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffb300,
            transparent: true,
            opacity: 0.8,
          });
          break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
          material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.6,
          });
          break;
        case 'snow':
          material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
          });
          break;
        case 'wind':
        case 'windy':
          material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x8f9daa,
            transparent: true,
            opacity: 0.4,
          });
          break;
        default:
          material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x8f9daa,
            transparent: true,
            opacity: 0.4,
          });
      }

      particlesRef.current = new THREE.Points(geometry, material);
      sceneRef.current?.add(particlesRef.current);
    };

    createParticles();

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (particlesRef.current) {
        switch (condition.toLowerCase()) {
          case 'sunny':
          case 'clear':
            particlesRef.current.rotation.y += 0.002;
            break;
          case 'rain':
          case 'light rain':
          case 'moderate rain':
            particlesRef.current.rotation.y += 0.001;
            particlesRef.current.position.y -= 0.01;
            if (particlesRef.current.position.y < -2) {
              particlesRef.current.position.y = 2;
            }
            break;
          case 'snow':
            particlesRef.current.rotation.y += 0.001;
            particlesRef.current.position.y -= 0.005;
            if (particlesRef.current.position.y < -2) {
              particlesRef.current.position.y = 2;
            }
            break;
          case 'wind':
          case 'windy':
            particlesRef.current.rotation.z -= 0.005;
            particlesRef.current.position.x += 0.01;
            if (particlesRef.current.position.x > 2) {
              particlesRef.current.position.x = -2;
            }
            break;
        }
      }

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(rendererRef.current!.domElement);
      sceneRef.current?.remove(particlesRef.current!);
    };
  }, [condition]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};