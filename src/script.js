import './style.css'
import * as THREE from 'three/build/three.module'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/src/loaders/FontLoader.js'
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let mobile;
// Detect Mobile Device
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    console.log("mobile device");
    mobile = true;
    document.getElementById('instruction').innerHTML = "SWIPE LEFT RIGHT UP DOWN";
    
  }else{
    // false for not mobile device
    console.log("not mobile device");
    mobile = false;
  }

    // document.getElementById('loading').style.display = "visible";
    // document.querySelector('canvas').style.visibility = "hidden";
    document.getElementById('loading').classList.add('active');
    document.querySelector('canvas').classList.add('inactive');
    // document.getElementById('wrapper').classList.add ('inactive');

// LOADING
jQuery(window).load(function () {
    document.getElementById('loading').style.display = "none";

    document.querySelector('canvas').classList.remove('inactive');

    document.querySelector('canvas').classList.add('active');

    document.querySelector('canvas').style.visibility = "visible";
    document.getElementById('wrapper').style.display = "block";   

    setTimeout(function () {
        console.log('page is loaded and 1 minute has passed');
    }, 60000);

});

    
// Menu
// const burger = document.getElementById('hamburger');
// const nav = document.getElementById('sidebar-wrapper');


// const overlay = document.getElementById('overlay-menu');
// const wrapper = document.getElementById('wrapper')
// const content = document.getElementById('content');

// let isClosed = false;
// let isClicked = false;
let checkPopup = false;

document.getElementById('portfolio').addEventListener('click', portfo);
function portfo(event){
    console.log('porto clicked');
}


// ------------------------       THREE JS      -------------------------------
let camera, scene, renderer, mixer, composer, load;
var firstBB, secondBB;

let objs = []
let circle_tracker;


    
// Canvas
const canvas = document.querySelector('canvas.canvasGL')

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
init();
character();
onWindowResize();

function init() {
    // Scene
    scene = new THREE.Scene()
    const texLoad = new THREE.TextureLoader();

    // Base camera
    camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 1, 10000)
    camera.position.x = -6
    camera.position.y = 3
    camera.position.z = 3;
    scene.add(camera)

    const ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambLight );



    

    //IMAGES 
    const geo = new THREE.PlaneBufferGeometry(5,5);
    for (let i = 1; i <= 4; i++) {
        const mat = new THREE.MeshBasicMaterial({
            map: texLoad.load(`../3d/${i}.jpg`)
        })

        const img = new THREE.Mesh(geo, mat)
        img.position.x += (i * 5) - 7;
        img.position.y = 0;
        img.position.z += (0);
        img.rotation.y = 1;

        scene.add(img);
        if(mobile){
            img.position.x += (i * 0.1) - 4;
            img.position.y = -1.5;
        }
    }

    for (let i = 1; i <= 4; i++) {
        const mat = new THREE.MeshBasicMaterial({
            map: texLoad.load(`3d/${4+i}.jpg`)
        })

        const img = new THREE.Mesh(geo, mat)
        img.position.x = (i * 5) - 7;
        img.position.y = -5;
        img.position.z += 0;
        img.rotation.y = 0;

        scene.add(img);
        if(mobile){
            img.position.x += (i * 0.1) - 4;
            img.position.y = -6.5;
        }
    }

    scene.traverse((object) => {
        if (object.isMesh) {
            objs.push(object)
            console.log('Images', objs)
        }
    })

    
    // Circle
    // const geo_circle = new THREE.CircleGeometry( 1,30 );
    // const mat_circle = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const circle = new THREE.Mesh( geo_circle, mat_circle );
    // circle.position.z = 1;
    // // circle.rotate.x = Math.PI/2;
    // scene.add( circle );


    // Circle Tracker
    const geo_circle_tracker = new THREE.CircleGeometry( 0.5,30 );
    const mat_circle_tracker = new THREE.MeshBasicMaterial( { color: 0xfff000, alpha: 0.5} );
    circle_tracker = new THREE.Mesh( geo_circle_tracker, mat_circle_tracker );
    circle_tracker.position.z = 1;
    circle_tracker.position.x = -6
    circle_tracker.position.y = 3;
    // circle.rotate.x = Math.PI/2;
    if(!mobile){
        scene.add( circle_tracker );
    }

    //  firstBB = new THREE.Box3().setFromObject(circle);
     secondBB = new THREE.Box3().setFromObject(circle_tracker);




    // Materials
    const material = new THREE.MeshBasicMaterial({})
    material.color = new THREE.Color(0xff00ff)
    material.transparency = true;



    //Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
    })
    renderer.setSize(sizes.width, sizes.height);
    // renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    //Controls
    // const controls = new OrbitControls(camera, renderer.domElement); //renderer dom element is canvas
    // controls.target.set(0, 0, 0);
    // controls.update();

    // controls.addEventListener('change', render);

    //Window Size
    window.addEventListener('resize', onWindowResize);

    render();
}

    

