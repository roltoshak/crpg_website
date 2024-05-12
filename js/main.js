import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { CSS3DRenderer, CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js'
import * as CANNON from 'cannon-es'

import { Camera } from './camera.js';
import { Lights } from './lights.js'
import { Models, manager, features } from './models_loader.js'
import { Elements, add_to_scene} from './elements_loader.js';

function init(){

    const scene = new THREE.Scene()

    const phys = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.8, 0)
    })

    const camera = new Camera()
    scene.add(camera.pos)

    const raycaster = new THREE.Raycaster();

    for (const light of Lights){
        scene.add(light)
    }

    const planeG = new THREE.PlaneGeometry(10, 10)
    const matP = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide})
    const floor = new THREE.Mesh(planeG, matP)
    floor.receiveShadow = true
    scene.add(floor)
    const ground = new CANNON.Body({
        mass:0,
        shape: new CANNON.Plane()
    })
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2)
    floor.quaternion.copy(ground.quaternion)
    phys.addBody(ground)

    const labelRenderer = new CSS3DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    document.querySelector('#elements').appendChild( labelRenderer.domElement )

    const rend = new THREE.WebGLRenderer({alpha:true});
    rend.setSize(window.innerWidth, window.innerHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace
    rend.shadowMap.enabled = true
    document.querySelector('#main').appendChild( rend.domElement )

    for (const el of add_to_scene) {
        scene.add(el.object)
        phys.addBody(el.hitbox)
    }

    manager.onLoad = function(){
        for (const model of Object.values(Models)){
            scene.add(model.model)
            phys.addBody(model.hitbox)
        }
        for (const feature of features){
            feature()
        }
    }

    window.addEventListener('resize', () => {
        camera.camera.aspect = window.innerWidth / window.innerHeight;
        camera.camera.updateProjectionMatrix();
        rend.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize( window.innerWidth, window.innerHeight );
    })

    window.addEventListener('keydown', function(event){
        Models['main_char'].change_direction(event, 1);
    })

    window.addEventListener('keyup', function(event){
        Models['main_char'].change_direction(event, 0);
    })

    const pointer = new THREE.Vector2(0, 0)
    window.addEventListener('mousemove', function(event){
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
    })

    phys.addEventListener('beginContact', (event)=>{
        if(event.bodyA.isChar && event.bodyB.isEl){
            event.bodyB.visibility(true)
        }
        if(event.bodyB.isChar && event.bodyA.isEl){
            event.bodyA.visibility(true)
        }
    })

    phys.addEventListener('endContact', (event)=>{
        if(event.bodyA.isChar && event.bodyB.isEl){
            event.bodyB.visibility(false)
        }
        if(event.bodyB.isChar && event.bodyA.isEl){
            event.bodyA.visibility(false)
        }
    })

    const clock = new THREE.Clock() 
    function update(){
        camera.update(pointer)
        const delta = clock.getDelta()
        phys.step(1/60)
        for (const model of Object.values(Models)){
            model.update(1/60, camera)
        }
        // raycaster.setFromCamera( pointer, camera.camera );
	    // const intersects = raycaster.intersectObjects( scene.children );
        // // console.log(intersects)
        // if (intersects.length > 0) {
        //     console.log(intersects[0])
        //     if (intersects[0].object.raycasting) {
        //         intersects[0].object.raycasting('kkkk')
        //     }
        // }
        rend.render(scene, camera.camera)
        labelRenderer.render( scene, camera.camera )
        requestAnimationFrame(update)
    }

    update()
}

init()