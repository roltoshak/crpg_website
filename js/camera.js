import * as THREE from 'three';

const x = new THREE.Vector3(1, 0, 0).normalize()
const y = new THREE.Vector3(0, 1, 0).normalize()

export class Camera{
    constructor(div){
        this.camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000)
        this.camera.position.y = 5;
        this.camera.rotation.x = -0.5
        this.camera.position.z = 5

        this.pos = new THREE.Group()
        this.pos.add(this.camera)

        this.qX = new THREE.Quaternion()
        this.qY = new THREE.Quaternion()

        this.angleX = 0
        this.angleY = 0
    }

    update(pointer){
        this.angleY = (this.angleY + Math.PI/90 * pointer.x) % (Math.PI * 2)
        this.pos.rotateOnWorldAxis(y, Math.PI/90 * pointer.x)
        
        const rotX = -Math.PI/60 * ((Math.abs(pointer.y) > 0.3) ? pointer.y / 2 : 0)
        this.angleX += rotX
        if (this.angleX < -0.65){
            this.angleX = -0.65
        }
        else if (this.angleX > 1){
            this.angleX = 1
        }
        else{
            this.pos.rotateOnAxis(x, rotX)
        }
        console.log(this.angleY)
    }
}