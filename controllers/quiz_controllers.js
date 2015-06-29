var modelo = require('../modelos/modelo.js');

//autoload - busca el id que se pide en  bbdd y si esta lo pasa al req.EOC error
exports.load = function(req, res, next,quizId) {
	modelo.Quiz.find({
						where:{id:Number(quizId)},
					  	include:[{model:modelo.Comment}]
					  }).then(function(miQuiz){
		if (miQuiz){
			 req.quiz = miQuiz;
			 next();//para que continue el flujo
		}else{
			next (new Error('No existe la pregunta solicitada:' +  quizId));
		}
	}).catch(function(error){next(error)});
};

//get /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz,errors:[]});
};


exports.index = function(req, res) {
	
	if (req.query.search){
		modelo.Quiz.findAll({where: ["pregunta like ?", '%' + req.query.search.split(' ').join('%') + '%']}).then(function(quizes){
				res.render('quizes/index', { quizes: quizes,errors:[]});
			}).catch(function(error){next(error)});
	}else{
		modelo.Quiz.findAll().then(function(quizes){
				res.render('quizes/index', { quizes: quizes.sort(function(a,b){ return a.pregunta.toLowerCase().localeCompare(b.pregunta.toLowerCase()); }),errors:[]});
			}).catch(function(error){next(error)});
	}
};

//get /quizes/:id/answer
exports.answer = function(req, res) {
	if (req.query.respuesta === req.quiz.respuesta){
		res.render('quizes/answer', { quiz: req.quiz,respuesta: 'Correcto',errors:[]});
	}else{
		res.render('quizes/answer', { quiz: req.quiz,respuesta: 'incorrecto',errors:[]});
	}
};


//formulario de creacion de preguntas
exports.new = function(req, res) {
	var miQuiz = modelo.Quiz.build({pregunta:"Pregunta",respuesta:"Respuesta",tema:"otro"});//crea unos valores genericos temporales.Solo se usa para pasar info
	res.render('quizes/new', { quiz: miQuiz ,errors:[]});
};


//accion de creacion de la pregunta en BBDD
exports.create = function(req, res) {

	var miQuiz = modelo.Quiz.build(req.body.quiz);//build crea un objeto No persistente asociado a la tabla modelo.Quiz
	
	miQuiz.validate().then(function(error){//validate es una funcion de secuelize

		if(error){
			res.render('quizes/new',{quiz:miQuiz,errors:error.errors});
		}else{
			miQuiz.save({fields:["pregunta","respuesta","tema"]}).then(function (){//commit del objeto pero solo de los campos indicados.Evita sqlInyect
				res.redirect('/quizes');//redireccion a lista de preguntas con la nueva ya metida
			});
		}
	});
};

//formulario de edicion de preguntas
exports.edit = function(req, res) {
	var miQuiz = req.quiz;
	res.render('quizes/edit', { quiz: miQuiz ,errors:[]});
};


//accion de actualizacion de la pregunta en BBDD tras su edicion
exports.update = function(req, res) {

	req.quiz.pregunta 	= req.body.quiz.pregunta;
	req.quiz.respuesta 	= req.body.quiz.respuesta;
	req.quiz.tema 		= req.body.quiz.tema;
	
	req.quiz.validate().then(function(error){//validate es una funcion de secuelize

		if(error){
			res.render('quizes/edit',{quiz:req.quiz,errors:error.errors});
		}else{
			req.quiz.save({fields:["pregunta","respuesta","tema"]}).then(function (){//commit del objeto pero solo de los campos indicados.Evita sqlInyect
				res.redirect('/quizes');//redireccion a lista de preguntas con la nueva ya metida
			});
		}
	});
};

//formulario de edicion de preguntas
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function (){//destruye el objeto en BD
		res.redirect('/quizes');//redireccion a lista de preguntas
	}).catch(function(error){next(error)});
};