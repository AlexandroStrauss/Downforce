import Race from "./race";

document.addEventListener('DOMContentLoaded', () => {
    var modal = document.getElementById('welcome'); 
    var intro = document.getElementById('intro-sheet')
    var instructions = document.getElementById('instructions')
    var raceSettings = document.getElementById('race-settings')
    var clickThrough = document.getElementById('click-through')
    var keepGoing = document.getElementById('continue')
    var submit = document.getElementById('submit')

    const startRace = function(modal1, modal2) {
        var cameraChoice = document.querySelector('input[name="cameraType"]:checked').value;
        var trackChoice = document.querySelector('input[name="trackChoice"]:checked').value;
        var carChoice = document.querySelector('input[name="carChoice"]:checked').value;
        modal1.style.display = 'none';
        modal2.style.display = 'none';
        const race = new Race(cameraChoice, carChoice, trackChoice);
        race.start();
    }

    const closeModal = function(modal) {
        modal.style.display = 'none';
    }
    
    clickThrough.addEventListener('click', () => (closeModal(intro)))
    keepGoing.addEventListener('click', () => (closeModal(instructions)))
    submit.addEventListener('click', () => (startRace(raceSettings, modal)))
})