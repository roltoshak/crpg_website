import * as THREE from 'three';

let Lights = []
let light

Lights.push(new THREE.AmbientLight(0xFFFFFF, 1))
light = new THREE.DirectionalLight(0xFFFFFF, 2)
light.position.y = 2
Lights.push(light)

export {Lights}