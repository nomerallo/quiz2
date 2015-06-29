//get login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sesiones/new', { errors:errors});
};

//post login

exports.create = function(req,res){

	var miLogin = req.body.nombre;
	var contraseña = req.body.password;

	var controladorUsuario = require('./usuario_controller');

	controladorUsuario.autenticar(miLogin,contraseña,function(miError,miUsuario){

		if(miError){
			req.session.errors = [{"message":'Se ha producido un error :' + miError}];
			res.redirect('/login');
			
		}else{
			req.session.usuario = {id:miUsuario.id,nombre:miUsuario.nombre};
			var accesoActual = new Date().getTime();
			req.session.ultimoAcceso = accesoActual;		
			res.redirect(req.session.redireccion.toString());//redireccion a la pagina previa al login	
		}
	});
};

exports.destroy = function(req,res){
	delete req.session.usuario;
	res.redirect(req.session.redireccion.toString());//redireccion a la pagina previa al login
};

exports.loginRequerido =  function(req,res,next){
	if(req.session.usuario){
		next();//paso al siguiente MW
	}else{
		res.redirect('/login');
	}
};