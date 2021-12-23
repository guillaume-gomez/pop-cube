import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import * as dat from 'lil-gui';

let lastCubeY = 0;
const cubeSize = 1;

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);


// Object
const planeGeometry = new THREE.BoxGeometry(10, 10, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotateX(-Math.PI/2);
planeMesh.position.setY(-0.5);

scene.add(planeMesh)


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Axe Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 1, 1);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
});

renderer.setSize(sizes.width, sizes.height);
//renderer.render(scene, camera);

// Controls
const controls = new OrbitControls( camera, renderer.domElement );

/**
 * Debug
 */
const gui = new dat.GUI({title: "Settings"});
const parameters = {
    pop: () =>
    {
        popCube();
    }
}
gui.add(parameters, 'pop');

function tick()
{
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

function popCube() {
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setY(lastCubeY + 10);
    mesh.rotation.y = 2 * Math.PI * Math.random();
    gsap.to(mesh.position, { delay: 0.5, duration: 1, y: lastCubeY + 0.5, ease: "circ.out" });
    gsap.to(camera.position, { duration: 1, y: camera.position.y + 1.25, z: camera.position.z + 1.25, ease: "slow(0.7, 0.7, false)" })
    scene.add(mesh);

    lastCubeY = lastCubeY + cubeSize;
}


window.onload = () => {
    popCube();
    tick();
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement;
    const canvas = document.querySelector('canvas.webgl');

    if(!canvas) {
        return;
    }

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        
    }
})