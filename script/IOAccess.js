
var serialport = require('serialport').SerialPort;
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
var SMARTCARD = [];
var port = new SerialPort('/dev/ttyUSB0', {
  baudrate: 115200,
  parser: parsers.readline('\r')
});

var app = require('http').createServer(handler),
  	io = require('socket.io').listen(app),
    fs = require('fs'),
	sys = require('util'),
	exec = require('child_process').exec,
	child;



var usbScanner = require('../lib/usbscanner').usbScanner;
var getDevices = require('../lib/usbscanner').getDevices;

var Decimal = require('decimal');

var dateFormat = require('dateformat');

var mysql = require('mysql');

var connectedHidDevices = getDevices();

if(connectedHidDevices.length > 0){  
	
	//console.log(connectedHidDevices)
	
	//initial custom scanner
	var scanner = new usbScanner({
	 	vendorId: 1155,
	 	hidMap: {
		 	4:  'A', 5:  'B',  6: 'C', 7:  'D', 8:  'E',
	 		9:  'F', 10: 'G', 11: 'H', 12: 'I', 13: 'J',
	 		14: 'K', 15: 'L', 16: 'M', 17: 'N', 18: 'O',
	 		19: 'P', 20: 'Q', 21: 'R', 22: 'S', 23: 'T',
	 		24: 'U', 25: 'V', 26: 'W', 27: 'X', 28: 'Y',
	 		29: 'Z', 30: '1', 31: '2', 32: '3', 33: '4',
	 		34: '5', 35: '6', 36: '7', 37: '8', 38: '9',
			39: '0', 44: ' ', 45: '-', 55: '.', 56: '/',
			85: '*', 87: '+',	 		
		 	// number key
	  		98: '0', 89: '1', 90: '2', 91: '3', 92: '4', 93: '5',
	 		94: '6', 95: '7', 96: '8', 97: '9', 86: '-', 99: '.',
	 		87: '+', 85: '*', 40: 'enter'
	 		},
	 	escapeChar:40
	 });
	 
	var keypad = new usbScanner({
	 	vendorId: 3727,
	 	hidMap: {
		 	// number key
	  		98: '0', 89: '1', 90: '2', 91: '3', 92: '4', 93: '5',
	 		94: '6', 95: '7', 96: '8', 97: '9', 86: '-', 99: '.',
	 		87: '+', 85: '*', 88: 'enter'
	 		},
	 	escapeChar:88
	 });	 
	 
 }

var LCD = require('../lib/lcd.js');
var lcd = new LCD('/dev/i2c-1', 0x27);

var GPIO = require('onoff').Gpio,
    ButtonGreenPort = new GPIO(22, 'in', 'both');
    ButtonYellowPort = new GPIO(27, 'in', 'both');



var sleep = require('sleep');
var trim = require('trim');

var stage_status = 0;	
var TemperaturePI = 0;

var db_host = "db1.in.tr";
var db_user = "root";
var db_password = "tr2004";
var db_name = "cardsystem";

var DOOR_ID="2";

var BARCODE_ID="";
var CONTACT_ID="";
var BUILD_ID="";
var FLOOR_ID="";
var CAR_TYPE="";
var CAR_ID="";


//Serial Port On Recieve Data
port.on('data',SmartCardRead);


//BarCodd Scanner and Keypad
if(connectedHidDevices.length > 0){ 
		
	/*
	scanner.on("data", function(code){
		  			
		  			lcd.clear();
		  		    lcd.setCursor(0,0).print("TYPE ID: OK");
		  			console.log(code);
		  			lcd.setCursor(0,1).print(code);
		  			
		  			
		console.log("scanner code : " + code);
	});
	*/
	
	
	/*keypad.on("data", function(code){

		  			lcd.clear();
		  		    lcd.setCursor(0,0).print("CAR ID: OK");
		  			console.log(code);
		  			lcd.setCursor(0,1).print(code);
		  					
		console.log("keypad code : " + code);
	});*/	

	
	scanner.on('data',BarCodeRead);
	keypad.on('data',KeyPadRead);

}



