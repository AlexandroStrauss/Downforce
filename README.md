# Downforce

## Background and overview

Airplanes fly using a principle called lift. Their wings are shaped so that the pressure under the wing is higher than the pressure above it, generating an upward force. At high enough speeds, this actually lifts the plane off the ground. Flip an airplane wing upside down and you get the opposite effect, conveniently called downforce. 

Not a lot of situations call for downforce, with one exception: racing. If you're racing any sort of vehicle, downforce is crucial, both for stabilizing your car and keeping it from taking flight at high speeds, and for increasing its cornering ability by forcing the tires into the ground. What this means, in practice, is that a car can very well be easier to drive at high speed than at lower speed, simply because more downforce makes it more stable. Adding to the nuance is that downforce increases as the square of velocity, so the benefits become larger the faster you go. 

This game uses a basic approximation of this in a time-trial setting. The faster you go, the better your car handles – but the smaller your reaction time. The goal is simply to make it around the track as fast as possible. Users control their car using the arrow keys: up to accelerate, down to brake, left and right to steer. The car has a downforce coefficient, increasing as the square of the velocity, that affects how well it corners. Scraping the walls costs you speed, and colliding with them at a sharp enough angle or with enough speed results in a race-ending crash. 

## Functionality and MVP

In Downforce, players will be able to: 

[ ] Control their car with the arrow keys, accelerating and turning it according to predetermined equations
[ ] Drive their car around a predetermined course, losing speed if they hit the walls
[ ] Balance speed and survival, as having more downforce makes it easier to turn
[ ] Hear engine sounds from their car and collision noises if they hit anything
[ ] See their lap times upon completing a lap
[ ] Choose between multiple courses of varying difficulty

In addition, this project will include: 

[ ] An Instructions modal explaining the controls and basic principle
[ ] A Details modal going into more depth about the physics

## Wireframes

The app will exist on a single screen, consisting almost entirely of the canvas. 

The bulk of the screen is taken up by the game itself. The game will be a classic top-down racer, with your goal being to keep your car (the red box) between the walls of the track (the black ribbon). The current and last lap times are displayed below, as is the car's current speed and its current downforce number. Beneath the canvas are the basic instructions and personal links. This is a crude visualization (wireframe.cc has its limits), but more complex tracks should also be possible. 

![alt text](https://github.com/AlexandroStrauss/Downforce/blob/master/downforce_wireframe.png?raw=true "Downforce Wireframe")

## Architecture and Technologies

This game will use the following technologies: 

* Vanilla Javascript will handle the game logic and physics calculations
* `HTML5 Canvas` will handle DOM manipulation and rendering
* * `three.js` will handle the 3D rendering
* * An initial candidate for a car model is [this](https://sketchfab.com/3d-models/2018-nascar-camaro-cb243928ff814a6e92bef555e95e7a21) from 3dautosports.com
* `Web Audio API` will handle sound
* Webpack will bundle and handle the scripts involved

In addition to the entry file, the game will use the following scripts: 

`car.js`: This will handle the physics for the car itself: updating the car's position and velocity in accordance with user inputs, as well as the underlying restrictions on the car's acceleration curve and downforce.

`track{TRACK_NUMBER}.js`: This will handle the layout, collision logic, and completion condition for each track in the app. I aim to have at least two or three to start. It may be that I'll need to bring in premade assets for the track as well as the cars, such that these files will handle only the collision logic and completion conditions. 

`timer.js`: Lightweight method for calculating the current time. 

`audio.js`: Handles audio for the app: primarily some sort of engine noise and collision noise. 

## Implementation timeline

### Day 1

[ ] Finish project proposal, create project repo
[ ] Read up to determine whether it truly is feasible to do this in 3D

### Day 2

[ ] Set up the basics of the project, with an entry file, `webpack.config.js`, and `package.json`
[ ] Begin with the car, implementing basic controls and physics and verifying they work as expected
[ ] If doing 3D, learn enough 'three.js' to implement the car, which shouldn't be hard
[ ] Begin working on the tracks. This will be the hardest part, most likely

### Day 3

[ ] Implement the tracks: lay out a simple one first, make sure its collision logic works as intended
[ ] Once track is basically functional, start working on a start/finish line for lap timing, a timer, and onscreen displays for speed and current downforce

### Day 4

[ ] Ensure that you can reset the car after a collision, and that the car is reset in the right place
[ ] Add more tracks once it's clear the logic works
[ ] Implement basic car/collision audio

### Day 

[ ] Style Canvas and rest of web page
[ ] If all else is done, begin implementing bonus features like multiple laps, different cars

## Bonus Features

Here are some ways in which this project could evolve further: 

[ ] Implement basic calculations for traction to more realistically model the point at which a car is pushed beyond its capabilities and loses grip
[ ] Implement a basic damage model, rather than simply ending the race if someone crashes; get to 100% damage and you're done
[ ] Implement multiple laps of races, which would also allow for pit stops, so that a player could stop and have their damage repaired at the cost of lap time
[ ] Save a ghost of a player's fastest lap as a reference point
[ ] Provide a global leaderboard of fastest times
[ ] Allow users to select or unlock other cars with different properties (better acceleration, higher top speeds, higher base downforce, etc.) 