import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

class Car {
    constructor() {
        this.velocity = 0;
        this.downforce = 0;
        this.font = null;
        this.boundingBox = null;
        this.model = null;
        this.angle = 0;

        this.updatePosition = this.updatePosition.bind(this);
    }

    start (scene, camera, cameraType) {
        let model;
        var loader = new GLTFLoader();
        const modelLoad = (function (gltf) {
            this.model = gltf.scene;
            scene.add(gltf.scene);
        }).bind(this);

        loader.load('../2018_nascar_camaro/scene.gltf', modelLoad,
         undefined, function (error) {
            console.error(error);
        })

        var bound_geometry = new THREE.BoxGeometry(50, 50, 150);
        this.boundingBox = new THREE.Mesh(
            bound_geometry,
            new THREE.MeshBasicMaterial({ color: 0xff0add })
        )
        scene.add(this.boundingBox);
        this.boundingBox.material.transparent = true;
        this.boundingBox.material.opacity = 0;

        if (cameraType === "first-person") {
            camera.position.y = 40
            camera.position.x = -10
            this.boundingBox.add(camera);

            camera.rotation.x = 0
            camera.rotation.z = 0
            camera.rotation.y = 0

        } else if (cameraType === "third-person") {
            this.boundingBox.add(camera);

            camera.position.y = 50
            camera.position.z = 150
        } else {
            this.boundingBox.add(camera);
            camera.position.set(0, 1500, 0)
            // this.boundingBox.add(camera);

            // camera.rotation.x = 0
            // camera.rotation.z = 0
            // camera.rotation.y = 0

        }
        this.fontLoader = new THREE.FontLoader();
        this.font = this.fontLoader.load('fonts/optimer_regular.typeface.json')
    }

    drawHUD(scene) {
        // var speedReadout = Math.floor(this.velocity) + " MPH"
        // var downforceReadout = Math.floor(this.downforce) + " lbs"

        // var speedHUDGeometry = new THREE.TextGeometry(speedReadout, {
        //     font: this.font,
        //     size: 4,
        //     height: 1,
        //     curveSegments: 6,
        //     bevelEnabled: false,
        //     // bevelThickness: 0,
        //     // bevelSize: 0,
        //     // bevelOffset: 0
        // });

        // var speedHUDMaterial = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
        // speedHUD = new THREE.Mesh(speedHUDGeometry, speedHUDMaterial);
        // scene.add(speedHUD);
        // this.model.add(speedHUD);

        // speedHUD.rotation.x = 0
        // speedHUD.rotation.z = 0
        // speedHUD.rotation.y = 0

        // speedHUD.position.set(5, 35, 110);

        // downforceHUDGeometry = new THREE.TextGeometry(downforceReadout, {
        //     font: font,
        //     size: 4,
        //     height: 1,
        //     curveSegments: 6,
        //     bevelEnabled: false,
        // })
        // downforceHUDMaterial = new THREE.MeshBasicMaterial({ color: 0xcd0000 })
        // downforceHUD = new THREE.Mesh(downforceHUDGeometry, downforceHUDMaterial);

        // scene.add(downforceHUD);
        // this.model.add(downforceHUD);

        // downforceHUD.rotation.x = 0
        // downforceHUD.rotation.z = 0
        // downforceHUD.rotation.y = 0

        // downforceHUD.position.set(5, 30, 110);
    }

    removeHUD(scene) {
        if (this.speedHUD) {
            scene.remove(speedHUD)
        }

        if (this.downforceHUD) {
            scene.remove(downforceHUD)
        }
    }

    updatePosition(dX, dZ) {
        this.boundingBox.position.z -= (dZ / 4)
        this.boundingBox.position.x -= (dX / 4)

        if (this.model) {
            this.model.position.x = this.boundingBox.position.x
            this.model.position.z = this.boundingBox.position.z
        }
    }

}

export default Car;