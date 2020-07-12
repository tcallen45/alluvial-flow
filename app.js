var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('', function(req, res){
    res.render('diagram', {passedData: data});
});
app.get('/info', function(req, res){
    res.render('dmas_info')
});
app.get('/downloadAll', function(req, res){
    res.download('./AllBudgets.xls', 'SankeyDataBudget.xls');
});
app.get('/downloadBreakdown', function(req, res){
    res.download('./dmas_expend_3ways.xls', 'Age_and_County_Breakdown.xls');
});
app.get('/ageBreakdown', function(req, res){
    res.render('breakdown_age');
});
app.get('/countyBreakdown', function(req, res){
    res.render('breakdown_county');
});

app.listen(3000);

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

var data = [];
client.connect()
.then(() => console.log("Connected Succesfully"))
.then(() => client.query('SELECT "From", "To", CAST("Value" AS DOUBLE PRECISION), "Webpage" FROM test'))
.then(results => {for(var i = 0; i < results.rowCount; i++){
    var row = results.rows[i];
    var from = row.From;
    var to = row.To;
    var value = parseInt(row.Value);
    var webpage = row.Webpage
    if(i == 0){
        from = "Assesments for Special Services";
        to = "Total Budget";
        value = 2360778362;
        url = ""
    }
    data.push([from, to, value, webpage]);
}})
.catch(e => console.log(e))
.finally(() => client.end())