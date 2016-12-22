var LCD = require('../lib/lcd.js');

var lcd = new LCD('/dev/i2c-1', 0x27);

lcd.createChar( 0,[ 0x1B,0x15,0x0E,0x1B,0x15,0x1B,0x15,0x0E] ).createChar( 1,[ 0x0C,0x12,0x12,0x0C,0x00,0x00,0x00,0x00] );

//lcd.print('Raspberry Pi '+String.fromCharCode(0)).setCursor(0,1).cursorUnder();

require('dns').lookup(require('os').hostname(), function(err, add, fam) {
  lcd.print("IP:"+add);
});

lcd.on('ready', function() {
  lcd.setCursor(16, 0);
  lcd.autoscroll();
  require('dns').lookup(require('os').hostname(), function(err, add, fam) {
    var text = "My IP Address is : " + add + " ** ";
    lcd.print(text);
  });
 
});
 
function print(str, pos) {
  pos = pos || 0;
 
  if (pos === str.length) {
    pos = 0;
  }
 
  lcd.print(str[pos]);
 
  setTimeout(function() {
    print(str, pos + 1);
  }, 300);
}
 
// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
  lcd.clear();
  lcd.close();
  process.exit();
});

