function crossedLine(object, velocity, plane) {
    var originPoint = object.position.clone();
    var localVertex = object.geometry.vertices[0].clone();
    var globalVertex = localVertex.applyMatrix4(object.matrix);
    var directionVector = globalVertex.sub(object.position);
    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(collidableObjects);
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && velocity > 0 && originPoint.x > -300 && originPoint.x < 300) {
        return true
    }
    return false
}

//     if (object.position.x > -300 && object.position.x < 300 && object.position.z === 0) {
//         return true;
//     }
//     return false;
// }