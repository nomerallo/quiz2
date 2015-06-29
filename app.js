var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');//para enmascarar el method de un formulario y poder respetar mejor la filosofia rest
var sesiones = require('express-session');//para las sesiones
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// se cambia esto para que cuando se le pase en la url un parametro del tipo quiz[respuesta] por ejemplo,
// respete esta sintaxis de propiedad y cree en la url un  objeto llamado req.body.quiz con la propiedad respuesta
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('semilla cifrado cookie'));
app.use(sesiones());
app.use(methodOverride('_method'));//'_method' es el nombre del parametro que tiene que identficar para activarse

app.use(express.static(path.join(__dirname, 'public')));


//aqui se guarda la ruta de origen de la peticion de login/logout para devolver al usuario al sitio correcto despues de dicha accion
app.use(function( req, res, next) {
   if(!req.path.match(/\/login|\/logout/)){
        req.session.redireccion = req.path;
   }

   res.locals.session = req.session;//para hacer visible req.session en las vistas
   next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},errors:[]
    });
});


module.exports = app;
