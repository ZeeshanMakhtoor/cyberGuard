import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COLORS = [0x0e7a98, 0xdc2626, 0xb45309, 0x15803d, 0x1e7a93];
const NODE_COUNT = 46;
const LINK_DISTANCE = 3.1;

/**
 * A slowly-rotating 3D network graph — nodes colored in the same
 * blue/red/amber/green semantic palette the dashboard uses for
 * accent/danger/warn/ok, connected by lines when close together.
 * Meant to read as "many signals, one connected risk picture" behind
 * the hero copy, not as a decorative animation for its own sake.
 */
export default function NetworkCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const nodes: { mesh: THREE.Mesh; velocity: THREE.Vector3 }[] = [];
    const bounds = 6.5;

    for (let i = 0; i < NODE_COUNT; i++) {
      const color = NODE_COLORS[i % NODE_COLORS.length];
      const geometry = new THREE.SphereGeometry(0.055 + Math.random() * 0.035, 12, 12);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds * 1.3,
        (Math.random() - 0.5) * bounds,
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.004,
        (Math.random() - 0.5) * 0.004,
      );
      group.add(mesh);
      nodes.push({ mesh, velocity });
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x9db4bf, transparent: true, opacity: 0.35 });
    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = NODE_COUNT * NODE_COUNT;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    function updateLines() {
      let idx = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i].mesh.position;
          const b = nodes[j].mesh.position;
          const dist = a.distanceTo(b);
          if (dist < LINK_DISTANCE) {
            linePositions[idx++] = a.x; linePositions[idx++] = a.y; linePositions[idx++] = a.z;
            linePositions[idx++] = b.x; linePositions[idx++] = b.y; linePositions[idx++] = b.z;
          }
        }
      }
      lineGeometry.setDrawRange(0, idx / 3);
      lineGeometry.attributes.position.needsUpdate = true;
    }

    let raf = 0;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      for (const n of nodes) {
        n.mesh.position.addScaledVector(n.velocity, dt * 60);
        (["x", "y", "z"] as const).forEach(axis => {
          if (Math.abs(n.mesh.position[axis]) > bounds) {
            n.velocity[axis] *= -1;
          }
        });
      }
      updateLines();

      if (!prefersReducedMotion) {
        group.rotation.y += dt * 0.06;
        group.rotation.x = Math.sin(Date.now() * 0.00012) * 0.08;
      }

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      nodes.forEach(n => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
