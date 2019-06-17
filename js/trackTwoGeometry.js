import * as THREE from 'three';

class trackOneGeometry {
    constructor() {
        this.collidableObjects = [];
        this.createGeometry = this.createGeometry.bind(this);
    }

    createGeometry(scene) {
        var tower = new THREE.Mesh(
            new THREE.BoxGeometry(90, 300, 90),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        scene.add(tower);

        var tower2 = new THREE.Mesh(
            new THREE.BoxGeometry(90, 300, 90),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        scene.add(tower2);
