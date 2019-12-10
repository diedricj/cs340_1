/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/
var PORT = process.env.PORT || 3196;
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/pokedex', require('./pokedex.js'));
app.use('/offer', require('./offer.js'));
app.use('/accept', require('./accept.js'));
app.use('/teams', require('./teams.js'));
app.use('/users', require('./users.js'));
app.use('/discord', require('./discord.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});
