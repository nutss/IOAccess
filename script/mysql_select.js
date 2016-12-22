var mysql = require('mysql');

var mysql_conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'tr2004',
    database: 'cardsystem'
});
console.log('start before mysql');
mysql_conn.query('SELECT * FROM Card ', function(err, rows) {
    if (err) {
        throw err;
    }
    for (id in rows) {
        console.log(rows[id]);
    }
}); 
console.log('end after mysql');