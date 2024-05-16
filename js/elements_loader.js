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

        this.div.style.opacity = '0%'
        this.geometry.visible = false

        this.hitbox.isEl = true
        const EL = this
        this.hitbox.visibility = function(flag){
            EL.div.style.opacity = (100 * flag)+'%'
            EL.visible = flag
        }
        this.div.ontransitionend = () => {
            if (!EL.visible) this.geometry.visible = false
        }
        this.div.ontransitionstart = () => {
            if (EL.visible) this.geometry.visible = true
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

edit = new Element('text', '', {
    w: 1000,
    h: 700,
    depth: 2,
    position: new THREE.Vector3(-1.121, 3, -5.375),
    quaternion: new THREE.Vector3(0, 29.91 * Math.PI/180, 0),
    addY: 0
})
edit.div.innerHTML = 'CRPG - это сокращение от "Computer Role-Playing Game" и обозначает компьютерную ролевую игру. В таких играх ты можешь создавать своего персонажа, прокачивать его навыки, исследовать огромные миры, выполнять квесты и принимать важные решения, которые влияют на ход игры.<br/> В общем, если тебе нравится фэнтези, магия и приключения, то CRPG - это то, что тебе нужно!'
add_to_scene.push(edit)

Elements['t1'] = edit

edit = new Element('text', '', {
    w: 1500,
    h: 700,
    depth: 3,
    position: new THREE.Vector3(3.155, 5, -8.679),
    quaternion: new THREE.Vector3(0, -9.09 * Math.PI/180, 0),
    addY: 0
})
edit.div.innerHTML = 'В мире фэнтези CRPG ты окунешься в удивительный мир, наполненный загадками, тайнами и чудесами<br/>Ты будешь путешествовать через волшебные леса, заснеженные горы и древние руины, встречая загадочных персонажей и общаясь с мудрецами на крыше мира. Погружаясь в красочные диалоги и эпические квесты, ты будешь раскрывать удивительные истории и узнавать о тайнах, которые скрываются в этом удивительном мире<br/>С каждым шагом ты будешь ощущать воздух приключений и волшебства, которые наполняют этот уникальный мир фэнтези'
add_to_scene.push(edit)

Elements['t2'] = edit

edit = new Element('text', '', {
    w: 600,
    h: 300,
    depth: 1.5,
    position: new THREE.Vector3(-1.000, 1, -9.514),
    quaternion: new THREE.Vector3(0, 37.25 * Math.PI/180, 0),
    addY: 0
})
edit.div.innerHTML = 'Исследовать миры и искать редкие предметы - это одна из самых крутых фишек в таких играх'
add_to_scene.push(edit)

Elements['t_chest_1'] = edit

edit = new Element('text', '', {
    w: 750,
    h: 400,
    depth: 0,
    position: new THREE.Vector3(1.000, 2, -11.514),
    quaternion: new THREE.Vector3(0, -37.25 * Math.PI/180, 0),
    addY: 0
})
edit.div.innerHTML = 'В CRPG, ты можешь найти кучу классных предметов, от мечей и доспехов до волшебных артефактов<br/>Так что, если тебе нравится исследовать и ковыряться в добыче - CRPG точно для тебя'
add_to_scene.push(edit)

Elements['t_chest_2'] = edit

export {Elements, add_to_scene}
