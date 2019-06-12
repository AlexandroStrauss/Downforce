function collisions(Player, collidableObjects) {

    // const boundingBox = Player.computeBoundingBox;
    
    // based on work from StackOverflow user Lee Stemkoski
    for (var vertexIndex = 0; vertexIndex < Player.geometry.vertices.length; vertexIndex++) {
        var localVertex = Player.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix3(Player.matrix);
        var directionVector = globalVertex;

        var ray = new THREE.Ray(Player.position, directionVector.clone().normalize());
        debugger
        var collisionResults = ray.intersectObjects(collidableObjects);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                // a collision occurred... do something...
                return true;
        }

        return false;
    }


}