function character() {
    //Model Loader
    
    let gltfLoader = new GLTFLoader();
    let mod;
    gltfLoader.load('3d/muma.glb',
        function(gltf) {
            mod = gltf.scene;
            mod.position.z = 1;
            mod.position.x -= 6;
            mod.position.y = 3;
            mod.scale.set(0.5,0.5,0.5);
            mod.rotation.x = Math.PI /2;

            mixer = new THREE.AnimationMixer(mod);
            console.log(mod);
            const action = mixer.clipAction(gltf.animations[0])
            const action2 = mixer.clipAction(gltf.animations[1])

            action.setLoop(THREE.LoopRepeat);
            action.clampWhenFinished = true;
            action.enable = true;
            action.play();

            action2.setLoop(THREE.LoopRepeat);
            action2.clampWhenFinished = true;
            action2.enable = true;
            action2.play();

            console.log('ACTION', action);

            // animate()
            console.log('3d loaded');
            if(!mobile){
                scene.add(mod);
            }
        },
        // called while loading is progressing
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% 3D model loaded');
            if (xhr.loaded / xhr.total == 1) {
                console.log('trigger loaded',document.getElementById('loading').style);
                // document.querySelector('canvas').style.visibility = "visible";

            } else {
                // document.querySelector('canvas').style.visibility = "hidden";
            }
        },
        // called when loading has errors
        function(error) {
            alert('error');
            console.log('An error happened????');

        });

          // Camera Controller 
          let lastX, lastY, currX, currY;

    document.addEventListener('keydown', control);

    document.addEventListener('mousemove', controlMouse);

    window.addEventListener('touchstart', (e) => {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchmove', scrollMobile);
    
    function scrollMobile(e){
        let scrollY = e.changedTouches[0].clientY;
        let scrollX = e.changedTouches[0].clientX;

        if(lastX < scrollX){
            camera.position.x -= scrollX * 0.0001;
        }
        else if(lastX > scrollX){
            camera.position.x += scrollX * 0.0001;

        }

        if(lastY < scrollY){
            camera.position.y += scrollY  * 0.0001;
        }
        else if(lastY > scrollY){
            camera.position.y -= scrollY  * 0.0001;
        }
    }

        function controlMobile(event) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            camera.position.x += mouse.x  * 0.2;
            camera.position.y -= mouse.y * 0.2 ;
        }

        function controlMouse(event) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            camera.position.x += mouse.x * 0.1;
            camera.position.y += mouse.y  * 0.1;
        }
        
            function control(e) {
                if (e.key == 'ArrowUp') {
                    camera.position.y += 0.5;
                    mod.rotation.y = -Math.PI;
                    mod.position.y += 0.5;
                    circle_tracker.position.y += 0.5;
                    console.log('up'); 
                } else if (e.key == 'ArrowDown') {
                        camera.position.y -= 0.5;
                        mod.rotation.y = 0;
                        mod.position.y -= 0.5;
                        circle_tracker.position.y -= 0.5;                        
                } else if (e.key == 'ArrowLeft') {
                    camera.position.x -= 0.5;
                    mod.rotation.y = -Math.PI / 2;
                    mod.position.x -= 0.5;
                    circle_tracker.position.x -= 0.5;

                } else if (e.key == 'ArrowRight') {
                    camera.position.x += 0.5;
                    mod.rotation.y = Math.PI / 2;
                    mod.position.x += 0.5;
                    circle_tracker.position.x += 0.5;

                }
            }

            // secondBB = new THREE.Box3().setFromObject(mod);

}

function onWindowResize() {
    //Size 
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

    render();
}

function render() {
    renderer.render(scene, camera);
}



document.addEventListener('wheel', onMouseWheel)

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let windowX = window.innerWidth / 4;
let windowY = window.innerHeight / 4;

function onMouseWheel(event) {
    // mouseX = (event.clientX - windowX)
    // mouseY = (event.clientY - windowY)
    mouseY = event.deltaY * 0.01
}

