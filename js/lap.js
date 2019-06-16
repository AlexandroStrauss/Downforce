class Lap {
    constructor() {
        this.startTime = null;
        this.lapTime = null;

        this.lapTime = this.lapTime.bind(this);
    }

    startLap () {
        this.startTime = new Date().getTime();
    }

    lapTime () {

    }

    endLap () {

    }

}

export default Lap;