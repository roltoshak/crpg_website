import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js'

let Elements = {}
let add_to_scene = []

class Element{
    constructor(Class='', Id='', w, h){
        this.div = document.createElement('div')
        this.div.style.width = w+'px'
        this.div.style.height = h+'px'

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
        const geometry = new THREE.PlaneGeometry(w, h)
        this.geometry = new THREE.Mesh(geometry, material)

        this.object.add(this.geometry)
    }
}
let edit
edit = new Element('', 'testing', 800, 200)
edit.div.innerHTML = 'hello world yeah'
edit.object.scale.set(0.02, 0.02, 0.02)
edit.object.position.y = 7
add_to_scene.push(edit)
Elements['test'] = edit

export {Elements, add_to_scene}
