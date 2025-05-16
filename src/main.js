import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import spline from './Spline.js';

const width = window.innerWidth
const height = window.innerHeight
let fov = 75
let aspect= width/height
let near = 0.1
let far = 1000

// Create scene
const scene = new THREE.Scene()

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 5);

// Create WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)

// Add exponential fog to the scene (color and density)
const fog = new THREE.FogExp2(0x000000, 0.3);  // Light gray fog with density
scene.fog = fog;

// scene.fog = new THREE.FogExp2(0x000000, 0.3);

// Create a mesh with tube geometry
const tube = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true 
});
const mesh = new THREE.Mesh(tube, material)
scene.add(mesh);

// Setup controls
const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera)

// Add hemisphere light to the scene
const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight)

function updateCamera(t) {
    const time = t * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tube.parameters.path.getPointAt(p);
    const lookAt = tube.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

function animate(t = 0) {
    updateCamera(t);
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()

// Responsive window resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
