import * as THREE from "three";
import { COLORS } from "../constants/palette";

export function buildScene(canvas, cajas, camion, setCajaHover) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);

  const maxDim = Math.max(camion.largo, camion.ancho, camion.alto);
  scene.fog = new THREE.Fog(COLORS.bg, maxDim * 3, maxDim * 10);

  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, maxDim * 20);

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 15, 10);
  sun.castShadow = true;
  scene.add(sun);
  const fill = new THREE.PointLight(0x4488ff, 0.8, maxDim * 5);
  fill.position.set(-5, 5, -3);
  scene.add(fill);

  // Piso y grid
  const floorSize = Math.max(camion.largo, camion.ancho) * 3;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshStandardMaterial({ color: "#1a1d27", roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  scene.add(floor);
  scene.add(new THREE.GridHelper(floorSize, 30, COLORS.borderHover, COLORS.borderHover));

  // Camión wireframe
  const { largo, ancho, alto } = camion;
  const truckGeo = new THREE.BoxGeometry(largo, alto, ancho);
  const truck = new THREE.Mesh(truckGeo,
    new THREE.MeshBasicMaterial({ color: "#3a4a6b", wireframe: true, transparent: true, opacity: 0.35 })
  );
  truck.position.set(largo / 2, alto / 2, ancho / 2);
  scene.add(truck);
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(truckGeo),
    new THREE.LineBasicMaterial({ color: COLORS.truckWire, linewidth: 2 })
  );
  wireframe.position.copy(truck.position);
  scene.add(wireframe);

  // Cajas
  const meshes = [];
  cajas.forEach((caja) => {
    const geo = new THREE.BoxGeometry(caja.largo, caja.alto, caja.ancho);
    const mat = new THREE.MeshStandardMaterial({
      color: caja.color, transparent: true, opacity: 0.82,
      roughness: 0.4, metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      caja.x + caja.largo / 2,
      caja.y + caja.alto  / 2,
      caja.z + caja.ancho / 2
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = caja;
    scene.add(mesh);

    const edgeMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: "#000000", transparent: true, opacity: 0.5 })
    );
    edgeMesh.position.copy(mesh.position);
    scene.add(edgeMesh);
    meshes.push(mesh);
  });

  // Raycaster hover
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length > 0) {
      if (hoveredMesh !== hits[0].object) {
        if (hoveredMesh) hoveredMesh.material.emissive.setHex(0x000000);
        hoveredMesh = hits[0].object;
        hoveredMesh.material.emissive.setHex(0x444444);
        setCajaHover(hoveredMesh.userData);
        canvas.style.cursor = "pointer";
      }
    } else {
      if (hoveredMesh) {
        hoveredMesh.material.emissive.setHex(0x000000);
        hoveredMesh = null;
        setCajaHover(null);
        canvas.style.cursor = "default";
      }
    }
  }
  canvas.addEventListener("mousemove", onMouseMove);

  // Orbit manual
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  const initRadius = maxDim * 2.5;
  let theta = 0.9, phi = 0.6, radius = initRadius;
  const target = new THREE.Vector3(largo / 2, alto / 2, ancho / 2);

  function updateCamera() {
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(target);
  }
  updateCamera();

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener("mouseup", () => { isDragging = false; });
  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    theta -= (e.clientX - prevMouse.x) * 0.01;
    phi = Math.max(0.1, Math.min(Math.PI / 2, phi - (e.clientY - prevMouse.y) * 0.01));
    prevMouse = { x: e.clientX, y: e.clientY };
    updateCamera();
  });
  canvas.addEventListener("wheel", (e) => {
    radius = Math.max(maxDim * 0.5, Math.min(maxDim * 8, radius + e.deltaY * 0.02));
    updateCamera();
  });

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    const w2 = canvas.clientWidth, h2 = canvas.clientHeight;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  }
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(animId);
    canvas.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
  };
}