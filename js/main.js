import Race from "./race";

document.addEventListener('DOMContentLoaded', () => {
    var modal = document.getElementById('welcome'); 
    var submit = document.getElementById('submit')

    const startRace = function(modal) {
        var cameraChoice = document.querySelector('input[name="cameraType"]:checked').value;
        modal.style.display = 'none';
        const race = new Race(cameraChoice);
        race.start();
    }

    submit.addEventListener('click', () => (startRace(modal)))
})