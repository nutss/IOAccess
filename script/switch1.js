// button is attaced to pin 17, LED to 18
var GPIO = require('onoff').Gpio,
    ButtonGreenPort = new GPIO(22, 'in', 'both');
    ButtonYellowPort = new GPIO(27, 'in', 'both');

// pass the callback function to the
// as the first argument to watch() and define
// it all in one step
ButtonGreenPort.watch(function(err, state) {
  
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    console.log("Green_ON");
  } else {
    // turn LED off
    console.log("Green_OFF");
  }
  
});



ButtonYellowPort.watch(function(err, state) {
  
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    console.log("Yellow_ON");
  } else {
    // turn LED off
    console.log("Yellow_OFF");
  }
  
});