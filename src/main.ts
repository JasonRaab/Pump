import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbbbbbbff);

// Set up the camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

// Load the GLB pump model
const loader = new GLTFLoader();
let pump: THREE.Object3D | null = null;

loader.load("./models/DougnutV4.glb", (gltf) => {
    pump = gltf.scene;
    pump.scale.set(1, 1, 1);
    scene.add(pump);
}, undefined, (error) => {
    console.error("Error loading model:", error);
});

// Track Mouse and Touch Dragging to Rotate Object
let isDragging = false;
let previousX = 0;
let previousY = 0;
let previousDistance = 0; // For pinch zoom

function startDragging(x: number, y: number) {
    isDragging = true;
    previousX = x;
    previousY = y;
}

function stopDragging() {
    isDragging = false;
}

function dragRotate(x: number, y: number) {
    if (!isDragging || !pump) return;

    const deltaX = x - previousX;
    const deltaY = y - previousY;

    pump.rotation.y += deltaX * 0.01;
    pump.rotation.x += deltaY * 0.01;

    previousX = x;
    previousY = y;
}

// Mouse events
window.addEventListener("mousedown", (event) => startDragging(event.clientX, event.clientY));
window.addEventListener("mouseup", stopDragging);
window.addEventListener("mousemove", (event) => dragRotate(event.clientX, event.clientY));

// Touch events for rotation
window.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) {
        startDragging(event.touches[0].clientX, event.touches[0].clientY);
    } else if (event.touches.length === 2) {
        previousDistance = getTouchDistance(event.touches);
    }
});
window.addEventListener("touchend", (event) => {
    if (event.touches.length < 2) stopDragging();
});
window.addEventListener("touchmove", (event) => {
    if (event.touches.length === 1) {
        dragRotate(event.touches[0].clientX, event.touches[0].clientY);
    } else if (event.touches.length === 2) {
        handlePinchZoom(event.touches);
    }
});

// Pinch zoom function
function getTouchDistance(touches: TouchList) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function handlePinchZoom(touches: TouchList) {
    const distance = getTouchDistance(touches);
    if (!previousDistance) return;

    const zoomSpeed = 0.02;
    const delta = distance - previousDistance;
    camera.position.z -= delta * zoomSpeed;
    camera.position.z = Math.max(1, Math.min(10, camera.position.z));

    previousDistance = distance;
}

// Scroll Wheel Zoom (Desktop)
window.addEventListener("wheel", (event) => {
    const zoomSpeed = 0.005;
    camera.position.z += event.deltaY * zoomSpeed;
    camera.position.z = Math.max(1, Math.min(10, camera.position.z));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
