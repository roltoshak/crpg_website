import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

let Models = {}

class Model{
    constructor(path, names = []){
        this.animations = {}
        loader.load(
            path, function(gltf){
                this.model = gltf.scene
                this.model.traverse(function(n) {
                    if(n.isMesh){
                        n.castShadow = true
                    }
                })

                this.mixer = new THREE.AnimationMixer(this.model);
                for (const name of names){
                    const anim = new THREE.AnimationClip.findByName(gltf.animations, name)
                    this.animations[name] = this.mixer.clipAction(anim)
                }
                for (const child of this.model.children){
                    child.raycasting = function(){this.raycasting()}
                }
            }
        )
    }

    raycasting(){}

    update(delta){
        if(this.mixer) this.mixer.update(delta)
    }
}

Models[main_char] = new Model('../assets/char/main.glb', ['main'])

export {Models}