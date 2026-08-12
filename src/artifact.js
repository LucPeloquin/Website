import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Clock,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from "three";

const THREE = {
  ACESFilmicToneMapping,
  BoxGeometry,
  Clock,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
};

const GOLD = 0xb9954b;
const GRAPHITE = 0x111418;
const IVORY = 0xe7e1d4;
const COGNAC = 0x6b472f;
const AMBER = 0xffb018;
const VIOLET = 0x7956ff;
const CYAN = 0x62d7d0;

function easeOutExpo(value) {
  return value === 1 ? 1 : 1 - 2 ** (-10 * value);
}

function createExtrudedShape(points, depth, material, bevel = 0.035) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 2,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

function createBeam(start, end, thickness, depth, material) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, thickness, depth), material);
  mesh.position.set((start.x + end.x) / 2, (start.y + end.y) / 2, 0);
  mesh.rotation.z = Math.atan2(dy, dx);
  return mesh;
}

function addCylinder(group, radius, length, x, y, z, material, radialSegments = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, radialSegments), material);
  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x, y, z);
  group.add(mesh);
  return mesh;
}

export function initArtifact(canvas, stage, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0.15, 0.55, 11.8);
  camera.lookAt(0.15, 0.2, 0);

  const materials = {
    gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.86, roughness: 0.24 }),
    graphite: new THREE.MeshStandardMaterial({ color: GRAPHITE, metalness: 0.54, roughness: 0.34 }),
    ivory: new THREE.MeshStandardMaterial({ color: IVORY, metalness: 0.05, roughness: 0.38 }),
    cognac: new THREE.MeshStandardMaterial({ color: COGNAC, metalness: 0.22, roughness: 0.42 }),
    amber: new THREE.MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 3.2, metalness: 0.3, roughness: 0.25 }),
    violet: new THREE.MeshStandardMaterial({ color: VIOLET, emissive: VIOLET, emissiveIntensity: 2.6, roughness: 0.25 }),
    cyan: new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 2.2, roughness: 0.2 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: AMBER,
      emissive: AMBER,
      emissiveIntensity: 1.9,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      roughness: 0.08,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
  };

  const world = new THREE.Group();
  const instrument = new THREE.Group();
  world.add(instrument);
  scene.add(world);

  const parts = [];
  const register = (mesh, delay = 0) => {
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.userData.delay = delay;
    instrument.add(mesh);
    parts.push(mesh);
    return mesh;
  };

  // Original precision-object silhouette: altered proportions, vent rhythm, and stock geometry.
  register(
    createExtrudedShape(
      [[-1.55, -0.28], [-1.28, -0.58], [-0.54, -0.58], [-0.15, -0.36], [1.05, -0.24], [1.2, 0.32], [0.9, 0.57], [-0.86, 0.52], [-1.55, 0.16]],
      0.5,
      materials.graphite,
      0.055,
    ),
    0.22,
  );

  register(
    createExtrudedShape(
      [[0.72, 0.2], [4.48, 0.2], [4.68, 0.08], [4.62, -0.02], [1.18, -0.06], [0.92, -0.2], [0.56, -0.12]],
      0.3,
      materials.gold,
    ),
    0.38,
  );
  register(
    createExtrudedShape(
      [[0.88, 0.5], [4.5, 0.48], [4.66, 0.34], [4.46, 0.26], [1.05, 0.28], [0.58, 0.42]],
      0.26,
      materials.gold,
    ),
    0.41,
  );

  addCylinder(instrument, 0.105, 5.65, 1.82, 0.2, 0, materials.graphite, 18).userData.delay = 0.34;
  parts.push(instrument.children.at(-1));
  addCylinder(instrument, 0.16, 0.44, 4.56, 0.2, 0, materials.gold, 18).userData.delay = 0.52;
  parts.push(instrument.children.at(-1));
  addCylinder(instrument, 0.112, 0.18, 4.8, 0.2, 0, materials.graphite, 18).userData.delay = 0.56;
  parts.push(instrument.children.at(-1));

  for (let index = 0; index < 9; index += 1) {
    const width = index % 3 === 1 ? 0.23 : 0.29;
    const vent = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, 0.34), materials.graphite);
    vent.position.set(1.3 + index * 0.35, 0.28, 0);
    vent.rotation.z = index % 2 ? -0.08 : 0.08;
    register(vent, 0.4 + index * 0.025);
  }

  const lowerInset = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.055, 0.34), materials.graphite);
  lowerInset.position.set(2.62, -0.02, 0);
  register(lowerInset, 0.45);

  // Skeletal stock with a different asymmetric zig-zag rhythm from the source reference.
  [
    [new THREE.Vector2(-1.25, 0.14), new THREE.Vector2(-3.92, 0.08), 0.22, materials.cognac],
    [new THREE.Vector2(-1.2, -0.24), new THREE.Vector2(-3.72, -0.72), 0.22, materials.cognac],
    [new THREE.Vector2(-2.03, 0.08), new THREE.Vector2(-2.54, -0.38), 0.2, materials.gold],
    [new THREE.Vector2(-2.58, -0.38), new THREE.Vector2(-3.1, -0.02), 0.2, materials.gold],
    [new THREE.Vector2(-3.1, -0.03), new THREE.Vector2(-3.72, -0.72), 0.2, materials.gold],
    [new THREE.Vector2(-3.82, 0.08), new THREE.Vector2(-4.12, -0.67), 0.25, materials.gold],
  ].forEach(([start, end, thickness, material], index) => {
    register(createBeam(start, end, thickness, 0.42, material), 0.08 + index * 0.045);
  });

  const butt = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.92, 0.46), materials.ivory);
  butt.position.set(-4.18, -0.3, 0);
  butt.rotation.z = -0.08;
  register(butt, 0.04);

  const grip = createExtrudedShape(
    [[-1.13, -0.45], [-0.62, -0.47], [-0.8, -1.35], [-1.18, -1.28], [-1.42, -0.74]],
    0.42,
    materials.ivory,
    0.045,
  );
  register(grip, 0.19);

  const gripInsert = createExtrudedShape(
    [[-1.08, -0.56], [-0.73, -0.57], [-0.88, -1.13], [-1.12, -1.08], [-1.27, -0.76]],
    0.46,
    materials.graphite,
    0.025,
  );
  register(gripInsert, 0.24);

  const cheek = createExtrudedShape(
    [[-1.45, 0.5], [-0.2, 0.52], [0.12, 0.35], [-0.18, 0.16], [-1.38, 0.16]],
    0.53,
    materials.ivory,
    0.04,
  );
  register(cheek, 0.28);

  const triggerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 8, 22, Math.PI * 1.45), materials.gold);
  triggerGuard.position.set(-0.44, -0.62, 0);
  triggerGuard.rotation.z = -0.72;
  register(triggerGuard, 0.3);

  // Scope, energy cell, and three holographic range plates.
  const scopeBarrel = addCylinder(instrument, 0.155, 1.92, -0.08, 0.92, 0, materials.graphite, 20);
  scopeBarrel.userData.delay = 0.54;
  parts.push(scopeBarrel);
  [-0.94, 0.72].forEach((x, index) => {
    const ring = addCylinder(instrument, 0.205, 0.16, x, 0.92, 0, materials.gold, 20);
    ring.userData.delay = 0.58 + index * 0.04;
    parts.push(ring);
  });
  const frontLens = addCylinder(instrument, 0.13, 0.035, 0.91, 0.92, 0, materials.amber, 20);
  frontLens.userData.delay = 0.66;
  parts.push(frontLens);

  const energyCell = addCylinder(instrument, 0.085, 0.62, 0.17, 0.92, -0.19, materials.violet, 12);
  energyCell.userData.delay = 0.63;
  parts.push(energyCell);

  [-0.34, 0, 0.34].forEach((x, index) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.58), materials.gold);
    frame.position.set(x, 1.18, 0);
    register(frame, 0.66 + index * 0.055);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.5), materials.glass);
    plate.position.set(x + 0.022, 1.18, 0);
    plate.rotation.y = Math.PI / 2;
    register(plate, 0.69 + index * 0.055);
  });

  const cyanDetail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.53), materials.cyan);
  cyanDetail.position.set(0.64, 0.5, 0);
  register(cyanDetail, 0.61);

  // A restrained JL rail mark on the ivory cheek panel.
  const markGroup = new THREE.Group();
  const markJ = createBeam(new THREE.Vector2(-0.58, 0.38), new THREE.Vector2(-0.58, 0.25), 0.035, 0.56, materials.gold);
  const markJFoot = createBeam(new THREE.Vector2(-0.58, 0.25), new THREE.Vector2(-0.68, 0.25), 0.035, 0.56, materials.gold);
  const markL = createBeam(new THREE.Vector2(-0.48, 0.38), new THREE.Vector2(-0.48, 0.25), 0.035, 0.56, materials.gold);
  const markLFoot = createBeam(new THREE.Vector2(-0.48, 0.25), new THREE.Vector2(-0.38, 0.25), 0.035, 0.56, materials.gold);
  [markJ, markJFoot, markL, markLFoot].forEach((mark) => register(mark, 0.62));
  instrument.add(markGroup);

  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), materials.amber);
  pulse.position.set(-3.7, 0.54, 0.28);
  pulse.visible = false;
  instrument.add(pulse);

  instrument.position.set(0, 0, 0);
  instrument.rotation.set(-0.035, -0.22, 0.018);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x3c3325, 2.15);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff4dc, 4.4);
  key.position.set(2.5, 5.5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa1ffcb, 2.6);
  rim.position.set(-5, 1.5, -4);
  scene.add(rim);

  const assemblyStart = performance.now();
  parts.forEach((part, index) => {
    part.userData.homePosition = part.position.clone();
    part.userData.homeQuaternion = part.quaternion.clone();
    const direction = index % 2 === 0 ? 1 : -1;
    part.position.z += direction * (1.8 + (index % 5) * 0.22);
    part.position.y += direction * 0.22;
    part.rotation.x += direction * 0.13;
    part.scale.setScalar(reducedMotion ? 1 : 0.93);
    if (reducedMotion) {
      part.position.copy(part.userData.homePosition);
      part.quaternion.copy(part.userData.homeQuaternion);
    }
  });

  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const clock = new THREE.Clock();
  let visible = true;
  let frameId = 0;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let sweepComplete = reducedMotion;

  const status = document.querySelector("[data-artifact-status]");

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 480 ? 38 : 32;
    camera.position.z = width < 480 ? 20.5 : 11.8;
    instrument.rotation.z = width < 480 ? -0.12 : 0.018;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderer.render(scene, camera);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  });
  stage.addEventListener("pointerleave", () => pointerTarget.set(0, 0));

  window.addEventListener(
    "scroll",
    () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollVelocity = THREE.MathUtils.clamp(delta * 0.004, -0.22, 0.22);
    },
    { passive: true },
  );

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frameId && !reducedMotion) frameId = requestAnimationFrame(render);
    },
    { rootMargin: "100px" },
  );
  visibilityObserver.observe(stage);

  function render(now) {
    frameId = 0;
    if (!visible) return;

    const elapsed = clock.getElapsedTime();
    const assemblyElapsed = (now - assemblyStart) / 1000;
    pointer.lerp(pointerTarget, 0.06);
    scrollVelocity *= 0.92;

    if (!reducedMotion) {
      parts.forEach((part) => {
        const local = THREE.MathUtils.clamp((assemblyElapsed - part.userData.delay) / 0.78, 0, 1);
        const eased = easeOutExpo(local);
        part.position.lerp(part.userData.homePosition, eased);
        part.quaternion.slerp(part.userData.homeQuaternion, eased);
        part.scale.setScalar(THREE.MathUtils.lerp(part.scale.x, 1, eased));
      });

      const assembled = assemblyElapsed > 1.42;
      world.position.y = Math.sin(elapsed * 1.15) * 0.035;
      world.rotation.y = pointer.x * 0.105 + scrollVelocity;
      world.rotation.x = pointer.y * 0.055;
      world.rotation.z = scrollVelocity * -0.22;

      if (assembled) {
        const sweep = Math.min(1, (assemblyElapsed - 1.42) / 0.82);
        pulse.visible = !sweepComplete;
        pulse.position.x = THREE.MathUtils.lerp(-3.7, 4.7, sweep);
        pulse.scale.setScalar(1 + Math.sin(sweep * Math.PI) * 2.4);
        if (sweep >= 1 && !sweepComplete) {
          sweepComplete = true;
          pulse.visible = false;
          if (status) status.textContent = "INTERACTIVE";
        }
      }
    } else {
      pulse.visible = false;
      if (status) status.textContent = "STATIC MODE";
    }

    renderer.render(scene, camera);
    if (!reducedMotion) frameId = requestAnimationFrame(render);
  }

  renderer.render(scene, camera);
  if (!reducedMotion) frameId = requestAnimationFrame(render);
}