//Green Button (IN)
ButtonGreenPort.watch(function(err, state) {
  

  if(state == 1) {

    lcd.clear();
    lcd.setCursor(0,0).print("SMARTCARD ID: ?");
	stage_status = 2.1;
  }
  
});


//Yellow Button (OUT)
ButtonYellowPort.watch(function(err, state) {
  
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
	  
    lcd.clear();
    lcd.setCursor(0,0).print("CARD ID: ?");
    stage_status = 1.1;
    
  }
  
});






app.listen(8000);



function SmartCardRead(data) {

	if(stage_status == 2.1) {
		
	 	if (data != "REMOVE") {
	
			
			if (SMARTCARD.length > 8) {
				
				while(SMARTCARD.length > 0) {
					SMARTCARD.pop();
				}
				
				SMARTCARD.push(data);
			}
			else {
	
		  		
		  		if (SMARTCARD.length == 8) {
			  			
			  			lcd.clear();
			  		    lcd.setCursor(0,0).print("SMARTCARD ID: OK");
			  			lcd.setCursor(0,1).print(SMARTCARD[0]);

			  			
			  			sleep.sleep(1);
			  			lcd.clear();
			  			lcd.setCursor(0,0).print("BARCODE ID: ?  ");
			  			
					    stage_status = 2.2;
						//console.log(stage_status);		  			
	
		  		}
		  		
		  		SMARTCARD.push(data);
		  	}
	
		}
		
	}
}





function BarCodeRead(code) {
	
	if(stage_status == 2.2) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("BARCODE ID: OK");
		lcd.setCursor(0,1).print(code);
		
		//console.log(code);
		BARCODE_ID=code;
				
		sleep.sleep(1);
		lcd.clear();
		lcd.setCursor(0,0).print("CONTACT ID: ?  ");

	}
	
	if(stage_status == 2.3) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("CONTACT ID: OK");
		lcd.setCursor(0,1).print(code);

		//console.log(code);
		CONTACT_ID=code;		
		
		sleep.sleep(1);
		lcd.clear();
		lcd.setCursor(0,0).print("BUILD ID: ?  ");

	}
	
	
	if(stage_status == 2.4) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("BUILD ID: OK");
		lcd.setCursor(0,1).print(code);

		//console.log(code);
		BUILD_ID=code;		
		
		sleep.sleep(1);
		lcd.clear();
		lcd.setCursor(0,0).print("FLOOR ID: ?  ");

	}	

	if(stage_status == 2.5) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("FLOOR ID: OK");
		lcd.setCursor(0,1).print(code);
		
		//console.log(code);
		FLOOR_ID=code;
		
		sleep.sleep(1);
		lcd.clear();
		lcd.setCursor(0,0).print("CAR TYPE: ?  ");

	}


	if(stage_status == 2.6) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("CAR TYPE: OK");
		lcd.setCursor(0,1).print(code);
		
		//console.log(code);
		CAR_TYPE=code;
		
		
		if(code != "701") {
			
			sleep.sleep(1);
			lcd.clear();
			lcd.setCursor(0,0).print("CAR ID: ?  ");
			stage_status = 2.7;
		}
		else {
			
			CAR_ID="";
			stage_status = 0;
		}
		
		DataIN();

	}
	
		
	if ((stage_status >= 2.2) && (stage_status <= 2.5)) stage_status = Decimal(stage_status).add('0.1').toNumber();



	if(stage_status == 1.1) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("BARCODE ID: OK");
		lcd.setCursor(0,1).print(code);
		
		//console.log(code);
		BARCODE_ID=code;
		
		DataOUT();
		stage_status = 0;

	}





	//console.log(stage_status);

}


function KeyPadRead(code) {
	
	if(stage_status == 2.7) {	
				
		lcd.clear();
	    lcd.setCursor(0,0).print("CAR ID: OK");
		lcd.setCursor(0,1).print(code);

		//console.log(code);
		CAR_ID=code;
		
		sleep.sleep(1);
		lcd.clear();
				
		stage_status = 0;
		
	}
	
}

