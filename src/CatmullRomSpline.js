import * as THREE from 'three';

// Scene তৈরি করা
const scene = new THREE.Scene();

// Camera তৈরি করা
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderer তৈরি করা
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// কিছু 3D পয়েন্ট ডিফাইন করা
const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(-5, 5, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(5, -5, 0),
    new THREE.Vector3(10, 0, 0)
];

// Catmull-Rom Spline তৈরি করা
const curve = new THREE.CatmullRomCurve3(points);

// এই curve থেকে জ্যামিতি তৈরি করা
const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100000));

// একটি লাইন ম্যাটেরিয়াল তৈরি করা
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// লাইন তৈরি করে scene-এ যোগ করা
const line = new THREE.Line(geometry, material);
scene.add(line);

// একটি গোলক (Sphere) তৈরি করা যেটা curve এর উপর মুভ করবে
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const object = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(object);

// Set up orbit controls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);

let t = 0; // সময় অনুযায়ী অবস্থান ট্র্যাক করা

function animate() {
    requestAnimationFrame(animate);
    
    // t-এর মান 0 থেকে 1 এর মধ্যে থাকবে
    t += 0.001;
    if (t > 1) t = 0;

    // Curve অনুযায়ী object-এর position সেট করা
    const position = curve.getPointAt(t);
    console.log(position);
    object.position.copy(position);

    renderer.render(scene, camera);
}

animate();

// Responsive Window Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

