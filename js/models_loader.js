import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'

import { add_properties } from './main_char.js'

const manager = new THREE.LoadingManager()
const loader = new GLTFLoader(manager)

let Models = {}
let features = []

class Model{
    constructor(path, anim_names = [], is_raycast=false, box, model){
        this.animations = {}
        this.anim_names = anim_names
        this.is_raycast = is_raycast

        this.hitbox_prop = box
        this.model_prop = model

        this.hitbox = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(
                this.hitbox_prop.size.x/2, 
                this.hitbox_prop.size.y/2, 
                this.hitbox_prop.size.z/2)),
            mass: 10
        })
        this.hitbox.position.set(
            this.hitbox_prop.position.x + this.model_prop.position.x, 
            this.hitbox_prop.position.y + this.model_prop.position.y, 
            this.hitbox_prop.position.z + this.model_prop.position.z)
        
        this.hitbox.quaternion.setFromEuler(
            this.hitbox_prop.quaternion.x + this.model_prop.quaternion.x, 
            this.hitbox_prop.quaternion.y + this.model_prop.quaternion.y, 
            this.hitbox_prop.quaternion.z + this.model_prop.quaternion.z)

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
        console.log(this.model)
        
        if (this.anim_names){
            this.mixer = new THREE.AnimationMixer(this.model);
            for (const name of this.anim_names){
                const anim = THREE.AnimationClip.findByName(gltf.animations, name)
                this.animations[name] = this.mixer.clipAction(anim)
            }
        }
        if (this.is_raycast){
            for (const child of this.model.children){
                child.raycasting = this.raycasting
            }
        }

        this.model.position.copy(this.model_prop.position)
        this.model.quaternion.copy(this.model_prop.quaternion)
    }

    update(delta){
        if(this.mixer) this.mixer.update(delta)
    }
}

Models['main_char'] = new Model('assets/main_char/main_char.glb', ['blink', 'blink_l', 'blink_r', 'walk'], true, {
    size: new THREE.Vector3(3.150, 8.716, 2.846),
    position: new THREE.Vector3(0, 4.464, 0),
    quaternion: new THREE.Vector4(0, 0, 0, 0)},
    {
    position: new THREE.Vector3(0, 0, 0),
    quaternion: new THREE.Vector4(0, 0, 0, 0)})

features.push(()=>{
    Models['main_char'] = add_properties(Models['main_char'])
})

export {Models, manager, features}