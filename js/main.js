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
        const loading = document.getElementById('loading')
        loading.style.display = 'block';
        modal1.style.display = 'none';
        modal2.style.display = 'none';
        const race = new Race(cameraChoice, carChoice, trackChoice);
        race.start();
    }

    //DEVELOPMENT ONLY – if you want to add a new track, comment everything else out
    //and use this to get an overhead view with a free camera and need to click through the intro screens
        // modal.style.display = 'none';
        // intro.style.display = 'none';
        // instructions.style.display = 'none';
        // const race = new Race('birds-eye', 'kroger', 'Twisty');
        // race.start();

    const closeModal = function(modal) {
        modal.style.display = 'none';
    }
    
    clickThrough.addEventListener('click', () => (closeModal(intro)))
    keepGoing.addEventListener('click', () => (closeModal(instructions)))
    submit.addEventListener('click', () => (startRace(raceSettings, modal)))
})