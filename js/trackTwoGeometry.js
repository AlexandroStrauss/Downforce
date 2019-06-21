import * as THREE from 'three';

class trackTwoGeometry {
    constructor() {
        this.maxLaps = 2;
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

        tower.position.set(-500, 150, 0);
        tower2.position.set(500, 150, 0);

        var frontstretchInsideGeometry = new THREE.BoxGeometry(100, 100, 8000);
        var frontstretchOutsideGeometry = new THREE.BoxGeometry(100, 100, 8000);
        var straightMaterial = new THREE.MeshBasicMaterial({ color: 0x232323 })
        var frontstretchInside = new THREE.Mesh(frontstretchInsideGeometry, straightMaterial);
        var frontstretchOutside = new THREE.Mesh(frontstretchOutsideGeometry, straightMaterial);
        scene.add(frontstretchInside)
        scene.add(frontstretchOutside)

        frontstretchInside.position.set(500, 50, -2500);
        frontstretchOutside.position.set(-500, 50, -2500)

        var cylinderGeometry = new THREE.CylinderGeometry(400, 500, 150, 64, 1, false, 0)
        var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x411511 })
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        scene.add(cylinder)
        cylinder.position.set(900, 75, -6500)

        var straight2InsideGeometry = new THREE.BoxGeometry(100, 100, 3500);
        var straight2Inside = new THREE.Mesh(straight2InsideGeometry, straightMaterial);
        scene.add(straight2Inside)
        
        straight2Inside.position.set(2400, 50, -6500)
        straight2Inside.rotation.set(0, 1, 0)

        this.collidableObjects.push(frontstretchInside, frontstretchOutside, cylinder, straight2Inside)
    }


}

export default trackTwoGeometry;