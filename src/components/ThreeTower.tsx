import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Company } from '../types';

interface ThreeTowerProps {
  companies: Company[];
  selectedFloor: number;
  onSelectFloor: (floor: number) => void;
}

export const ThreeTower: React.FC<ThreeTowerProps> = ({
  companies,
  selectedFloor,
  onSelectFloor,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorMeshesRef = useRef<THREE.Mesh[]>([]);
  const elevatorCarRef = useRef<THREE.Mesh | null>(null);
  const targetCameraYRef = useRef<number>(20);
  const targetLookAtYRef = useRef<number>(10);
  const currentLookAtYRef = useRef<number>(10);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c0e14');
    scene.fog = new THREE.FogExp2('#0c0e14', 0.015);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(28, 20, 28);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#fffbeb', 1.6);
    dirLight.position.set(30, 60, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight('#38bdf8', 1.0);
    blueRimLight.position.set(-30, 40, -20);
    scene.add(blueRimLight);

    // 5. Ground Grid
    const grid = new THREE.GridHelper(80, 40, '#334155', '#1e293b');
    grid.position.y = -0.1;
    scene.add(grid);

    // Ground platform
    const platformGeo = new THREE.CylinderGeometry(18, 19, 0.4, 32);
    const platformMat = new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.8 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.2;
    scene.add(platform);

    // 6. Build the Skyscraper Floors
    const floorHeight = 3.2;
    const floorWidth = 9.0;
    const floorDepth = 9.0;
    const meshes: THREE.Mesh[] = [];

    companies.forEach((comp, idx) => {
      const yPos = idx * floorHeight + floorHeight / 2;
      const isSelected = comp.floor === selectedFloor;

      // Floor slab
      const slabGeo = new THREE.BoxGeometry(floorWidth + 0.6, 0.35, floorDepth + 0.6);
      const slabMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.8,
        roughness: 0.3,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, yPos - floorHeight / 2 + 0.175, 0);
      scene.add(slab);

      // Office Room (Glass & Interior)
      const roomGeo = new THREE.BoxGeometry(floorWidth, floorHeight - 0.4, floorDepth);
      const roomMat = new THREE.MeshPhysicalMaterial({
        color: comp.color,
        transmission: 0.6,
        opacity: isSelected ? 0.95 : 0.65,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        emissive: isSelected ? new THREE.Color(comp.color) : new THREE.Color('#000000'),
        emissiveIntensity: isSelected ? 0.35 : 0.05,
      });

      const roomMesh = new THREE.Mesh(roomGeo, roomMat);
      roomMesh.position.set(0, yPos, 0);
      roomMesh.userData = { floorNumber: comp.floor, companyId: comp.id };
      scene.add(roomMesh);
      meshes.push(roomMesh);

      // Interior Core pillar
      const coreGeo = new THREE.BoxGeometry(3.5, floorHeight - 0.4, 3.5);
      const coreMat = new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.5,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, yPos, 0);
      scene.add(core);

      // Window mullions (architectural wireframe)
      const wireGeo = new THREE.EdgesGeometry(roomGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: isSelected ? '#facc15' : '#475569',
        linewidth: 1.5,
      });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      wire.position.copy(roomMesh.position);
      scene.add(wire);
    });

    floorMeshesRef.current = meshes;

    // 7. Elevator Shaft (External panoramic glass elevator)
    const totalHeight = companies.length * floorHeight;
    const shaftGeo = new THREE.BoxGeometry(1.6, totalHeight, 1.6);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      wireframe: true,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(floorWidth / 2 + 1.2, totalHeight / 2, 0);
    scene.add(shaft);

    // Elevator Car
    const carGeo = new THREE.BoxGeometry(1.4, 2.4, 1.4);
    const carMat = new THREE.MeshStandardMaterial({
      color: '#facc15',
      emissive: '#facc15',
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1,
    });
    const elevatorCar = new THREE.Mesh(carGeo, carMat);
    const initialCarY = (selectedFloor - 0.5) * floorHeight;
    elevatorCar.position.set(floorWidth / 2 + 1.2, initialCarY, 0);
    scene.add(elevatorCar);
    elevatorCarRef.current = elevatorCar;

    // 8. Rooftop Spire & Beacon
    const roofY = totalHeight;
    const spireGeo = new THREE.ConeGeometry(0.8, 6, 8);
    const spireMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, roofY + 3, 0);
    scene.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: '#facc15' });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, roofY + 6, 0);
    scene.add(beacon);

    // 9. Interactive Drag / Orbiting & Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let rotationAngle = Math.PI / 4;
    const cameraRadius = 38;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      rotationAngle += deltaX * 0.006;
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;

      // Click detection for floor selection
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedFloor = intersects[0].object.userData.floorNumber;
        if (clickedFloor && clickedFloor !== selectedFloor) {
          onSelectFloor(clickedFloor);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 10. Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation when not dragging
      if (!isDragging) {
        rotationAngle += 0.0015;
      }

      // Smooth elevator transition
      const targetCarY = (selectedFloor - 0.5) * floorHeight;
      if (elevatorCarRef.current) {
        elevatorCarRef.current.position.y += (targetCarY - elevatorCarRef.current.position.y) * 0.08;
      }

      // Smooth camera transition to follow active floor
      targetCameraYRef.current = targetCarY + 6;
      targetLookAtYRef.current = targetCarY;

      camera.position.x = Math.cos(rotationAngle) * cameraRadius;
      camera.position.z = Math.sin(rotationAngle) * cameraRadius;
      camera.position.y += (targetCameraYRef.current - camera.position.y) * 0.05;

      currentLookAtYRef.current += (targetLookAtYRef.current - currentLookAtYRef.current) * 0.05;
      camera.lookAt(0, currentLookAtYRef.current, 0);

      // Pulse beacon light
      const time = Date.now() * 0.003;
      beaconMat.color.setHSL(0.12, 1, 0.4 + Math.sin(time) * 0.3);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [companies, selectedFloor, onSelectFloor]);

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-10 bg-zinc-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Drag to rotate • Click any floor to ride elevator</span>
      </div>
    </div>
  );
};
