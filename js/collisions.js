// after hours of searching, I owe this actually functional collision detection to github user
// Jos Dirksen (josdirksen) and their threejs-cookbook repo
import * as THREE from 'three';


function collisions(focus, collidableObjects) {
    var originPoint = focus.position.clone();
    for (var vertexIndex = 0; vertexIndex < focus.geometry.vertices.length; vertexIndex++) {
        var localVertex = focus.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(focus.matrix);
        var directionVector = globalVertex.sub(focus.position);
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableObjects);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            return true
        }
    }
    return false
}

export default collisions;