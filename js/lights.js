import * as THREE from 'three';

let Lights = []
let light

Lights.push(new THREE.AmbientLight(0xe8f2ff, 1.6))
light = new THREE.DirectionalLight(0xfff1c4, 2)
light.position.y = 4
light.position.x = 4
light.position.z = 2
Lights.push(light)

export {Lights}