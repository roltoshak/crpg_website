import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { add_properties } from './main_char.js'

const manager = new THREE.LoadingManager()
const loader = new GLTFLoader(manager)

let Models = {}
let features = []

class Model{
    constructor(path, names = []){
        this.animations = {}
        this.names = names
        loader.load(
            path, (gltf) => {
                this.loading(gltf)
            }
        )
    }

    loading(gltf){
        this.model = gltf.scene

        this.model.traverse(function(n) {
            if(n.isMesh){
                n.castShadow = true
            }
        })

        this.mixer = new THREE.AnimationMixer(this.model);
        console.log(gltf.animations)
        for (const name of this.names){
            const anim = THREE.AnimationClip.findByName(gltf.animations, name)
            this.animations[name] = this.mixer.clipAction(anim)
        }
        for (const child of this.model.children){
            child.raycasting = this.raycasting([])
        }
    }

    raycasting(args){}

    update(delta){
        if(this.mixer) this.mixer.update(delta)
    }
}

Models['main_char'] = new Model('/assets/main_char/main_char.glb', ['blink', 'blink_l', 'blink_r', 'walk'])

features.push(()=>{
    Models['main_char'] = add_properties(Models['main_char'])
})

export {Models, manager, features}