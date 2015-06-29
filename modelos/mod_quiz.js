module.exports = function(sequelize,DataTypes){

	return sequelize.define('tabla_quizzes',//sequelize a veces cambia este nombre de la tabla.Cosa de plurales.
							{
								pregunta:{
											type:DataTypes.STRING,
											validate:{notEmpty:{msg:"-> Falta Pregunta"}}
										},//validaciones para los valores del campo.hay muchas mas en sequelize
								respuesta:{
											type:DataTypes.STRING,
											validate:{notEmpty:{msg:"-> Falta Respuesta"}}
										},
								tema:{
											type:DataTypes.STRING,
											validate:{notEmpty:{msg:"-> Falta tema"}}
										}
							});
};