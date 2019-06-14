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
        this.cameraChoice = cameraChoice;
        this.camera = null;
        this.controls = null;
        this.collidableObjects = [];
        this.renderer = null;


        this.animate = this.animate.bind(this);
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

        this.animate();
    }


    updatePhysics() {
        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var downPressed = false;
        var angle = 0;


        var velocity = this.car.velocity;
        
        // approximate downforce for a NASCAR car, assuming 2000lbs at 180mph
        var downforce = .312 * (Math.pow((velocity * .44704), 2))

        if (upPressed && velocity >= 0) {
            var acceleration = (22.7 - (0.0864 * velocity) - (0.0000892 * Math.pow(velocity, 2))) / 120
            velocity += acceleration
        } else if (upPressed && velocity < 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(Math.abs(velocity))) / 120
            velocity -= deceleration
        }

        if (downPressed && velocity > 0) {
            var deceleration = (-33.6 - 3.12 * Math.log(velocity)) / 60
            velocity += deceleration
        } else if (downPressed && velocity <= 0) {
            velocity = -5;
        }

        var angleChange = ((1 / Math.log(Math.abs(velocity))) / 8);

        if (leftPressed) {
            angle += angleChange;
            this.car.rotation.y += angleChange;
            this.car.boundingBox.rotation.y += angleChange;
        }

        if (rightPressed) {
            angle -= angleChange;
            this.car.rotation.y -= angleChange;
            this.car.boundingBox.rotation.y -= angleChange;
        }

        if (!upPressed && !downPressed) {
            velocity *= 0.999;
        }

        // these are swapped because of the starting direction of the car.
        // X should be calculated from cosine, Z from sine
        var velX = velocity * Math.sin(angle);
        var velZ = velocity * Math.cos(angle);

        if (collisions(this.car.boundingBox, this.track.collidableObjects)) {
            if (this.car.position.z > 0) {
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