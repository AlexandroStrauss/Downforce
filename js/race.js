import Car from './car';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import trackOneGeometry from './trackOneGeometry';
import collisions from './collisions';
import Lap from './lap';
import trackTwoGeometry from './trackTwoGeometry';
import timeConverter from './timeConverter';

class Race {
    constructor(cameraChoice, carChoice, trackChoice) {
        this.car = new Car();
        this.track = trackChoice === 'oval' ? new trackOneGeometry() : new trackTwoGeometry();
        this.scene = null;
        this.cameraChoice = cameraChoice;
        this.carChoice = carChoice;
        this.camera = null;
        this.controls = null;
        this.collidableObjects = [];
        this.renderer = null;
        this.lastLap = null;
        this.bestLapRaw = null;
        this.lap = new Lap();
        this.lapCount = 0;
        this.maxLaps = this.track.maxLaps;

        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;

        this.animate = this.animate.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
        this.updateHUD = this.updateHUD.bind(this);
    }

    //start by initializing the scene in Three.js
    start() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xff0000);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //initializes camera controls but makes them unresponsive to the keyboard, allowing for car controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;

        this.controls.update();

        //load in the geometry necessary to create each track
        //this also adds all the geometry to a collidableObjects instance var for use later
        this.track.createGeometry(this.scene);

        this.car.start(this.scene, this.camera, this.cameraChoice);

        // var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
        // dirLight.position.set(0, 0, 1).normalize();
        // this.scene.add(dirLight);

        // var pointLight = new THREE.PointLight(0xffffff, 1.5);
        // pointLight.position.set(0, 100, 90);
        // this.scene.add(pointLight);

        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);

        this.animate();

        this.lap.startLap();

        //the only difference between the black and Kroger cars is whether or not the scene is lit
        if (this.carChoice === 'kroger') {
            var ambientLight = new THREE.AmbientLight(0xccccccc);
            this.scene.add(ambientLight);
            var pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(10, 5, 0);
        }
    }

    //simple arrow key/WASD controls
    keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
            this.rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
            this.leftPressed = true;
        }
        else if (e.key == "Up" || e.key == "ArrowUp" || e.key == 'w') {
            this.upPressed = true;
        }
        else if (e.key == "Down" || e.key == "ArrowDown" || e.key == 's') {
            this.downPressed = true;
        }

        if (e.key == "r") {
            this.car.reset();
            this.lap = new Lap();
            this.lap.startLap();
        }

        // Return to this later to create dynamic camera switching
 
        // if (e.key == "Digit1" || e.key == "1") {
        //     this.cameraChoice = "third-person"
        //     this.scene.remove(this.car.boundingBox)
        //     this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        // }
        // if (e.key == "Digit2" || e.key == "2") {
        //     this.cameraChoice = "first-person"
        //     this.scene.remove(this.car.boundingBox)
        //     this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        // }
        // if (e.key == "Digit3" || e.key == "3") {
        //     this.cameraChoice = "birds-eye"
        //     this.scene.remove(this.car.boundingBox)
        //     this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        // }
    }

    //the second part of keyboard controls. have to stop inputs when the key is no longer pressed
    keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
            this.rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
            this.leftPressed = false;
        }
        else if (e.key == "Up" || e.key == "ArrowUp" || e.key == 'w') {
            this.upPressed = false;
        }
        else if (e.key == "Down" || e.key == "ArrowDown" || e.key == 's') {
            this.downPressed = false;
        }
    }

    //the car's position and angle are updated with every frame in this method
    updatePhysics() {
        var velocity = this.car.velocity;

        // approximate downforce for a NASCAR car, assuming 2000lbs at 180mph
        var downforce = .312 * (Math.pow((velocity * .44704), 2))

        //acceleration and deceleration modeled after acceleration curves for a real NASCAR car
        if (this.upPressed && velocity >= 0) {
            var acceleration = (22.7 - (0.0864 * velocity) - (0.0000892 * Math.pow(velocity, 2))) / 60
            velocity += acceleration
        } else if (this.upPressed && velocity < 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(Math.abs(velocity))) / 60
            velocity -= deceleration
        }

        if (this.downPressed && velocity > 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(velocity)) / 60
            velocity += deceleration
        } else if (this.downPressed && velocity <= 0 && velocity > -50) {
            var reverseAccel = (-33.6 - 3.12 * Math.log(0.0001 + Math.abs(velocity))) / 180
            velocity += reverseAccel;
        }

        //the specific equation here isn't based on any real-world math
        //rather, it's what I've found feels good to control
        var angleChange = Math.log10((downforce ** 2) + 1) / 384

        if (this.leftPressed) {
            this.car.angle += angleChange;
            this.car.model.rotation.y += angleChange;
            this.car.boundingBox.rotation.y += angleChange;
        }

        if (this.rightPressed) {
            this.car.angle -= angleChange;
            this.car.model.rotation.y -= angleChange;
            this.car.boundingBox.rotation.y -= angleChange;
        }

        //car coasts if you're neither accelerating nor braking
        if (!this.upPressed && !this.downPressed) {
            velocity *= 0.999;
        }

        // these are swapped because of the starting direction of the car.
        // X should be calculated from cosine, Z from sine
        var velX = velocity * Math.sin(this.car.angle) / 2;
        var velZ = velocity * Math.cos(this.car.angle) / 2;

        //if any collision with the Track object's array of collidableObjects is detected,
        //the car's direction is reversed, keeping it inside the track,
        //and its speed is dramatically reduced
        if (collisions(this.car.boundingBox, this.track.collidableObjects)) {
            velX = -velX;
            velZ = -velZ;
            velocity *= 0.9;
        }

        //THESE LINES ARE IMPORTANT! They pass the updated values back to the Car object
        //so that calculations can be done with them on the next frame
        //take the first line out and the car will not move
        //take the second line out and the downforce readout will stay at 0
        //I know this from experience
        this.car.velocity = velocity;
        this.car.downforce = downforce;

        //crossingLine calculates whether the car's position will change in the next animation frame
        //such that it will cross the start/finish line. 
        //if so, end the current lap and check to see if it's better than the best time in this session 
        //and if the lap limit is reached, end the race
        if (this.car.crossingLine(velZ)) {
            this.lastLap = this.lap.endLap();
            var lapRaw = this.lap.partialTimeRaw; 
            var increment = Math.floor((this.car.model.position.z / velZ) * 16.667)
            lapRaw += increment
            this.lastLap += increment
            if (lapRaw < this.bestLapRaw || this.bestLapRaw === null) {
                this.bestLapRaw = lapRaw
            }

            document.getElementById("lastLap").innerHTML = this.lapCount === 0 ? '' : `Last\n lap:\n ${timeConverter(this.lastLap)}`;
            document.getElementById("bestLap").innerHTML= this.lapCount === 0 ? '' : `Best\n lap:\n ${timeConverter(this.bestLapRaw)}`;

            this.lapCount += 1;
            this.lap = new Lap ();
            this.lap.startLap();
        }

        if (this.lapCount > this.maxLaps) { this.endRace(); }

        this.car.updatePosition(velX, velZ);
        this.updateHUD();
    }

    //on race end, pull up a modal showing the player's best time in the session & giving them option to try again
    //to avoid a serious memory leak, the entire scene is deleted 
    endRace () {
        const end = document.getElementById("race-end")
        end.style.display = 'block';

        document.getElementById("bestTime").innerHTML = `Your best lap time was ${timeConverter(this.bestLapRaw)}`

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.renderer.forceContextLoss();

        document.getElementById("restart").addEventListener('click', () => {
            document.getElementById("loading").style.display = "block";
            location.reload(true);
        })
    }

    //with every frame, up-to-date speed and timing information is injected into these HTML elements
    updateHUD () {
        this.lap.lapTime();
        document.getElementById("currLap").innerHTML = this.lapCount === 0 ? '' :`Current\n lap:\n ${this.lap.partialTime}`
        document.getElementById("currSpeed").innerHTML = `${Math.floor(this.car.velocity)} MPH`
        document.getElementById("currDownforce").innerHTML = `${Math.floor(this.car.downforce)} lbs`
        document.getElementById("lapCount").innerHTML = this.lapCount === 0? "Warm-up lap" : `Lap ${this.lapCount}/${this.maxLaps}`
    }

    //the camera has to follow the car and keep the right rotation; that's done here
    updateCamera() {
        switch(this.cameraChoice) {
            case 'first-person':
                this.camera.rotation.x = 0
                this.camera.rotation.z = 0
                this.camera.rotation.y = 0
                break;
            case 'third-person':
                this.camera.rotation.x = 0
                this.camera.rotation.z = 0
                this.camera.rotation.y = 0
                break;
            default:
                this.camera.rotation.x = -(Math.PI / 2)
                this.camera.rotation.z = 0
                this.camera.rotation.y = 0
        }
        // if (this.cameraChoice === 'first-person') {
        //     this.camera.position.x = car.position.x
        //     this.camera.position.z = car.position.z

        //     this.camera.rotation.x = 0
        //     this.camera.rotation.z = 0
        //     this.camera.rotation.y = this.car.model.rotation.y

        // } else if (this.cameraChoice === 'third-person') {
        //     this.camera.position.x -= (velX * Math.abs(Math.sin(this.car.model.rotation.y)))
        //     this.camera.position.z -= (velZ * Math.abs(Math.cos(this.car.model.rotation.y)))

            // speedHUD.rotation.x = 0
            // speedHUD.rotation.z = 0
            // speedHUD.rotation.y = 0

            // downforceHUD.rotation.x = 0
            // downforceHUD.rotation.z = 0
            // downforceHUD.rotation.y = 0

        // }
    }

    //animates every frame, calling all the other methods in Race in turn
    animate() {
        requestAnimationFrame(this.animate);

        this.car.removeHUD();

        this.updatePhysics();

        switch (this.cameraChoice) {
            case 'third-person':
                this.car.drawHUD();
                break;
            case 'first-person':
                break;
            default:
                break;
        }

        this.controls.update();

        this.updateCamera();

        this.renderer.render(this.scene, this.camera);
    };
}

export default Race;