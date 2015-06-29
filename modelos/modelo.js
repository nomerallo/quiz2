var moduloPath = require('path');

//cargar modelo ORM
var moduloSequelize = require('sequelize');

//usar bbdd sqlite
var sequelize = new moduloSequelize(null,null,null,{dialect:"sqlite",storage:"quiz.sqlite"});

//importar la definicion de la tabla tablaquiz en quiz.js
var Quiz	= sequelize.import(moduloPath.join(__dirname,'mod_quiz'));//quiz.js
var Comment = sequelize.import(moduloPath.join(__dirname,'mod_comentarios'));//comentarios.js

Comment.belongsTo(Quiz);//indica que los comentarios pertenecen a las quizes y crea una FK en la tabla comentarios
Quiz.hasMany(Comment,{//indica que una quiz puede tener mas de un comentario.tb tenemos belongsToMany y hasOne
'constraints': true,//para el borrado en cascada
'onUpdate': 'cascade',
'onDelete': 'cascade',
'hooks': true
});

exports.Quiz	= Quiz;//exportar definicion de la tabla para que pueda ser exportada
exports.Comment = Comment;//exportar definicion de la tabla para que pueda ser exportada

sequelize.sync().then(

	function(){//crea e inicializa la tabla de preguntas

		Quiz.count().then(
			function(count){//da el numero de filas de la tabla
				if (count === 0){//la table se inicializa solo si esta vacia
					Quiz.create({pregunta:'Capital de Italia',respuesta:'Roma',tema:"otro"});
					Quiz.create({pregunta:'Capital de Portugal',respuesta:'Lisboa',tema:"otro"});
					Quiz.create({pregunta:'Capital de España',respuesta:'Madrid',tema:"otro"}).then(function(){console.log('BBDD inicializada');});
				}
			}
		);
	}
);