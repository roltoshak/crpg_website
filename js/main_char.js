import * as THREE from 'three'

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
        // console.log(Model.movement_direction)
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
            Model.model.rotation.y = Math.PI + camera.angleY + angle
            Model.model.translateZ(0.07)
            camera.pos.position.x = Model.model.position.x
            camera.pos.position.z = Model.model.position.z
        }
        
    }

    Model.animations['walk'].play()
    Model.animations['walk'].paused = true
    Model.animations['blink'].play()
    Model.animations['blink_l'].play()
    Model.animations['blink_r'].play()
    Model.model.rotation.y = Math.PI
    console.log(Model.model)

    return Model
}

export {add_properties}