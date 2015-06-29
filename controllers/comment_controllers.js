var modelo = require('../modelos/modelo.js');

exports.load = function(req, res, next,commentId) {
	modelo.Comment.find({
							where:{id:Number(commentId)}
					  	}).then(function(comentario){
		if (comentario){
			 req.comentario = comentario;
			 next();//para que continue el flujo
		}else{
			next (new Error('No existe el comentario solicitado:' +  comentario));
		}
	}).catch(function(error){next(error)});
};

exports.publish = function(req,res){
	req.comentario.publicado = true;
	req.comentario.save({fields:["publicado"]}).then(function (){//commit del objeto pero solo de los campos indicados.Evita sqlInyect
				res.redirect('/quizes/' + req.params.quizId);
			}).catch(function(error){next(error);});
};


//GET '/quizes/:quizId(\\d+)/comments/new'
exports.new = function(req, res) {
	res.render('comments/new', { quizId: req.params.quizId ,errors:[]});
};


//formulario de creacion de comentarios en BBDD.POST '/quizes/:quizId(\\d+)/comments'
exports.create = function(req, res,next) {

	var comentario = modelo.Comment.build({	texto:req.body.comment.texto,//build crea un objeto No persistente asociado a la tabla modelo.Quiz
											tablaQuizId:req.params.quizId});//Importante: el nombre de este campo corresponde a la foreingkey que autocrea el sequelize.
	
	comentario.validate().then(function(error){//validate es una funcion de secuelize

		if(error){
			res.render('comments/new',{quizId: req.params.quizId ,comment:comentario,errors:error.errors});
		}else{
			comentario.save().then(function (){//commit del objeto pero solo de los campos indicados.Evita sqlInyect
				res.redirect('/quizes/' + req.params.quizId);//redireccion a lista de preguntas con la nueva ya metida
			}).catch(function(error){next(error);});
		}
	});
};