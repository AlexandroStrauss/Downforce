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
        this.trackChoice = trackChoice;
        this.track = trackChoice === 'Oval' ? new trackOneGeometry() : new trackTwoGeometry();
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
        this.animation = null;
        this.reachedCheckpoint = false;

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

    //Start by initializing the scene in Three.js. Go through all steps to initially render and set up camera
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

        //Sets up listener for all key presses throughout the game
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
            // this.lap = new Lap();
            // this.lap.startLap();
        }

        // Controls let you switch dynamically from one camera to the next
        if (e.key == "Digit1" || e.key == "1") {
            this.cameraChoice = "third-person";
            this.scene.remove(this.car.boundingBox);
            this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        }
        if (e.key == "Digit2" || e.key == "2") {
            this.cameraChoice = "first-person";
            this.scene.remove(this.car.boundingBox);
            this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        }
        if (e.key == "Digit3" || e.key == "3") {
            this.cameraChoice = "birds-eye";
            this.scene.remove(this.car.boundingBox);
            this.car.createBoundingBox(this.scene, this.camera, this.cameraChoice);
        }
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

        // acceleration and deceleration modeled after acceleration curves for a real NASCAR car
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

        //The specific equation here isn't based on any real-world math; rather, it's what I've found feels good to control
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

        //car coasts to a stop if you're neither accelerating nor braking
        if (!this.upPressed && !this.downPressed) {
            velocity *= 0.999;
        }

        // Update the position of the car on the XZ-plane, multiplying its velocity in accordance with its current angle.
        // And they said I'd never need trigonometry again after ninth grade! 
        var velX = velocity * Math.sin(this.car.angle) / 2;
        var velZ = velocity * Math.cos(this.car.angle) / 2;

        // If any collision with the Track object's array of collidableObjects is detected, the car's direction is reversed, keeping it inside the track, and its speed is dramatically reduced
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

        if (this.car.crossingCheckpoint(velX, velZ)) {
            this.reachedCheckpoint = true;
        }

        //crossingLine calculates whether the car will cross the start/finish line between this frame and the next
        //if so, end the current lap and check to see if it's better than the best time in this session 
        //and if the lap limit is reached, end the race
        if (this.car.crossingLine(velZ) && this.reachedCheckpoint) {
            this.lastLap = this.lap.endLap();
            var lapRaw = this.lap.partialTimeRaw; 
            var increment = Math.floor((this.car.model.position.z / velZ) * 16.667)
            lapRaw += increment
            this.lastLap += increment
            if ((lapRaw < this.bestLapRaw || this.bestLapRaw === null) && this.lapCount > 0) {
                this.bestLapRaw = lapRaw
            }

            document.getElementById("lastLap").innerHTML = this.lapCount === 0 ? '' : `Last\n lap:\n ${timeConverter(this.lastLap)}`;
            document.getElementById("bestLap").innerHTML= this.lapCount === 0 ? '' : `Best\n lap:\n ${timeConverter(this.bestLapRaw)}`;

            this.lapCount += 1;
            this.reachedCheckpoint = false;
            this.lap = new Lap ();
            this.lap.startLap();
        }

        if (this.lapCount > this.maxLaps) { this.endRace(); }

        this.car.updatePosition(velX, velZ);
        this.updateHUD();
    }

    //on race end, pull up a modal showing the player's best time in the session & giving them option to try again
    endRace () {
        window.cancelAnimationFrame(this.animation);
        const end = document.getElementById("race-end")
        end.style.display = 'block';

        document.getElementById("bestTime").innerHTML = `Your best lap time was ${timeConverter(this.bestLapRaw)}`

        // To avoid a serious memory leak, the entire scene is immediately deleted 
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.renderer.forceContextLoss();

        //the player can restart the game right away, or enter their time in the global leaderboard
        document.getElementById("restart").addEventListener('click', () => {
            document.getElementById("loading").style.display = "block";
            location.reload(true);
        })

        document.getElementById("save-best-lap").addEventListener('click', () => {
            //The player must enter a name to save their time.
            //If they don't, a warning pops up.
            if (document.getElementById("save-name").value === "") {
                document.getElementById("name-warning").style.display = "flex";
                document.getElementById("okay").addEventListener('click', () => {
                    document.getElementById("name-warning").style.display = "none";
                })
            } else {
                const firebaseConfig = {
                    apiKey: "AIzaSyA3m2PUM-JFwnef8vC69DsfTKx_n7snVLc",
                    authDomain: "downforce-5f3bd.firebaseapp.com",
                    databaseURL: "https://downforce-5f3bd.firebaseio.com",
                    projectId: "downforce-5f3bd",
                    storageBucket: "downforce-5f3bd.appspot.com",
                    messagingSenderId: "531305749148",
                    appId: "1:531305749148:web:71b0fce0c1679346"
                };

                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);

                var leaderboard = firebase.database().ref(`${this.trackChoice}_times/`);
                var newEntry = leaderboard.push();
                newEntry.set({
                    name: document.getElementById("save-name").value,
                    laptime: this.bestLapRaw,
                }).then(res => console.log(res));

                this.displayLeaderboard();
            }
        })
    }

    displayLeaderboard () {
        this.assembleLeaderboard();

        document.getElementById("leaderboard").style.display = "block"
        document.getElementById("leaderboard-title").innerHTML = "Global Leaderboard: " + this.trackChoice + " Track"

        document.getElementById("ldr-restart").addEventListener('click', () => {
            document.getElementById("loading").style.display = "block";
            location.reload(true);
        })
    }

    assembleLeaderboard () {
        // var database = firebase.database();

        let i = 1;
        var database = firebase.database().ref(`${this.trackChoice}_times/`);
        var bestLap = this.bestLapRaw;

        database.orderByChild('laptime').limitToFirst(10).on("value", function (snap) {
            snap.forEach(function(child) {
                var score = child.val();
                if (score.laptime === bestLap && score.name === document.getElementById("save-name").value) {
                    document.getElementById("best-times").innerHTML += "<li id='color-this'>" + "<div>" + i + "</div>" + "<div>" + score.name + "</div>" + "<div>" + timeConverter(score.laptime) + "</div>" + "</li>"
                } else {
                    document.getElementById("best-times").innerHTML += "<li>" + "<div>" + i + "</div>" + "<div>" + score.name + "</div>" + "<div>" + timeConverter(score.laptime) + "</div>" + "</li>"
                }
                i += 1;
            })
        });

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
    }

    //animates every frame, calling all the other methods in race.js in turn
    animate() {
        this.animation = requestAnimationFrame(this.animate);

        // this.car.removeHUD(this.scene);

        this.updatePhysics();

        // This will eventually call on the method to draw a fancy 3D HUD, but for now it hurts the frame rate too much to be viable
        switch (this.cameraChoice) {
            case 'third-person':
                // this.car.drawHUD(this.scene);
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