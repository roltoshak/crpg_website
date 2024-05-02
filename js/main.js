import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Camera } from './camera.js';
import { Lights } from './lights.js'
import { Models, manager, features } from './models_loader.js'

function init(){
    //инициализация объектов, где проходит рендер
    const div = document.getElementById("content")
    const canvas = document.getElementById("main")

    //инициализация сцены и камеры
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x152620)

    const camera = new Camera(div)
    scene.add(camera.pos)

    const raycaster = new THREE.Raycaster();

    //добавление света
    for (const light of Lights){
        scene.add(light)
    }

    //рендер для сцены
    const rend = new THREE.WebGLRenderer({canvas});
    rend.setSize(div.offsetWidth, div.offsetHeight);
    rend.outputColorSpace = THREE.SRGBColorSpace
    rend.shadowMap.enabled = true

    manager.onLoad = function(){
        for (const model of Object.values(Models)){
            scene.add(model.model)
        }
        for (const feature of features){
            feature()
        }
    }
    //изменения если изменился размер окна
    window.addEventListener('resize', () => {
        camera.camera.aspect = div.offsetWidth / div.offsetHeight;
        camera.camera.updateProjectionMatrix();
        rend.setSize(div.offsetWidth, div.offsetHeight);
    })

    window.addEventListener('keydown', function(event){
        // char.children[0].children[0].geometry.dispose()
        // char.children[0].children[0] = k[0]
        // console.log(char.children[0].children)
        char.rotation.y = camera.angleY
    })

    //вращение камеры
    const pointer = new THREE.Vector2()
    window.addEventListener('mousemove', function(event){
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
    })

    const clock = new THREE.Clock() 
    function update(){
        //вращение камеры
        camera.update(pointer)
        const delta = clock.getDelta()
        for (const model of Object.values(Models)){
            model.update(delta)
        }
        requestAnimationFrame(update)
        rend.render(scene, camera.camera)
        // console.log(rend.info.memory)
    }

    update()
}

init()