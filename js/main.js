import Race from "./race";

document.addEventListener('DOMContentLoaded', () => {
    var modal = document.getElementById('welcome'); 

    const startRace = (function(modal) {
        var cameraChoice = document.querySelector('input[name="cameraType"]:checked').value;
        modal.style.display = 'none';
        const race = new Race(cameraChoice);
        race.start();
    })

    document.onkeypress('enter', startRace(modal))
    // submit.addEventListener('click', startRace(modal));
})