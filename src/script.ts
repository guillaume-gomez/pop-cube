import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import gsap from 'gsap';
import * as dat from 'lil-gui';


const coolColors = [0x53494B, 0x91C7BA, 0xB33951, 0xE3D081 ];
const warmColors = [0xd4ca95, 0xf3a57d, 0xce7e82, 0x886489, 0x5e85a3, 0x886489, 0xa83d66, 0xdb5e5d, 0xf78f57, 0xe2bc74, 0xce7e82, 0xdb5e5d, 0xf1784f, 0xf9a14c, 0xf3c769, 0xf3a57d, 0xf78f57, 0xf9a14c, 0xfbbe49, 0xfdd769, 0xd4ca95, 0xe2bc74, 0xf3c769, 0xfdd769, 0xf5e67e ];

let lastCubeY = 0;
const cubeSize = 1;
const eachLight = 6;

// Scene
const scene = new THREE.Scene();
const indexBackgroundColor = Math.floor(coolColors.length * Math.random());
scene.background = new THREE.Color(coolColors[indexBackgroundColor]);
// remove the choosed color to have a plane in a different color
coolColors.splice(indexBackgroundColor, 1);

const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);



// Object
const planeGeometry = new THREE.BoxGeometry(10, 10, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: coolColors[Math.floor(coolColors.length * Math.random())] });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotateX(-Math.PI/2);
planeMesh.position.setY(-0.5);
scene.add(planeMesh);

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        console.log('loaded')
    }
)
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Nono :)',
            {
                font: font,
                size: 0.75,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textMaterial = new THREE.MeshToonMaterial({ color: warmColors[Math.floor(warmColors.length * Math.random())] });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(1.75, 0.25, 4);
        scene.add(text);
    }
)

// Lights
const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820);
scene.add(hemiLight);

const spotlight = new THREE.SpotLight(0xffa95c);
spotlight.castShadow = true;
scene.add(spotlight);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

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

    spotlight.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10
    );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

function popCube() {
    const material = new THREE.MeshToonMaterial({ color: warmColors[Math.floor(warmColors.length * Math.random())] });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setY(lastCubeY + 10);
    mesh.rotation.y = 2 * Math.PI * Math.random();

    gsap.to(mesh.position, { delay: 0.5, duration: 1, y: lastCubeY + 0.5, ease: "circ.out" });
    const direction  = camera.getWorldDirection(mesh.position.clone());
    gsap.to(camera.position, { duration: 1, x: camera.position.x - direction.x * 1.25, y: camera.position.y - direction.y * 1.25, z: camera.position.z - direction.z * 1.25, ease: "slow(0.7, 0.7, false)" })
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

//https://www.naughtyblog.org/porn-world-anissa-kate-emily-mayers-shalina-devine/