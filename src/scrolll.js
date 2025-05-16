import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from './Spline.js';

const width = window.innerWidth;
const height = window.innerHeight;
let fov = 75;
let aspect = width / height;
let near = 0.1;
let far = 1000;

/**
 * Basic setup: Scene, Camera, Renderer
 */

// Create scene
const scene = new THREE.Scene();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 5);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

/**
 * Geometry, Material, Mesh
 */

// Create a tube geometry following the spline path
const tube = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true 
});
const mesh = new THREE.Mesh(tube, material);
scene.add(mesh);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add hemisphere light to the scene
const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);

scene.fog= new THREE.FogExp2(0x000000,0.3);

/**
 * Scroll-based Camera Movement
 */
let scrollPosition = 0;

window.addEventListener('wheel', (event) => {
    // Adjust scroll position based on wheel movement
    scrollPosition += event.deltaY * 0.0005; // Sensitivity factor

    // Clamp scroll position between 0 and 1
    scrollPosition = Math.max(0, Math.min(1, scrollPosition));

    updateCamera(scrollPosition);
});

function updateCamera(p) {
    const pos = tube.parameters.path.getPointAt(p);
    const lookAt = tube.parameters.path.getPointAt((p + 0.02) % 1);

    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

/**
 * Animation Loop
 */
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Responsive Window Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
