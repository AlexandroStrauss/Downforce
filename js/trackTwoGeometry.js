import * as THREE from 'three';
import { SceneUtils } from 'three';

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

        var frontstretchInsideGeometry = new THREE.BoxGeometry(100, 100, 8800);
        var frontstretchOutsideGeometry = new THREE.BoxGeometry(100, 100, 8400);
        var straightMaterial = new THREE.MeshBasicMaterial({ color: 0x232323 })
        var frontstretchInside = new THREE.Mesh(frontstretchInsideGeometry, straightMaterial);
        var frontstretchOutside = new THREE.Mesh(frontstretchOutsideGeometry, straightMaterial);
        scene.add(frontstretchInside)
        scene.add(frontstretchOutside)

        frontstretchInside.position.set(500, 50, -2100);
        frontstretchOutside.position.set(-500, 50, -2500)

        var cylinderGeometry = new THREE.CylinderGeometry(400, 500, 150, 64, 1, false, 0)
        var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x411511 })
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        scene.add(cylinder)
        cylinder.position.set(900, 75, -6500)

        const cornerOutsideGeometry = new THREE.SphereGeometry(1000, 64, 64, 0, Math.PI * 0.75, 0, Math.PI / 2)
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
        var cornerOutside = new THREE.Mesh(cornerOutsideGeometry, sphereMaterial)
        cornerOutside.material.side = THREE.BackSide;
        scene.add(cornerOutside)
        cornerOutside.position.set(500, 0, -6700)
        cornerOutside.rotation.set(0, Math.PI * 1.25, 0)


        var straight2InsideGeometry = new THREE.BoxGeometry(100, 100, 3500);
        var straight2Inside = new THREE.Mesh(straight2InsideGeometry, straightMaterial);
        scene.add(straight2Inside)

        const straight2OutsideGeometry = new THREE.BoxGeometry(100, 100, 4000);
        const straight2Outside = new THREE.Mesh(straight2OutsideGeometry, straightMaterial);
        scene.add(straight2Outside)

        straight2Inside.position.set(2400, 50, -5950)
        straight2Inside.rotation.set(0, 1, 0)

        straight2Outside.position.set (2900, 0, -6350)
        straight2Outside.rotation.set(0, 1, 0)
        
        const straight3Right = new THREE.Mesh(straight2InsideGeometry, straightMaterial);
        scene.add(straight3Right);
        straight3Right.position.set(4025, 50, -3300)
        straight3Right.rotation.set(0, 0.1, 0)

        const straight3Left = new THREE.Mesh(straight2InsideGeometry, straightMaterial);
        scene.add(straight3Left);
        straight3Left.position.set(4625, 50, -3600)
        straight3Left.rotation.set(0, 0.1, 0)

        const hairpinBarrierGeometry = new THREE.BoxGeometry(100, 200, 1200);
        const barrierMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        const hairpinBarrier = new THREE.Mesh(hairpinBarrierGeometry, barrierMaterial)
        scene.add(hairpinBarrier);
        hairpinBarrier.position.set(4700, 100, -1400)
        hairpinBarrier.rotation.set(0, 1.35, 0)

        const secondHairpinBarrier = new THREE.Mesh(hairpinBarrierGeometry, barrierMaterial)
        scene.add(secondHairpinBarrier);
        secondHairpinBarrier.position.set(6000, 100, -3800)
        secondHairpinBarrier.rotation.set(0, Math.PI/2, 0);

        const straight4Geometry = new THREE.BoxGeometry(100, 100, 2000);
        const straight4Left = new THREE.Mesh(straight4Geometry, straightMaterial)
        scene.add(straight4Left);
        straight4Left.position.set(5150, 50, -2850)
        straight4Left.rotation.set(0, 2.8, 0)

        const straight4Right = new THREE.Mesh(straight4Geometry, straightMaterial)
        scene.add(straight4Right);
        straight4Right.position.set(5600, 50, -2250)
        straight4Right.rotation.set(0, 2.8, 0)

        const straight5Right = new THREE.Mesh(straight4Geometry, straightMaterial);
        scene.add(straight5Right);
        straight5Right.position.set(6400, 50, -2250);
        straight5Right.rotation.set(0, 0.5, 0);

        const straight5LeftGeometry = new THREE.BoxGeometry(100, 100, 2650);
        const straight5Left = new THREE.Mesh(straight5LeftGeometry, straightMaterial);
        scene.add(straight5Left);
        straight5Left.position.set(7000, 50, -2625);
        straight5Left.rotation.set(0, 0.38, 0);
        
        const straight6RightGeometry = new THREE.BoxGeometry(100, 100, 3000);
        const straight6Right = new THREE.Mesh(straight6RightGeometry, straightMaterial);
        scene.add(straight6Right);
        straight6Right.position.set(6850, 50, 50);

        const straight6Left = new THREE.Mesh(straight6RightGeometry, straightMaterial);
        scene.add(straight6Left);
        straight6Left.position.set(7500, 50, 50);


        const bigBendGeometry = new THREE.CylinderGeometry(2000, 2000, 150, 64, 1, false, 0)
        const bigBend = new THREE.Mesh(bigBendGeometry, cylinderMaterial);
        scene.add(bigBend);
        bigBend.position.set(4900, 75, 1500)

        const postBendStraightGeometry = new THREE.BoxGeometry(100, 100, 3000);
        const postBendStraightRight = new THREE.Mesh(postBendStraightGeometry, straightMaterial);
        const postBendStraightLeft = new THREE.Mesh(postBendStraightGeometry, straightMaterial);
        
        scene.add(postBendStraightRight);
        scene.add(postBendStraightRight, postBendStraightLeft);
        postBendStraightRight.position.set(3200, 50, 3450);
        postBendStraightLeft.position.set(3700, 50, 4100);
        postBendStraightRight.rotation.set(0, Math.PI/2, 0);
        postBendStraightLeft.rotation.set(0, Math.PI/2, 0);

        const penultimateTurnGeometry = new THREE.CylinderGeometry(1000, 1000, 150, 64, 1, false, 0)
        const penultimateTurn = new THREE.Mesh(penultimateTurnGeometry, cylinderMaterial);
        scene.add(penultimateTurn);
        penultimateTurn.position.set(2000, 75, 5050)

        const finalTurnGeometry = new THREE.CylinderGeometry(1800, 1800, 150, 64, 1, false, 0)
        const finalTurn = new THREE.Mesh(finalTurnGeometry, cylinderMaterial);
        scene.add(finalTurn)
        finalTurn.position.set(0, 75, 8500)

        const finalTurnOutsideGeometry = new THREE.SphereGeometry(2400, 64, 64, 0, Math.PI, 0, Math.PI / 2)
        const finalTurnOutside = new THREE.Mesh(finalTurnOutsideGeometry, sphereMaterial);
        scene.add(finalTurnOutside);
        finalTurnOutside.position.set(0, 0, 8500)

        const preKinkRightGeometry = new THREE.BoxGeometry(100, 100, 6000)
        const preKinkRight = new THREE.Mesh(preKinkRightGeometry, straightMaterial);
        scene.add(preKinkRight);
        preKinkRight.position.set(-550, 50, 5000)
        preKinkRight.rotation.set(0, 2.78, 0)

        const preKinkLeftGeometry = new THREE.BoxGeometry(100, 100, 7075);
        const preKinkLeft = new THREE.Mesh(preKinkLeftGeometry,straightMaterial);
        scene.add(preKinkLeft);
        preKinkLeft.position.set(-1450, 50, 5075);
        preKinkLeft.rotation.set(0, 2.86, 0)

        const bigBendOutsideGeometry = new THREE.SphereGeometry(2550, 64, 64, 0, Math.PI/2, 0, Math.PI/2);
        const bigBendOutside = new THREE.Mesh(bigBendOutsideGeometry, sphereMaterial)
        bigBendOutside.material.side = THREE.BackSide;
        scene.add(bigBendOutside)
        bigBendOutside.position.set(4900, 0, 1500)
        bigBendOutside.rotation.set(0, Math.PI/2, 0)

        this.collidableObjects.push(frontstretchInside, frontstretchOutside, cylinder, straight2Inside, straight3Right)
    }
}

export default trackTwoGeometry;