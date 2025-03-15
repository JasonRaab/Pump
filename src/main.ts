import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 1. Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbbbbbbff); // Background color

// 2. Set up the camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3); // Camera position

// 3. Set up the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5); // Light position
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
scene.add(ambientLight);

// 5. Add OrbitControls for mouse movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1.5; // Limit zoom in
controls.maxDistance = 10; // Limit zoom out
controls.maxPolarAngle = Math.PI / 2; // Restrict vertical movement

// 6. Load the GLB pump model
const loader = new GLTFLoader();
loader.load("./models/turbine.glb", (gltf) => {
    const pump = gltf.scene;
    pump.scale.set(1, 1, 1); // Scale the model if needed
    scene.add(pump);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

// 7. Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update camera movement
    renderer.render(scene, camera);
}
animate();

// 8. Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
