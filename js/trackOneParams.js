function trackOneParams(xPosition, zPosition) {
    if (xPosition >= 225 || xPosition <= -1700) {
        return true
    } else if (xPosition >= -1125 && xPosition <= -250 && zPosition >= -800 && zPosition <= 1000) {
        return true
    } 

    return false
}