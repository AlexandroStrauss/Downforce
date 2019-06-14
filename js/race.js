import Car from './car';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import trackOneGeometry from './trackOneGeometry';
import collisions from './collisions';

class Race {
    constructor(cameraChoice) {
        this.car = new Car();
        this.track = new trackOneGeometry();
        this.scene = null;
        this.cameraChoice = 'third-person';
        this.camera = null;
        this.controls = null;
        this.collidableObjects = [];
        this.renderer = null;



        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;

        this.animate = this.animate.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
    }

    start() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xff0000);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // debugger
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;

        this.controls.update();

        this.track.createGeometry(this.scene);

        // debugger
        this.car.start(this.scene, this.camera, this.cameraChoice);
        
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);

        this.animate();
    }

    keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = true;
        }
        else if (e.key == "Up" || e.key == "ArrowUp") {
            this.upPressed = true;
        }
        else if (e.key == "Down" || e.key == "ArrowDown") {
            this.downPressed = true;
        }
    }

    keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = false;
        }
        else if (e.key == "Up" || e.key == "ArrowUp") {
            this.upPressed = false;
        }
        else if (e.key == "Down" || e.key == "ArrowDown") {
            this.downPressed = false;
        }
    }

    updatePhysics() {

        var velocity = this.car.velocity;
        
        // approximate downforce for a NASCAR car, assuming 2000lbs at 180mph
        var downforce = .312 * (Math.pow((velocity * .44704), 2))

        if (this.upPressed && velocity >= 0) {
            var acceleration = (22.7 - (0.0864 * velocity) - (0.0000892 * Math.pow(velocity, 2))) / 120
            velocity += acceleration
        } else if (this.upPressed && velocity < 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(Math.abs(velocity))) / 120
            velocity -= deceleration
        }

        if (this.downPressed && velocity > 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(velocity)) / 60
            velocity += deceleration
        } else if (this.downPressed && velocity <= 0) {
            velocity = -5;
        }

        var angleChange = ((1 / Math.log(Math.abs(velocity))) / 8);

        if (this.leftPressed) {
            this.car.angle += angleChange;
            this.car.rotation.y += angleChange;
            this.car.boundingBox.rotation.y += angleChange;
        }

        if (this.rightPressed) {
            this.car.angle -= angleChange;
            this.car.rotation.y -= angleChange;
            this.car.boundingBox.rotation.y -= angleChange;
        }

        if (!this.upPressed && !this.downPressed) {
            velocity *= 0.999;
        }

        // these are swapped because of the starting direction of the car.
        // X should be calculated from cosine, Z from sine
        var velX = velocity * Math.sin(this.car.angle);
        var velZ = velocity * Math.cos(this.car.angle);

        if (collisions(this.car.boundingBox, this.track.collidableObjects)) {
            if (this.car.model.position.z > 0) {
                velX = -Math.abs(velX);
                velZ = -Math.abs(velZ);
            } else {
                velX = -velX;
                velZ = -velZ;
            }
            velocity *= 0.9;
        }

        this.car.velocity = velocity;
        this.car.downforce = .312 * (Math.pow((velocity * .44704), 2))

        this.car.updatePosition(velX, velZ);
    }

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

        this.renderer.render(this.scene, this.camera);
    };
}


// if (cameraType === 'first-person') {
//     camera.position.x = car.position.x
//     camera.position.z = car.position.z

//     // camera.rotation.x = 0
//     // camera.rotation.z = 0
//     // camera.rotation.y = car.rotation.y

// }
// else if (cameraType === 'third-person') {
//     camera.position.x -= (velX * Math.abs(Math.sin(car.rotation.y)))
//     camera.position.z -= (velZ * Math.abs(Math.cos(car.rotation.y)))

// speedHUD.rotation.x = 0
// speedHUD.rotation.z = 0
// speedHUD.rotation.y = 0

// downforceHUD.rotation.x = 0
// downforceHUD.rotation.z = 0
// downforceHUD.rotation.y = 0

// camera.rotation.x = 0
// camera.rotation.z = 0
// camera.rotation.y = 0
// }


// if (crossedLine(boundingBox, velocity, plane)) {
//     lapCount += 1
//     console.log(lapCount)
// }

export default Race;