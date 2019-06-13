// after hours of searching, I owe this actually functional collision detection to github user
// Jos Dirksen (josdirksen) and their threejs-cookbook repo

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

//     focus.geometry.vertices.forEach(vertex => {
//         if (vertex.y === 0) {
//             collidableObjects.forEach(object => {
//             object.geometry.vertices.forEach(objectVertex => {
//                 var point = new THREE.Vector3(0, 0, 0);
//                 point.x = objectVertex.x + object.position.x;
//                 point.y = objectVertex.y + object.position.y;
//                 point.z = objectVertex.z + object.position.z;
//                 // debugger
//                 if (focus.position.distanceTo(vertex) > focus.position.distanceTo(point)){
//                     // debugger
//                     collided=true 
//                 }
//             })
//         })
//     }
//     })
//     if (collided) {console.log('bonk')}

// }


//     // const boundingBox = Player.computeBoundingBox;
    
//     // based on work from StackOverflow user Lee Stemkoski
//     for (var vertexIndex = 0; vertexIndex < Player.geometry.vertices.length; vertexIndex++) {
//         var localVertex = Player.geometry.vertices[vertexIndex].clone();
//         var globalVertex = localVertex.applyMatrix3(Player.matrix);
//         var directionVector = globalVertex;

//         var ray = new THREE.Ray(Player.position, directionVector.clone().normalize());
//         debugger
//         var collisionResults = ray.intersectObjects(collidableObjects);
//         if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
//                 // a collision occurred... do something...
//                 return true;
//         }

//         return false;
//     }


// }