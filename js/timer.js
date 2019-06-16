function timer(startTime) {
    var time = new Date().getTime();
    var difference = time - startTime;

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    return minutes + ':' + seconds + ':' + milliseconds
}

export default timer;