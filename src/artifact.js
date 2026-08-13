import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Clock,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";

const GRAPHITE = 0x111418;
const SHELL_WHITE = 0xf7f7f3;
const SIGNAL = 0xa1ffcb;

const OUTER_POINTS = [
  [-2.62, -2.18],
  [-2.22, -2.62],
  [-0.72, -2.62],
  [-0.52, -2.48],
  [0.52, -2.48],
  [0.72, -2.62],
  [2.22, -2.62],
  [2.62, -2.18],
  [2.62, -0.72],
  [2.48, -0.52],
  [2.48, 0.52],
  [2.62, 0.72],
  [2.62, 2.18],
  [2.22, 2.62],
  [0.72, 2.62],
  [0.52, 2.48],
  [-0.52, 2.48],
  [-0.72, 2.62],
  [-2.22, 2.62],
  [-2.62, 2.18],
  [-2.62, 0.72],
  [-2.48, 0.52],
  [-2.48, -0.52],
  [-2.62, -0.72],
];

function createShape(points, depth, material, bevel) {
  const shape = new Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 2,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return new Mesh(geometry, material);
}

function scaledPoints(points, scaleX, scaleY = scaleX) {
  return points.map(([x, y]) => [x * scaleX, y * scaleY]);
}

function easeOutExpo(value) {
  return value === 1 ? 1 : 1 - 2 ** (-10 * value);
}

export function initArtifact(canvas, stage, { reducedMotion = false } = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new Scene();
  const camera = new PerspectiveCamera(31, 1, 0.1, 100);
  camera.position.set(0.18, 0.1, 10.7);
  camera.lookAt(0, 0, 0);

  const materials = {
    shell: new MeshStandardMaterial({ color: SHELL_WHITE, metalness: 0.08, roughness: 0.28 }),
    face: new MeshStandardMaterial({ color: GRAPHITE, metalness: 0.58, roughness: 0.3 }),
    signal: new MeshStandardMaterial({ color: SIGNAL, emissive: SIGNAL, emissiveIntensity: 1.6, roughness: 0.28 }),
  };

  const world = new Group();
  const coin = new Group();
  world.add(coin);
  scene.add(world);

  const parts = [];
  const register = (mesh, delay, startZ) => {
    mesh.userData.delay = delay;
    mesh.userData.startZ = startZ;
    mesh.userData.homePosition = mesh.position.clone();
    mesh.userData.homeQuaternion = mesh.quaternion.clone();
    mesh.position.z += startZ;
    mesh.rotation.x += startZ > 0 ? 0.14 : -0.14;
    mesh.scale.setScalar(reducedMotion ? 1 : 0.88);
    if (reducedMotion) {
      mesh.position.copy(mesh.userData.homePosition);
      mesh.quaternion.copy(mesh.userData.homeQuaternion);
    }
    coin.add(mesh);
    parts.push(mesh);
    return mesh;
  };

  // Match the visible mark to the supplied image's white boundary. The rear plate
  // is deliberately smaller and recessed so its thickness never projects outside
  // that boundary when the coin is viewed at an angle.
  const markPoints = scaledPoints(OUTER_POINTS, 0.75, 0.79);
  const back = createShape(scaledPoints(OUTER_POINTS, 0.68, 0.72), 0.42, materials.face, 0.07);
  back.position.z = -0.08;
  register(back, 0.06, 1.5);

  // Give the white outer contour real depth. Its side wall is the visible outer
  // shell, so the darker inner material cannot peek through the z-axis edge.
  const shell = createShape(markPoints, 0.36, materials.shell, 0.04);
  shell.position.z = 0.2;
  register(shell, 0.18, 1.2);

  // The former bronze fill is now a recessed graphite face inside the white shell.
  const blackFill = createShape(scaledPoints(markPoints, 0.985), 0.16, materials.face, 0.045);
  blackFill.position.z = 0.34;
  register(blackFill, 0.25, -0.9);

  const logoMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.03,
    depthWrite: false,
    side: DoubleSide,
  });
  const logoPlane = new Mesh(new PlaneGeometry(5.28, 5.28), logoMaterial);
  logoPlane.position.set(0, 0, 0.53);
  register(logoPlane, 0.32, -1.35);

  const centerPin = new Mesh(new BoxGeometry(0.08, 0.08, 0.06), materials.signal);
  centerPin.position.set(0, 0, 0.59);
  register(centerPin, 0.41, 1.25);

  const textureLoader = new TextureLoader();
  textureLoader.load(
    new URL("logo-flat.png", document.baseURI).href,
    (texture) => {
      texture.colorSpace = SRGBColorSpace;
      logoMaterial.map = texture;
      logoMaterial.needsUpdate = true;
    },
    undefined,
    () => {
      const status = document.querySelector("[data-artifact-status]");
      if (status) status.textContent = "COIN / NO TEXTURE";
    },
  );

  coin.rotation.set(-0.06, -0.2, 0.02);

  const ambient = new HemisphereLight(0xffffff, 0x2f281d, 2.2);
  scene.add(ambient);
  const key = new DirectionalLight(0xfff1d0, 4.1);
  key.position.set(3.8, 4.5, 6.8);
  scene.add(key);
  const rim = new DirectionalLight(SIGNAL, 2.2);
  rim.position.set(-4.2, 1.4, -4.8);
  scene.add(rim);

  const assemblyStart = performance.now();
  const pointer = new Vector2();
  const pointerTarget = new Vector2();
  const clock = new Clock();
  let frameId = 0;
  let visible = true;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  const status = document.querySelector("[data-artifact-status]");

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 480 ? 35 : 31;
    camera.position.z = width < 480 ? 12.8 : 10.7;
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
      scrollVelocity = MathUtils.clamp(delta * 0.004, -0.16, 0.16);
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
        const local = MathUtils.clamp((assemblyElapsed - part.userData.delay) / 0.72, 0, 1);
        const eased = easeOutExpo(local);
        part.position.lerp(part.userData.homePosition, eased);
        part.quaternion.slerp(part.userData.homeQuaternion, eased);
        part.scale.setScalar(MathUtils.lerp(part.scale.x, 1, eased));
      });

      world.position.y = Math.sin(elapsed * 1.1) * 0.035;
      world.rotation.y = pointer.x * 0.17 + scrollVelocity;
      world.rotation.x = pointer.y * 0.08;
      world.rotation.z = scrollVelocity * -0.18;

      if (assemblyElapsed > 1.5 && status) status.textContent = "INTERACTIVE";
    } else if (status) {
      status.textContent = "STATIC MODE";
    }

    renderer.render(scene, camera);
    if (!reducedMotion) frameId = requestAnimationFrame(render);
  }

  renderer.render(scene, camera);
  if (!reducedMotion) frameId = requestAnimationFrame(render);
}
