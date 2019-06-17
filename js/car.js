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
        this.createBoundingBox = this.createBoundingBox.bind(this);
    }

    start (scene, camera, cameraType) {
        var loader = new GLTFLoader();
        function modelLoad(gltf) {
            this.model = gltf.scene;
            scene.add(this.model);
        }
        
        modelLoad = modelLoad.bind(this);

        loader.load('2018_nascar_camaro/scene.gltf', modelLoad,
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }, 
            function (error) {
            console.error(error);
        })

        // loader.onLoadComplete = function () { scene.add(this.model) } 

        this.createBoundingBox(scene, camera, cameraType);

        this.fontLoader = new THREE.FontLoader();
        this.font = this.fontLoader.load('fonts/optimer_regular.typeface.json')
    }

    createBoundingBox(scene, camera, cameraType) {
        var bound_geometry = new THREE.BoxGeometry(50, 50, 150);
        this.boundingBox = new THREE.Mesh(
            bound_geometry,
            new THREE.MeshBasicMaterial({ color: 0xff0add })
        )
        scene.add(this.boundingBox);
        this.boundingBox.material.transparent = true;
        this.boundingBox.material.opacity = 0;

        if (this.model) {
            this.boundingBox.position = this.model.position;
            this.boundingBox.rotation = this.model.rotation;
        }

        //unsuccessful attempt to allow for real-time camera controls
        if (cameraType === "first-person") {
            if(this.boundingBox.children[0]) {
                this.boundingBox.remove(camera)
            }

            this.boundingBox.add(camera);

            camera.position.set(-10, 40, 0)

            camera.rotation.x = 0
            camera.rotation.z = 0
            camera.rotation.y = 0

        } else if (cameraType === "third-person") {
            if (this.boundingBox.children[0]) {
                this.boundingBox.remove(camera)
            }

            this.boundingBox.add(camera);

            camera.position.set(0, 50, 150)
        } else {
            if (this.boundingBox.children[0]) {
                this.boundingBox.remove(camera)
            }

            this.boundingBox.add(camera);

            camera.position.set(0, 1500, 0)
            // this.boundingBox.add(camera);

            // camera.rotation.x = -1.57
            // camera.rotation.z = 0
            // camera.rotation.y = 0
        }

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

    crossingLine(dZ) {
        if (this.boundingBox.position.z > 0 &&
             (this.boundingBox.position.z - dZ/4) < 0) 
             {
                 return true;
        }
        return false;
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