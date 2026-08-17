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

type ProductSpriteConfig = {
  anchor: [number, number];
  depth: number;
  mobilePosition: [number, number, number];
  scale: number;
  src: string;
};

const ringConfigs: RingConfig[] = [
  { position: [0, -1.1, -0.5], rotation: [Math.PI / 2.2, 0, Math.PI / 4], color: 0x238653, roughness: 0.58 },
  { position: [0.5, 1.4, -1], rotation: [0.2, Math.PI / 4, Math.PI / 2], color: 0x2867a3, roughness: 0.32, metalness: 0.2, scale: 0.7, thickness: 0.12 },
  { position: [0.5, 1.4, -0.8], rotation: [-0.1, -Math.PI / 4, -Math.PI / 2.2], color: 0xc62828, roughness: 0.5, scale: 0.8, thickness: 0.07 },
];

const productSpriteConfigs: ProductSpriteConfig[] = [
  { anchor: [0.2, 0.48], mobilePosition: [-1.85, 0.4, 0], depth: 0, scale: 3, src: '/hero-products/1.png' },
  { anchor: [0.84, 0.5], mobilePosition: [1.8, 0.34, 0.5], depth: 0.5, scale: 3.6, src: '/hero-products/2.png' },
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
    mount.appendChild(renderer.domElement);
    mount.dataset.webgl = 'ready';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const stage = new THREE.Group();
    scene.add(stage);

    const rings = ringConfigs.map((config) => {
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
      stage.add(mesh);
      return mesh;
    });

    const textureLoader = new THREE.TextureLoader();
    const productSprites = productSpriteConfigs.map((config) => {
      const texture = textureLoader.load(config.src);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.z = config.depth;
      sprite.scale.set(config.scale, config.scale, 1);
      stage.add(sprite);
      return { material, sprite, texture };
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
        productSprites.forEach(({ sprite }, index) => {
          const config = productSpriteConfigs[index];
          sprite.position.set(...config.mobilePosition);
          sprite.scale.set(config.scale, config.scale, 1);
          sprite.visible = true;
        });
      } else {
        stage.position.set(0.85, 0, 0);
        stage.scale.setScalar(1);
        const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
        const viewWidth = viewHeight * camera.aspect;
        productSprites.forEach(({ sprite }, index) => {
          const config = productSpriteConfigs[index];
          const x = (config.anchor[0] - 0.5) * viewWidth - stage.position.x;
          const y = (0.5 - config.anchor[1]) * viewHeight;
          sprite.position.set(x, y, config.depth);
          sprite.scale.set(config.scale, config.scale, 1);
        });
        productSprites.forEach(({ sprite }) => {
          sprite.visible = true;
        });
      }
      render();
    };

    const animate = () => {
      if (!reduceMotion) {
        rings.forEach((ring, index) => {
          ring.rotation.x += 0.0015 + index * 0.00015;
          ring.rotation.y += 0.002 + index * 0.00012;
        });
      }
      render();
      frame = window.requestAnimationFrame(animate);
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
    };

    media.addEventListener('change', onMotionChange);

    const observer = new ResizeObserver(layout);
    observer.observe(mount);
    layout();
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener('change', onMotionChange);
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      productSprites.forEach(({ material, sprite, texture }) => {
        stage.remove(sprite);
        texture.dispose();
        material.dispose();
      });
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} data-webgl="pending" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-primary" aria-hidden="true" />;
}
