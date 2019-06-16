import Race from "./race";

document.addEventListener('DOMContentLoaded', () => {
    var radio = document.getElementById('cameraType')
    var submit = document.getElementById('submit')
    
    const startRace = (function(radio) {
        for (var i = 0; i < 3; i++) {
            if (radio[i].checked) {
                debugger
                var cameraChoice = radio[i].value;
            }
            debugger
            const race = new Race(cameraChoice);
            race.start();
        }
    })

    startRace = startRace.bind(this);

    submit.addEventListener('click', startRace(radio));