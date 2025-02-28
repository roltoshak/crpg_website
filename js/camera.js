import * as THREE from 'three';

const x = new THREE.Vector3(1, 0, 0).normalize()
const y = new THREE.Vector3(0, 1, 0).normalize()

export class Camera{
    constructor(){
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.rotation.x = -0.2
        this.camera.position.z = 1.2

        this.pos = new THREE.Group()
        this.pos.add(this.camera)
        this.pos.position.y = 1.8

        this.angleX = 0
        this.angleY = 0
    }

    update(pointer){
        if (Math.abs(pointer.x) >= 0.2){
            this.angleY = (this.angleY - Math.PI/60 * pointer.x) % (Math.PI * 2)
            this.pos.rotateOnWorldAxis(y, -Math.PI/60 * pointer.x)
        }
        const rotX = Math.PI/45 * ((Math.abs(pointer.y) > 0.3) ? pointer.y / 2 : 0)
        this.angleX += rotX
        if (this.angleX < -0.5){
            this.angleX = -0.5
        }
        else if (this.angleX > 1){
            this.angleX = 1
        }
        else{
            this.pos.rotateOnAxis(x, rotX)
        }
    }
}