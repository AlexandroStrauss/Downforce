class Lap {
    constructor() {
        this.startTime = null;
        this.partialTime = null;

        this.lapTime = this.lapTime.bind(this);
    }

    startLap () {
        this.startTime = new Date().getTime();
    }

    lapTime () {
        var time = new Date().getTime();
        var difference = time - this.startTime;

        var milliseconds = difference % 1000;
        var seconds = Math.floor(difference/1000);
        var minutes = Math.floor(seconds / 60);

        seconds = seconds % 60;

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;

        this.partialTime = minutes + ':' + seconds + ':' + milliseconds
    }

    endLap () {
        this.lapTime();
        return this.partialTime;
    }
}

export default Lap;