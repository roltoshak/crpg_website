import * as THREE from 'three'
import { CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js'
import * as CANNON from 'cannon-es'

let Elements = {}
let add_to_scene = []
const SCALE_K = 0.005
const Z = new THREE.Vector3(0, 0, 1)
const NEW_POS = new CANNON.Vec3()

class Element{
    constructor(Class='', Id='', prop){
        this.div = document.createElement('div')
        this.div.style.width = prop.w+'px'
        this.div.style.height = prop.h+'px'

        if (Class) this.div.setAttribute('class', Class)
        if (Id) this.div.setAttribute('id', Id)

        this.object = new THREE.Object3D()
        this.object.add(new CSS3DObject(this.div))

        const material = new THREE.MeshPhongMaterial({
            opacity: 0,
            color: 0x000000,
            side: THREE.DoubleSide,
            blending: THREE.NoBlending
        })
        const geometry = new THREE.PlaneGeometry(prop.w, prop.h)
        this.geometry = new THREE.Mesh(geometry, material)

        this.object.scale.set(SCALE_K, SCALE_K, SCALE_K)
        this.object.add(this.geometry)

        this.object.position.copy(prop.position)
        this.object.quaternion.setFromEuler(new THREE.Euler().setFromVector3(prop.quaternion))

        this.hitbox = new CANNON.Body({
            mass:0,
            shape: new CANNON.Box(new CANNON.Vec3((prop.w * SCALE_K + prop.depth)/2, 1, prop.depth))
        })
        this.hitbox.collisionResponse = 0

        this.hitbox.position.set(prop.position.x, 0, prop.position.z)
        this.hitbox.quaternion.copy(this.object.quaternion)

        this.hitbox.vectorToLocalFrame(Z, NEW_POS)
        this.hitbox.position.x -= NEW_POS.x * (prop.depth/2 + prop.addY)
        this.hitbox.position.z += NEW_POS.z * (prop.depth/2 + prop.addY)
        console.log(this.hitbox.position.z)

        this.hitbox.isEl = true
        const EL = this
        this.hitbox.visibility = function(flag){
            if (flag) {
                EL.div.style.opacity = '100%'
                EL.geometry.visible = true
            }
            else {
                EL.geometry.visible = false
                EL.div.style.opacity = '0%'
            }
        }
    }
}

let edit

edit = new Element('heading', 'start', {
    w: 1000,
    h: 400,
    depth: 2,
    position: new THREE.Vector3(0, 3, -4),
    quaternion: new THREE.Vector3(0, 0, 0),
    addY: 4
})
edit.div.appendChild(document.createElement('p'))
edit.div.children[0].innerText = 'ЖАНР CRPG'
edit.div.appendChild(document.createElement('p'))
edit.div.children[1].setAttribute('class', "text")
edit.div.children[1].innerText = 'что это и почему это интересно'
add_to_scene.push(edit)

Elements['start'] = edit

export {Elements, add_to_scene}
