'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type RingConfig = {
  position: [number, number, number];
  rotation: [number, number, number];
  color: number;
  roughness: number;
  metalness?: number;
  scale?: number;
  thickness?: number;
};

const ringConfigs: RingConfig[] = [
  { position: [-1.6, 0.6, 0], rotation: [Math.PI / 4, 0.2, 0], color: 0x17191d, roughness: 0.72 },
  { position: [1.5, 0.3, 0.5], rotation: [0.1, Math.PI / 3, 0], color: 0x6f382c, roughness: 0.48, thickness: 0.2 },
  { position: [0, -1.1, -0.5], rotation: [Math.PI / 2.2, 0, Math.PI / 4], color: 0x238653, roughness: 0.58 },
  { position: [0.5, 1.4, -1], rotation: [0.2, Math.PI / 4, Math.PI / 2], color: 0x2867a3, roughness: 0.32, metalness: 0.2, scale: 0.7, thickness: 0.12 },
  { position: [0.5, 1.4, -0.8], rotation: [-0.1, -Math.PI / 4, -Math.PI / 2.2], color: 0xc62828, roughness: 0.5, scale: 0.8, thickness: 0.07 },
];

export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.dataset.webgl = 'initializing';

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      mount.dataset.webgl = 'unavailable';
      return;
    }

    renderer.setClearColor(0x001e40, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'pan-y';
    mount.appendChild(renderer.domElement);
    mount.dataset.webgl = 'ready';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const stage = new THREE.Group();
    scene.add(stage);

    const rings = ringConfigs.map((config, index) => {
      const geometry = new THREE.TorusGeometry(1, config.thickness ?? 0.15, 36, 128);
      const material = new THREE.MeshPhysicalMaterial({
        color: config.color,
        roughness: config.roughness,
        metalness: config.metalness ?? 0.05,
        clearcoat: 0.35,
        clearcoatRoughness: 0.22,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...config.position);
      mesh.rotation.set(...config.rotation);
      mesh.scale.setScalar(config.scale ?? 1);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.baseY = config.position[1];
      mesh.userData.phase = index * 0.9;
      stage.add(mesh);
      return mesh;
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      new THREE.ShadowMaterial({ color: 0x000914, opacity: 0.24 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.45;
    floor.receiveShadow = true;
    stage.add(floor);

    scene.add(new THREE.HemisphereLight(0xd8e7ff, 0x001126, 2.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(-5, 7, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x8ab8ff, 32, 18);
    blueLight.position.set(5, 2, 5);
    scene.add(blueLight);

    const warmLight = new THREE.PointLight(0xff9b7e, 20, 14);
    warmLight.position.set(-3, -1, 3);
    scene.add(warmLight);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = media.matches;
    let frame = 0;
    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;
    const targetRotation = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const render = () => renderer.render(scene, camera);

    const layout = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (width < 768) {
        const mobileScale = THREE.MathUtils.clamp(width / 900, 0.48, 0.7);
        stage.position.set(0, 0.58, 0);
        stage.scale.setScalar(mobileScale);
      } else {
        stage.position.set(1.65, 0, 0);
        stage.scale.setScalar(1);
      }
      render();
    };

    const animate = () => {
      if (!reduceMotion) {
        const elapsed = clock.getElapsedTime();
        rings.forEach((ring, index) => {
          ring.position.y = ring.userData.baseY + Math.sin(elapsed * 0.8 + ring.userData.phase) * 0.1;
          ring.rotation.x += 0.0015 + index * 0.00015;
          ring.rotation.y += 0.002 + index * 0.00012;
        });
      }
      stage.rotation.x += (targetRotation.x - stage.rotation.x) * 0.08;
      stage.rotation.y += (targetRotation.y - stage.rotation.y) * 0.08;
      render();
      frame = window.requestAnimationFrame(animate);
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetRotation.y += (event.clientX - pointerX) * 0.004;
      targetRotation.x = THREE.MathUtils.clamp(targetRotation.x + (event.clientY - pointerY) * 0.003, -0.65, 0.65);
      pointerX = event.clientX;
      pointerY = event.clientY;
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    media.addEventListener('change', onMotionChange);

    const observer = new ResizeObserver(layout);
    observer.observe(mount);
    layout();
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener('change', onMotionChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} data-webgl="pending" className="absolute inset-0 z-0 overflow-hidden bg-primary" aria-hidden="true" />;
}
