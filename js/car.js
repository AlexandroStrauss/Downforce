import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { Howl, Howler } from 'howler';

class Car {
    constructor() {
        this.velocity = 0;
        this.downforce = 0;
        this.font = null;
        this.boundingBox = null;
        this.model = null;
        this.angle = 0;
        this.speedHUD = null;
        this.downforceHUD = null;

        this.updatePosition = this.updatePosition.bind(this);
        this.createBoundingBox = this.createBoundingBox.bind(this);
    }

    start (scene, camera, cameraType) {

        //load the car model; only when that's done, remove the loading modal and allow the player to start
        var loader = new GLTFLoader();
        function modelLoad(gltf) {
            this.model = gltf.scene;
            scene.add(this.model);
            document.getElementById('loading').style.display = 'none';
        }
        
        modelLoad = modelLoad.bind(this);

        loader.load('2018_nascar_camaro/scene.gltf', modelLoad,
            function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }, 
            function (error) {
            console.error(error);
        })

        // loader.onLoadComplete = function () { scene.add(this.model) } 

        this.createBoundingBox(scene, camera, cameraType);

        // this.fontLoader = new THREE.FontLoader();
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('../fonts/optimer_regular.typeface.json',
            function (font) {
                this.font = font;
            }.bind(this)
        )
        // this.carSounds();
    }

    //creates an invisible box with the same dimensions as the car model
    //and which always moves with the car model
    //providing a much simpler object to use for calculating collision detection
    createBoundingBox(scene, camera, cameraType) {
        var bound_geometry = new THREE.BoxGeometry(50, 50, 150);
        this.boundingBox = new THREE.Mesh(
            bound_geometry,
            new THREE.MeshBasicMaterial({ color: 0xff0add })
        )
        scene.add(this.boundingBox);
        this.boundingBox.material.transparent = true;
        this.boundingBox.material.opacity = 0;

        //Set the bounding box's position and rotation equal to the model's to start
        if (this.model) {
            let x = this.model.position.x;
            let y = this.model.position.y;
            let z = this.model.position.z;

            this.boundingBox.position.set(x, y, z);

            let xrot = this.model.rotation.x;
            let yrot = this.model.rotation.y;
            let zrot = this.model.rotation.z;

            this.boundingBox.rotation.set(xrot, yrot, zrot);
        }

        //The camera is attached to the bounding box, with its relative position changing depending on the camera type. 
        //This method allows the camera to be removed and replaced whenever the user decides to switch the camera angle.
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

            //DEVELOPMENT TIP: comment out the next five lines to have full control over the camera
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

    //work-in-progress on basic engine sounds
    carSounds() {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx = new AudioContext();

        var sound = new Howl({
            src: ['nascar_sound_basic_loop.mp3'],
            loop: true,
        })

        // sound.rate(this.velocity / 180);

        sound.play();
    }

    //if you press the reset button, it's handled here
    reset() {
        this.model.position.set(0, 0, 0);
        this.model.rotation.set(0, 0, 0);
        this.boundingBox.position.set(0, 0, 0);
        this.boundingBox.rotation.set(0, 0, 0);
        this.velocity = 0;
        this.angle = 0;
    }

    //Work-in-progress on a 3D HUD rendered behind the car. In its current form, it renders the HUD properly in 3D type, but drops the framerate to well below 60fps.
    drawHUD(scene) {
        if (this.font) {
            var speedReadout = Math.floor(this.velocity) + " MPH"
            var downforceReadout = Math.floor(this.downforce) + " lbs"

            var speedHUDGeometry = new THREE.TextGeometry(speedReadout, {
                font: this.font,
                size: 4,
                height: 1,
                curveSegments: 6,
                bevelEnabled: false,
                // bevelThickness: 0,
                // bevelSize: 0,
                // bevelOffset: 0
            });

            var speedHUDMaterial = new THREE.MeshBasicMaterial({ color: 0x00fff0 });
            this.speedHUD = new THREE.Mesh(speedHUDGeometry, speedHUDMaterial);
            // scene.add(this.speedHUD);
            this.model.add(this.speedHUD);

            this.speedHUD.rotation.x = 0
            this.speedHUD.rotation.z = 0
            this.speedHUD.rotation.y = 0

            this.speedHUD.position.set(5, 35, 110);

            var downforceHUDGeometry = new THREE.TextGeometry(downforceReadout, {
                font: this.font,
                size: 4,
                height: 1,
                curveSegments: 6,
                bevelEnabled: false,
            })
            var downforceHUDMaterial = new THREE.MeshBasicMaterial({ color: 0xcd0000 })
            this.downforceHUD = new THREE.Mesh(downforceHUDGeometry, downforceHUDMaterial);

            // scene.add(this.downforceHUD);
            this.model.add(this.downforceHUD);

            this.downforceHUD.rotation.x = 0
            this.downforceHUD.rotation.z = 0
            this.downforceHUD.rotation.y = 0

            this.downforceHUD.position.set(5, 30, 110);
        }
    }

    removeHUD(scene) {
        if (this.speedHUD) {
            // scene.remove(this.speedHUD)
            this.model.remove(this.speedHUD)

        }

        if (this.downforceHUD) {
            // scene.remove(this.downforceHUD)
            this.model.remove(this.downforceHUD)
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