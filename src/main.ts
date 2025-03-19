import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 1. Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbbbbbbff); // Background color

// 2. Set up the camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // Adjusted for better visibility

// 3. Set up the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Add lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 5, 5); // Light position
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040, 10); // Soft light
scene.add(ambientLight);

// 5. Load the GLB pump model
const loader = new GLTFLoader();
let pump: THREE.Object3D | null = null; // Store the loaded model

loader.load("./models/DougnutV4.glb", (gltf) => {
    pump = gltf.scene;
    pump.scale.set(1, 1, 1); // Scale the model if needed
    scene.add(pump);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

// 6. Track Mouse Dragging to Rotate Object
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

window.addEventListener("mousemove", (event) => {
    if (!isDragging || !pump) return;

    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    // Rotate object based on mouse movement
    pump.rotation.y += deltaX * 0.01; // Horizontal drag rotates around Y-axis
    pump.rotation.x += deltaY * 0.01; // Vertical drag rotates around X-axis

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

window.addEventListener("wheel", (event) => {
    const zoomSpeed = 0.005; // Adjust for faster or slower zooming
    camera.position.z += event.deltaY * zoomSpeed;

    // Prevent zooming too far in or out
    camera.position.z = Math.max(1, Math.min(10, camera.position.z));
});

// 7. Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// 8. Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
