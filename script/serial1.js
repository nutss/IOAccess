'use strict';
var serialport = require('serialport').SerialPort;
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
var SMARTCARD = [];
var port = new SerialPort('/dev/ttyUSB0', {
  baudrate: 115200,
  parser: parsers.readline('\r','UTF-8')
  //parser: parsers.raw
  
});




var b1 = new Buffer([0xe0,0xb8,0x81,0xe0,0xb8,0xb2,0xe0,0xb8])
  , b2 = new Buffer([0xa3,0xe0,0xb8,0x97,0xe0,0xb8,0x94,0xe0])
  , b3 = new Buffer([0xb8,0xaa,0xe0,0xb8,0xad,0xe0,0xb8,0x9a])
  
port.on('data',SmartCardRead);



function SmartCardRead(data) {

		
 	if (data != "REMOVE") {

		
		if (SMARTCARD.length > 8) {
			
			while(SMARTCARD.length > 0) {
				SMARTCARD.pop();
			}
			
			SMARTCARD.push(data);
		}
		else {

	  		
	  		if (SMARTCARD.length == 8) {
		  			
		  		console.log(SMARTCARD[0]);
		  		console.log(SMARTCARD[1]);
		  		console.log(SMARTCARD[2]);
		  		console.log(SMARTCARD[3]);
		  		console.log(SMARTCARD[4]);
		  		console.log(SMARTCARD[5]);
		  		console.log(SMARTCARD[6]);
		  		console.log(SMARTCARD[7]);
		  		
		
	  		}
	  		
	  		SMARTCARD.push(data);
	  	}

	}
		
}


/*function SmartCardRead(data) {
	
	
   var buff = new Buffer(data, 'utf8'); //no sure about this
   //console.log('data received: ' + buff.toString());
	//console.log(data.toString('utf-8'))

}	
*/	
	

/*		
	 	if (data != "REMOVE") {
	
			
			if (SMARTCARD.length > 8) {
				
				while(SMARTCARD.length > 0) {
					SMARTCARD.pop();
				}
				
				SMARTCARD.push(data);
			}
			else {
	
		  		
		  		if (SMARTCARD.length == 8) {
			  			
			
		  		}
		  		
		  		SMARTCARD.push(data);
		  	}
	
		  	var b4 = new Buffer(data)
		  	console.log(iconv.convert(b4).toString('utf-8'))
		}		
	
	//data = encoding.convert(data, 'CP874', 'UTF-8');
	//var b4 = new Buffer(data)
	//var ipaddress = require('child_process').execSync("python code.py "+ data);
	//jschardet.Constants._debug = true;
	//jschardet.Constants.MINIMUM_THRESHOLD = 0;

	//jschardet.detect(b4);
	

	//console.log(data);
	//console.log(encoding.convert(b4, 'TIS-620', 'UTF-8').toString('utf-8'));
	
	//console.log(b4);
	//console.log(b4)
}*/
	
console.log("OK");




