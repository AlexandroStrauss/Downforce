function timeConverter (rawTime) {
    var milliseconds = rawTime % 1000;
    var seconds = Math.floor(rawTime / 1000);
    var minutes = Math.floor(seconds / 60);

    seconds = seconds % 60;

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    return (minutes + ':' + seconds + ':' + milliseconds)
}

export default timeConverter; 