import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const matcapTextureStars = textureLoader.load('/textures/matcaps/10.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
matcapTextureStars.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()

let contactMe;
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Mara Saturio', 
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        textGeometry.center()
        scene.add(text)
    }
)

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry2 = new TextGeometry(
            'Creative developer', 
            {
                font: font,
                size: 0.3,
                depth: 0.1,
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry2, textMaterial)
        
        textGeometry2.translate(-1.65, -0.7, -0.05)

        scene.add(text)
    }
)

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry2 = new TextGeometry(
            'Lets talk!', 
            {
                font: font,
                size: 0.2,
                depth: 0.05,
                curveSegments: 3,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.01,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureStars })
        contactMe = new THREE.Mesh(textGeometry2, textMaterial)
        
        textGeometry2.translate(0.8, -1.1, -0.05)

        scene.add(contactMe);
    }
)

/**
 * Objects
 */
const starGeometry = new THREE.SphereGeometry(0.1, 0.1, 0.1)
const starMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextureStars })

for(let i = 0; i < 100; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial)

    star.position.x = (Math.random() - 0.5) * 10
    star.position.y = (Math.random() - 0.5) * 10
    star.position.z = (Math.random() - 0.5) * 10

    star.rotation.x = Math.random() * Math.PI
    star.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    star.scale.set(scale, scale, scale)

    scene.add(star)
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Cast a ray from the mouse position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        const intersectedObject = intersects[0].object;

        if (intersectedObject === contactMe) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    } else {
        document.body.style.cursor = 'auto';
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject === contactMe) {
            window.open('mailto:marasatilu@gmail.com');
        }
    }
});

tick()
