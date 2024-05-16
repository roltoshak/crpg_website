import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const Z = new THREE.Vector3(0, 0, 1)
const NEW_ANGLE = new THREE.Quaternion(0, Math.PI, 0)
const NEW_POS = new CANNON.Vec3()

function add_properties(Model){
    const z = new THREE.Vector3(0, 0, -1)

    Model.keys_down = new THREE.Vector4(0, 0, 0, 0)
    Model.movement_direction = new THREE.Vector3(0, 0, 0)

    Model.change_direction = (event, pos) =>{
        if (event.code === 'KeyW') Model.keys_down.x = 1 * pos
        if (event.code === 'KeyS') Model.keys_down.y = 1 * pos
        if (event.code === 'KeyD') Model.keys_down.z = 1 * pos
        if (event.code === 'KeyA') Model.keys_down.w = 1 * pos
        Model.movement_direction.z = 0 - Model.keys_down.x + Model.keys_down.y
        Model.movement_direction.x = 0 - Model.keys_down.z + Model.keys_down.w
    }

    Model.update = (delta, camera) =>{
        Model.mixer.update(delta)
        if (Model.movement_direction.x === 0 && Model.movement_direction.z === 0){
            Model.animations['walk'].paused = true
        }
        else {
            Model.animations['walk'].paused = false
            let angle = Model.movement_direction.angleTo(z)
            // console.log(angle)
            if (Model.movement_direction.x) angle *= Model.movement_direction.x
            NEW_ANGLE.setFromAxisAngle(Y, Math.PI + camera.angleY + angle)
            Model.hitbox.quaternion.slerp(NEW_ANGLE, 0.3, Model.hitbox.quaternion)
            
            Model.hitbox.vectorToLocalFrame(Z, NEW_POS)
            Model.hitbox.position.x -= NEW_POS.x * 0.014
            Model.hitbox.position.z += NEW_POS.z * 0.014

        }
        Model.model.position.copy(Model.hitbox.position)
        Model.model.position.y -= Model.hitbox_prop.position.y
        Model.model.quaternion.copy(Model.hitbox.quaternion)
        camera.pos.position.copy(Model.model.position)
        camera.pos.position.y += 1.8
        
    }

    Model.animations['walk'].play()
    Model.animations['walk'].paused = true
    Model.animations['blink'].play()
    Model.animations['blink_l'].play()
    Model.animations['blink_r'].play()
    Model.hitbox.quaternion.setFromAxisAngle(Y, Math.PI)
    Model.model.quaternion.y = Model.hitbox.quaternion.y
    Model.hitbox.isChar = true

    return Model
}

export {add_properties}