const mouse = new THREE.Vector2()
document.addEventListener('mousemove', onMouseMove)

function onMouseMove(event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = (event.clientY / sizes.height) * 2 - 1
}

const clock = new THREE.Clock()
let posZ = 0;

const raycaster = new THREE.Raycaster()

// canvas.addEventListener('pointerdown', menuClick, false)
$('body').on('pointerdown', menuClick);
let clicked = false;

//Raycaster for CLICK MENU
raycaster.setFromCamera(mouse, camera);
//clicking menu check
function menuClick(event) {
    clicked = true;
    let intersects = raycaster.intersectObjects(objs);
    for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1.2, y: 1.2 })
        for (const object of objs) {
            if (intersect.object == objs[0]) {
                // moveMenu(4);
            } else if (intersect.object == objs[1]) {
                // moveMenu(3);
            } else if (intersect.object == objs[2]) {
                // moveMenu(2);
            } else if ((intersect.object == objs[3])) {
                // moveMenu(1);
            } else if ((intersect.object == objs[4])) {
                // moveMenu(-1);
            } else if ((intersect.object == objs[5])) {
                // moveMenu(-2);
            } else if ((intersect.object == objs[6])) {
                // moveMenu(-3);
            } else if ((intersect.object == objs[7])) {
                // moveMenu(-4);
            }
        }
    }
}

let menuClicked = false;


function tick() {
    const delta = clock.getDelta() //delta has to be initialized before elapsedTime

    const elapsedTime = clock.getElapsedTime()
    let zoom = 0;
    // Raycaster for rotation
    raycaster.setFromCamera(mouse, camera);

    // var collision = firstBB.intersectsBox(secondBB);

    

    let change = elapsedTime * 1 % 100;
    // if(spotLight.position.z + change >= 100){
    //     spotLight.position.z -= elapsedTime * 1 % 100;
    // }
    // else if(spotLight.position.z - change <= 0) {
    //     spotLight.position.z += elapsedTime * 1 % 100;
    // };


    const intersects = raycaster.intersectObjects(objs)
    for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1.1, y: 1.1 })
        for (const object of objs) {
            if (intersect.object == objs[0]) {
            } else if (intersect.object == objs[1]) {

            } else if (intersect.object == objs[2]) {


            } else if ((intersect.object == objs[3])) {
            }
            //LEFT SIDE OBJECTS
            else if ((intersect.object == objs[4])) {
                // window.open('http://www.discord.com/');
            } else if ((intersect.object == objs[5])) {

            } else if ((intersect.object == objs[6])) {

            } else if ((intersect.object == objs[7])) {
            }
        }
    }

    for (const object of objs) {
        if (!intersects.find(intersect => intersect.object === object)) {
            gsap.to(object.scale, { x: 1, y: 1 })
            gsap.to(object.rotation, { y: 0 })
        }
    }


    if (mixer) {
        mixer.update(delta);
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function moveMenu(loc) {
    camera.position.x += loc;
}
//get navbar
// let navs = [...document.getElementsByClassName('nav')];
// console.log('NAVS', navs);
// navs.forEach((nav, i) => {
//     let m = new THREE.MeshBasicMaterial();
//     m.color = new THREE.Color(0xffffff)
//         // m.texture = new THREE.Texture(nav);
//     let g = new THREE.PlaneBufferGeometry(1.5, 1);
//     let msh = new THREE.Mesh(g, m)
//     scene.add(msh)

//     msh.position.y = i * 1.2;

// })

// JS
let speedMouse = 0;
let speedMobile = 0;


document.querySelector('canvas.canvasGL').style.display = "block";

// scrolling();

function gui() {
    // Debug
    const gui = new dat.GUI()
        // let modelFolder = gui.addFolder('3DModel')
        // modelFolder.add(mod.position, 'z', 0, Math.PI * 2)
        // modelFolder.open()
        
    let camFolder = gui.addFolder('Camera')
    camFolder.add(camera.position, 'x', 0, 10).listen();

    camFolder.add(camera.position, 'y', 0, 10).listen();

    camFolder.add(camera.position, 'z', 0, 10).listen();
    console.log('Camera folder is added')
    camFolder.open()
}

gui();
function allItemsLoaded() {
    $('.onepix-imgloader').fadeOut();
    // fade in content (using opacity instead of fadein() so it retains it's height.
    $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
}

const iframe = document.getElementById("iframe");
// if(document.getElementById('iframe').style.display == 'block'){
//     console.log('display block')
// }








