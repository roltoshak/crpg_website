import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'

import { add_properties } from './main_char.js'
import { Elements} from './elements_loader.js';

const manager = new THREE.LoadingManager()
const loader = new GLTFLoader(manager)

let Models = {}
let features = []

class Model{
    constructor(path, anim_names = [], mass, box, model){
        this.animations = {}
        this.anim_names = anim_names

        this.hitbox_prop = box
        this.model_prop = model

        this.hitbox = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(
                this.hitbox_prop.size.x/2, 
                this.hitbox_prop.size.y/2, 
                this.hitbox_prop.size.z/2)),
            mass: mass
        })
        this.hitbox.position.set(
            this.hitbox_prop.position.x + this.model_prop.position.x, 
            this.hitbox_prop.position.y + this.model_prop.position.y, 
            this.hitbox_prop.position.z + this.model_prop.position.z)
        
        this.hitbox.quaternion.setFromEuler(
            this.model_prop.quaternion.x, 
            this.model_prop.quaternion.y, 
            this.model_prop.quaternion.z)
        
        this.hitbox.addEventListener('beginContact', (event)=>{
            console.log(event)
        })

        loader.load(
            path, (gltf) => {
                this.loading(gltf)
            }
        )
    }

    loading(gltf){
        this.model = gltf.scene

        const MODEL = this
        this.model.traverse(function(n) {
            if(n.isMesh){
                n.castShadow = true
                n.receiveShadow = true
                n.raycasting = function(...args){MODEL.raycasting(...args)}
            }
        })
        
        if (this.anim_names){
            this.mixer = new THREE.AnimationMixer(this.model);
            for (const name of this.anim_names){
                const anim = THREE.AnimationClip.findByName(gltf.animations, name)
                this.animations[name] = this.mixer.clipAction(anim)
            }
        }

        this.model.position.copy(this.model_prop.position)
        this.model.quaternion.copy(this.hitbox.quaternion)
    }

    update(delta){
        if(this.mixer) this.mixer.update(delta)
    }

    raycasting(){}
}

Models['main_char'] = new Model('assets/main_char/main_char.glb', ['blink', 'blink_l', 'blink_r', 'walk'], 80, {
    size: new THREE.Vector3(0.730, 1.863, 0.689),
    position: new THREE.Vector3(0, 0.936, 0)},
    {
    position: new THREE.Vector3(0, 0, 1.7),
    quaternion: new THREE.Vector3(0, 0, 0)})

features.push(()=>{
    Models['main_char'] = add_properties(Models['main_char'])
})

Models['house1_1'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(-5.938, 0, 3.222),
    quaternion: new THREE.Vector3(0, 0, 0)})

Models['house1_2'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(12.253, 0, -4.050),
    quaternion: new THREE.Vector3(-Math.PI, Math.PI/180 * -88.95, -Math.PI)})

Models['house1_3'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(-8.810, 0, -5.594),
    quaternion: new THREE.Vector3(-Math.PI, Math.PI/180 * 7.77, -Math.PI)})

Models['house1_4'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(-8.127, 0, -14.697),
    quaternion: new THREE.Vector3(0, Math.PI/180 * -46.25, 0)})
Models['house1_5'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(10.362, 0, -11.222),
    quaternion: new THREE.Vector3(-Math.PI, Math.PI/180 * -9.05, -Math.PI)})
Models['house1_6'] = new Model('assets/house1/house1.glb', [], 0, {
    size: new THREE.Vector3(4.224, 5.913, 7.265),
    position: new THREE.Vector3(0.183, 2.940, 0.011)},
    {
    position: new THREE.Vector3(2.666, 0, -16.732),
    quaternion: new THREE.Vector3(-Math.PI, Math.PI/180 * -83.62, -Math.PI)})
Models['chest'] = new Model('assets/chest/chest.glb', ['open'], 0, {
    size: new THREE.Vector3(0.813, 0.762, 0.637),
    position: new THREE.Vector3(0, 0.391, 0)},
    {
    position: new THREE.Vector3(0.195, 0, -9.368),
    quaternion: new THREE.Vector3(0, -Math.PI, 0)})
features.push(()=>{
    Models['chest'].element = Elements['t_chest_2']
    Models['chest'].raycasting = ()=>{
        const Model = Models['chest']
        console.log(Models['chest'])
        Model.animations['open'].setLoop(THREE.LoopOnce)
        Model.animations['open'].clampWhenFinished = true
        Model.animations['open'].play()
        Model.element.hitbox.visibility(1)

    }
})
export {Models, manager, features}