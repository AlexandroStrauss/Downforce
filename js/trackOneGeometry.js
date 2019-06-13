function trackOneGeometry () {
    var tower, tower2, boundingBox;

    tower = new Physijs.BoxMesh(
        new THREE.BoxGeometry(90, 300, 90),
        new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    scene.add(tower);

    tower2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(90, 300, 90),
        new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    scene.add(tower2);

    tower.position.set(-300, 150, 0);
    tower2.position.set(300, 150, 0);

    var outsideStraightGeometry = new THREE.BoxGeometry(100, 100, 2400);

    var frontstretchGeometry = new THREE.BoxGeometry(100, 100, 2050);
    var frontstretchMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var insideMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
    var frontstretch = new Physijs.BoxMesh(outsideStraightGeometry, insideMaterial);
    var frontstretch2 = new Physijs.BoxMesh(frontstretchGeometry, frontstretchMaterial);
    scene.add(frontstretch);
    scene.add(frontstretch2);
    frontstretch.position.set(300, 50, 200);
    frontstretch2.position.set(-300, 50, 200);

    var backstretch = new Physijs.BoxMesh(frontstretchGeometry, frontstretchMaterial);
    scene.add(backstretch);
    backstretch.position.set(-1180, 50, 200);
    var backstretch2 = new Physijs.BoxMesh(outsideStraightGeometry, insideMaterial);
    scene.add(backstretch2);
    backstretch2.position.set(-1780, 50, 200);

    var cylinderGeometry = new THREE.CylinderGeometry(500, 500, 150, 64, 1, false, 0)
    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 })
    var cylinder = new Physijs.BoxMesh(cylinderGeometry, cylinderMaterial);
    var cylinder2 = new Physijs.BoxMesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder)
    scene.add(cylinder2)
    cylinder.position.set(-740, 75, 1150)
    cylinder2.position.set(-740, 75, -950)

    var sphereGeometry = new THREE.SphereGeometry(1000, 64, 64, 0, Math.PI, 0, Math.PI / 2)
    var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    var sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial)
    sphere.material.side = THREE.BackSide;
    scene.add(sphere)
    sphere.position.set(-740, 0, 1350)

    var otherSphereGeometry = new THREE.SphereGeometry(1000, 64, 64, Math.PI, Math.PI, 0, Math.PI / 2)
    var sphere2 = new Physijs.SphereMesh(otherSphereGeometry, sphereMaterial)
    sphere2.material.side = THREE.BackSide;
    scene.add(sphere2)
    sphere2.position.set(-740, 0, -1000)

    var outerSphereGeometry = new THREE.SphereGeometry(1100, 64, 64, 0, Math.PI, 0, Math.PI / 2)
    var outerSphere = new Physijs.SphereMesh(outerSphereGeometry, sphereMaterial)
    scene.add(outerSphere)
    outerSphere.position.set(-740, 0, 1350)
    var outerSphereGeometry2 = new THREE.SphereGeometry(1100, 64, 64, Math.PI, Math.PI, 0, Math.PI / 2)
    var outerSphere2 = new THREE.Mesh(outerSphereGeometry2, sphereMaterial)
    scene.add(outerSphere2)
    outerSphere2.position.set(-740, 0, -1000)

    return [frontstretch, frontstretch2, cylinder, cylinder2, backstretch, backstretch2, sphere, sphere2];
}