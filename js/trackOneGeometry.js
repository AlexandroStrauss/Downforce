import * as THREE from 'three';

class trackOneGeometry {
    constructor() {
        this.maxLaps = 5;
        this.collidableObjects = [];
        this.createGeometry = this.createGeometry.bind(this);
    }

    createGeometry(scene) {
        var tower = new THREE.Mesh(
            new THREE.BoxGeometry(90, 300, 90),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }));
        scene.add(tower);

        var tower2 = new THREE.Mesh(
            new THREE.BoxGeometry(90, 300, 90),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }));
        scene.add(tower2);

        tower.position.set(-300, 150, 0);
        tower2.position.set(300, 150, 0);

        var outsideStraightGeometry = new THREE.BoxGeometry(100, 100, 2400);

        var frontstretchGeometry = new THREE.BoxGeometry(100, 100, 2050);
        var frontstretchMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var insideMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
        var frontstretch = new THREE.Mesh(outsideStraightGeometry, insideMaterial);
        var frontstretch2 = new THREE.Mesh(frontstretchGeometry, frontstretchMaterial);
        scene.add(frontstretch);
        scene.add(frontstretch2);
        frontstretch.position.set(300, 50, 200);
        frontstretch2.position.set(-300, 50, 200);

        var backstretch = new THREE.Mesh(frontstretchGeometry, frontstretchMaterial);
        scene.add(backstretch);
        backstretch.position.set(-1180, 50, 200);
        var backstretch2 = new THREE.Mesh(outsideStraightGeometry, insideMaterial);
        scene.add(backstretch2);
        backstretch2.position.set(-1780, 50, 200);

        var cylinderGeometry = new THREE.CylinderGeometry(500, 500, 150, 64, 1, false, 0)
        var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        var cylinder2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        scene.add(cylinder)
        scene.add(cylinder2)
        cylinder.position.set(-740, 75, 1150)
        cylinder2.position.set(-740, 75, -950)

        var sphereGeometry = new THREE.SphereGeometry(1000, 64, 64, 0, Math.PI, 0, Math.PI / 2)
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
        sphere.material.side = THREE.BackSide;
        scene.add(sphere)
        sphere.position.set(-740, 0, 1350)

        var otherSphereGeometry = new THREE.SphereGeometry(1000, 64, 64, Math.PI, Math.PI, 0, Math.PI / 2)
        var sphere2 = new THREE.Mesh(otherSphereGeometry, sphereMaterial)
        sphere2.material.side = THREE.BackSide;
        scene.add(sphere2)
        sphere2.position.set(-740, 0, -1000)

        var outerSphereGeometry = new THREE.SphereGeometry(1100, 64, 64, 0, Math.PI, 0, Math.PI / 2)
        var outerSphere = new THREE.Mesh(outerSphereGeometry, sphereMaterial)
        scene.add(outerSphere)
        outerSphere.position.set(-740, 0, 1350)
        var outerSphereGeometry2 = new THREE.SphereGeometry(1100, 64, 64, Math.PI, Math.PI, 0, Math.PI / 2)
        var outerSphere2 = new THREE.Mesh(outerSphereGeometry2, sphereMaterial)
        scene.add(outerSphere2)
        outerSphere2.position.set(-740, 0, -1000)

        this.collidableObjects.push(outerSphere, outerSphere2, sphere, sphere2, cylinder, cylinder2, frontstretch, frontstretch2, backstretch, backstretch2)
    }
}

export default trackOneGeometry;