function DisplayScreen(){
	
	var ipaddress = require('child_process').execSync("ifconfig | grep inet | grep -v inet6 | awk '{gsub(/addr:/,\"\");print $2}'").toString().trim().split("\n");

	  //lcd.clear();
	  //lcd.setCursor(0,0).print(dateFormat(date,"dd/mm/yyyy HH:MM"));
	  //lcd.setCursor(0,1).print(dateFormat(Current_Date, "HH:MM:ss"));
	  
	  //console.log(stage_status);
	  
	if(stage_status == 0) {	  
		
	  var Current_Date = new Date().getTime();
	  child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
      var TemperaturePI = parseInt(stdout/1000);

		  lcd.setCursor(0,0).print(dateFormat(Current_Date, "dd/mm/yyyy HH:MM"));
		  lcd.setCursor(0,1).print(ipaddress[0]+" "+TemperaturePI+"C");
		  //console.log(stage_status);
	  
	  });
	 
	}

}



setInterval(DisplayScreen,1000);

function DataOUT(){

	
	var Current_Date = new Date().getTime();

	var connection = mysql.createConnection({
	  host: db_host,
	  user: db_user,
	  password: db_password,
	  database: db_name
	});
	


	connection.connect(function(err){
		
		var Entry  = {
		  exitDoor:DOOR_ID,
		  exitDate:dateFormat(Current_Date, "yyyy-mm-dd HH:MM:ss")

		};	    	

		connection.query('UPDATE Entry SET ? WHERE ?',[Entry,{barcodeId:BARCODE_ID}], function (err, result) {});	    

	
	}); 

	
}


function DataIN(){

	
	var Current_Date = new Date().getTime();

	var connection = mysql.createConnection({
	  host: db_host,
	  user: db_user,
	  password: db_password,
	  database: db_name
	});
	


	connection.connect(function(err){
		
		SQLCommand = "SELECT * FROM Card WHERE id = ?";
		connection.query(SQLCommand,SMARTCARD[0],function(err, rows) {
	      
	        if (rows.length == 0) {
	
				var Card  = {
				  id: SMARTCARD[0],
				  nameTh: SMARTCARD[2],
				  nameEn: SMARTCARD[3],
				  birthday: SMARTCARD[4],
				  address: SMARTCARD[5],
				  expiry: SMARTCARD[6],
				  registerAt: SMARTCARD[7],
				  createdTime: dateFormat(Current_Date, "yyyy-mm-dd HH:MM:SS"),
				  lastVisitTime:'0000-00-00 00:00:00'
				};				
				
				connection.query('INSERT INTO Card SET ?', Card, function (err, result) {});
			    
		    
		    }
	
	   	    
			var Entry  = {
			  barcodeId:BARCODE_ID,
			  cardId:SMARTCARD[0],
			  transportation:CAR_TYPE,
			  transportRegistration:CAR_ID,
			  contactType:CONTACT_ID,
			  building:BUILD_ID,
			  floor:FLOOR_ID,			  			  			  
			  entranceDoor:DOOR_ID,
			  entryDate:dateFormat(Current_Date, "yyyy-mm-dd HH:MM:ss")
	
			};	    	
	
			connection.query('INSERT INTO Entry SET ?', Entry, function (err, result) {});	    
		
		});
	
	}); 

	
}






// If all goes well when you open the browser, load the index.html file
function handler(req, res) {
    fs.readFile(__dirname+'/../template/index.html', function(err, data) {
        if (err) {
      // If no error, send an error message 500
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}
 


io.sockets.on('connection', function(socket) {
  setInterval(function(){
    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      // You must send time (X axis) and a temperature value (Y axis) 
      //var date = new Date().getTime();
	  var Current_Date = new Date().getTime();
      var TemperaturePI = parseFloat(stdout)/1000;
      
      socket.emit('temperatureUpdate', Current_Date, TemperaturePI); 
      //console.log(Current_Date);
      
    }
  });}, 5000);
});