import * as THREE from 'three';

const initHero = () => {
  const root = document.querySelector('[data-oubei-hero]');
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const descriptors = [...root.querySelectorAll('[data-oubei-ring]')];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 8;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  root.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff, 1.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(3, 4, 6); scene.add(key);
  const meshes = descriptors.map((node, index) => {
    const size = node.dataset.size === 'large' ? 1.28 : node.dataset.size === 'medium' ? 0.95 : 0.72;
    const geometry = new THREE.TorusGeometry(size, size * 0.16, 24, 96);
    const material = new THREE.MeshStandardMaterial({ color: node.dataset.tone || '#c79a3b', metalness: 0.45, roughness: 0.28 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.65 + (index % 2) * 0.22, (index - 2) * 0.18, -index * 0.08);
    mesh.rotation.set(index * 0.19, index * 0.31, index * 0.13);
    scene.add(mesh);
    return { mesh, speed: Number(node.dataset.speed || 0.002) };
  });
  const resize = () => { const width = root.clientWidth || 500; const height = root.clientHeight || 500; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
  const observer = new ResizeObserver(resize); observer.observe(root); resize();
  let frame = 0;
  const animate = () => { frame = requestAnimationFrame(animate); meshes.forEach(({ mesh, speed }) => { mesh.rotation.y += speed; mesh.rotation.x += speed * 0.45; }); renderer.render(scene, camera); };
  animate();
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); observer.disconnect(); meshes.forEach(({ mesh }) => { mesh.geometry.dispose(); mesh.material.dispose(); }); renderer.dispose(); });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHero); else initHero();
