import * as THREE from 'three';

const tuple = (value, fallback) => {
  const parsed = String(value || '').split(',').map(Number);
  return parsed.length === 3 && parsed.every(Number.isFinite) ? parsed : fallback;
};

const initHero = () => {
  const mount = document.querySelector('[data-oubei-hero]');
  if (!mount) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch { return; }
  renderer.setClearColor(0x001e40, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'; mount.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.set(0, 0, 6.5); const stage = new THREE.Group(); scene.add(stage);
  const rings = [...mount.querySelectorAll('[data-oubei-ring]')].map((node) => { const geometry = new THREE.TorusGeometry(1, Number(node.dataset.ringThickness || 0.15), 36, 128); const material = new THREE.MeshPhysicalMaterial({ color: node.dataset.ringColor || '#238653', roughness: 0.45, metalness: 0.08, clearcoat: 0.35, clearcoatRoughness: 0.22 }); const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...tuple(node.dataset.ringPosition, [0, 0, 0])); mesh.rotation.set(...tuple(node.dataset.ringRotation, [0, 0, 0])); mesh.scale.setScalar(Number(node.dataset.ringScale || 1)); mesh.castShadow = true; mesh.receiveShadow = true; stage.add(mesh); return mesh; });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), new THREE.ShadowMaterial({ color: 0x000914, opacity: 0.24 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.45; floor.receiveShadow = true; stage.add(floor);
  scene.add(new THREE.HemisphereLight(0xd8e7ff, 0x001126, 2.4)); const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(-5, 7, 8); key.castShadow = true; scene.add(key); const blue = new THREE.PointLight(0x8ab8ff, 32, 18); blue.position.set(5, 2, 5); scene.add(blue); const warm = new THREE.PointLight(0xff9b7e, 20, 14); warm.position.set(-3, -1, 3); scene.add(warm);
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; let frame = 0;
  const layout = () => { const width = mount.clientWidth; const height = mount.clientHeight; if (!width || !height) return; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); if (width < 768) { stage.position.set(0.3, 0.58, 0); stage.scale.setScalar(THREE.MathUtils.clamp(width / 900, 0.48, 0.7)); } else { stage.position.set(1.25, 0, 0); stage.scale.setScalar(1); } renderer.render(scene, camera); };
  const animate = () => { if (!reduceMotion) rings.forEach((ring, index) => { ring.rotation.x += 0.0015 + index * 0.00015; ring.rotation.y += 0.002 + index * 0.00012; }); renderer.render(scene, camera); frame = requestAnimationFrame(animate); }; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const onMotionChange = (event) => { reduceMotion = event.matches; }; media.addEventListener('change', onMotionChange); const observer = new ResizeObserver(layout); observer.observe(mount); layout(); animate(); window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); observer.disconnect(); media.removeEventListener('change', onMotionChange); rings.forEach((ring) => { ring.geometry.dispose(); ring.material.dispose(); }); floor.geometry.dispose(); floor.material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); }, { once: true });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHero); else initHero();
